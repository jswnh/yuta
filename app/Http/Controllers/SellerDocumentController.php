<?php

namespace App\Http\Controllers;

use App\Models\SellerDocument;
use App\Models\SellerProfile;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SellerDocumentController extends Controller
{
    /**
     * Upload a new seller document.
     */
    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'document_type' => ['required', 'string', 'in:government_id,prc_license,dhsud_registration,tin_proof,business_permit,proof_of_billing'],
            'document_name' => ['required', 'string', 'max:150'],
            'file' => ['required', 'file', 'mimes:jpeg,png,jpg,pdf', 'max:10240'], // 10MB limit
        ]);

        $profile = SellerProfile::firstOrCreate(['user_id' => $user->user_id]);

        $file = $request->file('file');
        $disk = config('filesystems.default', 'public');
        $filePath = $file->store('seller-documents/'.$user->user_id, $disk);

        SellerDocument::create([
            'seller_profile_id' => $profile->id,
            'user_id' => $user->user_id,
            'document_type' => $validated['document_type'],
            'document_name' => $validated['document_name'],
            'file_path' => $filePath,
            'file_size' => $file->getSize(),
            'mime_type' => $file->getMimeType(),
            'status' => 'pending',
        ]);

        return back()->with('success', 'Document uploaded successfully!');
    }

    /**
     * Delete an existing seller document.
     */
    public function destroy(Request $request, SellerDocument $document): RedirectResponse
    {
        $user = $request->user();

        if ($document->user_id !== $user->user_id) {
            abort(403, 'Unauthorized access to document.');
        }

        $disk = config('filesystems.default', 'public');
        try {
            Storage::disk($disk)->delete($document->file_path);
        } catch (\Throwable) {
            // Ignore deletion failures gracefully
        }

        $document->delete();

        return back()->with('success', 'Document removed successfully.');
    }
}
