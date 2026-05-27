'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { docNavigation, DocNavGroup } from '@/lib/docs/navigation';

export function DocSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:block w-72 shrink-0">
      <div className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto pr-4">
        <nav className="flex flex-col gap-6">
          {/* 全局文档导航 */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              文档导航
            </h3>
            <div className="flex flex-col gap-1">
              {docNavigation.map((group) => (
                <NavGroup
                  key={group.title}
                  group={group}
                  currentPath={pathname}
                />
              ))}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
}

function NavGroup({
  group,
  currentPath,
}: {
  group: DocNavGroup;
  currentPath: string;
}) {
  const isActive = group.items.some((item) => item.href === currentPath);
  const [isOpen, setIsOpen] = useState(isActive);

  return (
    <div className="flex flex-col">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 py-1.5 text-sm font-medium text-foreground hover:text-primary transition-colors"
      >
        {isOpen ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
        {group.title}
      </button>
      {isOpen && (
        <div className="flex flex-col ml-5 border-l border-border">
          {group.items.map((item) => (
            <Link
              key={item.slug}
              href={item.href}
              className={`py-1.5 pl-3 text-sm transition-colors ${
                currentPath === item.href
                  ? 'text-primary font-medium border-l-2 border-primary -ml-[2px]'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {item.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
