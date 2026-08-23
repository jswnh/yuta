<?php

use App\Models\Listing;
use App\Models\Transaction;
use App\Models\User;

test('seller dashboard accurately computes inventory and deal pipeline telemetry', function () {
    $seller = User::factory()->create(['is_seller' => true]);
    $seller->subscriptions()->create([
        'xendit_external_id' => 'SUB-TEST-123',
        'plan_name' => 'Seller Monthly',
        'status' => 'active',
        'amount' => 500,
        'currency' => 'PHP',
        'starts_at' => now(),
        'ends_at' => now()->addMonth(),
    ]);
    $buyer = User::factory()->create();

    // 2 active listings, 1 sold listing
    Listing::factory()->count(2)->create([
        'seller_id' => $seller->user_id,
        'status' => 'active',
        'view_count' => 150,
    ]);

    $soldListing = Listing::factory()->create([
        'seller_id' => $seller->user_id,
        'status' => 'sold',
        'price' => 7500000,
        'view_count' => 500,
    ]);

    // 1 completed transaction
    Transaction::create([
        'transaction_number' => 'TXN-DASH01',
        'listing_id' => $soldListing->listing_id,
        'buyer_id' => $buyer->user_id,
        'seller_id' => $seller->user_id,
        'title' => 'Sold Lot Settlement',
        'amount' => 7500000,
        'currency' => 'PHP',
        'payment_method' => 'bank_transfer',
        'payment_status' => 'completed',
    ]);

    $response = $this->actingAs($seller)->get('/dashboard');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('dashboard')
        ->has('analytics.listing_metrics')
        ->has('analytics.deal_metrics')
        ->where('analytics.listing_metrics.active', 2)
        ->where('analytics.listing_metrics.sold', 1)
        ->where('analytics.deal_metrics.completed_transactions', 1)
        ->where('analytics.deal_metrics.total_transaction_value', 7500000)
    );
});
