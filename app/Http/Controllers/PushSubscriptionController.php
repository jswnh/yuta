<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PushSubscriptionController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'endpoint' => 'required|string',
            'keys.p256dh' => 'required|string',
            'keys.auth' => 'required|string',
        ]);

        $request->user()->updatePushSubscription(
            endpoint: $validated['endpoint'],
            publicKey: $validated['keys']['p256dh'],
            authToken: $validated['keys']['auth'],
        );

        return response()->json(['status' => 'subscribed']);
    }

    public function destroy(Request $request): JsonResponse
    {
        $endpoint = $request->validate(['endpoint' => 'required|string'])['endpoint'];

        $request->user()->pushSubscriptions()
            ->where('endpoint', $endpoint)
            ->delete();

        return response()->json(['status' => 'unsubscribed']);
    }
}