import { readFile } from 'node:fs/promises';
import test from 'node:test';
import assert from 'node:assert/strict';

const homePage = await readFile(new URL('../app/page.tsx', import.meta.url), 'utf8');
const pricingSection = await readFile(
    new URL('../app/components/PricingSection.tsx', import.meta.url),
    'utf8'
);
const orderPage = await readFile(new URL('../app/order/page.tsx', import.meta.url), 'utf8');
const globalsCss = await readFile(new URL('../app/globals.css', import.meta.url), 'utf8');

test('hero recharge scrolls to pricing while plan recharge opens the order page', () => {
    assert.match(
        homePage,
        /<ScrollLink target="#pricing">\s*<ArrowRight[\s\S]*?立即充值\s*<\/ScrollLink>/
    );
    assert.match(
        pricingSection,
        /<Link href=\{`\/order\?plan=\$\{plan\.slug\}`\}>立即充值<\/Link>/
    );
});

test('order page exposes a focused shadcn stepper checkout structure', () => {
    assert.match(orderPage, /配置套餐/);
    assert.match(orderPage, /安心交付/);
    assert.match(orderPage, /max-w-6xl/);
    assert.match(orderPage, /checkout-form-stack/);
    assert.match(orderPage, /order-summary-panel/);
    assert.match(orderPage, /lg:grid-cols-\[minmax\(0,1fr\)_380px\]/);
});

test('order page layout separates summary, token, payment, and completion areas', () => {
    assert.match(orderPage, /复制和粘贴 Token/);
    assert.match(orderPage, /请选择支付方式/);
    assert.match(orderPage, /升级完成/);
    assert.match(orderPage, /充值流程/);
});

