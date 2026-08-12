import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
    MapContainer,
    TileLayer,
    Marker,
    Polygon,
    Polyline,
    Popup,
    useMapEvents,
    useMap,
} from 'react-leaflet';
import {
    MapPin,
    Navigation,
    Search,
    Loader2,
    Shapes as PolygonIcon,
    RotateCcw,
    Trash2,
    Crosshair,
    Layers,
    Globe,
    RefreshCw,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { LatLngCoordinate } from '@/types/listing';

// Fix default Leaflet icon paths
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface NominatimAddress {
    state?: string;
    province?: string;
    region?: string;
    city?: string;
    town?: string;
    municipality?: string;
    county?: string;
    quarter?: string;
    suburb?: string;
    village?: string;
    hamlet?: string;
    neighbourhood?: string;
}

interface NominatimReverseResponse {
    address?: NominatimAddress;
}

interface NominatimSearchResult {
    lat: string;
    lon: string;
    display_name?: string;
}

interface LocationPickerMapProps {
    latitude: number | null;
    longitude: number | null;
    boundaryCoordinates?: LatLngCoordinate[] | null;
    onChange: (
        lat: number,
        lng: number,
        addressDetails?: { province?: string; city?: string; barangay?: string }
    ) => void;
    onBoundaryChange?: (boundaryCoords: LatLngCoordinate[]) => void;
    onReset?: () => void;
    height?: string;
}

export default function LocationPickerMap({
    latitude,
    longitude,
    boundaryCoordinates = [],
    onChange,
    onBoundaryChange,
    onReset,
    height,
}: LocationPickerMapProps) {
    const [isMounted, setIsMounted] = useState(false);
    const [mode, setMode] = useState<'pin' | 'boundary'>('pin');
    const [mapStyle, setMapStyle] = useState<'street' | 'satellite'>('street');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [isLocating, setIsLocating] = useState(false);

    // Default coordinates (e.g., Central Philippines / Manila if not provided)
    const currentLat = latitude && !isNaN(latitude) ? latitude : 14.5995;
    const currentLng = longitude && !isNaN(longitude) ? longitude : 120.9842;
    const hasSelectedLocation = latitude !== null && longitude !== null && !isNaN(latitude) && !isNaN(longitude);

    const safeBoundaryCoords = useMemo(
        () => (Array.isArray(boundaryCoordinates) ? boundaryCoordinates : []),
        [boundaryCoordinates]
    );

    const centerTuple = useMemo<[number, number]>(() => [currentLat, currentLng], [currentLat, currentLng]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Memoize custom Leaflet icons to prevent DOM re-creation flickering on every render
    const pinIcon = useMemo(() => {
        return L.divIcon({
            className: 'custom-pin-marker',
            html: `
                <div class="relative flex items-center justify-center">
                    <span class="absolute inline-flex h-7 w-7 animate-ping rounded-full bg-emerald-400 opacity-60"></span>
                    <div class="relative flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white shadow-md ring-2 ring-white">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                    </div>
                </div>
            `,
            iconSize: [28, 28],
            iconAnchor: [14, 28],
        });
    }, []);

    const vertexIcon = useMemo(() => {
        return L.divIcon({
            className: 'custom-boundary-vertex',
            html: `<div style="width: 14px; height: 14px; background: #10b981; border: 2px solid white; border-radius: 50%; box-shadow: 0 2px 5px rgba(0,0,0,0.4); cursor: grab;"></div>`,
            iconSize: [14, 14],
            iconAnchor: [7, 7],
        });
    }, []);

    // Perform reverse geocoding to suggest province, city, barangay
    const reverseGeocode = useCallback(
        async (lat: number, lng: number) => {
            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
                );
                if (!res.ok) {
                    onChange(lat, lng);
                    return;
                }
                const data: NominatimReverseResponse = await res.json();
                if (data && data.address) {
                    const addr = data.address;
                    const province = addr.state || addr.province || addr.region || '';
                    const city = addr.city || addr.town || addr.municipality || addr.county || '';
                    const barangay =
                        addr.quarter || addr.suburb || addr.village || addr.hamlet || addr.neighbourhood || '';
                    onChange(lat, lng, { province, city, barangay });
                    return;
                }
            } catch {
                // Ignore geocoding network issues gracefully
            }
            onChange(lat, lng);
        },
        [onChange]
    );

    const handleSearchLocation = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        setIsSearching(true);

        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                    searchQuery + ', Philippines'
                )}`
            );
            const data: NominatimSearchResult[] = await res.json();
            if (data && data.length > 0) {
                const firstResult = data[0];
                const lat = parseFloat(firstResult.lat);
                const lng = parseFloat(firstResult.lon);
                reverseGeocode(lat, lng);
            }
        } catch (err) {
            console.error('Search failed:', err);
        } finally {
            setIsSearching(false);
        }
    };

    const handleGetCurrentLocation = () => {
        if (!navigator.geolocation) return;
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                reverseGeocode(lat, lng);
                setIsLocating(false);
            },
            (err) => {
                console.error('Geolocation error:', err);
                setIsLocating(false);
            },
            { enableHighAccuracy: true }
        );
    };

    const handleAddBoundaryPoint = (lat: number, lng: number) => {
        if (!onBoundaryChange) return;
        const newCoords = [...safeBoundaryCoords, { lat: Number(lat.toFixed(7)), lng: Number(lng.toFixed(7)) }];
        onBoundaryChange(newCoords);

        if (!hasSelectedLocation) {
            reverseGeocode(lat, lng);
        }
    };

    const handleVertexDrag = (index: number, newLat: number, newLng: number) => {
        if (!onBoundaryChange) return;
        const updated = safeBoundaryCoords.map((coord, i) =>
            i === index
                ? { lat: Number(newLat.toFixed(7)), lng: Number(newLng.toFixed(7)) }
                : coord
        );
        onBoundaryChange(updated);
    };

    const handleRemoveVertex = (index: number) => {
        if (!onBoundaryChange) return;
        const updated = safeBoundaryCoords.filter((_, i) => i !== index);
        onBoundaryChange(updated);
    };

    const handleUndoLastPoint = () => {
        if (!onBoundaryChange || safeBoundaryCoords.length === 0) return;
        onBoundaryChange(safeBoundaryCoords.slice(0, -1));
    };

    const handleFullReset = () => {
        setSearchQuery('');
        if (onBoundaryChange) {
            onBoundaryChange([]);
        }
        if (onReset) {
            onReset();
        }
    };

    if (!isMounted) {
        return (
            <div className="w-full h-[320px] sm:h-[400px] md:h-[460px] rounded-2xl bg-muted/40 animate-pulse flex flex-col items-center justify-center border-2 border-dashed border-muted p-4">
                <div className="flex flex-col items-center gap-3 text-muted-foreground text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="text-sm font-semibold tracking-wide">Initializing Interactive GIS Map...</span>
                </div>
            </div>
        );
    }

    // Component to handle map clicks based on mode
    function MapClickHandler() {
        useMapEvents({
            click(e: L.LeafletMouseEvent) {
                const { lat, lng } = e.latlng;
                if (mode === 'pin') {
                    reverseGeocode(lat, lng);
                } else if (mode === 'boundary') {
                    handleAddBoundaryPoint(lat, lng);
                }
            },
        });
        return null;
    }

    // Component to center map smoothly without flying/lagging on every minor re-render
    function MapRecenter({ center }: { center: [number, number] }) {
        const map = useMap();
        const lastPosRef = useRef<[number, number] | null>(null);

        useEffect(() => {
            const [lat, lng] = center;
            if (!lastPosRef.current) {
                lastPosRef.current = [lat, lng];
                return;
            }
            const [lastLat, lastLng] = lastPosRef.current;
            const diffLat = Math.abs(lat - lastLat);
            const diffLng = Math.abs(lng - lastLng);
            // Only re-center if coordinates change significantly (e.g. from search, GPS, or manual pin pick)
            if (diffLat > 0.0001 || diffLng > 0.0001) {
                lastPosRef.current = [lat, lng];
                map.setView([lat, lng], Math.max(map.getZoom(), 14), { animate: true });
            }
        }, [center[0], center[1], map]);

        return null;
    }

    const tileUrl =
        mapStyle === 'satellite'
            ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
            : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    const tileAttribution =
        mapStyle === 'satellite'
            ? 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and GIS User Community'
            : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    return (
        <div className="space-y-3">
            {/* Top Toolbar: Search, GPS, Layer Switcher & Full Reset */}
            <div className="flex flex-col gap-2.5 rounded-xl border bg-card p-2.5 sm:p-3 shadow-xs">
                {/* Search Bar */}
                <form onSubmit={handleSearchLocation} className="flex flex-col gap-2 sm:flex-row">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search city, municipality, address, or landmark in PH..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 text-xs h-9 sm:h-9"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Button type="submit" variant="secondary" size="sm" disabled={isSearching} className="flex-1 sm:flex-initial h-9 gap-1.5 text-xs font-semibold">
                            {isSearching ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-3.5 w-3.5" />}
                            Search Location
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleGetCurrentLocation}
                            disabled={isLocating}
                            className="flex-1 sm:flex-initial h-9 gap-1.5 text-xs font-semibold whitespace-nowrap"
                        >
                            {isLocating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Navigation className="h-3.5 w-3.5 text-emerald-500" />}
                            GPS Locate
                        </Button>
                    </div>
                </form>

                {/* Controls Bar: Mode Switcher, Tile Switcher, Reset */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pt-2 border-t">
                    {/* Mode Selector */}
                    <div className="grid grid-cols-2 sm:flex items-center gap-1 bg-muted p-1 rounded-lg border w-full sm:w-auto">
                        <button
                            type="button"
                            onClick={() => setMode('pin')}
                            className={`flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                                mode === 'pin'
                                    ? 'bg-background text-foreground shadow-xs'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            <Crosshair className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>Pin Center</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode('boundary')}
                            className={`flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                                mode === 'boundary'
                                    ? 'bg-emerald-600 text-white shadow-xs'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            <PolygonIcon className="h-3.5 w-3.5" />
                            <span>Draw Boundary</span>
                        </button>
                    </div>

                    {/* Right Action Tools: Map Style Toggle & Full Reset Button */}
                    <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
                        {/* Map Style Toggle */}
                        <div className="flex items-center gap-1 bg-muted p-1 rounded-lg border">
                            <button
                                type="button"
                                onClick={() => setMapStyle('street')}
                                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                                    mapStyle === 'street'
                                        ? 'bg-background text-foreground shadow-xs'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                <Globe className="h-3 w-3" /> Street
                            </button>
                            <button
                                type="button"
                                onClick={() => setMapStyle('satellite')}
                                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                                    mapStyle === 'satellite'
                                        ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                <Layers className="h-3 w-3" /> Satellite
                            </button>
                        </div>

                        {/* Reset Map Button */}
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={handleFullReset}
                            className="h-8 px-2.5 text-xs gap-1.5 font-semibold shadow-xs shrink-0"
                            title="Reset all map markers and boundary polygon coordinates"
                        >
                            <RefreshCw className="h-3.5 w-3.5" /> Reset Map
                        </Button>
                    </div>
                </div>
            </div>

            {/* Map Container */}
            <div
                style={height ? { height } : undefined}
                className="w-full h-[320px] sm:h-[400px] md:h-[460px] rounded-2xl overflow-hidden border-2 border-primary/20 shadow-lg relative z-10"
            >
                <MapContainer
                    center={centerTuple}
                    zoom={hasSelectedLocation ? 15 : 10}
                    scrollWheelZoom={true}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer key={mapStyle} attribution={tileAttribution} url={tileUrl} />

                    <MapClickHandler />
                    <MapRecenter center={centerTuple} />

                    {/* Center Property Location Pin */}
                    {hasSelectedLocation && pinIcon && (
                        <Marker
                            position={[currentLat, currentLng]}
                            icon={pinIcon}
                            draggable={mode === 'pin'}
                            eventHandlers={{
                                dragend(e: L.DragEndEvent) {
                                    const marker = e.target as L.Marker;
                                    if (marker) {
                                        const pos = marker.getLatLng();
                                        reverseGeocode(pos.lat, pos.lng);
                                    }
                                },
                            }}
                        >
                            <Popup>
                                <div className="p-1 text-center font-sans">
                                    <Badge className="bg-emerald-600 text-white text-[10px] mb-1">
                                        Property Location Center
                                    </Badge>
                                    <p className="text-xs font-mono text-slate-700 dark:text-slate-300 font-bold">
                                        {currentLat.toFixed(6)}, {currentLng.toFixed(6)}
                                    </p>
                                    <p className="text-[10px] text-slate-500 mt-1">
                                        Drag pin to refine exact center location
                                    </p>
                                </div>
                            </Popup>
                        </Marker>
                    )}

                    {/* Render Polygon or Polyline for Boundary Coordinates */}
                    {safeBoundaryCoords.length >= 3 ? (
                        <Polygon
                            positions={safeBoundaryCoords.map((c) => [c.lat, c.lng])}
                            pathOptions={{
                                color: '#10b981',
                                fillColor: '#10b981',
                                fillOpacity: 0.35,
                                weight: 3.5,
                            }}
                        />
                    ) : safeBoundaryCoords.length >= 2 ? (
                        <Polyline
                            positions={safeBoundaryCoords.map((c) => [c.lat, c.lng])}
                            pathOptions={{
                                color: '#10b981',
                                weight: 3.5,
                                dashArray: '6, 6',
                            }}
                        />
                    ) : null}

                    {/* Draggable Vertex Markers for Boundary Corners */}
                    {vertexIcon &&
                        safeBoundaryCoords.map((coord, idx) => (
                            <Marker
                                key={`vertex-${idx}`}
                                position={[coord.lat, coord.lng]}
                                icon={vertexIcon}
                                draggable={true}
                                eventHandlers={{
                                    dragend(e: L.DragEndEvent) {
                                        const marker = e.target as L.Marker;
                                        const pos = marker.getLatLng();
                                        handleVertexDrag(idx, pos.lat, pos.lng);
                                    },
                                    click() {
                                        if (mode === 'boundary') {
                                            handleRemoveVertex(idx);
                                        }
                                    },
                                }}
                            />
                        ))}
                </MapContainer>

                {/* Map Bottom Floating Status Overlay */}
                <div className="absolute bottom-3 left-3 z-[1000] flex flex-wrap items-center gap-2 pointer-events-none">
                    <div className="pointer-events-auto flex items-center gap-2 rounded-lg bg-background/90 backdrop-blur-md px-3 py-1.5 border shadow-md text-xs font-medium max-w-[90vw]">
                        {mode === 'pin' ? (
                            <span className="flex items-center gap-1.5 text-foreground truncate">
                                <Crosshair className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                                <span>Mode: <strong>Pin Center</strong></span>
                            </span>
                        ) : (
                            <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 truncate">
                                <PolygonIcon className="h-3.5 w-3.5 shrink-0" />
                                <span>Mode: <strong>Draw Boundary</strong></span>
                            </span>
                        )}
                        {safeBoundaryCoords.length > 0 && (
                            <Badge variant="outline" className="text-[10px] bg-background shrink-0">
                                {safeBoundaryCoords.length} Points
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Boundary Floating Quick Actions */}
                {safeBoundaryCoords.length > 0 && (
                    <div className="absolute top-3 right-3 z-[1000] flex items-center gap-1.5 bg-background/90 backdrop-blur-md p-1.5 rounded-lg border shadow-md">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleUndoLastPoint}
                            className="h-7 px-2 text-xs gap-1"
                            title="Undo last boundary vertex"
                        >
                            <RotateCcw className="h-3 w-3" /> <span className="hidden sm:inline">Undo Point</span>
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => onBoundaryChange && onBoundaryChange([])}
                            className="h-7 px-2 text-xs gap-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                            title="Clear polygon points"
                        >
                            <Trash2 className="h-3 w-3" /> <span className="hidden sm:inline">Clear</span>
                        </Button>
                    </div>
                )}
            </div>

            {/* Helper Footer Bar */}
            <div className="flex flex-col gap-1 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    Click map to pin location or draw perimeter. Drag corner handles to fine-tune.
                </span>
                {hasSelectedLocation && (
                    <span className="font-mono text-[11px] text-foreground font-semibold shrink-0">
                        {currentLat.toFixed(6)}, {currentLng.toFixed(6)}
                    </span>
                )}
            </div>
        </div>
    );
}

