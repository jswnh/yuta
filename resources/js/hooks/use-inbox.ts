import { useState } from 'react';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';

export function useInbox() {
    const [sending, setSending] = useState(false);
    const [startingInquiry, setStartingInquiry] = useState(false);

    const sendMessage = (conversationId: string, body: string, onClear?: () => void) => {
        if (!body.trim()) return;

        setSending(true);
        router.post(
            `/inbox/${conversationId}/messages`,
            { body },
            {
                preserveScroll: true,
                onSuccess: () => {
                    onClear?.();
                },
                onError: () => {
                    toast.error('Failed to send message.');
                },
                onFinish: () => setSending(false),
            }
        );
    };

    const startInquiry = (listingId: string, message: string, onSuccessCallback?: () => void) => {
        if (!message.trim()) {
            toast.error('Please write an inquiry message first.');
            return;
        }

        setStartingInquiry(true);
        router.post(
            '/inbox/inquiries',
            {
                listing_id: listingId,
                message,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Inquiry sent to seller! Opening your conversation in Inbox.');
                    onSuccessCallback?.();
                },
                onError: (errors) => {
                    const first = Object.values(errors)[0] as string;
                    toast.error(first || 'Failed to send inquiry.');
                },
                onFinish: () => setStartingInquiry(false),
            }
        );
    };

    return {
        sending,
        startingInquiry,
        sendMessage,
        startInquiry,
    };
}
