'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
    ArrowLeft,
    Check,
    ClipboardCheck,
    Copy,
    CreditCard,
    ExternalLink,
    Lock,
    MessageCircle,
    QrCode,
    ShieldCheck,
    Timer,
} from 'lucide-react';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

type CheckoutStep = 1 | 2 | 3 | 4;
type PaymentMethod = 'wechat' | 'stripe';

const planInfo: Record<
    string,
    { name: string; price: string; badge: string; description: string }
> = {
    plus: {
        name: 'ChatGPT Plus 月卡',
        price: '¥189 / 月',
        badge: '入门首选',
        description: '适合个人日常使用，失败当天全额退款',
    },
    pro5x: {
        name: 'ChatGPT Pro 5X',
        price: '¥864 / 月 ($120)',
        badge: '高频使用',
        description: '更高额度与优先处理，适合稳定生产力场景',
    },
    pro20x: {
        name: 'ChatGPT Pro 20X',
        price: '¥1620 / 月 ($225)',
        badge: '顶级额度',
        description: '最高优先级到账，适合重度与团队使用',
    },
};

const summaryFeatures = [
    { icon: Timer, label: '预计 2 分钟内开始处理' },
    { icon: ShieldCheck, label: '失败全额退款保障' },
    { icon: Lock, label: 'Token 仅用于本次充值' },
    { icon: ClipboardCheck, label: '官方渠道充值处理' },
];

const checkoutSteps = [
    {
        value: 1,
        title: '复制 Token',
        description: '复制并粘贴 JSON',
    },
    {
        value: 2,
        title: '支付方式',
        description: '切换并扫码支付',
    },
    {
        value: 3,
        title: '升级完成',
        description: '等待处理结果',
    },
] satisfies Array<{ value: CheckoutStep; title: string; description: string }>;

const paymentMethods = [
    {
        value: 'wechat',
        title: '微信支付',
        description: '适合国内用户，使用微信扫码完成支付。',
        qrTitle: '微信支付二维码',
        qrHint: '请使用微信扫一扫，付款后点击下一步。',
        icon: MessageCircle,
    },
    {
        value: 'stripe',
        title: 'Stripe 支付',
        description: '支持国际银行卡通道，适合海外支付环境。',
        qrTitle: 'Stripe 支付二维码',
        qrHint: '请扫码打开 Stripe Checkout，完成支付后返回页面。',
        icon: CreditCard,
    },
] satisfies Array<{
    value: PaymentMethod;
    title: string;
    description: string;
    qrTitle: string;
    qrHint: string;
    icon: typeof MessageCircle;
}>;

const qrBlocks = [
    1, 2, 3, 5, 6, 7, 9, 11, 13, 14, 17, 19, 21, 22, 23, 27, 29, 31, 34, 35, 38, 41, 43, 46, 47, 49,
    51, 53, 56, 58,
];

