'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Wallet, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
    const pathname = usePathname();

    const links = [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard },
        { name: 'Transactions', href: '/transactions', icon: Wallet },
        { name: 'Settings', href: '/settings', icon: Settings },
    ];

    return (
        <aside className="hidden h-screen w-64 flex-col border-r bg-card px-4 py-6 md:flex">
            <div className="mb-8 flex items-center px-2">
                <span className="text-xl font-bold tracking-tight text-primary">BudgetFlow</span>
            </div>
            <nav className="flex flex-1 flex-col space-y-2">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                                isActive
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            )}
                        >
                            <Icon className="h-4 w-4" />
                            {link.name}
                        </Link>
                    );
                })}
            </nav>
            {/* Footer / User placeholder */}
            <div className="mt-auto border-t pt-4">
                <div className="flex items-center gap-3 px-2">
                    <div className="h-8 w-8 rounded-full bg-muted/50" />
                    <div className="flex flex-col">
                        <span className="text-sm font-medium">User</span>
                        <span className="text-xs text-muted-foreground">Free Plan</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
