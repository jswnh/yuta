<?php

namespace App\Http\Responses;

use Illuminate\Http\Request;
use Laravel\Fortify\Contracts\RegisterResponse as RegisterResponseContract;
use Symfony\Component\HttpFoundation\Response;

class RegisterResponse implements RegisterResponseContract
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
                ? response()->json([], 201)
                : redirect()->intended(route('dashboard'));
        }

        return $request->wantsJson()
            ? response()->json([], 201)
            : redirect()->to(route('home'));
    }
}
