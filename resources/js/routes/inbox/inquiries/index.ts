import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\InboxController::store
 * @see app/Http/Controllers/InboxController.php:137
 * @route '/inbox/inquiries'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/inbox/inquiries',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InboxController::store
 * @see app/Http/Controllers/InboxController.php:137
 * @route '/inbox/inquiries'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InboxController::store
 * @see app/Http/Controllers/InboxController.php:137
 * @route '/inbox/inquiries'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\InboxController::store
 * @see app/Http/Controllers/InboxController.php:137
 * @route '/inbox/inquiries'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\InboxController::store
 * @see app/Http/Controllers/InboxController.php:137
 * @route '/inbox/inquiries'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
const inquiries = {
    store: Object.assign(store, store),
}

export default inquiries