<?php

use App\Models\Agreement;
use App\Models\Listing;
use App\Models\User;

test('buyer can propose an agreement for a listing', function () {
    $seller = User::factory()->create();
    $buyer = User::factory()->create();
    $listing = Listing::factory()->create([
        'seller_id' => $seller->user_id,
        'status' => 'active',
        'price' => 5000000,
    ]);

    $response = $this->actingAs($buyer)->post('/agreements', [
        'listing_id' => $listing->listing_id,
        'agreed_price' => 4800000,
        'payment_type' => 'full_cash',
        'special_terms' => 'Cash upon title deed handover and BIR CAR release.',
    ]);

    $response->assertRedirect();
    $agreement = Agreement::where('listing_id', $listing->listing_id)->first();
    expect($agreement)->not->toBeNull();
    expect((int) $agreement->agreed_price)->toBe(4800000);
    expect($agreement->status)->toBe('proposed');
});

test('seller can accept agreement proposed by buyer', function () {
    $seller = User::factory()->create();
    $buyer = User::factory()->create();
    $listing = Listing::factory()->create(['seller_id' => $seller->user_id]);

    $agreement = Agreement::create([
        'agreement_number' => 'AGR-2026-TEST01',
        'listing_id' => $listing->listing_id,
        'buyer_id' => $buyer->user_id,
        'seller_id' => $seller->user_id,
        'status' => 'pending',
        'agreed_price' => 3500000,
        'currency' => 'PHP',
        'payment_type' => 'full_cash',
        'proposed_by' => $buyer->user_id,
    ]);

    $this->actingAs($seller)
        ->post("/agreements/{$agreement->id}/accept")
        ->assertRedirect();

    expect($agreement->fresh()->status)->toBe('accepted');
});

test('participant can decline agreement with reason', function () {
    $seller = User::factory()->create();
    $buyer = User::factory()->create();
    $listing = Listing::factory()->create(['seller_id' => $seller->user_id]);

    $agreement = Agreement::create([
        'agreement_number' => 'AGR-2026-TEST02',
        'listing_id' => $listing->listing_id,
        'buyer_id' => $buyer->user_id,
        'seller_id' => $seller->user_id,
        'status' => 'pending',
        'agreed_price' => 3500000,
        'currency' => 'PHP',
        'payment_type' => 'full_cash',
        'proposed_by' => $buyer->user_id,
    ]);

    $this->actingAs($seller)
        ->post("/agreements/{$agreement->id}/reject", [
            'reason' => 'Price offer is below seller reserve floor.',
        ])
        ->assertRedirect();

    $fresh = $agreement->fresh();
    expect($fresh->status)->toBe('rejected');
    expect($fresh->rejection_reason)->toBe('Price offer is below seller reserve floor.');
});
