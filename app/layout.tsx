import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import './globals.css';
import Header from './components/Header';
import ContactFloat from './components/ContactFloat';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: {
        default: 'PayModels — ChatGPT Plus / Pro 官方渠道充值',
        template: '%s | PayModels',
    },
    description:
        'ChatGPT Plus 月卡、Pro 5X、Pro 20X 官方渠道充值，安全可靠，充值失败全额退款。支持微信支付和 Stripe 支付，Token 仅用于本次充值。',
    keywords: [
        'ChatGPT 充值',
        'ChatGPT Plus',
        'ChatGPT Pro',
        'OpenAI 充值',
        'GPT 升级',
        'ChatGPT 月卡',
    ],
    authors: [{ name: 'PayModels' }],
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
    robots: {
        index: true,
        follow: true,
    },
    openGraph: {
        type: 'website',
        siteName: 'PayModels',
        title: 'PayModels — ChatGPT Plus / Pro 官方渠道充值',
        description:
            'ChatGPT Plus 月卡、Pro 5X、Pro 20X 官方渠道充值，安全可靠，充值失败全额退款。',
        url: '/',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="zh-CN"
            className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
        >
            <body className="min-h-full flex flex-col">
                <SessionProvider>
                    <Header />
                    <main className="flex-1">{children}</main>
                    <ContactFloat />
                </SessionProvider>
            </body>
        </html>
    );
}
