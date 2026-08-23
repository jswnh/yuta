import { useState } from 'react';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';

export function useSavedListings() {
    const [isToggling, setIsToggling] = useState<Record<string, boolean>>({});

    const toggleFavorite = (listingId: string, currentlyFavorited?: boolean) => {
        setIsToggling((prev) => ({ ...prev, [listingId]: true }));

        router.post(
            `/properties/${listingId}/favorite`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(
                        currentlyFavorited
                            ? 'Removed from saved properties.'
                            : 'Added to your saved properties!'
                    );
                },
                onError: () => {
                    toast.error('Please log in to save properties.');
                },
                onFinish: () => {
                    setIsToggling((prev) => ({ ...prev, [listingId]: false }));
                },
            }
        );
    };

    return {
        toggleFavorite,
        isToggling,
    };
}
