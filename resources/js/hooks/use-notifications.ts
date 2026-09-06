import { useState } from 'react';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';

export function useNotifications() {
    const [markingRead, setMarkingRead] = useState<string | null>(null);
    const [markingAll, setMarkingAll] = useState(false);

    const markAsRead = (notificationId: string) => {
        setMarkingRead(notificationId);
        router.post(
            `/notifications/${notificationId}/read`,
            {},
            {
                preserveScroll: true,
                onFinish: () => setMarkingRead(null),
            }
        );
    };

    const markAllAsRead = () => {
        setMarkingAll(true);
        router.post(
            '/notifications/read-all',
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('All notifications marked as read.');
                },
                onFinish: () => setMarkingAll(false),
            }
        );
    };

    return {
        markingRead,
        markingAll,
        markAsRead,
        markAllAsRead,
    };
}
