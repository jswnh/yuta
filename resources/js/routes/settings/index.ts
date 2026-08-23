import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import sellerProfile91b5b7 from './seller-profile'
import sellerDocuments from './seller-documents'
/**
* @see \App\Http\Controllers\SellerProfileController::sellerProfile
 * @see app/Http/Controllers/SellerProfileController.php:18
 * @route '/settings/seller-profile'
 */
export const sellerProfile = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: sellerProfile.url(options),
    method: 'get',
})

sellerProfile.definition = {
    methods: ["get","head"],
    url: '/settings/seller-profile',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SellerProfileController::sellerProfile
 * @see app/Http/Controllers/SellerProfileController.php:18
 * @route '/settings/seller-profile'
 */
sellerProfile.url = (options?: RouteQueryOptions) => {
    return sellerProfile.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SellerProfileController::sellerProfile
 * @see app/Http/Controllers/SellerProfileController.php:18
 * @route '/settings/seller-profile'
 */
sellerProfile.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: sellerProfile.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SellerProfileController::sellerProfile
 * @see app/Http/Controllers/SellerProfileController.php:18
 * @route '/settings/seller-profile'
 */
sellerProfile.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: sellerProfile.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SellerProfileController::sellerProfile
 * @see app/Http/Controllers/SellerProfileController.php:18
 * @route '/settings/seller-profile'
 */
    const sellerProfileForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: sellerProfile.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SellerProfileController::sellerProfile
 * @see app/Http/Controllers/SellerProfileController.php:18
 * @route '/settings/seller-profile'
 */
        sellerProfileForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: sellerProfile.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SellerProfileController::sellerProfile
 * @see app/Http/Controllers/SellerProfileController.php:18
 * @route '/settings/seller-profile'
 */
        sellerProfileForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: sellerProfile.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    sellerProfile.form = sellerProfileForm
const settings = {
    sellerProfile: Object.assign(sellerProfile, sellerProfile91b5b7),
sellerDocuments: Object.assign(sellerDocuments, sellerDocuments),
}

export default settings