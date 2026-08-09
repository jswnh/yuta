import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, LayoutList, Store } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import listings from '@/routes/listings';
import type { NavItem } from '@/types';

const sellerNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Listings',
        href: listings.index(),
        icon: LayoutList,
    },
];

const buyerNavItems: NavItem[] = [
    {
        title: 'Marketplace',
        href: '/',
        icon: Store,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Marketplace',
        href: '/',
        icon: Store,
    },
];

export function AppSidebar() {
    const { auth } = usePage().props as { auth?: { user?: any } };
    const isSeller = Boolean(auth?.user?.is_seller);
    const navItems = isSeller ? sellerNavItems : buyerNavItems;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={isSeller ? dashboard() : '/'} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
