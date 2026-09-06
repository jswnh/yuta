import { useState } from 'react';
import { Link } from '@inertiajs/react';
import type { Listing } from '@/types/listing';
import { useSavedListings } from '@/hooks/use-saved-listings';
import { 
    ChevronLeft, 
    ChevronRight, 
    MapPin, 
    Maximize2, 
    CheckCircle2, 
    Eye, 
    ShieldCheck, 
    Layers, 
    Mountain,
    Heart,
    Pin
} from 'lucide-react';

interface ListingCardProps {
    listing: Listing;
    isSelected?: boolean;
    onHover?: () => void;
}

export default function ListingCard({ listing, isSelected, onHover }: ListingCardProps) {
    const { toggleFavorite, isToggling } = useSavedListings();
    const isFavorited = Boolean(listing.is_favorited);

    const images = listing.images && listing.images.length > 0 
        ? listing.images 
        : [{ image_id: 'def', listing_id: listing.listing_id, file_path: '/images/aerial_land_plot.jpg', caption: 'Property View', sort_order: 1, is_primary: true }];

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const prevImage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const nextImage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const handleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(listing.listing_id, isFavorited);
    };

    return (
        <div 
            onMouseEnter={onHover}
            className={`bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col justify-between group shadow-sm hover:shadow-xl relative ${
                isSelected 
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 dark:border-emerald-500' 
                    : 'border-slate-200/80 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-500/50'
            }`}
        >
            <Link href={`/properties/${listing.slug}`} className="block flex-1 flex flex-col justify-between">
                <div>
                    {/* IMAGE CAROUSEL HEADER */}
                    <div className="relative w-full h-56 bg-slate-900 overflow-hidden group/img">
                        <img 
                            src={
                                images[currentImageIndex]?.url || 
                                (images[currentImageIndex]?.file_path?.startsWith('http') || images[currentImageIndex]?.file_path?.startsWith('/') 
                                    ? images[currentImageIndex]?.file_path 
                                    : images[currentImageIndex]?.file_path 
                                        ? `https://pub-19475a64b9ef47b78593af8d0414d4be.r2.dev/${images[currentImageIndex]?.file_path}`
                                        : '/images/aerial_land_plot.jpg')
                            } 
                            alt={images[currentImageIndex]?.caption || listing.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        {/* Image Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/30 pointer-events-none" />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                            <div className="flex flex-wrap items-center gap-1.5">
                                {listing.is_pinned && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-black backdrop-blur-md shadow-sm">
                                        <Pin className="w-3.5 h-3.5 fill-slate-950" />
                                        <span>Featured</span>
                                    </span>
                                )}
                                {(listing.is_verified || listing.seller?.seller_profile?.verification_status === 'verified') && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/95 text-slate-950 text-xs font-extrabold backdrop-blur-md shadow-sm">
                                        <ShieldCheck className="w-3.5 h-3.5" />
                                        <span>Verified</span>
                                    </span>
                                )}
                                <span className="px-2.5 py-1 rounded-full bg-slate-900/80 text-white text-xs font-semibold uppercase tracking-wider backdrop-blur-md border border-white/10">
                                    {listing.land_type?.replace('_', ' ')}
                                </span>
                            </div>

                            <div className="flex items-center gap-1.5">
                                {/* View Count Badge from main */}
                                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-950/80 text-emerald-400 text-xs font-mono font-bold backdrop-blur-md border border-slate-700 shadow-xs">
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>{Number(listing.view_count || 0).toLocaleString()} views</span>
                                </div>

                                {/* Save / Heart Button */}
                                <button
                                    type="button"
                                    onClick={handleFavorite}
                                    disabled={isToggling[listing.listing_id]}
                                    className={`p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                                        isFavorited
                                            ? 'bg-rose-500 text-white shadow-md'
                                            : 'bg-slate-950/60 text-white hover:bg-rose-500/80'
                                    }`}
                                    title={isFavorited ? 'Remove from saved' : 'Save property'}
                                >
                                    <Heart className={`w-4 h-4 ${isFavorited ? 'fill-white' : ''}`} />
                                </button>
                            </div>
                        </div>

                        {/* Carousel Navigation Arrows */}
                        {images.length > 1 && (
                            <>
                                <button 
                                    type="button"
                                    onClick={prevImage}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-950/70 text-white flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity hover:bg-emerald-600 cursor-pointer z-10"
                                    aria-label="Previous Image"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button 
                                    type="button"
                                    onClick={nextImage}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-950/70 text-white flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity hover:bg-emerald-600 cursor-pointer z-10"
                                    aria-label="Next Image"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>

                                {/* Carousel Indicator Dots */}
                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
                                    {images.map((_, idx) => (
                                        <span
                                            key={idx}
                                            className={`h-1.5 rounded-full transition-all ${
                                                idx === currentImageIndex 
                                                    ? 'w-5 bg-emerald-400' 
                                                    : 'w-1.5 bg-white/60'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Image Caption tag */}
                        {images[currentImageIndex]?.caption && (
                            <div className="absolute bottom-3 left-3 text-[11px] font-mono text-slate-200 bg-slate-900/80 px-2 py-0.5 rounded-md backdrop-blur-sm">
                                {images[currentImageIndex].caption}
                            </div>
                        )}
                    </div>

                    {/* CONTENT BODY */}
                    <div className="p-5 sm:p-6">
                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">
                            <span className="flex items-center gap-1 truncate">
                                <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                {listing.city_municipality}, {listing.province}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[11px] shrink-0">
                                {(listing.parcel_number || listing.slug).slice(0, 14)}
                            </span>
                        </div>

                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                            {listing.title}
                        </h3>

                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                            {listing.description}
                        </p>

                        {/* Key Attributes Grid */}
                        <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 dark:border-slate-800 text-xs mb-4">
                            <div className="flex flex-col">
                                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                                    <Maximize2 className="w-3 h-3 text-emerald-500" />
                                    Lot Area
                                </span>
                                <span className="font-bold text-slate-900 dark:text-white text-xs mt-0.5">
                                    {Number(listing.area).toLocaleString()} {listing.area_unit}
                                </span>
                            </div>

                            <div className="flex flex-col">
                                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                                    <Mountain className="w-3 h-3 text-emerald-500" />
                                    Topo
                                </span>
                                <span className="font-bold text-slate-900 dark:text-white text-xs mt-0.5 capitalize">
                                    {listing.topography || 'Flat'}
                                </span>
                            </div>

                            <div className="flex flex-col">
                                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                                    <Layers className="w-3 h-3 text-emerald-500" />
                                    Title
                                </span>
                                <span className="font-bold text-slate-900 dark:text-white text-xs mt-0.5 capitalize truncate">
                                    {listing.title_status?.replace('_', ' ')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CARD FOOTER */}
                <div className="px-5 sm:px-6 pb-5 pt-0 flex items-center justify-between gap-2">
                    <div>
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block">
                            {listing.is_negotiable ? 'Asking Price • Negotiable' : 'Asking Price'}
                        </span>
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-xl font-extrabold text-slate-900 dark:text-emerald-400">
                                ₱{Number(listing.price).toLocaleString()}
                            </span>
                            {listing.price_per_unit && (
                                <span className="text-[11px] text-slate-500">
                                    (₱{Number(listing.price_per_unit).toLocaleString()}/sqm)
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <span className="px-3.5 py-2 rounded-full bg-slate-900 group-hover:bg-emerald-600 dark:bg-emerald-500 dark:group-hover:bg-emerald-400 dark:text-slate-950 text-white text-xs font-semibold transition-colors">
                            View Property
                        </span>
                    </div>
                </div>
            </Link>
        </div>
    );
}
