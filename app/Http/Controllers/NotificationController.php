<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    /**
     * Display notifications list.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $notifications = $user->notifications()
            ->latest()
            ->paginate(15);

        return Inertia::render('notifications/index', [
            'notifications' => $notifications,
            'unreadCount' => $user->unreadNotifications()->count(),
        ]);
    }

    /**
     * Mark a single notification as read.
     */
    public function markAsRead(Request $request, string $id): JsonResponse|RedirectResponse
    {
        $user = $request->user();

        $notification = $user->notifications()->where('id', $id)->first();
        if ($notification) {
            $notification->markAsRead();
        }

        if ($request->wantsJson()) {
            return response()->json(['status' => 'success']);
        }

        return back();
    }

    /**
     * Mark all notifications as read.
     */
    public function markAllAsRead(Request $request): JsonResponse|RedirectResponse
    {
        $user = $request->user();
        $user->unreadNotifications->markAsRead();

        if ($request->wantsJson()) {
            return response()->json(['status' => 'success']);
        }

        return back()->with('success', 'All notifications marked as read.');
    }
}
