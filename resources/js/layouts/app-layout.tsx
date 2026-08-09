import { Head } from '@inertiajs/react';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import type { AppLayoutProps } from '@/types';

export default function AppLayout({
    breadcrumbs = [],
    head,
    children,
}: AppLayoutProps) {
    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs}>
            {head && (
                typeof head === 'string' ? (
                    <Head title={head} />
                ) : (
                    <Head title={head.title} {...head} />
                )
            )}
            {children}
        </AppLayoutTemplate>
    );
}
