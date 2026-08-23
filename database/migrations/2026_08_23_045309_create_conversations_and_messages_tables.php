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
        Schema::create('conversations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('listing_id')
                ->nullable()
                ->constrained('listings', 'listing_id')
                ->nullOnDelete();
            $table->foreignUuid('buyer_id')
                ->constrained('users', 'user_id')
                ->cascadeOnDelete();
            $table->foreignUuid('seller_id')
                ->constrained('users', 'user_id')
                ->cascadeOnDelete();
            $table->string('subject')->nullable();
            $table->timestamp('last_message_at')->nullable()->index();
            $table->timestamps();
        });

        Schema::create('messages', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('conversation_id')
                ->constrained('conversations', 'id')
                ->cascadeOnDelete();
            $table->foreignUuid('sender_id')
                ->constrained('users', 'user_id')
                ->cascadeOnDelete();
            $table->foreignUuid('receiver_id')
                ->constrained('users', 'user_id')
                ->cascadeOnDelete();
            $table->text('body');
            $table->string('attachment_path')->nullable();
            $table->boolean('is_read')->default(false)->index();
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
        Schema::dropIfExists('conversations');
    }
};
