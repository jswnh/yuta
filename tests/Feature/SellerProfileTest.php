<?php

use App\Models\SellerProfile;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('seller can update their profile information', function () {
    $seller = User::factory()->create();

    $response = $this->actingAs($seller)->put('/settings/seller-profile', [
        'business_name' => 'Metro Real Estate Group',
        'seller_type' => 'broker',
        'license_number' => 'PRC-REB-0012345',
        'tax_id_number' => '123-456-789-000',
        'description' => 'Licensed real estate broker handling agricultural and commercial land.',
        'contact_phone' => '+639171234567',
        'address_line' => 'Makati City, Metro Manila',
        'years_of_experience' => 10,
    ]);

    $response->assertRedirect();
    $profile = SellerProfile::where('user_id', $seller->user_id)->first();
    expect($profile)->not->toBeNull();
    expect($profile->business_name)->toBe('Metro Real Estate Group');
    expect($profile->license_number)->toBe('PRC-REB-0012345');
});

test('seller can upload verification document and submit for review', function () {
    Storage::fake('public');
    $seller = User::factory()->create();

    $file = UploadedFile::fake()->create('prc_license.pdf', 500, 'application/pdf');

    $uploadResponse = $this->actingAs($seller)->post('/settings/seller-documents', [
        'document_type' => 'prc_license',
        'document_name' => 'PRC License 2026',
        'file' => $file,
    ]);

    $uploadResponse->assertRedirect();

    $verifyResponse = $this->actingAs($seller)->post('/settings/seller-profile/verify');
    $verifyResponse->assertRedirect();

    $profile = SellerProfile::where('user_id', $seller->user_id)->first();
    expect($profile->verification_status)->toBe('pending');
});
