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
        Schema::create('listings', function (Blueprint $table) {
            $table->uuid('listing_id')->primary();

            // Seller Relationship
            $table->foreignUuid('seller_id')
                  ->constrained('users', 'user_id')
                  ->cascadeOnDelete();
            $table->enum('seller_type', ['owner', 'agent', 'broker'])->default('owner');
            
            // Content & Routing
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            
            // Pricing & Terms
            $table->decimal('price', 14, 2);
            $table->string('currency', 3)->default('PHP');
            $table->boolean('is_negotiable')->default(false);
            $table->decimal('price_per_unit', 12, 2)->nullable();

            // Physical & Size Characteristics
            $table->decimal('area', 12, 2);
            $table->enum('area_unit', ['sqm', 'hectare', 'sqft'])->default('sqm');
            $table->enum('land_type', ['residential', 'agricultural', 'commercial', 'industrial', 'raw_land'])->default('raw_land');
            $table->enum('topography', ['flat', 'sloped', 'hilly', 'mountainous'])->nullable();

            // Legal & Documentation
            $table->enum('title_status', ['clean_title', 'tax_declaration', 'mother_title', 'rights'])->default('clean_title');
            $table->string('parcel_number')->nullable();
            $table->boolean('is_verified')->default(false);

            // Location Details
            $table->string('address_line')->nullable();
            $table->string('barangay')->nullable();
            $table->string('city_municipality');
            $table->string('province');
            $table->string('region')->nullable();
            $table->string('zip_code', 10)->nullable();

            // React Leaflet Map Coordinates & Boundaries
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->json('boundary_coordinates')->nullable();

            // Status, Visibility & Metrics
            $table->enum('status', ['draft', 'pending_review', 'active', 'under_contract', 'sold', 'archived'])->default('draft');
            $table->boolean('is_featured')->default(false);
            $table->unsignedBigInteger('view_count')->default(0);
            $table->timestamp('published_at')->nullable();
            $table->timestamp('sold_at')->nullable();       

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('listings');
    }
};
