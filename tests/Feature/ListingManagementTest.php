<?php

use App\Models\Listing;
use App\Models\User;

test('seller can view their listings management page', function () {
    $seller = User::factory()->create(['is_seller' => true]);
    $seller->subscriptions()->create([
        'xendit_external_id' => 'SUB-LISTINGS-01',
        'plan_name' => 'Seller Monthly',
        'status' => 'active',
        'amount' => 500,
        'currency' => 'PHP',
        'starts_at' => now(),
        'ends_at' => now()->addMonth(),
    ]);

    // Create listings for this seller
    Listing::factory()->count(3)->create([
        'seller_id' => $seller->user_id,
        'status' => 'active',
    ]);

    // Create listing for another seller
    $otherSeller = User::factory()->create(['is_seller' => true]);
    Listing::factory()->create([
        'seller_id' => $otherSeller->user_id,
        'title' => 'Other Seller Property',
    ]);

    $response = $this->actingAs($seller)->get('/listings');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('listing/listings')
        ->has('listings', 3)
    );
});

test('seller can update their listing status', function () {
    $seller = User::factory()->create(['is_seller' => true]);
    $seller->subscriptions()->create([
        'xendit_external_id' => 'SUB-LISTINGS-02',
        'plan_name' => 'Seller Monthly',
        'status' => 'active',
        'amount' => 500,
        'currency' => 'PHP',
        'starts_at' => now(),
        'ends_at' => now()->addMonth(),
    ]);

    $listing = Listing::factory()->create([
        'seller_id' => $seller->user_id,
        'status' => 'active',
    ]);

    $response = $this->actingAs($seller)->patch("/listings/{$listing->listing_id}/status", [
        'status' => 'under_contract',
    ]);

    $response->assertRedirect('/listings');
    $this->assertDatabaseHas('listings', [
        'listing_id' => $listing->listing_id,
        'status' => 'under_contract',
    ]);
});

test('seller can delete their listing', function () {
    $seller = User::factory()->create(['is_seller' => true]);
    $seller->subscriptions()->create([
        'xendit_external_id' => 'SUB-LISTINGS-03',
        'plan_name' => 'Seller Monthly',
        'status' => 'active',
        'amount' => 500,
        'currency' => 'PHP',
        'starts_at' => now(),
        'ends_at' => now()->addMonth(),
    ]);

    $listing = Listing::factory()->create([
        'seller_id' => $seller->user_id,
        'status' => 'active',
    ]);

    $response = $this->actingAs($seller)->delete("/listings/{$listing->listing_id}");

    $response->assertRedirect('/listings');
    $this->assertDatabaseMissing('listings', [
        'listing_id' => $listing->listing_id,
    ]);
});

test('unauthorized seller cannot delete another sellers listing', function () {
    $seller = User::factory()->create(['is_seller' => true]);
    $seller->subscriptions()->create([
        'xendit_external_id' => 'SUB-LISTINGS-04',
        'plan_name' => 'Seller Monthly',
        'status' => 'active',
        'amount' => 500,
        'currency' => 'PHP',
        'starts_at' => now(),
        'ends_at' => now()->addMonth(),
    ]);

    $otherSeller = User::factory()->create(['is_seller' => true]);
    $otherListing = Listing::factory()->create([
        'seller_id' => $otherSeller->user_id,
    ]);

    $response = $this->actingAs($seller)->delete("/listings/{$otherListing->listing_id}");

    $response->assertForbidden();
    $this->assertDatabaseHas('listings', [
        'listing_id' => $otherListing->listing_id,
    ]);
});
