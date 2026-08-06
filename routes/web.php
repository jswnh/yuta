<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::inertia('listings', 'listing/listings')->name('listings.index');
    Route::inertia('listings/new', 'listing/new')->name('listings.new');
});

require __DIR__.'/settings.php';
