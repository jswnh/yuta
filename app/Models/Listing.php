<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Listing extends Model
{

    use HasFactory, HasUuids;

    protected $primaryKey = 'listing_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'seller_id',
        'seller_type',
        'title',
        'slug',
        'description',
        'price',
        'currency',
        'is_negotiable',
        'price_per_unit',
        'payment_terms',
        'down_payment',
        'installment_count',
        'installment_amount',
        'area',
        'area_unit',
        'land_type',
        'topography',
        'title_status',
        'parcel_number',
        'is_verified',
        'address_line',
        'barangay',
        'city_municipality',
        'province',
        'region',
        'zip_code',
        'latitude',
        'longitude',
        'boundary_coordinates',
        'status',
        'is_featured',
        'view_count',
        'published_at',
        'sold_at',
    ];

    protected function casts(): array
    {
        return [
            'is_negotiable' => 'boolean',
            'is_verified' => 'boolean',
            'is_featured' => 'boolean',
            'price' => 'decimal:2',
            'price_per_unit' => 'decimal:2',
            'down_payment' => 'decimal:2',
            'installment_amount' => 'decimal:2',
            'installment_count' => 'integer',
            'area' => 'decimal:2',
            'latitude' => 'float',
            'longitude' => 'float',
            'boundary_coordinates' => 'array',
            'view_count' => 'integer',
            'published_at' => 'datetime',
            'sold_at' => 'datetime',
        ];
    }

    public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'seller_id', 'user_id');
    }

    public function images(): HasMany
    {
        return $this->hasMany(ListingImage::class, 'listing_id', 'listing_id')
                    ->orderBy('sort_order', 'asc');
    }
}
