import { Metadata } from 'next';
import { DocLayout } from '@/app/components/docs/DocLayout';
import { DocComments } from '@/app/components/docs/DocComments';

export const metadata: Metadata = {
  title: '支付方式说明',
  description: 'PayModels 支持的支付方式介绍',
};

export default function PaymentPage() {
  return (
    <DocLayout slug="payment">
      <h1 className="text-3xl font-bold tracking-tight mb-4">支付方式说明</h1>
      <p className="text-lg text-muted-foreground mb-8">
        我们支持多种支付方式，确保您能够便捷地完成充值
      </p>

      <section id="heading-0" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">微信支付</h2>
        <p className="text-base leading-relaxed">
          支持微信扫码支付，无需海外信用卡，全程以人民币结算。
          支付成功后系统将自动处理您的充值订单。
        </p>
      </section>

      <section id="heading-1" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Stripe 支付</h2>
        <p className="text-base leading-relaxed">
          支持国际信用卡和借记卡支付，通过 Stripe 安全支付网关处理。
          支持 Visa、MasterCard、American Express 等主流信用卡。
        </p>
      </section>

      <section id="heading-2" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">支付安全</h2>
        <ul className="list-disc list-inside space-y-2 text-base leading-relaxed">
          <li>所有支付通过加密通道传输</li>
          <li>不存储您的银行卡信息</li>
          <li>支持支付失败自动重试</li>
        </ul>
      </section>

      <DocComments slug="payment" />
    </DocLayout>
  );
}
