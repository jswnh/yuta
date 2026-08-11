import { SyntheticEvent, useMemo, useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { toast } from 'sonner';
import {
    MapPin,
    DollarSign,
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import type {
    AreaUnit,
    LandType,
    LatLngCoordinate,
    SellerType,
    TitleStatus,
    Topography,
} from '@/types/listing';
import { CardDescription } from '@/components/ui/card';

interface ImagePreview {
    file: File;
    url: string;
    caption: string;
}

export default function CreateListing() {
    const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);

    const { data, setData, post, processing, errors, transform } = useForm({
        seller_type: 'owner' as SellerType,
        title: '',
        listing_category: '',
        description: '',
        price: '',
        currency: 'PHP',
        is_negotiable: false,
        price_per_unit: '',
        payment_terms: 'full' as 'full' | 'monthly' | 'yearly',
        down_payment: '',
        installment_count: '',
        installment_amount: '',
        area: '',
        area_unit: 'sqm' as AreaUnit,
        land_type: 'raw_land' as LandType,
        topography: 'flat' as Topography,
        title_status: 'clean_title' as TitleStatus,
        parcel_number: '',
        address_line: '',
        barangay: '',
        city_municipality: '',
        province: '',
        region: '',
        zip_code: '',
        latitude: '',
        longitude: '',
        boundary_coordinates: [] as LatLngCoordinate[],
        images: [] as File[],
        captions: [] as string[],
    });

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
        const newFiles = Array.from(e.target.files);
        const updatedFiles = [...data.images, ...newFiles].slice(0, 10);
        const updatedCaptions = [
            ...data.captions,
            ...newFiles.map(() => ''),
        ].slice(0, 10);

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
            prev.map((item, i) =>
                i === index ? { ...item, caption: captionValue } : item,
            ),
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
            price_per_unit:
                formData.price_per_unit || computedPricePerUnit || '',
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
        <div className="mx-auto max-w-4xl space-y-8 p-4 md:p-8">
            {/* Header section */}
            <div className="flex flex-col gap-4 border-b pb-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => router.get(listings.index.url())}
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                            Create New Land Listing
                        </h1>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Fill in the land specifications, legal documentation,
                        location, pricing, GIS boundaries, and photo gallery.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge
                        variant="outline"
                        className="gap-1 px-3 py-1 text-xs"
                    >
                        <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                        Land & Property System
                    </Badge>
                </div>
            </div>

            {/* Error summary banner if validation failed */}
            {hasValidationErrors && (
                <Alert
                    variant="destructive"
                    className="border-red-500/50 bg-red-500/10"
                >
                    <AlertTriangle className="h-5 w-5" />
                    <AlertTitle className="font-semibold">
                        Form Validation Errors
                    </AlertTitle>
                    <AlertDescription className="mt-1 text-sm">
                        Please review the highlighted fields below before
                        submitting the form.
                    </AlertDescription>
                </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-10">
                {/* Section 1: Basic Information & Category */}
                <section className="space-y-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Tag className="h-5 w-5 text-primary" />
                            <h2 className="text-xl font-bold tracking-tight">
                                1. Basic Information & Category
                            </h2>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Define the property title, category, seller
                            relationship, and overview description.
                        </p>
                    </div>

                    <div className="space-y-6 pt-2">
                        {/* Listing Title */}
                        <div className="space-y-2">
                            <Label htmlFor="title" className="font-semibold">
                                Listing Title{' '}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="title"
                                placeholder="e.g. 5,000 sqm Prime Agricultural Farm Lot with Clean Title"
                                value={data.title}
                                onChange={(e) =>
                                    setData('title', e.target.value)
                                }
                                className={
                                    errors.title
                                        ? 'border-red-500 focus-visible:ring-red-500'
                                        : ''
                                }
                            />
                            <InputError message={errors.title} />
                        </div>

                        {/* Category selection */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="listing_category"
                                className="font-semibold"
                            >
                                Property Category{' '}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={data.listing_category}
                                onValueChange={(val) =>
                                    setData('listing_category', val)
                                }
                            >
                                <SelectTrigger
                                    id="listing_category"
                                    className={
                                        errors.listing_category
                                            ? 'border-red-500'
                                            : ''
                                    }
                                >
                                    <SelectValue placeholder="Select a pre-defined land category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {listingCategories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id}>
                                            <div className="flex flex-col py-0.5">
                                                <span className="font-medium">
                                                    {cat.name}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {cat.description}
                                                </span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.listing_category} />
                        </div>

                        {/* Seller Relationship */}
                        <div className="space-y-2">
                            <Label className="font-semibold">
                                Seller Relationship{' '}
                                <span className="text-red-500">*</span>
                            </Label>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    {
                                        id: 'owner',
                                        label: 'Property Owner',
                                        icon: UserCheck,
                                        desc: 'Direct owner selling',
                                    },
                                    {
                                        id: 'agent',
                                        label: 'Real Estate Agent',
                                        icon: Building2,
                                        desc: 'Representing owner',
                                    },
                                    {
                                        id: 'broker',
                                        label: 'Licensed Broker',
                                        icon: ShieldCheck,
                                        desc: 'Certified broker',
                                    },
                                ].map((type) => {
                                    const Icon = type.icon;
                                    const isSelected =
                                        data.seller_type === type.id;
                                    return (
                                        <button
                                            type="button"
                                            key={type.id}
                                            onClick={() =>
                                                setData(
                                                    'seller_type',
                                                    type.id as SellerType,
                                                )
                                            }
                                            className={`flex flex-col items-center justify-center rounded-lg border p-3 text-center transition-all ${
                                                isSelected
                                                    ? 'border-primary bg-primary/10 font-medium text-primary ring-2 ring-primary/30'
                                                    : 'border-input hover:bg-accent hover:text-accent-foreground'
                                            }`}
                                        >
                                            <Icon className="mb-1 h-5 w-5" />
                                            <span className="text-sm font-semibold">
                                                {type.label}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {type.desc}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                            <InputError message={errors.seller_type} />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="description"
                                className="font-semibold"
                            >
                                Description
                            </Label>
                            <Textarea
                                id="description"
                                rows={4}
                                placeholder="Describe the land features, access to roads, water/electricity access, nearby landmarks..."
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                className={
                                    errors.description ? 'border-red-500' : ''
                                }
                            />
                            <InputError message={errors.description} />
                        </div>
                    </div>
                </section>

                <Separator />

                {/* Section 2: Physical & Legal Characteristics */}
                <section className="space-y-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Layers className="h-5 w-5 text-primary" />
                            <h2 className="text-xl font-bold tracking-tight">
                                2. Land Characteristics & Legal Status
                            </h2>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Specify physical land classification, size,
                            topography, and title status.
                        </p>
                    </div>

                    <div className="space-y-6 pt-2">
                        {/* Land Type (Pill selection) */}
                        <div className="space-y-2">
                            <Label className="font-semibold">
                                Land Type Classification{' '}
                                <span className="text-red-500">*</span>
                            </Label>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { id: 'residential', label: 'Residential' },
                                    {
                                        id: 'agricultural',
                                        label: 'Agricultural',
                                    },
                                    { id: 'commercial', label: 'Commercial' },
                                    { id: 'industrial', label: 'Industrial' },
                                    { id: 'raw_land', label: 'Raw Land' },
                                ].map((type) => {
                                    const isSelected =
                                        data.land_type === type.id;
                                    return (
                                        <button
                                            type="button"
                                            key={type.id}
                                            onClick={() =>
                                                setData(
                                                    'land_type',
                                                    type.id as LandType,
                                                )
                                            }
                                            className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                                                isSelected
                                                    ? 'bg-primary text-primary-foreground shadow-sm ring-2 ring-primary/40'
                                                    : 'border border-input bg-background hover:bg-muted'
                                            }`}
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
                                <Label htmlFor="area" className="font-semibold">
                                    Total Land Area{' '}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                    <Maximize2 className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="area"
                                        type="number"
                                        step="any"
                                        min="0"
                                        placeholder="e.g. 5000"
                                        value={data.area}
                                        onChange={(e) =>
                                            setData('area', e.target.value)
                                        }
                                        className={`pl-9 ${errors.area ? 'border-red-500' : ''}`}
                                    />
                                </div>
                                <InputError message={errors.area} />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="area_unit"
                                    className="font-semibold"
                                >
                                    Area Unit{' '}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={data.area_unit}
                                    onValueChange={(val) =>
                                        setData('area_unit', val as AreaUnit)
                                    }
                                >
                                    <SelectTrigger
                                        id="area_unit"
                                        className={
                                            errors.area_unit
                                                ? 'border-red-500'
                                                : ''
                                        }
                                    >
                                        <SelectValue placeholder="Select unit" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="sqm">
                                            Square Meters (sqm)
                                        </SelectItem>
                                        <SelectItem value="hectare">
                                            Hectares (ha)
                                        </SelectItem>
                                        <SelectItem value="sqft">
                                            Square Feet (sqft)
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.area_unit} />
                            </div>
                        </div>

                        {/* Topography (Pills) */}
                        <div className="space-y-2">
                            <Label className="flex items-center gap-1.5 font-semibold">
                                <Mountain className="h-4 w-4 text-muted-foreground" />{' '}
                                Topography
                            </Label>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { id: 'flat', label: 'Flat / Level' },
                                    {
                                        id: 'sloped',
                                        label: 'Sloped / Gently Rolling',
                                    },
                                    { id: 'hilly', label: 'Hilly Terrain' },
                                    { id: 'mountainous', label: 'Mountainous' },
                                ].map((topo) => {
                                    const isSelected =
                                        data.topography === topo.id;
                                    return (
                                        <button
                                            type="button"
                                            key={topo.id}
                                            onClick={() =>
                                                setData(
                                                    'topography',
                                                    topo.id as Topography,
                                                )
                                            }
                                            className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all ${
                                                isSelected
                                                    ? 'bg-slate-800 text-white shadow-xs dark:bg-slate-200 dark:text-slate-900'
                                                    : 'border border-input bg-background text-muted-foreground hover:bg-muted'
                                            }`}
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
                                <Label className="flex items-center gap-1.5 font-semibold">
                                    <FileCheck className="h-4 w-4 text-muted-foreground" />{' '}
                                    Title / Legal Status{' '}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={data.title_status}
                                    onValueChange={(val) =>
                                        setData(
                                            'title_status',
                                            val as TitleStatus,
                                        )
                                    }
                                >
                                    <SelectTrigger
                                        className={
                                            errors.title_status
                                                ? 'border-red-500'
                                                : ''
                                        }
                                    >
                                        <SelectValue placeholder="Select title status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="clean_title">
                                            Clean Title (OCT/TCT)
                                        </SelectItem>
                                        <SelectItem value="tax_declaration">
                                            Tax Declaration
                                        </SelectItem>
                                        <SelectItem value="mother_title">
                                            Mother Title
                                        </SelectItem>
                                        <SelectItem value="rights">
                                            Possessory Rights
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.title_status} />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="parcel_number"
                                    className="font-semibold"
                                >
                                    Parcel / Lot / TCT Number
                                </Label>
                                <Input
                                    id="parcel_number"
                                    placeholder="e.g. TCT No. 123-45678"
                                    value={data.parcel_number}
                                    onChange={(e) =>
                                        setData('parcel_number', e.target.value)
                                    }
                                    className={
                                        errors.parcel_number
                                            ? 'border-red-500'
                                            : ''
                                    }
                                />
                                <InputError message={errors.parcel_number} />
                            </div>
                        </div>
                    </div>
                </section>

                <Separator />

                {/* Section 3: Location Details & GIS Map Boundaries */}
                <section className="space-y-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-primary" />
                            <h2 className="text-xl font-bold tracking-tight">
                                3. Location Details & GIS Map Boundaries
                            </h2>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Pin the center property location, switch map views
                            (street / satellite), and draw boundary shapes on
                            the map.
                        </p>
                    </div>

                    <div className="space-y-6 pt-2">
                        {/* Interactive React Leaflet Map Input & Boundary Polygon Drawer */}
                        <div className="space-y-2">
                            <Label className="flex items-center justify-between font-semibold">
                                <span className="flex items-center gap-1.5">
                                    <MapPin className="h-4 w-4 text-emerald-600" />{' '}
                                    Interactive GIS Location & Perimeter Map
                                </span>
                                {data.boundary_coordinates.length > 0 && (
                                    <Badge
                                        variant="secondary"
                                        className="gap-1 font-mono text-xs"
                                    >
                                        <PolygonIcon className="h-3 w-3 text-emerald-500" />
                                        {data.boundary_coordinates.length}{' '}
                                        Boundary Corners Pinned
                                    </Badge>
                                )}
                            </Label>
                            <LocationPickerMap
                                latitude={
                                    data.latitude ? Number(data.latitude) : null
                                }
                                longitude={
                                    data.longitude
                                        ? Number(data.longitude)
                                        : null
                                }
                                boundaryCoordinates={data.boundary_coordinates}
                                onChange={(lat, lng, addressDetails) => {
                                    setData((prev) => ({
                                        ...prev,
                                        latitude: lat.toFixed(7),
                                        longitude: lng.toFixed(7),
                                        province: addressDetails?.province
                                            ? addressDetails.province
                                            : prev.province,
                                        city_municipality: addressDetails?.city
                                            ? addressDetails.city
                                            : prev.city_municipality,
                                        barangay: addressDetails?.barangay
                                            ? addressDetails.barangay
                                            : prev.barangay,
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
                                    toast.info(
                                        'Map pin, location coordinates, and boundary polygon reset.',
                                    );
                                }}
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {/* Province */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="province"
                                    className="font-semibold"
                                >
                                    Province{' '}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="province"
                                    placeholder="e.g. Cavite, Batangas, Cebu"
                                    value={data.province}
                                    onChange={(e) =>
                                        setData('province', e.target.value)
                                    }
                                    className={
                                        errors.province ? 'border-red-500' : ''
                                    }
                                />
                                <InputError message={errors.province} />
                            </div>

                            {/* City / Municipality */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="city_municipality"
                                    className="font-semibold"
                                >
                                    City / Municipality{' '}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="city_municipality"
                                    placeholder="e.g. Tagaytay City"
                                    value={data.city_municipality}
                                    onChange={(e) =>
                                        setData(
                                            'city_municipality',
                                            e.target.value,
                                        )
                                    }
                                    className={
                                        errors.city_municipality
                                            ? 'border-red-500'
                                            : ''
                                    }
                                />
                                <InputError
                                    message={errors.city_municipality}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            {/* Barangay */}
                            <div className="space-y-2 sm:col-span-2">
                                <Label
                                    htmlFor="barangay"
                                    className="font-semibold"
                                >
                                    Barangay
                                </Label>
                                <Input
                                    id="barangay"
                                    placeholder="e.g. Brgy. Sungay East"
                                    value={data.barangay}
                                    onChange={(e) =>
                                        setData('barangay', e.target.value)
                                    }
                                    className={
                                        errors.barangay ? 'border-red-500' : ''
                                    }
                                />
                                <InputError message={errors.barangay} />
                            </div>

                            {/* Zip Code */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="zip_code"
                                    className="font-semibold"
                                >
                                    Zip Code
                                </Label>
                                <Input
                                    id="zip_code"
                                    placeholder="e.g. 4120"
                                    value={data.zip_code}
                                    onChange={(e) =>
                                        setData('zip_code', e.target.value)
                                    }
                                    className={
                                        errors.zip_code ? 'border-red-500' : ''
                                    }
                                />
                                <InputError message={errors.zip_code} />
                            </div>
                        </div>

                        {/* Street / Address Line */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="address_line"
                                className="font-semibold"
                            >
                                Street Address / Landmark
                            </Label>
                            <Input
                                id="address_line"
                                placeholder="e.g. Santa Rosa - Tagaytay Road near Caleruega"
                                value={data.address_line}
                                onChange={(e) =>
                                    setData('address_line', e.target.value)
                                }
                                className={
                                    errors.address_line ? 'border-red-500' : ''
                                }
                            />
                            <InputError message={errors.address_line} />
                        </div>

                        {/* Coordinates */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="latitude"
                                    className="text-xs font-semibold text-muted-foreground"
                                >
                                    Latitude (Pinned from Map)
                                </Label>
                                <Input
                                    id="latitude"
                                    type="number"
                                    step="any"
                                    placeholder="Click map above to set latitude"
                                    value={data.latitude}
                                    onChange={(e) =>
                                        setData('latitude', e.target.value)
                                    }
                                    className={
                                        errors.latitude ? 'border-red-500' : ''
                                    }
                                />
                                <InputError message={errors.latitude} />
                            </div>
                            <div className="space-y-2">
                                <Label
                                    htmlFor="longitude"
                                    className="text-xs font-semibold text-muted-foreground"
                                >
                                    Longitude (Pinned from Map)
                                </Label>
                                <Input
                                    id="longitude"
                                    type="number"
                                    step="any"
                                    placeholder="Click map above to set longitude"
                                    value={data.longitude}
                                    onChange={(e) =>
                                        setData('longitude', e.target.value)
                                    }
                                    className={
                                        errors.longitude ? 'border-red-500' : ''
                                    }
                                />
                                <InputError message={errors.longitude} />
                            </div>
                        </div>
                    </div>
                </section>

                <Separator />

                {/* Section 4: Pricing & Terms */}
                <section className="space-y-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-primary" />
                            <h2 className="text-xl font-bold tracking-tight">
                                4. Pricing & Payment Terms
                            </h2>
                        </div>
                        <CardDescription>
                            Set the selling price, currency, payment options,
                            and installment arrangements.
                        </CardDescription>
                    </div>

                    <div className="space-y-6 pt-2">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            {/* Total Price */}
                            <div className="space-y-2 sm:col-span-2">
                                <Label
                                    htmlFor="price"
                                    className="font-semibold"
                                >
                                    Total Listing Price{' '}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                    <span className="absolute top-2.5 left-3 text-sm font-semibold text-muted-foreground">
                                        ₱
                                    </span>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="any"
                                        min="0"
                                        placeholder="e.g. 15000000"
                                        value={data.price}
                                        onChange={(e) =>
                                            setData('price', e.target.value)
                                        }
                                        className={`pl-8 ${errors.price ? 'border-red-500' : ''}`}
                                    />
                                </div>
                                <InputError message={errors.price} />
                            </div>

                            {/* Currency */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="currency"
                                    className="font-semibold"
                                >
                                    Currency
                                </Label>
                                <Input
                                    id="currency"
                                    value={data.currency}
                                    disabled
                                    className="bg-muted"
                                />
                            </div>
                        </div>

                        {/* Price per unit preview / override */}
                        <div className="flex flex-col gap-4 rounded-lg border bg-muted/20 p-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">
                                    Estimated Price per Unit:
                                </span>
                                <Badge
                                    variant="secondary"
                                    className="font-mono text-sm"
                                >
                                    {computedPricePerUnit
                                        ? `₱ ${Number(computedPricePerUnit).toLocaleString()} / ${data.area_unit}`
                                        : 'Enter price and area'}
                                </Badge>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is_negotiable"
                                    checked={data.is_negotiable}
                                    onCheckedChange={(checked) =>
                                        setData(
                                            'is_negotiable',
                                            Boolean(checked),
                                        )
                                    }
                                />
                                <Label
                                    htmlFor="is_negotiable"
                                    className="cursor-pointer text-sm font-medium"
                                >
                                    Price is Negotiable
                                </Label>
                            </div>
                        </div>

                        {/* Payment Terms */}
                        <div className="space-y-2">
                            <Label className="font-semibold">
                                Payment Terms{' '}
                                <span className="text-red-500">*</span>
                            </Label>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                {[
                                    {
                                        id: 'full',
                                        label: 'Full Cash Payment',
                                        desc: '100% full payment upon transfer',
                                    },
                                    {
                                        id: 'monthly',
                                        label: 'Monthly Installment',
                                        desc: 'Flexible monthly amortization',
                                    },
                                    {
                                        id: 'yearly',
                                        label: 'Yearly Installment',
                                        desc: 'Annual payment plan',
                                    },
                                ].map((term) => {
                                    const isSelected =
                                        data.payment_terms === term.id;
                                    return (
                                        <button
                                            type="button"
                                            key={term.id}
                                            onClick={() =>
                                                setData(
                                                    'payment_terms',
                                                    term.id as
                                                        | 'full'
                                                        | 'monthly'
                                                        | 'yearly',
                                                )
                                            }
                                            className={`flex flex-col rounded-lg border p-3 text-left transition-all ${
                                                isSelected
                                                    ? 'border-primary bg-primary/10 ring-2 ring-primary/30'
                                                    : 'border-input hover:bg-muted'
                                            }`}
                                        >
                                            <span className="text-sm font-semibold">
                                                {term.label}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {term.desc}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                            <InputError message={errors.payment_terms} />
                        </div>

                        {/* Conditional Installment Fields */}
                        {data.payment_terms !== 'full' && (
                            <div className="space-y-4 rounded-xl border bg-muted/20 p-4">
                                <h4 className="flex items-center gap-1.5 text-sm font-semibold">
                                    <Sparkles className="h-4 w-4 text-primary" />{' '}
                                    Installment Breakdown
                                </h4>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="down_payment"
                                            className="font-semibold"
                                        >
                                            Down Payment{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <div className="relative">
                                            <span className="absolute top-2.5 left-3 text-sm text-muted-foreground">
                                                ₱
                                            </span>
                                            <Input
                                                id="down_payment"
                                                type="number"
                                                step="any"
                                                min="0"
                                                placeholder="e.g. 3000000"
                                                value={data.down_payment}
                                                onChange={(e) =>
                                                    setData(
                                                        'down_payment',
                                                        e.target.value,
                                                    )
                                                }
                                                className={`pl-8 ${errors.down_payment ? 'border-red-500' : ''}`}
                                            />
                                        </div>
                                        <InputError
                                            message={errors.down_payment}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="installment_count"
                                            className="font-semibold"
                                        >
                                            No. of{' '}
                                            {data.payment_terms === 'monthly'
                                                ? 'Months'
                                                : 'Years'}{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="installment_count"
                                            type="number"
                                            min="1"
                                            placeholder={
                                                data.payment_terms === 'monthly'
                                                    ? 'e.g. 24'
                                                    : 'e.g. 5'
                                            }
                                            value={data.installment_count}
                                            onChange={(e) =>
                                                setData(
                                                    'installment_count',
                                                    e.target.value,
                                                )
                                            }
                                            className={
                                                errors.installment_count
                                                    ? 'border-red-500'
                                                    : ''
                                            }
                                        />
                                        <InputError
                                            message={errors.installment_count}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="installment_amount"
                                            className="font-semibold"
                                        >
                                            Approx. Amount per Period
                                        </Label>
                                        <div className="relative">
                                            <span className="absolute top-2.5 left-3 text-sm text-muted-foreground">
                                                ₱
                                            </span>
                                            <Input
                                                id="installment_amount"
                                                type="number"
                                                step="any"
                                                min="0"
                                                placeholder="e.g. 50000"
                                                value={data.installment_amount}
                                                onChange={(e) =>
                                                    setData(
                                                        'installment_amount',
                                                        e.target.value,
                                                    )
                                                }
                                                className={`pl-8 ${errors.installment_amount ? 'border-red-500' : ''}`}
                                            />
                                        </div>
                                        <InputError
                                            message={errors.installment_amount}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                <Separator />

                {/* Section 5: Property Photos & Captions */}
                <section className="space-y-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <UploadCloud className="h-5 w-5 text-primary" />
                            <h2 className="text-xl font-bold tracking-tight">
                                5. Property Photos & Captions
                            </h2>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Upload high-resolution land photos, aerial drone
                            views, or boundary blueprints. Add a caption for
                            each photo. (Max 10 photos)
                        </p>
                    </div>

                    <div className="space-y-6 pt-2">
                        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/30 p-8 text-center transition-colors hover:border-primary/50">
                            <Camera className="mb-2 h-10 w-10 text-muted-foreground" />
                            <p className="text-sm font-semibold">
                                Click to upload property images
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                PNG, JPG, JPEG, WEBP up to 5MB each. Direct
                                cloud bucket storage.
                            </p>
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
                                className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-xs hover:bg-primary/90"
                            >
                                <UploadCloud className="h-4 w-4" /> Select Files
                            </Label>
                        </div>

                        {/* Image upload errors */}
                        {errors.images && (
                            <InputError message={errors.images} />
                        )}
                        {errors['images.0'] && (
                            <InputError message={errors['images.0']} />
                        )}

                        {/* Image Previews & Captions List */}
                        {imagePreviews.length > 0 && (
                            <div className="space-y-4">
                                <Label className="text-xs font-semibold text-muted-foreground uppercase">
                                    Uploaded Photos & Captions (
                                    {imagePreviews.length} / 10)
                                </Label>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {imagePreviews.map((preview, index) => (
                                        <div
                                            key={index}
                                            className="flex flex-col gap-3 rounded-lg border bg-card p-3 shadow-xs"
                                        >
                                            <div className="relative aspect-video overflow-hidden rounded-md bg-muted">
                                                <img
                                                    src={preview.url}
                                                    alt={`Photo ${index + 1}`}
                                                    className="h-full w-full object-cover"
                                                />
                                                {index === 0 ? (
                                                    <Badge className="absolute top-2 left-2 bg-emerald-600 px-2 py-0.5 text-[10px] text-white">
                                                        Primary Photo
                                                    </Badge>
                                                ) : (
                                                    <Badge
                                                        variant="secondary"
                                                        className="absolute top-2 left-2 text-[10px]"
                                                    >
                                                        Photo #{index + 1}
                                                    </Badge>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleRemoveImage(index)
                                                    }
                                                    className="absolute top-2 right-2 rounded-full bg-red-600 p-1.5 text-white shadow-xs transition-colors hover:bg-red-700"
                                                    title="Remove Image"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <div className="space-y-1">
                                                <Label
                                                    htmlFor={`caption-${index}`}
                                                    className="text-xs font-medium text-muted-foreground"
                                                >
                                                    Caption for Photo #
                                                    {index + 1}
                                                </Label>
                                                <Input
                                                    id={`caption-${index}`}
                                                    placeholder="e.g. Front elevation view, Drone boundary outline..."
                                                    value={preview.caption}
                                                    onChange={(e) =>
                                                        handleCaptionChange(
                                                            index,
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="h-8 text-xs"
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
                <div className="flex items-center justify-end gap-4 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        disabled={processing}
                        onClick={() => router.get(listings.index.url())}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={processing}
                        className="gap-2 px-6 font-semibold"
                    >
                        {processing ? (
                            <>
                                <Sparkles className="h-4 w-4 animate-spin" />{' '}
                                Saving Listing...
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="h-4 w-4" /> Publish
                                Land Listing
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
