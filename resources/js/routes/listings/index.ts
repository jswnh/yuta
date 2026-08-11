import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\ListingController::index
 * @see app/Http/Controllers/ListingController.php:21
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
 * @see app/Http/Controllers/ListingController.php:21
 * @route '/listings'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ListingController::index
 * @see app/Http/Controllers/ListingController.php:21
 * @route '/listings'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ListingController::index
 * @see app/Http/Controllers/ListingController.php:21
 * @route '/listings'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ListingController::index
 * @see app/Http/Controllers/ListingController.php:21
 * @route '/listings'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ListingController::index
 * @see app/Http/Controllers/ListingController.php:21
 * @route '/listings'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ListingController::index
 * @see app/Http/Controllers/ListingController.php:21
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
 * @see app/Http/Controllers/ListingController.php:36
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
 * @see app/Http/Controllers/ListingController.php:36
 * @route '/listings/new'
 */
newMethod.url = (options?: RouteQueryOptions) => {
    return newMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ListingController::newMethod
 * @see app/Http/Controllers/ListingController.php:36
 * @route '/listings/new'
 */
newMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: newMethod.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ListingController::newMethod
 * @see app/Http/Controllers/ListingController.php:36
 * @route '/listings/new'
 */
newMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: newMethod.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ListingController::newMethod
 * @see app/Http/Controllers/ListingController.php:36
 * @route '/listings/new'
 */
    const newMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: newMethod.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ListingController::newMethod
 * @see app/Http/Controllers/ListingController.php:36
 * @route '/listings/new'
 */
        newMethodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: newMethod.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ListingController::newMethod
 * @see app/Http/Controllers/ListingController.php:36
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
 * @see app/Http/Controllers/ListingController.php:48
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
 * @see app/Http/Controllers/ListingController.php:48
 * @route '/listings/draft'
 */
draft.url = (options?: RouteQueryOptions) => {
    return draft.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ListingController::draft
 * @see app/Http/Controllers/ListingController.php:48
 * @route '/listings/draft'
 */
draft.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: draft.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ListingController::draft
 * @see app/Http/Controllers/ListingController.php:48
 * @route '/listings/draft'
 */
    const draftForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: draft.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ListingController::draft
 * @see app/Http/Controllers/ListingController.php:48
 * @route '/listings/draft'
 */
        draftForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: draft.url(options),
            method: 'post',
        })
    
    draft.form = draftForm
/**
* @see \App\Http\Controllers\ListingController::store
 * @see app/Http/Controllers/ListingController.php:70
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
 * @see app/Http/Controllers/ListingController.php:70
 * @route '/listings'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ListingController::store
 * @see app/Http/Controllers/ListingController.php:70
 * @route '/listings'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ListingController::store
 * @see app/Http/Controllers/ListingController.php:70
 * @route '/listings'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ListingController::store
 * @see app/Http/Controllers/ListingController.php:70
 * @route '/listings'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
const listings = {
    index: Object.assign(index, index),
new: Object.assign(newMethod, newMethod),
draft: Object.assign(draft, draft),
store: Object.assign(store, store),
}

export default listings