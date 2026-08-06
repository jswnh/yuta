<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateListingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
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
            'description' => ['nullable', 'string'],

            // Pricing & Terms
            'price' => ['required', 'numeric', 'min:0'],
            'currency' => ['nullable', 'string', 'max:3'],
            'is_negotiable' => ['boolean'],
            'price_per_unit' => ['nullable', 'numeric', 'min:0'],

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
        ];
    }

    public function messages(): array
    {
        return [
            'seller_type.required' => 'Please select whether you are the property owner, agent, or broker.',
            'title.required' => 'Give your land listing a clear, descriptive title.',
            'price.required' => 'Please enter the listing price.',
            'price.min' => 'Listing price cannot be negative.',
            'area.required' => 'Specify the total area of the property.',
            'area.gt' => 'Land area must be greater than zero.',
            'land_type.required' => 'Select the primary classification/type of land.',
            'title_status.required' => 'Select the legal title status (e.g., Clean Title, Tax Dec).',
            'city_municipality.required' => 'City or municipality is required to locate the property.',
            'province.required' => 'Province is required.',
        ];
    }
}
