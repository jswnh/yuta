<?php

use App\Http\Controllers\AgreementController;
use App\Http\Controllers\Auth\SocialiteController;
use App\Http\Controllers\BecomeSellerController;
use App\Http\Controllers\BillingController;
use App\Http\Controllers\InboxController;
use App\Http\Controllers\ListingController;
use App\Http\Controllers\ListingDetailController;
use App\Http\Controllers\ListingFavoriteController;
use App\Http\Controllers\MarketplaceController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\SellerDashboardController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\WelcomeController;
use App\Http\Controllers\XenditWebhookController;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Illuminate\Support\Facades\Route;

// Public Welcome & Marketplace Routes
Route::get('/', WelcomeController::class)->name('home');
Route::match(['get', 'post'], 'marketplace', [MarketplaceController::class, 'index'])->name('marketplace.index');
Route::post('marketplace/ai-search', [MarketplaceController::class, 'aiSearch'])->name('marketplace.ai-search');
Route::get('properties/{slug}', [ListingDetailController::class, 'show'])->name('listings.show');

// Authenticated User Routes (Buyer & General User Capabilities)
Route::middleware(['auth', 'verified'])->group(function () {
    // Seller Onboarding & Billing
    Route::post('become-seller', [BecomeSellerController::class, 'store'])->name('become-seller');
    Route::get('billing', [BillingController::class, 'index'])->name('billing.index');
    Route::post('billing/checkout', [BillingController::class, 'checkout'])->name('billing.checkout');
    Route::post('billing/cancel/{subscription}', [BillingController::class, 'cancel'])->name('billing.cancel');

    // Saved Listings / Favorites
    Route::get('favorites', [ListingFavoriteController::class, 'index'])->name('favorites.index');
    Route::post('properties/{listing}/favorite', [ListingFavoriteController::class, 'toggle'])->name('listings.favorite');

    // Inbox & Messaging
    Route::get('inbox', [InboxController::class, 'index'])->name('inbox.index');
    Route::post('inbox/{conversation}/messages', [InboxController::class, 'storeMessage'])->name('inbox.messages.store');
    Route::post('inbox/inquiries', [InboxController::class, 'startInquiry'])->name('inbox.inquiries.store');

    // Land & Property Agreements
    Route::get('agreements', [AgreementController::class, 'index'])->name('agreements.index');
    Route::post('agreements', [AgreementController::class, 'store'])->name('agreements.store');
    Route::get('agreements/{agreement}', [AgreementController::class, 'show'])->name('agreements.show');
    Route::post('agreements/{agreement}/accept', [AgreementController::class, 'accept'])->name('agreements.accept');
    Route::post('agreements/{agreement}/reject', [AgreementController::class, 'reject'])->name('agreements.reject');
    Route::post('agreements/{agreement}/cancel', [AgreementController::class, 'cancel'])->name('agreements.cancel');
    Route::post('agreements/{agreement}/complete', [AgreementController::class, 'complete'])->name('agreements.complete');

    // Land & Property Transactions
    Route::get('transactions', [TransactionController::class, 'index'])->name('transactions.index');
    Route::post('transactions', [TransactionController::class, 'store'])->name('transactions.store');
    Route::get('transactions/{transaction}', [TransactionController::class, 'show'])->name('transactions.show');
    Route::post('transactions/{transaction}/manual-confirm', [TransactionController::class, 'recordManualPayment'])->name('transactions.manual-confirm');

    // Notifications
    Route::get('notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::post('notifications/{id}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::post('notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('notifications.read-all');
});

// Authenticated Seller Routes
Route::middleware(['auth', 'verified', 'seller'])->group(function () {
    Route::get('dashboard', [SellerDashboardController::class, 'index'])->name('dashboard');
    Route::get('listings', [ListingController::class, 'index'])->name('listings.index');
    Route::get('listings/new', [ListingController::class, 'create'])->name('listings.new');
    Route::post('listings/draft', [ListingController::class, 'saveDraft'])->name('listings.draft');
    Route::post('listings', [ListingController::class, 'store'])->name('listings.store');
    Route::get('listings/{listing}/edit', [ListingController::class, 'edit'])->name('listings.edit');
    Route::post('listings/{listing}', [ListingController::class, 'update'])->name('listings.update');
    Route::patch('listings/{listing}/status', [ListingController::class, 'updateStatus'])->name('listings.status');
    Route::delete('listings/{listing}', [ListingController::class, 'destroy'])->name('listings.destroy');
});

// OAuth Socialite Callbacks
Route::get('/auth/{provider}/redirect', [SocialiteController::class, 'redirect'])
    ->name('socialite.redirect');

Route::get('/auth/{provider}/callback', [SocialiteController::class, 'callback'])
    ->name('socialite.callback');

// Xendit Webhooks for Subscriptions and Property Transactions
Route::post('webhooks/xendit', [XenditWebhookController::class, 'handleWebhook'])
    ->withoutMiddleware([PreventRequestForgery::class])
    ->name('webhooks.xendit');

require __DIR__.'/settings.php';
