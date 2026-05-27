import { ReactNode } from 'react';
import { DocSidebar } from './DocSidebar';
import { DocToc } from './DocToc';
import { DocBreadcrumb } from './DocBreadcrumb';
import { MobileNav } from './MobileNav';
import { Separator } from '@/components/ui/separator';

interface DocLayoutProps {
    children: ReactNode;
    slug: string;
    showToc?: boolean;
}

export function DocLayout({ children, slug, showToc = true }: DocLayoutProps) {
    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            {/* 移动端导航和面包屑 */}
            <div className="lg:hidden flex items-center gap-3 mb-4">
                <MobileNav />
            </div>

            <div className="flex gap-8 lg:gap-12">
                {/* 左侧内容区 */}
                <div className="flex-1 min-w-0">
                    <DocBreadcrumb currentSlug={slug} />

                    <article className="prose prose-slate max-w-none">{children}</article>
                </div>

                {/* 右侧导航 */}
                <div className="hidden lg:flex flex-col gap-6 w-72 shrink-0">
                    <div className="sticky top-24">
                        <DocSidebar />
                        <Separator className="my-6" />
                        {showToc && <DocToc />}
                    </div>
                </div>
            </div>
        </div>
    );
}
