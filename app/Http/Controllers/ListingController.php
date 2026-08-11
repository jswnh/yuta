<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateListingRequest;
use App\Models\Listing;
use App\Models\ListingImage;
use App\Models\TemporaryListing;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ListingController extends Controller
{
    /**
     * Display a listing of the seller's properties.
     */
    public function index(): Response
    {
        $listings = Listing::with('images')
            ->where('seller_id', auth()->user()->user_id)
            ->latest()
            ->get();

        return Inertia::render('listing/listings', [
            'listings' => $listings,
        ]);
    }

    /**
     * Show the form for creating a new land listing.
     */
    public function create(): Response
    {
        $draft = TemporaryListing::where('user_id', auth()->user()->user_id)->first();

        return Inertia::render('listing/new', [
            'draft' => $draft?->payload,
        ]);
    }

    /**
     * Save temporary form input draft per user.
     */
    public function saveDraft(Request $request): JsonResponse
    {
        $payload = $request->except(['images']);

        $draft = TemporaryListing::updateOrCreate(
            ['user_id' => $request->user()->user_id],
            [
                'payload' => $payload,
                'expires_at' => now()->addDays(7),
            ]
        );

        return response()->json([
            'status' => 'success',
            'temp_listing_id' => $draft->temp_listing_id,
            'message' => 'Listing draft saved successfully.',
        ]);
    }

    /**
     * Store a newly created land listing in storage.
     */
    public function store(CreateListingRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $uniqueSlug = Str::slug($validated['title']).'-'.Str::random(6);

        // Handle uploaded images and captions
        $uploadedImages = $request->file('images', []);
        $captions = $request->input('captions', []);
        unset($validated['images'], $validated['captions']);

        // Default currency if not supplied
        if (empty($validated['currency'])) {
            $validated['currency'] = 'PHP';
        }

        $listing = Listing::create([
            'seller_id' => $request->user()->user_id,
            'slug' => $uniqueSlug,
            'status' => 'pending_review',
            ...$validated,
        ]);

        if (is_array($uploadedImages)) {
            // Determine target storage disk (defaults to configured filesystem disk e.g. 'r2' or 'public')
            $disk = config('filesystems.default', 'r2');

            foreach ($uploadedImages as $index => $imageFile) {
                if ($imageFile && $imageFile->isValid()) {
                    // Store file in cloud storage bucket (e.g. R2) under 'listings' folder
                    $path = $imageFile->store('listings', $disk);
                    $caption = $captions[$index] ?? null;

                    ListingImage::create([
                        'listing_id' => $listing->listing_id,
                        'file_path' => $path,
                        'caption' => $caption,
                        'sort_order' => $index,
                        'is_primary' => $index === 0,
                    ]);
                }
            }
        }

        // Auto-delete temporary draft after successful listing publication
        TemporaryListing::where('user_id', $request->user()->user_id)->delete();

        return redirect()->route('listings.index')
            ->with('success', 'Land listing created successfully!');
    }
}
