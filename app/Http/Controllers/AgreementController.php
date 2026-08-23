<?php

namespace App\Http\Controllers;

use App\Models\Agreement;
use App\Models\Conversation;
use App\Models\Listing;
use App\Models\User;
use App\Notifications\MarketplaceNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AgreementController extends Controller
{
    /**
     * Display a list of user agreements (as Buyer or Seller).
     */
    public function index(Request $request): Response
    {
        $userId = $request->user()->user_id;

        $agreements = Agreement::with(['listing.images', 'buyer', 'seller'])
            ->where(function ($q) use ($userId) {
                $q->where('buyer_id', $userId)
                    ->orWhere('seller_id', $userId);
            })
            ->latest('created_at')
            ->paginate(10);

        return Inertia::render('agreements/index', [
            'agreements' => $agreements,
        ]);
    }

    /**
     * Propose a new Land & Property Agreement.
     */
    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'listing_id' => ['required', 'exists:listings,listing_id'],
            'agreed_price' => ['required', 'numeric', 'min:1'],
            'currency' => ['nullable', 'string', 'size:3'],
            'payment_type' => ['required', 'string', 'in:full_cash,bank_financing,installments,online_xendit,manual_transfer'],
            'down_payment' => ['nullable', 'numeric', 'min:0'],
            'installment_months' => ['nullable', 'integer', 'min:1', 'max:360'],
            'monthly_installment' => ['nullable', 'numeric', 'min:0'],
            'terms_and_conditions' => ['nullable', 'string', 'max:3000'],
            'special_provisions' => ['nullable', 'string', 'max:2000'],
            'target_closing_date' => ['nullable', 'date'],
        ]);

        $listing = Listing::where('listing_id', $validated['listing_id'])->firstOrFail();

        // Determine buyer and seller
        if ($user->user_id === $listing->seller_id) {
            return back()->with('error', 'You cannot propose an agreement on your own listing.');
        }

        $buyerId = $user->user_id;
        $sellerId = $listing->seller_id;

        // Find or create conversation for this agreement
        $conversation = Conversation::firstOrCreate([
            'listing_id' => $listing->listing_id,
            'buyer_id' => $buyerId,
            'seller_id' => $sellerId,
        ], [
            'subject' => 'Deal Inquiry: '.$listing->title,
            'last_message_at' => now(),
        ]);

        $agreementNumber = 'AGR-'.strtoupper(Str::random(8));

        $agreement = Agreement::create([
            'agreement_number' => $agreementNumber,
            'listing_id' => $listing->listing_id,
            'buyer_id' => $buyerId,
            'seller_id' => $sellerId,
            'conversation_id' => $conversation->id,
            'status' => 'proposed',
            'agreed_price' => $validated['agreed_price'],
            'currency' => $validated['currency'] ?? $listing->currency ?? 'PHP',
            'payment_type' => $validated['payment_type'],
            'down_payment' => $validated['down_payment'] ?? null,
            'installment_months' => $validated['installment_months'] ?? null,
            'monthly_installment' => $validated['monthly_installment'] ?? null,
            'terms_and_conditions' => $validated['terms_and_conditions'] ?? null,
            'special_provisions' => $validated['special_provisions'] ?? null,
            'target_closing_date' => $validated['target_closing_date'] ?? null,
            'proposed_by' => $user->user_id,
        ]);

        // Record initial timeline entry
        $agreement->timelines()->create([
            'user_id' => $user->user_id,
            'action' => 'Agreement Proposed',
            'description' => "Agreement {$agreementNumber} proposed with offer of ?".number_format($agreement->agreed_price, 2).'.',
        ]);

        // Notify the seller
        $seller = $listing->seller;
        if ($seller) {
            $seller->notify(new MarketplaceNotification([
                'title' => 'New Deal Agreement Proposed',
                'message' => "{$user->name} proposed an agreement for \"{$listing->title}\".",
                'type' => 'agreement',
                'link' => route('agreements.show', $agreement->id),
                'entity_id' => $agreement->id,
            ]));
        }

        return redirect()->route('agreements.show', $agreement->id)
            ->with('success', 'Agreement proposed successfully!');
    }

    /**
     * Display a specific agreement and its activity history.
     */
    public function show(Request $request, Agreement $agreement): Response
    {
        $user = $request->user();

        if ($agreement->buyer_id !== $user->user_id && $agreement->seller_id !== $user->user_id) {
            abort(403, 'Unauthorized access to agreement.');
        }

        $agreement->load([
            'listing.images',
            'buyer.sellerProfile',
            'seller.sellerProfile',
            'proposer',
            'timelines.user',
            'transactions',
        ]);

        $isBuyer = ($agreement->buyer_id === $user->user_id);
        $isSeller = ($agreement->seller_id === $user->user_id);

        return Inertia::render('agreements/show', [
            'agreement' => $agreement,
            'isBuyer' => $isBuyer,
            'isSeller' => $isSeller,
        ]);
    }

    /**
     * Accept a proposed agreement.
     */
    public function accept(Request $request, Agreement $agreement): RedirectResponse
    {
        $user = $request->user();

        if ($agreement->seller_id !== $user->user_id && $agreement->buyer_id !== $user->user_id) {
            abort(403);
        }

        if ($agreement->proposed_by === $user->user_id) {
            return back()->with('error', 'You cannot accept an agreement that you proposed yourself.');
        }

        $agreement->update([
            'status' => 'accepted',
            'accepted_at' => now(),
        ]);

        $agreement->timelines()->create([
            'user_id' => $user->user_id,
            'action' => 'Agreement Accepted',
            'description' => "Agreement {$agreement->agreement_number} accepted by {$user->name}. Deal is now Active.",
        ]);

        // Notify other party
        $recipientId = ($agreement->buyer_id === $user->user_id) ? $agreement->seller_id : $agreement->buyer_id;
        $recipient = User::find($recipientId);
        if ($recipient) {
            $recipient->notify(new MarketplaceNotification([
                'title' => 'Agreement Accepted!',
                'message' => "{$user->name} accepted agreement #{$agreement->agreement_number}.",
                'type' => 'agreement',
                'link' => route('agreements.show', $agreement->id),
                'entity_id' => $agreement->id,
            ]));
        }

        return back()->with('success', 'Agreement has been accepted! The deal is now active.');
    }

    /**
     * Reject a proposed agreement.
     */
    public function reject(Request $request, Agreement $agreement): RedirectResponse
    {
        $user = $request->user();

        if ($agreement->seller_id !== $user->user_id && $agreement->buyer_id !== $user->user_id) {
            abort(403);
        }

        $reason = $request->input('reason', 'Offer declined.');

        $agreement->update([
            'status' => 'rejected',
            'rejected_at' => now(),
            'rejection_reason' => $reason,
        ]);

        $agreement->timelines()->create([
            'user_id' => $user->user_id,
            'action' => 'Agreement Rejected',
            'description' => "Agreement rejected by {$user->name}. Reason: {$reason}",
        ]);

        $recipientId = ($agreement->buyer_id === $user->user_id) ? $agreement->seller_id : $agreement->buyer_id;
        $recipient = User::find($recipientId);
        if ($recipient) {
            $recipient->notify(new MarketplaceNotification([
                'title' => 'Agreement Declined',
                'message' => "{$user->name} declined agreement #{$agreement->agreement_number}.",
                'type' => 'agreement',
                'link' => route('agreements.show', $agreement->id),
                'entity_id' => $agreement->id,
            ]));
        }

        return back()->with('info', 'Agreement proposal was declined.');
    }

    /**
     * Cancel an active or pending agreement.
     */
    public function cancel(Request $request, Agreement $agreement): RedirectResponse
    {
        $user = $request->user();

        if ($agreement->seller_id !== $user->user_id && $agreement->buyer_id !== $user->user_id) {
            abort(403);
        }

        $reason = $request->input('reason', 'Agreement cancelled.');

        $agreement->update([
            'status' => 'cancelled',
            'cancelled_at' => now(),
            'rejection_reason' => $reason,
        ]);

        $agreement->timelines()->create([
            'user_id' => $user->user_id,
            'action' => 'Agreement Cancelled',
            'description' => "Agreement cancelled by {$user->name}. Note: {$reason}",
        ]);

        return back()->with('info', 'Agreement has been cancelled.');
    }

    /**
     * Mark an agreement as completed (property transferred / all terms fulfilled).
     */
    public function complete(Request $request, Agreement $agreement): RedirectResponse
    {
        $user = $request->user();

        if ($agreement->seller_id !== $user->user_id && $agreement->buyer_id !== $user->user_id) {
            abort(403);
        }

        $agreement->update([
            'status' => 'completed',
            'completed_at' => now(),
        ]);

        $agreement->timelines()->create([
            'user_id' => $user->user_id,
            'action' => 'Agreement Completed',
            'description' => "Deal completed successfully by {$user->name}.",
        ]);

        return back()->with('success', 'Agreement marked as completed!');
    }
}
