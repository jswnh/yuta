// resources/js/lib/push.ts
// resources/js/lib/push.ts
function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; i++) {
        outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
}

export async function subscribeToPush(
    vapidPublicKey: string,
): Promise<PushSubscription> {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        throw new Error(
            'Push notifications are not supported in this browser.',
        );
    }

    const registration =
        await navigator.serviceWorker.register('/service-worker.js');

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
        throw new Error('Notification permission was not granted.');
    }

    const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    });

    await window.axios.post('/push-subscriptions', subscription.toJSON());

    return subscription;
}

export async function unsubscribeFromPush(): Promise<void> {
    const registration = await navigator.serviceWorker.getRegistration();
    const subscription = await registration?.pushManager.getSubscription();

    if (subscription) {
        await window.axios.delete('/push-subscriptions', {
            data: { endpoint: subscription.endpoint },
        });
        await subscription.unsubscribe();
    }
}
