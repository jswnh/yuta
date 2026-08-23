import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\SellerProfileController::update
 * @see app/Http/Controllers/SellerProfileController.php:47
 * @route '/settings/seller-profile'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/settings/seller-profile',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\SellerProfileController::update
 * @see app/Http/Controllers/SellerProfileController.php:47
 * @route '/settings/seller-profile'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SellerProfileController::update
 * @see app/Http/Controllers/SellerProfileController.php:47
 * @route '/settings/seller-profile'
 */
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\SellerProfileController::update
 * @see app/Http/Controllers/SellerProfileController.php:47
 * @route '/settings/seller-profile'
 */
update.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\SellerProfileController::update
 * @see app/Http/Controllers/SellerProfileController.php:47
 * @route '/settings/seller-profile'
 */
    const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SellerProfileController::update
 * @see app/Http/Controllers/SellerProfileController.php:47
 * @route '/settings/seller-profile'
 */
        updateForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\SellerProfileController::update
 * @see app/Http/Controllers/SellerProfileController.php:47
 * @route '/settings/seller-profile'
 */
        updateForm.patch = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\SellerProfileController::verify
 * @see app/Http/Controllers/SellerProfileController.php:78
 * @route '/settings/seller-profile/verify'
 */
export const verify = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verify.url(options),
    method: 'post',
})

verify.definition = {
    methods: ["post"],
    url: '/settings/seller-profile/verify',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SellerProfileController::verify
 * @see app/Http/Controllers/SellerProfileController.php:78
 * @route '/settings/seller-profile/verify'
 */
verify.url = (options?: RouteQueryOptions) => {
    return verify.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SellerProfileController::verify
 * @see app/Http/Controllers/SellerProfileController.php:78
 * @route '/settings/seller-profile/verify'
 */
verify.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verify.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SellerProfileController::verify
 * @see app/Http/Controllers/SellerProfileController.php:78
 * @route '/settings/seller-profile/verify'
 */
    const verifyForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: verify.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SellerProfileController::verify
 * @see app/Http/Controllers/SellerProfileController.php:78
 * @route '/settings/seller-profile/verify'
 */
        verifyForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: verify.url(options),
            method: 'post',
        })
    
    verify.form = verifyForm
const sellerProfile = {
    update: Object.assign(update, update),
verify: Object.assign(verify, verify),
}

export default sellerProfile