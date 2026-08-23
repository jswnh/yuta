export interface MarketplaceAnalytics {
    active_listings_count: number;
    verified_sellers_count: number;
    total_views_count: number;
    active_agreements_count: number;
    completed_transactions_count: number;
    total_transaction_value: number;
}

export interface SellerDashboardAnalytics {
    listing_metrics: {
        total: number;
        active: number;
        draft: number;
        pending: number;
        sold: number;
        archived: number;
        featured: number;
    };
    engagement_metrics: {
        total_views: number;
        total_favorites: number;
        total_inquiries: number;
        most_viewed_listing: { title: string; views: number; slug: string } | null;
        most_saved_listing: { title: string; favorites: number; slug: string } | null;
    };
    deal_metrics: {
        active_agreements: number;
        pending_agreements: number;
        completed_transactions: number;
        cancelled_transactions: number;
        total_transaction_value: number;
        pending_transaction_value: number;
    };
    performance: {
        views_trend: { date: string; views: number }[];
        recent_inquiries: number;
        top_listings: Array<{
            listing_id: string;
            title: string;
            price: number;
            view_count: number;
            favorites_count: number;
            status: string;
            slug: string;
        }>;
    };
}
