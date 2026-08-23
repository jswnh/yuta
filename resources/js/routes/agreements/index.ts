import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\AgreementController::index
 * @see app/Http/Controllers/AgreementController.php:21
 * @route '/agreements'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/agreements',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AgreementController::index
 * @see app/Http/Controllers/AgreementController.php:21
 * @route '/agreements'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AgreementController::index
 * @see app/Http/Controllers/AgreementController.php:21
 * @route '/agreements'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AgreementController::index
 * @see app/Http/Controllers/AgreementController.php:21
 * @route '/agreements'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AgreementController::index
 * @see app/Http/Controllers/AgreementController.php:21
 * @route '/agreements'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AgreementController::index
 * @see app/Http/Controllers/AgreementController.php:21
 * @route '/agreements'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AgreementController::index
 * @see app/Http/Controllers/AgreementController.php:21
 * @route '/agreements'
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
* @see \App\Http\Controllers\AgreementController::store
 * @see app/Http/Controllers/AgreementController.php:41
 * @route '/agreements'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/agreements',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AgreementController::store
 * @see app/Http/Controllers/AgreementController.php:41
 * @route '/agreements'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AgreementController::store
 * @see app/Http/Controllers/AgreementController.php:41
 * @route '/agreements'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AgreementController::store
 * @see app/Http/Controllers/AgreementController.php:41
 * @route '/agreements'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AgreementController::store
 * @see app/Http/Controllers/AgreementController.php:41
 * @route '/agreements'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\AgreementController::show
 * @see app/Http/Controllers/AgreementController.php:125
 * @route '/agreements/{agreement}'
 */
