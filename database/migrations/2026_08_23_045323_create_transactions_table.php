<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('transaction_number')->unique()->index();
            $table->foreignUuid('agreement_id')
                ->nullable()
                ->constrained('agreements', 'id')
                ->nullOnDelete();
            $table->foreignUuid('listing_id')
                ->constrained('listings', 'listing_id')
                ->cascadeOnDelete();
            $table->foreignUuid('buyer_id')
                ->constrained('users', 'user_id')
                ->cascadeOnDelete();
            $table->foreignUuid('seller_id')
                ->constrained('users', 'user_id')
                ->cascadeOnDelete();
            $table->string('title');
            $table->decimal('amount', 14, 2);
            $table->string('currency', 3)->default('PHP');
            $table->string('payment_method')->default('xendit_invoice');
            $table->string('payment_channel')->nullable();
            $table->enum('payment_status', [
                'pending',
                'processing',
                'completed',
                'failed',
                'cancelled',
                'disputed',
            ])->default('pending')->index();
            $table->string('xendit_invoice_id')->nullable()->index();
            $table->text('xendit_invoice_url')->nullable();
            $table->string('xendit_external_id')->nullable()->unique();
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->string('reference_number')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
