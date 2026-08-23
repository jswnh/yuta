<?php

namespace App\Http\Controllers;

use App\Models\Listing;
use App\Models\ListingFavorite;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ListingDetailController extends Controller
{
    public function show(Request $request, string $slug): Response
    {
        $listing = Listing::with([
            'images',
            'seller.sellerProfile',
        ])
            ->where('slug', $slug)
            ->firstOrFail();

        // Increment view count
        $listing->increment('view_count');

        $user = $request->user();
        $isFavorited = false;
        $isOwner = false;

        if ($user) {
            $isFavorited = ListingFavorite::where('user_id', $user->user_id)
                ->where('listing_id', $listing->listing_id)
                ->exists();

            $isOwner = ($user->user_id === $listing->seller_id);
        }

        // Fetch similar properties
        $similarListings = Listing::with(['images', 'seller.sellerProfile'])
            ->where('status', 'active')
            ->where('listing_id', '!=', $listing->listing_id)
            ->where(function ($query) use ($listing) {
                $query->where('province', $listing->province)
                    ->orWhere('land_type', $listing->land_type);
            })
            ->take(3)
            ->get();

        return Inertia::render('listing/show', [
            'listing' => $listing,
            'isFavorited' => $isFavorited,
            'isOwner' => $isOwner,
            'similarListings' => $similarListings,
        ]);
    }
}
