<?php

use App\Models\User;
use App\Notifications\MarketplaceNotification;

test('user can view notifications and mark individual or all as read', function () {
    $user = User::factory()->create();

    $user->notify(new MarketplaceNotification([
        'title' => 'Offer Received',
        'message' => 'You received an agreement proposal.',
        'type' => 'agreement',
    ]));

    $user->notify(new MarketplaceNotification([
        'title' => 'Payment Cleared',
        'message' => 'Payment has settled.',
        'type' => 'transaction',
    ]));

    expect($user->unreadNotifications()->count())->toBe(2);

    $notification = $user->unreadNotifications()->first();

    $this->actingAs($user)
        ->post("/notifications/{$notification->id}/read")
        ->assertRedirect();

    expect($user->fresh()->unreadNotifications()->count())->toBe(1);

    $this->actingAs($user)
        ->post('/notifications/read-all')
        ->assertRedirect();

    expect($user->fresh()->unreadNotifications()->count())->toBe(0);
});
