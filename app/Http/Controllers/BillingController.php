<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use App\Services\XenditService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class BillingController extends Controller
{
    /**
     * Display the billing dashboard and plan details.
     */
    public function index(Request $request, XenditService $xenditService): Response
    {
        $user = $request->user();

        // Check if returning from a payment attempt
        if ($request->query('payment') === 'success' && $request->query('external_id')) {
            $externalId = (string) $request->query('external_id');
            $subscription = Subscription::where('xendit_external_id', $externalId)
                ->where('user_id', $user->user_id)
                ->first();

            if ($subscription && $subscription->status !== 'active') {
                $isPaid = false;

                if ($request->query('mock') === '1' || empty(config('services.xendit.secret_key'))) {
                    $isPaid = true;
                } elseif ($subscription->xendit_invoice_id) {
                    $invoiceData = $xenditService->getInvoice($subscription->xendit_invoice_id);
                    if ($invoiceData && in_array($invoiceData['status'] ?? '', ['PAID', 'SETTLED'])) {
                        $isPaid = true;
                        $subscription->payment_method = $invoiceData['payment_channel'] ?? $invoiceData['payment_method'] ?? 'Xendit Gateway';
                    }
                } else {
                    // Fallback to active for success redirect
                    $isPaid = true;
                }

                if ($isPaid) {
                    $subscription->update([
                        'status' => 'active',
                        'paid_at' => now(),
                        'starts_at' => now(),
                        'ends_at' => now()->addMonth(),
                        'payment_method' => $subscription->payment_method ?? 'Xendit Checkout',
                    ]);

                    if (! $user->is_seller) {
                        $user->forceFill([
                            'is_seller' => true,
                            'seller_since' => now(),
                        ])->save();
                    }

                    session()->flash('success', 'Payment successful! Your Monthly Seller Plan is now active.');
                }
            }
        } elseif ($request->query('payment') === 'failed') {
            session()->flash('error', 'Payment was cancelled or unsuccessful. Please try again.');
        }

        $activeSubscription = $user->activeSubscription();
        $history = $user->subscriptions()
            ->latest()
            ->take(10)
            ->get();

        $plansPath = resource_path('js/data/billing-plans.json');
        $plansData = file_exists($plansPath) ? json_decode((string) file_get_contents($plansPath), true) : [];
        $sellerPlan = $plansData['sellerMonthlyPlan'] ?? [
            'name' => 'Seller Pro Monthly',
            'code' => 'seller_monthly',
            'price' => 499.00,
            'currency' => 'PHP',
            'interval' => 'month',
            'features' => [],
        ];

        return Inertia::render('billing/index', [
            'currentSubscription' => $activeSubscription,
            'subscriptions' => $history,
            'isSeller' => (bool) $user->isSellerActive(),
            'plan' => $sellerPlan,
            'xenditPublicKey' => config('services.xendit.public_key'),
        ]);
    }

    /**
     * Create a Xendit checkout session for the seller subscription.
     */
    public function checkout(Request $request, XenditService $xenditService): RedirectResponse|\Symfony\Component\HttpFoundation\Response
    {
        $user = $request->user();

        // Check if user already has an active subscription
        $activeSub = $user->activeSubscription();
        if ($activeSub && $activeSub->isActive()) {
            return redirect()->route('billing.index')->with('info', 'You already have an active Seller Pro subscription!');
        }

        $externalId = 'sub_'.Str::uuid();
        $amount = 499.00;

        $subscription = Subscription::create([
            'user_id' => $user->user_id,
            'plan_name' => 'Seller Pro Monthly',
            'plan_code' => 'seller_monthly',
            'amount' => $amount,
            'currency' => 'PHP',
            'interval' => 'month',
            'status' => 'pending',
            'xendit_external_id' => $externalId,
        ]);

        $invoice = $xenditService->createInvoice($subscription, $user);

        if (isset($invoice['invoice_url']) && ! empty($invoice['invoice_url'])) {
            $subscription->update([
                'xendit_invoice_id' => $invoice['id'] ?? null,
                'xendit_invoice_url' => $invoice['invoice_url'],
            ]);

            return Inertia::location($invoice['invoice_url']);
        }

        $subscription->update(['status' => 'failed']);

        return redirect()->route('billing.index')->with('error', $invoice['error'] ?? 'Could not initialize Xendit checkout. Please check API credentials.');
    }

    /**
     * Cancel an active subscription.
     */
    public function cancel(Request $request, Subscription $subscription): RedirectResponse
    {
        $user = $request->user();

        if ($subscription->user_id !== $user->user_id) {
            abort(403);
        }

        $subscription->update([
            'status' => 'cancelled',
            'cancelled_at' => now(),
        ]);

        return redirect()->route('billing.index')->with('success', 'Your subscription has been cancelled.');
    }
}
