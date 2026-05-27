import { Metadata } from 'next';
import { DocLayout } from '@/app/components/docs/DocLayout';
import { DocComments } from '@/app/components/docs/DocComments';

export const metadata: Metadata = {
  title: '如何充值 Plus',
  description: 'ChatGPT Plus 充值详细教程',
};

export default function RechargePlusPage() {
  return (
    <DocLayout slug="guide-recharge-plus">
      <h1 className="text-3xl font-bold tracking-tight mb-4">如何充值 Plus</h1>
      <p className="text-lg text-muted-foreground mb-8">
        通过 PayModels 充值 ChatGPT Plus 的详细步骤
      </p>

      <section id="heading-0" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">准备事项</h2>
        <ul className="list-disc list-inside space-y-2 text-base leading-relaxed">
          <li>确保您的 ChatGPT 账号可以正常登录</li>
          <li>准备好您的 Access Token（详见「如何获取 Token」指南）</li>
          <li>确认您的微信账户有足够余额</li>
        </ul>
      </section>

      <section id="heading-1" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">充值步骤</h2>
        <ol className="list-decimal list-inside space-y-4 text-base leading-relaxed">
          <li>
            <strong>访问充值页面</strong>
            <p className="mt-2 ml-6">前往 paymodels.info/order?plan=plus</p>
          </li>
          <li>
            <strong>确认订单信息</strong>
            <p className="mt-2 ml-6">核对充值金额和服务内容</p>
          </li>
          <li>
            <strong>粘贴 Token</strong>
            <p className="mt-2 ml-6">在指定区域粘贴您的 Access Token</p>
          </li>
          <li>
            <strong>选择支付方式</strong>
            <p className="mt-2 ml-6">选择微信支付并完成付款</p>
          </li>
          <li>
            <strong>等待处理</strong>
            <p className="mt-2 ml-6">充值通常在 3-6 小时内完成</p>
          </li>
        </ol>
      </section>

      <section id="heading-2" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">充值后验证</h2>
        <p className="text-base leading-relaxed">
          充值完成后，您可以登录 ChatGPT 查看订阅状态。Plus 会员将享受更快的响应速度、
          优先访问权以及 GPT-4 模型的使用权限。
        </p>
      </section>

      <DocComments slug="guide-recharge-plus" />
    </DocLayout>
  );
}
