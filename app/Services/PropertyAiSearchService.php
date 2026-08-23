<?php

namespace App\Services;

use App\Ai\Agents\PropertySearchAgent;
use App\Models\Listing;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Log;
use Laravel\Ai\Enums\Lab;

class PropertyAiSearchService
{
    /**
     * Search listings using natural language powered by Laravel AI SDK and OpenRouter.
     *
     * @return array{
     *     listings: Collection<int, Listing>,
     *     criteria: array<string, mixed>,
     *     query: string,
     *     interpretation: string
     * }
     */
    public function search(string $userQuery): array
    {
        $userQuery = trim($userQuery);
        if (empty($userQuery)) {
            $listings = Listing::with(['images', 'seller.sellerProfile'])
                ->where('status', 'active')
                ->latest('published_at')
                ->take(12)
                ->get();

            return [
                'listings' => $listings,
                'criteria' => [],
                'query' => '',
                'interpretation' => 'Showing all latest active property listings.',
            ];
        }

        $criteria = $this->extractCriteria($userQuery);

        $listings = $this->queryDatabaseListings($criteria, $userQuery);

        return [
            'listings' => $listings,
            'criteria' => $criteria,
            'query' => $userQuery,
            'interpretation' => $criteria['summary'] ?? "Properties matching \"{$userQuery}\"",
        ];
    }

    /**
     * Extract structured search parameters from natural language.
     *
     * @return array<string, mixed>
     */
    protected function extractCriteria(string $userQuery): array
    {
        $openRouterKey = config('ai.providers.openrouter.key') ?: env('OPENROUTER_API_KEY');

        if (! empty($openRouterKey)) {
            try {
                $agent = new PropertySearchAgent;
                $response = $agent->prompt(
                    $userQuery,
                    provider: Lab::OpenRouter,
                    model: 'openai/gpt-4o-mini',
                );

                if (is_array($response)) {
                    return $response;
                }
            } catch (\Throwable $e) {
                Log::warning('AI Property Search Fallback: '.$e->getMessage());
            }
        }

        // Heuristic fallback parser when AI key is unavailable
        return $this->heuristicFallback($userQuery);
    }

    /**
     * Fallback natural language heuristic extractor.
     *
     * @return array<string, mixed>
     */
    protected function heuristicFallback(string $query): array
    {
        $lower = strtolower($query);
        $criteria = [
            'location' => null,
            'province' => null,
            'city_municipality' => null,
            'land_type' => null,
            'min_price' => null,
            'max_price' => null,
            'min_area' => null,
            'max_area' => null,
            'title_status' => null,
            'keywords' => $query,
            'summary' => "Searching for properties matching: \"{$query}\"",
        ];

        // Match land types
        if (str_contains($lower, 'residential') || str_contains($lower, 'house') || str_contains($lower, 'subdivision') || str_contains($lower, 'lot')) {
            $criteria['land_type'] = 'residential';
        } elseif (str_contains($lower, 'farm') || str_contains($lower, 'agri') || str_contains($lower, 'plantation')) {
            $criteria['land_type'] = 'agricultural';
        } elseif (str_contains($lower, 'commercial') || str_contains($lower, 'business')) {
            $criteria['land_type'] = 'commercial';
        } elseif (str_contains($lower, 'industrial') || str_contains($lower, 'warehouse')) {
            $criteria['land_type'] = 'industrial';
        } elseif (str_contains($lower, 'raw') || str_contains($lower, 'mountain')) {
            $criteria['land_type'] = 'raw_land';
        }

        // Match title status
        if (str_contains($lower, 'clean title') || str_contains($lower, 'titled') || str_contains($lower, 'tct')) {
            $criteria['title_status'] = 'clean_title';
        } elseif (str_contains($lower, 'tax dec')) {
            $criteria['title_status'] = 'tax_declaration';
        }

        // Match price patterns e.g. "under 5M", "below 5 million", "under 5,000,000", "< 10m"
        if (preg_match('/(?:under|below|max|less than|<)\s*(?:php|p|?)?\s*(\d+(?:\.\d+)?)\s*(m|million|k|thousand)?/i', $lower, $matches)) {
            $val = (float) $matches[1];
            $unit = strtolower($matches[2] ?? '');
            if ($unit === 'm' || $unit === 'million') {
                $val *= 1000000;
            } elseif ($unit === 'k' || $unit === 'thousand') {
                $val *= 1000;
            }
            $criteria['max_price'] = $val;
        }

        if (preg_match('/(?:above|over|min|more than|>)\s*(?:php|p|?)?\s*(\d+(?:\.\d+)?)\s*(m|million|k|thousand)?/i', $lower, $matches)) {
            $val = (float) $matches[1];
            $unit = strtolower($matches[2] ?? '');
            if ($unit === 'm' || $unit === 'million') {
                $val *= 1000000;
            } elseif ($unit === 'k' || $unit === 'thousand') {
                $val *= 1000;
            }
            $criteria['min_price'] = $val;
        }

        // Common locations in PH
        $locations = [
            'cebu', 'cavite', 'batangas', 'laguna', 'rizal', 'tagaytay', 'bulacan', 'pampanga',
            'davao', 'iloilo', 'bohol', 'palawan', 'baguio', 'benguet', 'quezon', 'antipolo',
            'pangasinan', 'tarlac', 'nueva ecija', 'albay', 'camarines', 'bacolod', 'cagayan',
        ];

        foreach ($locations as $loc) {
            if (str_contains($lower, $loc)) {
                $criteria['location'] = ucfirst($loc);
                break;
            }
        }

        return $criteria;
    }

