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
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
            {/* 移动端导航 */}
            <div className="lg:hidden flex items-center gap-3 mb-6">
                <MobileNav />
            </div>

            <div className="flex gap-6 lg:gap-10">
                {/* 左侧内容区 */}
                <div className="flex-1 min-w-0 max-w-3xl">
                    <DocBreadcrumb currentSlug={slug} />

                    <article className="prose prose-slate max-w-none">{children}</article>
                </div>

                {/* 右侧导航 */}
                <div className="hidden lg:flex flex-col gap-6 w-64 shrink-0">
                    <div className="sticky top-24">
                        <DocSidebar />
                        {showToc && (
                            <>
                                <Separator className="my-5" />
                                <DocToc />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
