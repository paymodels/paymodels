import Link from 'next/link';
import { MessageCircle } from 'lucide-react';

const linkGroups = [
    {
        title: 'ChatGPT 充值',
        links: [
            { label: 'ChatGPT Plus 代充', href: '/pricing' },
            { label: 'ChatGPT Pro 升级', href: '/pricing' },
            { label: 'ChatGPT Plus 价格', href: '/pricing' },
            { label: 'API 额度充值', href: '/pricing' },
        ],
    },
    {
        title: 'AI 模型',
        links: [
            { label: 'Codex 订阅充值', href: '/pricing' },
            { label: 'Grok / SuperGrok 充值', href: '/grok' },
            { label: 'Gemini Pro 充值', href: '/gemini' },
            { label: 'Claude 充值', href: '/pricing' },
        ],
    },
    {
        title: '教程 & 博客',
        links: [
            { label: 'ChatGPT 充值教程', href: '/tutorials' },
            { label: 'Codex 使用指南', href: '/tutorials' },
            { label: '博客', href: '/tutorials' },
            { label: '真实用户评价', href: '/' },
        ],
    },
    {
        title: '帮助 & 支持',
        links: [
            { label: '常见问题 FAQ', href: '/' },
            { label: '充值失败排查', href: '/faq' },
            { label: '查询订单', href: '/orders' },
            { label: '服务条款', href: '#' },
            { label: '隐私政策', href: '#' },
        ],
    },
];

export default function Footer() {
    return (
        <footer className="border-t bg-muted/30 pt-16 pb-8">
            <div className="mx-auto max-w-6xl px-6">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
                    {/* Brand */}
                    <div className="lg:col-span-1 lg:pr-8">
                        <Link href="/" className="text-lg font-semibold">
                            PayModels
                        </Link>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                            专业的 ChatGPT Plus / Pro 充值服务，支持微信支付和 Stripe
                            国际支付，极速到账，安全可靠。
                        </p>
                        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                            <MessageCircle className="h-4 w-4 text-green-500" />
                            <span>添加企业微信获取帮助</span>
                        </div>
                    </div>

                    {/* Link groups */}
                    {linkGroups.map((group) => (
                        <div key={group.title}>
                            <h4 className="text-sm font-semibold">{group.title}</h4>
                            <ul className="mt-4 space-y-2.5">
                                {group.links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-12 border-t pt-6 text-center text-xs text-muted-foreground">
                    &copy; {new Date().getFullYear()} PayModels. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
