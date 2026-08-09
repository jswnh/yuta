// resources/js/Providers/PushNotificationProvider.tsx
import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    ReactNode,
} from 'react';
import { subscribeToPush, unsubscribeFromPush } from '@/lib/push';

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY as string;
console.log('VAPID_PUBLIC_KEY', VAPID_PUBLIC_KEY);

interface PushNotificationContextValue {
    subscribed: boolean;
    loading: boolean;
    error: string | null;
    supported: boolean;
    subscribe: () => Promise<void>;
    unsubscribe: () => Promise<void>;
}

const PushNotificationContext =
    createContext<PushNotificationContextValue | null>(null);

export function PushNotificationProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [subscribed, setSubscribed] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [supported, setSupported] = useState<boolean>(true);

    const subscribe = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            await subscribeToPush(VAPID_PUBLIC_KEY);
            setSubscribed(true);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : 'Something went wrong.',
            );
        } finally {
            setLoading(false);
        }
    }, []);

    const unsubscribe = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            await unsubscribeFromPush();
            setSubscribed(false);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : 'Something went wrong.',
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
            setSupported(false);
            return;
        }

        navigator.serviceWorker.getRegistration().then(async (reg) => {
            const sub = await reg?.pushManager.getSubscription();

            if (sub) {
                setSubscribed(true);
                return;
            }

            // Only auto-prompt if the browser hasn't already been asked/denied.
            if (Notification.permission === 'default') {
                subscribe();
            } else if (Notification.permission === 'granted') {
                // Permission already granted previously but no active subscription
                // (e.g. cleared site data) — resubscribe silently.
                subscribe();
            }
        });
    }, [subscribe]);

    return (
        <PushNotificationContext.Provider
            value={{
                subscribed,
                loading,
                error,
                supported,
                subscribe,
                unsubscribe,
            }}
        >
            {children}
        </PushNotificationContext.Provider>
    );
}

export function usePushNotification() {
    const ctx = useContext(PushNotificationContext);
    if (!ctx) {
        throw new Error(
            'usePushNotification must be used within a PushNotificationProvider',
        );
    }
    return ctx;
}
