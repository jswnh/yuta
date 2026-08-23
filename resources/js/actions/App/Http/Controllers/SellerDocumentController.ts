import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\SellerDocumentController::store
 * @see app/Http/Controllers/SellerDocumentController.php:16
 * @route '/settings/seller-documents'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/settings/seller-documents',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SellerDocumentController::store
 * @see app/Http/Controllers/SellerDocumentController.php:16
 * @route '/settings/seller-documents'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SellerDocumentController::store
 * @see app/Http/Controllers/SellerDocumentController.php:16
 * @route '/settings/seller-documents'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SellerDocumentController::store
 * @see app/Http/Controllers/SellerDocumentController.php:16
 * @route '/settings/seller-documents'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SellerDocumentController::store
 * @see app/Http/Controllers/SellerDocumentController.php:16
 * @route '/settings/seller-documents'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\SellerDocumentController::destroy
 * @see app/Http/Controllers/SellerDocumentController.php:49
 * @route '/settings/seller-documents/{document}'
 */
export const destroy = (args: { document: string | { id: string } } | [document: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/settings/seller-documents/{document}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\SellerDocumentController::destroy
 * @see app/Http/Controllers/SellerDocumentController.php:49
 * @route '/settings/seller-documents/{document}'
 */
destroy.url = (args: { document: string | { id: string } } | [document: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { document: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { document: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    document: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        document: typeof args.document === 'object'
                ? args.document.id
                : args.document,
                }

    return destroy.definition.url
            .replace('{document}', parsedArgs.document.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SellerDocumentController::destroy
 * @see app/Http/Controllers/SellerDocumentController.php:49
 * @route '/settings/seller-documents/{document}'
 */
destroy.delete = (args: { document: string | { id: string } } | [document: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\SellerDocumentController::destroy
 * @see app/Http/Controllers/SellerDocumentController.php:49
 * @route '/settings/seller-documents/{document}'
 */
    const destroyForm = (args: { document: string | { id: string } } | [document: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SellerDocumentController::destroy
 * @see app/Http/Controllers/SellerDocumentController.php:49
 * @route '/settings/seller-documents/{document}'
 */
        destroyForm.delete = (args: { document: string | { id: string } } | [document: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const SellerDocumentController = { store, destroy }

export default SellerDocumentController