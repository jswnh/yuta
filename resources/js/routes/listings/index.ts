import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
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
* @see \App\Http\Controllers\ListingController::newMethod
 * @see app/Http/Controllers/ListingController.php:38
 * @route '/listings/new'
 */
export const newMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: newMethod.url(options),
    method: 'get',
})

newMethod.definition = {
    methods: ["get","head"],
    url: '/listings/new',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ListingController::newMethod
 * @see app/Http/Controllers/ListingController.php:38
 * @route '/listings/new'
 */
newMethod.url = (options?: RouteQueryOptions) => {
    return newMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ListingController::newMethod
 * @see app/Http/Controllers/ListingController.php:38
 * @route '/listings/new'
 */
newMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: newMethod.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ListingController::newMethod
 * @see app/Http/Controllers/ListingController.php:38
 * @route '/listings/new'
 */
newMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: newMethod.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ListingController::newMethod
 * @see app/Http/Controllers/ListingController.php:38
 * @route '/listings/new'
 */
    const newMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: newMethod.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ListingController::newMethod
 * @see app/Http/Controllers/ListingController.php:38
 * @route '/listings/new'
 */
        newMethodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: newMethod.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ListingController::newMethod
 * @see app/Http/Controllers/ListingController.php:38
 * @route '/listings/new'
 */
        newMethodForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: newMethod.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    newMethod.form = newMethodForm
/**
* @see \App\Http\Controllers\ListingController::draft
 * @see app/Http/Controllers/ListingController.php:50
 * @route '/listings/draft'
 */
export const draft = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: draft.url(options),
    method: 'post',
})

draft.definition = {
    methods: ["post"],
    url: '/listings/draft',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ListingController::draft
 * @see app/Http/Controllers/ListingController.php:50
 * @route '/listings/draft'
 */
draft.url = (options?: RouteQueryOptions) => {
    return draft.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ListingController::draft
 * @see app/Http/Controllers/ListingController.php:50
 * @route '/listings/draft'
 */
draft.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: draft.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ListingController::draft
 * @see app/Http/Controllers/ListingController.php:50
 * @route '/listings/draft'
 */
    const draftForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: draft.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ListingController::draft
 * @see app/Http/Controllers/ListingController.php:50
 * @route '/listings/draft'
 */
        draftForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: draft.url(options),
            method: 'post',
        })
    
    draft.form = draftForm
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
const listings = {
    index: Object.assign(index, index),
new: Object.assign(newMethod, newMethod),
draft: Object.assign(draft, draft),
store: Object.assign(store, store),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
}

export default listings