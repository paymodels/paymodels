import { Metadata } from 'next';
import { DocLayout } from '@/app/components/docs/DocLayout';
import { DocComments } from '@/app/components/docs/DocComments';

export const metadata: Metadata = {
  title: '如何获取 Token',
  description: '获取 ChatGPT Access Token 的详细步骤',
};

export default function TokenGuidePage() {
  return (
    <DocLayout slug="guide-token">
      <h1 className="text-3xl font-bold tracking-tight mb-4">如何获取 Token</h1>
      <p className="text-lg text-muted-foreground mb-8">
        本文将详细介绍如何获取 ChatGPT 的 Access Token，用于充值服务
      </p>

      <section id="heading-0" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">什么是 Access Token</h2>
        <p className="text-base leading-relaxed">
          Access Token 是 ChatGPT 官方提供的临时会话令牌，用于验证您的账号身份。
          它不包含您的密码信息，且仅在本次充值过程中使用，充值完成后立即失效。
        </p>
      </section>

      <section id="heading-1" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">获取步骤</h2>
        <ol className="list-decimal list-inside space-y-4 text-base leading-relaxed">
          <li>
            <strong>登录 ChatGPT</strong>
            <p className="mt-2 ml-6">访问 chatgpt.com 并使用您的账号登录</p>
          </li>
          <li>
            <strong>打开开发者工具</strong>
            <p className="mt-2 ml-6">按 F12 或右键选择「检查」打开开发者工具</p>
          </li>
          <li>
            <strong>找到 Network 标签</strong>
            <p className="mt-2 ml-6">切换到 Network（网络）标签页</p>
          </li>
          <li>
            <strong>刷新页面</strong>
            <p className="mt-2 ml-6">按 F5 刷新页面，查看网络请求</p>
          </li>
          <li>
            <strong>找到 session 请求</strong>
            <p className="mt-2 ml-6">搜索包含 &quot;session&quot; 的请求，在 Response 中找到 accessToken</p>
          </li>
        </ol>
      </section>

      <section id="heading-2" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">注意事项</h2>
        <ul className="list-disc list-inside space-y-2 text-base leading-relaxed">
          <li>Token 有效期通常为 1-2 小时，请尽快使用</li>
          <li>不要将 Token 分享给他人</li>
          <li>如果遇到问题，请联系客服获取帮助</li>
        </ul>
      </section>

      <DocComments slug="guide-token" />
    </DocLayout>
  );
}
