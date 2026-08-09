import listings from '@/routes/listings';

export default function Listings() {
    return (
        <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4"></div>
    );
}

Listings.layout = {
    head: { title: 'Listings' },
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
