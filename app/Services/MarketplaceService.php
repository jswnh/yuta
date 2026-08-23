<?php

namespace App\Services;

use App\Models\Agreement;
use App\Models\Listing;
use App\Models\SellerProfile;
use App\Models\Transaction;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MarketplaceService
{
    /**
     * Get the Primary Featured Listing according to the priority algorithm.
     * Priority 1: Admin Pinned active listing
     * Priority 2: Explicitly featured or most viewed active listing
     * Priority 3: Highest engagement active listing (favorites + inquiries)
     * Priority 4: Most recent active listing (auto-pinned if only 1 listing exists)
     */
    public function getPrimaryFeaturedListing(): ?Listing
    {
        $totalListings = Listing::whereIn('status', ['active', 'pending_review'])->count();

        // Priority 1 - Admin Pinned Listing
        $pinned = Listing::with(['images', 'seller.sellerProfile'])
            ->withCount('favorites')
            ->whereIn('status', ['active', 'pending_review'])
            ->where('is_pinned', true)
            ->orderByRaw("CASE WHEN status = 'active' THEN 0 ELSE 1 END")
            ->latest('published_at')
            ->latest('created_at')
            ->first();

        if ($pinned) {
            return $pinned;
        }

        // Priority 2 - Explicitly featured or Most Viewed Listing
        $mostViewed = Listing::with(['images', 'seller.sellerProfile'])
            ->withCount('favorites')
            ->whereIn('status', ['active', 'pending_review'])
            ->orderByRaw("CASE WHEN status = 'active' THEN 0 ELSE 1 END")
            ->orderByDesc('is_featured')
            ->orderByDesc('view_count')
            ->latest('published_at')
            ->latest('created_at')
            ->first();

        if ($mostViewed && ($mostViewed->is_featured || $mostViewed->view_count > 0)) {
            if ($totalListings <= 1) {
                $mostViewed->is_pinned = true;
                $mostViewed->is_featured = true;
            }

            return $mostViewed;
        }

        // Priority 3 - Trending / Engagement (Favorites + Inquiries)
        $mostEngaged = Listing::with(['images', 'seller.sellerProfile'])
            ->withCount('favorites')
            ->whereIn('status', ['active', 'pending_review'])
            ->orderByRaw("CASE WHEN status = 'active' THEN 0 ELSE 1 END")
            ->orderByDesc('favorites_count')
            ->latest('published_at')
            ->latest('created_at')
            ->first();

        if ($mostEngaged && $mostEngaged->favorites_count > 0) {
            if ($totalListings <= 1) {
                $mostEngaged->is_pinned = true;
                $mostEngaged->is_featured = true;
            }

            return $mostEngaged;
        }

        // Priority 4 - Most Recent Listing fallback
        $fallback = Listing::with(['images', 'seller.sellerProfile'])
            ->withCount('favorites')
            ->whereIn('status', ['active', 'pending_review'])
            ->orderByRaw("CASE WHEN status = 'active' THEN 0 ELSE 1 END")
            ->latest('published_at')
            ->latest('created_at')
            ->first();

        if ($fallback && $totalListings <= 1) {
            $fallback->is_pinned = true;
            $fallback->is_featured = true;
        }

        return $fallback;
    }

    /**
     * Get exactly 3 Secondary Featured Listings different from primary.
     *
     * @return Collection<int, Listing>
     */
    public function getSecondaryFeaturedListings(?string $excludeListingId = null): Collection
    {
        $query = Listing::with(['images', 'seller.sellerProfile'])
            ->withCount('favorites')
            ->whereIn('status', ['active', 'pending_review']);

        if ($excludeListingId) {
            $query->where('listing_id', '!=', $excludeListingId);
        }

        return $query
            ->orderByRaw("CASE WHEN status = 'active' THEN 0 ELSE 1 END")
            ->orderByDesc('is_pinned')
            ->orderByDesc('is_featured')
            ->orderByDesc('view_count')
            ->orderByDesc('favorites_count')
            ->latest('published_at')
            ->latest('created_at')
            ->take(3)
            ->get();
    }

    /**
     * Get Trending Listings using time-aware scoring.
     * Score = view_count * 1 + favorites_count * 3 + recency
     *
     * @return Collection<int, Listing>
     */
    public function getTrendingListings(int $limit = 6): Collection
    {
        return Listing::with(['images', 'seller.sellerProfile'])
            ->withCount('favorites')
            ->whereIn('status', ['active', 'pending_review'])
            ->orderByRaw("CASE WHEN status = 'active' THEN 0 ELSE 1 END")
            ->orderByDesc(DB::raw('(view_count + (SELECT COUNT(*) FROM listing_favorites WHERE listing_favorites.listing_id = listings.listing_id) * 3)'))
            ->latest('published_at')
            ->latest('created_at')
            ->take($limit)
            ->get();
    }

    /**
     * Get live marketplace analytics from the database.
     *
     * @return array{
     *     active_listings_count: int,
     *     verified_sellers_count: int,
     *     total_views_count: int,
     *     active_agreements_count: int,
     *     completed_transactions_count: int,
     *     total_transaction_value: float
     * }
     */
    public function getMarketplaceAnalytics(): array
    {
        $activeListingsCount = Listing::whereIn('status', ['active', 'pending_review'])->count();
        $verifiedSellersCount = SellerProfile::where('verification_status', 'verified')->count();
        $totalViewsCount = (int) Listing::whereIn('status', ['active', 'pending_review'])->sum('view_count');
        $activeAgreementsCount = Agreement::whereIn('status', ['accepted', 'active'])->count();
        $completedTransactionsCount = Transaction::where('payment_status', 'completed')->count();
        $totalTransactionValue = (float) Transaction::where('payment_status', 'completed')->sum('amount');

        return [
            'active_listings_count' => $activeListingsCount,
            'verified_sellers_count' => $verifiedSellersCount,
            'total_views_count' => $totalViewsCount,
            'active_agreements_count' => $activeAgreementsCount,
            'completed_transactions_count' => $completedTransactionsCount,
            'total_transaction_value' => $totalTransactionValue,
        ];
    }

    /**
     * Query marketplace listings with filters, sorting, and pagination.
     */
    public function getFilteredListings(Request $request, int $perPage = 12): LengthAwarePaginator
    {
        $query = Listing::with(['images', 'seller.sellerProfile'])
            ->withCount('favorites')
            ->whereIn('status', ['active', 'pending_review']);

        // Search text
        if ($search = $request->query('search')) {
            $query->where(function (Builder $q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('province', 'like', "%{$search}%")
                    ->orWhere('city_municipality', 'like', "%{$search}%")
                    ->orWhere('barangay', 'like', "%{$search}%");
            });
        }

        // Category
        if ($category = $request->query('category')) {
            if ($category !== 'all') {
                $query->where('listing_category', $category);
            }
        }

        // Land type
        if ($landType = $request->query('land_type')) {
            if ($landType !== 'all') {
                $query->where('land_type', $landType);
            }
        }

        // Seller type
        if ($sellerType = $request->query('seller_type')) {
            if ($sellerType !== 'all') {
                $query->where('seller_type', $sellerType);
            }
        }

        // Title status
        if ($titleStatus = $request->query('title_status')) {
            if ($titleStatus !== 'all') {
                $query->where('title_status', $titleStatus);
            }
        }

        // Province
        if ($province = $request->query('province')) {
            $query->where('province', 'like', "%{$province}%");
        }

        // Price range
        if ($minPrice = $request->query('min_price')) {
            $query->where('price', '>=', (float) $minPrice);
        }
        if ($maxPrice = $request->query('max_price')) {
            $query->where('price', '<=', (float) $maxPrice);
        }

        // Area range
        if ($minArea = $request->query('min_area')) {
            $query->where('area', '>=', (float) $minArea);
        }
        if ($maxArea = $request->query('max_area')) {
            $query->where('area', '<=', (float) $maxArea);
        }

        // Sorting
        $sort = $request->query('sort', 'newest');
        switch ($sort) {
            case 'price_asc':
                $query->orderBy('price', 'asc');
                break;
            case 'price_desc':
                $query->orderBy('price', 'desc');
                break;
            case 'most_viewed':
                $query->orderBy('view_count', 'desc');
                break;
            case 'area_desc':
                $query->orderBy('area', 'desc');
                break;
            case 'featured':
                $query->orderByDesc('is_pinned')->orderByDesc('is_featured')->latest('published_at')->latest('created_at');
                break;
            case 'newest':
            default:
                $query->orderByRaw("CASE WHEN status = 'active' THEN 0 ELSE 1 END")
                    ->latest('published_at')
                    ->latest('created_at');
                break;
        }

        return $query->paginate($perPage)->withQueryString();
    }
}
