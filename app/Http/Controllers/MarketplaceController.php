<?php

namespace App\Http\Controllers;

use App\Services\MarketplaceService;
use App\Services\PropertyAiSearchService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MarketplaceController extends Controller
{
    public function index(Request $request, MarketplaceService $marketplaceService): Response
    {
        $listings = $marketplaceService->getFilteredListings($request, 12);
        $featured = $marketplaceService->getPrimaryFeaturedListing();
        $analytics = $marketplaceService->getMarketplaceAnalytics();

        return Inertia::render('marketplace/index', [
            'listings' => $listings,
            'featured' => $featured,
            'analytics' => $analytics,
            'filters' => $request->only([
                'search',
                'category',
                'land_type',
                'seller_type',
                'title_status',
                'province',
                'min_price',
                'max_price',
                'min_area',
                'max_area',
                'sort',
            ]),
        ]);
    }

    public function aiSearch(Request $request, PropertyAiSearchService $aiSearchService): JsonResponse
    {
        $query = (string) $request->input('query', '');
        $result = $aiSearchService->search($query);

        return response()->json($result);
    }
}
