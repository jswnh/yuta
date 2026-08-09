<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Auth\Middleware\RequirePassword;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RequirePasswordIfSet
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, string $redirectToRoute = 'password.confirm', ?int $passwordTimeoutSeconds = null): Response
    {
        $user = $request->user();

        if ($user && ! empty($user->password)) {
            return app(RequirePassword::class)->handle($request, $next, $redirectToRoute, $passwordTimeoutSeconds);
        }

        return $next($request);
    }
}
