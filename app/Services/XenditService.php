<?php

namespace App\Services;

use App\Models\Subscription;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class XenditService
{
    protected string $secretKey;

    protected string $baseUrl = 'https://api.xendit.co';

    public function __construct()
    {
        $this->secretKey = trim((string) config('services.xendit.secret_key', ''));
    }

    /**
     * Create a Xendit Invoice for a seller subscription.
     *
     * @return array{id?: string, invoice_url?: string, status?: string, error?: string}
     */
    public function createInvoice(Subscription $subscription, User $user): array
    {
        $externalId = $subscription->xendit_external_id;

        $givenName = trim((string) ($user->first_name ?? 'Valued'));
        $surname = trim((string) ($user->last_name ?? 'Seller'));

        $payload = [
            'external_id' => $externalId,
            'amount' => (float) $subscription->amount,
            'payer_email' => $user->email,
            'description' => 'Yuta '.$subscription->plan_name.' - Monthly Seller Membership',
            'invoice_duration' => 86400,
            'success_redirect_url' => route('billing.index', ['payment' => 'success', 'external_id' => $externalId]),
            'failure_redirect_url' => route('billing.index', ['payment' => 'failed']),
            'currency' => $subscription->currency,
            'customer' => array_filter([
                'given_names' => $givenName,
                'surname' => $surname,
                'email' => $user->email,
            ]),
            'items' => [
                [
                    'name' => $subscription->plan_name,
                    'quantity' => 1,
                    'price' => (float) $subscription->amount,
                    'category' => 'Seller Subscription',
                ],
            ],
        ];

        // If secret key is missing, return mock invoice for local testing
        if (empty($this->secretKey)) {
            Log::warning('Xendit secret key is missing. Using mock checkout flow.');
            $mockInvoiceId = 'inv_demo_'.bin2hex(random_bytes(6));

            return [
                'id' => $mockInvoiceId,
                'invoice_url' => route('billing.index', ['payment' => 'success', 'external_id' => $externalId, 'mock' => '1']),
                'status' => 'PENDING',
            ];
        }

        try {
            $client = Http::timeout(10)->connectTimeout(5);

            if (app()->environment('local') || config('app.debug')) {
                $client = $client->withoutVerifying();
            }

            $response = $client->withBasicAuth($this->secretKey, '')
                ->post("{$this->baseUrl}/v2/invoices", $payload);

            if ($response->successful()) {
                return $response->json();
            }

            $statusCode = $response->status();
            $responseJson = $response->json();
            $errorMessage = $responseJson['message'] ?? 'Failed to create Xendit invoice.';
            $errorCode = $responseJson['error_code'] ?? '';

            Log::error('Xendit Invoice Creation Failed', [
                'status' => $statusCode,
                'error_code' => $errorCode,
                'message' => $errorMessage,
                'body' => $response->body(),
            ]);

            if ($statusCode === 403 || $errorCode === 'REQUEST_FORBIDDEN_ERROR') {
                return [
                    'error' => 'Xendit API Key Error: Your API key does not have write permissions for "Invoices". Please edit your secret key in the Xendit Dashboard (Developers > API Keys) and enable Write permission for Invoices.',
                ];
            }

            if ($statusCode === 401) {
                return [
                    'error' => 'Xendit API Key Error: Invalid Secret Key. Please verify XENDIT_SECRET_KEY in your .env file.',
                ];
            }

            return [
                'error' => "Xendit Error: {$errorMessage}",
            ];
        } catch (\Throwable $e) {
            Log::error('Xendit Exception: '.$e->getMessage());

            return [
                'error' => 'Unable to connect to Xendit payment server: '.$e->getMessage(),
            ];
        }
    }

    /**
     * Create a Xendit Invoice for a property transaction.
     *
     * @return array{id?: string, invoice_url?: string, status?: string, error?: string}
     */
    public function createTransactionInvoice(Transaction $transaction, User $payer): array
    {
        $externalId = $transaction->xendit_external_id ?: 'txn_'.Str::uuid();
        $transaction->update(['xendit_external_id' => $externalId]);

        $givenName = trim((string) ($payer->first_name ?? 'Valued'));
        $surname = trim((string) ($payer->last_name ?? 'Buyer'));

        $payload = [
            'external_id' => $externalId,
            'amount' => (float) $transaction->amount,
            'payer_email' => $payer->email,
            'description' => 'Yuta Property Payment: '.$transaction->title.' (#'.$transaction->transaction_number.')',
            'invoice_duration' => 86400 * 3, // 3 days for property deals
            'success_redirect_url' => route('transactions.show', ['transaction' => $transaction->id, 'payment' => 'success']),
            'failure_redirect_url' => route('transactions.show', ['transaction' => $transaction->id, 'payment' => 'failed']),
            'currency' => $transaction->currency ?: 'PHP',
            'customer' => array_filter([
                'given_names' => $givenName,
                'surname' => $surname,
                'email' => $payer->email,
            ]),
            'items' => [
                [
                    'name' => $transaction->title,
                    'quantity' => 1,
                    'price' => (float) $transaction->amount,
                    'category' => 'Property Transaction',
                ],
            ],
        ];

        // If secret key is missing, return mock invoice for local testing
        if (empty($this->secretKey)) {
            Log::warning('Xendit secret key is missing. Using mock checkout flow.');
            $mockInvoiceId = 'inv_demo_'.bin2hex(random_bytes(6));

            return [
                'id' => $mockInvoiceId,
                'invoice_url' => route('transactions.show', ['transaction' => $transaction->id, 'payment' => 'success', 'mock' => '1']),
                'status' => 'PENDING',
            ];
        }

        try {
            $client = Http::timeout(10)->connectTimeout(5);

            if (app()->environment('local') || config('app.debug')) {
                $client = $client->withoutVerifying();
            }

            $response = $client->withBasicAuth($this->secretKey, '')
                ->post("{$this->baseUrl}/v2/invoices", $payload);

            if ($response->successful()) {
                return $response->json();
            }

            $statusCode = $response->status();
            $responseJson = $response->json();
            $errorMessage = $responseJson['message'] ?? 'Failed to create Xendit invoice for transaction.';
            $errorCode = $responseJson['error_code'] ?? '';

            Log::error('Xendit Property Transaction Invoice Creation Failed', [
                'status' => $statusCode,
                'error_code' => $errorCode,
                'message' => $errorMessage,
                'body' => $response->body(),
            ]);

            return [
                'error' => "Xendit Error: {$errorMessage}",
            ];
        } catch (\Throwable $e) {
            Log::error('Xendit Transaction Exception: '.$e->getMessage());

            return [
                'error' => 'Unable to connect to Xendit payment server: '.$e->getMessage(),
            ];
        }
    }

    /**
     * Retrieve an invoice from Xendit by invoice ID.
     *
     * @return array<string, mixed>|null
     */
    public function getInvoice(string $invoiceId): ?array
    {
        if (empty($this->secretKey) || str_starts_with($invoiceId, 'inv_demo_')) {
            return [
                'id' => $invoiceId,
                'status' => 'PAID',
                'payment_method' => 'XENDIT_DEMO',
            ];
        }

        try {
            $client = Http::timeout(30);

            if (app()->environment('local') || config('app.debug')) {
                $client = $client->withoutVerifying();
            }

            $response = $client->withBasicAuth($this->secretKey, '')
                ->get("{$this->baseUrl}/v2/invoices/{$invoiceId}");

            if ($response->successful()) {
                return $response->json();
            }
        } catch (\Throwable $e) {
            Log::error('Xendit Get Invoice Exception: '.$e->getMessage());
        }

        return null;
    }
}
