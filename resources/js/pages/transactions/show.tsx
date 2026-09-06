import { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { useTransactions } from '@/hooks/use-transactions';
import type { Transaction } from '@/types/transaction';
import { 
    CreditCard, 
    ExternalLink, 
    Check, 
    X, 
} from 'lucide-react';

interface TransactionShowProps {
    transaction: Transaction;
}

export default function TransactionShow({ transaction }: TransactionShowProps) {
    const { auth } = usePage().props as { auth?: { user?: any } };
    const { confirmManualPayment, isProcessing } = useTransactions();

    const [manualModalOpen, setManualModalOpen] = useState(false);
    const [referenceNumber, setReferenceNumber] = useState('');
    const [notes, setNotes] = useState('');

    const isPayee = auth?.user?.user_id === transaction.seller_id;
    const isPayer = auth?.user?.user_id === transaction.buyer_id;

    const handleConfirmManual = (e: React.FormEvent) => {
        e.preventDefault();
        confirmManualPayment(transaction.id, referenceNumber, notes);
        setManualModalOpen(false);
    };

    return (
        <>
            <Head title={`Transaction ${transaction.transaction_number}`} />

            <div className="flex flex-col gap-8 p-6 max-w-4xl mx-auto">
                {/* HEADER */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                    <div>
                        <div className="flex items-center gap-3">
                            <span className="font-mono text-sm text-slate-500 dark:text-slate-400 font-bold">{transaction.transaction_number}</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                                transaction.payment_status === 'completed' ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20' :
                                transaction.payment_status === 'pending' ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20' :
                                'bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20'
                            }`}>
                                {transaction.payment_status}
                            </span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">Transaction Invoice & Receipt</h1>
                    </div>

                    <div className="flex items-center gap-3">
                        {transaction.payment_status === 'pending' && transaction.xendit_invoice_url && isPayer && (
                            <a
                                href={transaction.xendit_invoice_url}
                                target="_blank"
                                rel="noreferrer"
                                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
                            >
                                <CreditCard className="w-4 h-4" />
                                <span>Pay with Xendit</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                        )}

                        {transaction.payment_status === 'pending' && isPayee && (
                            <button
                                onClick={() => setManualModalOpen(true)}
                                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
                            >
                                <Check className="w-4 h-4" />
                                <span>Confirm Offline Payment Received</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* RECEIPT CARD */}
                <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                    <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800">
                        <div>
                            <span className="text-xs text-slate-500 uppercase font-bold block">Payment Amount</span>
                            <span className="text-4xl font-black text-emerald-600 dark:text-emerald-400">
                                ₱{Number(transaction.amount).toLocaleString()}
                            </span>
                        </div>

                        <div className="text-right">
                            <span className="text-xs text-slate-500 uppercase font-bold block">Date</span>
                            <span className="text-sm font-bold text-slate-900 dark:text-white">
                                {new Date(transaction.created_at).toLocaleDateString()}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                        <div className="space-y-3">
                            <span className="font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">Participant Details</span>
                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                                <p><span className="text-slate-500">Buyer:</span> <strong className="text-slate-900 dark:text-white ml-1">{transaction.buyer?.name}</strong></p>
                                <p><span className="text-slate-500">Email:</span> <span className="text-slate-700 dark:text-slate-300 ml-1">{transaction.buyer?.email}</span></p>
                                <div className="border-t border-slate-200 dark:border-slate-800 my-2 pt-2" />
                                <p><span className="text-slate-500">Seller:</span> <strong className="text-slate-900 dark:text-white ml-1">{transaction.seller?.name}</strong></p>
                                <p><span className="text-slate-500">Email:</span> <span className="text-slate-700 dark:text-slate-300 ml-1">{transaction.seller?.email}</span></p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <span className="font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">Payment Details</span>
                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                                <p><span className="text-slate-500">Method:</span> <strong className="text-slate-900 dark:text-white ml-1 uppercase">{transaction.payment_method}</strong></p>
                                <p><span className="text-slate-500">Channel:</span> <span className="text-slate-700 dark:text-slate-300 ml-1 uppercase">{transaction.payment_channel || 'Direct'}</span></p>
                                {transaction.paid_at && (
                                    <p><span className="text-slate-500">Paid At:</span> <span className="text-emerald-600 dark:text-emerald-400 ml-1">{new Date(transaction.paid_at).toLocaleString()}</span></p>
                                )}
                                {transaction.notes && (
                                    <p><span className="text-slate-500">Notes:</span> <span className="text-slate-700 dark:text-slate-300 ml-1">{transaction.notes}</span></p>
                                )}
                            </div>
                        </div>
                    </div>

                    {transaction.listing && (
                        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                            <div>
                                <span className="text-[11px] text-slate-500 uppercase font-bold block">Associated Property</span>
                                <Link href={`/properties/${transaction.listing.slug}`} className="font-bold text-sm text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400">
                                    {transaction.listing.title}
                                </Link>
                            </div>

                            {transaction.agreement && (
                                <Link href={`/agreements/${transaction.agreement.id}`} className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
                                    View Agreement #{transaction.agreement.agreement_number} →
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* MANUAL PAYMENT CONFIRMATION MODAL */}
            {manualModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Confirm Manual Payment</h3>
                            <button onClick={() => setManualModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleConfirmManual} className="space-y-4 text-xs">
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                Confirm that you have received <strong>₱{Number(transaction.amount).toLocaleString()}</strong> via bank transfer, check, or cash.
                            </p>
                            <div>
                                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Bank Reference / Check # (Optional)</label>
                                <input
                                    type="text"
                                    value={referenceNumber}
                                    onChange={(e) => setReferenceNumber(e.target.value)}
                                    placeholder="e.g. BDO-REF-9988123"
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Confirmation Notes (Optional)</label>
                                <textarea
                                    rows={2}
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="e.g. Cleared via manager's check upon contract signing."
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setManualModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer">
                                    Cancel
                                </button>
                                <button type="submit" disabled={isProcessing} className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer">
                                    Confirm Receipt
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

TransactionShow.layout = {
    breadcrumbs: [
        { title: 'Marketplace', href: '/' },
        { title: 'Transactions', href: '/transactions' },
    ],
};