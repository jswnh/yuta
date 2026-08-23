import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ListingFavoriteController::index
 * @see app/Http/Controllers/ListingFavoriteController.php:18
 * @route '/favorites'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/favorites',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ListingFavoriteController::index
 * @see app/Http/Controllers/ListingFavoriteController.php:18
 * @route '/favorites'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ListingFavoriteController::index
 * @see app/Http/Controllers/ListingFavoriteController.php:18
 * @route '/favorites'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ListingFavoriteController::index
 * @see app/Http/Controllers/ListingFavoriteController.php:18
 * @route '/favorites'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ListingFavoriteController::index
 * @see app/Http/Controllers/ListingFavoriteController.php:18
 * @route '/favorites'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ListingFavoriteController::index
 * @see app/Http/Controllers/ListingFavoriteController.php:18
 * @route '/favorites'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ListingFavoriteController::index
 * @see app/Http/Controllers/ListingFavoriteController.php:18
 * @route '/favorites'
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
* @see \App\Http\Controllers\ListingFavoriteController::toggle
 * @see app/Http/Controllers/ListingFavoriteController.php:37
 * @route '/properties/{listing}/favorite'
 */
export const toggle = (args: { listing: string | { listing_id: string } } | [listing: string | { listing_id: string } ] | string | { listing_id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggle.url(args, options),
    method: 'post',
})

toggle.definition = {
    methods: ["post"],
    url: '/properties/{listing}/favorite',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ListingFavoriteController::toggle
 * @see app/Http/Controllers/ListingFavoriteController.php:37
 * @route '/properties/{listing}/favorite'
 */
toggle.url = (args: { listing: string | { listing_id: string } } | [listing: string | { listing_id: string } ] | string | { listing_id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { listing: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'listing_id' in args) {
            args = { listing: args.listing_id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    listing: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        listing: typeof args.listing === 'object'
                ? args.listing.listing_id
                : args.listing,
                }

    return toggle.definition.url
            .replace('{listing}', parsedArgs.listing.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ListingFavoriteController::toggle
 * @see app/Http/Controllers/ListingFavoriteController.php:37
 * @route '/properties/{listing}/favorite'
 */
toggle.post = (args: { listing: string | { listing_id: string } } | [listing: string | { listing_id: string } ] | string | { listing_id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggle.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ListingFavoriteController::toggle
 * @see app/Http/Controllers/ListingFavoriteController.php:37
 * @route '/properties/{listing}/favorite'
 */
    const toggleForm = (args: { listing: string | { listing_id: string } } | [listing: string | { listing_id: string } ] | string | { listing_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: toggle.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ListingFavoriteController::toggle
 * @see app/Http/Controllers/ListingFavoriteController.php:37
 * @route '/properties/{listing}/favorite'
 */
        toggleForm.post = (args: { listing: string | { listing_id: string } } | [listing: string | { listing_id: string } ] | string | { listing_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: toggle.url(args, options),
            method: 'post',
        })
    
    toggle.form = toggleForm
const ListingFavoriteController = { index, toggle }

export default ListingFavoriteController