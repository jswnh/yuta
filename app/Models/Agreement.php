<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Agreement extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'agreement_number',
        'listing_id',
        'buyer_id',
        'seller_id',
        'conversation_id',
        'status',
        'agreed_price',
        'currency',
        'payment_type',
        'down_payment',
        'installment_months',
        'monthly_installment',
        'terms_and_conditions',
        'special_provisions',
        'target_closing_date',
        'proposed_by',
        'accepted_at',
        'rejected_at',
        'rejection_reason',
        'cancelled_at',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'agreed_price' => 'decimal:2',
            'down_payment' => 'decimal:2',
            'monthly_installment' => 'decimal:2',
            'installment_months' => 'integer',
            'target_closing_date' => 'date',
            'accepted_at' => 'datetime',
            'rejected_at' => 'datetime',
            'cancelled_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    public function listing(): BelongsTo
    {
        return $this->belongsTo(Listing::class, 'listing_id', 'listing_id');
    }

    public function buyer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'buyer_id', 'user_id');
    }

    public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'seller_id', 'user_id');
    }

    public function proposer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'proposed_by', 'user_id');
    }

    public function conversation(): BelongsTo
    {
        return $this->belongsTo(Conversation::class, 'conversation_id', 'id');
    }

    public function timelines(): HasMany
    {
        return $this->hasMany(AgreementTimeline::class, 'agreement_id', 'id')->orderBy('created_at', 'desc');
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class, 'agreement_id', 'id');
    }
}
