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
        Schema::create('temporary_listings', function (Blueprint $table) {
            $table->uuid('temp_listing_id')->primary();

            // Required user association - strictly persisted per user
            $table->foreignUuid('user_id')
                ->constrained('users', 'user_id')
                ->cascadeOnDelete();

            // Full listing form input payload stored as JSON
            $table->json('payload');

            // Expiration timestamp for clearing stale drafts
            $table->timestamp('expires_at')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('temporary_listings');
    }
};
