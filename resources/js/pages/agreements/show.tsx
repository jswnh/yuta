import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useAgreements } from '@/hooks/use-agreements';
import type { Agreement } from '@/types/agreement';
import { 
    FileText, 
    Check, 
    X, 
    Clock, 
    DollarSign, 
    ArrowLeft, 
    ShieldCheck, 
    MapPin, 
    CreditCard, 
    Calendar, 
    CheckCircle2, 
    XCircle,
    AlertCircle,
    Send
} from 'lucide-react';

interface AgreementShowProps {
    agreement: Agreement;
}

export default function AgreementShow({ agreement }: AgreementShowProps) {
    const { auth } = usePage().props as { auth?: { user?: any } };
    const { acceptAgreement, rejectAgreement, cancelAgreement, completeAgreement, processingAction } = useAgreements();

    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState('');

    const isBuyer = auth?.user?.user_id === agreement.buyer_id;
    const isSeller = auth?.user?.user_id === agreement.seller_id;
    const isProposer = auth?.user?.user_id === agreement.proposed_by;
    const loading = Boolean(processingAction);

    const handleRejectSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        rejectAgreement(agreement.id, rejectReason || 'Agreement proposal terms were declined.');
        setRejectModalOpen(false);
    };

    const handleInitiatePayment = () => {
        router.post('/transactions', {
            agreement_id: agreement.id,
            payment_method: 'xendit',
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Agreements', href: '/agreements' },
                { title: agreement.agreement_number, href: `/agreements/${agreement.id}` },
            ]}
        >
            <Head title={`Agreement ${agreement.agreement_number} — Yuta`} />

            <div className="flex flex-col gap-8 p-6 max-w-5xl mx-auto">
                {/* HEADER */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <span className="font-mono text-sm text-slate-400 font-bold">{agreement.agreement_number}</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                                agreement.status === 'accepted' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' :
                                agreement.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                agreement.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                agreement.status === 'rejected' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                                'bg-slate-800 text-slate-400'
                            }`}>
                                {agreement.status}
                            </span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
                            {agreement.listing?.title || 'Land Deal Agreement'}
                        </h1>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex flex-wrap items-center gap-2">
                        {agreement.status === 'pending' && !isProposer && (
                            <>
                                <button
                                    onClick={() => acceptAgreement(agreement.id)}
                                    disabled={loading}
                                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                                >
                                    <Check className="w-4 h-4" />
                                    <span>Accept Terms</span>
                                </button>
                                <button
                                    onClick={() => setRejectModalOpen(true)}
                                    disabled={loading}
                                    className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                                >
                                    <X className="w-4 h-4" />
                                    <span>Decline</span>
                                </button>
                            </>
                        )}

                        {agreement.status === 'accepted' && isBuyer && (
                            <button
                                onClick={handleInitiatePayment}
                                disabled={loading}
                                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                                <CreditCard className="w-4 h-4" />
                                <span>Proceed to Payment / Checkout</span>
                            </button>
                        )}

                        {agreement.status === 'accepted' && (
                            <button
                                onClick={() => completeAgreement(agreement.id)}
                                disabled={loading}
                                className="px-4 py-2.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 text-teal-400 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Mark Deal Completed</span>
                            </button>
                        )}

                        {(agreement.status === 'pending' || agreement.status === 'accepted') && (
                            <button
                                onClick={() => cancelAgreement(agreement.id)}
                                disabled={loading}
                                className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold cursor-pointer"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </div>

                {/* TERMS CARD */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
                        <h2 className="text-lg font-bold text-white">Deal Financial Terms</h2>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                                <span className="text-[11px] font-semibold text-slate-500 uppercase block">Agreed Price</span>
                                <span className="text-xl font-black text-emerald-400">
                                    ₱{Number(agreement.agreed_price).toLocaleString()}
                                </span>
                            </div>

                            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                                <span className="text-[11px] font-semibold text-slate-500 uppercase block">Payment Schedule</span>
                                <span className="text-sm font-bold text-white capitalize">
                                    {agreement.payment_type?.replace('_', ' ')}
                                </span>
                            </div>

                            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                                <span className="text-[11px] font-semibold text-slate-500 uppercase block">Down Payment</span>
                                <span className="text-sm font-bold text-white">
                                    {agreement.down_payment ? `₱${Number(agreement.down_payment).toLocaleString()}` : 'N/A'}
                                </span>
                            </div>

                            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                                <span className="text-[11px] font-semibold text-slate-500 uppercase block">Target Closing</span>
                                <span className="text-sm font-bold text-white">
                                    {agreement.target_closing_date ? new Date(agreement.target_closing_date).toLocaleDateString() : 'To be agreed'}
                                </span>
                            </div>

                            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                                <span className="text-[11px] font-semibold text-slate-500 uppercase block">Proposed By</span>
                                <span className="text-sm font-bold text-white">
                                    {agreement.proposer?.name || 'Party'}
                                </span>
                            </div>

                            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                                <span className="text-[11px] font-semibold text-slate-500 uppercase block">Created Date</span>
                                <span className="text-sm font-bold text-white">
                                    {new Date(agreement.created_at).toLocaleDateString()}
                                </span>
                            </div>
                        </div>

                        {(agreement.special_provisions || agreement.terms_and_conditions) && (
                            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                                <span className="text-[11px] font-semibold text-slate-400 uppercase">Special Terms & Conditions</span>
                                <p className="text-xs text-slate-300 whitespace-pre-line">{agreement.special_provisions || agreement.terms_and_conditions}</p>
                            </div>
                        )}

                        {agreement.rejection_reason && (
                            <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 space-y-1">
                                <span className="text-[11px] font-bold text-rose-400 uppercase">Decline / Rejection Reason</span>
                                <p className="text-xs text-rose-200">{agreement.rejection_reason}</p>
                            </div>
                        )}
                    </div>

                    {/* PROPERTY SUMMARY */}
                    <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 h-fit">
                        <h2 className="text-base font-bold text-white">Property Details</h2>
                        {agreement.listing && (
                            <div className="space-y-3">
                                <div className="h-36 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                                    <img
                                        src={agreement.listing.images?.[0]?.file_path || '/images/aerial_land_plot.jpg'}
                                        alt=""
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <Link href={`/properties/${agreement.listing.slug}`} className="font-bold text-sm text-white hover:text-emerald-400 line-clamp-1">
                                        {agreement.listing.title}
                                    </Link>
                                    <span className="text-xs text-slate-400 block mt-0.5">
                                        {agreement.listing.city_municipality}, {agreement.listing.province}
                                    </span>
                                </div>
                                <div className="border-t border-slate-800 pt-3 text-xs space-y-1 text-slate-400">
                                    <p>Lot Area: <strong className="text-white">{Number(agreement.listing.area).toLocaleString()} {agreement.listing.area_unit}</strong></p>
                                    <p>Title: <strong className="text-white capitalize">{agreement.listing.title_status?.replace('_', ' ')}</strong></p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ACTIVITY TIMELINE */}
                <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
                    <h2 className="text-lg font-bold text-white">Agreement Timeline & Deal History</h2>

                    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                        {agreement.timelines && agreement.timelines.length > 0 ? (
                            agreement.timelines.map((timeline) => (
                                <div key={timeline.id} className="relative group">
                                    <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-slate-900" />
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-xs text-white capitalize">{timeline.action.replace('_', ' ')}</span>
                                            <span className="text-[11px] text-slate-500">• {new Date(timeline.created_at).toLocaleString()}</span>
                                        </div>
                                        {timeline.description && (
                                            <p className="text-xs text-slate-400 mt-1">{timeline.description}</p>
                                        )}
                                        {timeline.user && (
                                            <span className="text-[10px] text-slate-500 mt-0.5 block">By {timeline.user.name}</span>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-xs text-slate-500">Agreement initiated.</div>
                        )}
                    </div>
                </div>
            </div>

            {/* REJECT REASON MODAL */}
            {rejectModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-white">Decline Agreement Terms</h3>
                            <button onClick={() => setRejectModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleRejectSubmit} className="space-y-4 text-xs">
                            <div>
                                <label className="font-semibold text-slate-300 block mb-1">Reason for declining (Optional)</label>
                                <textarea
                                    rows={3}
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    placeholder="Explain why the proposed terms or price were not acceptable..."
                                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-white"
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setRejectModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold">
                                    Cancel
                                </button>
                                <button type="submit" disabled={loading} className="px-5 py-2 rounded-xl bg-rose-500 text-white font-bold">
                                    Confirm Decline
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}