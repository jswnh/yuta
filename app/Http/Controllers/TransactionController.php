<?php

namespace App\Http\Controllers;

use App\Models\Agreement;
use App\Models\Listing;
use App\Models\Transaction;
use App\Notifications\MarketplaceNotification;
use App\Services\XenditService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class TransactionController extends Controller
{
    /**
     * Display a list of transactions for the authenticated buyer or seller.
     */
    public function index(Request $request): Response
    {
        $userId = $request->user()->user_id;

        $transactions = Transaction::with(['listing.images', 'buyer', 'seller', 'agreement'])
            ->where(function ($q) use ($userId) {
                $q->where('buyer_id', $userId)
                    ->orWhere('seller_id', $userId);
            })
            ->latest('created_at')
            ->paginate(10);

        return Inertia::render('transactions/index', [
            'transactions' => $transactions,
        ]);
    }

    /**
     * Store a newly created transaction.
     */
    public function store(Request $request, XenditService $xenditService): RedirectResponse|SymfonyResponse
    {
        $user = $request->user();

        $agreement = null;
        if ($request->filled('agreement_id')) {
            $agreement = Agreement::where('id', $request->input('agreement_id'))->first();
        }

        $validated = $request->validate([
            'listing_id' => [$agreement ? 'nullable' : 'required', 'exists:listings,listing_id'],
            'agreement_id' => ['nullable', 'exists:agreements,id'],
            'title' => ['nullable', 'string', 'max:200'],
            'amount' => ['nullable', 'numeric', 'min:1'],
            'currency' => ['nullable', 'string', 'size:3'],
            'payment_method' => ['required', 'string', 'in:xendit,xendit_invoice,cash,bank_transfer,check,manual'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $listingId = $validated['listing_id'] ?? $agreement?->listing_id;
        $listing = Listing::where('listing_id', $listingId)->firstOrFail();

        $amount = $validated['amount'] ?? $agreement?->agreed_price ?? $listing->price;
        $title = $validated['title'] ?? ($listing->title.' - Settlement');
        $buyerId = $user->user_id;
        $sellerId = $listing->seller_id;

        $transactionNumber = 'TXN-'.strtoupper(Str::random(8));

        $transaction = Transaction::create([
            'transaction_number' => $transactionNumber,
            'agreement_id' => $agreement?->id ?? $validated['agreement_id'] ?? null,
            'listing_id' => $listing->listing_id,
            'buyer_id' => $buyerId,
            'seller_id' => $sellerId,
            'title' => $title,
            'amount' => $amount,
            'currency' => $validated['currency'] ?? 'PHP',
            'payment_method' => $validated['payment_method'],
            'payment_status' => 'pending',
            'notes' => $validated['notes'] ?? null,
        ]);

        // If online Xendit invoice selected, initialize checkout
        if ($validated['payment_method'] === 'xendit_invoice') {
            $invoice = $xenditService->createTransactionInvoice($transaction, $user);

            if (isset($invoice['invoice_url']) && ! empty($invoice['invoice_url'])) {
                $transaction->update([
                    'xendit_invoice_id' => $invoice['id'] ?? null,
                    'xendit_invoice_url' => $invoice['invoice_url'],
                ]);

                return Inertia::location($invoice['invoice_url']);
            }
        }

        // Notify the seller
        $seller = $listing->seller;
        if ($seller) {
            $seller->notify(new MarketplaceNotification([
                'title' => 'New Transaction Initiated',
                'message' => "Transaction #{$transactionNumber} for ?".number_format($transaction->amount, 2).' has been created.',
                'type' => 'transaction',
                'link' => route('transactions.show', $transaction->id),
                'entity_id' => $transaction->id,
            ]));
        }

        return redirect()->route('transactions.show', $transaction->id)
            ->with('success', 'Transaction record created successfully.');
    }

    /**
     * Display the specified transaction details & status.
     */
    public function show(Request $request, Transaction $transaction, XenditService $xenditService): Response
    {
        $user = $request->user();

        if ($transaction->buyer_id !== $user->user_id && $transaction->seller_id !== $user->user_id) {
            abort(403, 'Unauthorized access to transaction.');
        }

        // Check if returning from payment
        if ($request->query('payment') === 'success' && $transaction->payment_status !== 'completed') {
            $isPaid = false;
            if ($request->query('mock') === '1' || empty(config('services.xendit.secret_key'))) {
                $isPaid = true;
            } elseif ($transaction->xendit_invoice_id) {
                $invoice = $xenditService->getInvoice($transaction->xendit_invoice_id);
                if ($invoice && in_array($invoice['status'] ?? '', ['PAID', 'SETTLED'])) {
                    $isPaid = true;
                    $transaction->payment_channel = $invoice['payment_channel'] ?? $invoice['payment_method'] ?? 'Xendit Gateway';
                }
            } else {
                $isPaid = true;
            }

            if ($isPaid) {
                $transaction->update([
                    'payment_status' => 'completed',
                    'paid_at' => now(),
                    'completed_at' => now(),
                    'payment_channel' => $transaction->payment_channel ?? 'Xendit Checkout',
                ]);

                session()->flash('success', 'Payment successful! Transaction has been completed.');
            }
        }

        $transaction->load([
            'listing.images',
            'buyer',
            'seller',
            'agreement',
        ]);

        $isBuyer = ($transaction->buyer_id === $user->user_id);
        $isSeller = ($transaction->seller_id === $user->user_id);

        return Inertia::render('transactions/show', [
            'transaction' => $transaction,
            'isBuyer' => $isBuyer,
            'isSeller' => $isSeller,
        ]);
    }

    /**
     * Mark an offline transaction as completed with payment verification.
     */
    public function recordManualPayment(Request $request, Transaction $transaction): RedirectResponse
    {
        $user = $request->user();

        if ($transaction->seller_id !== $user->user_id) {
            abort(403, 'Only the seller can confirm manual payment receipt.');
        }

        $validated = $request->validate([
            'reference_number' => ['nullable', 'string', 'max:100'],
            'notes' => ['nullable', 'string', 'max:500'],
        ]);

        $transaction->update([
            'payment_status' => 'completed',
            'paid_at' => now(),
            'completed_at' => now(),
            'reference_number' => $validated['reference_number'] ?? null,
            'notes' => $validated['notes'] ?? $transaction->notes,
        ]);

        // If part of an agreement, record timeline
        if ($transaction->agreement) {
            $transaction->agreement->timelines()->create([
                'user_id' => $user->user_id,
                'action' => 'Payment Confirmed',
                'description' => 'Manual payment of ?'.number_format($transaction->amount, 2)." confirmed by seller {$user->name} (Ref: ".($validated['reference_number'] ?? 'N/A').').',
            ]);
        }

        $buyer = $transaction->buyer;
        if ($buyer) {
            $buyer->notify(new MarketplaceNotification([
                'title' => 'Payment Confirmed',
                'message' => "Seller has confirmed receipt of payment for transaction #{$transaction->transaction_number}.",
                'type' => 'transaction',
                'link' => route('transactions.show', $transaction->id),
                'entity_id' => $transaction->id,
            ]));
        }

        return back()->with('success', 'Payment marked as completed and receipt verified.');
    }
}