    /**
     * Query real database listings using criteria.
     *
     * @param  array<string, mixed>  $criteria
     * @return Collection<int, Listing>
     */
    protected function queryDatabaseListings(array $criteria, string $rawQuery): Collection
    {
        $query = Listing::query()
            ->with(['images', 'seller.sellerProfile'])
            ->where('status', 'active');

        $hasSpecificFilter = false;

        if (! empty($criteria['land_type']) && $criteria['land_type'] !== 'any') {
            $query->where('land_type', $criteria['land_type']);
            $hasSpecificFilter = true;
        }

        if (! empty($criteria['title_status']) && $criteria['title_status'] !== 'any') {
            $query->where('title_status', $criteria['title_status']);
            $hasSpecificFilter = true;
        }

        if (! empty($criteria['min_price']) && is_numeric($criteria['min_price'])) {
            $query->where('price', '>=', (float) $criteria['min_price']);
            $hasSpecificFilter = true;
        }

        if (! empty($criteria['max_price']) && is_numeric($criteria['max_price'])) {
            $query->where('price', '<=', (float) $criteria['max_price']);
            $hasSpecificFilter = true;
        }

        if (! empty($criteria['min_area']) && is_numeric($criteria['min_area'])) {
            $query->where('area', '>=', (float) $criteria['min_area']);
            $hasSpecificFilter = true;
        }

        if (! empty($criteria['max_area']) && is_numeric($criteria['max_area'])) {
            $query->where('area', '<=', (float) $criteria['max_area']);
            $hasSpecificFilter = true;
        }

        // Location filtering
        $location = $criteria['province'] ?? $criteria['city_municipality'] ?? $criteria['location'] ?? null;
        if (! empty($location)) {
            $query->where(function (Builder $q) use ($location) {
                $q->where('province', 'like', "%{$location}%")
                    ->orWhere('city_municipality', 'like', "%{$location}%")
                    ->orWhere('barangay', 'like', "%{$location}%")
                    ->orWhere('address_line', 'like', "%{$location}%");
            });
            $hasSpecificFilter = true;
        }

        // Keyword search if no strict location/price filters matched or if keywords exist
        $keywords = $criteria['keywords'] ?? $rawQuery;
        if (! empty($keywords) && (! $hasSpecificFilter || strlen($keywords) > 2)) {
            $words = array_filter(explode(' ', strtolower($keywords)), fn ($w) => strlen($w) > 2 && ! in_array($w, ['the', 'and', 'for', 'with', 'under', 'near', 'show', 'find', 'want']));
            if (! empty($words)) {
                $query->where(function (Builder $q) use ($words) {
                    foreach ($words as $word) {
                        $q->orWhere('title', 'like', "%{$word}%")
                            ->orWhere('description', 'like', "%{$word}%")
                            ->orWhere('province', 'like', "%{$word}%")
                            ->orWhere('city_municipality', 'like', "%{$word}%")
                            ->orWhere('listing_category', 'like', "%{$word}%");
                    }
                });
            }
        }

        $results = $query->latest('published_at')->take(20)->get();

        // If no results with strict filters, fallback to partial keyword match so the user gets real listings
        if ($results->isEmpty()) {
            $results = Listing::query()
                ->with(['images', 'seller.sellerProfile'])
                ->where('status', 'active')
                ->where(function (Builder $q) use ($rawQuery) {
                    $q->where('title', 'like', "%{$rawQuery}%")
                        ->orWhere('province', 'like', "%{$rawQuery}%")
                        ->orWhere('city_municipality', 'like', "%{$rawQuery}%")
                        ->orWhere('description', 'like', "%{$rawQuery}%");
                })
                ->latest('published_at')
                ->take(12)
                ->get();
        }

        // If still empty and database has active listings, fallback to latest active listings gracefully
        if ($results->isEmpty()) {
            $results = Listing::query()
                ->with(['images', 'seller.sellerProfile'])
                ->where('status', 'active')
                ->latest('published_at')
                ->take(8)
                ->get();
        }

        return $results;
    }
}
