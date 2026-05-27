import { Metadata } from 'next';
import { DocLayout } from '@/app/components/docs/DocLayout';
import { DocComments } from '@/app/components/docs/DocComments';

export const metadata: Metadata = {
  title: '如何充值 Pro',
  description: 'ChatGPT Pro 充值详细教程',
};

export default function RechargeProPage() {
  return (
    <DocLayout slug="guide-recharge-pro">
      <h1 className="text-3xl font-bold tracking-tight mb-4">如何充值 Pro</h1>
      <p className="text-lg text-muted-foreground mb-8">
        ChatGPT Pro 5X 和 Pro 20X 充值指南
      </p>

      <section id="heading-0" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Pro 计划介绍</h2>
        <p className="text-base leading-relaxed">
          ChatGPT Pro 是面向高频用户的升级方案，提供更高级的功能和更大的使用额度。
          目前支持 Pro 5X（$120/月）和 Pro 20X（$225/月）两种方案。
        </p>
      </section>

      <section id="heading-1" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">充值流程</h2>
        <ol className="list-decimal list-inside space-y-4 text-base leading-relaxed">
          <li>
            <strong>选择方案</strong>
            <p className="mt-2 ml-6">根据您的需求选择 Pro 5X 或 Pro 20X</p>
          </li>
          <li>
            <strong>访问对应页面</strong>
            <p className="mt-2 ml-6">Pro 5X: /order?plan=pro5x；Pro 20X: /order?plan=pro20x</p>
          </li>
          <li>
            <strong>完成支付</strong>
            <p className="mt-2 ml-6">支持微信支付和 Stripe 支付</p>
          </li>
        </ol>
      </section>

      <section id="heading-2" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">常见问题</h2>
        <ul className="list-disc list-inside space-y-2 text-base leading-relaxed">
          <li>Pro 充值后功能何时生效？通常在 3-6 小时内</li>
          <li>可以升级现有 Plus 到 Pro 吗？可以，联系客服处理</li>
          <li>Pro 有使用限制吗？有月度额度限制，详见具体方案说明</li>
        </ul>
      </section>

      <DocComments slug="guide-recharge-pro" />
    </DocLayout>
  );
}
