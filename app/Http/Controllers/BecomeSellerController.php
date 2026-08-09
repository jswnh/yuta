<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class BecomeSellerController extends Controller
{
    /**
     * Redirect authenticated users to the monthly seller billing page.
     */
    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();

        if ($user->is_seller) {
            return redirect()->route('dashboard');
        }

        return redirect()->route('billing.index')->with('info', 'Please complete your monthly seller plan subscription to unlock your Seller Dashboard and start listing properties.');
    }
}
