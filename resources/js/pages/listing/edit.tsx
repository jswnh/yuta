import { SyntheticEvent, useMemo, useState } from 'react';
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
    AlertTriangle,
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
import type { AreaUnit, LandType, LatLngCoordinate, Listing, ListingImage, SellerType, TitleStatus, Topography } from '@/types/listing';

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

interface EditListingProps {
    listing: Listing & {
        images?: ListingImage[];
    };
}

export default function EditListing({ listing }: EditListingProps) {
    const existingListingImages = listing.images || [];

    // Track active existing images displayed on screen
    const [existingImages, setExistingImages] = useState<ListingImage[]>(existingListingImages);
    const [newImagePreviews, setNewImagePreviews] = useState<ImagePreview[]>([]);

    // Initialize existing captions map
    const initialExistingCaptions: Record<string, string> = {};
    existingListingImages.forEach((img) => {
        initialExistingCaptions[img.image_id] = img.caption || '';
    });

    const { data, setData, post, processing, errors, transform } = useForm({
        seller_type: (listing.seller_type || 'owner') as SellerType,
        title: listing.title || '',
        listing_category: listing.listing_category || '',
        description: listing.description || '',
        price: listing.price ? String(listing.price) : '',
        currency: listing.currency || 'PHP',
        is_negotiable: Boolean(listing.is_negotiable ?? false),
        price_per_unit: listing.price_per_unit ? String(listing.price_per_unit) : '',
        payment_terms: ((listing.payment_terms as string) || 'full') as 'full' | 'monthly' | 'yearly',
        down_payment: listing.down_payment ? String(listing.down_payment) : '',
        installment_count: listing.installment_count ? String(listing.installment_count) : '',
        installment_amount: listing.installment_amount ? String(listing.installment_amount) : '',
        area: listing.area ? String(listing.area) : '',
        area_unit: ((listing.area_unit as string) || 'sqm') as AreaUnit,
        land_type: ((listing.land_type as string) || 'raw_land') as LandType,
        topography: ((listing.topography as string) || 'flat') as Topography,
        title_status: ((listing.title_status as string) || 'clean_title') as TitleStatus,
        parcel_number: listing.parcel_number || '',
        address_line: listing.address_line || '',
        barangay: listing.barangay || '',
        city_municipality: listing.city_municipality || '',
        province: listing.province || '',
        region: listing.region || '',
        zip_code: listing.zip_code || '',
        latitude: listing.latitude !== null && listing.latitude !== undefined ? String(listing.latitude) : '',
        longitude: listing.longitude !== null && listing.longitude !== undefined ? String(listing.longitude) : '',
        boundary_coordinates: (listing.boundary_coordinates || []) as LatLngCoordinate[],
        deleted_image_ids: [] as string[],
        existing_captions: initialExistingCaptions,
        images: [] as File[],
        captions: [] as string[],
    });

    const hasValidationErrors = Object.keys(errors).length > 0;

    // Responsive Flat Pill Styling Helper
    const getFlatPillClass = (isSelected: boolean) =>
        `inline-flex items-center justify-center gap-2 rounded-xl px-3.5 py-2.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium transition-all cursor-pointer text-center select-none min-h-[42px] sm:min-h-[38px] w-full ${
            isSelected
                ? 'bg-primary text-primary-foreground font-semibold shadow-xs ring-2 ring-primary/20 scale-[1.01]'
                : 'border border-input bg-card text-muted-foreground hover:bg-accent/60 hover:text-foreground hover:border-accent'
        }`;

    // Currency list from country-data-list
    const currencyList = useMemo<CurrencyItem[]>(() => {
        if (!AllCurrencies || !AllCurrencies.all) return [];
        return (AllCurrencies.all as CurrencyItem[])
            .filter((c: CurrencyItem) => c && c.code && c.name && c.code.length === 3)
            .sort((a: CurrencyItem, b: CurrencyItem) => a.code.localeCompare(b.code));
    }, []);

    // Selected currency symbol
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

    // Existing image caption update handler
    const handleExistingCaptionChange = (imageId: string, caption: string) => {
        setData('existing_captions', {
            ...data.existing_captions,
            [imageId]: caption,
        });

        setExistingImages((prev) =>
            prev.map((img) => (img.image_id === imageId ? { ...img, caption } : img))
        );
    };

    // Existing image deletion handler
    const handleDeleteExistingImage = (imageId: string) => {
        const updatedDeletedIds = [...data.deleted_image_ids, imageId];
        const updatedCaptions = { ...data.existing_captions };
        delete updatedCaptions[imageId];

        setData((prev) => ({
            ...prev,
            deleted_image_ids: updatedDeletedIds,
            existing_captions: updatedCaptions,
        }));

        setExistingImages((prev) => prev.filter((img) => img.image_id !== imageId));
        toast.info('Image marked for deletion upon saving.');
    };

    // New images upload handler
    const handleNewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const selectedFiles = Array.from(e.target.files);
        const validFiles: File[] = [];

        for (const file of selectedFiles) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error(`"${file.name}" is larger than 2MB limit per file.`);
                continue;
            }
            if (!file.type.startsWith('image/')) {
                toast.error(`"${file.name}" is not a valid image file.`);
                continue;
            }
            validFiles.push(file);
        }

        if (validFiles.length === 0) return;

        const maxTotal = 10 - existingImages.length;
        const finalNewFiles = [...data.images, ...validFiles].slice(0, Math.max(0, maxTotal));
        const finalNewCaptions = [...data.captions, ...validFiles.map(() => '')].slice(0, Math.max(0, maxTotal));

        setData((prev) => ({
            ...prev,
            images: finalNewFiles,
            captions: finalNewCaptions,
        }));

        const newPreviews: ImagePreview[] = finalNewFiles.map((file, idx) => ({
            file,
            url: URL.createObjectURL(file),
            caption: finalNewCaptions[idx] || '',
        }));
        setNewImagePreviews(newPreviews);
    };

    const handleNewCaptionChange = (index: number, captionValue: string) => {
        const updatedCaptions = [...data.captions];
        updatedCaptions[index] = captionValue;
        setData('captions', updatedCaptions);

        setNewImagePreviews((prev) =>
            prev.map((item, i) => (i === index ? { ...item, caption: captionValue } : item))
        );
    };

    const handleRemoveNewImage = (index: number) => {
        const updatedFiles = data.images.filter((_, i) => i !== index);
        const updatedCaptions = data.captions.filter((_, i) => i !== index);

        setData((prev) => ({
            ...prev,
            images: updatedFiles,
            captions: updatedCaptions,
        }));

        if (newImagePreviews[index]) {
            URL.revokeObjectURL(newImagePreviews[index].url);
        }
        setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        transform((formData) => ({
            ...formData,
            price_per_unit: formData.price_per_unit || computedPricePerUnit || '',
        }));

        post(listings.update.url({ listing: listing.listing_id }), {
            onSuccess: () => {
                toast.success('Land listing updated successfully!');
            },
            onError: () => {
                toast.error('Failed to update listing. Please check the form errors below.');
            },
        });
    };

    return (
        <div className="mx-auto max-w-4xl space-y-6 sm:space-y-8 px-4 py-6 sm:px-6 sm:py-10">
            {/* Header Title Section */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b pb-4 sm:pb-6">
                <div className="space-y-1">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => router.get(listings.index.url())}
                        className="-ml-2.5 mb-1 h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" /> Back to My Listings
                    </Button>
                    <div className="flex items-center gap-2.5 flex-wrap">
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                            Edit Land Listing
                        </h1>
                        <Badge variant="outline" className="text-xs font-mono">
                            {listing.listing_id.slice(0, 8)}...
                        </Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                        Update property specifications, pricing, legal details, perimeter map, and photos.
                    </p>
                </div>
            </div>

            {/* Error Validation Alert Banner */}
            {hasValidationErrors && (
                <Alert variant="destructive" className="border-red-500/50 bg-red-500/10">
                    <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    <AlertTitle className="font-semibold">Form Validation Errors</AlertTitle>
                    <AlertDescription className="mt-1 text-sm text-red-700 dark:text-red-300">
                        Please review the highlighted fields below before updating the listing.
                    </AlertDescription>
                </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-8 sm:space-y-10">
                {/* SECTION 1: BASIC INFORMATION & CATEGORY */}
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
                        {/* Title */}
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

                {/* SECTION 2: LAND CHARACTERISTICS & LEGAL STATUS */}
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
                        {/* Area & Unit Selector */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="sm:col-span-2 space-y-2">
                                <Label htmlFor="area" className="font-semibold text-sm">
                                    Total Land Area <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="area"
                                    type="number"
                                    step="any"
                                    placeholder="e.g. 5000"
                                    value={data.area}
                                    onChange={(e) => setData('area', e.target.value)}
                                    className={`h-10 text-sm ${errors.area ? 'border-red-500' : ''}`}
                                />
                                <InputError message={errors.area} />
                            </div>

                            <div className="space-y-2">
                                <Label className="font-semibold text-sm">
                                    Area Unit <span className="text-red-500">*</span>
                                </Label>
                                <div className="grid grid-cols-3 gap-1.5">
                                    {[
                                        { id: 'sqm', label: 'sqm' },
                                        { id: 'hectare', label: 'ha' },
                                        { id: 'sqft', label: 'sqft' },
                                    ].map((unit) => (
                                        <button
                                            type="button"
                                            key={unit.id}
                                            onClick={() => setData('area_unit', unit.id as AreaUnit)}
                                            className={getFlatPillClass(data.area_unit === unit.id)}
                                        >
                                            <span>{unit.label}</span>
                                        </button>
                                    ))}
                                </div>
                                <InputError message={errors.area_unit} />
                            </div>
                        </div>

                        {/* Land Classification Pills */}
                        <div className="space-y-2">
                            <Label className="font-semibold text-sm">
                                Land Classification <span className="text-red-500">*</span>
                            </Label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                                {[
                                    { id: 'raw_land', label: 'Raw Land' },
                                    { id: 'agricultural', label: 'Agricultural' },
                                    { id: 'residential', label: 'Residential' },
                                    { id: 'commercial', label: 'Commercial' },
                                    { id: 'industrial', label: 'Industrial' },
                                ].map((type) => (
                                    <button
                                        type="button"
                                        key={type.id}
                                        onClick={() => setData('land_type', type.id as LandType)}
                                        className={getFlatPillClass(data.land_type === type.id)}
                                    >
                                        <span>{type.label}</span>
                                    </button>
                                ))}
                            </div>
                            <InputError message={errors.land_type} />
                        </div>

                        {/* Topography Pills */}
                        <div className="space-y-2">
                            <Label className="font-semibold text-sm">Topography</Label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {[
                                    { id: 'flat', label: 'Flat / Level', icon: Maximize2 },
                                    { id: 'sloped', label: 'Gently Sloped', icon: Mountain },
                                    { id: 'hilly', label: 'Hilly / Rolling', icon: Mountain },
                                    { id: 'mountainous', label: 'Mountainous', icon: Mountain },
                                ].map((topo) => {
                                    const Icon = topo.icon;
                                    return (
                                        <button
                                            type="button"
                                            key={topo.id}
                                            onClick={() => setData('topography', topo.id as Topography)}
                                            className={getFlatPillClass(data.topography === topo.id)}
                                        >
                                            <Icon className="h-4 w-4 shrink-0" />
                                            <span>{topo.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                            <InputError message={errors.topography} />
                        </div>

                        {/* Title Status Pills */}
                        <div className="space-y-2">
                            <Label className="font-semibold text-sm">
                                Legal Title Status <span className="text-red-500">*</span>
                            </Label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                                {[
                                    { id: 'clean_title', label: 'Clean Title (OCT/TCT)', icon: ShieldCheck },
                                    { id: 'tax_declaration', label: 'Tax Declaration', icon: FileText },
                                    { id: 'mother_title', label: 'Mother Title', icon: FileCheck },
                                    { id: 'rights', label: 'Possessory Rights', icon: FileText },
                                ].map((status) => {
                                    const Icon = status.icon;
                                    return (
                                        <button
                                            type="button"
                                            key={status.id}
                                            onClick={() => setData('title_status', status.id as TitleStatus)}
                                            className={getFlatPillClass(data.title_status === status.id)}
                                        >
                                            <Icon className="h-4 w-4 shrink-0" />
                                            <span>{status.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                            <InputError message={errors.title_status} />
                        </div>

                        {/* Parcel Number */}
                        <div className="space-y-2">
                            <Label htmlFor="parcel_number" className="font-semibold text-sm">
                                Parcel / Lot Number (Optional)
                            </Label>
                            <Input
                                id="parcel_number"
                                placeholder="e.g. Lot 14-B PSD-07-012345 or Tax Dec No. 2024-001"
                                value={data.parcel_number}
                                onChange={(e) => setData('parcel_number', e.target.value)}
                                className="h-10 text-sm"
                            />
                            <InputError message={errors.parcel_number} />
                        </div>
                    </div>
                </section>

                <Separator />

                {/* SECTION 3: GIS LOCATION & INTERACTIVE MAP */}
                <section className="space-y-4 sm:space-y-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-primary shrink-0" />
                            <h2 className="text-lg sm:text-xl font-bold tracking-tight">3. GIS Location & Interactive Map</h2>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground pl-7">
                            Pin exact center coordinates or draw the property boundary polygon.
                        </p>
                    </div>

                    <div className="space-y-5 sm:space-y-6 pt-1">
                        {/* Address Fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="province" className="font-semibold text-sm">
                                    Province <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="province"
                                    placeholder="e.g. Cebu"
                                    value={data.province}
                                    onChange={(e) => setData('province', e.target.value)}
                                    className={`h-10 text-sm ${errors.province ? 'border-red-500' : ''}`}
                                />
                                <InputError message={errors.province} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="city_municipality" className="font-semibold text-sm">
                                    City / Municipality <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="city_municipality"
                                    placeholder="e.g. Danao City"
                                    value={data.city_municipality}
                                    onChange={(e) => setData('city_municipality', e.target.value)}
                                    className={`h-10 text-sm ${errors.city_municipality ? 'border-red-500' : ''}`}
                                />
                                <InputError message={errors.city_municipality} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="barangay" className="font-semibold text-sm">
                                    Barangay
                                </Label>
                                <Input
                                    id="barangay"
                                    placeholder="e.g. Barangay Sabang"
                                    value={data.barangay}
                                    onChange={(e) => setData('barangay', e.target.value)}
                                    className="h-10 text-sm"
                                />
                                <InputError message={errors.barangay} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="sm:col-span-2 space-y-2">
                                <Label htmlFor="address_line" className="font-semibold text-sm">
                                    Street Address / Sitio / Landmark
                                </Label>
                                <Input
                                    id="address_line"
                                    placeholder="e.g. Sitio Backbeach, Near Public Elementary School"
                                    value={data.address_line}
                                    onChange={(e) => setData('address_line', e.target.value)}
                                    className="h-10 text-sm"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="zip_code" className="font-semibold text-sm">
                                    Zip Code
                                </Label>
                                <Input
                                    id="zip_code"
                                    placeholder="e.g. 6004"
                                    value={data.zip_code}
                                    onChange={(e) => setData('zip_code', e.target.value)}
                                    className="h-10 text-sm"
                                />
                            </div>
                        </div>

                        {/* Interactive GIS LocationPickerMap */}
                        <div className="space-y-2 pt-2">
                            <div className="flex items-center justify-between">
                                <Label className="font-semibold text-sm flex items-center gap-1.5">
                                    <Compass className="h-4 w-4 text-emerald-600" /> Interactive Location & Boundary Map
                                </Label>
                                <span className="text-xs text-muted-foreground">
                                    Click map to pinpoint center or draw property perimeter.
                                </span>
                            </div>

                            <LocationPickerMap
                                latitude={data.latitude ? parseFloat(data.latitude) : null}
                                longitude={data.longitude ? parseFloat(data.longitude) : null}
                                boundaryCoordinates={data.boundary_coordinates}
                                onChange={(lat, lng, addr) => {
                                    setData((prev) => ({
                                        ...prev,
                                        latitude: lat.toFixed(7),
                                        longitude: lng.toFixed(7),
                                        province: addr?.province || prev.province,
                                        city_municipality: addr?.city || prev.city_municipality,
                                        barangay: addr?.barangay || prev.barangay,
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
                                        boundary_coordinates: [],
                                    }));
                                }}
                            />
                        </div>
                    </div>
                </section>

                <Separator />

                {/* SECTION 4: PRICING & PAYMENT TERMS */}
                <section className="space-y-4 sm:space-y-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Coins className="h-5 w-5 text-primary shrink-0" />
                            <h2 className="text-lg sm:text-xl font-bold tracking-tight">4. Pricing & Payment Terms</h2>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground pl-7">
                            Set total listing price, currency, negotiability, and buyer payment options.
                        </p>
                    </div>

                    <div className="space-y-5 sm:space-y-6 pt-1">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {/* Total Price */}
                            <div className="sm:col-span-2 space-y-2">
                                <Label htmlFor="price" className="font-semibold text-sm">
                                    Total Price ({selectedCurrencySymbol}) <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="price"
                                    type="number"
                                    step="any"
                                    placeholder="e.g. 2500000"
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                    className={`h-10 text-sm ${errors.price ? 'border-red-500' : ''}`}
                                />
                                <InputError message={errors.price} />
                            </div>

                            {/* Currency Selection */}
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

                        {/* Price per unit & Negotiable */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                            <div className="space-y-2">
                                <Label htmlFor="price_per_unit" className="font-semibold text-sm">
                                    Calculated Price per {data.area_unit || 'sqm'}
                                </Label>
                                <Input
                                    id="price_per_unit"
                                    type="number"
                                    step="any"
                                    placeholder={computedPricePerUnit ? `Auto: ${selectedCurrencySymbol}${computedPricePerUnit}` : 'e.g. 500'}
                                    value={data.price_per_unit}
                                    onChange={(e) => setData('price_per_unit', e.target.value)}
                                    className="h-10 text-sm"
                                />
                            </div>

                            <div className="flex items-center gap-3 pt-2 sm:pt-6">
                                <Checkbox
                                    id="is_negotiable"
                                    checked={data.is_negotiable}
                                    onCheckedChange={(checked) => setData('is_negotiable', Boolean(checked))}
                                />
                                <Label htmlFor="is_negotiable" className="font-medium text-sm cursor-pointer select-none">
                                    Price is negotiable upon inquiry
                                </Label>
                            </div>
                        </div>

                        {/* Payment Terms Selector Pills */}
                        <div className="space-y-2 pt-2">
                            <Label className="font-semibold text-sm">
                                Payment Terms Options <span className="text-red-500">*</span>
                            </Label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                {[
                                    { id: 'full', label: 'Cash / Full Spot Payment' },
                                    { id: 'monthly', label: 'Monthly Installments' },
                                    { id: 'yearly', label: 'Annual / Yearly Installments' },
                                ].map((term) => (
                                    <button
                                        type="button"
                                        key={term.id}
                                        onClick={() => setData('payment_terms', term.id as 'full' | 'monthly' | 'yearly')}
                                        className={getFlatPillClass(data.payment_terms === term.id)}
                                    >
                                        <span>{term.label}</span>
                                    </button>
                                ))}
                            </div>
                            <InputError message={errors.payment_terms} />
                        </div>

                        {/* Installment terms fields */}
                        {data.payment_terms !== 'full' && (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-muted/40 rounded-xl border">
                                <div className="space-y-2">
                                    <Label htmlFor="down_payment" className="font-semibold text-xs">
                                        Required Down Payment <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="down_payment"
                                        type="number"
                                        step="any"
                                        placeholder="e.g. 500000"
                                        value={data.down_payment}
                                        onChange={(e) => setData('down_payment', e.target.value)}
                                        className="h-9 text-xs"
                                    />
                                    <InputError message={errors.down_payment} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="installment_count" className="font-semibold text-xs">
                                        Number of {data.payment_terms === 'monthly' ? 'Months' : 'Years'} <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="installment_count"
                                        type="number"
                                        placeholder="e.g. 24"
                                        value={data.installment_count}
                                        onChange={(e) => setData('installment_count', e.target.value)}
                                        className="h-9 text-xs"
                                    />
                                    <InputError message={errors.installment_count} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="installment_amount" className="font-semibold text-xs">
                                        Amount per Period ({selectedCurrencySymbol})
                                    </Label>
                                    <Input
                                        id="installment_amount"
                                        type="number"
                                        step="any"
                                        placeholder="e.g. 25000"
                                        value={data.installment_amount}
                                        onChange={(e) => setData('installment_amount', e.target.value)}
                                        className="h-9 text-xs"
                                    />
                                    <InputError message={errors.installment_amount} />
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                <Separator />

                {/* SECTION 5: PROPERTY PHOTOS & MEDIA MANAGEMENT */}
                <section className="space-y-4 sm:space-y-6">
                    <div className="space-y-1">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Camera className="h-5 w-5 text-primary shrink-0" />
                                <h2 className="text-lg sm:text-xl font-bold tracking-tight">5. Property Photos & Media</h2>
                            </div>
                            <Badge variant="outline" className="text-xs">
                                {existingImages.length + newImagePreviews.length} / 10 Photos
                            </Badge>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground pl-7">
                            Manage existing property photos or upload new high-resolution images.
                        </p>
                    </div>

                    <div className="space-y-6 pt-1">
                        {/* A. Existing Saved Photos Section */}
                        {existingImages.length > 0 && (
                            <div className="space-y-3">
                                <Label className="font-semibold text-sm flex items-center gap-1.5 text-foreground">
                                    <Layers className="h-4 w-4 text-emerald-600" /> Existing Saved Photos
                                </Label>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {existingImages.map((img) => (
                                        <div
                                            key={img.image_id}
                                            className="flex flex-col sm:flex-row items-center gap-3 p-3 rounded-xl border bg-card shadow-xs relative group"
                                        >
                                            <div className="w-full sm:w-28 h-28 rounded-lg overflow-hidden border bg-muted shrink-0 relative">
                                                <img
                                                    src={img.url}
                                                    alt={img.caption || 'Property image'}
                                                    className="w-full h-full object-cover"
                                                />
                                                {img.is_primary && (
                                                    <Badge className="absolute top-1 left-1 bg-emerald-600 text-white text-[9px] px-1.5 py-0.5">
                                                        Primary
                                                    </Badge>
                                                )}
                                            </div>

                                            <div className="flex-1 w-full space-y-2">
                                                <Label htmlFor={`existing-caption-${img.image_id}`} className="text-xs font-semibold text-muted-foreground">
                                                    Image Caption
                                                </Label>
                                                <Input
                                                    id={`existing-caption-${img.image_id}`}
                                                    placeholder="e.g. Front entrance, Drone boundary view..."
                                                    value={data.existing_captions[img.image_id] || ''}
                                                    onChange={(e) => handleExistingCaptionChange(img.image_id, e.target.value)}
                                                    className="text-xs h-8"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDeleteExistingImage(img.image_id)}
                                                    className="h-7 text-[11px] gap-1 px-2.5 w-full sm:w-auto"
                                                >
                                                    <Trash2 className="h-3 w-3" /> Delete Photo
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* B. Upload New Photos Drop Zone */}
                        <div className="space-y-3">
                            <Label className="font-semibold text-sm flex items-center gap-1.5 text-foreground">
                                <UploadCloud className="h-4 w-4 text-emerald-600" /> Upload Additional Photos
                            </Label>

                            <div className="border-2 border-dashed border-muted-foreground/30 rounded-2xl p-6 sm:p-8 text-center hover:border-primary/60 transition-colors bg-muted/20">
                                <input
                                    type="file"
                                    id="new-image-upload"
                                    multiple
                                    accept="image/jpeg,image/png,image/jpg,image/webp"
                                    onChange={handleNewImageChange}
                                    className="hidden"
                                />
                                <label
                                    htmlFor="new-image-upload"
                                    className="flex flex-col items-center gap-2 cursor-pointer"
                                >
                                    <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                                        <UploadCloud className="h-6 w-6" />
                                    </div>
                                    <span className="text-sm font-semibold text-foreground">
                                        Click to select new land photos
                                    </span>
                                    <span className="text-xs text-muted-foreground max-w-sm">
                                        JPEG, PNG, JPG, or WEBP. Maximum 2MB per image. Up to {10 - existingImages.length} additional images.
                                    </span>
                                </label>
                            </div>
                            <InputError message={errors.images} />
                        </div>

                        {/* C. New Images Pending Upload Previews */}
                        {newImagePreviews.length > 0 && (
                            <div className="space-y-3 pt-2">
                                <Label className="font-semibold text-sm text-foreground">
                                    New Photos to be Saved ({newImagePreviews.length})
                                </Label>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {newImagePreviews.map((preview, index) => (
                                        <div
                                            key={`new-preview-${index}`}
                                            className="flex flex-col sm:flex-row items-center gap-3 p-3 rounded-xl border bg-card shadow-xs relative"
                                        >
                                            <div className="w-full sm:w-28 h-28 rounded-lg overflow-hidden border bg-muted shrink-0 relative">
                                                <img
                                                    src={preview.url}
                                                    alt={`New preview ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                <Badge className="absolute top-1 left-1 bg-amber-600 text-white text-[9px] px-1.5 py-0.5">
                                                    New
                                                </Badge>
                                            </div>

                                            <div className="flex-1 w-full space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-semibold text-foreground truncate max-w-[180px]">
                                                        {preview.file.name}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveNewImage(index)}
                                                        className="text-red-500 hover:text-red-700 p-1"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>

                                                <Input
                                                    placeholder="Caption for new photo..."
                                                    value={preview.caption}
                                                    onChange={(e) => handleNewCaptionChange(index, e.target.value)}
                                                    className="text-xs h-8"
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
                                <Sparkles className="h-4 w-4 animate-spin" /> Saving Changes...
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="h-4 w-4" /> Update Land Listing
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}

EditListing.layout = {
    head: { title: 'Edit Land Listing' },
    breadcrumbs: [
        {
            title: 'Listings',
            href: listings.index.url(),
        },
        {
            title: 'Edit Listing',
            href: '#',
        },
    ],
};
