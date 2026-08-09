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
        if (! $request->user() || ! $request->user()->is_seller) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Unauthorized. Seller access required.'], 403);
            }

            return redirect()->route('home')->with('warning', 'You need to become a seller to access the seller dashboard.');
        }

        return $next($request);
    }
}
