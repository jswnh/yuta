import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\XenditWebhookController::xendit
 * @see app/Http/Controllers/XenditWebhookController.php:16
 * @route '/webhooks/xendit'
 */
export const xendit = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: xendit.url(options),
    method: 'post',
})

xendit.definition = {
    methods: ["post"],
    url: '/webhooks/xendit',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\XenditWebhookController::xendit
 * @see app/Http/Controllers/XenditWebhookController.php:16
 * @route '/webhooks/xendit'
 */
xendit.url = (options?: RouteQueryOptions) => {
    return xendit.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\XenditWebhookController::xendit
 * @see app/Http/Controllers/XenditWebhookController.php:16
 * @route '/webhooks/xendit'
 */
xendit.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: xendit.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\XenditWebhookController::xendit
 * @see app/Http/Controllers/XenditWebhookController.php:16
 * @route '/webhooks/xendit'
 */
    const xenditForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: xendit.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\XenditWebhookController::xendit
 * @see app/Http/Controllers/XenditWebhookController.php:16
 * @route '/webhooks/xendit'
 */
        xenditForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: xendit.url(options),
            method: 'post',
        })
    
    xendit.form = xenditForm
const webhooks = {
    xendit: Object.assign(xendit, xendit),
}

export default webhooks