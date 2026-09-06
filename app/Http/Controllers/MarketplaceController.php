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

        $filters = array_filter($request->only([
            'search',
            'ai',
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
        ]), fn ($v) => $v !== null && $v !== '');

        return Inertia::render('marketplace/index', [
            'listings' => $listings,
            'filters' => (object) $filters,
        ]);
    }

    public function aiSearch(Request $request, PropertyAiSearchService $aiSearchService): JsonResponse
    {
        if (! $request->user()) {
            return response()->json([
                'message' => 'Authentication required to use AI property search.',
            ], 401);
        }

        $query = (string) $request->input('query', '');
        $result = $aiSearchService->search($query);

        return response()->json($result);
    }
}
