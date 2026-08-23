import type { Listing } from './listing';
import type { User } from './auth';

export type AgreementStatus =
    | 'draft'
    | 'proposed'
    | 'pending'
    | 'accepted'
    | 'rejected'
    | 'cancelled'
    | 'active'
    | 'completed'
    | 'expired';

export type PaymentType =
    | 'full_cash'
    | 'bank_financing'
    | 'installments'
    | 'online_xendit'
    | 'manual_transfer';

export interface AgreementTimeline {
    id: string;
    agreement_id: string;
    user_id: string | null;
    action: string;
    description: string;
    created_at: string;
    updated_at: string;
    user?: User;
}

export interface Agreement {
    id: string;
    agreement_number: string;
    listing_id: string;
    buyer_id: string;
    seller_id: string;
    conversation_id?: string | null;
    status: AgreementStatus;
    agreed_price: number;
    currency: string;
    payment_type: PaymentType;
    down_payment: number | null;
    installment_months: number | null;
    monthly_installment: number | null;
    terms_and_conditions: string | null;
    special_provisions: string | null;
    target_closing_date: string | null;
    proposed_by: string;
    accepted_at: string | null;
    rejected_at: string | null;
    rejection_reason: string | null;
    cancelled_at: string | null;
    completed_at: string | null;
    created_at: string;
    updated_at: string;
    listing?: Listing;
    buyer?: User;
    seller?: User;
    proposer?: User;
    timelines?: AgreementTimeline[];
}
