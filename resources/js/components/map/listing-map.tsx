import { useEffect, useState, Fragment } from 'react';
import type { Listing } from '@/types/listing';

interface ListingMapProps {
    listings: Listing[];
    selectedListingId?: string | null;
    onSelectListing?: (id: string) => void;
    height?: string;
}

export default function ListingMap({ 
    listings = [], 
    selectedListingId, 
    onSelectListing,
    height = "450px" 
}: ListingMapProps) {
    const [isMounted, setIsMounted] = useState(false);
    const [ReactLeaflet, setReactLeaflet] = useState<any>(null);
    const [L, setL] = useState<any>(null);

    useEffect(() => {
        setIsMounted(true);
        // Dynamically import leaflet and react-leaflet for client side
        Promise.all([
            import('leaflet'),
            import('react-leaflet'),
            import('leaflet/dist/leaflet.css' as any)
        ]).then(([leafletModule, reactLeafletModule]) => {
            const L = leafletModule.default || leafletModule;
            
            // Fix default icon paths in Leaflet
            delete (L.Icon.Default.prototype as any)._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            });

            setL(L);
            setReactLeaflet(reactLeafletModule);
        }).catch((err) => {
            console.error('Failed to load Leaflet:', err);
        });
    }, []);

    if (!isMounted || !ReactLeaflet || !L) {
        return (
            <div 
                style={{ height }} 
                className="w-full rounded-2xl bg-slate-100 dark:bg-slate-800/80 animate-pulse flex items-center justify-center border border-slate-200 dark:border-slate-800"
            >
                <div className="flex flex-col items-center gap-2 text-slate-400">
                    <span className="text-sm font-medium">Loading Interactive GIS Map...</span>
                </div>
            </div>
        );
    }

    const { MapContainer, TileLayer, Marker, Popup, Polygon } = ReactLeaflet;

    // Filter valid listings with valid numeric latitude & longitude
    const validListings = (listings || []).filter(l => {
        const lat = parseFloat(String(l?.latitude));
        const lng = parseFloat(String(l?.longitude));
        return !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
    });

    // Calculate default center from listings or fall back to Antipolo, PH
    const centerLat = validListings.length > 0 ? parseFloat(String(validListings[0].latitude)) : 14.6254;
    const centerLng = validListings.length > 0 ? parseFloat(String(validListings[0].longitude)) : 121.1258;

    return (
        <div style={{ height }} className="w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md relative z-10">
            <MapContainer 
                key={`map-${centerLat.toFixed(3)}-${centerLng.toFixed(3)}`}
                center={[centerLat, centerLng]} 
                zoom={11} 
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {validListings.map((listing) => {
                    const isSelected = listing.listing_id === selectedListingId;
                    const primaryImage = listing.images?.find(img => img.is_primary) || listing.images?.[0];
                    const priceNum = Number(listing.price) || 0;
                    const priceBadge = priceNum >= 1000000 
                        ? `₱${(priceNum / 1000000).toFixed(1)}M` 
                        : `₱${(priceNum / 1000).toFixed(0)}k`;

                    const imageUrl = primaryImage?.url || 
                        (primaryImage?.file_path?.startsWith('http') || primaryImage?.file_path?.startsWith('/') 
                            ? primaryImage?.file_path 
                            : primaryImage?.file_path 
                                ? `https://pub-19475a64b9ef47b78593af8d0414d4be.r2.dev/${primaryImage.file_path}` 
                                : '/images/aerial_land_plot.jpg');

                    // Custom marker icon
                    const customIcon = L.divIcon({
                        className: 'custom-map-marker',
                        html: `
                            <div class="cursor-pointer transform transition-transform duration-200 hover:scale-110">
                                <div class="px-2.5 py-1 rounded-full text-xs font-extrabold shadow-lg flex items-center gap-1 ${
                                    isSelected 
                                        ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-400/30' 
                                        : 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                                }">
                                    <span>${priceBadge}</span>
                                </div>
                            </div>
                        `,
                        iconSize: [60, 30],
                        iconAnchor: [30, 15]
                    });

                    // Parse polygon coordinates safely
                    const boundaryPositions = (listing.boundary_coordinates || [])
                        .map(coord => [parseFloat(String((coord as any).lat ?? (coord as any).latitude)), parseFloat(String((coord as any).lng ?? (coord as any).longitude))])
                        .filter(([lat, lng]) => !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0);

                    const lat = parseFloat(String(listing.latitude));
                    const lng = parseFloat(String(listing.longitude));

                    return (
                        <Fragment key={listing.listing_id}>
                            <Marker 
                                position={[lat, lng]}
                                icon={customIcon}
                                eventHandlers={{
                                    click: () => onSelectListing && onSelectListing(listing.listing_id)
                                }}
                            >
                                <Popup className="listing-map-popup">
                                    <div className="w-56 p-1">
                                        {imageUrl && (
                                            <div className="w-full h-28 rounded-lg overflow-hidden mb-2">
                                                <img 
                                                    src={imageUrl} 
                                                    alt={listing.title} 
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}
                                        <div className="text-xs font-bold uppercase text-emerald-600 dark:text-emerald-400 tracking-wider mb-0.5">
                                            {listing.land_type?.replace('_', ' ')} • {Number(listing.area || 0).toLocaleString()} {listing.area_unit || 'sqm'}
                                        </div>
                                        <h4 className="font-bold text-sm text-slate-900 leading-tight mb-1">
                                            {listing.title}
                                        </h4>
                                        <p className="text-xs text-slate-500 mb-2">
                                            {listing.city_municipality}, {listing.province}
                                        </p>
                                        <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                                            <span className="font-extrabold text-sm text-slate-900">
                                                ₱{priceNum.toLocaleString()}
                                            </span>
                                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                                                {listing.title_status?.replace('_', ' ')}
                                            </span>
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>

                            {/* Optional Boundary Coordinates Polygon */}
                            {boundaryPositions.length > 2 && (
                                <Polygon 
                                    positions={boundaryPositions}
                                    pathOptions={{
                                        color: isSelected ? '#10b981' : '#3b82f6',
                                        fillColor: isSelected ? '#10b981' : '#3b82f6',
                                        fillOpacity: 0.25,
                                        weight: 2
                                    }}
                                />
                            )}
                        </Fragment>
                    );
                })}
            </MapContainer>
        </div>
    );
}
