<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateListingRequest;
use App\Models\Listing;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;

class ListingController extends Controller
{
    public function create(CreateListingRequest $request): RedirectResponse 
    {
        $validated = $request->validated();

        $uniqueSlug = Str::slug($validated['title']) . '-' . Str::random(6);

        Listing::create([
            'seller_id' => $request->user()->user_id,
            'slug' => $uniqueSlug,
            'status' => 'pending_review',
            ...$validated,
        ]);

        return redirect()->route('dashboard')
            ->with('success', 'Land listing created successfully!');
    }
}
