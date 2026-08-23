import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import ListingCard from '@/components/listing-card';
import ListingMap from '@/components/map/listing-map';
import type { Listing } from '@/types/listing';
import { Search, ChevronLeft, ChevronRight, Store } from 'lucide-react';

interface MarketplaceIndexProps {
    listings: {
        data: Listing[];
        current_page: number;
        last_page: number;
        total: number;
        per_page: number;
    };
    filters?: Record<string, string | undefined>;
}

export default function MarketplaceIndex({ listings, filters = {} }: MarketplaceIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [landType, setLandType] = useState(filters.land_type || 'all');
    const [titleStatus, setTitleStatus] = useState(filters.title_status || 'all');
    const [sort, setSort] = useState(filters.sort || 'newest');
    const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
    const [selectedListingId, setSelectedListingId] = useState<string | null>(null);

    const applyFilters = (overrides: Record<string, string> = {}) => {
        const params: Record<string, string> = {
            search,
            land_type: landType === 'all' ? '' : landType,
            title_status: titleStatus === 'all' ? '' : titleStatus,
            sort,
            ...overrides,
        };
        const cleaned = Object.fromEntries(Object.entries(params).filter(([, v]) => Boolean(v)));
        router.get('/marketplace', cleaned, { preserveState: true, preserveScroll: true });
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
            <Head title="Property Marketplace" />

            <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/85 dark:bg-slate-950/85 border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <AppLogoIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                        <span className="font-black text-xl text-slate-900 dark:text-white">Yuta<span className="text-emerald-500">.</span></span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <Link href="/" className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Home</Link>
                        <Link href="/billing" className="px-3.5 py-1.5 rounded-full bg-emerald-600 dark:bg-emerald-500 text-white dark:text-slate-950 font-bold text-xs shadow-sm">Seller Portal</Link>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Property Marketplace</h1>
                        <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                            Explore {listings.total} verified real estate lots in the Philippines.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`px-4 py-2 rounded-full text-xs font-bold cursor-pointer transition-all ${
                                viewMode === 'grid' 
                                    ? 'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-slate-950 shadow-sm' 
                                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                            }`}
                        >
                            Grid View
                        </button>
                        <button
                            onClick={() => setViewMode('map')}
                            className={`px-4 py-2 rounded-full text-xs font-bold cursor-pointer transition-all ${
                                viewMode === 'map' 
                                    ? 'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-slate-950 shadow-sm' 
                                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                            }`}
                        >
                            Interactive Map
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* FILTERS SIDEBAR */}
                    <div className="lg:col-span-1 space-y-6 bg-white dark:bg-slate-900/60 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm h-fit">
                        <form onSubmit={(e) => { e.preventDefault(); applyFilters({ search }); }} className="relative">
                            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search location or title"
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl pl-9 pr-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </form>

                        <div>
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase block mb-2">Land Type</label>
                            <select
                                value={landType}
                                onChange={(e) => { setLandType(e.target.value); applyFilters({ land_type: e.target.value === 'all' ? '' : e.target.value }); }}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-3 py-2 text-sm text-slate-900 dark:text-white"
                            >
                                <option value="all">All Types</option>
                                <option value="residential">Residential</option>
                                <option value="agricultural">Agricultural / Farm</option>
                                <option value="commercial">Commercial</option>
                                <option value="industrial">Industrial</option>
                                <option value="raw_land">Raw Land</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase block mb-2">Title Status</label>
                            <select
                                value={titleStatus}
                                onChange={(e) => { setTitleStatus(e.target.value); applyFilters({ title_status: e.target.value === 'all' ? '' : e.target.value }); }}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-3 py-2 text-sm text-slate-900 dark:text-white"
                            >
                                <option value="all">All Titles</option>
                                <option value="clean_title">Clean Title (TCT)</option>
                                <option value="tax_declaration">Tax Declaration</option>
                                <option value="mother_title">Mother Title</option>
                                <option value="rights">Rights Only</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase block mb-2">Sort By</label>
                            <select
                                value={sort}
                                onChange={(e) => { setSort(e.target.value); applyFilters({ sort: e.target.value }); }}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-3 py-2 text-sm text-slate-900 dark:text-white"
                            >
                                <option value="newest">Newest Listings</option>
                                <option value="featured">Featured / Pinned</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                                <option value="most_viewed">Most Viewed</option>
                            </select>
                        </div>
                    </div>

                    {/* LISTINGS / MAP CONTENT */}
                    <div className="lg:col-span-3">
                        {viewMode === 'map' ? (
                            <ListingMap
                                listings={listings.data}
                                selectedListingId={selectedListingId}
                                onSelectListing={(id) => setSelectedListingId(id)}
                                height="600px"
                            />
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {listings.data.length > 0 ? (
                                    listings.data.map((item) => (
                                        <ListingCard
                                            key={item.listing_id}
                                            listing={item}
                                            isSelected={selectedListingId === item.listing_id}
                                            onHover={() => setSelectedListingId(item.listing_id)}
                                        />
                                    ))
                                ) : (
                                    <div className="col-span-full py-16 text-center rounded-3xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 shadow-sm">
                                        <Store className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-3" />
                                        <h4 className="text-lg font-bold text-slate-900 dark:text-white">No listings match your search</h4>
                                        <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Try changing or clearing your filters.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {listings.last_page > 1 && (
                            <div className="mt-10 flex items-center justify-center gap-2">
                                {listings.current_page > 1 && (
                                    <Link href={`/marketplace?page=${listings.current_page - 1}`} className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                                        <ChevronLeft className="w-4 h-4" />
                                    </Link>
                                )}
                                <span className="text-xs text-slate-500 dark:text-slate-400">Page {listings.current_page} of {listings.last_page}</span>
                                {listings.current_page < listings.last_page && (
                                    <Link href={`/marketplace?page=${listings.current_page + 1}`} className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                                        <ChevronRight className="w-4 h-4" />
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}