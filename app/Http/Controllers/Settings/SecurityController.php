<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\PasswordUpdateRequest;
use App\Http\Requests\Settings\TwoFactorAuthenticationRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class SecurityController extends Controller
{
    /**
     * Show the user's security settings page.
     */
    public function edit(TwoFactorAuthenticationRequest $request): Response
    {
        $props = [
            'passwordRules' => Password::defaults()->toPasswordRulesString(),
            'hasPassword' => ! empty($request->user()->password),
        ];

        return Inertia::render('settings/security', $props);
    }

    /**
     * Update the user's password.
     */
    public function update(PasswordUpdateRequest $request): RedirectResponse
    {
        $hadPassword = ! empty($request->user()->password);

        $request->user()->update([
            'password' => $request->password,
        ]);

        $message = $hadPassword
            ? __('Password updated successfully.')
            : __('Password created successfully! You can now log in using either Google or your email & password.');

        Inertia::flash('toast', ['type' => 'success', 'message' => $message]);

        return back();
    }
}
