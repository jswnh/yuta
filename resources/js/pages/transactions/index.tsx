import { Head, Link } from '@inertiajs/react';
import type { Transaction } from '@/types/transaction';
import { 
    CreditCard, 
    ChevronRight, 
} from 'lucide-react';

interface TransactionsIndexProps {
    transactions: {
        data: Transaction[];
        current_page: number;
        last_page: number;
        total: number;
    };
}

export default function TransactionsIndex({ transactions }: TransactionsIndexProps) {
    return (
        <>
            <Head title="Property Transactions" />

            <div className="flex flex-col gap-6 p-6">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white">Property Transactions & Invoices</h1>
                    <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1">
                        Secure transaction records, payment receipts, and settlement logs.
                    </p>
                </div>

                <div className="space-y-4">
                    {transactions.data.length > 0 ? (
                        transactions.data.map((tx) => (
                            <Link
                                key={tx.id}
                                href={`/transactions/${tx.id}`}
                                className="block p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-slate-700 shadow-sm transition-all group"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-slate-950 border border-emerald-100 dark:border-slate-800 flex items-center justify-center shrink-0 text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
                                            <CreditCard className="w-6 h-6" />
                                        </div>

                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-xs text-slate-500 dark:text-slate-400 font-bold">{tx.transaction_number}</span>
                                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                                    tx.payment_status === 'completed' ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20' :
                                                    tx.payment_status === 'pending' ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20' :
                                                    tx.payment_status === 'failed' ? 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20' :
                                                    'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                                }`}>
                                                    {tx.payment_status}
                                                </span>
                                            </div>

                                            <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                                {tx.listing?.title || 'Property Payment'}
                                            </h3>

                                            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                                                <span>Buyer: <strong className="text-slate-700 dark:text-slate-300 font-medium">{tx.buyer?.name}</strong></span>
                                                <span>•</span>
                                                <span>Seller: <strong className="text-slate-700 dark:text-slate-300 font-medium">{tx.seller?.name}</strong></span>
                                                <span>•</span>
                                                <span>Channel: <strong className="capitalize text-slate-700 dark:text-slate-300 font-medium">{tx.payment_channel || tx.payment_method}</strong></span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between sm:justify-end gap-6 sm:text-right">
                                        <div>
                                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Amount</span>
                                            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                                                ₱{Number(tx.amount).toLocaleString()}
                                            </span>
                                            <span className="text-[11px] text-slate-500 block mt-0.5">
                                                {new Date(tx.created_at).toLocaleDateString()}
                                            </span>
                                        </div>

                                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 shadow-sm">
                            <CreditCard className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">No transactions recorded yet</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                                Complete deal agreements to initiate digital or offline property payments.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

TransactionsIndex.layout = {
    breadcrumbs: [
        { title: 'Marketplace', href: '/' },
        { title: 'Property Transactions', href: '/transactions' },
    ],
};