'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { docNavigation, DocNavGroup } from '@/lib/docs/navigation';

export function DocSidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto pr-4">
                <nav className="flex flex-col gap-6">
                    <div>
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                            文档导航
                        </h3>
                        <div className="flex flex-col">
                            {docNavigation.map((group) => (
                                <NavGroup key={group.title} group={group} currentPath={pathname} />
                            ))}
                        </div>
                    </div>
                </nav>
            </div>
        </aside>
    );
}

function NavGroup({ group, currentPath }: { group: DocNavGroup; currentPath: string }) {
    const isActive = group.items.some((item) => item.href === currentPath);
    const [isOpen, setIsOpen] = useState(isActive);

    return (
        <div className="flex flex-col">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="group flex items-center gap-1 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded-sm"
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
                            className={`py-1.5 pl-3 text-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ${
                                currentPath === item.href
                                    ? 'text-primary font-medium border-l-2 border-primary -ml-0.5'
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
