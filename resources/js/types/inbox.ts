import type { Listing } from './listing';
import type { User } from './auth';

export interface Message {
    id: string;
    conversation_id: string;
    sender_id: string;
    receiver_id: string;
    body: string;
    attachment_path: string | null;
    is_read: boolean;
    read_at: string | null;
    created_at: string;
    updated_at: string;
    sender?: User;
    receiver?: User;
}

export interface Conversation {
    id: string;
    listing_id: string | null;
    buyer_id: string;
    seller_id: string;
    subject: string | null;
    last_message_at: string | null;
    created_at: string;
    updated_at: string;
    listing?: Listing;
    buyer?: User;
    seller?: User;
    latest_message?: Message | null;
    unread_count?: number;
    messages?: Message[];
}
