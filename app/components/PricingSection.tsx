import { Check } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { supabaseAdmin } from '@/lib/supabase/server';

interface Product {
    slug: string;
    name: string;
    price: number;
    description: string;
    features: string[];
    featured: boolean;
    sub_price: string | null;
}

export default async function PricingSection() {
    const { data: products } = await supabaseAdmin
        .from('pm_products')
        .select('*')
        .eq('active', true)
        .order('price');

    const plans: Product[] = (products ?? []).map((p) => ({
        slug: p.slug,
        name: p.name,
        price: p.price,
        description: p.description ?? '',
        features: Array.isArray(p.features) ? p.features : [],
        featured: p.featured ?? false,
        sub_price: p.sub_price ?? null,
    }));

    const formatPrice = (price: number) =>
        `¥${Number(price).toLocaleString('zh-CN', { minimumFractionDigits: 0 })}`;

    return (
        <section id="pricing" className="border-t bg-muted/20 py-20 sm:py-28">
            <div className="mx-auto max-w-5xl px-6">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        选择适合你的方案
                    </h2>
                    <p className="mt-4 text-muted-foreground">
                        所有方案均包含核心 AI 支付能力，按需升级解锁更多额度与功能
                    </p>
                </div>

                <div className="mt-12 grid gap-8 lg:grid-cols-3">
                    {plans.map((plan) => (
                        <div
                            key={plan.slug}
                            className={`relative flex flex-col rounded-2xl border bg-background p-8 ${
                                plan.featured
                                    ? 'border-primary shadow-lg shadow-primary/5 ring-2 ring-primary'
                                    : 'border-border'
                            }`}
                        >
                            {plan.featured && (
                                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-medium text-primary-foreground">
                                    最受欢迎
                                </span>
                            )}

                            <div>
                                <h3 className="text-lg font-semibold">{plan.name}</h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {plan.description}
                                </p>
                            </div>

                            <div className="mt-6">
                                <span className="text-4xl font-bold">{formatPrice(plan.price)}</span>
                                <span className="text-muted-foreground">/月</span>
                                {plan.sub_price && (
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {plan.sub_price}
                                    </p>
                                )}
                            </div>

                            <Button
                                className="mt-6 w-full"
                                variant={plan.featured ? 'default' : 'outline'}
                                size="lg"
                                asChild
                            >
                                <Link href={`/order?plan=${plan.slug}`}>立即充值</Link>
                            </Button>

                            <ul className="mt-8 flex-1 space-y-3">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-3 text-sm">
                                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                        <span className="text-muted-foreground">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
