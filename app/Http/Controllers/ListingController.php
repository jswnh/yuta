<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateListingRequest;
use App\Http\Requests\UpdateListingRequest;
use App\Models\Listing;
use App\Models\ListingImage;
use App\Models\TemporaryListing;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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
        try {
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

                        if ($path) {
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
            }

            // Auto-delete temporary draft after successful listing publication
            TemporaryListing::where('user_id', $request->user()->user_id)->delete();

            return redirect()->route('listings.index')
                ->with('success', 'Land listing created successfully!');
        } catch (\Throwable $e) {
            dd([
                'error_type' => get_class($e),
                'error_message' => $e->getMessage(),
                'error_file' => $e->getFile(),
                'error_line' => $e->getLine(),
                'request_data' => $request->all(),
                'trace' => $e->getTraceAsString(),
            ]);
        }
    }

    /**
     * Show the form for editing an existing land listing.
     */
    public function edit(Listing $listing): Response
    {
        if ($listing->seller_id !== auth()->user()->user_id) {
            abort(403, 'Unauthorized action.');
        }

        $listing->load('images');

        return Inertia::render('listing/edit', [
            'listing' => $listing,
        ]);
    }

    /**
     * Update an existing land listing in storage.
     */
    public function update(UpdateListingRequest $request, Listing $listing): RedirectResponse
    {
        if ($listing->seller_id !== auth()->user()->user_id) {
            abort(403, 'Unauthorized action.');
        }

        try {
            $validated = $request->validated();

            // Extract image management fields
            $deletedImageIds = $request->input('deleted_image_ids', []);
            $existingCaptions = $request->input('existing_captions', []);
            $uploadedImages = $request->file('images', []);
            $captions = $request->input('captions', []);

            unset(
                $validated['deleted_image_ids'],
                $validated['existing_captions'],
                $validated['images'],
                $validated['captions']
            );

            // Default currency if empty
            if (empty($validated['currency'])) {
                $validated['currency'] = 'PHP';
            }

            // Update main listing record
            $listing->update($validated);

            $disk = config('filesystems.default', 'r2');

            // 1. Delete requested images from storage (R2) and DB
            if (is_array($deletedImageIds) && count($deletedImageIds) > 0) {
                $imagesToDelete = ListingImage::whereIn('image_id', $deletedImageIds)
                    ->where('listing_id', $listing->listing_id)
                    ->get();

                foreach ($imagesToDelete as $image) {
                    if ($image->file_path && ! str_starts_with($image->file_path, 'http')) {
                        try {
                            Storage::disk($disk)->delete($image->file_path);
                        } catch (\Throwable) {
                            // Ignore storage file deletion failures gracefully
                        }
                    }
                    $image->delete();
                }
            }

            // 2. Update captions for remaining existing images
            if (is_array($existingCaptions)) {
                foreach ($existingCaptions as $imageId => $caption) {
                    ListingImage::where('image_id', $imageId)
                        ->where('listing_id', $listing->listing_id)
                        ->update(['caption' => $caption]);
                }
            }

            // 3. Store newly uploaded images
            if (is_array($uploadedImages) && count($uploadedImages) > 0) {
                $currentMaxSort = ListingImage::where('listing_id', $listing->listing_id)->max('sort_order') ?? -1;

                foreach ($uploadedImages as $index => $imageFile) {
                    if ($imageFile && $imageFile->isValid()) {
                        $path = $imageFile->store('listings', $disk);
                        $caption = $captions[$index] ?? null;

                        if ($path) {
                            $sortOrder = $currentMaxSort + 1 + $index;
                            $hasPrimary = ListingImage::where('listing_id', $listing->listing_id)->where('is_primary', true)->exists();

                            ListingImage::create([
                                'listing_id' => $listing->listing_id,
                                'file_path' => $path,
                                'caption' => $caption,
                                'sort_order' => $sortOrder,
                                'is_primary' => ! $hasPrimary && $index === 0,
                            ]);
                        }
                    }
                }
            }

            return redirect()->route('listings.index')
                ->with('success', 'Land listing updated successfully!');
        } catch (\Throwable $e) {
            dd([
                'error_type' => get_class($e),
                'error_message' => $e->getMessage(),
                'error_file' => $e->getFile(),
                'error_line' => $e->getLine(),
                'request_data' => $request->all(),
                'trace' => $e->getTraceAsString(),
            ]);
        }
    }
}
