import { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import type { PlanDetails, Subscription } from '@/types/subscription';
import billingPlansContent from '@/data/billing-plans.json';
import {
    CheckCircle2,
    ShieldCheck,
    CreditCard,
    Zap,
    ExternalLink,
    AlertCircle,
    Building2,
    Sparkles,
    Calendar,
    ChevronDown,
    ChevronUp,
    HelpCircle,
    Loader2,
    Clock,
    Lock
} from 'lucide-react';

interface Props {
    currentSubscription: Subscription | null;
    subscriptions: Subscription[];
    isSeller: boolean;
    plan: PlanDetails;
    xenditPublicKey?: string;
}

export default function BillingIndex({
    currentSubscription,
    subscriptions = [],
    isSeller,
    plan,
}: Props) {
    const { flash } = usePage().props as { flash?: { success?: string; error?: string; info?: string } };
    const [loadingCheckout, setLoadingCheckout] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    const handleSubscribe = () => {
        setLoadingCheckout(true);
        router.post('/billing/checkout', {}, {
            onFinish: () => setLoadingCheckout(false),
        });
    };

    const handleCancel = (subscriptionId: string) => {
        if (confirm('Are you sure you want to cancel your monthly seller subscription? Your seller benefits will end at the end of the current billing cycle.')) {
            router.post(`/billing/cancel/${subscriptionId}`);
        }
    };

    const faqs = billingPlansContent.faqs || [];
    const supportedPaymentMethods = billingPlansContent.supportedPaymentMethods || [];

    return (
        <div className="p-4 space-y-8">

            {/* PAGE HEADER */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-2">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Xendit Secure Payment Gateway</span>
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        Billing & Seller Subscriptions
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                        Manage your monthly seller membership, view payment history, and upgrade your plan with Xendit.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {isSeller ? (
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
                        >
                            <Building2 className="w-4 h-4" />
                            <span>Go to Seller Dashboard</span>
                        </Link>
                    ) : (
                        <button
                            onClick={handleSubscribe}
                            disabled={loadingCheckout}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-md hover:shadow-emerald-500/20 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
                        >
                            {loadingCheckout ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Zap className="w-4 h-4 text-slate-950 fill-slate-950" />
                            )}
                            <span>Become a Seller (₱{plan.price}/mo)</span>
                        </button>
                    )}
                </div>
            </div>

            {/* FLASH NOTIFICATIONS */}
            {flash?.success && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 flex items-center justify-between gap-3 animate-in fade-in">
                    <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                        <span className="text-sm font-semibold">{flash.success}</span>
                    </div>
                </div>
            )}
            {flash?.error && (
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 flex items-center justify-between gap-3 animate-in fade-in">
                    <div className="flex items-center gap-2.5">
                        <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
                        <span className="text-sm font-semibold">{flash.error}</span>
                    </div>
                </div>
            )}
            {flash?.info && (
                <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-700 dark:text-blue-300 flex items-center justify-between gap-3 animate-in fade-in">
                    <div className="flex items-center gap-2.5">
                        <AlertCircle className="w-5 h-5 text-blue-500 shrink-0" />
                        <span className="text-sm font-semibold">{flash.info}</span>
                    </div>
                </div>
            )}

            {/* CURRENT PLAN HERO BANNER */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950 border border-slate-800 p-6 sm:p-8 text-white shadow-xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                                Current Plan
                            </span>
                            {isSeller && currentSubscription?.status === 'active' ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                                    ACTIVE SELLER
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
                                    REGULAR BUYER (FREE)
                                </span>
                            )}
                        </div>

                        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                            {isSeller && currentSubscription
                                ? currentSubscription.plan_name
                                : 'Free Buyer Account'}
                        </h2>

                        <p className="text-slate-300 text-sm max-w-xl">
                            {isSeller && currentSubscription
                                ? `Your monthly seller membership is active. You have full listing, messaging, and aerial HUD map spotlight privileges.`
                                : `Subscribe to the Seller Pro Monthly plan to unlock your seller dashboard and start listing properties.`}
                        </p>

                        {currentSubscription && (
                            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-300 pt-2">
                                {currentSubscription.ends_at && (
                                    <span className="flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4 text-emerald-400" />
                                        Billing Period Ends: <strong className="text-white">{new Date(currentSubscription.ends_at).toLocaleDateString()}</strong>
                                    </span>
                                )}
                                {currentSubscription.payment_method && (
                                    <span className="flex items-center gap-1.5">
                                        <CreditCard className="w-4 h-4 text-emerald-400" />
                                        Payment: <strong className="text-white">{currentSubscription.payment_method}</strong>
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row md:flex-col items-stretch gap-3 shrink-0">
                        {isSeller && currentSubscription?.status === 'active' ? (
                            <button
                                onClick={() => handleCancel(currentSubscription.id)}
                                className="px-4 py-2.5 rounded-xl border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold transition-all cursor-pointer text-center"
                            >
                                Cancel Subscription
                            </button>
                        ) : (
                            <button
                                onClick={handleSubscribe}
                                disabled={loadingCheckout}
                                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg hover:shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                                {loadingCheckout ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Zap className="w-4 h-4 fill-slate-950" />
                                )}
                                <span>Subscribe via Xendit</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* PRICING TIER SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* SELLER PRO MONTHLY CARD */}
                <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border-2 border-emerald-500/50 shadow-xl relative overflow-hidden space-y-6">
                    
                    <div className="absolute top-0 right-0 bg-gradient-to-l from-emerald-500 to-teal-500 text-slate-950 text-[10px] font-black uppercase tracking-wider px-4 py-1.5 rounded-bl-2xl shadow-sm">
                        RECOMMENDED FOR SELLERS
                    </div>

                    <div>
                        <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">
                            {plan.name}
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                                ₱{plan.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
                            <span className="text-slate-500 dark:text-slate-400 text-sm font-semibold">
                                / {plan.interval}
                            </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-2">
                            Complete monthly access to list land, commercial, residential, and farm properties with interactive aerial maps and direct buyer leads.
                        </p>
                    </div>

                    {/* FEATURES LIST */}
                    <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Included Features:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {plan.features.map((feature, i) => (
                                <div key={i} className="flex items-start gap-2.5 text-xs font-medium text-slate-700 dark:text-slate-200">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* XENDIT PAYMENT METHODS DISPLAY */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                            <span className="flex items-center gap-1.5">
                                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                Supported Xendit Payment Options:
                            </span>
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                                INSTANT CONFIRMATION
                            </span>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2">
                            {supportedPaymentMethods.map((pm: string, idx: number) => (
                                <span 
                                    key={idx}
                                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-300 shadow-xs"
                                >
                                    {pm}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* CHECKOUT BUTTON */}
                    <button
                        onClick={handleSubscribe}
                        disabled={loadingCheckout || (isSeller && currentSubscription?.status === 'active')}
                        className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-sm sm:text-base shadow-xl hover:shadow-emerald-500/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loadingCheckout ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <CreditCard className="w-5 h-5 text-slate-950" />
                        )}
                        <span>
                            {isSeller && currentSubscription?.status === 'active'
                                ? 'Plan Currently Active'
                                : `Subscribe via Xendit (₱${plan.price}/mo)`}
                        </span>
                    </button>
                </div>

                {/* FREE VS PRO COMPARISON CARD */}
                <div className="lg:col-span-5 space-y-6">
                    
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-lg space-y-4">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-emerald-500" />
                            <span>Why Become a Seller?</span>
                        </h3>

                        <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                                <strong className="text-slate-900 dark:text-white block mb-0.5">Reach Real Property Buyers</strong>
                                Over 15,000+ monthly active land and property buyers searching across the Philippines.
                            </div>
                            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                                <strong className="text-slate-900 dark:text-white block mb-0.5">Aerial Map & Boundaries</strong>
                                Showcase exact plot boundaries with polygon plotting and terrain analytics.
                            </div>
                            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                                <strong className="text-slate-900 dark:text-white block mb-0.5">Xendit Instant Checkout</strong>
                                Safe & reliable Philippine payment gateway processing with instant invoice receipts.
                            </div>
                        </div>
                    </div>

                    {/* XENDIT SECURITY CARD */}
                    <div className="p-5 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                            <Lock className="w-4 h-4" />
                            <span>Encrypted Xendit Payment Gateway</span>
                        </div>
                        <p className="text-xs text-slate-300">
                            All transactions are processed directly by Xendit Philippines (licensed payment institution). Yuta never stores sensitive card or wallet credentials.
                        </p>
                    </div>

                </div>
            </div>

            {/* SUBSCRIPTION HISTORY TABLE */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                            Payment & Billing History
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            View past invoice records, payment dates, and Xendit reference IDs.
                        </p>
                    </div>
                    <span className="text-xs font-mono font-semibold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {subscriptions.length} Records
                    </span>
                </div>

                {subscriptions.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                        <Clock className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No payment history yet</p>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                            When you subscribe to a monthly seller plan, your Xendit invoice records will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                                    <th className="pb-3 px-2">Date</th>
                                    <th className="pb-3 px-2">Plan</th>
                                    <th className="pb-3 px-2">Amount</th>
                                    <th className="pb-3 px-2">Xendit Ref</th>
                                    <th className="pb-3 px-2">Channel</th>
                                    <th className="pb-3 px-2">Status</th>
                                    <th className="pb-3 px-2 text-right">Invoice</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                                {subscriptions.map((sub) => (
                                    <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="py-3.5 px-2 text-slate-700 dark:text-slate-300">
                                            {new Date(sub.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="py-3.5 px-2 font-bold text-slate-900 dark:text-white">
                                            {sub.plan_name}
                                        </td>
                                        <td className="py-3.5 px-2 font-semibold text-slate-900 dark:text-white">
                                            ₱{Number(sub.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="py-3.5 px-2 font-mono text-slate-500 text-[11px]">
                                            {sub.xendit_external_id}
                                        </td>
                                        <td className="py-3.5 px-2 text-slate-600 dark:text-slate-400">
                                            {sub.payment_method || 'Xendit'}
                                        </td>
                                        <td className="py-3.5 px-2">
                                            {sub.status === 'active' && (
                                                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase">
                                                    Paid & Active
                                                </span>
                                            )}
                                            {sub.status === 'expired' && (
                                                <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-bold uppercase">
                                                    Expired
                                                </span>
                                            )}
                                            {sub.status === 'pending' && (
                                                <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold uppercase">
                                                    Pending
                                                </span>
                                            )}
                                            {sub.status === 'cancelled' && (
                                                <span className="px-2.5 py-1 rounded-full bg-slate-500/10 text-slate-600 dark:text-slate-400 text-[10px] font-bold uppercase">
                                                    Cancelled
                                                </span>
                                            )}
                                            {sub.status === 'failed' && (
                                                <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-bold uppercase">
                                                    Failed
                                                </span>
                                            )}
                                            {!['active', 'expired', 'pending', 'cancelled', 'failed'].includes(sub.status) && (
                                                <span className="px-2.5 py-1 rounded-full bg-slate-500/10 text-slate-600 dark:text-slate-400 text-[10px] font-bold uppercase">
                                                    {sub.status}
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3.5 px-2 text-right">
                                            {sub.xendit_invoice_url ? (
                                                <a
                                                    href={sub.xendit_invoice_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
                                                >
                                                    <span>View</span>
                                                    <ExternalLink className="w-3 h-3" />
                                                </a>
                                            ) : (
                                                <span className="text-slate-400">-</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* FREQUENTLY ASKED QUESTIONS */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <HelpCircle className="w-5 h-5 text-emerald-500" />
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        Frequently Asked Questions
                    </h3>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {faqs.map((faq: { question?: string; q?: string; answer?: string; a?: string }, idx: number) => (
                        <div key={idx} className="py-4">
                            <button
                                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                className="w-full flex items-center justify-between text-left font-bold text-slate-900 dark:text-white text-sm cursor-pointer"
                            >
                                <span>{faq.question || faq.q}</span>
                                {openFaq === idx ? (
                                    <ChevronUp className="w-4 h-4 text-emerald-500 shrink-0" />
                                ) : (
                                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                                )}
                            </button>
                            {openFaq === idx && (
                                <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed animate-in fade-in">
                                    {faq.answer || faq.a}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}

BillingIndex.layout = {
    head: { title: 'Billing & Subscriptions' },
    breadcrumbs: [
        { title: 'Marketplace', href: '/' },
        { title: 'Billing', href: '/billing' },
    ],
};
