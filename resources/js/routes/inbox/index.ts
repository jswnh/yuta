import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import messages from './messages'
import inquiries from './inquiries'
/**
* @see \App\Http\Controllers\InboxController::index
 * @see app/Http/Controllers/InboxController.php:22
 * @route '/inbox'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/inbox',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InboxController::index
 * @see app/Http/Controllers/InboxController.php:22
 * @route '/inbox'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InboxController::index
 * @see app/Http/Controllers/InboxController.php:22
 * @route '/inbox'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InboxController::index
 * @see app/Http/Controllers/InboxController.php:22
 * @route '/inbox'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InboxController::index
 * @see app/Http/Controllers/InboxController.php:22
 * @route '/inbox'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InboxController::index
 * @see app/Http/Controllers/InboxController.php:22
 * @route '/inbox'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InboxController::index
 * @see app/Http/Controllers/InboxController.php:22
 * @route '/inbox'
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
const inbox = {
    index: Object.assign(index, index),
messages: Object.assign(messages, messages),
inquiries: Object.assign(inquiries, inquiries),
}

export default inbox