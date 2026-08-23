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
        Schema::create('seller_profiles', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')
                ->unique()
                ->constrained('users', 'user_id')
                ->cascadeOnDelete();
            $table->string('display_name')->nullable();
            $table->string('business_name')->nullable();
            $table->string('seller_type')->default('owner');
            $table->string('license_number')->nullable();
            $table->string('tax_id_number')->nullable();
            $table->text('description')->nullable();
            $table->string('contact_email')->nullable();
            $table->string('contact_phone')->nullable();
            $table->string('address_line')->nullable();
            $table->string('city_municipality')->nullable();
            $table->string('province')->nullable();
            $table->string('zip_code', 10)->nullable();
            $table->unsignedInteger('years_of_experience')->nullable();
            $table->enum('verification_status', ['unverified', 'pending', 'verified', 'rejected'])->default('unverified')->index();
            $table->timestamp('verification_submitted_at')->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->timestamps();
        });

        Schema::create('seller_documents', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('seller_profile_id')
                ->constrained('seller_profiles', 'id')
                ->cascadeOnDelete();
            $table->foreignUuid('user_id')
                ->constrained('users', 'user_id')
                ->cascadeOnDelete();
            $table->string('document_type');
            $table->string('document_name');
            $table->string('file_path');
            $table->unsignedBigInteger('file_size')->nullable();
            $table->string('mime_type')->nullable();
            $table->enum('status', ['pending', 'approved', 'rejected', 'needs_replacement'])->default('pending')->index();
            $table->text('rejection_reason')->nullable();
            $table->text('reviewer_notes')->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('seller_documents');
        Schema::dropIfExists('seller_profiles');
    }
};
