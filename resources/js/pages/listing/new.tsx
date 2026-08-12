import { SyntheticEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { toast } from 'sonner';
import { currencies as AllCurrencies } from 'country-data-list';
import {
    MapPin,
    Coins,
    Compass,
    Layers,
    FileCheck,
    UploadCloud,
    Trash2,
    CheckCircle2,
    AlertTriangle,
    Sparkles,
    ArrowLeft,
    Building2,
    Maximize2,
    Tag,
    UserCheck,
    FileText,
    Mountain,
    Camera,
    Shapes as PolygonIcon,
    ShieldCheck,
    Save,
    Loader2,
    AlertCircle,
} from 'lucide-react';

import listingCategories from '@/data/listing_categories.json';
import listings from '@/routes/listings';
import InputError from '@/components/input-error';
import LocationPickerMap from '@/components/map/location-picker-map';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import type { AreaUnit, LandType, LatLngCoordinate, SellerType, TitleStatus, Topography } from '@/types/listing';

interface ImagePreview {
    file: File;
    url: string;
    caption: string;
}

interface CurrencyItem {
    code: string;
    name: string;
    symbol?: string;
    decimals?: number;
    number?: string;
}

interface CreateListingProps {
    draft?: Record<string, unknown> | null;
}

export default function CreateListing({ draft }: CreateListingProps) {
    const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
    const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
    const isFirstRender = useRef(true);
    const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const { data, setData, post, processing, errors, transform } = useForm({
        seller_type: (draft?.seller_type || 'owner') as SellerType,
        title: (draft?.title as string) || '',
        listing_category: (draft?.listing_category as string) || '',
        description: (draft?.description as string) || '',
        price: (draft?.price as string) || '',
        currency: (draft?.currency as string) || 'PHP',
        is_negotiable: Boolean(draft?.is_negotiable ?? false),
        price_per_unit: (draft?.price_per_unit as string) || '',
        payment_terms: ((draft?.payment_terms as string) || 'full') as 'full' | 'monthly' | 'yearly',
        down_payment: (draft?.down_payment as string) || '',
        installment_count: (draft?.installment_count as string) || '',
        installment_amount: (draft?.installment_amount as string) || '',
        area: (draft?.area as string) || '',
        area_unit: ((draft?.area_unit as string) || 'sqm') as AreaUnit,
        land_type: ((draft?.land_type as string) || 'raw_land') as LandType,
        topography: ((draft?.topography as string) || 'flat') as Topography,
        title_status: ((draft?.title_status as string) || 'clean_title') as TitleStatus,
        parcel_number: (draft?.parcel_number as string) || '',
        address_line: (draft?.address_line as string) || '',
        barangay: (draft?.barangay as string) || '',
        city_municipality: (draft?.city_municipality as string) || '',
        province: (draft?.province as string) || '',
        region: (draft?.region as string) || '',
        zip_code: (draft?.zip_code as string) || '',
        latitude: (draft?.latitude as string) || '',
        longitude: (draft?.longitude as string) || '',
        boundary_coordinates: ((draft?.boundary_coordinates as LatLngCoordinate[]) || []) as LatLngCoordinate[],
        images: [] as File[],
        captions: ((draft?.captions as string[]) || []) as string[],
    });

    // Efficient Real-Time Auto-Save (Debounced at 1.5 seconds of user inactivity)
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if (resetTimerRef.current) {
            clearTimeout(resetTimerRef.current);
        }

        setAutoSaveStatus('saving');

        const timer = setTimeout(async () => {
            try {
                const { images, ...draftPayload } = data;
                const res = await fetch('/listings/draft', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN':
                            (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                    },
                    body: JSON.stringify(draftPayload),
                });

                if (res.ok) {
                    setAutoSaveStatus('saved');
                    // Hide green check icon after 2 seconds
                    resetTimerRef.current = setTimeout(() => {
                        setAutoSaveStatus('idle');
                    }, 2000);
                } else {
                    setAutoSaveStatus('error');
                    // Hide red error icon after 3 seconds
                    resetTimerRef.current = setTimeout(() => {
                        setAutoSaveStatus('idle');
                    }, 3000);
                }
            } catch {
                setAutoSaveStatus('error');
                resetTimerRef.current = setTimeout(() => {
                    setAutoSaveStatus('idle');
                }, 3000);
            }
        }, 1500);

        return () => clearTimeout(timer);
    }, [data]);

    // Responsive Pill Styling Helper for Mobile & Desktop
    const getFlatPillClass = (isSelected: boolean) =>
        `inline-flex items-center justify-center gap-2 rounded-xl px-3.5 py-2.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium transition-all cursor-pointer text-center select-none min-h-[42px] sm:min-h-[38px] w-full ${
            isSelected
                ? 'bg-primary text-primary-foreground font-semibold shadow-xs ring-2 ring-primary/20 scale-[1.01]'
                : 'border border-input bg-card text-muted-foreground hover:bg-accent/60 hover:text-foreground hover:border-accent'
        }`;

    // List of currencies from country-data-list
    const currencyList = useMemo<CurrencyItem[]>(() => {
        if (!AllCurrencies || !AllCurrencies.all) return [];
        return (AllCurrencies.all as CurrencyItem[])
            .filter((c: CurrencyItem) => c && c.code && c.name && c.code.length === 3)
            .sort((a: CurrencyItem, b: CurrencyItem) => a.code.localeCompare(b.code));
    }, []);

    // Currently selected currency symbol
    const selectedCurrencySymbol = useMemo(() => {
        if (!data.currency) return '₱';
        const currenciesMap = AllCurrencies as unknown as Record<string, CurrencyItem | undefined> & { all?: CurrencyItem[] };
        const found =
            currenciesMap[data.currency] ||
            currenciesMap.all?.find((c: CurrencyItem) => c.code === data.currency);
        return found?.symbol || data.currency;
    }, [data.currency]);

    // Auto-calculate price per unit
    const computedPricePerUnit = useMemo(() => {
        const numericPrice = Number(data.price);
        const numericArea = Number(data.area);
        if (numericPrice > 0 && numericArea > 0) {
            return (numericPrice / numericArea).toFixed(2);
        }
        return null;
    }, [data.price, data.area]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const selectedFiles = Array.from(e.target.files);
        const validFiles: File[] = [];

        for (const file of selectedFiles) {
            // Check PHP upload_max_filesize threshold (2MB)
            if (file.size > 2 * 1024 * 1024) {
                toast.error(`"${file.name}" is larger than 2MB. Please choose a smaller image file.`);
                continue;
            }
            if (!file.type.startsWith('image/')) {
                toast.error(`"${file.name}" is not a valid image file.`);
                continue;
            }
            validFiles.push(file);
        }

        if (validFiles.length === 0) return;

        const updatedFiles = [...data.images, ...validFiles].slice(0, 10);
        const updatedCaptions = [...data.captions, ...validFiles.map(() => '')].slice(0, 10);

        setData((prev) => ({
            ...prev,
            images: updatedFiles,
            captions: updatedCaptions,
        }));

        const newPreviews: ImagePreview[] = updatedFiles.map((file, idx) => ({
            file,
            url: URL.createObjectURL(file),
            caption: updatedCaptions[idx] || '',
        }));
        setImagePreviews(newPreviews);
    };

    const handleCaptionChange = (index: number, captionValue: string) => {
        const updatedCaptions = [...data.captions];
        updatedCaptions[index] = captionValue;
        setData('captions', updatedCaptions);

        setImagePreviews((prev) =>
            prev.map((item, i) => (i === index ? { ...item, caption: captionValue } : item))
        );
    };

    const handleRemoveImage = (index: number) => {
        const updatedFiles = data.images.filter((_, i) => i !== index);
        const updatedCaptions = data.captions.filter((_, i) => i !== index);

        setData((prev) => ({
            ...prev,
            images: updatedFiles,
            captions: updatedCaptions,
        }));

        if (imagePreviews[index]) {
            URL.revokeObjectURL(imagePreviews[index].url);
        }
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        transform((formData) => ({
            ...formData,
            price_per_unit: formData.price_per_unit || computedPricePerUnit || '',
        }));

        post(listings.store.url(), {
            onSuccess: () => {
                toast.success('Land listing published successfully!');
            },
            onError: () => {
                toast.error(
                    'Failed to publish listing. Please check the form errors below.',
                );
            },
        });
    };

    const hasValidationErrors = Object.keys(errors).length > 0;

    return (
        <div className="mx-auto max-w-4xl space-y-6 sm:space-y-8 p-3 sm:p-6 md:p-8">
            {/* Header section */}
            <div className="flex flex-col gap-3 pb-4 border-b sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0"
                            onClick={() => router.get(listings.index.url())}
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl md:text-3xl">
                            Create New Land Listing
                        </h1>
                    </div>
                    <p className="mt-1 text-xs sm:text-sm text-muted-foreground pl-10 sm:pl-10">
                        Fill in land specifications, legal documentation, location, pricing, GIS boundaries, and photo gallery.
                    </p>
                </div>

                {/* Minimal Real-time Auto-Save Status Icons */}
                <div className="flex items-center gap-2 self-start sm:self-auto pl-10 sm:pl-0">
                    {autoSaveStatus === 'saving' && (
                        <div title="Saving draft..." className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/60 border text-xs text-muted-foreground">
                            <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                            <span className="text-[11px] sm:inline">Saving draft...</span>
                        </div>
                    )}
                    {autoSaveStatus === 'saved' && (
                        <div title="Draft saved" className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                            <span className="text-[11px]">Draft saved</span>
                        </div>
                    )}
                    {autoSaveStatus === 'error' && (
                        <div title="Auto-save failed" className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-xs text-red-600 dark:text-red-400">
                            <AlertCircle className="h-3.5 w-3.5 text-red-500" />
                            <span className="text-[11px]">Auto-save failed</span>
                        </div>
                    )}
                    <Badge variant="outline" className="gap-1 text-xs py-1 px-3 w-fit hidden md:inline-flex">
                        <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                        Land & Property System
                    </Badge>
                </div>
            </div>

            {/* Error summary banner if validation failed */}
            {hasValidationErrors && (
                <Alert variant="destructive" className="border-red-500/50 bg-red-500/10">
                    <AlertTriangle className="h-5 w-5" />
                    <AlertTitle className="font-semibold">Form Validation Errors</AlertTitle>
                    <AlertDescription className="mt-1 text-sm">
                        Please review the highlighted fields below before submitting the form.
                    </AlertDescription>
                </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-8 sm:space-y-10">
                {/* Section 1: Basic Information & Category */}
                <section className="space-y-4 sm:space-y-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Tag className="h-5 w-5 text-primary shrink-0" />
                            <h2 className="text-lg sm:text-xl font-bold tracking-tight">1. Basic Information & Category</h2>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground pl-7">
                            Define the property title, category, seller relationship, and overview description.
                        </p>
                    </div>

                    <div className="space-y-5 sm:space-y-6 pt-1">
                        {/* Listing Title */}
                        <div className="space-y-2">
                            <Label htmlFor="title" className="font-semibold text-sm">
                                Listing Title <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="title"
                                placeholder="e.g. 5,000 sqm Prime Agricultural Farm Lot with Clean Title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className={`h-10 text-sm ${errors.title ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                            />
                            <InputError message={errors.title} />
                        </div>

                        {/* Category selection */}
                        <div className="space-y-2">
                            <Label htmlFor="listing_category" className="font-semibold text-sm">
                                Property Category <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={data.listing_category}
                                onValueChange={(val) => setData('listing_category', val)}
                            >
                                <SelectTrigger
                                    id="listing_category"
                                    className={`h-10 text-sm ${errors.listing_category ? 'border-red-500' : ''}`}
                                >
                                    <SelectValue placeholder="Select a pre-defined land category" />
                                </SelectTrigger>
                                <SelectContent className="max-h-60 overflow-y-auto">
                                    {listingCategories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id}>
                                            <div className="flex flex-col py-0.5">
                                                <span className="font-medium">{cat.name}</span>
                                                <span className="text-xs text-muted-foreground">{cat.description}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.listing_category} />
                        </div>

                        {/* Seller Relationship (Uniform Flat Pills) */}
                        <div className="space-y-2">
                            <Label className="font-semibold text-sm">
                                Seller Relationship <span className="text-red-500">*</span>
                            </Label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                {[
                                    { id: 'owner', label: 'Property Owner', icon: UserCheck },
                                    { id: 'agent', label: 'Real Estate Agent', icon: Building2 },
                                    { id: 'broker', label: 'Licensed Broker', icon: ShieldCheck },
                                ].map((type) => {
                                    const Icon = type.icon;
                                    const isSelected = data.seller_type === type.id;
                                    return (
                                        <button
                                            type="button"
                                            key={type.id}
                                            onClick={() => setData('seller_type', type.id as SellerType)}
                                            className={getFlatPillClass(isSelected)}
                                        >
                                            <Icon className="h-4 w-4 shrink-0" />
                                            <span>{type.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                            <InputError message={errors.seller_type} />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description" className="font-semibold text-sm">
                                Description
                            </Label>
                            <Textarea
                                id="description"
                                rows={4}
                                placeholder="Describe the land features, access to roads, water/electricity access, nearby landmarks..."
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className={`text-sm ${errors.description ? 'border-red-500' : ''}`}
                            />
                            <InputError message={errors.description} />
                        </div>
                    </div>
                </section>

                <Separator />

                {/* Section 2: Physical & Legal Characteristics */}
                <section className="space-y-4 sm:space-y-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Layers className="h-5 w-5 text-primary shrink-0" />
                            <h2 className="text-lg sm:text-xl font-bold tracking-tight">2. Land Characteristics & Legal Status</h2>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground pl-7">
                            Specify physical land classification, size, topography, and title status.
                        </p>
                    </div>

                    <div className="space-y-5 sm:space-y-6 pt-1">
                        {/* Land Type (Uniform Flat Pills) */}
                        <div className="space-y-2">
                            <Label className="font-semibold text-sm">
                                Land Type Classification <span className="text-red-500">*</span>
                            </Label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                                {[
                                    { id: 'residential', label: 'Residential' },
                                    { id: 'agricultural', label: 'Agricultural' },
                                    { id: 'commercial', label: 'Commercial' },
                                    { id: 'industrial', label: 'Industrial' },
                                    { id: 'raw_land', label: 'Raw Land' },
                                ].map((type) => {
                                    const isSelected = data.land_type === type.id;
                                    return (
                                        <button
                                            type="button"
                                            key={type.id}
                                            onClick={() => setData('land_type', type.id as LandType)}
                                            className={getFlatPillClass(isSelected)}
                                        >
                                            {type.label}
                                        </button>
                                    );
                                })}
                            </div>
                            <InputError message={errors.land_type} />
                        </div>

                        {/* Land Area and Unit */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div className="space-y-2 sm:col-span-2">
                                <Label htmlFor="area" className="font-semibold text-sm">
                                    Total Land Area <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                    <Maximize2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="area"
                                        type="number"
                                        step="any"
                                        min="0"
                                        placeholder="e.g. 5000"
                                        value={data.area}
                                        onChange={(e) => setData('area', e.target.value)}
                                        className={`pl-9 h-10 text-sm ${errors.area ? 'border-red-500' : ''}`}
                                    />
                                </div>
                                <InputError message={errors.area} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="area_unit" className="font-semibold text-sm">
                                    Area Unit <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={data.area_unit}
                                    onValueChange={(val) => setData('area_unit', val as AreaUnit)}
                                >
                                    <SelectTrigger id="area_unit" className={`h-10 text-sm ${errors.area_unit ? 'border-red-500' : ''}`}>
                                        <SelectValue placeholder="Select unit" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="sqm">Square Meters (sqm)</SelectItem>
                                        <SelectItem value="hectare">Hectares (ha)</SelectItem>
                                        <SelectItem value="sqft">Square Feet (sqft)</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.area_unit} />
                            </div>
                        </div>

                        {/* Topography (Uniform Flat Pills) */}
                        <div className="space-y-2">
                            <Label className="font-semibold text-sm flex items-center gap-1.5">
                                <Mountain className="h-4 w-4 text-muted-foreground shrink-0" /> Topography
                            </Label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                {[
                                    { id: 'flat', label: 'Flat / Level' },
                                    { id: 'sloped', label: 'Sloped / Rolling' },
                                    { id: 'hilly', label: 'Hilly Terrain' },
                                    { id: 'mountainous', label: 'Mountainous' },
                                ].map((topo) => {
                                    const isSelected = data.topography === topo.id;
                                    return (
                                        <button
                                            type="button"
                                            key={topo.id}
                                            onClick={() => setData('topography', topo.id as Topography)}
                                            className={getFlatPillClass(isSelected)}
                                        >
                                            {topo.label}
                                        </button>
                                    );
                                })}
                            </div>
                            <InputError message={errors.topography} />
                        </div>

                        {/* Legal & Title Status */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label className="font-semibold text-sm flex items-center gap-1.5">
                                    <FileCheck className="h-4 w-4 text-muted-foreground shrink-0" /> Title / Legal Status{' '}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={data.title_status}
                                    onValueChange={(val) => setData('title_status', val as TitleStatus)}
                                >
                                    <SelectTrigger className={`h-10 text-sm ${errors.title_status ? 'border-red-500' : ''}`}>
                                        <SelectValue placeholder="Select title status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="clean_title">Clean Title (OCT/TCT)</SelectItem>
                                        <SelectItem value="tax_declaration">Tax Declaration</SelectItem>
                                        <SelectItem value="mother_title">Mother Title</SelectItem>
                                        <SelectItem value="rights">Possessory Rights</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.title_status} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="parcel_number" className="font-semibold text-sm">
                                    Parcel / Lot / TCT Number
                                </Label>
                                <Input
                                    id="parcel_number"
                                    placeholder="e.g. TCT No. 123-45678"
                                    value={data.parcel_number}
                                    onChange={(e) => setData('parcel_number', e.target.value)}
                                    className={`h-10 text-sm ${errors.parcel_number ? 'border-red-500' : ''}`}
                                />
                                <InputError message={errors.parcel_number} />
                            </div>
                        </div>
                    </div>
                </section>

                <Separator />

                {/* Section 3: Location Details & GIS Map Boundaries */}
                <section className="space-y-4 sm:space-y-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-primary shrink-0" />
                            <h2 className="text-lg sm:text-xl font-bold tracking-tight">3. Location Details & GIS Map Boundaries</h2>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground pl-7">
                            Pin the center property location, switch map views (street / satellite), and draw boundary shapes on the map.
                        </p>
                    </div>

                    <div className="space-y-5 sm:space-y-6 pt-1">
                        {/* Interactive React Leaflet Map Input & Boundary Polygon Drawer */}
                        <div className="space-y-2">
                            <Label className="font-semibold text-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
                                <span className="flex items-center gap-1.5">
                                    <MapPin className="h-4 w-4 text-emerald-600 shrink-0" /> Interactive GIS Location & Perimeter Map
                                </span>
                                {data.boundary_coordinates.length > 0 && (
                                    <Badge variant="secondary" className="gap-1 text-xs font-mono w-fit">
                                        <PolygonIcon className="h-3 w-3 text-emerald-500" />
                                        {data.boundary_coordinates.length} Boundary Corners Pinned
                                    </Badge>
                                )}
                            </Label>
                            <LocationPickerMap
                                latitude={data.latitude ? Number(data.latitude) : null}
                                longitude={data.longitude ? Number(data.longitude) : null}
                                boundaryCoordinates={data.boundary_coordinates}
                                onChange={(lat, lng, addressDetails) => {
                                    setData((prev) => ({
                                        ...prev,
                                        latitude: lat.toFixed(7),
                                        longitude: lng.toFixed(7),
                                        province: addressDetails?.province ? addressDetails.province : prev.province,
                                        city_municipality: addressDetails?.city ? addressDetails.city : prev.city_municipality,
                                        barangay: addressDetails?.barangay ? addressDetails.barangay : prev.barangay,
                                    }));
                                }}
                                onBoundaryChange={(coords) => {
                                    setData('boundary_coordinates', coords);
                                }}
                                onReset={() => {
                                    setData((prev) => ({
                                        ...prev,
                                        latitude: '',
                                        longitude: '',
                                        province: '',
                                        city_municipality: '',
                                        barangay: '',
                                        address_line: '',
                                        zip_code: '',
                                        boundary_coordinates: [],
                                    }));
                                    toast.info('Map pin, location coordinates, and boundary polygon reset.');
                                }}
                            />

                            {/* Coordinates Information Display */}
                            {data.latitude && data.longitude ? (
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border bg-emerald-500/10 px-3.5 py-2.5 text-xs font-medium text-emerald-700 dark:text-emerald-300 mt-2">
                                    <span className="flex items-center gap-1.5 font-mono">
                                        <Compass className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                                        <span>Pinned Center GPS: <strong>{data.latitude}</strong>, <strong>{data.longitude}</strong></span>
                                    </span>
                                    <Badge variant="outline" className="bg-background text-[10px] text-emerald-600 border-emerald-500/30 w-fit">
                                        Auto-Pinned from Map
                                    </Badge>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground italic mt-1.5">
                                    <MapPin className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                                    <span>Click anywhere on the interactive map above or search a location to automatically set property coordinates.</span>
                                </div>
                            )}
                            {(errors.latitude || errors.longitude) && (
                                <InputError message={errors.latitude || errors.longitude} />
                            )}
                        </div>

                        {/* Address Fields */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {/* Province */}
                            <div className="space-y-2">
                                <Label htmlFor="province" className="font-semibold text-sm">
                                    Province <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="province"
                                    placeholder="e.g. Cavite, Batangas, Cebu"
                                    value={data.province}
                                    onChange={(e) => setData('province', e.target.value)}
                                    className={`h-10 text-sm ${errors.province ? 'border-red-500' : ''}`}
                                />
                                <InputError message={errors.province} />
                            </div>

                            {/* City / Municipality */}
                            <div className="space-y-2">
                                <Label htmlFor="city_municipality" className="font-semibold text-sm">
                                    City / Municipality <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="city_municipality"
                                    placeholder="e.g. Tagaytay City"
                                    value={data.city_municipality}
                                    onChange={(e) => setData('city_municipality', e.target.value)}
                                    className={`h-10 text-sm ${errors.city_municipality ? 'border-red-500' : ''}`}
                                />
                                <InputError message={errors.city_municipality} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            {/* Barangay */}
                            <div className="space-y-2 sm:col-span-2">
                                <Label htmlFor="barangay" className="font-semibold text-sm">
                                    Barangay
                                </Label>
                                <Input
                                    id="barangay"
                                    placeholder="e.g. Brgy. Sungay East"
                                    value={data.barangay}
                                    onChange={(e) => setData('barangay', e.target.value)}
                                    className={`h-10 text-sm ${errors.barangay ? 'border-red-500' : ''}`}
                                />
                                <InputError message={errors.barangay} />
                            </div>

                            {/* Zip Code */}
                            <div className="space-y-2">
                                <Label htmlFor="zip_code" className="font-semibold text-sm">
                                    Zip Code
                                </Label>
                                <Input
                                    id="zip_code"
                                    placeholder="e.g. 4120"
                                    value={data.zip_code}
                                    onChange={(e) => setData('zip_code', e.target.value)}
                                    className={`h-10 text-sm ${errors.zip_code ? 'border-red-500' : ''}`}
                                />
                                <InputError message={errors.zip_code} />
                            </div>
                        </div>

                        {/* Street / Address Line */}
                        <div className="space-y-2">
                            <Label htmlFor="address_line" className="font-semibold text-sm">
                                Street Address / Landmark
                            </Label>
                            <Input
                                id="address_line"
                                placeholder="e.g. Santa Rosa - Tagaytay Road near Caleruega"
                                value={data.address_line}
                                onChange={(e) => setData('address_line', e.target.value)}
                                className={`h-10 text-sm ${errors.address_line ? 'border-red-500' : ''}`}
                            />
                            <InputError message={errors.address_line} />
                        </div>
                    </div>
                </section>

                <Separator />

                {/* Section 4: Pricing & Terms */}
                <section className="space-y-4 sm:space-y-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Coins className="h-5 w-5 text-primary shrink-0" />
                            <h2 className="text-lg sm:text-xl font-bold tracking-tight">4. Pricing & Payment Terms</h2>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground pl-7">
                            Set the selling price, currency, payment options, and installment arrangements.
                        </p>
                    </div>

                    <div className="space-y-5 sm:space-y-6 pt-1">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            {/* Total Price */}
                            <div className="space-y-2 sm:col-span-2">
                                <Label htmlFor="price" className="font-semibold text-sm">
                                    Total Listing Price <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-sm font-semibold text-muted-foreground">
                                        {selectedCurrencySymbol}
                                    </span>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="any"
                                        min="0"
                                        placeholder="e.g. 15000000"
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        className={`pl-8 h-10 text-sm ${errors.price ? 'border-red-500' : ''}`}
                                    />
                                </div>
                                <InputError message={errors.price} />
                            </div>

                            {/* Currency Selection from country-data-list */}
                            <div className="space-y-2">
                                <Label htmlFor="currency" className="font-semibold text-sm">
                                    Currency <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={data.currency}
                                    onValueChange={(val) => setData('currency', val)}
                                >
                                    <SelectTrigger id="currency" className={`h-10 text-sm ${errors.currency ? 'border-red-500' : ''}`}>
                                        <SelectValue placeholder="Select currency" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-60 overflow-y-auto">
                                        {currencyList.map((curr: CurrencyItem) => (
                                            <SelectItem key={curr.code} value={curr.code}>
                                                {curr.code} - {curr.name} ({curr.symbol || curr.code})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.currency} />
                            </div>
                        </div>

                        {/* Price per unit preview / override */}
                        <div className="flex flex-col gap-3 rounded-xl border bg-muted/30 p-3.5 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                                <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                                <span className="font-medium">Estimated Price per Unit:</span>
                                <Badge variant="secondary" className="font-mono text-xs sm:text-sm">
                                    {computedPricePerUnit
                                        ? `${selectedCurrencySymbol} ${Number(computedPricePerUnit).toLocaleString()} / ${data.area_unit}`
                                        : 'Enter price and area'}
                                </Badge>
                            </div>
                            <div className="flex items-center space-x-2 pt-1 sm:pt-0">
                                <Checkbox
                                    id="is_negotiable"
                                    checked={data.is_negotiable}
                                    onCheckedChange={(checked) => setData('is_negotiable', Boolean(checked))}
                                />
                                <Label htmlFor="is_negotiable" className="text-xs sm:text-sm font-medium cursor-pointer">
                                    Price is Negotiable
                                </Label>
                            </div>
                        </div>

                        {/* Payment Terms (Uniform Flat Pills) */}
                        <div className="space-y-2">
                            <Label className="font-semibold text-sm">
                                Payment Terms <span className="text-red-500">*</span>
                            </Label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                {[
                                    { id: 'full', label: 'Full Cash Payment' },
                                    { id: 'monthly', label: 'Monthly Installment' },
                                    { id: 'yearly', label: 'Yearly Installment' },
                                ].map((term) => {
                                    const isSelected = data.payment_terms === term.id;
                                    return (
                                        <button
                                            type="button"
                                            key={term.id}
                                            onClick={() => setData('payment_terms', term.id as 'full' | 'monthly' | 'yearly')}
                                            className={getFlatPillClass(isSelected)}
                                        >
                                            {term.label}
                                        </button>
                                    );
                                })}
                            </div>
                            <InputError message={errors.payment_terms} />
                        </div>

                        {/* Conditional Installment Fields */}
                        {data.payment_terms !== 'full' && (
                            <div className="rounded-xl border bg-muted/20 p-3.5 sm:p-4 space-y-4">
                                <h4 className="text-xs sm:text-sm font-semibold flex items-center gap-1.5">
                                    <Sparkles className="h-4 w-4 text-primary shrink-0" /> Installment Breakdown
                                </h4>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="down_payment" className="font-semibold text-xs sm:text-sm">
                                            Down Payment <span className="text-red-500">*</span>
                                        </Label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-2.5 text-sm text-muted-foreground">
                                                {selectedCurrencySymbol}
                                            </span>
                                            <Input
                                                id="down_payment"
                                                type="number"
                                                step="any"
                                                min="0"
                                                placeholder="e.g. 3000000"
                                                value={data.down_payment}
                                                onChange={(e) => setData('down_payment', e.target.value)}
                                                className={`pl-8 h-10 text-sm ${errors.down_payment ? 'border-red-500' : ''}`}
                                            />
                                        </div>
                                        <InputError message={errors.down_payment} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="installment_count" className="font-semibold text-xs sm:text-sm">
                                            No. of {data.payment_terms === 'monthly' ? 'Months' : 'Years'}{' '}
                                            <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="installment_count"
                                            type="number"
                                            min="1"
                                            placeholder={data.payment_terms === 'monthly' ? 'e.g. 24' : 'e.g. 5'}
                                            value={data.installment_count}
                                            onChange={(e) => setData('installment_count', e.target.value)}
                                            className={`h-10 text-sm ${errors.installment_count ? 'border-red-500' : ''}`}
                                        />
                                        <InputError message={errors.installment_count} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="installment_amount" className="font-semibold text-xs sm:text-sm">
                                            Approx. Amount per Period
                                        </Label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-2.5 text-sm text-muted-foreground">
                                                {selectedCurrencySymbol}
                                            </span>
                                            <Input
                                                id="installment_amount"
                                                type="number"
                                                step="any"
                                                min="0"
                                                placeholder="e.g. 50000"
                                                value={data.installment_amount}
                                                onChange={(e) => setData('installment_amount', e.target.value)}
                                                className={`pl-8 h-10 text-sm ${errors.installment_amount ? 'border-red-500' : ''}`}
                                            />
                                        </div>
                                        <InputError message={errors.installment_amount} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                <Separator />

                {/* Section 5: Property Photos & Captions */}
                <section className="space-y-4 sm:space-y-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <UploadCloud className="h-5 w-5 text-primary shrink-0" />
                            <h2 className="text-lg sm:text-xl font-bold tracking-tight">5. Property Photos & Captions</h2>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground pl-7">
                            Upload high-resolution land photos, aerial drone views, or boundary blueprints. Add a caption for each photo. (Max 10 photos)
                        </p>
                    </div>

                    <div className="space-y-5 sm:space-y-6 pt-1">
                        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-muted-foreground/30 p-5 sm:p-8 text-center hover:border-primary/50 transition-colors bg-muted/10">
                            <Camera className="h-8 sm:h-10 w-8 sm:w-10 text-muted-foreground mb-2" />
                            <p className="text-xs sm:text-sm font-semibold">Click to upload property images</p>
                            <p className="text-[11px] sm:text-xs text-muted-foreground mt-1">PNG, JPG, JPEG, WEBP up to 5MB each. Direct cloud bucket storage.</p>
                            <input
                                type="file"
                                multiple
                                accept="image/png, image/jpeg, image/jpg, image/webp"
                                onChange={handleImageChange}
                                className="hidden"
                                id="image-upload"
                            />
                            <Label
                                htmlFor="image-upload"
                                className="mt-4 cursor-pointer inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs sm:text-sm font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 w-full sm:w-auto min-h-[40px]"
                            >
                                <UploadCloud className="h-4 w-4" /> Select Files
                            </Label>
                        </div>

                        {/* Image upload errors */}
                        {errors.images && <InputError message={errors.images} />}
                        {errors['images.0'] && <InputError message={errors['images.0']} />}

                        {/* Image Previews & Captions List */}
                        {imagePreviews.length > 0 && (
                            <div className="space-y-4">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Uploaded Photos & Captions ({imagePreviews.length} / 10)
                                </Label>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {imagePreviews.map((preview, index) => (
                                        <div
                                            key={index}
                                            className="flex flex-col gap-3 rounded-xl border p-3 bg-card shadow-xs"
                                        >
                                            <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
                                                <img
                                                    src={preview.url}
                                                    alt={`Photo ${index + 1}`}
                                                    className="h-full w-full object-cover"
                                                />
                                                {index === 0 ? (
                                                    <Badge className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] py-0.5 px-2">
                                                        Primary Photo
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary" className="absolute top-2 left-2 text-[10px]">
                                                        Photo #{index + 1}
                                                    </Badge>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveImage(index)}
                                                    className="absolute top-2 right-2 rounded-full bg-red-600 p-1.5 text-white shadow-xs hover:bg-red-700 transition-colors"
                                                    title="Remove Image"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <div className="space-y-1">
                                                <Label htmlFor={`caption-${index}`} className="text-xs font-medium text-muted-foreground">
                                                    Caption for Photo #{index + 1}
                                                </Label>
                                                <Input
                                                    id={`caption-${index}`}
                                                    placeholder="e.g. Front elevation view, Drone boundary outline..."
                                                    value={preview.caption}
                                                    onChange={(e) => handleCaptionChange(index, e.target.value)}
                                                    className="text-xs h-9 sm:h-8"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                <Separator />

                {/* Form Actions */}
                <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center sm:justify-end gap-3 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        disabled={processing}
                        onClick={() => router.get(listings.index.url())}
                        className="w-full sm:w-auto text-sm min-h-[42px] sm:min-h-[38px] rounded-xl"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={processing}
                        className="w-full sm:w-auto gap-2 px-6 font-semibold text-sm min-h-[42px] sm:min-h-[38px] rounded-xl"
                    >
                        {processing ? (
                            <>
                                <Sparkles className="h-4 w-4 animate-spin" /> Publishing Listing...
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="h-4 w-4" /> Publish Land Listing
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}

CreateListing.layout = {
    head: { title: 'Create New Land Listing' },
    breadcrumbs: [
        {
            title: 'Listings',
            href: listings.index.url(),
        },
        {
            title: 'Create New',
            href: listings.new.url(),
        },
    ],
};