test('order page is a stepper checkout flow', () => {
    assert.match(orderPage, /const checkoutSteps = \[/);
    assert.ok(orderPage.indexOf("title: '复制 Token'") < orderPage.indexOf("title: '支付方式'"));
    assert.ok(orderPage.indexOf("title: '支付方式'") < orderPage.indexOf("title: '升级完成'"));
    assert.match(orderPage, /setCurrentStep\(2\)/);
    assert.match(orderPage, /setCurrentStep\(3\)/);
    assert.match(orderPage, /setCurrentStep\(4\)/);
    assert.match(orderPage, /微信支付/);
    assert.match(orderPage, /Stripe 支付/);
    assert.match(orderPage, /升级完成/);
});

test('order page polish keeps summary passive and makes payment/token areas clearer', () => {
    const summaryArea = orderPage.slice(orderPage.indexOf('<Card>'));
    assert.doesNotMatch(summaryArea, /<CardFooter>[\s\S]*?提交订单[\s\S]*?<\/CardFooter>/);
    assert.match(orderPage, /MessageCircle/);
    assert.match(orderPage, /wechat-icon/);
    assert.match(orderPage, /stripe-icon/);
    assert.match(orderPage, /把完整 JSON 粘贴到这里/);
    assert.match(orderPage, /min-h-\[150px\]/);
    assert.match(orderPage, /sm:text-3xl/);
    assert.doesNotMatch(orderPage, /sm:text-5xl/);
});

test('order page typography uses a restrained product type system', () => {
    assert.doesNotMatch(orderPage, /const typeStyles = \{/);
    assert.match(orderPage, /text-2xl font-semibold leading-tight tracking-tight/);
    assert.match(orderPage, /text-lg font-semibold leading-tight tracking-tight/);
    assert.match(orderPage, /text-sm leading-6 text-muted-foreground/);
    assert.match(orderPage, /text-xs font-medium leading-5 text-muted-foreground/);
    assert.match(orderPage, /tabular-nums/);
    assert.match(orderPage, /max-w-\[65ch\]/);
});

test('order page uses shadcn theme tokens instead of local color systems', () => {
    assert.match(orderPage, /token-info-surface/);
    assert.match(orderPage, /summary-surface/);
    assert.match(orderPage, /wechat-payment-button/);
    assert.match(orderPage, /stripe-payment-button/);
    assert.doesNotMatch(orderPage, /paymentTone/);
    assert.doesNotMatch(orderPage, /oklch/);
    assert.match(orderPage, /bg-muted\/30/);
    assert.match(orderPage, /text-primary/);
});

test('order page removes one-off premium effects from the summary surface', () => {
    assert.doesNotMatch(orderPage, /premium-summary-shell/);
    assert.doesNotMatch(orderPage, /premium-total-band/);
    assert.doesNotMatch(orderPage, /completion-confirmation/);
    assert.doesNotMatch(globalsCss, /premium-summary-shell::before/);
    assert.doesNotMatch(globalsCss, /@keyframes premium-summary-sheen/);
    assert.match(globalsCss, /@media \(prefers-reduced-motion: reduce\)/);
});

test('order page distills repeated instructional and reassurance blocks', () => {
    assert.doesNotMatch(orderPage, /const tokenSteps = \[/);
    assert.equal(orderPage.match(/summaryFeatures\.map/g)?.length, 1);
    assert.doesNotMatch(orderPage, /CardTitle className="flex items-center gap-3"/);
    assert.match(orderPage, /打开地址，复制页面里的完整 JSON，再粘贴到下方。/);
    assert.match(orderPage, /升级请求已提交，客服会按订单信息开始处理。/);
});

test('order page follows subscription layout with form sections and sticky summary', () => {
    assert.match(orderPage, /配置套餐/);
    assert.match(orderPage, /Token 信息/);
    assert.match(orderPage, /快捷支付/);
    assert.match(orderPage, /lg:sticky lg:top-10/);
    assert.match(orderPage, /summaryFeatures\.map/);
    assert.match(orderPage, /今日应付金额/);
});

test('order summary omits secondary billing detail rows', () => {
    const summaryArea = orderPage.slice(orderPage.indexOf('<aside className="order-summary-panel'));

    assert.doesNotMatch(summaryArea, /订阅方案/);
    assert.doesNotMatch(summaryArea, /<span className="text-muted-foreground">支付方式<\/span>/);
    assert.doesNotMatch(summaryArea, /未选择/);
    assert.doesNotMatch(summaryArea, /预计税费/);
    assert.doesNotMatch(summaryArea, /¥0/);
});

test('order summary combines delivery reassurance with payable amount', () => {
    const summaryArea = orderPage.slice(orderPage.indexOf('<aside className="order-summary-panel'));
    const combinedBlockStart = summaryArea.indexOf('delivery-total-summary');

    assert.ok(combinedBlockStart > -1);
    assert.ok(summaryArea.indexOf('安心交付') > combinedBlockStart);
    assert.ok(summaryArea.indexOf('今日应付金额') > combinedBlockStart);
    assert.ok(summaryArea.indexOf('{selected.price}') > combinedBlockStart);
    assert.doesNotMatch(summaryArea, /<Alert>\s*<ClipboardCheck className="size-4" \/>/);
});

test('order page keeps header and form in the left grid column beside summary', () => {
    const gridStart = orderPage.indexOf('lg:grid-cols-[minmax(0,1fr)_380px]');
    const mainStart = orderPage.indexOf('<main className="checkout-form-stack flex flex-col gap-9">');
    const asideStart = orderPage.indexOf('<aside className="order-summary-panel lg:sticky lg:top-10">');

    assert.ok(gridStart > -1);
    assert.ok(mainStart > gridStart);
    assert.ok(asideStart > mainStart);

    const leftColumn = orderPage.slice(mainStart, asideStart);
    assert.match(leftColumn, /<header className="max-w-3xl">/);
    assert.match(leftColumn, /配置套餐/);
    assert.match(leftColumn, /Token 信息/);
});

test('payment step uses shadcn tabs and shows selected payment qr code panels', () => {
    assert.match(orderPage, /from '@\/components\/ui\/tabs'/);
    assert.match(orderPage, /<Tabs[\s\S]*?value=\{paymentMethod \?\? ''\}/);
    assert.match(orderPage, /<TabsList className="hidden"/);
    assert.match(orderPage, /value: 'wechat'/);
    assert.match(orderPage, /value: 'stripe'/);
    assert.match(orderPage, /<TabsTrigger[\s\S]*?value=\{method\.value\}/);
    assert.match(orderPage, /<TabsContent[\s\S]*?value=\{method\.value\}/);
    assert.match(orderPage, /微信支付二维码/);
    assert.match(orderPage, /Stripe 支付二维码/);
});

test('order page hides quick payment until token is pasted', () => {
    assert.match(orderPage, /token\.trim\(\)\.length > 0/);
    assert.match(orderPage, /\{hasToken && \(/);
    assert.match(orderPage, /setPaymentMethod\(method\.value\)/);
});

test('order page keeps payment selection explicit and progress steps read-only', () => {
    assert.match(orderPage, /max-w-6xl/);
    assert.match(orderPage, /lg:grid-cols-\[minmax\(0,1fr\)_380px\]/);
    assert.match(orderPage, /复制链接/);
    assert.match(orderPage, /useState<PaymentMethod \| null>\(null\)/);
    assert.match(orderPage, /请选择支付方式后展示二维码/);
    assert.match(orderPage, /disabled=\{!paymentMethod\}/);
    assert.doesNotMatch(orderPage, /onClick=\{\(\) => setCurrentStep\(step\.value\)\}/);
});

test('order summary next action does not index checkout steps with current step', () => {
    assert.match(orderPage, /nextStep = checkoutSteps\.find/);
    assert.doesNotMatch(orderPage, /checkoutSteps\[currentStep\]\.title/);
});

test('delivery notes are shown inside the order summary area', () => {
    assert.ok(orderPage.indexOf('<Card') < orderPage.indexOf('充值流程'));
    assert.ok(orderPage.indexOf('充值流程') < orderPage.indexOf('安心交付'));
});

test('order page uses shadcn composition primitives', () => {
    assert.match(orderPage, /from '@\/components\/ui\/card'/);
    assert.match(orderPage, /from '@\/components\/ui\/badge'/);
    assert.match(orderPage, /from '@\/components\/ui\/alert'/);
    assert.match(orderPage, /from '@\/components\/ui\/field'/);
    assert.match(orderPage, /from '@\/components\/ui\/textarea'/);
    assert.match(orderPage, /from '@\/components\/ui\/separator'/);
    assert.match(orderPage, /from '@\/components\/ui\/tabs'/);
    assert.doesNotMatch(orderPage, /<textarea\b/);
    assert.doesNotMatch(orderPage, /space-y-/);
});
