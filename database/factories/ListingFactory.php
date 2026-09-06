<?php

namespace Database\Factories;

use App\Models\Listing;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Listing>
 */
class ListingFactory extends Factory
{
    protected $model = Listing::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->streetName().' Prime Land Plot';

        return [
            'seller_id' => User::factory(),
            'seller_type' => 'owner',
            'title' => $title,
            'slug' => Str::slug($title).'-'.Str::random(5),
            'description' => fake()->paragraph(),
            'price' => fake()->numberBetween(500000, 20000000),
            'currency' => 'PHP',
            'is_negotiable' => true,
            'price_per_unit' => fake()->numberBetween(1000, 20000),
            'area' => fake()->numberBetween(100, 50000),
            'area_unit' => 'sqm',
            'land_type' => 'residential',
            'topography' => 'flat',
            'title_status' => 'clean_title',
            'parcel_number' => 'LOT-'.fake()->numerify('###-###'),
            'is_verified' => true,
            'address_line' => fake()->streetAddress(),
            'barangay' => 'San Antonio',
            'city_municipality' => 'Makati City',
            'province' => 'Metro Manila',
            'region' => 'NCR',
            'latitude' => 14.5547,
            'longitude' => 121.0244,
            'status' => 'active',
            'is_featured' => false,
            'is_pinned' => false,
            'view_count' => fake()->numberBetween(10, 500),
            'published_at' => now(),
        ];
    }
}
