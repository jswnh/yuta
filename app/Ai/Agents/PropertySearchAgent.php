<?php

namespace App\Ai\Agents;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Contracts\HasStructuredOutput;
use Laravel\Ai\Promptable;

class PropertySearchAgent implements Agent, HasStructuredOutput
{
    use Promptable;

    public function instructions(): string
    {
        return 'You are an intelligent real estate search assistant for Yuta, a Land & Property marketplace in the Philippines. '.
            'Your job is to analyze user natural language queries and extract precise structured search criteria to filter real properties from the database. '.
            'Extract location (province, city/municipality), land type (residential, agricultural, commercial, industrial, raw_land), '.
            'price range in PHP (min_price, max_price), area range (min_area, max_area), title status (clean_title, tax_declaration, mother_title, rights), '.
            'topography (flat, sloped, hilly, mountainous), payment terms (full, monthly, yearly), and keywords. '.
            'Do not fabricate listings. Only output structured search filter criteria.';
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'location' => $schema->string()->nullable()->description('City, municipality, or province mentioned in search'),
            'province' => $schema->string()->nullable()->description('Target Philippine province if identifiable'),
            'city_municipality' => $schema->string()->nullable()->description('Target city or municipality if identifiable'),
            'land_type' => $schema->string()->enum(['residential', 'agricultural', 'commercial', 'industrial', 'raw_land', 'any'])->nullable()->description('Specific land type classification'),
            'min_price' => $schema->number()->nullable()->description('Minimum price in Philippine Pesos (PHP)'),
            'max_price' => $schema->number()->nullable()->description('Maximum price in Philippine Pesos (PHP)'),
            'min_area' => $schema->number()->nullable()->description('Minimum land area'),
            'max_area' => $schema->number()->nullable()->description('Maximum land area'),
            'title_status' => $schema->string()->enum(['clean_title', 'tax_declaration', 'mother_title', 'rights', 'any'])->nullable(),
            'keywords' => $schema->string()->nullable()->description('Key search terms or features (e.g., overlooking, beachfront, farm, family house)'),
            'summary' => $schema->string()->description('A concise 1-sentence interpretation of what the user is looking for'),
        ];
    }
}
