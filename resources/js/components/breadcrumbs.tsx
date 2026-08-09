import { Link } from '@inertiajs/react';
import { Fragment } from 'react';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { toUrl } from '@/lib/utils';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function Breadcrumbs({
    breadcrumbs,
}: {
    breadcrumbs: BreadcrumbItemType[];
}) {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <>
            {breadcrumbs.length > 0 && (
                <Breadcrumb>
                    <BreadcrumbList>
                        {breadcrumbs.map((item, index) => {
                            const isLast = index === breadcrumbs.length - 1;
                            const isActive = isCurrentUrl(item.href);

                            return (
                                <Fragment key={index}>
                                    <BreadcrumbItem>
                                        {item.href ? (
                                            <BreadcrumbLink asChild>
                                                <Link
                                                    href={toUrl(item.href)}
                                                    className={
                                                        isActive
                                                            ? 'text-foreground font-normal cursor-pointer'
                                                            : 'text-muted-foreground hover:text-foreground transition-colors cursor-pointer'
                                                    }
                                                >
                                                    {item.title}
                                                </Link>
                                            </BreadcrumbLink>
                                        ) : (
                                            <BreadcrumbPage>
                                                {item.title}
                                            </BreadcrumbPage>
                                        )}
                                    </BreadcrumbItem>
                                    {!isLast && <BreadcrumbSeparator />}
                                </Fragment>
                            );
                        })}
                    </BreadcrumbList>
                </Breadcrumb>
            )}
        </>
    );
}
