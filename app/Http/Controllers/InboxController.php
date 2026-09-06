<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\Listing;
use App\Models\Message;
use App\Models\User;
use App\Notifications\MarketplaceNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class InboxController extends Controller
{
    /**
     * Display the inbox containing all user conversations.
     */
    public function index(Request $request): Response
    {
        $userId = $request->user()->user_id;

        $conversations = Conversation::with(['listing.images', 'buyer', 'seller', 'latestMessage'])
            ->where(function ($q) use ($userId) {
                $q->where('buyer_id', $userId)
                    ->orWhere('seller_id', $userId);
            })
            ->withCount(['messages as unread_count' => function ($q) use ($userId) {
                $q->where('receiver_id', $userId)->where('is_read', false);
            }])
            ->orderByDesc('last_message_at')
            ->get();

        $activeConversationId = $request->query('conversation');
        $activeConversation = null;

        if ($activeConversationId) {
            $activeConversation = Conversation::with(['listing.images', 'buyer', 'seller', 'messages.sender'])
                ->where('id', $activeConversationId)
                ->where(function ($q) use ($userId) {
                    $q->where('buyer_id', $userId)
                        ->orWhere('seller_id', $userId);
                })
                ->first();

            // Mark received messages as read
            if ($activeConversation) {
                Message::where('conversation_id', $activeConversation->id)
                    ->where('receiver_id', $userId)
                    ->where('is_read', false)
                    ->update([
                        'is_read' => true,
                        'read_at' => now(),
                    ]);
            }
        } elseif ($conversations->isNotEmpty()) {
            $first = $conversations->first();
            $activeConversation = Conversation::with(['listing.images', 'buyer', 'seller', 'messages.sender'])
                ->where('id', $first->id)
                ->first();

            if ($activeConversation) {
                Message::where('conversation_id', $activeConversation->id)
                    ->where('receiver_id', $userId)
                    ->where('is_read', false)
                    ->update([
                        'is_read' => true,
                        'read_at' => now(),
                    ]);
            }
        }

        return Inertia::render('inbox/index', [
            'conversations' => $conversations,
            'activeConversation' => $activeConversation,
            'messages' => $activeConversation?->messages ?? [],
        ]);
    }

    /**
     * Send a new message in a conversation.
     */
    public function storeMessage(Request $request, Conversation $conversation): RedirectResponse|JsonResponse
    {
        $user = $request->user();

        if ($conversation->buyer_id !== $user->user_id && $conversation->seller_id !== $user->user_id) {
            abort(403);
        }

        $validated = $request->validate([
            'body' => ['required', 'string', 'max:2000'],
        ]);

        $receiverId = ($conversation->buyer_id === $user->user_id)
            ? $conversation->seller_id
            : $conversation->buyer_id;

        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $user->user_id,
            'receiver_id' => $receiverId,
            'body' => $validated['body'],
            'is_read' => false,
        ]);

        $conversation->update(['last_message_at' => now()]);

        // Send notification to recipient
        $receiver = User::find($receiverId);
        if ($receiver) {
            $receiver->notify(new MarketplaceNotification([
                'title' => "New Message from {$user->name}",
                'message' => Str::limit($message->body, 80),
                'type' => 'message',
                'link' => route('inbox.index', ['conversation' => $conversation->id]),
                'entity_id' => $conversation->id,
            ]));
        }

        if ($request->wantsJson()) {
            return response()->json([
                'status' => 'success',
                'message' => $message->load('sender'),
            ]);
        }

        return back()->with('success', 'Message sent.');
    }

    /**
     * Start an inquiry on a listing directly.
     */
    public function startInquiry(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'listing_id' => ['required', 'exists:listings,listing_id'],
            'message' => ['required', 'string', 'max:2000'],
        ]);

        $listing = Listing::where('listing_id', $validated['listing_id'])->firstOrFail();

        if ($listing->seller_id === $user->user_id) {
            return back()->with('error', 'You cannot start an inquiry on your own listing.');
        }

        $conversation = Conversation::firstOrCreate([
            'listing_id' => $listing->listing_id,
            'buyer_id' => $user->user_id,
            'seller_id' => $listing->seller_id,
        ], [
            'subject' => 'Inquiry for: '.$listing->title,
            'last_message_at' => now(),
        ]);

        Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $user->user_id,
            'receiver_id' => $listing->seller_id,
            'body' => $validated['message'],
            'is_read' => false,
        ]);

        $conversation->update(['last_message_at' => now()]);

        $seller = $listing->seller;
        if ($seller) {
            $seller->notify(new MarketplaceNotification([
                'title' => 'New Listing Inquiry',
                'message' => "{$user->name} sent an inquiry regarding \"{$listing->title}\".",
                'type' => 'listing',
                'link' => route('inbox.index', ['conversation' => $conversation->id]),
                'entity_id' => $conversation->id,
            ]));
        }

        return redirect()->route('inbox.index', ['conversation' => $conversation->id])
            ->with('success', 'Your inquiry has been sent to the seller!');
    }
}
