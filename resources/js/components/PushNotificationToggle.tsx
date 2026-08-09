import { useState, useEffect } from 'react';
import { subscribeToPush, unsubscribeFromPush } from '@/lib/push';

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

export default function PushNotificationToggle() {
    const [subscribed, setSubscribed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        navigator.serviceWorker?.getRegistration().then(async (reg) => {
            const sub = await reg?.pushManager.getSubscription();
            setSubscribed(!!sub);
        });
    }, []);

    const handleToggle = async () => {
        setLoading(true);
        setError(null);
        try {
            if (subscribed) {
                await unsubscribeFromPush();
                setSubscribed(false);
            } else {
                await subscribeToPush(VAPID_PUBLIC_KEY);
                setSubscribed(true);
            }
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button onClick={handleToggle} disabled={loading}>
                {subscribed ? 'Disable notifications' : 'Enable notifications'}
            </button>
            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
}
