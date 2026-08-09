<?php

use App\Http\Controllers\Auth\SocialiteController;
use App\Http\Controllers\BecomeSellerController;
use App\Http\Controllers\BillingController;
use App\Http\Controllers\XenditWebhookController;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('become-seller', [BecomeSellerController::class, 'store'])->name('become-seller');

    Route::get('billing', [BillingController::class, 'index'])->name('billing.index');
    Route::post('billing/checkout', [BillingController::class, 'checkout'])->name('billing.checkout');
    Route::post('billing/cancel/{subscription}', [BillingController::class, 'cancel'])->name('billing.cancel');
});

Route::middleware(['auth', 'verified', 'seller'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::inertia('listings', 'listing/listings')->name('listings.index');
    Route::inertia('listings/new', 'listing/new')->name('listings.new');
});

Route::get('/auth/{provider}/redirect', [SocialiteController::class, 'redirect'])
    ->name('socialite.redirect');

Route::get('/auth/{provider}/callback', [SocialiteController::class, 'callback'])
    ->name('socialite.callback');

Route::post('webhooks/xendit', [XenditWebhookController::class, 'handleWebhook'])
    ->withoutMiddleware([VerifyCsrfToken::class])
    ->name('webhooks.xendit');

require __DIR__.'/settings.php';
