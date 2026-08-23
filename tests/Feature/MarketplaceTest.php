<?php

use App\Models\Listing;
use App\Models\ListingFavorite;
use App\Models\User;

test('welcome landing page displays successfully with status 200', function () {
    $response = $this->get('/');

    $response->assertOk();
});

test('marketplace search directory renders with filters', function () {
    $response = $this->get('/marketplace?land_type=agricultural&sort=newest');

    $response->assertOk();
});

test('guest can view listing details and view count increments', function () {
    $seller = User::factory()->create();
    $listing = Listing::factory()->create([
        'seller_id' => $seller->user_id,
        'title' => 'Prime Beachfront Land In Siargao',
        'slug' => 'prime-beachfront-land-in-siargao',
        'status' => 'active',
        'view_count' => 5,
    ]);

    $response = $this->get("/properties/{$listing->slug}");

    $response->assertOk();
    expect($listing->fresh()->view_count)->toBe(6);
});

test('authenticated user can toggle listing favorite bookmark', function () {
    $user = User::factory()->create();
    $seller = User::factory()->create();
    $listing = Listing::factory()->create([
        'seller_id' => $seller->user_id,
        'status' => 'active',
    ]);

    $this->actingAs($user)
        ->post("/properties/{$listing->listing_id}/favorite")
        ->assertRedirect();

    expect(ListingFavorite::where('listing_id', $listing->listing_id)->count())->toBe(1);

    // Toggle off
    $this->actingAs($user)
        ->post("/properties/{$listing->listing_id}/favorite")
        ->assertRedirect();

    expect(ListingFavorite::where('listing_id', $listing->listing_id)->count())->toBe(0);
});
