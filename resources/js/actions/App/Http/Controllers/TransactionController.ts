import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\TransactionController::index
 * @see app/Http/Controllers/TransactionController.php:22
 * @route '/transactions'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/transactions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TransactionController::index
 * @see app/Http/Controllers/TransactionController.php:22
 * @route '/transactions'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TransactionController::index
 * @see app/Http/Controllers/TransactionController.php:22
 * @route '/transactions'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TransactionController::index
 * @see app/Http/Controllers/TransactionController.php:22
 * @route '/transactions'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TransactionController::index
 * @see app/Http/Controllers/TransactionController.php:22
 * @route '/transactions'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TransactionController::index
 * @see app/Http/Controllers/TransactionController.php:22
 * @route '/transactions'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TransactionController::index
 * @see app/Http/Controllers/TransactionController.php:22
 * @route '/transactions'
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
* @see \App\Http\Controllers\TransactionController::store
 * @see app/Http/Controllers/TransactionController.php:42
 * @route '/transactions'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/transactions',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TransactionController::store
 * @see app/Http/Controllers/TransactionController.php:42
 * @route '/transactions'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TransactionController::store
 * @see app/Http/Controllers/TransactionController.php:42
 * @route '/transactions'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TransactionController::store
 * @see app/Http/Controllers/TransactionController.php:42
 * @route '/transactions'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TransactionController::store
 * @see app/Http/Controllers/TransactionController.php:42
 * @route '/transactions'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\TransactionController::show
 * @see app/Http/Controllers/TransactionController.php:118
 * @route '/transactions/{transaction}'
 */
export const show = (args: { transaction: string | { id: string } } | [transaction: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/transactions/{transaction}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TransactionController::show
 * @see app/Http/Controllers/TransactionController.php:118
 * @route '/transactions/{transaction}'
 */
show.url = (args: { transaction: string | { id: string } } | [transaction: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transaction: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { transaction: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    transaction: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        transaction: typeof args.transaction === 'object'
                ? args.transaction.id
                : args.transaction,
                }

    return show.definition.url
            .replace('{transaction}', parsedArgs.transaction.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TransactionController::show
 * @see app/Http/Controllers/TransactionController.php:118
 * @route '/transactions/{transaction}'
 */
show.get = (args: { transaction: string | { id: string } } | [transaction: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TransactionController::show
 * @see app/Http/Controllers/TransactionController.php:118
 * @route '/transactions/{transaction}'
 */
show.head = (args: { transaction: string | { id: string } } | [transaction: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TransactionController::show
 * @see app/Http/Controllers/TransactionController.php:118
 * @route '/transactions/{transaction}'
 */
    const showForm = (args: { transaction: string | { id: string } } | [transaction: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TransactionController::show
 * @see app/Http/Controllers/TransactionController.php:118
 * @route '/transactions/{transaction}'
 */
        showForm.get = (args: { transaction: string | { id: string } } | [transaction: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TransactionController::show
 * @see app/Http/Controllers/TransactionController.php:118
 * @route '/transactions/{transaction}'
 */
        showForm.head = (args: { transaction: string | { id: string } } | [transaction: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\TransactionController::recordManualPayment
 * @see app/Http/Controllers/TransactionController.php:173
 * @route '/transactions/{transaction}/manual-confirm'
 */
export const recordManualPayment = (args: { transaction: string | { id: string } } | [transaction: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: recordManualPayment.url(args, options),
    method: 'post',
})

recordManualPayment.definition = {
    methods: ["post"],
    url: '/transactions/{transaction}/manual-confirm',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TransactionController::recordManualPayment
 * @see app/Http/Controllers/TransactionController.php:173
 * @route '/transactions/{transaction}/manual-confirm'
 */
recordManualPayment.url = (args: { transaction: string | { id: string } } | [transaction: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transaction: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { transaction: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    transaction: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        transaction: typeof args.transaction === 'object'
                ? args.transaction.id
                : args.transaction,
                }

    return recordManualPayment.definition.url
            .replace('{transaction}', parsedArgs.transaction.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TransactionController::recordManualPayment
 * @see app/Http/Controllers/TransactionController.php:173
 * @route '/transactions/{transaction}/manual-confirm'
 */
recordManualPayment.post = (args: { transaction: string | { id: string } } | [transaction: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: recordManualPayment.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TransactionController::recordManualPayment
 * @see app/Http/Controllers/TransactionController.php:173
 * @route '/transactions/{transaction}/manual-confirm'
 */
    const recordManualPaymentForm = (args: { transaction: string | { id: string } } | [transaction: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: recordManualPayment.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TransactionController::recordManualPayment
 * @see app/Http/Controllers/TransactionController.php:173
 * @route '/transactions/{transaction}/manual-confirm'
 */
        recordManualPaymentForm.post = (args: { transaction: string | { id: string } } | [transaction: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: recordManualPayment.url(args, options),
            method: 'post',
        })
    
    recordManualPayment.form = recordManualPaymentForm
const TransactionController = { index, store, show, recordManualPayment }

export default TransactionController