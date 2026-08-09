import listings from '@/routes/listings';

export default function CreateListing() {
    return (
        <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4"></div>
    );
}

CreateListing.layout = {
    head: { title: 'Create New Listing' },
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
