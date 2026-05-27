import { Metadata } from 'next';
import { DocLayout } from '@/app/components/docs/DocLayout';
import { DocComments } from '@/app/components/docs/DocComments';
import { DocPageHeader } from '@/components/docs/DocPageHeader';
import { DocSection } from '@/components/docs/DocSection';
import { DocH2 } from '@/components/docs/DocH2';
import { DocParagraph } from '@/components/docs/DocParagraph';
import { DocOrderedList } from '@/components/docs/DocOrderedList';
import { DocStepItem } from '@/components/docs/DocStepItem';
import { DocUnorderedList } from '@/components/docs/DocUnorderedList';

export const metadata: Metadata = {
  title: '如何获取 Token',
  description: '获取 ChatGPT Access Token 的详细步骤',
};

export default function TokenGuidePage() {
  return (
    <DocLayout slug="guide-token">
      <DocPageHeader
        title="如何获取 Token"
        description="本文将详细介绍如何获取 ChatGPT 的 Access Token，用于充值服务"
      />

      <DocSection id="heading-0">
        <DocH2>什么是 Access Token</DocH2>
        <DocParagraph>
          Access Token 是 ChatGPT 官方提供的临时会话令牌，用于验证您的账号身份。
          它不包含您的密码信息，且仅在本次充值过程中使用，充值完成后立即失效。
        </DocParagraph>
      </DocSection>

      <DocSection id="heading-1">
        <DocH2>获取步骤</DocH2>
        <DocOrderedList>
          <DocStepItem
            title="登录 ChatGPT"
            description="访问 chatgpt.com 并使用您的账号登录"
          />
          <DocStepItem
            title="打开开发者工具"
            description="按 F12 或右键选择「检查」打开开发者工具"
          />
          <DocStepItem
            title="找到 Network 标签"
            description="切换到 Network（网络）标签页"
          />
          <DocStepItem
            title="刷新页面"
            description="按 F5 刷新页面，查看网络请求"
          />
          <DocStepItem
            title="找到 session 请求"
            description="搜索包含 &quot;session&quot; 的请求，在 Response 中找到 accessToken"
          />
        </DocOrderedList>
      </DocSection>

      <DocSection id="heading-2">
        <DocH2>注意事项</DocH2>
        <DocUnorderedList>
          <li>Token 有效期通常为 1-2 小时，请尽快使用</li>
          <li>不要将 Token 分享给他人</li>
          <li>如果遇到问题，请联系客服获取帮助</li>
        </DocUnorderedList>
      </DocSection>

      <DocComments slug="guide-token" />
    </DocLayout>
  );
}
