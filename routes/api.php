<?php
use App\Http\Controllers\Api\ListingController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth','verified'])->group(function () {
    Route::get('/listing/create', [ListingController::class,'create'])->name('listing.create');
});