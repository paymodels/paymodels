import { Metadata } from 'next';
import { DocLayout } from '@/app/components/docs/DocLayout';
import { DocComments } from '@/app/components/docs/DocComments';

export const metadata: Metadata = {
  title: '退款政策',
  description: 'PayModels 充值失败全额退款政策说明',
};

export default function RefundPage() {
  return (
    <DocLayout slug="refund">
      <h1 className="text-3xl font-bold tracking-tight mb-4">退款政策</h1>
      <p className="text-lg text-muted-foreground mb-8">
        不成功全额退款是我们的承诺
      </p>

      <section id="heading-0" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">退款原则</h2>
        <p className="text-base leading-relaxed">
          如果由于任何原因导致您的充值未能成功完成，我们将全额退还您支付的所有费用。
          无需任何理由，无需复杂流程，退款将在 3-5 个工作日内原路返回。
        </p>
      </section>

      <section id="heading-1" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">退款流程</h2>
        <ol className="list-decimal list-inside space-y-4 text-base leading-relaxed">
          <li>
            <strong>联系客服</strong>
            <p className="mt-2 ml-6">通过页面右下角的客服按钮或邮件联系</p>
          </li>
          <li>
            <strong>提供信息</strong>
            <p className="mt-2 ml-6">提供订单号和支付凭证</p>
          </li>
          <li>
            <strong>审核处理</strong>
            <p className="mt-2 ml-6">我们将在 24 小时内审核并处理</p>
          </li>
          <li>
            <strong>退款到账</strong>
            <p className="mt-2 ml-6">3-5 个工作日内原路退回</p>
          </li>
        </ol>
      </section>

      <section id="heading-2" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">注意事项</h2>
        <ul className="list-disc list-inside space-y-2 text-base leading-relaxed">
          <li>已成功完成的充值不支持退款</li>
          <li>退款将退回至原支付账户</li>
          <li>如有疑问请联系客服获取帮助</li>
        </ul>
      </section>

      <DocComments slug="refund" />
    </DocLayout>
  );
}
