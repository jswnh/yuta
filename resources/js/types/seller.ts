export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';
export type DocumentStatus = 'pending' | 'approved' | 'rejected' | 'needs_replacement';

export interface SellerDocument {
    id: string;
    seller_profile_id: string;
    user_id: string;
    document_type: string;
    document_name: string;
    file_path: string;
    file_size: number | null;
    mime_type: string | null;
    status: DocumentStatus;
    rejection_reason: string | null;
    reviewer_notes: string | null;
    verified_at: string | null;
    expires_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface SellerProfile {
    id: string;
    user_id: string;
    display_name: string | null;
    business_name: string | null;
    seller_type: string;
    license_number: string | null;
    tax_id_number: string | null;
    description: string | null;
    contact_email: string | null;
    contact_phone: string | null;
    address_line: string | null;
    city_municipality: string | null;
    province: string | null;
    zip_code: string | null;
    years_of_experience: number | null;
    verification_status: VerificationStatus;
    verification_submitted_at: string | null;
    verified_at: string | null;
    rejection_reason: string | null;
    created_at: string;
    updated_at: string;
    documents?: SellerDocument[];
}
