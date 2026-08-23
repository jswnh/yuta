import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\MarketplaceController::index
 * @see app/Http/Controllers/MarketplaceController.php:14
 * @route '/marketplace'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/marketplace',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MarketplaceController::index
 * @see app/Http/Controllers/MarketplaceController.php:14
 * @route '/marketplace'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MarketplaceController::index
 * @see app/Http/Controllers/MarketplaceController.php:14
 * @route '/marketplace'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MarketplaceController::index
 * @see app/Http/Controllers/MarketplaceController.php:14
 * @route '/marketplace'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MarketplaceController::index
 * @see app/Http/Controllers/MarketplaceController.php:14
 * @route '/marketplace'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MarketplaceController::index
 * @see app/Http/Controllers/MarketplaceController.php:14
 * @route '/marketplace'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MarketplaceController::index
 * @see app/Http/Controllers/MarketplaceController.php:14
 * @route '/marketplace'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\MarketplaceController::aiSearch
 * @see app/Http/Controllers/MarketplaceController.php:40
 * @route '/marketplace/ai-search'
 */
export const aiSearch = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: aiSearch.url(options),
    method: 'post',
})

aiSearch.definition = {
    methods: ["post"],
    url: '/marketplace/ai-search',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MarketplaceController::aiSearch
 * @see app/Http/Controllers/MarketplaceController.php:40
 * @route '/marketplace/ai-search'
 */
aiSearch.url = (options?: RouteQueryOptions) => {
    return aiSearch.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MarketplaceController::aiSearch
 * @see app/Http/Controllers/MarketplaceController.php:40
 * @route '/marketplace/ai-search'
 */
aiSearch.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: aiSearch.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\MarketplaceController::aiSearch
 * @see app/Http/Controllers/MarketplaceController.php:40
 * @route '/marketplace/ai-search'
 */
    const aiSearchForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: aiSearch.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\MarketplaceController::aiSearch
 * @see app/Http/Controllers/MarketplaceController.php:40
 * @route '/marketplace/ai-search'
 */
        aiSearchForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: aiSearch.url(options),
            method: 'post',
        })
    
    aiSearch.form = aiSearchForm
const MarketplaceController = { index, aiSearch }

export default MarketplaceController