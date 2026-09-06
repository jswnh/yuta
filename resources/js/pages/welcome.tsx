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
import type { MarketplaceAnalytics } from '@/types/analytics';
import { 
    Layers, 
    ShieldCheck, 
    ArrowUpRight, 
    Plus, 
    MapPin, 
    Search, 
    Menu, 
    X, 
    Flame, 
    CreditCard, 
    Pin, 
    Store,
    CheckCircle2,
    FileCheck,
    MessageSquare,
    Sparkles,
    Building2,
    Lock
} from 'lucide-react';

interface WelcomeProps {
    primaryFeatured?: Listing | null;
    secondaryFeatured?: Listing[];
    trendingListings?: Listing[];
    analytics?: MarketplaceAnalytics;
}

export default function Welcome({
    primaryFeatured = null,
    secondaryFeatured = [],
    trendingListings = [],
    analytics = {
        active_listings_count: 0,
        verified_sellers_count: 0,
        total_views_count: 0,
        active_agreements_count: 0,
        completed_transactions_count: 0,
        total_transaction_value: 0,
    },
}: WelcomeProps) {
    const { auth } = usePage().props as { auth?: { user?: any } };
    const getInitials = useInitials();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
    const [searchQuery, setSearchQuery] = useState('');

    const handleBecomeSeller = () => {
        if (auth?.user) {
            if (auth.user.is_seller) {
                router.get('/dashboard');
            } else {
                router.get('/billing');
            }
        } else {
            router.get('/register');
        }
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/marketplace', { search: searchQuery });
    };

    const allDisplayListings: Listing[] = [
        ...(primaryFeatured ? [primaryFeatured] : []),
        ...secondaryFeatured,
        ...trendingListings,
    ].filter(
        (item, index, self) =>
            index === self.findIndex((t) => t.listing_id === item.listing_id)
    );

    const filteredListings = allDisplayListings.filter((listing) => {
        if (selectedCategory === 'all') return true;
        if (selectedCategory === 'land_lots') return listing.land_type === 'residential' || listing.land_type === 'raw_land';
        if (selectedCategory === 'house_and_lot') return listing.land_type === 'residential';
        if (selectedCategory === 'farm') return listing.land_type === 'agricultural';
        if (selectedCategory === 'commercial') return listing.land_type === 'commercial' || listing.land_type === 'industrial';
        return true;
    });

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-emerald-500 selection:text-white font-sans antialiased overflow-x-hidden">
            <Head title="Philippine Land & Property Marketplace">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700" rel="stylesheet" />
            </Head>

            {/* TOP NAVIGATION BAR */}
            <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/85 dark:bg-slate-950/85 border-b border-slate-200 dark:border-slate-800/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="flex items-center gap-2.5 group">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                                <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[14px] flex items-center justify-center">
                                    <AppLogoIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                </div>
                            </div>
                            <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                Yuta<span className="text-emerald-500">.</span>
                            </span>
                        </Link>
                        <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                            Land & Property Marketplace
                        </span>
                    </div>

                    <nav className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-900/60 p-1.5 rounded-full border border-slate-200 dark:border-slate-800">
                        <Link
                            href="/marketplace"
                            className="px-4 py-2 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800/80 transition-all flex items-center gap-1.5"
                        >
                            <Store className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            Browse Marketplace
                        </Link>
                        <a
                            href="#featured"
                            className="px-4 py-2 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800/80 transition-all flex items-center gap-1.5"
                        >
                            <Flame className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                            Featured Lots
                        </a>
                        <a
                            href="#why-yuta"
                            className="px-4 py-2 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800/80 transition-all flex items-center gap-1.5"
                        >
                            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            Why Yuta
                        </a>
                        <Link
                            href="/billing"
                            className="px-4 py-2 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800/80 transition-all flex items-center gap-1.5"
                        >
                            <CreditCard className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                            Seller Membership
                        </Link>
                    </nav>

                    <div className="flex items-center gap-3">
                        {auth?.user ? (
                            <div className="flex items-center gap-3">
                                {auth.user.is_seller ? (
                                    <Link
                                        href="/dashboard"
                                        className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
                                    >
                                        <Layers className="w-3.5 h-3.5" />
                                        Seller Dashboard
                                    </Link>
                                ) : (
                                    <button
                                        onClick={handleBecomeSeller}
                                        className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        Become a Seller
                                    </button>
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
                                    className="px-4 py-2 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                                >
                                    Log In
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}

                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {mobileMenuOpen && (
                    <div className="md:hidden px-4 pt-2 pb-6 bg-white/95 dark:bg-slate-950/95 border-b border-slate-200 dark:border-slate-800 space-y-3">
                        <Link
                            href="/marketplace"
                            className="block px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-sm font-semibold text-slate-900 dark:text-white"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Browse Marketplace
                        </Link>
                        <a
                            href="#why-yuta"
                            className="block px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-sm font-semibold text-slate-700 dark:text-slate-300"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Why Yuta
                        </a>
                        <Link
                            href="/billing"
                            className="block px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-sm font-semibold text-slate-700 dark:text-slate-300"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Seller Membership (₱500/mo)
                        </Link>
                    </div>
                )}
            </header>

            {/* HERO SECTION */}
            <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-3xl mx-auto space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold backdrop-blur-md">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                            <span>Philippines Premier Land & Property Marketplace</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                            Discover, Negotiate, & Transact{' '}
                            <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400 bg-clip-text text-transparent">
                                Verified Land & Lots
                            </span>
                        </h1>

                        <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
                            The transparent land marketplace with interactive GIS boundary mapping, automated deal agreements, and verified Philippine land titles.
                        </p>

                        {/* SEARCH BAR */}
                        <div className="pt-4 max-w-2xl mx-auto">
                            <form
                                onSubmit={handleSearchSubmit}
                                className="relative rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-2 sm:p-2.5 shadow-xl backdrop-blur-2xl transition-all focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="pl-3 text-emerald-600 dark:text-emerald-400 shrink-0">
                                        <Search className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search by city, province, or keywords (e.g. Cavite, Batangas farm, Cebu)..."
                                        className="w-full bg-transparent border-0 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs sm:text-sm focus:ring-0 focus:outline-none py-2"
                                    />
                                    <button
                                        type="submit"
                                        className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all shrink-0 flex items-center gap-2 cursor-pointer"
                                    >
                                        Search
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* LIVE HUD STATS */}
                    <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
                        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-sm backdrop-blur-xl">
                            <span className="text-slate-500 dark:text-slate-400 text-xs font-semibold block mb-1">Active Listings</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                                    {analytics.active_listings_count.toLocaleString()}
                                </span>
                                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">Live</span>
                            </div>
                        </div>

                        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-sm backdrop-blur-xl">
                            <span className="text-slate-500 dark:text-slate-400 text-xs font-semibold block mb-1">Verified Sellers</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                                    {analytics.verified_sellers_count.toLocaleString()}
                                </span>
                                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">Legit</span>
                            </div>
                        </div>

                        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-sm backdrop-blur-xl">
                            <span className="text-slate-500 dark:text-slate-400 text-xs font-semibold block mb-1">Completed Deals</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl sm:text-3xl font-black text-teal-600 dark:text-teal-400">
                                    {analytics.completed_transactions_count.toLocaleString()}
                                </span>
                                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">Closed</span>
                            </div>
                        </div>

                        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-sm backdrop-blur-xl">
                            <span className="text-slate-500 dark:text-slate-400 text-xs font-semibold block mb-1">Total Deal Value</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl sm:text-3xl font-black text-cyan-600 dark:text-cyan-400">
                                    ₱{analytics.total_transaction_value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURED PROPERTIES */}
            <section id="featured" className="py-16 bg-slate-100/60 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800/60">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                        <div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-bold uppercase tracking-wider mb-2">
                                <Flame className="w-3.5 h-3.5" />
                                Top Spotlight
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                                Featured Land & Property
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                                Priority algorithm: verified pins, views, and engagement.
                            </p>
                        </div>

                        <Link
                            href="/marketplace"
                            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 group"
                        >
                            <span>View All Marketplace Listings</span>
                            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </Link>
                    </div>

                    {primaryFeatured ? (
                        <div className="mb-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl grid lg:grid-cols-12 gap-0 group">
                            <div className="lg:col-span-7 relative h-72 lg:h-auto min-h-[340px] bg-slate-100 dark:bg-slate-950 overflow-hidden">
                                <img
                                    src={
                                        primaryFeatured.images?.[0]?.url || 
                                        (primaryFeatured.images?.[0]?.file_path?.startsWith('http') || primaryFeatured.images?.[0]?.file_path?.startsWith('/') 
                                            ? primaryFeatured.images?.[0]?.file_path 
                                            : primaryFeatured.images?.[0]?.file_path 
                                                ? `https://pub-19475a64b9ef47b78593af8d0414d4be.r2.dev/${primaryFeatured.images?.[0]?.file_path}`
                                                : '/images/aerial_land_plot.jpg')
                                    }
                                    alt={primaryFeatured.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                                <div className="absolute top-4 left-4 flex items-center gap-2">
                                    {(primaryFeatured.is_pinned || allDisplayListings.length === 1) && (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500 text-slate-950 text-xs font-black shadow-lg">
                                            <Pin className="w-3.5 h-3.5 fill-slate-950" />
                                            Primary Featured
                                        </span>
                                    )}
                                    <span className="px-3 py-1.5 rounded-full bg-slate-900/80 text-white text-xs font-bold uppercase backdrop-blur-md border border-white/10">
                                        {primaryFeatured.land_type?.replace('_', ' ')}
                                    </span>
                                </div>
                            </div>

                            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                                <div>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
                                        <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                        <span>{primaryFeatured.city_municipality}, {primaryFeatured.province}</span>
                                    </div>
                                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                        {primaryFeatured.title}
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-3 line-clamp-3 leading-relaxed">
                                        {primaryFeatured.description}
                                    </p>

                                    <div className="grid grid-cols-3 gap-3 py-4 my-4 border-y border-slate-100 dark:border-slate-800 text-xs">
                                        <div>
                                            <span className="text-slate-500 text-[11px] block">Lot Area</span>
                                            <span className="font-bold text-slate-900 dark:text-white text-sm">
                                                {Number(primaryFeatured.area).toLocaleString()} {primaryFeatured.area_unit}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-slate-500 text-[11px] block">Title Status</span>
                                            <span className="font-bold text-slate-900 dark:text-white text-sm capitalize">
                                                {primaryFeatured.title_status?.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-slate-500 text-[11px] block">Topography</span>
                                            <span className="font-bold text-slate-900 dark:text-white text-sm capitalize">
                                                {primaryFeatured.topography || 'Flat'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <div>
                                        <span className="text-[10px] uppercase font-semibold text-slate-500 block">
                                            Asking Price
                                        </span>
                                        <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                                            ₱{Number(primaryFeatured.price).toLocaleString()}
                                        </span>
                                    </div>

                                    <Link
                                        href={`/properties/${primaryFeatured.slug}`}
                                        className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all"
                                    >
                                        Explore Property
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center mb-8 shadow-sm">
                            <Store className="w-10 h-10 text-slate-400 dark:text-slate-600 mx-auto mb-3" />
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Marketplace is Ready for Listings</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                                Be the first verified seller to publish a property listing!
                            </p>
                        </div>
                    )}

                    {secondaryFeatured.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {secondaryFeatured.map((listing) => (
                                <ListingCard
                                    key={listing.listing_id}
                                    listing={listing}
                                    isSelected={selectedListingId === listing.listing_id}
                                    onHover={() => setSelectedListingId(listing.listing_id)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* DIRECTORY & INTERACTIVE MAP */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                                Explore Real Properties
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                                Real database listings with GIS coordinates and boundary polygons.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-full border border-slate-200 dark:border-slate-800">
                                {[
                                    { id: 'all', label: 'All Lots' },
                                    { id: 'land_lots', label: 'Land & Lots' },
                                    { id: 'farm', label: 'Farm / Agri' },
                                    { id: 'commercial', label: 'Commercial' },
                                ].map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                                            selectedCategory === cat.id
                                                ? 'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-slate-950 shadow-sm font-bold'
                                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                        }`}
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-full border border-slate-200 dark:border-slate-800">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                                        viewMode === 'grid'
                                            ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-bold'
                                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                                >
                                    Grid
                                </button>
                                <button
                                    onClick={() => setViewMode('map')}
                                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                                        viewMode === 'map'
                                            ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-bold'
                                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                                >
                                    Map View
                                </button>
                            </div>
                        </div>
                    </div>

                    {viewMode === 'map' ? (
                        <div className="space-y-6">
                            <ListingMap
                                listings={filteredListings}
                                selectedListingId={selectedListingId}
                                onSelectListing={(id) => setSelectedListingId(id)}
                                height="550px"
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredListings.slice(0, 3).map((listing) => (
                                    <ListingCard
                                        key={listing.listing_id}
                                        listing={{
                                            ...listing,
                                            is_pinned: listing.is_pinned || allDisplayListings.length === 1,
                                        }}
                                        isSelected={selectedListingId === listing.listing_id}
                                        onHover={() => setSelectedListingId(listing.listing_id)}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredListings.length > 0 ? (
                                filteredListings.map((listing) => (
                                    <ListingCard
                                        key={listing.listing_id}
                                        listing={{
                                            ...listing,
                                            is_pinned: listing.is_pinned || allDisplayListings.length === 1,
                                        }}
                                        isSelected={selectedListingId === listing.listing_id}
                                        onHover={() => setSelectedListingId(listing.listing_id)}
                                    />
                                ))
                            ) : (
                                <div className="col-span-full py-16 text-center rounded-3xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 shadow-sm">
                                    <Store className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-3" />
                                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">No properties found matching criteria</h4>
                                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                                        Try adjusting your category filters or search keywords.
                                    </p>
                                    <button
                                        onClick={() => {
                                            setSelectedCategory('all');
                                            setSearchQuery('');
                                        }}
                                        className="mt-4 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-900 dark:text-white cursor-pointer"
                                    >
                                        Reset Filters
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* SECTION: WHY YUTA (VALUE PROPOSITION & PLATFORM ADVANTAGES) */}
            <section id="why-yuta" className="py-20 bg-slate-100/70 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-800/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider shadow-xs">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>Why Choose Yuta</span>
                        </div>

                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                            The Smarter Way to Buy & Sell Land in the <span className="bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">Philippines</span>
                        </h2>

                        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                            Traditional Philippine land deals suffer from boundary disputes, hidden markups, and unverified titles. Yuta combines GIS boundary mapping, verified seller credentials, and transparent deal agreements for safe, direct transactions.
                        </p>
                    </div>

                    {/* 6 KEY PILLARS GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* CARD 1: GIS BOUNDARY MAPPING */}
                        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between group">
                            <div className="space-y-4">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                    Interactive GIS Boundary Mapping
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                                    Never guess property limits. Inspect exact lot perimeter polygons, GPS coordinates, road access, and satellite topography before ever traveling to the site.
                                </p>
                            </div>
                            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 mt-6 flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Exact coordinate polygons</span>
                            </div>
                        </div>

                        {/* CARD 2: VERIFIED LAND TITLES */}
                        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between group">
                            <div className="space-y-4">
                                <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800/80 flex items-center justify-center text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                                    Verified Titles & Legit Sellers
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                                    Listings clearly state title status (Clean Title, Tax Declaration, Mother Title) and verified seller identity badges so you can invest with zero scam anxieties.
                                </p>
                            </div>
                            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 mt-6 flex items-center gap-2 text-xs font-semibold text-teal-600 dark:text-teal-400">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Clean title & seller badges</span>
                            </div>
                        </div>

                        {/* CARD 3: AUTOMATED DEAL AGREEMENTS */}
                        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between group">
                            <div className="space-y-4">
                                <div className="w-12 h-12 rounded-2xl bg-cyan-100 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800/80 flex items-center justify-center text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform">
                                    <FileCheck className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                                    Automated Deal Agreements
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                                    Submit formal digital purchase proposals, negotiate payment terms, specify earnest deposits, and track deal stages from Proposed to Accepted and Sold.
                                </p>
                            </div>
                            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 mt-6 flex items-center gap-2 text-xs font-semibold text-cyan-600 dark:text-cyan-400">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Digital offer & status tracker</span>
                            </div>
                        </div>

                        {/* CARD 4: DIRECT SELLER CHAT */}
                        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between group">
                            <div className="space-y-4">
                                <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                                    <MessageSquare className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                                    Direct Inquiries, Zero Middlemen Markups
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                                    Chat directly with landowners, licensed brokers, or authorized developers through an integrated real-time inbox without unauthorized agent commissions.
                                </p>
                            </div>
                            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 mt-6 flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Direct buyer-to-seller inbox</span>
                            </div>
                        </div>

                        {/* CARD 5: SECURE PAYMENT GATEWAYS */}
                        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between group">
                            <div className="space-y-4">
                                <div className="w-12 h-12 rounded-2xl bg-violet-100 dark:bg-violet-950/60 border border-violet-200 dark:border-violet-800/80 flex items-center justify-center text-violet-600 dark:text-violet-400 group-hover:scale-110 transition-transform">
                                    <CreditCard className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                                    Secure Transactions & Invoicing
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                                    Process subscription payments and property deposits securely with Xendit, direct bank transfers, and automated downloadable PDF receipt vouchers.
                                </p>
                            </div>
                            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 mt-6 flex items-center gap-2 text-xs font-semibold text-violet-600 dark:text-violet-400">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Xendit & bank payment logging</span>
                            </div>
                        </div>

                        {/* CARD 6: BUILT FOR OFWS & LOCAL INVESTORS */}
                        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between group">
                            <div className="space-y-4">
                                <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/80 flex items-center justify-center text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform">
                                    <Building2 className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                                    Built for OFWs & Real Estate Investors
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                                    Compare price per square meter, calculate installment schedules, and monitor property status from anywhere in the world across Luzon, Visayas, and Mindanao.
                                </p>
                            </div>
                            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 mt-6 flex items-center gap-2 text-xs font-semibold text-rose-600 dark:text-rose-400">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Nationwide coverage & price metrics</span>
                            </div>
                        </div>
                    </div>

                    {/* COMPARISON / TRUST STATS BANNER */}
                    <div className="mt-16 p-8 rounded-3xl bg-emerald-600 text-white shadow-xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div className="space-y-1">
                            <span className="text-3xl sm:text-4xl font-black">100%</span>
                            <span className="text-emerald-100 text-xs sm:text-sm block font-medium">Direct Seller Inquiries</span>
                        </div>
                        <div className="space-y-1">
                            <span className="text-3xl sm:text-4xl font-black">0%</span>
                            <span className="text-emerald-100 text-xs sm:text-sm block font-medium">Middlemen Commission Markups</span>
                        </div>
                        <div className="space-y-1">
                            <span className="text-3xl sm:text-4xl font-black">GIS</span>
                            <span className="text-emerald-100 text-xs sm:text-sm block font-medium">Precise Polygon Boundary Maps</span>
                        </div>
                        <div className="space-y-1">
                            <span className="text-3xl sm:text-4xl font-black">24/7</span>
                            <span className="text-emerald-100 text-xs sm:text-sm block font-medium">Deal Status & Agreement Tracking</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* SELLER CTA */}
            <section className="py-20 bg-emerald-50/50 dark:bg-gradient-to-b dark:from-slate-950 dark:via-emerald-950/20 dark:to-slate-950 border-t border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto text-center space-y-4">
                        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 text-xs font-bold">
                            <ShieldCheck className="w-4 h-4" />
                            Verified Seller Program
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                            List Your Property & Reach Serious Buyers
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                            Subscribe to the monthly seller membership for only ₱500/month powered by Xendit secure payments. Publish unlimited listings, receive buyer deal proposals, and verify your credentials.
                        </p>

                        <div className="pt-6 flex flex-wrap items-center justify-center gap-4">
                            <button
                                onClick={handleBecomeSeller}
                                className="px-8 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-lg transition-all cursor-pointer"
                            >
                                {auth?.user?.is_seller ? 'Go to Seller Dashboard' : 'Subscribe for ₱500 / Month'}
                            </button>
                            <Link
                                href="/billing"
                                className="px-6 py-3.5 rounded-full bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold text-sm transition-colors shadow-sm"
                            >
                                View Membership Details
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="py-12 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900 text-xs text-slate-500">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <AppLogoIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span className="font-bold text-slate-700 dark:text-slate-300">Yuta</span>
                        <span>— Philippine Land & Property Marketplace © {new Date().getFullYear()}</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <Link href="/marketplace" className="hover:text-slate-900 dark:hover:text-slate-300 transition-colors">Marketplace</Link>
                        <a href="#why-yuta" className="hover:text-slate-900 dark:hover:text-slate-300 transition-colors">Why Yuta</a>
                        <Link href="/billing" className="hover:text-slate-900 dark:hover:text-slate-300 transition-colors">Billing</Link>
                        <Link href="/login" className="hover:text-slate-900 dark:hover:text-slate-300 transition-colors">Sign In</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}

