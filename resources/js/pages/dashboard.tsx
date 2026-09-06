import { Head, Link } from '@inertiajs/react';
import type { SellerDashboardAnalytics } from '@/types/analytics';
import type { Agreement } from '@/types/agreement';
import type { Transaction } from '@/types/transaction';
import type { Listing } from '@/types/listing';
import { getListingImageUrl } from '@/lib/utils';
import { 
    Layers, 
    Eye, 
    Heart, 
    FileText, 
    ArrowUpRight, 
    Plus, 
    DollarSign, 
    CheckCircle2, 
    Clock, 
} from 'lucide-react';

interface DashboardProps {
    analytics: SellerDashboardAnalytics;
    recentAgreements?: Agreement[];
    recentTransactions?: Transaction[];
    topListings?: Listing[];
}

export default function Dashboard({
    analytics,
    recentAgreements = [],
    topListings = [],
}: DashboardProps) {
    const metrics = analytics?.listing_metrics || { total: 0, active: 0, sold: 0, draft: 0, pending: 0, archived: 0, featured: 0 };
    const engagement = analytics?.engagement_metrics || { total_views: 0, total_favorites: 0, total_inquiries: 0, most_viewed_listing: null, most_saved_listing: null };
    const deals = analytics?.deal_metrics || { active_agreements: 0, pending_agreements: 0, completed_transactions: 0, cancelled_transactions: 0, total_transaction_value: 0, pending_transaction_value: 0 };

    const formatPhp = (amount: number) => {
        return '₱' + Number(amount || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    };

    return (
        <>
            <Head title="Seller Dashboard" />

            <div className="flex flex-col gap-8 p-6">
                {/* TOP HEADER */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">Seller Analytics & Overview</h1>
                        <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1">
                            Live marketplace metrics and performance for your properties.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/listings/new"
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Create New Listing</span>
                        </Link>
                    </div>
                </div>

                {/* 4 PRIMARY METRIC CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                            <span className="text-xs font-semibold uppercase tracking-wider">Active Listings</span>
                            <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="flex items-baseline justify-between">
                            <span className="text-3xl font-black text-slate-900 dark:text-white">{metrics.active}</span>
                            <span className="text-xs text-slate-500">of {metrics.total} total</span>
                        </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                            <span className="text-xs font-semibold uppercase tracking-wider">Total Views</span>
                            <Eye className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                        </div>
                        <div className="flex items-baseline justify-between">
                            <span className="text-3xl font-black text-slate-900 dark:text-white">{engagement.total_views.toLocaleString()}</span>
                            <span className="text-xs text-slate-500">Impressions</span>
                        </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                            <span className="text-xs font-semibold uppercase tracking-wider">Saved / Favorites</span>
                            <Heart className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                        </div>
                        <div className="flex items-baseline justify-between">
                            <span className="text-3xl font-black text-slate-900 dark:text-white">{engagement.total_favorites.toLocaleString()}</span>
                            <span className="text-xs text-slate-500">Interested Buyers</span>
                        </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                            <span className="text-xs font-semibold uppercase tracking-wider">Closed Deal Value</span>
                            <DollarSign className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div className="flex items-baseline justify-between">
                            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{formatPhp(deals.total_transaction_value)}</span>
                            <span className="text-xs text-slate-500">{deals.completed_transactions} closed</span>
                        </div>
                    </div>
                </div>

                {/* DEAL PIPELINE HUD */}
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Deal & Agreement Pipeline</h2>
                            <p className="text-slate-600 dark:text-slate-400 text-xs mt-0.5">Summary of pending proposals and in-progress property transactions.</p>
                        </div>
                        <Link href="/agreements" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1">
                            <span>Manage Deals</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80">
                            <span className="text-slate-500 text-xs block mb-1">Pending Proposals</span>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-amber-500" />
                                <span className="text-xl font-black text-slate-900 dark:text-white">{deals.pending_agreements}</span>
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80">
                            <span className="text-slate-500 text-xs block mb-1">Active Agreements</span>
                            <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-teal-500" />
                                <span className="text-xl font-black text-slate-900 dark:text-white">{deals.active_agreements}</span>
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80">
                            <span className="text-slate-500 text-xs block mb-1">Completed Deals</span>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                <span className="text-xl font-black text-slate-900 dark:text-white">{deals.completed_transactions}</span>
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80">
                            <span className="text-slate-500 text-xs block mb-1">Pending Deal Value</span>
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-black text-amber-600 dark:text-amber-300">{formatPhp(deals.pending_transaction_value)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2-COL SECTION: TOP LISTINGS + RECENT AGREEMENTS */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* LEFT 6 COLS: TOP PERFORMING LISTINGS */}
                    <div className="lg:col-span-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Top Performing Properties</h2>
                            <Link href="/listings" className="text-xs text-slate-500 dark:text-slate-400 hover:text-emerald-600">View All</Link>
                        </div>

                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden divide-y divide-slate-200 dark:divide-slate-800 shadow-sm">
                            {topListings.length > 0 ? (
                                topListings.map((listing) => (
                                    <div key={listing.listing_id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-950 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-800">
                                                <img
                                                    src={getListingImageUrl(listing)}
                                                    alt={listing.title}
                                                    onError={(e) => {
                                                        e.currentTarget.onerror = null;
                                                        e.currentTarget.src = '/images/aerial_land_plot.jpg';
                                                    }}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="min-w-0">
                                                <Link href={`/properties/${listing.slug}`} className="font-bold text-sm text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 truncate block">
                                                    {listing.title}
                                                </Link>
                                                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                                                    ₱{Number(listing.price).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 shrink-0">
                                            <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5 text-cyan-500" /> {listing.view_count || 0}</span>
                                            <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-rose-500" /> {listing.favorites_count || 0}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-slate-500 text-xs">
                                    <Layers className="w-8 h-8 text-slate-400 dark:text-slate-700 mx-auto mb-2" />
                                    No property listings published yet.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT 6 COLS: RECENT AGREEMENTS & TRANSACTIONS */}
                    <div className="lg:col-span-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Agreements & Deals</h2>
                            <Link href="/agreements" className="text-xs text-slate-500 dark:text-slate-400 hover:text-emerald-600">View All</Link>
                        </div>

                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden divide-y divide-slate-200 dark:divide-slate-800 shadow-sm">
                            {recentAgreements.length > 0 ? (
                                recentAgreements.map((agreement) => (
                                    <div key={agreement.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-xs text-slate-600 dark:text-slate-400 font-bold">{agreement.agreement_number}</span>
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                                    agreement.status === 'accepted' ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20' :
                                                    agreement.status === 'pending' || agreement.status === 'proposed' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' :
                                                    agreement.status === 'completed' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
                                                    'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                                }`}>
                                                    {agreement.status}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold truncate mt-0.5">
                                                {agreement.listing?.title || 'Property Deal'}
                                            </p>
                                        </div>

                                        <div className="text-right shrink-0">
                                            <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400 block">
                                                ₱{Number(agreement.agreed_price).toLocaleString()}
                                            </span>
                                            <Link href={`/agreements/${agreement.id}`} className="text-[11px] text-slate-500 dark:text-slate-400 hover:underline">
                                                View Deal
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-slate-500 text-xs">
                                    <FileText className="w-8 h-8 text-slate-400 dark:text-slate-700 mx-auto mb-2" />
                                    No active deal agreements yet.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        { title: 'Marketplace', href: '/' },
        { title: 'Seller Dashboard', href: '/dashboard' },
    ],
};
