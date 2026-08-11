import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
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
* @see \App\Http\Controllers\ListingController::create
 * @see app/Http/Controllers/ListingController.php:36
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
 * @see app/Http/Controllers/ListingController.php:36
 * @route '/listings/new'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ListingController::create
 * @see app/Http/Controllers/ListingController.php:36
 * @route '/listings/new'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ListingController::create
 * @see app/Http/Controllers/ListingController.php:36
 * @route '/listings/new'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ListingController::create
 * @see app/Http/Controllers/ListingController.php:36
 * @route '/listings/new'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ListingController::create
 * @see app/Http/Controllers/ListingController.php:36
 * @route '/listings/new'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ListingController::create
 * @see app/Http/Controllers/ListingController.php:36
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
 * @see app/Http/Controllers/ListingController.php:48
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
 * @see app/Http/Controllers/ListingController.php:48
 * @route '/listings/draft'
 */
saveDraft.url = (options?: RouteQueryOptions) => {
    return saveDraft.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ListingController::saveDraft
 * @see app/Http/Controllers/ListingController.php:48
 * @route '/listings/draft'
 */
saveDraft.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: saveDraft.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ListingController::saveDraft
 * @see app/Http/Controllers/ListingController.php:48
 * @route '/listings/draft'
 */
    const saveDraftForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: saveDraft.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ListingController::saveDraft
 * @see app/Http/Controllers/ListingController.php:48
 * @route '/listings/draft'
 */
        saveDraftForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: saveDraft.url(options),
            method: 'post',
        })
    
    saveDraft.form = saveDraftForm
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
const ListingController = { index, create, saveDraft, store }

export default ListingController