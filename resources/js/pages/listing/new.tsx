import { Head } from '@inertiajs/react';
import listings from '@/routes/listings';

export default function CreateListing() {
    return (
        <>
            <Head title="Create New Listing" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4"></div>
        </>
    );
}

CreateListing.layout = {
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
