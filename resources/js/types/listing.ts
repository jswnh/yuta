export type SellerType = 'owner' | 'agent' | 'broker';
export type AreaUnit = 'sqm' | 'hectare' | 'sqft';
export type LandType = 'residential' | 'agricultural' | 'commercial' | 'industrial' | 'raw_land';
export type Topography = 'flat' | 'sloped' | 'hilly' | 'mountainous';
export type TitleStatus = 'clean_title' | 'tax_declaration' | 'mother_title' | 'rights';
export type ListingStatus = 'draft' | 'pending_review' | 'active' | 'under_contract' | 'sold' | 'archived';

export interface LatLngCoordinate {
    lat: number;
    lng: number;
}

export interface ListingImage {
    image_id: string;
    listing_id: string;
    file_path: string;
    url?: string;
    caption: string | null;
    sort_order: number;
    is_primary: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface Listing {
    listing_id: string;
    seller_id: string;
    seller_type: SellerType;
    title: string;
    listing_category?: string | null;
    slug: string;
    description: string | null;
    price: number;
    currency: string;
    is_negotiable: boolean;
    price_per_unit: number | null;
    payment_terms?: 'full' | 'monthly' | 'yearly' | string | null;
    down_payment?: number | string | null;
    installment_count?: number | string | null;
    installment_amount?: number | string | null;
    area: number;
    area_unit: AreaUnit;
    land_type: LandType;
    topography: Topography | null;
    title_status: TitleStatus;
    parcel_number: string | null;
    is_verified: boolean;
    address_line: string | null;
    barangay: string | null;
    city_municipality: string;
    province: string;
    region: string | null;
    zip_code: string | null;
    latitude: number | null;
    longitude: number | null;
    boundary_coordinates: LatLngCoordinate[] | null;
    status: ListingStatus;
    is_featured: boolean;
    view_count: number;
    published_at: string | null;
    sold_at: string | null;
    created_at: string;
    updated_at: string;
    images?: ListingImage[];
}
