<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class BecomeSellerController extends Controller
{
    /**
     * Upgrade the authenticated user to a seller.
     */
    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();

        if (! $user->is_seller) {
            $user->forceFill([
                'is_seller' => true,
                'seller_since' => now(),
            ])->save();
        }

        return redirect()->route('dashboard')->with('success', 'You are now registered as a Property Seller! Welcome to your seller dashboard.');
    }
}
