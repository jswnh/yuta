<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsSeller
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user || ! $user->isSellerActive()) {
            if ($user) {
                // Mark past active subscriptions in DB as 'expired'
                $user->subscriptions()
                    ->where('status', 'active')
                    ->whereNotNull('ends_at')
                    ->where('ends_at', '<=', now())
                    ->update(['status' => 'expired']);

                if ($user->is_seller) {
                    $user->forceFill(['is_seller' => false])->save();
                }
            }

            if ($request->expectsJson()) {
                return response()->json(['message' => 'Unauthorized. Active seller subscription required.'], 403);
            }

            return redirect()->route('billing.index')->with('warning', 'Your seller subscription is inactive or has expired. Please subscribe to unlock your seller dashboard and listings.');
        }

        return $next($request);
    }
}