function PaymentQr({ method }: { method: (typeof paymentMethods)[number] }) {
    const isWechat = method.value === 'wechat';

    return (
        <div className="grid gap-5 rounded-xl border bg-muted/20 p-4 md:grid-cols-[190px_minmax(0,1fr)]">
            <div
                className={cn(
                    'qr-code-panel flex aspect-square items-center justify-center rounded-xl border bg-background p-5',
                    isWechat ? 'wechat-qr-code' : 'stripe-qr-code'
                )}
            >
                <div className="grid size-32 grid-cols-7 gap-1 rounded-md bg-background p-3 shadow-xs">
                    {Array.from({ length: 63 }).map((_, index) => (
                        <span
                            key={index}
                            className={cn(
                                'rounded-[2px]',
                                qrBlocks.includes(index) ? 'bg-primary' : 'bg-muted'
                            )}
                        />
                    ))}
                </div>
            </div>

            <div className="flex flex-col justify-center gap-3">
                <Badge variant="secondary" className="w-fit">
                    <QrCode />
                    {method.qrTitle}
                </Badge>
                <div>
                    <h3 className="text-lg font-semibold leading-tight tracking-tight text-foreground">
                        {method.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {method.description}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{method.qrHint}</p>
                </div>
            </div>
        </div>
    );
}

function OrderForm() {
    const searchParams = useSearchParams();
    const plan = searchParams.get('plan') || 'plus';
    const selected = planInfo[plan] || planInfo.plus;

    const [token, setToken] = useState('');
    const [copied, setCopied] = useState(false);
    const [currentStep, setCurrentStep] = useState<CheckoutStep>(1);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
    const [orderId, setOrderId] = useState<string | null>(null);
    const [isCreatingOrder, setIsCreatingOrder] = useState(false);

    const tokenUrl = 'https://chatgpt.com/api/auth/session';
    const nextStep = checkoutSteps.find((step) => step.value === currentStep);
    const hasToken = token.trim().length > 0;

    const createOrder = async (method: PaymentMethod) => {
        if (!selected || isCreatingOrder) return;
        setIsCreatingOrder(true);
        try {
            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    plan,
                    amount: parseFloat(selected.price.replace(/[^0-9.]/g, "")),
                    payment_method: method,
                    access_token: token,
                }),
            });
            const data = await res.json();
            if (res.ok && data.id) {
                setOrderId(data.id);
            }
        } finally {
            setIsCreatingOrder(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(tokenUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const moveToNextStep = () => {
        setCurrentStep((step) => {
            if (step === 3 && !paymentMethod) return step;

            return step < 4 ? ((step + 1) as CheckoutStep) : step;
        });
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-background">
            <div className="mx-auto max-w-6xl px-5 py-8 sm:px-6 lg:py-12">
                <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
                    <main className="checkout-form-stack flex flex-col gap-9">
                        <header className="max-w-3xl">
                            <Link
                                href="/#pricing"
                                className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                            >
                                <ArrowLeft className="size-4" />
                                返回方案选择
                            </Link>

                            <div className="mt-5 flex flex-col gap-3">
                                <Badge variant="secondary" className="w-fit">
                                    <ShieldCheck />
                                    官方渠道充值
                                </Badge>
                                <div>
                                    <h1 className="text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-3xl">
                                        配置套餐
                                    </h1>
                                    <p className="mt-3 max-w-[65ch] text-sm leading-6 text-muted-foreground sm:text-base">
                                        按当前方案确认订单，提交 Token，选择支付方式后等待升级完成。
                                    </p>
                                </div>
                            </div>
                        </header>

                        <section className="flex flex-col gap-4">
                            <div className="flex items-center justify-between gap-4">
                                <h2 className="text-lg font-semibold leading-tight tracking-tight text-foreground">
                                    Token 信息
                                </h2>
                                <Badge variant={token.length > 0 ? 'secondary' : 'outline'}>
                                    {token.length > 0 ? `${token.length} 字符` : '等待粘贴'}
                                </Badge>
                            </div>

                            <Alert className="token-info-surface flex items-center justify-between gap-3 bg-muted/30">
                                <div className="flex-1">
                                    <AlertDescription className="flex cursor-pointer items-center justify-start gap-2 break-all font-mono hover:underline">
                                        <ExternalLink className="size-4 text-primary" />
                                        {tokenUrl}
                                    </AlertDescription>
                                </div>
                                <Button variant="outline" asChild>
                                    <a href={tokenUrl} target="_blank" rel="noreferrer">
                                        <ExternalLink data-icon="inline-start" />
                                        打开地址
                                    </a>
                                </Button>
                                <Button type="button" onClick={handleCopy}>
                                    {copied ? (
                                        <Check data-icon="inline-start" />
                                    ) : (
                                        <Copy data-icon="inline-start" />
                                    )}
                                    {copied ? '已复制链接' : '复制链接'}
                                </Button>
                            </Alert>

                            <p className="text-sm leading-6 text-muted-foreground">
                                复制和粘贴 Token：打开地址，复制页面里的完整 JSON，再粘贴到下方。
                            </p>

                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="token">把完整 JSON 粘贴到这里</FieldLabel>
                                    <Textarea
                                        id="token"
                                        value={token}
                                        onChange={(event) => {
                                            setToken(event.target.value);
                                            if (currentStep < 2) setCurrentStep(2);
                                        }}
                                        onFocus={() => setCurrentStep(2)}
                                        placeholder="点击这里，粘贴从 ChatGPT session 页面复制的完整 JSON 数据..."
                                        rows={5}
                                        className="min-h-[150px] max-h-[150px] rounded-xl border-input bg-muted/30 p-6 font-mono shadow-xs focus-visible:ring-primary/20"
                                    />
                                </Field>
                            </FieldGroup>
                        </section>

                        {hasToken && (
                            <section className="flex flex-col gap-4">
                                <h2 className="text-lg font-semibold leading-tight tracking-tight text-foreground">
                                    快捷支付
                                </h2>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {paymentMethods.map((method) => (
                                        <Button
                                            key={method.value}
                                            type="button"
                                            variant={
                                                paymentMethod === method.value
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                            className={cn(
                                                'justify-start gap-2',
                                                method.value === 'wechat'
                                                    ? 'wechat-payment-button'
                                                    : 'stripe-payment-button'
                                            )}
                                            onClick={() => {
                                                setPaymentMethod(method.value);
                                                setCurrentStep(3);
                                                createOrder(method.value);
                                            }}
                                        >
                                            <span
                                                className={cn(
                                                    'flex size-7 items-center justify-center rounded-md',
                                                    method.value === 'wechat'
                                                        ? 'wechat-icon bg-primary/10 text-primary'
                                                        : 'stripe-icon bg-muted text-muted-foreground'
                                                )}
                                            >
                                                <method.icon className="size-4" />
                                            </span>
                                            {method.title}
                                        </Button>
                                    ))}
                                </div>

                                <Tabs
                                    value={paymentMethod ?? ''}
                                    onValueChange={(value) => {
                                        setPaymentMethod(value as PaymentMethod);
                                        setCurrentStep(3);
                                    }}
                                    className="gap-5"
                                >
                                    <TabsList className="hidden">
                                        {paymentMethods.map((method) => (
                                            <TabsTrigger key={method.value} value={method.value}>
                                                {method.title}
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>

                                    {!paymentMethod && (
                                        <div className="flex min-h-55 flex-col items-center justify-center gap-3 rounded-xl border bg-muted/20 p-6 text-center">
                                            <QrCode className="size-8 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm font-medium leading-5 text-foreground">
                                                    请选择支付方式后展示二维码
                                                </p>
                                                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                                    微信支付和 Stripe
                                                    都不会默认选中，点击上方方式后再扫码。
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {paymentMethods.map((method) => (
                                        <TabsContent key={method.value} value={method.value}>
                                            <PaymentQr method={method} />
                                        </TabsContent>
                                    ))}
                                </Tabs>

                                <Alert>
                                    <ShieldCheck className="size-4" />
                                    <AlertTitle>支付后进入处理队列</AlertTitle>
                                    <AlertDescription>
                                        支付完成后会根据订单信息和 Token
                                        进行充值，状态通过客服或邮件同步。
                                    </AlertDescription>
                                </Alert>

                                <Button
                                    className="w-full rounded-full"
                                    size="lg"
                                    onClick={() => setCurrentStep(4)}
                                    disabled={!paymentMethod}
                                >
                                    {paymentMethod ? '我已完成支付' : '请选择支付方式'}
                                </Button>
                            </section>
                        )}
                    </main>

                    <aside className="order-summary-panel lg:sticky lg:top-10">
                        <Card className="summary-surface rounded-3xl bg-card/95 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-2xl font-semibold tracking-tight">
                                    {selected.name}
                                </CardTitle>
                                <CardDescription>{selected.description}</CardDescription>
                                <CardAction>
                                    <Badge>{selected.badge}</Badge>
                                </CardAction>
                            </CardHeader>

                            <CardContent className="flex flex-col gap-6">
                                <div className="flex flex-col gap-4">
                                    <p className="text-sm font-medium leading-5 text-foreground">
                                        充值流程
                                    </p>
                                    <div className="flex flex-col gap-3">
                                        {summaryFeatures.map((item) => (
                                            <div
                                                key={item.label}
                                                className="flex items-center gap-3 text-sm text-muted-foreground"
                                            >
                                                <item.icon className="size-4 text-primary" />
                                                <span>{item.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <Separator />

                                <div className="delivery-total-summary rounded-2xl border bg-muted/30 p-4">
                                    <div className="flex items-start gap-3">
                                        <ClipboardCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                                        <div className="flex flex-col gap-1">
                                            <p className="text-sm font-medium leading-5 text-foreground">
                                                安心交付
                                            </p>
                                            <p className="text-xs font-medium leading-5 text-muted-foreground">
                                                支付后进入人工核验队列，充值状态会通过客服或邮件同步。
                                            </p>
                                        </div>
                                    </div>

                                    <Separator className="my-4" />

                                    <div className="flex items-end justify-between gap-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-sm font-medium leading-5 text-foreground">
                                                今日应付金额
                                            </span>
                                            <span className="text-xs font-medium leading-5 text-muted-foreground">
                                                税费已包含在当前订单中
                                            </span>
                                        </div>
                                        <span className="tabular-nums text-2xl font-semibold leading-none tracking-tight text-foreground">
                                            {selected.price}
                                        </span>
                                    </div>
                                </div>

                                <Button
                                    className="w-full rounded-full"
                                    size="lg"
                                    onClick={moveToNextStep}
                                    disabled={currentStep === 3 && !paymentMethod}
                                >
                                    {currentStep === 3 && !paymentMethod
                                        ? '先选择支付方式'
                                        : (nextStep?.title ?? '返回首页')}
                                </Button>

                                {currentStep === 4 && (
                                    <Alert className="border-primary/20 bg-primary/5">
                                        <Check className="size-4 text-primary" />
                                        <AlertTitle>
                                            升级请求已提交，客服会按订单信息开始处理。
                                        </AlertTitle>
                                        {orderId && (
                                            <AlertDescription>
                                                订单编号：{orderId}
                                            </AlertDescription>
                                        )}
                                        <AlertDescription>
                                            如需核对订单，可提供所选方案和支付方式。
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </CardContent>

                            <CardFooter className="flex flex-col items-start gap-3">
                                <p className="text-xs font-medium leading-5 text-muted-foreground">
                                    充值流程：预计 2 分钟内开始处理，失败全额退款，Token
                                    仅用于本次充值。
                                </p>
                                <div className="flex gap-3">
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href="/#pricing">重新选择方案</Link>
                                    </Button>
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href="/">返回首页</Link>
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    </aside>
                </div>
            </div>
        </div>
    );
}

export default function OrderPage() {
    return (
        <Suspense>
            <OrderForm />
        </Suspense>
    );
}
