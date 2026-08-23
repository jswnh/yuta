<?php

use App\Models\Agreement;
use App\Models\Listing;
use App\Models\Transaction;
use App\Models\User;

test('buyer can initiate transaction for accepted agreement', function () {
    $seller = User::factory()->create();
    $buyer = User::factory()->create();
    $listing = Listing::factory()->create(['seller_id' => $seller->user_id]);

    $agreement = Agreement::create([
        'agreement_number' => 'AGR-2026-TX01',
        'listing_id' => $listing->listing_id,
        'buyer_id' => $buyer->user_id,
        'seller_id' => $seller->user_id,
        'status' => 'accepted',
        'agreed_price' => 5000000,
        'currency' => 'PHP',
        'payment_type' => 'full_cash',
        'proposed_by' => $buyer->user_id,
    ]);

    $response = $this->actingAs($buyer)->post('/transactions', [
        'agreement_id' => $agreement->id,
        'payment_method' => 'manual',
    ]);

    $response->assertRedirect();
    $transaction = Transaction::where('agreement_id', $agreement->id)->first();
    expect($transaction)->not->toBeNull();
    expect((int) $transaction->amount)->toBe(5000000);
});

test('seller can confirm manual offline payment', function () {
    $seller = User::factory()->create();
    $buyer = User::factory()->create();
    $listing = Listing::factory()->create(['seller_id' => $seller->user_id]);

    $agreement = Agreement::create([
        'agreement_number' => 'AGR-2026-TX02',
        'listing_id' => $listing->listing_id,
        'buyer_id' => $buyer->user_id,
        'seller_id' => $seller->user_id,
        'status' => 'accepted',
        'agreed_price' => 2000000,
        'currency' => 'PHP',
        'payment_type' => 'full_cash',
        'proposed_by' => $buyer->user_id,
    ]);

    $transaction = Transaction::create([
        'transaction_number' => 'TX-2026-TEST01',
        'agreement_id' => $agreement->id,
        'listing_id' => $listing->listing_id,
        'buyer_id' => $buyer->user_id,
        'seller_id' => $seller->user_id,
        'title' => 'Land Lot Settlement',
        'amount' => 2000000,
        'currency' => 'PHP',
        'payment_method' => 'manual',
        'payment_status' => 'pending',
    ]);

    $this->actingAs($seller)
        ->post("/transactions/{$transaction->id}/manual-confirm", [
            'reference_number' => 'BDO-CHECK-9988',
            'notes' => 'Received manager check.',
        ])
        ->assertRedirect();

    $fresh = $transaction->fresh();
    expect($fresh->payment_status)->toBe('completed');
    expect($fresh->reference_number)->toBe('BDO-CHECK-9988');
});
