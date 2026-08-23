import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { Agreement } from '@/types/agreement';
import { 
    FileText, 
    ChevronRight, 
    Calendar, 
    DollarSign, 
    ArrowUpRight, 
    Clock, 
    CheckCircle2, 
    XCircle,
    UserCheck
} from 'lucide-react';

interface AgreementsIndexProps {
    agreements: {
        data: Agreement[];
        current_page: number;
        last_page: number;
        total: number;
    };
    filters?: Record<string, string>;
}

export default function AgreementsIndex({ agreements, filters = {} }: AgreementsIndexProps) {
    const [tab, setTab] = useState(filters.tab || 'all');
    const [status, setStatus] = useState(filters.status || 'all');

    const handleFilterChange = (newTab?: string, newStatus?: string) => {
        const activeTab = newTab !== undefined ? newTab : tab;
        const activeStatus = newStatus !== undefined ? newStatus : status;
        if (newTab !== undefined) setTab(newTab);
        if (newStatus !== undefined) setStatus(newStatus);

        const params: Record<string, string> = {};
        if (activeTab !== 'all') params.tab = activeTab;
        if (activeStatus !== 'all') params.status = activeStatus;

        router.get('/agreements', params, { preserveState: true, preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Deal Agreements', href: '/agreements' }]}>
            <Head title="Deal Agreements — Yuta" />

            <div className="flex flex-col gap-6 p-6">
                <div>
                    <h1 className="text-2xl font-black text-white">Land & Property Agreements</h1>
                    <p className="text-slate-400 text-xs sm:text-sm mt-1">
                        Track offer proposals, negotiation timelines, and digital property agreements.
                    </p>
                </div>

                {/* ROLE & STATUS TABS */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-2xl border border-slate-800">
                        {[
                            { id: 'all', label: 'All Deals' },
                            { id: 'buyer', label: 'As Buyer' },
                            { id: 'seller', label: 'As Seller' },
                        ].map((t) => (
                            <button
                                key={t.id}
                                onClick={() => handleFilterChange(t.id, undefined)}
                                className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                    tab === t.id ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-2xl border border-slate-800 text-xs">
                        {[
                            { id: 'all', label: 'All Statuses' },
                            { id: 'pending', label: 'Pending' },
                            { id: 'accepted', label: 'Accepted' },
                            { id: 'completed', label: 'Completed' },
                            { id: 'rejected', label: 'Rejected' },
                        ].map((s) => (
                            <button
                                key={s.id}
                                onClick={() => handleFilterChange(undefined, s.id)}
                                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                                    status === s.id ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* AGREEMENTS LIST */}
                <div className="space-y-4">
                    {agreements.data.length > 0 ? (
                        agreements.data.map((item) => (
                            <Link
                                key={item.id}
                                href={`/agreements/${item.id}`}
                                className="block p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all group"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 text-emerald-400 group-hover:scale-105 transition-transform">
                                            <FileText className="w-6 h-6" />
                                        </div>

                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-xs text-slate-400 font-bold">{item.agreement_number}</span>
                                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                                    item.status === 'accepted' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' :
                                                    item.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                                    item.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                                    item.status === 'rejected' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                                                    'bg-slate-800 text-slate-400'
                                                }`}>
                                                    {item.status}
                                                </span>
                                            </div>

                                            <h3 className="font-bold text-base text-white group-hover:text-emerald-400 transition-colors">
                                                {item.listing?.title || 'Property Deal Agreement'}
                                            </h3>

                                            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                                                <span>Buyer: {item.buyer?.name}</span>
                                                <span>•</span>
                                                <span>Seller: {item.seller?.name}</span>
                                                <span>•</span>
                                                <span>Payment: <strong className="capitalize text-slate-300">{item.payment_type?.replace('_', ' ')}</strong></span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between sm:justify-end gap-6 sm:text-right">
                                        <div>
                                            <span className="text-[10px] uppercase font-bold text-slate-500 block">Agreed Amount</span>
                                            <span className="text-xl font-black text-emerald-400">
                                                ₱{Number(item.agreed_price).toLocaleString()}
                                            </span>
                                        </div>

                                        <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800">
                            <FileText className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                            <h3 className="text-base font-bold text-white">No agreements found</h3>
                            <p className="text-slate-400 text-xs mt-1">
                                Propose a deal from any property listing to start an agreement.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}