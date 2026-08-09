import { Head } from '@inertiajs/react';
import listings from '@/routes/listings';

export default function Listings() {
    return (
        <>
            <Head title="Listings" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4"></div>
        </>
    );
}

Listings.layout = {
    breadcrumbs: [
        {
            title: 'Listings',
            href: listings.index(),
        },
        {
            title: 'Create New',
            href: listings.new(),
        },
    ],
};
