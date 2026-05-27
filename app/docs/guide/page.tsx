import { Metadata } from 'next';
import Link from 'next/link';
import { DocLayout } from '@/app/components/docs/DocLayout';
import { docNavigation } from '@/lib/docs/navigation';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export const metadata: Metadata = {
    title: '使用指南',
    description: 'ChatGPT Plus / Pro 充值详细使用指南',
};

export default function GuidePage() {
    const guideGroup = docNavigation.find((g) => g.title === '使用指南');
    const guideItems = guideGroup?.items.filter((item) => item.slug !== 'guide') || [];

    return (
        <DocLayout slug="guide" showToc={false}>
            <h1 className="text-3xl font-bold tracking-tight mb-4">使用指南</h1>
            <p className="text-lg text-muted-foreground mb-8">
                了解如何获取 Token、充值 Plus 和 Pro 的详细步骤
            </p>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {guideItems.map((item) => (
                    <Link key={item.slug} href={item.href}>
                        <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
                            <CardHeader>
                                <CardTitle className="text-lg">{item.title}</CardTitle>
                                <CardDescription>点击查看详细教程</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>
                ))}
            </div>
        </DocLayout>
    );
}
