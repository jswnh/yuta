<?php

namespace App\Http\Controllers;

use App\Models\SellerDocument;
use App\Models\SellerProfile;
use App\Notifications\MarketplaceNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SellerProfileController extends Controller
{
    /**
     * Display seller profile and verification view in Settings.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();

        $profile = SellerProfile::firstOrCreate(
            ['user_id' => $user->user_id],
            [
                'display_name' => $user->name,
                'contact_email' => $user->email,
                'contact_phone' => $user->contact_number,
                'seller_type' => 'owner',
                'verification_status' => 'unverified',
            ]
        );

        $documents = SellerDocument::where('seller_profile_id', $profile->id)
            ->latest()
            ->get();

        return Inertia::render('settings/seller-profile', [
            'profile' => $profile,
            'documents' => $documents,
            'isSeller' => (bool) $user->is_seller,
        ]);
    }

    /**
     * Update seller profile details.
     */
    public function update(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'display_name' => ['nullable', 'string', 'max:100'],
            'business_name' => ['nullable', 'string', 'max:150'],
            'seller_type' => ['required', 'string', 'in:owner,agent,broker'],
            'license_number' => ['nullable', 'string', 'max:50'],
            'tax_id_number' => ['nullable', 'string', 'max:50'],
            'description' => ['nullable', 'string', 'max:1000'],
            'contact_email' => ['nullable', 'email', 'max:100'],
            'contact_phone' => ['nullable', 'string', 'max:30'],
            'address_line' => ['nullable', 'string', 'max:255'],
            'city_municipality' => ['nullable', 'string', 'max:100'],
            'province' => ['nullable', 'string', 'max:100'],
            'zip_code' => ['nullable', 'string', 'max:10'],
            'years_of_experience' => ['nullable', 'integer', 'min:0', 'max:70'],
        ]);

        $profile = SellerProfile::updateOrCreate(
            ['user_id' => $user->user_id],
            $validated
        );

        return back()->with('success', 'Seller profile details updated successfully.');
    }

    /**
     * Submit profile and uploaded documents for formal verification review.
     */
    public function submitVerification(Request $request): RedirectResponse
    {
        $user = $request->user();
        $profile = SellerProfile::where('user_id', $user->user_id)->first();

        if (! $profile) {
            return back()->with('error', 'Please complete your seller profile before submitting for verification.');
        }

        $documentCount = SellerDocument::where('seller_profile_id', $profile->id)->count();

        if ($documentCount === 0) {
            return back()->with('error', 'Please upload at least one valid legal identification or proof document before submitting.');
        }

        $profile->update([
            'verification_status' => 'pending',
            'verification_submitted_at' => now(),
            'rejection_reason' => null,
        ]);

        $user->notify(new MarketplaceNotification([
            'title' => 'Verification Submitted',
            'message' => 'Your seller verification request and documents have been received and are under review.',
            'type' => 'verification',
            'link' => route('settings.seller-profile'),
            'entity_id' => $profile->id,
        ]));

        return back()->with('success', 'Your seller verification documents have been submitted for review.');
    }
}
