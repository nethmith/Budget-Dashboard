'use client';

import { Menu, Moon, Sun, LayoutDashboard, Wallet, Settings } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from '@/components/ui/sheet';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function Header() {
    const { setTheme, theme } = useTheme();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const links = [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard },
        { name: 'Transactions', href: '/transactions', icon: Wallet },
        { name: 'Settings', href: '/settings', icon: Settings },
    ];

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center gap-4">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open Menu">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64">
                        <SheetHeader>
                            <SheetTitle className="text-left font-bold text-primary">BudgetFlow</SheetTitle>
                        </SheetHeader>
                        <nav className="flex flex-col space-y-2 mt-8">
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
                    </SheetContent>
                </Sheet>
                <span className="text-lg font-semibold md:hidden">BudgetFlow</span>
            </div>

            <div className="flex flex-1 items-center justify-end space-x-4">
                <div className="flex items-center gap-2">
                    {mounted && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            aria-label="Toggle Theme"
                        >
                            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
}
