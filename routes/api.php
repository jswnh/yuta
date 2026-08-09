<?php
use App\Http\Controllers\Api\ListingController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PushSubscriptionController;


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/listing/create', [ListingController::class,'create'])->name('listing.create');
    Route::post('/push-subscriptions', [PushSubscriptionController::class, 'store']);
    Route::delete('/push-subscriptions', [PushSubscriptionController::class, 'destroy']);
});