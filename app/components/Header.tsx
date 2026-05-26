'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Home, HelpCircle, BookOpen, Sparkles, Zap, LogIn, Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { signOut, useSession } from '@/lib/auth-client';
import { LoginDialog } from './LoginDialog';

const menus = [
    { label: '首页', href: '/', icon: Home },
    { label: '常见问题', href: '/faq', icon: HelpCircle },
    { label: '教程', href: '/tutorials', icon: BookOpen },
    { label: 'Gemini', href: '/gemini', icon: Sparkles },
    { label: 'Grok', href: '/grok', icon: Zap },
];

export default function Header() {
    const { data: session } = useSession();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <header
            className={`sticky top-0 z-50 border-b transition-all duration-300 ${
                scrolled
                    ? 'border-border bg-background/95 shadow-sm backdrop-blur-sm'
                    : 'border-transparent bg-transparent'
            }`}
        >
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Left: Logo */}
                <Link href="/" className="flex shrink-0 items-center gap-2">
                    <Image
                        src="/next.svg"
                        alt="Logo"
                        width={32}
                        height={32}
                        className="dark:invert"
                    />
                    <span className="text-lg font-semibold">PayModels</span>
                </Link>

                {/* Center: Menus (desktop) */}
                <nav className="hidden md:flex md:items-center md:gap-1">
                    {menus.map((item) => (
                        <Button key={item.href} variant="ghost" size="sm" asChild>
                            <Link href={item.href}>
                                <item.icon />
                                {item.label}
                            </Link>
                        </Button>
                    ))}
                </nav>

                {/* Right: Auth + Mobile toggle */}
                <div className="flex items-center gap-2">
                    {session ? (
                        <div className="hidden items-center gap-2 sm:flex">
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/orders">
                                    <Search data-icon="inline-start" />
                                    查询订单
                                </Link>
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => signOut()}>
                                退出
                            </Button>
                            <Avatar className="size-8">
                                <AvatarImage src={session.user?.image ?? ""} />
                                <AvatarFallback className="text-xs">
                                    {session.user?.name?.[0] ?? "U"}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    ) : (
                        <Button
                            size="sm"
                            className="hidden sm:inline-flex"
                            onClick={() => setLoginOpen(true)}
                        >
                            <LogIn data-icon="inline-start" />
                            登录
                        </Button>
                    )}

                    {/* Mobile menu (Sheet) */}
                    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden">
                                <Menu />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[280px]">
                            <SheetHeader>
                                <SheetTitle className="text-left">
                                    <Link
                                        href="/"
                                        className="flex items-center gap-2"
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        <Image
                                            src="/next.svg"
                                            alt="Logo"
                                            width={24}
                                            height={24}
                                            className="dark:invert"
                                        />
                                        <span>PayModels</span>
                                    </Link>
                                </SheetTitle>
                            </SheetHeader>
                            <nav className="mt-6 flex flex-col gap-1">
                                {menus.map((item) => (
                                    <Button
                                        key={item.href}
                                        variant="ghost"
                                        className="justify-start"
                                        asChild
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        <Link href={item.href}>
                                            <item.icon />
                                            {item.label}
                                        </Link>
                                    </Button>
                                ))}
                            </nav>
                            <div className="mt-6 border-t pt-4">
                                {session ? (
                                    <div className="flex items-center justify-between">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            asChild
                                            onClick={() => setMobileOpen(false)}
                                        >
                                            <Link href="/orders">
                                                <Search data-icon="inline-start" />
                                                查询订单
                                            </Link>
                                        </Button>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => signOut()}
                                            >
                                                退出
                                            </Button>
                                            <Avatar className="size-8">
                                                <AvatarImage src={session.user?.image ?? ""} />
                                                <AvatarFallback className="text-xs">
                                                    {session.user?.name?.[0] ?? "U"}
                                                </AvatarFallback>
                                            </Avatar>
                                        </div>
                                    </div>
                                ) : (
                                    <Button
                                        className="w-full"
                                        onClick={() => {
                                            setLoginOpen(true);
                                            setMobileOpen(false);
                                        }}
                                    >
                                        <LogIn data-icon="inline-start" />
                                        登录
                                    </Button>
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
            <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
        </header>
    );
}
