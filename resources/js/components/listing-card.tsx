import { useState } from 'react';
import type { Listing } from '@/types/listing';
import { 
    ChevronLeft, 
    ChevronRight, 
    MapPin, 
    Maximize2, 
    CheckCircle2, 
    Eye, 
    ShieldCheck, 
    Layers, 
    Mountain 
} from 'lucide-react';

interface ListingCardProps {
    listing: Listing;
    isSelected?: boolean;
    onHover?: () => void;
}

export default function ListingCard({ listing, isSelected, onHover }: ListingCardProps) {
    const images = listing.images && listing.images.length > 0 
        ? listing.images 
        : [{ image_id: 'def', listing_id: listing.listing_id, file_path: '/images/aerial_land_plot.jpg', caption: 'Default Image', sort_order: 1, is_primary: true }];

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    return (
        <div 
            onMouseEnter={onHover}
            className={`bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col justify-between group shadow-sm hover:shadow-xl ${
                isSelected 
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 dark:border-emerald-500' 
                    : 'border-slate-200/80 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-500/50'
            }`}
        >
            <div>
                {/* IMAGE CAROUSEL HEADER */}
                <div className="relative w-full h-56 bg-slate-900 overflow-hidden group/img">
                    <img 
                        src={images[currentImageIndex]?.file_path || '/images/aerial_land_plot.jpg'} 
                        alt={images[currentImageIndex]?.caption || listing.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Image Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/30 pointer-events-none" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                        <div className="flex items-center gap-1.5">
                            {listing.is_verified && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/90 text-slate-950 text-xs font-extrabold backdrop-blur-md shadow-sm">
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    <span>Verified</span>
                                </span>
                            )}
                            <span className="px-2.5 py-1 rounded-full bg-slate-900/80 text-white text-xs font-semibold uppercase tracking-wider backdrop-blur-md border border-white/10">
                                {listing.land_type}
                            </span>
                        </div>

                        {/* View Count Badge */}
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-950/80 text-emerald-400 text-xs font-mono font-bold backdrop-blur-md border border-slate-700">
                            <Eye className="w-3.5 h-3.5" />
                            <span>{listing.view_count.toLocaleString()} views</span>
                        </div>
                    </div>

                    {/* Carousel Navigation Arrows (Visible if multiple images exist) */}
                    {images.length > 1 && (
                        <>
                            <button 
                                onClick={prevImage}
                                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-950/70 text-white flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity hover:bg-emerald-600 cursor-pointer"
                                aria-label="Previous Image"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button 
                                onClick={nextImage}
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-950/70 text-white flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity hover:bg-emerald-600 cursor-pointer"
                                aria-label="Next Image"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>

                            {/* Carousel Indicator Dots */}
                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
                                {images.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCurrentImageIndex(idx);
                                        }}
                                        className={`h-1.5 rounded-full transition-all ${
                                            idx === currentImageIndex 
                                                ? 'w-5 bg-emerald-400' 
                                                : 'w-1.5 bg-white/60 hover:bg-white'
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
                        <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            {listing.city_municipality}, {listing.province}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                            {(listing.parcel_number || listing.slug).replace('PAR-', 'LOT-').replace('-parcel', '-lot')}
                        </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
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
                                {listing.area.toLocaleString()} {listing.area_unit}
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
                                {listing.title_status.replace('_', ' ')}
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
                            ₱{listing.price.toLocaleString()}
                        </span>
                        {listing.price_per_unit && (
                            <span className="text-[11px] text-slate-500">
                                (₱{listing.price_per_unit}/sqm)
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-1.5">
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            alert(`Contacting ${listing.seller_type}: Submit negotiation offer for ${listing.title}`);
                        }}
                        className="px-3.5 py-2 rounded-full bg-slate-900 hover:bg-emerald-600 dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-slate-950 text-white text-xs font-semibold transition-colors cursor-pointer"
                    >
                        Contact Seller
                    </button>
                </div>
            </div>
        </div>
    );
}
