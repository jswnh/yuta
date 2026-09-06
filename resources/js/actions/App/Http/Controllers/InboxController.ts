import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
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
/**
* @see \App\Http\Controllers\InboxController::storeMessage
 * @see app/Http/Controllers/InboxController.php:85
 * @route '/inbox/{conversation}/messages'
 */
export const storeMessage = (args: { conversation: string | { id: string } } | [conversation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeMessage.url(args, options),
    method: 'post',
})

storeMessage.definition = {
    methods: ["post"],
    url: '/inbox/{conversation}/messages',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InboxController::storeMessage
 * @see app/Http/Controllers/InboxController.php:85
 * @route '/inbox/{conversation}/messages'
 */
storeMessage.url = (args: { conversation: string | { id: string } } | [conversation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { conversation: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { conversation: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    conversation: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        conversation: typeof args.conversation === 'object'
                ? args.conversation.id
                : args.conversation,
                }

    return storeMessage.definition.url
            .replace('{conversation}', parsedArgs.conversation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InboxController::storeMessage
 * @see app/Http/Controllers/InboxController.php:85
 * @route '/inbox/{conversation}/messages'
 */
storeMessage.post = (args: { conversation: string | { id: string } } | [conversation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeMessage.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\InboxController::storeMessage
 * @see app/Http/Controllers/InboxController.php:85
 * @route '/inbox/{conversation}/messages'
 */
    const storeMessageForm = (args: { conversation: string | { id: string } } | [conversation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeMessage.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\InboxController::storeMessage
 * @see app/Http/Controllers/InboxController.php:85
 * @route '/inbox/{conversation}/messages'
 */
        storeMessageForm.post = (args: { conversation: string | { id: string } } | [conversation: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeMessage.url(args, options),
            method: 'post',
        })
    
    storeMessage.form = storeMessageForm
/**
* @see \App\Http\Controllers\InboxController::startInquiry
 * @see app/Http/Controllers/InboxController.php:136
 * @route '/inbox/inquiries'
 */
export const startInquiry = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: startInquiry.url(options),
    method: 'post',
})

startInquiry.definition = {
    methods: ["post"],
    url: '/inbox/inquiries',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InboxController::startInquiry
 * @see app/Http/Controllers/InboxController.php:136
 * @route '/inbox/inquiries'
 */
startInquiry.url = (options?: RouteQueryOptions) => {
    return startInquiry.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InboxController::startInquiry
 * @see app/Http/Controllers/InboxController.php:136
 * @route '/inbox/inquiries'
 */
startInquiry.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: startInquiry.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\InboxController::startInquiry
 * @see app/Http/Controllers/InboxController.php:136
 * @route '/inbox/inquiries'
 */
    const startInquiryForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: startInquiry.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\InboxController::startInquiry
 * @see app/Http/Controllers/InboxController.php:136
 * @route '/inbox/inquiries'
 */
        startInquiryForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: startInquiry.url(options),
            method: 'post',
        })
    
    startInquiry.form = startInquiryForm
const InboxController = { index, storeMessage, startInquiry }

export default InboxController