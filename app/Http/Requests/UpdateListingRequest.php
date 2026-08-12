<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateListingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // Seller Relationship
            'seller_type' => ['required', Rule::in(['owner', 'agent', 'broker'])],

            // Content & Routing
            'title' => ['required', 'string', 'max:255'],
            'listing_category' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],

            // Pricing & Terms
            'price' => ['required', 'numeric', 'min:0'],
            'currency' => ['nullable', 'string', 'max:3'],
            'is_negotiable' => ['boolean'],
            'price_per_unit' => ['nullable', 'numeric', 'min:0'],

            // Buyer Payment Terms
            'payment_terms' => ['required', Rule::in(['full', 'monthly', 'yearly'])],
            'down_payment' => ['nullable', 'numeric', 'min:0', 'required_if:payment_terms,monthly,yearly', 'lt:price'],
            'installment_count' => ['nullable', 'integer', 'min:1', 'required_if:payment_terms,monthly,yearly'],
            'installment_amount' => ['nullable', 'numeric', 'min:0'],

            // Physical & Size
            'area' => ['required', 'numeric', 'gt:0'],
            'area_unit' => ['required', Rule::in(['sqm', 'hectare', 'sqft'])],
            'land_type' => ['required', Rule::in(['residential', 'agricultural', 'commercial', 'industrial', 'raw_land'])],
            'topography' => ['nullable', Rule::in(['flat', 'sloped', 'hilly', 'mountainous'])],

            // Legal & Documentation
            'title_status' => ['required', Rule::in(['clean_title', 'tax_declaration', 'mother_title', 'rights'])],
            'parcel_number' => ['nullable', 'string', 'max:255'],

            // Location Details
            'address_line' => ['nullable', 'string', 'max:255'],
            'barangay' => ['nullable', 'string', 'max:255'],
            'city_municipality' => ['required', 'string', 'max:255'],
            'province' => ['required', 'string', 'max:255'],
            'region' => ['nullable', 'string', 'max:255'],
            'zip_code' => ['nullable', 'string', 'max:10'],

            // Map Coordinates
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'boundary_coordinates' => ['nullable', 'array'],

            // Deleted Existing Images
            'deleted_image_ids' => ['nullable', 'array'],
            'deleted_image_ids.*' => ['string'],

            // Existing Captions Update
            'existing_captions' => ['nullable', 'array'],
            'existing_captions.*' => ['nullable', 'string', 'max:255'],

            // New Uploaded Photos & Media
            'images' => ['nullable', 'array', 'max:10'],
            'images.*' => ['image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
            'captions' => ['nullable', 'array', 'max:10'],
            'captions.*' => ['nullable', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'seller_type.required' => 'Please select whether you are the property owner, agent, or broker.',
            'title.required' => 'Give your land listing a clear, descriptive title.',
            'listing_category.required' => 'Please select a property category.',
            'price.required' => 'Please enter the listing price.',
            'area.required' => 'Specify the total area of the property.',
            'area_unit.required' => 'Please select the area unit (e.g., sqm, hectare).',
            'land_type.required' => 'Select the primary classification/type of land.',
            'title_status.required' => 'Select the legal title status (e.g., Clean Title, Tax Dec).',
            'city_municipality.required' => 'City or municipality is required to locate the property.',
            'province.required' => 'Province is required.',
            'images.*.uploaded' => 'One of the selected images failed to upload because it exceeds the 2MB PHP file size limit.',
            'images.*.image' => 'Uploaded file must be a valid image.',
            'images.*.mimes' => 'Images must be in JPEG, PNG, JPG, or WEBP format.',
            'images.*.max' => 'Each image size must not exceed 2MB.',
        ];
    }
}
