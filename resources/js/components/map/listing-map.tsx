import { useEffect, useState } from 'react';
import type { Listing } from '@/types/listing';

interface ListingMapProps {
    listings: Listing[];
    selectedListingId?: string | null;
    onSelectListing?: (id: string) => void;
    height?: string;
}

export default function ListingMap({ 
    listings, 
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

    // Calculate default center from listings or fall back to Antipolo, PH
    const validListings = listings.filter(l => l.latitude && l.longitude);
    const centerLat = validListings.length > 0 ? validListings[0].latitude! : 14.6254;
    const centerLng = validListings.length > 0 ? validListings[0].longitude! : 121.1258;

    return (
        <div style={{ height }} className="w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md relative z-10">
            <MapContainer 
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

                    // Custom marker icon
                    const customIcon = L.divIcon({
                        className: 'custom-map-marker',
                        html: `
                            <div className="cursor-pointer transform transition-transform duration-200 hover:scale-110">
                                <div className="px-2.5 py-1 rounded-full text-xs font-extrabold shadow-lg flex items-center gap-1 ${
                                    isSelected 
                                        ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-400/30' 
                                        : 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                                }">
                                    <span>₱${(listing.price / 1000).toFixed(0)}k</span>
                                </div>
                            </div>
                        `,
                        iconSize: [60, 30],
                        iconAnchor: [30, 15]
                    });

                    return (
                        <div key={listing.listing_id}>
                            <Marker 
                                position={[listing.latitude!, listing.longitude!]}
                                icon={customIcon}
                                eventHandlers={{
                                    click: () => onSelectListing && onSelectListing(listing.listing_id)
                                }}
                            >
                                <Popup className="listing-map-popup">
                                    <div className="w-56 p-1">
                                        {primaryImage && (
                                            <div className="w-full h-28 rounded-lg overflow-hidden mb-2">
                                                <img 
                                                    src={primaryImage.file_path} 
                                                    alt={listing.title} 
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}
                                        <div className="text-xs font-bold uppercase text-emerald-600 dark:text-emerald-400 tracking-wider mb-0.5">
                                            {listing.land_type} • {listing.area.toLocaleString()} {listing.area_unit}
                                        </div>
                                        <h4 className="font-bold text-sm text-slate-900 leading-tight mb-1">
                                            {listing.title}
                                        </h4>
                                        <p className="text-xs text-slate-500 mb-2">
                                            {listing.city_municipality}, {listing.province}
                                        </p>
                                        <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                                            <span className="font-extrabold text-sm text-slate-900">
                                                ₱{listing.price.toLocaleString()}
                                            </span>
                                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                                                {listing.title_status.replace('_', ' ')}
                                            </span>
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>

                            {/* Optional Boundary Coordinates Polygon */}
                            {listing.boundary_coordinates && listing.boundary_coordinates.length > 2 && (
                                <Polygon 
                                    positions={listing.boundary_coordinates.map(coord => [coord.lat, coord.lng])}
                                    pathOptions={{
                                        color: isSelected ? '#10b981' : '#3b82f6',
                                        fillColor: isSelected ? '#10b981' : '#3b82f6',
                                        fillOpacity: 0.25,
                                        weight: 2
                                    }}
                                />
                            )}
                        </div>
                    );
                })}
            </MapContainer>
        </div>
    );
}
