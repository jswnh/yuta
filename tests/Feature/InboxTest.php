<?php

use App\Models\Conversation;
use App\Models\Listing;
use App\Models\Message;
use App\Models\User;

test('buyer can send an inquiry message to seller', function () {
    $seller = User::factory()->create();
    $buyer = User::factory()->create();
    $listing = Listing::factory()->create(['seller_id' => $seller->user_id]);

    $response = $this->actingAs($buyer)->post('/inbox/inquiries', [
        'listing_id' => $listing->listing_id,
        'message' => 'Is this property still available for viewing this weekend?',
    ]);

    $response->assertRedirect();
    $conversation = Conversation::where('listing_id', $listing->listing_id)
        ->where('buyer_id', $buyer->user_id)
        ->first();

    expect($conversation)->not->toBeNull();
    expect(Message::where('conversation_id', $conversation->id)->count())->toBe(1);
});

test('user can reply in active conversation thread', function () {
    $seller = User::factory()->create();
    $buyer = User::factory()->create();
    $listing = Listing::factory()->create(['seller_id' => $seller->user_id]);

    $conversation = Conversation::create([
        'listing_id' => $listing->listing_id,
        'buyer_id' => $buyer->user_id,
        'seller_id' => $seller->user_id,
        'subject' => 'Property Inquiry',
    ]);

    $response = $this->actingAs($seller)->post("/inbox/{$conversation->id}/messages", [
        'body' => 'Yes, Saturday at 10 AM works fine.',
    ]);

    $response->assertRedirect();
    expect(Message::where('conversation_id', $conversation->id)->count())->toBe(1);
});
