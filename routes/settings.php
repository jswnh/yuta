<?php

use App\Http\Controllers\SellerDocumentController;
use App\Http\Controllers\SellerProfileController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\SecurityController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    Route::redirect('settings', '/settings/profile');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Seller Profile & Verification
    Route::get('settings/seller-profile', [SellerProfileController::class, 'edit'])->name('settings.seller-profile');
    Route::match(['put', 'patch'], 'settings/seller-profile', [SellerProfileController::class, 'update'])->name('settings.seller-profile.update');
    Route::post('settings/seller-profile/verify', [SellerProfileController::class, 'submitVerification'])->name('settings.seller-profile.verify');
    Route::post('settings/seller-documents', [SellerDocumentController::class, 'store'])->name('settings.seller-documents.store');
    Route::delete('settings/seller-documents/{document}', [SellerDocumentController::class, 'destroy'])->name('settings.seller-documents.destroy');

    Route::get('settings/security', [SecurityController::class, 'edit'])
        ->middleware('password.confirm.if_set')
        ->name('security.edit');

    Route::put('settings/password', [SecurityController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('user-password.update');

    Route::inertia('settings/appearance', 'settings/appearance')->name('appearance.edit');
});
