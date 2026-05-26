import { ShieldCheck, Zap, Wallet } from 'lucide-react';

const highlights = [
    {
        icon: ShieldCheck,
        title: '售后无忧',
        description: '充值失败 100% 当天退款',
    },
    {
        icon: Zap,
        title: '极速到账',
        description: '平均 2 分钟内自动完成',
    },
    {
        icon: Wallet,
        title: '支付便捷',
        description: '支持支付宝 / 微信支付',
    },
];

export default function Highlights() {
    return (
        <section className="border-t bg-muted/30 py-16 sm:py-20">
            <div className="mx-auto max-w-5xl px-6">
                <div className="grid gap-8 sm:grid-cols-3">
                    {highlights.map((item) => (
                        <div key={item.title} className="flex flex-col items-center text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <item.icon className="h-6 w-6" />
                            </div>
                            <h3 className="mt-4 text-base font-semibold">{item.title}</h3>
                            <p className="mt-1.5 text-sm text-muted-foreground">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
