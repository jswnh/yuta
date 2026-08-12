import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ListingController::index
 * @see app/Http/Controllers/ListingController.php:23
 * @route '/listings'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/listings',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ListingController::index
 * @see app/Http/Controllers/ListingController.php:23
 * @route '/listings'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ListingController::index
 * @see app/Http/Controllers/ListingController.php:23
 * @route '/listings'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ListingController::index
 * @see app/Http/Controllers/ListingController.php:23
 * @route '/listings'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ListingController::index
 * @see app/Http/Controllers/ListingController.php:23
 * @route '/listings'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ListingController::index
 * @see app/Http/Controllers/ListingController.php:23
 * @route '/listings'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ListingController::index
 * @see app/Http/Controllers/ListingController.php:23
 * @route '/listings'
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
* @see \App\Http\Controllers\ListingController::create
 * @see app/Http/Controllers/ListingController.php:38
 * @route '/listings/new'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/listings/new',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ListingController::create
 * @see app/Http/Controllers/ListingController.php:38
 * @route '/listings/new'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ListingController::create
 * @see app/Http/Controllers/ListingController.php:38
 * @route '/listings/new'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ListingController::create
 * @see app/Http/Controllers/ListingController.php:38
 * @route '/listings/new'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ListingController::create
 * @see app/Http/Controllers/ListingController.php:38
 * @route '/listings/new'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ListingController::create
 * @see app/Http/Controllers/ListingController.php:38
 * @route '/listings/new'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ListingController::create
 * @see app/Http/Controllers/ListingController.php:38
 * @route '/listings/new'
 */
        createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\ListingController::saveDraft
 * @see app/Http/Controllers/ListingController.php:50
 * @route '/listings/draft'
 */
export const saveDraft = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: saveDraft.url(options),
    method: 'post',
})

saveDraft.definition = {
    methods: ["post"],
    url: '/listings/draft',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ListingController::saveDraft
 * @see app/Http/Controllers/ListingController.php:50
 * @route '/listings/draft'
 */
saveDraft.url = (options?: RouteQueryOptions) => {
    return saveDraft.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ListingController::saveDraft
 * @see app/Http/Controllers/ListingController.php:50
 * @route '/listings/draft'
 */
saveDraft.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: saveDraft.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ListingController::saveDraft
 * @see app/Http/Controllers/ListingController.php:50
 * @route '/listings/draft'
 */
    const saveDraftForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: saveDraft.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ListingController::saveDraft
 * @see app/Http/Controllers/ListingController.php:50
 * @route '/listings/draft'
 */
        saveDraftForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: saveDraft.url(options),
            method: 'post',
        })
    
    saveDraft.form = saveDraftForm
/**
* @see \App\Http\Controllers\ListingController::store
 * @see app/Http/Controllers/ListingController.php:72
 * @route '/listings'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/listings',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ListingController::store
 * @see app/Http/Controllers/ListingController.php:72
 * @route '/listings'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ListingController::store
 * @see app/Http/Controllers/ListingController.php:72
 * @route '/listings'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ListingController::store
 * @see app/Http/Controllers/ListingController.php:72
 * @route '/listings'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ListingController::store
 * @see app/Http/Controllers/ListingController.php:72
 * @route '/listings'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\ListingController::edit
 * @see app/Http/Controllers/ListingController.php:139
 * @route '/listings/{listing}/edit'
 */
export const edit = (args: { listing: string | { listing_id: string } } | [listing: string | { listing_id: string } ] | string | { listing_id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/listings/{listing}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ListingController::edit
 * @see app/Http/Controllers/ListingController.php:139
 * @route '/listings/{listing}/edit'
 */
edit.url = (args: { listing: string | { listing_id: string } } | [listing: string | { listing_id: string } ] | string | { listing_id: string }, options?: RouteQueryOptions) => {
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

    return edit.definition.url
            .replace('{listing}', parsedArgs.listing.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ListingController::edit
 * @see app/Http/Controllers/ListingController.php:139
 * @route '/listings/{listing}/edit'
 */
edit.get = (args: { listing: string | { listing_id: string } } | [listing: string | { listing_id: string } ] | string | { listing_id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ListingController::edit
 * @see app/Http/Controllers/ListingController.php:139
 * @route '/listings/{listing}/edit'
 */
edit.head = (args: { listing: string | { listing_id: string } } | [listing: string | { listing_id: string } ] | string | { listing_id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ListingController::edit
 * @see app/Http/Controllers/ListingController.php:139
 * @route '/listings/{listing}/edit'
 */
    const editForm = (args: { listing: string | { listing_id: string } } | [listing: string | { listing_id: string } ] | string | { listing_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ListingController::edit
 * @see app/Http/Controllers/ListingController.php:139
 * @route '/listings/{listing}/edit'
 */
        editForm.get = (args: { listing: string | { listing_id: string } } | [listing: string | { listing_id: string } ] | string | { listing_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ListingController::edit
 * @see app/Http/Controllers/ListingController.php:139
 * @route '/listings/{listing}/edit'
 */
        editForm.head = (args: { listing: string | { listing_id: string } } | [listing: string | { listing_id: string } ] | string | { listing_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\ListingController::update
 * @see app/Http/Controllers/ListingController.php:155
 * @route '/listings/{listing}'
 */
export const update = (args: { listing: string | { listing_id: string } } | [listing: string | { listing_id: string } ] | string | { listing_id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(args, options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/listings/{listing}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ListingController::update
 * @see app/Http/Controllers/ListingController.php:155
 * @route '/listings/{listing}'
 */
update.url = (args: { listing: string | { listing_id: string } } | [listing: string | { listing_id: string } ] | string | { listing_id: string }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{listing}', parsedArgs.listing.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ListingController::update
 * @see app/Http/Controllers/ListingController.php:155
 * @route '/listings/{listing}'
 */
update.post = (args: { listing: string | { listing_id: string } } | [listing: string | { listing_id: string } ] | string | { listing_id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ListingController::update
 * @see app/Http/Controllers/ListingController.php:155
 * @route '/listings/{listing}'
 */
    const updateForm = (args: { listing: string | { listing_id: string } } | [listing: string | { listing_id: string } ] | string | { listing_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ListingController::update
 * @see app/Http/Controllers/ListingController.php:155
 * @route '/listings/{listing}'
 */
        updateForm.post = (args: { listing: string | { listing_id: string } } | [listing: string | { listing_id: string } ] | string | { listing_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, options),
            method: 'post',
        })
    
    update.form = updateForm
const ListingController = { index, create, saveDraft, store, edit, update }

export default ListingController