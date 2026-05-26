import { Check } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const plans = [
    {
        slug: 'plus',
        name: 'Plus 月卡',
        price: '¥189',
        period: '/月',
        description: '人工充值 · 不成功全额退款',
        features: ['人工充值服务', '充值失败全额退款', '基础客服支持', '标准到账速度'],
        popular: true,
    },
    {
        slug: 'pro5x',
        name: 'Pro 5X',
        price: '¥864',
        subPrice: '$120/月',
        period: '/月',
        description: '性价比之选',
        features: [
            '5 倍 Plus 额度',
            'Codex 编程支持',
            '优先客服响应',
            '极速到账通道',
            'Stripe 国际支付',
            '微信支付支持',
        ],
        popular: false,
    },
    {
        slug: 'pro20x',
        name: 'Pro 20X',
        price: '¥1620',
        subPrice: '$225/月',
        period: '/月',
        description: '顶级体验',
        features: [
            '20 倍 Plus 额度',
            'Codex 编程支持',
            '专属客户经理',
            '最高优先级到账',
            'Stripe 国际支付',
            '微信支付支持',
            'API 接口对接',
            '企业级 SLA 保障',
        ],
        popular: false,
    },
];

export default function PricingSection() {
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
                            key={plan.name}
                            className={`relative flex flex-col rounded-2xl border bg-background p-8 ${
                                plan.popular
                                    ? 'border-primary shadow-lg shadow-primary/5 ring-2 ring-primary'
                                    : 'border-border'
                            }`}
                        >
                            {plan.popular && (
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
                                <span className="text-4xl font-bold">{plan.price}</span>
                                <span className="text-muted-foreground">{plan.period}</span>
                                {plan.subPrice && (
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {plan.subPrice}
                                    </p>
                                )}
                            </div>

                            <Button
                                className="mt-6 w-full"
                                variant={plan.popular ? 'default' : 'outline'}
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
