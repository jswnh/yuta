<?php

namespace App\Http\Controllers;

use App\Services\MarketplaceService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WelcomeController extends Controller
{
    public function __invoke(Request $request, MarketplaceService $marketplaceService): Response
    {
        $primaryFeatured = $marketplaceService->getPrimaryFeaturedListing();
        $secondaryFeatured = $marketplaceService->getSecondaryFeaturedListings($primaryFeatured?->listing_id);
        $trendingListings = $marketplaceService->getTrendingListings(6);
        $analytics = $marketplaceService->getMarketplaceAnalytics();

        return Inertia::render('welcome', [
            'primaryFeatured' => $primaryFeatured,
            'secondaryFeatured' => $secondaryFeatured,
            'trendingListings' => $trendingListings,
            'analytics' => $analytics,
        ]);
    }
}
