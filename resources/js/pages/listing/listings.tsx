import { useState, useMemo } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { toast } from 'sonner';
import { 
    Plus, 
    Search, 
    ExternalLink, 
    Edit3, 
    Trash2, 
    Eye, 
    Heart, 
    MapPin, 
    Maximize2, 
    CheckCircle2, 
    AlertCircle, 
    Clock, 
    Layers, 
    LayoutGrid, 
    List, 
    MoreVertical, 
    ShieldCheck, 
    Pin, 
    X,
    Building2,
    RefreshCw,
    FileText
} from 'lucide-react';
import listingsRoute from '@/routes/listings';
import type { Listing } from '@/types/listing';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface ListingsProps {
    listings?: Listing[];
}

export default function Listings({ listings = [] }: ListingsProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [landTypeFilter, setLandTypeFilter] = useState<string>('all');
    const [sortBy, setSortBy] = useState<string>('newest');
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

    // Delete modal state
    const [listingToDelete, setListingToDelete] = useState<Listing | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Status update in progress tracker
    const [updatingListingId, setUpdatingListingId] = useState<string | null>(null);

    // Compute metrics
    const stats = useMemo(() => {
        const total = listings.length;
        const active = listings.filter((l) => l.status === 'active').length;
        const underContract = listings.filter((l) => l.status === 'under_contract').length;
        const sold = listings.filter((l) => l.status === 'sold').length;
        const draft = listings.filter((l) => l.status === 'draft').length;
        const totalViews = listings.reduce((acc, l) => acc + (Number(l.view_count) || 0), 0);
        const totalFavorites = listings.reduce((acc, l) => acc + (Number(l.favorites_count) || 0), 0);

        return { total, active, underContract, sold, draft, totalViews, totalFavorites };
    }, [listings]);

    // Format currency helper
    const formatPrice = (price: number | string, currency = 'PHP') => {
        const num = typeof price === 'string' ? parseFloat(price) : Number(price || 0);
        const sym = currency === 'PHP' ? '₱' : `${currency} `;
        return `${sym}${num.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
    };

    // Format area helper
    const formatArea = (area: number | string, unit: string = 'sqm') => {
        const num = typeof area === 'string' ? parseFloat(area) : Number(area || 0);
        const unitLabel = unit === 'hectare' ? 'ha' : unit === 'sqft' ? 'sq ft' : 'sqm';
        return `${num.toLocaleString('en-US')} ${unitLabel}`;
    };

    // Format date helper
    const formatDate = (dateString?: string | null) => {
        if (!dateString) return 'Recently';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            });
        } catch {
            return dateString;
        }
    };

    // Resolve listing primary thumbnail
    const getListingImageUrl = (listing: Listing): string => {
        if (listing.images && listing.images.length > 0) {
            const primary = listing.images.find((img) => img.is_primary) || listing.images[0];
            if (primary.url) return primary.url;
            if (primary.file_path) {
                if (
                    primary.file_path.startsWith('http://') ||
                    primary.file_path.startsWith('https://') ||
                    primary.file_path.startsWith('/')
                ) {
                    return primary.file_path;
                }
                return `https://pub-19475a64b9ef47b78593af8d0414d4be.r2.dev/${primary.file_path}`;
            }
        }
        return '/images/aerial_land_plot.jpg';
    };

    // Status badge style resolver
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return {
                    label: 'Active',
                    className: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
                };
            case 'under_contract':
                return {
                    label: 'Under Contract',
                    className: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30',
                };
            case 'sold':
                return {
                    label: 'Sold',
                    className: 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30',
                };
            case 'draft':
                return {
                    label: 'Draft',
                    className: 'bg-slate-500/15 text-slate-700 dark:text-slate-400 border-slate-500/30',
                };
            case 'pending_review':
                return {
                    label: 'Pending Review',
                    className: 'bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30',
                };
            case 'archived':
                return {
                    label: 'Archived',
                    className: 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30',
                };
            default:
                return {
                    label: status.replace('_', ' '),
                    className: 'bg-slate-500/15 text-slate-700 dark:text-slate-400 border-slate-500/30',
                };
        }
    };

    // Filter & Sort listings
    const filteredListings = useMemo(() => {
        return listings
            .filter((item) => {
                // Search query match
                if (searchQuery.trim()) {
                    const q = searchQuery.toLowerCase().trim();
                    const titleMatch = item.title?.toLowerCase().includes(q);
                    const cityMatch = item.city_municipality?.toLowerCase().includes(q);
                    const provMatch = item.province?.toLowerCase().includes(q);
                    const brgyMatch = item.barangay?.toLowerCase().includes(q);
                    const parcelMatch = item.parcel_number?.toLowerCase().includes(q);
                    const catMatch = item.listing_category?.toLowerCase().includes(q);
                    if (!titleMatch && !cityMatch && !provMatch && !brgyMatch && !parcelMatch && !catMatch) {
                        return false;
                    }
                }

                // Status match
                if (statusFilter !== 'all') {
                    if (item.status !== statusFilter) return false;
                }

                // Land type match
                if (landTypeFilter !== 'all') {
                    if (item.land_type !== landTypeFilter) return false;
                }

                return true;
            })
            .sort((a, b) => {
                switch (sortBy) {
                    case 'oldest':
                        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                    case 'price_desc':
                        return (Number(b.price) || 0) - (Number(a.price) || 0);
                    case 'price_asc':
                        return (Number(a.price) || 0) - (Number(b.price) || 0);
                    case 'views_desc':
                        return (Number(b.view_count) || 0) - (Number(a.view_count) || 0);
                    case 'favorites_desc':
                        return (Number(b.favorites_count) || 0) - (Number(a.favorites_count) || 0);
                    case 'newest':
                    default:
                        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                }
            });
    }, [listings, searchQuery, statusFilter, landTypeFilter, sortBy]);

    // Handle Quick Status Update
    const handleStatusUpdate = (listing: Listing, newStatus: string) => {
        setUpdatingListingId(listing.listing_id);
        router.patch(
            `/listings/${listing.listing_id}/status`,
            { status: newStatus },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setUpdatingListingId(null);
                    toast.success(`Listing status updated to ${newStatus.replace('_', ' ')}`);
                },
                onError: () => {
                    setUpdatingListingId(null);
                    toast.error('Failed to update listing status.');
                },
            }
        );
    };

    // Handle Delete Listing
    const handleDeleteListing = () => {
        if (!listingToDelete) return;
        setIsDeleting(true);

        router.delete(`/listings/${listingToDelete.listing_id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleting(false);
                setListingToDelete(null);
                toast.success('Listing permanently deleted.');
            },
            onError: () => {
                setIsDeleting(false);
                toast.error('Failed to delete property listing.');
            },
        });
    };

    const handleClearFilters = () => {
        setSearchQuery('');
        setStatusFilter('all');
        setLandTypeFilter('all');
        setSortBy('newest');
    };

    return (
        <>
            <Head title="My Listings & Inventory" />

            <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-7xl mx-auto w-full">
                {/* TOP HEADER SECTION */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                                My Property Inventory
                            </h1>
                            <Badge variant="secondary" className="font-bold text-xs">
                                {stats.total} {stats.total === 1 ? 'Lot' : 'Lots'}
                            </Badge>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1">
                            Monitor live inquiries, view counts, and update status for your land listings.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/marketplace"
                            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                        >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Marketplace</span>
                        </Link>

                        <Link
                            href="/listings/new"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-xs hover:shadow-md transition-all cursor-pointer"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Create New Listing</span>
                        </Link>
                    </div>
                </div>

                {/* METRICS & OVERVIEW CARDS */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                            <span className="text-[11px] font-semibold uppercase tracking-wider">Total</span>
                            <Layers className="w-3.5 h-3.5 text-slate-500" />
                        </div>
                        <div className="text-2xl font-black text-slate-900 dark:text-white">{stats.total}</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                            <span className="text-[11px] font-semibold uppercase tracking-wider">Active</span>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        </div>
                        <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{stats.active}</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                            <span className="text-[11px] font-semibold uppercase tracking-wider">Pending/Contract</span>
                            <Clock className="w-3.5 h-3.5 text-amber-500" />
                        </div>
                        <div className="text-2xl font-black text-amber-600 dark:text-amber-400">{stats.underContract}</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                            <span className="text-[11px] font-semibold uppercase tracking-wider">Sold</span>
                            <Building2 className="w-3.5 h-3.5 text-blue-500" />
                        </div>
                        <div className="text-2xl font-black text-blue-600 dark:text-blue-400">{stats.sold}</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Views</span>
                            <Eye className="w-3.5 h-3.5 text-cyan-500" />
                        </div>
                        <div className="text-2xl font-black text-slate-900 dark:text-white">
                            {stats.totalViews.toLocaleString()}
                        </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                            <span className="text-[11px] font-semibold uppercase tracking-wider">Saves</span>
                            <Heart className="w-3.5 h-3.5 text-rose-500" />
                        </div>
                        <div className="text-2xl font-black text-rose-600 dark:text-rose-400">
                            {stats.totalFavorites.toLocaleString()}
                        </div>
                    </div>
                </div>

                {/* SEARCH, FILTER AND VIEW CONTROLS */}
                <div className="flex flex-col gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                        {/* Search Input */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by title, location, parcel #, or category..."
                                className="pl-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-xs sm:text-sm"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>

                        {/* Controls Group */}
                        <div className="flex flex-wrap items-center gap-2">
                            {/* Status Filter */}
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                            >
                                <option value="all">All Statuses</option>
                                <option value="active">Active</option>
                                <option value="under_contract">Under Contract</option>
                                <option value="sold">Sold</option>
                                <option value="draft">Draft</option>
                                <option value="pending_review">Pending Review</option>
                                <option value="archived">Archived</option>
                            </select>

                            {/* Land Type Filter */}
                            <select
                                value={landTypeFilter}
                                onChange={(e) => setLandTypeFilter(e.target.value)}
                                className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                            >
                                <option value="all">All Land Types</option>
                                <option value="residential">Residential</option>
                                <option value="agricultural">Agricultural</option>
                                <option value="commercial">Commercial</option>
                                <option value="industrial">Industrial</option>
                                <option value="raw_land">Raw Land</option>
                            </select>

                            {/* Sort Selector */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                            >
                                <option value="newest">Newest Listed</option>
                                <option value="oldest">Oldest Listed</option>
                                <option value="price_desc">Price: High to Low</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="views_desc">Most Views</option>
                                <option value="favorites_desc">Most Saved</option>
                            </select>

                            {/* View Switcher */}
                            <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-1.5 rounded-lg transition-all ${
                                        viewMode === 'grid'
                                            ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
                                            : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                                    title="Grid View"
                                >
                                    <LayoutGrid className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('table')}
                                    className={`p-1.5 rounded-lg transition-all ${
                                        viewMode === 'table'
                                            ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
                                            : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                                    title="Table View"
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Active Filters Pill Bar */}
                    {(searchQuery || statusFilter !== 'all' || landTypeFilter !== 'all' || sortBy !== 'newest') && (
                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/60 text-xs">
                            <span className="text-slate-500 font-medium">Active filters:</span>
                            {searchQuery && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                    Keyword: "{searchQuery}"
                                    <button onClick={() => setSearchQuery('')} className="hover:text-rose-500">
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            )}
                            {statusFilter !== 'all' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                    Status: {statusFilter.replace('_', ' ')}
                                    <button onClick={() => setStatusFilter('all')} className="hover:text-rose-500">
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            )}
                            {landTypeFilter !== 'all' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                    Type: {landTypeFilter.replace('_', ' ')}
                                    <button onClick={() => setLandTypeFilter('all')} className="hover:text-rose-500">
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            )}
                            <button
                                onClick={handleClearFilters}
                                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline ml-auto"
                            >
                                Reset all
                            </button>
                        </div>
                    )}
                </div>

                {/* LISTINGS CONTENT */}
                {listings.length === 0 ? (
                    /* ZERO LISTINGS INITIAL EMPTY STATE */
                    <div className="flex flex-col items-center justify-center p-12 sm:p-16 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 shadow-sm">
                            <MapPin className="w-8 h-8" />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                            No Property Listings Found
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm max-w-md mt-2 leading-relaxed">
                            You haven't added any land or property listings yet. Publish your plots, farmland, or commercial parcels to connect with buyers nationwide.
                        </p>
                        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                            <Link
                                href="/listings/new"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Create Your First Listing</span>
                            </Link>
                        </div>
                    </div>
                ) : filteredListings.length === 0 ? (
                    /* FILTER EMPTY STATE */
                    <div className="flex flex-col items-center justify-center p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                        <AlertCircle className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-3" />
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                            No listings match your search criteria
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 max-w-sm">
                            Try adjusting your search terms or clearing your status and land type filters.
                        </p>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleClearFilters}
                            className="mt-4 rounded-xl text-xs gap-1.5"
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                            Clear Filters
                        </Button>
                    </div>
                ) : viewMode === 'grid' ? (
                    /* GRID VIEW */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredListings.map((listing) => {
                            const badge = getStatusBadge(listing.status);
                            const imgUrl = getListingImageUrl(listing);
                            const isUpdating = updatingListingId === listing.listing_id;

                            return (
                                <div
                                    key={listing.listing_id}
                                    className="group flex flex-col justify-between rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-500/40 transition-all overflow-hidden relative"
                                >
                                    {/* THUMBNAIL HEADER */}
                                    <div className="relative w-full h-48 bg-slate-950 overflow-hidden">
                                        <img
                                            src={imgUrl}
                                            alt={listing.title}
                                            onError={(e) => {
                                                e.currentTarget.src = '/images/aerial_land_plot.jpg';
                                            }}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30 pointer-events-none" />

                                        {/* Status & Feature Badges */}
                                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
                                            <div className="flex flex-wrap items-center gap-1.5">
                                                <span
                                                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border backdrop-blur-md ${badge.className}`}
                                                >
                                                    {badge.label}
                                                </span>
                                                {listing.is_pinned && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-extrabold shadow-xs">
                                                        <Pin className="w-3 h-3 fill-slate-950" />
                                                        Featured
                                                    </span>
                                                )}
                                                {listing.is_verified && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-extrabold shadow-xs">
                                                        <ShieldCheck className="w-3 h-3" />
                                                        Verified
                                                    </span>
                                                )}
                                            </div>

                                            {/* Land Type Pill */}
                                            <span className="px-2 py-0.5 rounded-full bg-slate-950/70 text-slate-200 text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md border border-white/10">
                                                {listing.land_type?.replace('_', ' ')}
                                            </span>
                                        </div>

                                        {/* Photo count indicator */}
                                        {listing.images && listing.images.length > 1 && (
                                            <div className="absolute bottom-2.5 right-3 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white text-[10px] font-medium">
                                                {listing.images.length} photos
                                            </div>
                                        )}
                                    </div>

                                    {/* CARD CONTENT */}
                                    <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                                        <div className="space-y-1.5">
                                            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                                                <span className="font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                                                    {listing.listing_category || 'Land'}
                                                </span>
                                                {listing.parcel_number && (
                                                    <span className="truncate max-w-[130px]" title={listing.parcel_number}>
                                                        Lot #{listing.parcel_number}
                                                    </span>
                                                )}
                                            </div>

                                            <Link
                                                href={`/properties/${listing.slug}`}
                                                className="block font-bold text-slate-900 dark:text-white text-base hover:text-emerald-600 dark:hover:text-emerald-400 line-clamp-1 transition-colors"
                                                title={listing.title}
                                            >
                                                {listing.title}
                                            </Link>

                                            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                                <MapPin className="w-3.5 h-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                                                <span className="truncate">
                                                    {[listing.barangay, listing.city_municipality, listing.province]
                                                        .filter(Boolean)
                                                        .join(', ') || 'Philippines'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Area & Price Row */}
                                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-end justify-between">
                                            <div>
                                                <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                                                    <Maximize2 className="w-3 h-3" />
                                                    <span>{formatArea(listing.area, listing.area_unit)}</span>
                                                </div>
                                                <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                                                    {formatPrice(listing.price, listing.currency)}
                                                </div>
                                            </div>

                                            {listing.is_negotiable && (
                                                <Badge variant="outline" className="text-[10px] text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                                                    Negotiable
                                                </Badge>
                                            )}
                                        </div>

                                        {/* Telemetry Footer */}
                                        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                                            <div className="flex items-center gap-3">
                                                <span className="inline-flex items-center gap-1" title="Page Views">
                                                    <Eye className="w-3.5 h-3.5 text-cyan-500" />
                                                    {listing.view_count || 0}
                                                </span>
                                                <span className="inline-flex items-center gap-1" title="Saved by Buyers">
                                                    <Heart className="w-3.5 h-3.5 text-rose-500" />
                                                    {listing.favorites_count || 0}
                                                </span>
                                            </div>
                                            <span className="text-[10px] text-slate-400">
                                                Listed {formatDate(listing.created_at)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* CARD ACTIONS FOOTER */}
                                    <div className="p-3 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-1.5 flex-1">
                                            <Link
                                                href={`/properties/${listing.slug}`}
                                                className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                                            >
                                                <ExternalLink className="w-3.5 h-3.5" />
                                                <span>View</span>
                                            </Link>

                                            <Link
                                                href={`/listings/${listing.listing_id}/edit`}
                                                className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-all"
                                            >
                                                <Edit3 className="w-3.5 h-3.5" />
                                                <span>Edit</span>
                                            </Link>
                                        </div>

                                        {/* Dropdown for Status & Delete */}
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button
                                                    disabled={isUpdating}
                                                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-all disabled:opacity-50"
                                                    title="More actions"
                                                >
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-44">
                                                <DropdownMenuLabel className="text-[11px] uppercase tracking-wider text-slate-400">
                                                    Change Status
                                                </DropdownMenuLabel>
                                                <DropdownMenuItem
                                                    onClick={() => handleStatusUpdate(listing, 'active')}
                                                    disabled={listing.status === 'active'}
                                                    className="text-xs font-medium cursor-pointer"
                                                >
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mr-2" />
                                                    Mark as Active
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleStatusUpdate(listing, 'under_contract')}
                                                    disabled={listing.status === 'under_contract'}
                                                    className="text-xs font-medium cursor-pointer"
                                                >
                                                    <Clock className="w-3.5 h-3.5 text-amber-500 mr-2" />
                                                    Mark Under Contract
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleStatusUpdate(listing, 'sold')}
                                                    disabled={listing.status === 'sold'}
                                                    className="text-xs font-medium cursor-pointer"
                                                >
                                                    <Building2 className="w-3.5 h-3.5 text-blue-500 mr-2" />
                                                    Mark as Sold
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleStatusUpdate(listing, 'draft')}
                                                    disabled={listing.status === 'draft'}
                                                    className="text-xs font-medium cursor-pointer"
                                                >
                                                    <FileText className="w-3.5 h-3.5 text-slate-500 mr-2" />
                                                    Move to Draft
                                                </DropdownMenuItem>

                                                <DropdownMenuSeparator />

                                                <DropdownMenuItem
                                                    onClick={() => setListingToDelete(listing)}
                                                    className="text-xs font-medium text-rose-600 dark:text-rose-400 cursor-pointer focus:text-rose-600"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5 mr-2" />
                                                    Delete Listing
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    /* DENSE TABLE VIEW */
                    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                                    <tr>
                                        <th className="py-3 px-4">Property</th>
                                        <th className="py-3 px-4">Location</th>
                                        <th className="py-3 px-4">Area & Type</th>
                                        <th className="py-3 px-4">Price</th>
                                        <th className="py-3 px-4">Status</th>
                                        <th className="py-3 px-4 text-center">Telemetry</th>
                                        <th className="py-3 px-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
                                    {filteredListings.map((listing) => {
                                        const badge = getStatusBadge(listing.status);
                                        const imgUrl = getListingImageUrl(listing);

                                        return (
                                            <tr
                                                key={listing.listing_id}
                                                className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                                            >
                                                {/* Property Thumbnail + Title */}
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={imgUrl}
                                                            alt={listing.title}
                                                            onError={(e) => {
                                                                e.currentTarget.src = '/images/aerial_land_plot.jpg';
                                                            }}
                                                            className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-800"
                                                        />
                                                        <div className="min-w-0 max-w-[220px]">
                                                            <Link
                                                                href={`/properties/${listing.slug}`}
                                                                className="font-bold text-slate-900 dark:text-white truncate block hover:text-emerald-600 dark:hover:text-emerald-400"
                                                                title={listing.title}
                                                            >
                                                                {listing.title}
                                                            </Link>
                                                            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                                                                <span>{listing.listing_category || 'Land'}</span>
                                                                {listing.parcel_number && (
                                                                    <>
                                                                        <span>•</span>
                                                                        <span>#{listing.parcel_number}</span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Location */}
                                                <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                                                    <div className="flex items-center gap-1 max-w-[180px] truncate">
                                                        <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                                        <span className="truncate">
                                                            {[listing.city_municipality, listing.province]
                                                                .filter(Boolean)
                                                                .join(', ') || 'Philippines'}
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* Area & Type */}
                                                <td className="py-3 px-4">
                                                    <div className="font-semibold text-slate-900 dark:text-white">
                                                        {formatArea(listing.area, listing.area_unit)}
                                                    </div>
                                                    <div className="text-[11px] text-slate-500 uppercase tracking-wider">
                                                        {listing.land_type?.replace('_', ' ')}
                                                    </div>
                                                </td>

                                                {/* Price */}
                                                <td className="py-3 px-4">
                                                    <div className="font-bold text-slate-900 dark:text-white">
                                                        {formatPrice(listing.price, listing.currency)}
                                                    </div>
                                                    {listing.is_negotiable && (
                                                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                                                            Negotiable
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Status */}
                                                <td className="py-3 px-4">
                                                    <span
                                                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badge.className}`}
                                                    >
                                                        {badge.label}
                                                    </span>
                                                </td>

                                                {/* Telemetry */}
                                                <td className="py-3 px-4 text-center">
                                                    <div className="flex items-center justify-center gap-3 text-slate-500">
                                                        <span className="inline-flex items-center gap-1" title="Views">
                                                            <Eye className="w-3.5 h-3.5 text-cyan-500" />
                                                            {listing.view_count || 0}
                                                        </span>
                                                        <span className="inline-flex items-center gap-1" title="Saves">
                                                            <Heart className="w-3.5 h-3.5 text-rose-500" />
                                                            {listing.favorites_count || 0}
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* Actions */}
                                                <td className="py-3 px-4 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <Link
                                                            href={`/properties/${listing.slug}`}
                                                            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                                            title="View property details"
                                                        >
                                                            <ExternalLink className="w-3.5 h-3.5" />
                                                        </Link>

                                                        <Link
                                                            href={`/listings/${listing.listing_id}/edit`}
                                                            className="p-1.5 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors"
                                                            title="Edit property"
                                                        >
                                                            <Edit3 className="w-3.5 h-3.5" />
                                                        </Link>

                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <button
                                                                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                                                    title="More options"
                                                                >
                                                                    <MoreVertical className="w-3.5 h-3.5" />
                                                                </button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-44">
                                                                <DropdownMenuLabel className="text-[11px] uppercase tracking-wider text-slate-400">
                                                                    Change Status
                                                                </DropdownMenuLabel>
                                                                <DropdownMenuItem
                                                                    onClick={() => handleStatusUpdate(listing, 'active')}
                                                                    disabled={listing.status === 'active'}
                                                                    className="text-xs font-medium cursor-pointer"
                                                                >
                                                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mr-2" />
                                                                    Mark Active
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() => handleStatusUpdate(listing, 'under_contract')}
                                                                    disabled={listing.status === 'under_contract'}
                                                                    className="text-xs font-medium cursor-pointer"
                                                                >
                                                                    <Clock className="w-3.5 h-3.5 text-amber-500 mr-2" />
                                                                    Mark Under Contract
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() => handleStatusUpdate(listing, 'sold')}
                                                                    disabled={listing.status === 'sold'}
                                                                    className="text-xs font-medium cursor-pointer"
                                                                >
                                                                    <Building2 className="w-3.5 h-3.5 text-blue-500 mr-2" />
                                                                    Mark Sold
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() => handleStatusUpdate(listing, 'draft')}
                                                                    disabled={listing.status === 'draft'}
                                                                    className="text-xs font-medium cursor-pointer"
                                                                >
                                                                    <FileText className="w-3.5 h-3.5 text-slate-500 mr-2" />
                                                                    Mark Draft
                                                                </DropdownMenuItem>

                                                                <DropdownMenuSeparator />

                                                                <DropdownMenuItem
                                                                    onClick={() => setListingToDelete(listing)}
                                                                    className="text-xs font-medium text-rose-600 dark:text-rose-400 cursor-pointer focus:text-rose-600"
                                                                >
                                                                    <Trash2 className="w-3.5 h-3.5 mr-2" />
                                                                    Delete Listing
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* DELETE CONFIRMATION DIALOG */}
            <Dialog open={Boolean(listingToDelete)} onOpenChange={(open) => !open && setListingToDelete(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-rose-500" />
                            Delete Property Listing?
                        </DialogTitle>
                        <DialogDescription className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                            Are you sure you want to permanently delete{' '}
                            <span className="font-semibold text-slate-900 dark:text-white">
                                "{listingToDelete?.title}"
                            </span>
                            ? This action will remove all property images, inquiry records, and analytics. This cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4 flex sm:justify-end gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setListingToDelete(null)}
                            disabled={isDeleting}
                            className="rounded-xl text-xs"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleDeleteListing}
                            disabled={isDeleting}
                            className="rounded-xl text-xs bg-rose-600 hover:bg-rose-500 text-white font-bold"
                        >
                            {isDeleting ? 'Deleting...' : 'Permanently Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

Listings.layout = {
    head: { title: 'My Listings' },
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Listings',
            href: listingsRoute.index.url(),
        },
    ],
};

