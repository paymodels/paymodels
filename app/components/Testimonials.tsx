import { Icon, ShieldCheck, Star, User, Zap } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const apiBase = 'https://api.dicebear.com/9.x/notionists/svg';

const testimonials = [
    {
        seed: 'Liam',
        fallback: '陈',
        name: '陈明远',
        role: '后端开发工程师',
        since: '2026 年 1 月',
        rating: 5,
        content:
            '用了 PayModels 三个月，充值速度真的快，基本 2 分钟内就到账了。有一次充值失败，当天就收到全额退款，售后处理非常靠谱。',
    },
    {
        seed: 'Sophia',
        fallback: '林',
        name: '林雨桐',
        role: '全栈开发者',
        since: '2026 年 2 月',
        rating: 5,
        content:
            '最吸引我的是支持 Stripe 和微信支付，海外和国内付款都很方便。Pro 5X 的 Codex 编程额度非常实用，性价比比直接官网订阅高太多了。',
    },
    {
        seed: 'Noah',
        fallback: '张',
        name: '张浩然',
        role: 'AI 研究员',
        since: '2026 年 1 月',
        rating: 5,
        content:
            '之前用其他渠道充值总担心封号问题，PayModels 走的是官方正规通道，用了大半年账号一直很安全。Pro 20X 的 API 接口对接也很顺畅。',
    },
    {
        seed: 'Emma',
        fallback: '王',
        name: '王晓雯',
        role: '前端工程师',
        since: '2026 年 3 月',
        rating: 4,
        content:
            '团队日常需要大量 Codex 额度，PayModels 的价格比官网便宜太多了。充值记录随时可查，每一笔都清清楚楚，非常放心。',
    },
    {
        seed: 'Oliver',
        fallback: '刘',
        name: '刘志远',
        role: 'DevOps 工程师',
        since: '2026 年 2 月',
        rating: 5,
        content:
            'API 对接非常方便，我们直接集成到了内部工具链里。到账速度稳定在 2 分钟以内，从来没有让我们等太久。',
    },
    {
        seed: 'Ava',
        fallback: '赵',
        name: '赵思涵',
        role: '数据分析师',
        since: '2026 年 1 月',
        rating: 5,
        content:
            'Gemini 和 Grok 都能充，选择非常灵活。有次支付遇到问题客服秒回，当天就解决了，售后体验真的没话说。',
    },
    {
        seed: 'William',
        fallback: '黄',
        name: '黄志豪',
        role: '技术负责人',
        since: '2026 年 3 月',
        rating: 4,
        content:
            '公司十几个人都在用 PayModels 充值，Pro 20X 额度够大，统一管理很方便。正规渠道不用担心封号，团队用着安心。',
    },
    {
        seed: 'Mia',
        fallback: '周',
        name: '周雨晴',
        role: '独立开发者',
        since: '2026 年 2 月',
        rating: 5,
        content:
            '作为个人开发者，Plus 月卡刚刚好。不成功全额退款的承诺让我第一次充值就很放心，后面就一直用到现在了。',
    },
];

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`h-3.5 w-3.5 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'}`}
                />
            ))}
        </div>
    );
}

function TestimonialCard({ t }: { t: (typeof testimonials)[0] }) {
    return (
        <div className="flex w-[340px] shrink-0 flex-col rounded-2xl border bg-background p-5">
            <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                    <AvatarImage src={`${apiBase}?seed=${t.seed}`} alt={t.name} />
                    <AvatarFallback className="text-xs">{t.fallback}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{t.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                        {t.role} &middot; {t.since}起使用
                    </p>
                </div>
            </div>
            <StarRating rating={t.rating} />
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                &ldquo;{t.content}&rdquo;
            </p>
        </div>
    );
}

function MarqueeRow({ items, reverse = false }: { items: typeof testimonials; reverse?: boolean }) {
    const duplicated = [...items, ...items];
    const duration = items.length * 8;
    const name = reverse ? 'marquee-reverse' : 'marquee';

    return (
        <div className="group flex overflow-hidden">
            <div
                className="flex gap-4 will-change-transform group-hover:[animation-play-state:paused]"
                style={{
                    animation: `${name} ${duration}s linear infinite`,
                }}
            >
                {duplicated.map((t, i) => (
                    <TestimonialCard key={`${t.seed}-${i}`} t={t} />
                ))}
            </div>
        </div>
    );
}

export default function Testimonials() {
    const mid = Math.ceil(testimonials.length / 2);
    const topRow = testimonials.slice(0, mid);
    const bottomRow = testimonials.slice(mid);

    const icons = [
        {
            icon: <ShieldCheck className="size-4 text-primary" />,
            text: '三相安全有保障',
        },
        {
            icon: <Zap className="size-4 text-primary" />,
            text: '分钟级充值',
        },
        {
            icon: <User className="size-4 text-primary" />,
            text: '真人客服',
        },
    ];

    return (
        <section className="overflow-hidden py-16 sm:py-24">
            <div className="mx-auto max-w-6xl px-6">
                <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
                    用户真实评价
                </h2>
                <p className="mt-4 text-center text-muted-foreground">
                    已为 1000+ 用户提供专业服务
                </p>
            </div>

            <div className="mt-12 space-y-4">
                <MarqueeRow items={topRow} />
                <MarqueeRow items={bottomRow} reverse />
            </div>

            <div className="mx-auto mt-16 max-w-lg px-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                    {icons.map(({ icon, text }) => (
                        <div key={text} className="flex items-center justify-center gap-2">
                            {icon}
                            <span key={text} className="text-sm font-semibold text-primary">
                                {text}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
