import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import ListingCard from '@/components/listing-card';
import ListingMap from '@/components/map/listing-map';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import type { Listing } from '@/types/listing';
import { Search, ChevronLeft, ChevronRight, Store, RotateCcw, Layers } from 'lucide-react';

interface MarketplaceIndexProps {
    listings?: {
        data: Listing[];
        current_page: number;
        last_page: number;
        total: number;
        per_page: number;
    };
    filters?: Record<string, string | undefined>;
}

export default function MarketplaceIndex({ listings, filters = {} }: MarketplaceIndexProps) {
    const { auth } = usePage().props as { auth?: { user?: any } };
    const getInitials = useInitials();

    const initialSearch = typeof filters?.search === 'string' ? filters.search : '';
    const initialLandType = typeof filters?.land_type === 'string' && filters.land_type ? filters.land_type : 'all';
    const initialTitleStatus = typeof filters?.title_status === 'string' && filters.title_status ? filters.title_status : 'all';
    const initialSort = typeof filters?.sort === 'string' && filters.sort ? filters.sort : 'newest';

    const [search, setSearch] = useState(initialSearch);
    const [landType, setLandType] = useState(initialLandType);
    const [titleStatus, setTitleStatus] = useState(initialTitleStatus);
    const [sort, setSort] = useState(initialSort);
    const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
    const [selectedListingId, setSelectedListingId] = useState<string | null>(null);

    const listData = listings?.data ?? [];
    const totalCount = listings?.total ?? listData.length;
    const currentPage = listings?.current_page ?? 1;
    const lastPage = listings?.last_page ?? 1;

    const applyFilters = (overrides: Record<string, string> = {}) => {
        const nextSearch = overrides.search !== undefined ? overrides.search : search;
        const nextLandType = overrides.land_type !== undefined ? overrides.land_type : landType;
        const nextTitleStatus = overrides.title_status !== undefined ? overrides.title_status : titleStatus;
        const nextSort = overrides.sort !== undefined ? overrides.sort : sort;

        const params: Record<string, string> = {
            search: nextSearch,
            land_type: nextLandType === 'all' ? '' : nextLandType,
            title_status: nextTitleStatus === 'all' ? '' : nextTitleStatus,
            sort: nextSort,
        };

        const cleaned = Object.fromEntries(Object.entries(params).filter(([, v]) => Boolean(v)));
        router.get('/marketplace', cleaned, { preserveState: true, preserveScroll: true });
    };

    const resetFilters = () => {
        setSearch('');
        setLandType('all');
        setTitleStatus('all');
        setSort('newest');
        router.get('/marketplace', {}, { preserveState: true, preserveScroll: true });
    };

    const hasActiveFilters = search !== '' || landType !== 'all' || titleStatus !== 'all' || sort !== 'newest';

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
            <Head title="Property Marketplace - Yuta" />

            <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/85 dark:bg-slate-950/85 border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="flex items-center gap-2">
                            <AppLogoIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                            <span className="font-black text-xl text-slate-900 dark:text-white">Yuta<span className="text-emerald-500">.</span></span>
                        </Link>
                        <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                            Marketplace
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href="/" className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                            Home
                        </Link>
                        
                        {auth?.user ? (
                            <div className="flex items-center gap-3">
                                {auth.user.is_seller ? (
                                    <Link 
                                        href="/dashboard" 
                                        className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-colors"
                                    >
                                        <Layers className="w-3.5 h-3.5" />
                                        Seller Dashboard
                                    </Link>
                                ) : (
                                    <Link 
                                        href="/billing" 
                                        className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-colors"
                                    >
                                        Become a Seller
                                    </Link>
                                )}

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="flex items-center gap-2 p-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer">
                                            <Avatar className="w-8 h-8 rounded-full">
                                                <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                                                <AvatarFallback className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                                                    {getInitials(auth.user.name ?? '')}
                                                </AvatarFallback>
                                            </Avatar>
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56 mt-2" align="end">
                                        <UserMenuContent user={auth.user} />
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link 
                                    href="/login" 
                                    className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                                >
                                    Log In
                                </Link>
                                <Link 
                                    href="/register" 
                                    className="px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-colors"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Property Marketplace</h1>
                        <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                            Explore {totalCount} verified real estate lots and properties in the Philippines.
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
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">Filters</span>
                            {hasActiveFilters && (
                                <button
                                    onClick={resetFilters}
                                    className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                                >
                                    <RotateCcw className="w-3 h-3" />
                                    Reset
                                </button>
                            )}
                        </div>

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
                                onChange={(e) => { 
                                    const val = e.target.value;
                                    setLandType(val); 
                                    applyFilters({ land_type: val === 'all' ? '' : val }); 
                                }}
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
                                onChange={(e) => { 
                                    const val = e.target.value;
                                    setTitleStatus(val); 
                                    applyFilters({ title_status: val === 'all' ? '' : val }); 
                                }}
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
                                onChange={(e) => { 
                                    const val = e.target.value;
                                    setSort(val); 
                                    applyFilters({ sort: val }); 
                                }}
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
                                listings={listData}
                                selectedListingId={selectedListingId}
                                onSelectListing={(id) => setSelectedListingId(id)}
                                height="600px"
                            />
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {listData.length > 0 ? (
                                    listData.map((item) => (
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
                                        {hasActiveFilters && (
                                            <button
                                                onClick={resetFilters}
                                                className="mt-4 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-900 dark:text-white cursor-pointer"
                                            >
                                                Clear All Filters
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {lastPage > 1 && (
                            <div className="mt-10 flex items-center justify-center gap-2">
                                {currentPage > 1 && (
                                    <Link href={`/marketplace?page=${currentPage - 1}`} className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                                        <ChevronLeft className="w-4 h-4" />
                                    </Link>
                                )}
                                <span className="text-xs text-slate-500 dark:text-slate-400">Page {currentPage} of {lastPage}</span>
                                {currentPage < lastPage && (
                                    <Link href={`/marketplace?page=${currentPage + 1}`} className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
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