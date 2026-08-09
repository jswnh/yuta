import type { ReactNode } from 'react';
import type { BreadcrumbItem } from '@/types/navigation';

export type HeadProps = {
    title?: string;
    [key: string]: any;
};

export type AppLayoutProps = {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    head?: HeadProps | string;
};

export type AppVariant = 'header' | 'sidebar';

export type FlashToast = {
    type: 'success' | 'info' | 'warning' | 'error';
    message: string;
};

export type AuthLayoutProps = {
    children?: ReactNode;
    name?: string;
    title?: string;
    description?: string;
    head?: HeadProps | string;
};
