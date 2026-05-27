import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { docNavigation } from '@/lib/docs/navigation';

interface DocBreadcrumbProps {
    currentSlug: string;
}

export function DocBreadcrumb({ currentSlug }: DocBreadcrumbProps) {
    // 找到当前页面在导航中的位置
    let currentItem = null;
    let currentGroup = null;

    for (const group of docNavigation) {
        for (const item of group.items) {
            if (item.slug === currentSlug) {
                currentItem = item;
                currentGroup = group;
                break;
            }
        }
        if (currentItem) break;
    }

    if (!currentItem || !currentGroup) return null;

    return (
        <nav className="flex items-center flex-wrap gap-x-1.5 gap-y-1 text-xs text-muted-foreground/60 mb-8">
            <Link
                href="/"
                className="hover:text-muted-foreground transition-colors duration-200 flex items-center gap-1 rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
                <Home className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">首页</span>
            </Link>
            <ChevronRight className="h-3 w-3 opacity-40" />
            <Link href="/docs" className="hover:text-muted-foreground transition-colors duration-200 rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                文档
            </Link>
            <ChevronRight className="h-3 w-3 opacity-40" />
            <span className="text-muted-foreground/80">{currentGroup.title}</span>
            {currentItem.title !== currentGroup.title && (
                <>
                    <ChevronRight className="h-3 w-3 opacity-40" />
                    <span className="text-muted-foreground/80">{currentItem.title}</span>
                </>
            )}
        </nav>
    );
}
