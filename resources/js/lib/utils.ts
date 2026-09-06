import type { InertiaLinkProps } from '@inertiajs/react';
import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function toUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}

export function getListingImageUrl(
    imageOrListing?: { url?: string; file_path?: string; images?: Array<{ url?: string; file_path?: string; is_primary?: boolean }> } | string | null,
): string {
    if (!imageOrListing) return '/images/aerial_land_plot.jpg';

    if (typeof imageOrListing === 'string') {
        const str = imageOrListing.trim();
        if (!str) return '/images/aerial_land_plot.jpg';
        if (str.startsWith('http://') || str.startsWith('https://') || str.startsWith('/')) {
            return str;
        }
        return `https://pub-19475a64b9ef47b78593af8d0414d4be.r2.dev/${str.replace(/^\//, '')}`;
    }

    // If a listing object is passed with an images array
    if ('images' in imageOrListing && Array.isArray(imageOrListing.images) && imageOrListing.images.length > 0) {
        const primary = imageOrListing.images.find((img) => img?.is_primary) || imageOrListing.images[0];
        return getListingImageUrl(primary);
    }

    // If an individual image object is passed
    if ('url' in imageOrListing && imageOrListing.url && (imageOrListing.url.startsWith('http') || imageOrListing.url.startsWith('/'))) {
        return imageOrListing.url;
    }

    if ('file_path' in imageOrListing && imageOrListing.file_path) {
        const fp = imageOrListing.file_path.trim();
        if (!fp) return '/images/aerial_land_plot.jpg';
        if (fp.startsWith('http://') || fp.startsWith('https://') || fp.startsWith('/')) {
            return fp;
        }
        return `https://pub-19475a64b9ef47b78593af8d0414d4be.r2.dev/${fp.replace(/^\//, '')}`;
    }

    return '/images/aerial_land_plot.jpg';
}

