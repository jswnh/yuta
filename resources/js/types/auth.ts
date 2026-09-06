export type User = {
    user_id: string;
    id?: string;
    first_name: string;
    middle_name?: string | null;
    last_name: string;
    name?: string;
    contact_number: string;
    email: string;
    avatar?: string;
    is_seller?: boolean;
    seller_since?: string | null;
    user_type?: 'user' | 'admin';
    seller_profile?: {
        id: string;
        display_name?: string | null;
        business_name?: string | null;
        seller_type?: string;
        verification_status?: 'unverified' | 'pending' | 'verified' | 'rejected';
        years_of_experience?: number | null;
    } | null;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};

export type Auth = {
    user: User;
};

/* @chisel-passkeys */
export type Passkey = {
    id: number;
    name: string;
    authenticator: string | null;
    created_at_diff: string;
    last_used_at_diff: string | null;
};
/* @end-chisel-passkeys */
