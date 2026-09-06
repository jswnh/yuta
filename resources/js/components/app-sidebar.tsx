import { Link, usePage } from '@inertiajs/react';
import {
    Bell,
    CreditCard,
    FileSignature,
    Heart,
    Inbox,
    LayoutGrid,
    LayoutList,
    Receipt,
    Store,
} from 'lucide-react';
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

export function AppSidebar() {
    const { auth, unreadNotificationsCount, unreadMessagesCount } = usePage().props as {
        auth?: { user?: any };
        unreadNotificationsCount?: number;
        unreadMessagesCount?: number;
    };
    const isSeller = Boolean(auth?.user?.is_seller);

    const navItems: NavItem[] = [
        ...(isSeller
            ? [
                  {
                      title: 'Seller Dashboard',
                      href: dashboard(),
                      icon: LayoutGrid,
                  },
                  {
                      title: 'My Listings',
                      href: listings.index(),
                      icon: LayoutList,
                  },
              ]
            : []),
        {
            title: 'Marketplace',
            href: '/marketplace',
            icon: Store,
        },
        {
            title: 'Agreements',
            href: '/agreements',
            icon: FileSignature,
        },
        {
            title: 'Transactions',
            href: '/transactions',
            icon: Receipt,
        },
        {
            title: 'Saved Listings',
            href: '/favorites',
            icon: Heart,
        },
        {
            title: unreadMessagesCount ? `Inbox (${unreadMessagesCount})` : 'Inbox',
            href: '/inbox',
            icon: Inbox,
        },
        {
            title: unreadNotificationsCount ? `Notifications (${unreadNotificationsCount})` : 'Notifications',
            href: '/notifications',
            icon: Bell,
        },
    ];

    const footerNavItems: NavItem[] = [
        {
            title: 'Billing & Plans',
            href: '/billing',
            icon: CreditCard,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {navItems.length > 0 && <NavMain items={navItems} />}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