export const show = (args: { agreement: string | { id: string } } | [agreement: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/agreements/{agreement}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AgreementController::show
 * @see app/Http/Controllers/AgreementController.php:125
 * @route '/agreements/{agreement}'
 */
show.url = (args: { agreement: string | { id: string } } | [agreement: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { agreement: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { agreement: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    agreement: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        agreement: typeof args.agreement === 'object'
                ? args.agreement.id
                : args.agreement,
                }

    return show.definition.url
            .replace('{agreement}', parsedArgs.agreement.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AgreementController::show
 * @see app/Http/Controllers/AgreementController.php:125
 * @route '/agreements/{agreement}'
 */
show.get = (args: { agreement: string | { id: string } } | [agreement: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AgreementController::show
 * @see app/Http/Controllers/AgreementController.php:125
 * @route '/agreements/{agreement}'
 */
show.head = (args: { agreement: string | { id: string } } | [agreement: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AgreementController::show
 * @see app/Http/Controllers/AgreementController.php:125
 * @route '/agreements/{agreement}'
 */
    const showForm = (args: { agreement: string | { id: string } } | [agreement: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AgreementController::show
 * @see app/Http/Controllers/AgreementController.php:125
 * @route '/agreements/{agreement}'
 */
        showForm.get = (args: { agreement: string | { id: string } } | [agreement: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AgreementController::show
 * @see app/Http/Controllers/AgreementController.php:125
 * @route '/agreements/{agreement}'
 */
        showForm.head = (args: { agreement: string | { id: string } } | [agreement: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\AgreementController::accept
 * @see app/Http/Controllers/AgreementController.php:155
 * @route '/agreements/{agreement}/accept'
 */
export const accept = (args: { agreement: string | { id: string } } | [agreement: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: accept.url(args, options),
    method: 'post',
})

accept.definition = {
    methods: ["post"],
    url: '/agreements/{agreement}/accept',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AgreementController::accept
 * @see app/Http/Controllers/AgreementController.php:155
 * @route '/agreements/{agreement}/accept'
 */
accept.url = (args: { agreement: string | { id: string } } | [agreement: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { agreement: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { agreement: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    agreement: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        agreement: typeof args.agreement === 'object'
                ? args.agreement.id
                : args.agreement,
                }

    return accept.definition.url
            .replace('{agreement}', parsedArgs.agreement.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AgreementController::accept
 * @see app/Http/Controllers/AgreementController.php:155
 * @route '/agreements/{agreement}/accept'
 */
accept.post = (args: { agreement: string | { id: string } } | [agreement: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: accept.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AgreementController::accept
 * @see app/Http/Controllers/AgreementController.php:155
 * @route '/agreements/{agreement}/accept'
 */
    const acceptForm = (args: { agreement: string | { id: string } } | [agreement: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: accept.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AgreementController::accept
 * @see app/Http/Controllers/AgreementController.php:155
 * @route '/agreements/{agreement}/accept'
 */
        acceptForm.post = (args: { agreement: string | { id: string } } | [agreement: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: accept.url(args, options),
            method: 'post',
        })
    
    accept.form = acceptForm
/**
* @see \App\Http\Controllers\AgreementController::reject
 * @see app/Http/Controllers/AgreementController.php:197
 * @route '/agreements/{agreement}/reject'
 */
export const reject = (args: { agreement: string | { id: string } } | [agreement: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

reject.definition = {
    methods: ["post"],
    url: '/agreements/{agreement}/reject',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AgreementController::reject
 * @see app/Http/Controllers/AgreementController.php:197
 * @route '/agreements/{agreement}/reject'
 */
reject.url = (args: { agreement: string | { id: string } } | [agreement: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { agreement: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { agreement: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    agreement: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        agreement: typeof args.agreement === 'object'
                ? args.agreement.id
                : args.agreement,
                }

    return reject.definition.url
            .replace('{agreement}', parsedArgs.agreement.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AgreementController::reject
 * @see app/Http/Controllers/AgreementController.php:197
 * @route '/agreements/{agreement}/reject'
 */
reject.post = (args: { agreement: string | { id: string } } | [agreement: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AgreementController::reject
 * @see app/Http/Controllers/AgreementController.php:197
 * @route '/agreements/{agreement}/reject'
 */
    const rejectForm = (args: { agreement: string | { id: string } } | [agreement: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: reject.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AgreementController::reject
 * @see app/Http/Controllers/AgreementController.php:197
 * @route '/agreements/{agreement}/reject'
 */
        rejectForm.post = (args: { agreement: string | { id: string } } | [agreement: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: reject.url(args, options),
            method: 'post',
        })
    
    reject.form = rejectForm
/**
* @see \App\Http\Controllers\AgreementController::cancel
 * @see app/Http/Controllers/AgreementController.php:237
 * @route '/agreements/{agreement}/cancel'
 */
export const cancel = (args: { agreement: string | { id: string } } | [agreement: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(args, options),
    method: 'post',
})

cancel.definition = {
    methods: ["post"],
    url: '/agreements/{agreement}/cancel',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AgreementController::cancel
 * @see app/Http/Controllers/AgreementController.php:237
 * @route '/agreements/{agreement}/cancel'
 */
cancel.url = (args: { agreement: string | { id: string } } | [agreement: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { agreement: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { agreement: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    agreement: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        agreement: typeof args.agreement === 'object'
                ? args.agreement.id
                : args.agreement,
                }

    return cancel.definition.url
            .replace('{agreement}', parsedArgs.agreement.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AgreementController::cancel
 * @see app/Http/Controllers/AgreementController.php:237
 * @route '/agreements/{agreement}/cancel'
 */
cancel.post = (args: { agreement: string | { id: string } } | [agreement: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AgreementController::cancel
 * @see app/Http/Controllers/AgreementController.php:237
 * @route '/agreements/{agreement}/cancel'
 */
    const cancelForm = (args: { agreement: string | { id: string } } | [agreement: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: cancel.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AgreementController::cancel
 * @see app/Http/Controllers/AgreementController.php:237
 * @route '/agreements/{agreement}/cancel'
 */
        cancelForm.post = (args: { agreement: string | { id: string } } | [agreement: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: cancel.url(args, options),
            method: 'post',
        })
    
    cancel.form = cancelForm
/**
* @see \App\Http\Controllers\AgreementController::complete
 * @see app/Http/Controllers/AgreementController.php:265
 * @route '/agreements/{agreement}/complete'
 */
export const complete = (args: { agreement: string | { id: string } } | [agreement: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: complete.url(args, options),
    method: 'post',
})

complete.definition = {
    methods: ["post"],
    url: '/agreements/{agreement}/complete',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AgreementController::complete
 * @see app/Http/Controllers/AgreementController.php:265
 * @route '/agreements/{agreement}/complete'
 */
complete.url = (args: { agreement: string | { id: string } } | [agreement: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { agreement: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { agreement: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    agreement: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        agreement: typeof args.agreement === 'object'
                ? args.agreement.id
                : args.agreement,
                }

    return complete.definition.url
            .replace('{agreement}', parsedArgs.agreement.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AgreementController::complete
 * @see app/Http/Controllers/AgreementController.php:265
 * @route '/agreements/{agreement}/complete'
 */
complete.post = (args: { agreement: string | { id: string } } | [agreement: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: complete.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AgreementController::complete
 * @see app/Http/Controllers/AgreementController.php:265
 * @route '/agreements/{agreement}/complete'
 */
    const completeForm = (args: { agreement: string | { id: string } } | [agreement: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: complete.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AgreementController::complete
 * @see app/Http/Controllers/AgreementController.php:265
 * @route '/agreements/{agreement}/complete'
 */
        completeForm.post = (args: { agreement: string | { id: string } } | [agreement: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: complete.url(args, options),
            method: 'post',
        })
    
    complete.form = completeForm
const agreements = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
show: Object.assign(show, show),
accept: Object.assign(accept, accept),
reject: Object.assign(reject, reject),
cancel: Object.assign(cancel, cancel),
complete: Object.assign(complete, complete),
}

export default agreements