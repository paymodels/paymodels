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
  title: '如何充值 Pro',
  description: 'ChatGPT Pro 充值详细教程',
};

export default function RechargeProPage() {
  return (
    <DocLayout slug="guide-recharge-pro">
      <DocPageHeader
        title="如何充值 Pro"
        description="ChatGPT Pro 5X 和 Pro 20X 充值指南"
      />

      <DocSection id="heading-0">
        <DocH2>Pro 计划介绍</DocH2>
        <DocParagraph>
          ChatGPT Pro 是面向高频用户的升级方案，提供更高级的功能和更大的使用额度。
          目前支持 Pro 5X（$120/月）和 Pro 20X（$225/月）两种方案。
        </DocParagraph>
      </DocSection>

      <DocSection id="heading-1">
        <DocH2>充值流程</DocH2>
        <DocOrderedList>
          <DocStepItem
            title="选择方案"
            description="根据您的需求选择 Pro 5X 或 Pro 20X"
          />
          <DocStepItem
            title="访问对应页面"
            description="Pro 5X: /order?plan=pro5x；Pro 20X: /order?plan=pro20x"
          />
          <DocStepItem
            title="完成支付"
            description="支持微信支付和 Stripe 支付"
          />
        </DocOrderedList>
      </DocSection>

      <DocSection id="heading-2">
        <DocH2>常见问题</DocH2>
        <DocUnorderedList>
          <li>Pro 充值后功能何时生效？通常在 3-6 小时内</li>
          <li>可以升级现有 Plus 到 Pro 吗？可以，联系客服处理</li>
          <li>Pro 有使用限制吗？有月度额度限制，详见具体方案说明</li>
        </DocUnorderedList>
      </DocSection>

      <DocComments slug="guide-recharge-pro" />
    </DocLayout>
  );
}
