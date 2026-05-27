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
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
            <Link
                href="/"
                className="hover:text-foreground/70 transition-colors flex items-center gap-1"
            >
                <Home className="h-4 w-4" />
                首页
            </Link>
            <ChevronRight className="h-4 w-4 opacity-50" />
            <Link href="/docs" className="hover:text-foreground/70 transition-colors">
                文档
            </Link>
            <ChevronRight className="h-4 w-4 opacity-50" />
            <span className="text-muted-foreground/80">{currentGroup.title}</span>
            {currentItem.title !== currentGroup.title && (
                <>
                    <ChevronRight className="h-4 w-4 opacity-50" />
                    <span className="text-muted-foreground/80">{currentItem.title}</span>
                </>
            )}
        </nav>
    );
}
