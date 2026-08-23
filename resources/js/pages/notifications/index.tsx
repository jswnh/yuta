import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useNotifications } from '@/hooks/use-notifications';
import type { AppNotification } from '@/types/notification';
import { 
    Bell, 
    CheckCheck, 
    FileText, 
    CreditCard, 
    MessageSquare, 
    Layers, 
    ShieldCheck, 
    ArrowUpRight,
    Check
} from 'lucide-react';

interface NotificationsIndexProps {
    notifications: {
        data: AppNotification[];
        current_page: number;
        last_page: number;
        total: number;
    };
}

export default function NotificationsIndex({ notifications }: NotificationsIndexProps) {
    const { markAsRead, markAllAsRead, markingAll, markingRead } = useNotifications();

    const getIcon = (type?: string) => {
        if (type?.includes('agreement')) return <FileText className="w-5 h-5 text-teal-400" />;
        if (type?.includes('transaction') || type?.includes('payment')) return <CreditCard className="w-5 h-5 text-emerald-400" />;
        if (type?.includes('message') || type?.includes('inquiry')) return <MessageSquare className="w-5 h-5 text-cyan-400" />;
        if (type?.includes('verification')) return <ShieldCheck className="w-5 h-5 text-amber-400" />;
        return <Bell className="w-5 h-5 text-slate-400" />;
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Notifications', href: '/notifications' }]}>
            <Head title="Notifications — Yuta" />

            <div className="flex flex-col gap-6 p-6 max-w-4xl mx-auto">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-white">Notifications</h1>
                        <p className="text-slate-400 text-xs sm:text-sm mt-1">
                            Deal updates, payment receipts, and inquiry alerts.
                        </p>
                    </div>

                    <button
                        onClick={markAllAsRead}
                        disabled={markingAll}
                        className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                        <CheckCheck className="w-4 h-4 text-emerald-400" />
                        <span>Mark All as Read</span>
                    </button>
                </div>

                <div className="space-y-3">
                    {notifications.data.length > 0 ? (
                        notifications.data.map((item) => {
                            const isUnread = !item.read_at;
                            const title = String(item.data?.title || item.data?.type || 'Notification');
                            const message = String(item.data?.message || item.data?.body || '');
                            const actionUrl = item.data?.action_url ? String(item.data.action_url) : null;
                            const itemType = String(item.data?.type || item.type || '');

                            return (
                                <div
                                    key={item.id}
                                    className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                                        isUnread ? 'bg-slate-900 border-emerald-500/30' : 'bg-slate-950/60 border-slate-800/80 opacity-80'
                                    }`}
                                >
                                    <div className="flex items-start gap-3.5 min-w-0">
                                        <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                                            {getIcon(itemType)}
                                        </div>

                                        <div className="space-y-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-sm text-white">{title}</h3>
                                                {isUnread && (
                                                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-300 leading-relaxed">{message}</p>
                                            <span className="text-[10px] text-slate-500 block">
                                                {new Date(item.created_at).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        {actionUrl && (
                                            <Link
                                                href={actionUrl}
                                                onClick={() => isUnread && markAsRead(item.id)}
                                                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-emerald-400 flex items-center gap-1"
                                            >
                                                <span>View</span>
                                                <ArrowUpRight className="w-3.5 h-3.5" />
                                            </Link>
                                        )}

                                        {isUnread && (
                                            <button
                                                onClick={() => markAsRead(item.id)}
                                                disabled={markingRead === item.id}
                                                className="p-1.5 rounded-xl text-slate-500 hover:text-white cursor-pointer"
                                                title="Mark as read"
                                            >
                                                <Check className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800">
                            <Bell className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                            <h3 className="text-base font-bold text-white">All caught up</h3>
                            <p className="text-slate-400 text-xs mt-1">
                                You have no unread notifications.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}