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
        Schema::create('agreements', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('agreement_number')->unique()->index();
            $table->foreignUuid('listing_id')
                ->constrained('listings', 'listing_id')
                ->cascadeOnDelete();
            $table->foreignUuid('buyer_id')
                ->constrained('users', 'user_id')
                ->cascadeOnDelete();
            $table->foreignUuid('seller_id')
                ->constrained('users', 'user_id')
                ->cascadeOnDelete();
            $table->foreignUuid('conversation_id')
                ->nullable()
                ->constrained('conversations', 'id')
                ->nullOnDelete();
            $table->enum('status', [
                'draft',
                'proposed',
                'pending',
                'accepted',
                'rejected',
                'cancelled',
                'active',
                'completed',
                'expired',
            ])->default('proposed')->index();
            $table->decimal('agreed_price', 14, 2);
            $table->string('currency', 3)->default('PHP');
            $table->string('payment_type')->default('full_cash');
            $table->decimal('down_payment', 14, 2)->nullable();
            $table->integer('installment_months')->nullable();
            $table->decimal('monthly_installment', 12, 2)->nullable();
            $table->text('terms_and_conditions')->nullable();
            $table->text('special_provisions')->nullable();
            $table->date('target_closing_date')->nullable();
            $table->foreignUuid('proposed_by')
                ->constrained('users', 'user_id')
                ->cascadeOnDelete();
            $table->timestamp('accepted_at')->nullable();
            $table->timestamp('rejected_at')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });

        Schema::create('agreement_timelines', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('agreement_id')
                ->constrained('agreements', 'id')
                ->cascadeOnDelete();
            $table->foreignUuid('user_id')
                ->nullable()
                ->constrained('users', 'user_id')
                ->nullOnDelete();
            $table->string('action');
            $table->text('description');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('agreement_timelines');
        Schema::dropIfExists('agreements');
    }
};
