export interface Subscription {
    id: string;
    user_id: string;
    plan_name: string;
    plan_code: string;
    amount: number;
    currency: string;
    interval: string;
    status: 'pending' | 'active' | 'cancelled' | 'expired' | 'failed';
    xendit_invoice_id?: string | null;
    xendit_invoice_url?: string | null;
    xendit_external_id: string;
    payment_method?: string | null;
    paid_at?: string | null;
    starts_at?: string | null;
    ends_at?: string | null;
    cancelled_at?: string | null;
    created_at: string;
    updated_at: string;
}

export interface PlanDetails {
    name: string;
    code: string;
    price: number;
    currency: string;
    interval: string;
    features: string[];
}
