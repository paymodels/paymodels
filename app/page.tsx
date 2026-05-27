import type { Metadata } from 'next';
import ScrollLink from './components/ScrollLink';
import { ArrowRight, BookOpen, ChevronDown, ShieldCheck, Zap, Wallet, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SocialProof from './components/SocialProof';
import PricingSection from './components/PricingSection';
import Testimonials from './components/Testimonials';
import Tutorial from './components/Tutorial';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import Reveal from './components/Reveal';

export const metadata: Metadata = {
    title: 'ChatGPT Plus / Pro 官方充值 — 安全、快速、可靠',
    description:
        '官方渠道充值 ChatGPT Plus 月卡、Pro 5X、Pro 20X，充值失败全额退款，Token 仅用于本次充值。支持微信支付和 Stripe。',
};

export default function Home() {
    return (
        <>
            {/* Hero Section */}
            <section className="relative flex flex-col items-center justify-center overflow-hidden min-h-[calc(100vh-4rem)]">
                {/* Decorative gradient blobs */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute left-[-15%] top-[-25%] h-150 w-150 animate-[float_12s_ease-in-out_infinite] rounded-full bg-linear-to-br from-blue-500/10 via-cyan-500/10 to-transparent blur-3xl"
                />
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute right-[-15%] bottom-[-30%] h-125 w-125 animate-[float_10s_ease-in-out_infinite_2s] rounded-full bg-linear-to-tl from-purple-500/10 via-pink-500/10 to-transparent blur-3xl"
                />
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute right-[20%] top-[10%] h-75 w-75 animate-[float_14s_ease-in-out_infinite_1s] rounded-full bg-linear-to-r from-amber-500/5 to-orange-500/5 blur-3xl"
                />

                {/* Dot pattern overlay */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-40 mask-[radial-gradient(ellipse_at_center,black_30%,transparent_70%)]"
                    style={{
                        backgroundImage:
                            'radial-gradient(circle at 1px 1px, hsl(var(--muted-foreground) / 0.15) 1px, transparent 0)',
                        backgroundSize: '28px 28px',
                    }}
                />

                {/* Content */}
                <div className="relative z-10 mx-auto max-w-5xl px-6 py-32 text-center">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1 text-sm text-muted-foreground opacity-0 animate-[fadeUp_0.5s_ease-out_0.1s_forwards]">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                        </span>
                        充值失败全额退款，放心购买
                    </div>

                    <h1 className="text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl opacity-0 animate-[fadeUp_0.5s_ease-out_0.2s_forwards]">
                        ChatGPT Plus / Pro
                        <br />
                        官方渠道充值
                    </h1>

                    <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg opacity-0 animate-[fadeUp_0.5s_ease-out_0.3s_forwards]">
                        正规通道 &middot; 邮件通知到账 &middot; 无需海外信用卡 &middot; 支持微信支付
                        &middot; 不成功全额退款，通过正规通道 2 分钟内即可完成充值。
                    </p>

                    <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center opacity-0 animate-[fadeUp_0.5s_ease-out_0.4s_forwards]">
                        <Button size="lg" className="min-w-40 text-base" asChild>
                            <ScrollLink target="#pricing">
                                <ArrowRight className="h-5 w-5" />
                                立即充值
                            </ScrollLink>
                        </Button>
                        <Button variant="outline" size="lg" className="min-w-40 text-base">
                            <BookOpen className="h-5 w-5" />
                            了解更多
                        </Button>
                    </div>

                    <p className="mt-8 text-xs text-muted-foreground/55">让每一个人都能用上 AI</p>

                    <SocialProof />

                    {/* Highlights — single row, no wrapping */}
                    <div className="mt-20 flex flex-wrap justify-center gap-x-10 gap-y-4 sm:flex-nowrap">
                        {[
                            {
                                icon: ShieldCheck,
                                title: '售后无忧',
                                desc: '充值失败 100% 当天退款',
                            },
                            {
                                icon: Zap,
                                title: '极速到账',
                                desc: '平均 2 分钟内自动完成',
                            },
                            {
                                icon: Wallet,
                                title: '支付便捷',
                                desc: '支持 Stripe 国际支付 / 微信支付',
                            },
                            {
                                icon: Lock,
                                title: '0 封号风险',
                                desc: '官方渠道升级，正规通道，账号安全有保障',
                            },
                        ].map((item) => (
                            <div
                                key={item.title}
                                className="flex items-start gap-3 whitespace-nowrap text-left"
                            >
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <item.icon className="h-4 w-4" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold">{item.title}</h3>
                                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <ScrollLink
                        target="#pricing"
                        className="mt-16 inline-flex flex-col items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <span>下滑查看教程</span>
                        <ChevronDown className="h-4 w-4 animate-bounce" />
                    </ScrollLink>
                </div>
            </section>

            <Reveal>
                <PricingSection />
            </Reveal>
            <Reveal>
                <Tutorial />
            </Reveal>
            <Reveal>
                <Testimonials />
            </Reveal>
            <Reveal>
                <FAQ />
            </Reveal>
            <Footer />
        </>
    );
}
