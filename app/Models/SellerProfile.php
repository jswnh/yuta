<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SellerProfile extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id',
        'display_name',
        'business_name',
        'seller_type',
        'license_number',
        'tax_id_number',
        'description',
        'contact_email',
        'contact_phone',
        'address_line',
        'city_municipality',
        'province',
        'zip_code',
        'years_of_experience',
        'verification_status',
        'verification_submitted_at',
        'verified_at',
        'rejection_reason',
    ];

    protected function casts(): array
    {
        return [
            'years_of_experience' => 'integer',
            'verification_submitted_at' => 'datetime',
            'verified_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function documents(): HasMany
    {
        return $this->hasMany(SellerDocument::class, 'seller_profile_id', 'id');
    }

    public function isVerified(): bool
    {
        return $this->verification_status === 'verified';
    }
}
