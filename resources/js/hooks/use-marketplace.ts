import { useState, useTransition } from 'react';
import { router } from '@inertiajs/react';
import type { Listing } from '@/types/listing';
import { toast } from 'sonner';

export interface MarketplaceFilterState {
    search?: string;
    category?: string;
    land_type?: string;
    seller_type?: string;
    title_status?: string;
    province?: string;
    min_price?: string;
    max_price?: string;
    min_area?: string;
    max_area?: string;
    sort?: string;
}

export function useMarketplace(initialFilters: MarketplaceFilterState = {}) {
    const [filters, setFilters] = useState<MarketplaceFilterState>(initialFilters);
    const [aiQuery, setAiQuery] = useState('');
    const [aiLoading, setAiLoading] = useState(false);
    const [aiResults, setAiResults] = useState<Listing[] | null>(null);
    const [aiInterpretation, setAiInterpretation] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const updateFilter = (key: keyof MarketplaceFilterState, value: string | undefined) => {
        const nextFilters = {
            ...filters,
            [key]: value === 'all' || value === '' ? undefined : value,
        };
        setFilters(nextFilters);

        // Apply filters to backend
        const cleanParams: Record<string, string> = {};
        Object.entries(nextFilters).forEach(([k, v]) => {
            if (v !== undefined && v !== '') {
                cleanParams[k] = v;
            }
        });

        router.get('/marketplace', cleanParams, {
            preserveState: true,
            preserveScroll: true,
            only: ['listings', 'filters'],
        });
    };

    const resetFilters = () => {
        setFilters({});
        setAiResults(null);
        setAiInterpretation(null);
        setAiQuery('');
        router.get('/marketplace', {}, { preserveState: true, preserveScroll: true });
    };

    const runAiSearch = async (naturalQuery: string) => {
        if (!naturalQuery.trim()) {
            setAiResults(null);
            setAiInterpretation(null);
            return;
        }

        setAiLoading(true);
        setAiQuery(naturalQuery);

        try {
            const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';
            const res = await fetch('/marketplace/ai-search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({ query: naturalQuery }),
            });

            if (!res.ok) {
                throw new Error('AI search request failed');
            }

            const data = await res.json();
            setAiResults(data.listings || []);
            setAiInterpretation(data.interpretation || `Properties matching "${naturalQuery}"`);
            toast.success('AI search completed with real property matches.');
        } catch (error) {
            console.error('AI search error:', error);
            toast.error('AI search temporarily unavailable. Falling back to standard filters.');
        } finally {
            setAiLoading(false);
        }
    };

    return {
        filters,
        updateFilter,
        resetFilters,
        aiQuery,
        setAiQuery,
        aiLoading,
        aiResults,
        aiInterpretation,
        runAiSearch,
        clearAiSearch: () => {
            setAiResults(null);
            setAiInterpretation(null);
            setAiQuery('');
        },
        isPending,
    };
}
