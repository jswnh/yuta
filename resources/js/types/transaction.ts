import type { Listing } from './listing';
import type { User } from './auth';
import type { Agreement } from './agreement';

export type PaymentStatus =
    | 'pending'
    | 'processing'
    | 'completed'
    | 'failed'
    | 'cancelled'
    | 'disputed';

export interface Transaction {
    id: string;
    transaction_number: string;
    agreement_id: string | null;
    listing_id: string;
    buyer_id: string;
    seller_id: string;
    title: string;
    amount: number;
    currency: string;
    payment_method: string;
    payment_channel: string | null;
    payment_status: PaymentStatus;
    xendit_invoice_id: string | null;
    xendit_invoice_url: string | null;
    xendit_external_id: string | null;
    paid_at: string | null;
    completed_at: string | null;
    cancelled_at: string | null;
    reference_number: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
    listing?: Listing;
    buyer?: User;
    seller?: User;
    agreement?: Agreement;
}
