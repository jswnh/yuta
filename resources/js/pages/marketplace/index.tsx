import { useState, useEffect } from 'react';
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
import { Search, ChevronLeft, ChevronRight, Store, RotateCcw, Layers, Sparkles, Loader2, X, Bot, Tag, Lock } from 'lucide-react';

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

    // AI Search State
    const [aiQuery, setAiQuery] = useState(initialSearch);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiResults, setAiResults] = useState<Listing[] | null>(null);
    const [aiInterpretation, setAiInterpretation] = useState<string | null>(null);
    const [aiCriteria, setAiCriteria] = useState<Record<string, any> | null>(null);

    const handleAiSearch = async (queryText?: string) => {
        if (!auth?.user) {
            router.get('/login');
            return;
        }

        const q = (queryText !== undefined ? queryText : aiQuery).trim();
        if (!q) return;

        setAiLoading(true);
        setAiQuery(q);

        try {
            const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';
            const res = await fetch('/marketplace/ai-search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({ query: q }),
            });

            if (res.status === 401) {
                router.get('/login');
                return;
            }

            if (!res.ok) {
                throw new Error(`AI search failed: ${res.statusText}`);
            }

            const data = await res.json();
            setAiResults(data.listings ?? []);
            setAiInterpretation(data.interpretation ?? `Properties matching "${q}"`);
            setAiCriteria(data.criteria ?? null);
        } catch (err) {
            console.error('AI search error:', err);
            applyFilters({ search: q });
        } finally {
            setAiLoading(false);
        }
    };

    const clearAiSearch = () => {
        setAiResults(null);
        setAiInterpretation(null);
        setAiCriteria(null);
        setAiQuery('');
    };

    useEffect(() => {
        if (filters?.ai === '1' && initialSearch.trim()) {
            if (auth?.user) {
                handleAiSearch(initialSearch);
            } else {
                applyFilters({ search: initialSearch });
            }
        }
    }, []);

    const listData = listings?.data ?? [];
    const displayedListings = aiResults !== null ? aiResults : listData;
    const totalCount = listings?.total ?? listData.length;
    const displayedTotal = aiResults !== null ? aiResults.length : totalCount;
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
        clearAiSearch();
        router.get('/marketplace', {}, { preserveState: true, preserveScroll: true });
    };

    const hasActiveFilters = search !== '' || landType !== 'all' || titleStatus !== 'all' || sort !== 'newest' || aiResults !== null;

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
                            Explore {displayedTotal} verified real estate lots and properties in the Philippines.
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
                        {/* AI NATURAL LANGUAGE SEARCH BANNER (MEMBERS ONLY) OR GUEST NOTICE */}
                        {auth?.user ? (
                            <div className="mb-6 rounded-3xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-teal-950/40 border border-emerald-500/30 p-5 sm:p-6 shadow-xl relative overflow-hidden backdrop-blur-md">
                                {/* Ambient background glow */}
                                <div className="absolute -right-10 -top-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                                
                                <div className="relative z-10">
                                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
                                            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                                            <span>AI Property Finder</span>
                                        </div>
                                        <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                                            Powered by <span className="text-emerald-400 font-semibold">Laravel AI SDK</span>
                                        </span>
                                    </div>

                                    <form 
                                        onSubmit={(e) => { e.preventDefault(); handleAiSearch(); }} 
                                        className="flex flex-col sm:flex-row items-center gap-2 mb-3"
                                    >
                                        <div className="relative flex-1 w-full">
                                            <input
                                                type="text"
                                                value={aiQuery}
                                                onChange={(e) => setAiQuery(e.target.value)}
                                                placeholder="Ask in plain English: e.g. Farm lot under ₱5M with clean title in Batangas..."
                                                className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-emerald-400 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 transition-all"
                                            />
                                            {aiQuery && (
                                                <button
                                                    type="button"
                                                    onClick={clearAiSearch}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 cursor-pointer"
                                                    title="Clear AI search"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={aiLoading || !aiQuery.trim()}
                                            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 text-slate-950 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                                        >
                                            {aiLoading ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    <span>Analyzing...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Sparkles className="w-4 h-4" />
                                                    <span>Search with AI</span>
                                                </>
                                            )}
                                        </button>
                                    </form>

                                    {/* Quick Suggestion Chips */}
                                    <div className="flex flex-wrap items-center gap-1.5 text-xs">
                                        <span className="text-slate-400 text-[11px] font-medium mr-1">Suggested prompts:</span>
                                        {[
                                            'Farm lot under ₱5M with clean title',
                                            'Beachfront or coastal land',
                                            'Residential lot in Cavite or Rizal',
                                            'Commercial plot for warehouse',
                                        ].map((preset, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => {
                                                    setAiQuery(preset);
                                                    handleAiSearch(preset);
                                                }}
                                                className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 border border-white/10 hover:border-emerald-500/30 text-[11px] transition-colors cursor-pointer"
                                            >
                                                {preset}
                                            </button>
                                        ))}
                                    </div>

                                    {/* AI Interpretation Result Box */}
                                    {aiInterpretation && (
                                        <div className="mt-4 pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
                                            <div className="flex items-start sm:items-center gap-2 text-xs">
                                                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px] uppercase shrink-0">
                                                    AI Interpretation
                                                </span>
                                                <p className="text-slate-200 font-medium">
                                                    {aiInterpretation}
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={clearAiSearch}
                                                className="text-xs text-emerald-400 hover:underline font-semibold shrink-0 cursor-pointer"
                                            >
                                                Reset AI Filter ({aiResults?.length ?? 0} found)
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="mb-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 flex items-center justify-center shrink-0">
                                        <Sparkles className="w-4 h-4 text-emerald-500" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-slate-900 dark:text-white">AI Natural Language Search</span>
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                                <Lock className="w-2.5 h-2.5 text-slate-400" />
                                                Members Only
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                            Sign in to search properties with AI natural language queries. Guest browsing uses standard filters.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <Link
                                        href="/login"
                                        className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        Log In
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-xs"
                                    >
                                        Register
                                    </Link>
                                </div>
                            </div>
                        )}

                        {viewMode === 'map' ? (
                            <ListingMap
                                listings={displayedListings}
                                selectedListingId={selectedListingId}
                                onSelectListing={(id) => setSelectedListingId(id)}
                                height="600px"
                            />
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {displayedListings.length > 0 ? (
                                    displayedListings.map((item) => (
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
                                        {(hasActiveFilters || aiResults !== null) && (
                                            <button
                                                onClick={() => { resetFilters(); clearAiSearch(); }}
                                                className="mt-4 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-900 dark:text-white cursor-pointer"
                                            >
                                                Clear All Filters
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {aiResults === null && lastPage > 1 && (
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