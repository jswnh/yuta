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
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')
                ->constrained('users', 'user_id')
                ->cascadeOnDelete();
            $table->string('plan_name')->default('Seller Pro Monthly');
            $table->string('plan_code')->default('seller_monthly');
            $table->decimal('amount', 10, 2)->default(499.00);
            $table->string('currency', 3)->default('PHP');
            $table->string('interval')->default('month');
            $table->string('status')->default('pending')->index();
            $table->string('xendit_invoice_id')->nullable()->index();
            $table->text('xendit_invoice_url')->nullable();
            $table->string('xendit_external_id')->unique();
            $table->string('payment_method')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};
