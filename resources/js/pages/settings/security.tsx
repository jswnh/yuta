import { Form, Head } from '@inertiajs/react';
import { useRef } from 'react';
import SecurityController from '@/actions/App/Http/Controllers/Settings/SecurityController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { edit } from '@/routes/security';
import { ShieldCheck } from 'lucide-react';

type Props = {
    passwordRules: string;
    hasPassword?: boolean;
};

export default function Security({ passwordRules, hasPassword = true }: Props) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    return (
        <>
            <Head title="Security settings" />

            <h1 className="sr-only">Security settings</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title={hasPassword ? 'Update password' : 'Create account password'}
                    description={
                        hasPassword
                            ? 'Ensure your account is using a long, random password to stay secure'
                            : 'Set a password for your account so you can log in using either Google or your email & password'
                    }
                />

                {!hasPassword && (
                    <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/50 dark:bg-emerald-950/30 dark:border-emerald-900/50 p-4 text-sm text-emerald-900 dark:text-emerald-200 flex items-start gap-3 shadow-xs">
                        <div className="rounded-full bg-emerald-500/20 p-1 text-emerald-600 dark:text-emerald-400 shrink-0">
                            <ShieldCheck className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="font-semibold text-emerald-900 dark:text-emerald-100">
                                Google Authentication Active
                            </p>
                            <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">
                                You registered using Google. Creating a password will enable you to sign in with both Google and your email & password.
                            </p>
                        </div>
                    </div>
                )}

                <Form
                    {...SecurityController.update.form()}
                    options={{
                        preserveScroll: true,
                    }}
                    resetOnError={[
                        'password',
                        'password_confirmation',
                        'current_password',
                    ]}
                    resetOnSuccess
                    onError={(errors) => {
                        if (errors.password) {
                            passwordInput.current?.focus();
                        }

                        if (errors.current_password) {
                            currentPasswordInput.current?.focus();
                        }
                    }}
                    className="space-y-6"
                >
                    {({ errors, processing }) => (
                        <>
                            {hasPassword && (
                                <div className="grid gap-2">
                                    <Label htmlFor="current_password">
                                        Current password
                                    </Label>

                                    <PasswordInput
                                        id="current_password"
                                        ref={currentPasswordInput}
                                        name="current_password"
                                        className="mt-1 block w-full"
                                        autoComplete="current-password"
                                        placeholder="Current password"
                                    />

                                    <InputError message={errors.current_password} />
                                </div>
                            )}

                            <div className="grid gap-2">
                                <Label htmlFor="password">
                                    {hasPassword ? 'New password' : 'Create password'}
                                </Label>

                                <PasswordInput
                                    id="password"
                                    ref={passwordInput}
                                    name="password"
                                    className="mt-1 block w-full"
                                    autoComplete="new-password"
                                    placeholder={hasPassword ? 'New password' : 'Create new password'}
                                    passwordrules={passwordRules}
                                />

                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">
                                    Confirm password
                                </Label>

                                <PasswordInput
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    className="mt-1 block w-full"
                                    autoComplete="new-password"
                                    placeholder="Confirm password"
                                    passwordrules={passwordRules}
                                />

                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            <div className="flex items-center gap-4">
                                <Button
                                    disabled={processing}
                                    data-test="update-password-button"
                                >
                                    {hasPassword ? 'Save' : 'Create password'}
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

Security.layout = {
    breadcrumbs: [
        {
            title: 'Security settings',
            href: edit(),
        },
    ],
};
