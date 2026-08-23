export interface NotificationData {
    title: string;
    message: string;
    type: 'listing' | 'agreement' | 'transaction' | 'verification' | 'message' | 'system';
    link?: string;
    entity_id?: string;
    [key: string]: unknown;
}

export interface AppNotification {
    id: string;
    type: string;
    notifiable_type: string;
    notifiable_id: string;
    data: NotificationData;
    read_at: string | null;
    created_at: string;
    updated_at: string;
}
