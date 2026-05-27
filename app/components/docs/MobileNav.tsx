'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, ChevronRight } from 'lucide-react';
import { docNavigation, DocNavGroup } from '@/lib/docs/navigation';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function MobileNav() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <button className="lg:hidden p-2 -ml-2 text-foreground hover:bg-muted rounded-md transition-colors">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">打开导航菜单</span>
                </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
                <div className="flex flex-col h-full">
                    <div className="flex items-center p-4 border-b border-border">
                        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                            文档导航
                        </span>
                    </div>
                    <nav className="flex-1 overflow-y-auto p-4">
                        <div className="flex flex-col">
                            {docNavigation.map((group) => (
                                <MobileNavGroup
                                    key={group.title}
                                    group={group}
                                    currentPath={pathname}
                                    onNavigate={() => setOpen(false)}
                                />
                            ))}
                        </div>
                    </nav>
                </div>
            </SheetContent>
        </Sheet>
    );
}

function MobileNavGroup({
    group,
    currentPath,
    onNavigate,
}: {
    group: DocNavGroup;
    currentPath: string;
    onNavigate: () => void;
}) {
    const isActive = group.items.some((item) => item.href === currentPath);
    const [isOpen, setIsOpen] = useState(isActive);

    return (
        <div className="flex flex-col">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="group flex items-center gap-1 py-2.5 text-sm font-medium text-foreground hover:text-primary transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                aria-expanded={isOpen}
            >
                <ChevronRight
                    className={`h-4 w-4 transition-transform duration-200 ease-out ${
                        isOpen ? 'rotate-90' : ''
                    }`}
                />
                {group.title}
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-out ${
                    isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                <div className="flex flex-col ml-5 border-l border-border/60">
                    {group.items.map((item) => (
                        <Link
                            key={item.slug}
                            href={item.href}
                            onClick={onNavigate}
                            className={`py-2 pl-3 text-sm transition-all duration-200 rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                                currentPath === item.href
                                    ? 'text-primary font-medium border-l-2 border-primary -ml-[2px]'
                                    : 'text-muted-foreground hover:text-foreground hover:pl-4'
                            }`}
                        >
                            {item.title}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
