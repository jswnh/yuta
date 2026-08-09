import { Head } from '@inertiajs/react';
import AuthLayoutTemplate from '@/layouts/auth/auth-simple-layout';
import type { AuthLayoutProps } from '@/types';

export default function AuthLayout({
    title = '',
    description = '',
    head,
    children,
}: AuthLayoutProps) {
    return (
        <AuthLayoutTemplate title={title} description={description}>
            {head && (
                typeof head === 'string' ? (
                    <Head title={head} />
                ) : (
                    <Head title={head.title} {...head} />
                )
            )}
            {children}
        </AuthLayoutTemplate>
    );
}
