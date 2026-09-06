import { useState, useEffect, useRef } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { useInbox } from '@/hooks/use-inbox';
import type { Conversation, Message } from '@/types/inbox';
import { 
    MessageSquare, 
    Send, 
    ArrowLeft, 
    Search, 
    ExternalLink, 
    Building2, 
    CheckCheck,
    Loader2
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
    const [searchQuery, setSearchQuery] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const currentUserId = auth?.user?.user_id;

    // Messages can be directly on activeConversation or passed separately
    const messageList = (activeConversation?.messages && activeConversation.messages.length > 0)
        ? activeConversation.messages
        : messages;

    // Scroll to bottom when messages update or active conversation changes
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messageList.length, activeConversation?.id]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!body.trim() || !activeConversation || sending) return;
        sendMessage(activeConversation.id, body.trim(), () => setBody(''));
    };

    const filteredConversations = conversations.filter((conv) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        const otherUser = conv.buyer_id === currentUserId ? conv.seller : conv.buyer;
        const userName = otherUser?.name?.toLowerCase() || '';
        const listingTitle = conv.listing?.title?.toLowerCase() || '';
        const latestMsg = conv.latest_message?.body?.toLowerCase() || '';
        return userName.includes(q) || listingTitle.includes(q) || latestMsg.includes(q);
    });

    return (
        <>
            <Head title="Messages & Inquiries - Yuta" />

            {/* FULL PAGE EDGE-TO-EDGE INBOX CONTAINER - Matches Default App Dark Theme (bg-background) */}
            <div className="flex-1 flex flex-col h-[calc(100svh-4rem)] md:h-[calc(100dvh-4rem)] w-full overflow-hidden bg-background text-foreground">
                <div className="flex-1 h-full w-full flex overflow-hidden">
                    
                    {/* LEFT PANEL: CONVERSATION LIST (Full Height, Edge-to-Edge) */}
                    <div className={`w-full md:w-80 lg:w-[360px] xl:w-[400px] shrink-0 border-r border-border flex flex-col h-full bg-background overflow-hidden ${activeConversation ? 'hidden md:flex' : 'flex'}`}>
                        {/* Conversation List Header */}
                        <div className="p-4 border-b border-border shrink-0">
                            <div className="flex items-center justify-between mb-3">
                                <h1 className="font-black text-xl text-foreground tracking-tight">Messages</h1>
                                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                                    {conversations.length}
                                </span>
                            </div>

                            {/* Search Filter Bar */}
                            <div className="relative">
                                <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search conversations..."
                                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-muted/60 border border-input/60 focus:border-emerald-500 text-foreground placeholder:text-muted-foreground focus:outline-none transition-colors"
                                />
                            </div>
                        </div>

                        {/* Conversations Scrollable Feed */}
                        <div className="flex-1 overflow-y-auto divide-y divide-border">
                            {filteredConversations.length > 0 ? (
                                filteredConversations.map((conv) => {
                                    const otherUser = conv.buyer_id === currentUserId ? conv.seller : conv.buyer;
                                    const isSelected = activeConversation?.id === conv.id;

                                    return (
                                        <Link
                                            key={conv.id}
                                            href={`/inbox?conversation=${conv.id}`}
                                            className={`p-3.5 sm:p-4 flex items-start gap-3 transition-colors block ${
                                                isSelected 
                                                    ? 'bg-emerald-500/10 border-l-4 border-emerald-600 dark:border-emerald-500' 
                                                    : 'hover:bg-muted/40'
                                            }`}
                                        >
                                            <Avatar className="w-10 h-10 rounded-xl shrink-0 border border-border mt-0.5">
                                                <AvatarImage src={otherUser?.avatar || undefined} alt={otherUser?.name} />
                                                <AvatarFallback className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                                                    {getInitials(otherUser?.name || 'User')}
                                                </AvatarFallback>
                                            </Avatar>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center justify-between gap-1">
                                                    <span className="font-bold text-sm text-foreground truncate">
                                                        {otherUser?.name || 'Property Inquiry'}
                                                    </span>
                                                    {conv.latest_message && (
                                                        <span className="text-[10px] text-muted-foreground shrink-0 font-medium">
                                                            {new Date(conv.latest_message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    )}
                                                </div>

                                                {conv.listing && (
                                                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold truncate block mt-0.5">
                                                        📍 {conv.listing.title}
                                                    </span>
                                                )}

                                                <div className="flex items-center justify-between gap-2 mt-1">
                                                    <p className="text-xs text-muted-foreground truncate">
                                                        {conv.latest_message?.body || 'No messages yet.'}
                                                    </p>
                                                    {conv.unread_count && conv.unread_count > 0 ? (
                                                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white dark:bg-emerald-500 dark:text-slate-950 text-[10px] font-black flex items-center justify-center shrink-0">
                                                            {conv.unread_count}
                                                        </span>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })
                            ) : (
                                <div className="p-10 text-center text-muted-foreground text-xs">
                                    <MessageSquare className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                                    {searchQuery ? 'No matching conversations.' : 'No conversations yet.'}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT PANEL: ACTIVE CHAT THREAD (Full Height, Edge-to-Edge) */}
                    <div className={`flex-1 min-w-0 flex flex-col h-full bg-muted/15 overflow-hidden ${!activeConversation ? 'hidden md:flex' : 'flex'}`}>
                        {activeConversation ? (
                            <>
                                {/* CHAT HEADER */}
                                <div className="p-4 border-b border-border flex items-center justify-between bg-background shrink-0">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <Link 
                                            href="/inbox" 
                                            className="md:hidden p-2 rounded-xl text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80 transition-colors shrink-0"
                                            title="Back to conversations"
                                        >
                                            <ArrowLeft className="w-4 h-4" />
                                        </Link>

                                        {(() => {
                                            const otherUser = activeConversation.buyer_id === currentUserId ? activeConversation.seller : activeConversation.buyer;
                                            return (
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <Avatar className="w-10 h-10 rounded-xl shrink-0 border border-border">
                                                        <AvatarImage src={otherUser?.avatar || undefined} alt={otherUser?.name} />
                                                        <AvatarFallback className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                                                            {getInitials(otherUser?.name || 'User')}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <h2 className="font-bold text-sm text-foreground truncate">
                                                                {otherUser?.name}
                                                            </h2>
                                                            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                                                        </div>
                                                        {activeConversation.listing ? (
                                                            <Link 
                                                                href={`/properties/${activeConversation.listing.slug}`} 
                                                                className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline truncate inline-flex items-center gap-1 font-medium"
                                                            >
                                                                <span>{activeConversation.listing.title}</span>
                                                                <span>•</span>
                                                                <span className="font-bold">₱{Number(activeConversation.listing.price).toLocaleString()}</span>
                                                                <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
                                                            </Link>
                                                        ) : (
                                                            <span className="text-[11px] text-muted-foreground">Direct Message</span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </div>

                                    {activeConversation.listing && (
                                        <div className="hidden sm:flex items-center gap-2 shrink-0">
                                            <Link
                                                href={`/properties/${activeConversation.listing.slug}`}
                                                className="px-3 py-1.5 rounded-xl border border-border hover:bg-muted text-xs font-semibold text-foreground transition-colors inline-flex items-center gap-1.5"
                                            >
                                                <Building2 className="w-3.5 h-3.5 text-emerald-500" />
                                                <span>View Listing</span>
                                            </Link>
                                        </div>
                                    )}
                                </div>

                                {/* MESSAGES FEED SCROLL AREA */}
                                <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
                                    {messageList.length > 0 ? (
                                        <>
                                            {/* Top inquiry context badge */}
                                            <div className="text-center my-2">
                                                <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-[11px] font-medium">
                                                    Inquiry started for {activeConversation.listing?.title || 'property'}
                                                </span>
                                            </div>

                                            {messageList.map((msg) => {
                                                const isMe = msg.sender_id === currentUserId;

                                                return (
                                                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                        <div className={`max-w-[85%] sm:max-w-[70%] p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                                                            isMe 
                                                                ? 'bg-emerald-600 text-white rounded-br-xs' 
                                                                : 'bg-card text-card-foreground border border-border rounded-bl-xs'
                                                        }`}>
                                                            <p className="whitespace-pre-line break-words">{msg.body}</p>
                                                            <div className={`flex items-center justify-end gap-1 mt-1.5 text-[10px] ${isMe ? 'text-emerald-100' : 'text-muted-foreground'}`}>
                                                                <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                                {isMe && <CheckCheck className="w-3 h-3" />}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            <div ref={messagesEndRef} />
                                        </>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-center p-8">
                                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-3">
                                                <MessageSquare className="w-6 h-6 text-emerald-500" />
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                Send a message below to start this inquiry conversation.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* BOTTOM MESSAGE INPUT BAR */}
                                <form onSubmit={handleSend} className="p-3 sm:p-4 border-t border-border flex items-center gap-3 bg-background shrink-0">
                                    <input
                                        type="text"
                                        value={body}
                                        onChange={(e) => setBody(e.target.value)}
                                        placeholder="Type your message or inquiry..."
                                        disabled={sending}
                                        className="flex-1 bg-muted/40 border border-input focus:border-emerald-500 rounded-xl px-4 py-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none transition-colors"
                                    />
                                    <button
                                        type="submit"
                                        disabled={sending || !body.trim()}
                                        className="px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all disabled:opacity-50 cursor-pointer shadow-sm flex items-center gap-1.5 shrink-0"
                                    >
                                        {sending ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Send className="w-4 h-4" />
                                        )}
                                        <span className="hidden sm:inline text-xs">Send</span>
                                    </button>
                                </form>
                            </>
                        ) : (
                            /* DESKTOP EMPTY STATE WHEN NO THREAD IS SELECTED */
                            <div className="h-full flex-1 flex flex-col items-center justify-center p-8 text-center">
                                <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                                    <MessageSquare className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <h3 className="text-base font-bold text-foreground">Select a Conversation</h3>
                                <p className="text-xs text-muted-foreground max-w-sm mt-1 mb-6 leading-relaxed">
                                    Choose an inquiry from the list on the left to read messages and negotiate with buyers or sellers.
                                </p>
                                <Link
                                    href="/marketplace"
                                    className="px-4 py-2 rounded-xl text-xs font-semibold text-foreground border border-border hover:bg-muted transition-colors"
                                >
                                    Browse Marketplace
                                </Link>
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