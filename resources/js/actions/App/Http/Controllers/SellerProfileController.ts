import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\SellerProfileController::edit
 * @see app/Http/Controllers/SellerProfileController.php:18
 * @route '/settings/seller-profile'
 */
export const edit = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/settings/seller-profile',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SellerProfileController::edit
 * @see app/Http/Controllers/SellerProfileController.php:18
 * @route '/settings/seller-profile'
 */
edit.url = (options?: RouteQueryOptions) => {
    return edit.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SellerProfileController::edit
 * @see app/Http/Controllers/SellerProfileController.php:18
 * @route '/settings/seller-profile'
 */
edit.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SellerProfileController::edit
 * @see app/Http/Controllers/SellerProfileController.php:18
 * @route '/settings/seller-profile'
 */
edit.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SellerProfileController::edit
 * @see app/Http/Controllers/SellerProfileController.php:18
 * @route '/settings/seller-profile'
 */
    const editForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SellerProfileController::edit
 * @see app/Http/Controllers/SellerProfileController.php:18
 * @route '/settings/seller-profile'
 */
        editForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SellerProfileController::edit
 * @see app/Http/Controllers/SellerProfileController.php:18
 * @route '/settings/seller-profile'
 */
        editForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
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
* @see \App\Http\Controllers\SellerProfileController::submitVerification
 * @see app/Http/Controllers/SellerProfileController.php:78
 * @route '/settings/seller-profile/verify'
 */
export const submitVerification = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submitVerification.url(options),
    method: 'post',
})

submitVerification.definition = {
    methods: ["post"],
    url: '/settings/seller-profile/verify',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SellerProfileController::submitVerification
 * @see app/Http/Controllers/SellerProfileController.php:78
 * @route '/settings/seller-profile/verify'
 */
submitVerification.url = (options?: RouteQueryOptions) => {
    return submitVerification.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SellerProfileController::submitVerification
 * @see app/Http/Controllers/SellerProfileController.php:78
 * @route '/settings/seller-profile/verify'
 */
submitVerification.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submitVerification.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SellerProfileController::submitVerification
 * @see app/Http/Controllers/SellerProfileController.php:78
 * @route '/settings/seller-profile/verify'
 */
    const submitVerificationForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: submitVerification.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SellerProfileController::submitVerification
 * @see app/Http/Controllers/SellerProfileController.php:78
 * @route '/settings/seller-profile/verify'
 */
        submitVerificationForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: submitVerification.url(options),
            method: 'post',
        })
    
    submitVerification.form = submitVerificationForm
const SellerProfileController = { edit, update, submitVerification }

export default SellerProfileController