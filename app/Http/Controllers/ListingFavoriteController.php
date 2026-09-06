<?php

namespace App\Http\Controllers;

use App\Models\Listing;
use App\Models\ListingFavorite;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ListingFavoriteController extends Controller
{
    /**
     * Display user's saved/favorite listings.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $favorites = Listing::with(['images', 'seller.sellerProfile'])
            ->whereHas('favorites', function ($q) use ($user) {
                $q->where('user_id', $user->user_id);
            })
            ->latest('created_at')
            ->paginate(12);

        return Inertia::render('favorites/index', [
            'favorites' => $favorites,
        ]);
    }

    /**
     * Toggle favorite status for a listing.
     */
    public function toggle(Request $request, Listing $listing): JsonResponse|RedirectResponse
    {
        $user = $request->user();

        $favorite = ListingFavorite::where('user_id', $user->user_id)
            ->where('listing_id', $listing->listing_id)
            ->first();

        if ($favorite) {
            $favorite->delete();
            $isFavorited = false;
        } else {
            ListingFavorite::create([
                'user_id' => $user->user_id,
                'listing_id' => $listing->listing_id,
            ]);
            $isFavorited = true;
        }

        if ($request->wantsJson()) {
            return response()->json([
                'is_favorited' => $isFavorited,
                'favorites_count' => $listing->favorites()->count(),
            ]);
        }

        return back()->with('success', $isFavorited ? 'Property added to your saved listings!' : 'Property removed from saved listings.');
    }
}
