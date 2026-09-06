<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SellerDocument extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'seller_profile_id',
        'user_id',
        'document_type',
        'document_name',
        'file_path',
        'file_size',
        'mime_type',
        'status',
        'rejection_reason',
        'reviewer_notes',
        'verified_at',
        'expires_at',
    ];

    protected function casts(): array
    {
        return [
            'file_size' => 'integer',
            'verified_at' => 'datetime',
            'expires_at' => 'datetime',
        ];
    }

    public function profile(): BelongsTo
    {
        return $this->belongsTo(SellerProfile::class, 'seller_profile_id', 'id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
}
