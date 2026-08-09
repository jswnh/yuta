import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\XenditWebhookController::handleWebhook
 * @see app/Http/Controllers/XenditWebhookController.php:16
 * @route '/webhooks/xendit'
 */
export const handleWebhook = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: handleWebhook.url(options),
    method: 'post',
})

handleWebhook.definition = {
    methods: ["post"],
    url: '/webhooks/xendit',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\XenditWebhookController::handleWebhook
 * @see app/Http/Controllers/XenditWebhookController.php:16
 * @route '/webhooks/xendit'
 */
handleWebhook.url = (options?: RouteQueryOptions) => {
    return handleWebhook.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\XenditWebhookController::handleWebhook
 * @see app/Http/Controllers/XenditWebhookController.php:16
 * @route '/webhooks/xendit'
 */
handleWebhook.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: handleWebhook.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\XenditWebhookController::handleWebhook
 * @see app/Http/Controllers/XenditWebhookController.php:16
 * @route '/webhooks/xendit'
 */
    const handleWebhookForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: handleWebhook.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\XenditWebhookController::handleWebhook
 * @see app/Http/Controllers/XenditWebhookController.php:16
 * @route '/webhooks/xendit'
 */
        handleWebhookForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: handleWebhook.url(options),
            method: 'post',
        })
    
    handleWebhook.form = handleWebhookForm
const XenditWebhookController = { handleWebhook }

export default XenditWebhookController