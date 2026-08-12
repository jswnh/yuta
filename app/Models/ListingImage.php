<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ListingImage extends Model
{
    use HasFactory, HasUuids;

    protected $primaryKey = 'image_id';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'listing_id',
        'file_path',
        'caption',
        'sort_order',
        'is_primary',
    ];

    protected $appends = ['url'];

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
            'is_primary' => 'boolean',
        ];
    }

    public function getUrlAttribute(): string
    {
        if (! $this->file_path) {
            return '';
        }

        if (str_starts_with($this->file_path, 'http://') || str_starts_with($this->file_path, 'https://')) {
            return $this->file_path;
        }

        $r2Url = config('filesystems.disks.r2.url') ?: env('R2_URL', 'https://pub-19475a64b9ef47b78593af8d0414d4be.r2.dev');

        if ($r2Url) {
            return rtrim($r2Url, '/').'/'.ltrim($this->file_path, '/');
        }

        return asset('storage/'.ltrim($this->file_path, '/'));
    }

    public function listing(): BelongsTo
    {
        return $this->belongsTo(Listing::class, 'listing_id', 'listing_id');
    }
}
