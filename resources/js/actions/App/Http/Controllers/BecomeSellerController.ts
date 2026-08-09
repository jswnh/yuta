import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\BecomeSellerController::store
 * @see app/Http/Controllers/BecomeSellerController.php:13
 * @route '/become-seller'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/become-seller',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\BecomeSellerController::store
 * @see app/Http/Controllers/BecomeSellerController.php:13
 * @route '/become-seller'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BecomeSellerController::store
 * @see app/Http/Controllers/BecomeSellerController.php:13
 * @route '/become-seller'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\BecomeSellerController::store
 * @see app/Http/Controllers/BecomeSellerController.php:13
 * @route '/become-seller'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\BecomeSellerController::store
 * @see app/Http/Controllers/BecomeSellerController.php:13
 * @route '/become-seller'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
const BecomeSellerController = { store }

export default BecomeSellerController