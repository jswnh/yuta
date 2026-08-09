<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class XenditWebhookController extends Controller
{
    /**
     * Handle incoming webhooks from Xendit.
     */
    public function handleWebhook(Request $request): JsonResponse
    {
        // Validate Xendit Callback Token if configured
        $webhookToken = config('services.xendit.webhook_token');
        $incomingToken = $request->header('x-callback-token');

        if ($webhookToken && $incomingToken !== $webhookToken) {
            Log::warning('Xendit Webhook Token mismatch', [
                'expected' => $webhookToken,
                'received' => $incomingToken,
            ]);

            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $data = $request->all();
        Log::info('Xendit Webhook Received', $data);

        $externalId = $data['external_id'] ?? null;
        $invoiceId = $data['id'] ?? null;
        $status = strtoupper((string) ($data['status'] ?? ''));

        if (! $externalId && ! $invoiceId) {
            return response()->json(['error' => 'Missing identifiers'], 400);
        }

        $subscription = Subscription::where('xendit_external_id', $externalId)
            ->orWhere('xendit_invoice_id', $invoiceId)
            ->first();

        if (! $subscription) {
            Log::warning("Subscription not found for Xendit external_id: {$externalId}, invoice_id: {$invoiceId}");

            return response()->json(['message' => 'Subscription not found'], 404);
        }

        if (in_array($status, ['PAID', 'SETTLED'])) {
            $paymentMethod = $data['payment_channel'] ?? $data['payment_method'] ?? 'Xendit';

            $subscription->update([
                'status' => 'active',
                'payment_method' => $paymentMethod,
                'paid_at' => now(),
                'starts_at' => now(),
                'ends_at' => now()->addMonth(),
            ]);

            /** @var User|null $user */
            $user = User::find($subscription->user_id);
            if ($user && ! $user->is_seller) {
                $user->forceFill([
                    'is_seller' => true,
                    'seller_since' => now(),
                ])->save();
            }

            Log::info("Subscription {$subscription->id} activated for user {$subscription->user_id}");
        } elseif (in_array($status, ['EXPIRED', 'FAILED'])) {
            $subscription->update([
                'status' => strtolower($status),
            ]);
        }

        return response()->json([
            'status' => 'success',
            'subscription_status' => $subscription->status,
        ]);
    }
}
