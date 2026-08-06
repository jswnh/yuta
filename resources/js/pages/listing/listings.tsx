import { Head } from '@inertiajs/react';
export default function Listings() {
    return (
        <>
            <Head title="Listings" />
            <div className=""></div>
        </>
    );
}

Listings.layout = {
    breadcrumbs: [
        {
            title: 'Listings',
            href: '/listings',
        },
    ],
};
