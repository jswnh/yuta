<?php

namespace App\Http\Controllers;

use App\Models\Agreement;
use App\Models\Conversation;
use App\Models\Listing;
use App\Models\ListingFavorite;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SellerDashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $sellerId = $request->user()->user_id;

        // 1. Listing Metrics
        $listingsQuery = Listing::where('seller_id', $sellerId);
        $totalListings = (clone $listingsQuery)->count();
        $activeListings = (clone $listingsQuery)->where('status', 'active')->count();
        $draftListings = (clone $listingsQuery)->where('status', 'draft')->count();
        $pendingListings = (clone $listingsQuery)->where('status', 'pending_review')->count();
        $soldListings = (clone $listingsQuery)->where('status', 'sold')->count();
        $archivedListings = (clone $listingsQuery)->where('status', 'archived')->count();
        $featuredListings = (clone $listingsQuery)->where('is_featured', true)->count();

        // 2. Engagement Metrics
        $totalViews = (int) (clone $listingsQuery)->sum('view_count');
        $sellerListingIds = (clone $listingsQuery)->pluck('listing_id');
        $totalFavorites = ListingFavorite::whereIn('listing_id', $sellerListingIds)->count();
        $totalInquiries = Conversation::where('seller_id', $sellerId)->count();

        $mostViewedListing = (clone $listingsQuery)
            ->where('view_count', '>', 0)
            ->orderByDesc('view_count')
            ->first();

        $mostSavedListing = Listing::where('seller_id', $sellerId)
            ->withCount('favorites')
            ->has('favorites')
            ->orderByDesc('favorites_count')
            ->first();

        // 3. Deal & Transaction Metrics
        $activeAgreements = Agreement::where('seller_id', $sellerId)
            ->whereIn('status', ['accepted', 'active'])
            ->count();

        $pendingAgreements = Agreement::where('seller_id', $sellerId)
            ->whereIn('status', ['proposed', 'pending'])
            ->count();

        $completedTransactions = Transaction::where('seller_id', $sellerId)
            ->where('payment_status', 'completed')
            ->count();

        $cancelledTransactions = Transaction::where('seller_id', $sellerId)
            ->where('payment_status', 'cancelled')
            ->count();

        $totalTransactionValue = (float) Transaction::where('seller_id', $sellerId)
            ->where('payment_status', 'completed')
            ->sum('amount');

        $pendingTransactionValue = (float) Transaction::where('seller_id', $sellerId)
            ->where('payment_status', 'pending')
            ->sum('amount');

        // 4. Performance & Top Listings
        $topListings = Listing::where('seller_id', $sellerId)
            ->with(['images'])
            ->withCount('favorites')
            ->orderByDesc('view_count')
            ->orderByDesc('favorites_count')
            ->take(5)
            ->get();

        // Recent Agreements
        $recentAgreements = Agreement::with(['buyer', 'listing'])
            ->where('seller_id', $sellerId)
            ->latest('created_at')
            ->take(5)
            ->get();

        // Recent Transactions
        $recentTransactions = Transaction::with(['buyer', 'listing'])
            ->where('seller_id', $sellerId)
            ->latest('created_at')
            ->take(5)
            ->get();

        $analyticsPayload = [
            'listing_metrics' => [
                'total' => $totalListings,
                'active' => $activeListings,
                'draft' => $draftListings,
                'pending' => $pendingListings,
                'sold' => $soldListings,
                'archived' => $archivedListings,
                'featured' => $featuredListings,
            ],
            'engagement_metrics' => [
                'total_views' => $totalViews,
                'total_favorites' => $totalFavorites,
                'total_inquiries' => $totalInquiries,
                'most_viewed_listing' => $mostViewedListing ? [
                    'title' => $mostViewedListing->title,
                    'views' => $mostViewedListing->view_count,
                    'slug' => $mostViewedListing->slug,
                ] : null,
                'most_saved_listing' => $mostSavedListing ? [
                    'title' => $mostSavedListing->title,
                    'favorites' => $mostSavedListing->favorites_count,
                    'slug' => $mostSavedListing->slug,
                ] : null,
            ],
            'deal_metrics' => [
                'active_agreements' => $activeAgreements,
                'pending_agreements' => $pendingAgreements,
                'completed_transactions' => $completedTransactions,
                'cancelled_transactions' => $cancelledTransactions,
                'total_transaction_value' => $totalTransactionValue,
                'pending_transaction_value' => $pendingTransactionValue,
            ],
            'performance' => [
                'views_trend' => [],
                'recent_inquiries' => $totalInquiries,
                'top_listings' => $topListings,
            ],
        ];

        return Inertia::render('dashboard', [
            'analytics' => $analyticsPayload,
            'metrics' => $analyticsPayload,
            'recentAgreements' => $recentAgreements,
            'recentTransactions' => $recentTransactions,
            'topListings' => $topListings,
            'sellerProfile' => $request->user()->sellerProfile,
        ]);
    }
}
