<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string $user_id
 * @property string $plan_name
 * @property string $plan_code
 * @property float $amount
 * @property string $currency
 * @property string $interval
 * @property string $status
 * @property string|null $xendit_invoice_id
 * @property string|null $xendit_invoice_url
 * @property string $xendit_external_id
 * @property string|null $payment_method
 * @property Carbon|null $paid_at
 * @property Carbon|null $starts_at
 * @property Carbon|null $ends_at
 * @property Carbon|null $cancelled_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'user_id',
    'plan_name',
    'plan_code',
    'amount',
    'currency',
    'interval',
    'status',
    'xendit_invoice_id',
    'xendit_invoice_url',
    'xendit_external_id',
    'payment_method',
    'paid_at',
    'starts_at',
    'ends_at',
    'cancelled_at',
])]
class Subscription extends Model
{
    use HasFactory, HasUuids;

    public $incrementing = false;

    protected $keyType = 'string';

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'paid_at' => 'datetime',
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
            'cancelled_at' => 'datetime',
        ];
    }

    /**
     * Get the user that owns the subscription.
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    /**
     * Determine if the subscription is currently active.
     */
    public function isActive(): bool
    {
        if ($this->status !== 'active') {
            return false;
        }

        if ($this->ends_at && $this->ends_at->isPast()) {
            return false;
        }

        return true;
    }

    /**
     * Determine if the subscription is pending payment.
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }
}
