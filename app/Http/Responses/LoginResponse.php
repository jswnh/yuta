<?php

namespace App\Http\Responses;

use Illuminate\Http\Request;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Symfony\Component\HttpFoundation\Response;

class LoginResponse implements LoginResponseContract
{
    /**
     * Create an HTTP response that represents the given object.
     *
     * @param  Request  $request
     * @return Response
     */
    public function toResponse($request)
    {
        $user = $request->user();

        if ($user && $user->is_seller) {
            return $request->wantsJson()
                ? response()->json(['two_factor' => false])
                : redirect()->intended(route('dashboard'));
        }

        return $request->wantsJson()
            ? response()->json(['two_factor' => false])
            : redirect()->to(route('home'));
    }
}
