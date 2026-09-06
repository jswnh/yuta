import { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { useInbox } from '@/hooks/use-inbox';
import type { Conversation, Message } from '@/types/inbox';
import { 
    MessageSquare, 
    Send, 
    ArrowLeft, 
} from 'lucide-react';

interface InboxIndexProps {
    conversations: Conversation[];
    activeConversation?: Conversation | null;
    messages?: Message[];
}

export default function InboxIndex({
    conversations = [],
    activeConversation = null,
    messages = [],
}: InboxIndexProps) {
    const { auth } = usePage().props as { auth?: { user?: any } };
    const getInitials = useInitials();
    const { sendMessage, sending } = useInbox();

    const [body, setBody] = useState('');
    const currentUserId = auth?.user?.user_id;

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!body.trim() || !activeConversation) return;
        sendMessage(activeConversation.id, body.trim());
        setBody('');
    };

    return (
        <>
            <Head title="Messages & Inquiries" />

            <div className="h-[calc(100vh-8rem)] p-4 sm:p-6 flex flex-col">
                <div className="flex-1 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12">
                    {/* LEFT 4 COLS: CONVERSATION LIST */}
                    <div className={`md:col-span-4 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full ${activeConversation ? 'hidden md:flex' : 'flex'}`}>
                        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                            <h1 className="font-black text-lg text-slate-900 dark:text-white">Conversations</h1>
                            <span className="text-xs text-slate-500 font-bold">{conversations.length} total</span>
                        </div>

                        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                            {conversations.length > 0 ? (
                                conversations.map((conv) => {
                                    const otherUser = conv.buyer_id === currentUserId ? conv.seller : conv.buyer;
                                    const isSelected = activeConversation?.id === conv.id;

                                    return (
                                        <Link
                                            key={conv.id}
                                            href={`/inbox?conversation=${conv.id}`}
                                            className={`p-4 flex items-center gap-3 transition-colors block ${isSelected ? 'bg-emerald-50 dark:bg-slate-800/80 border-l-4 border-emerald-600 dark:border-emerald-500' : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'}`}
                                        >
                                            <Avatar className="w-11 h-11 rounded-2xl shrink-0 border border-slate-200 dark:border-slate-800">
                                                <AvatarImage src={otherUser?.avatar || undefined} alt={otherUser?.name} />
                                                <AvatarFallback className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                                                    {getInitials(otherUser?.name || 'User')}
                                                </AvatarFallback>
                                            </Avatar>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-bold text-sm text-slate-900 dark:text-white truncate block">
                                                        {otherUser?.name || 'Property Inquiry'}
                                                    </span>
                                                    {conv.unread_count && conv.unread_count > 0 ? (
                                                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white dark:bg-emerald-500 dark:text-slate-950 text-[10px] font-black flex items-center justify-center">
                                                            {conv.unread_count}
                                                        </span>
                                                    ) : null}
                                                </div>

                                                {conv.listing && (
                                                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold truncate block">
                                                        📍 {conv.listing.title}
                                                    </span>
                                                )}

                                                <p className="text-xs text-slate-600 dark:text-slate-400 truncate mt-0.5">
                                                    {conv.latest_message?.body || 'No messages yet.'}
                                                </p>
                                            </div>
                                        </Link>
                                    );
                                })
                            ) : (
                                <div className="p-8 text-center text-slate-500 text-xs">
                                    <MessageSquare className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                                    No conversations yet.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT 8 COLS: ACTIVE CHAT THREAD */}
                    <div className={`md:col-span-8 flex flex-col h-full bg-slate-50/50 dark:bg-slate-950/40 ${!activeConversation ? 'hidden md:flex items-center justify-center' : 'flex'}`}>
                        {activeConversation ? (
                            <>
                                {/* CHAT HEADER */}
                                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <Link href="/inbox" className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white">
                                            <ArrowLeft className="w-4 h-4" />
                                        </Link>

                                        {(() => {
                                            const otherUser = activeConversation.buyer_id === currentUserId ? activeConversation.seller : activeConversation.buyer;
                                            return (
                                                <div>
                                                    <h2 className="font-bold text-sm text-slate-900 dark:text-white">{otherUser?.name}</h2>
                                                    {activeConversation.listing && (
                                                        <Link href={`/properties/${activeConversation.listing.slug}`} className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline truncate block">
                                                            {activeConversation.listing.title} (₱{Number(activeConversation.listing.price).toLocaleString()})
                                                        </Link>
                                                    )}
                                                </div>
                                            );
                                        })()}
                                    </div>
                                </div>

                                {/* MESSAGES FEED */}
                                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                                    {messages.length > 0 ? (
                                        messages.map((msg) => {
                                            const isMe = msg.sender_id === currentUserId;

                                            return (
                                                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                    <div className={`max-w-[75%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                                                        isMe ? 'bg-emerald-600 text-white rounded-br-none shadow-sm' : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-bl-none shadow-sm'
                                                    }`}>
                                                        <p className="whitespace-pre-line">{msg.body}</p>
                                                        <span className={`text-[10px] block mt-1 ${isMe ? 'text-emerald-100 text-right' : 'text-slate-400'}`}>
                                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="p-12 text-center text-slate-500 text-xs">
                                            Send a message to start this inquiry conversation.
                                        </div>
                                    )}
                                </div>

                                {/* MESSAGE INPUT */}
                                <form onSubmit={handleSend} className="p-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 bg-white dark:bg-slate-900/80">
                                    <input
                                        type="text"
                                        value={body}
                                        onChange={(e) => setBody(e.target.value)}
                                        placeholder="Type your message or inquiry..."
                                        className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                    <button
                                        type="submit"
                                        disabled={sending || !body.trim()}
                                        className="p-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all disabled:opacity-50 cursor-pointer shadow-sm"
                                    >
                                        <Send className="w-4 h-4" />
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="text-center p-8 text-slate-500 text-xs">
                                <MessageSquare className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Select a conversation</h3>
                                <p className="text-slate-500 dark:text-slate-400 mt-1">Choose a thread from the left to view messages.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

InboxIndex.layout = {
    breadcrumbs: [
        { title: 'Marketplace', href: '/' },
        { title: 'Inbox', href: '/inbox' },
    ],
};