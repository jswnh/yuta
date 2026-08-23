import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import ListingCard from '@/components/listing-card';
import type { Listing } from '@/types/listing';
import { Heart, Store, ArrowUpRight } from 'lucide-react';

interface FavoritesIndexProps {
    favorites: {
        data: {
            id: string;
            listing: Listing;
        }[];
        current_page: number;
        last_page: number;
        total: number;
    };
}

export default function FavoritesIndex({ favorites }: FavoritesIndexProps) {
    const listings = favorites.data
        .map((f) => f.listing)
        .filter((l): l is Listing => Boolean(l));

    return (
        <AppLayout breadcrumbs={[{ title: 'Saved Properties', href: '/favorites' }]}>
            <Head title="Saved Properties — Yuta" />

            <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-white">Saved Properties & Lots</h1>
                        <p className="text-slate-400 text-xs sm:text-sm mt-1">
                            Your bookmarked real estate listings for quick access and tracking.
                        </p>
                    </div>

                    <Link
                        href="/marketplace"
                        className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300"
                    >
                        <span>Explore More Properties</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                {listings.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {listings.map((item) => (
                            <ListingCard key={item.listing_id} listing={item} />
                        ))}
                    </div>
                ) : (
                    <div className="p-16 text-center rounded-3xl bg-slate-900/40 border border-slate-800">
                        <Heart className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                        <h3 className="text-base font-bold text-white">No saved properties yet</h3>
                        <p className="text-slate-400 text-xs mt-1 max-w-md mx-auto">
                            Click the heart icon on any property listing in the marketplace to save it to your list.
                        </p>
                        <Link
                            href="/marketplace"
                            className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
                        >
                            <Store className="w-4 h-4" />
                            <span>Browse Marketplace</span>
                        </Link>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}