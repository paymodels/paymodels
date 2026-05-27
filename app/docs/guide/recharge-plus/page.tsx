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
    title: '如何充值 Plus',
    description: 'ChatGPT Plus 充值详细教程',
};

export default function RechargePlusPage() {
    return (
        <DocLayout slug="guide-recharge-plus">
            <DocPageHeader
                title="如何充值 Plus"
                description="通过 PayModels 充值 ChatGPT Plus 的详细步骤"
            />

            <DocSection id="heading-0">
                <DocH2>准备事项</DocH2>
                <DocUnorderedList>
                    <li>确保您的 ChatGPT 账号可以正常登录</li>
                    <li>准备好您的 Access Token（详见「如何获取 Token」指南）</li>
                    <li>确认您的微信账户有足够余额</li>
                </DocUnorderedList>
            </DocSection>

            <DocSection id="heading-1">
                <DocH2>充值步骤</DocH2>
                <DocOrderedList>
                    <DocStepItem
                        title="访问充值页面"
                        description="前往 paymodels.info/order?plan=plus"
                    />
                    <DocStepItem title="确认订单信息" description="核对充值金额和服务内容" />
                    <DocStepItem title="粘贴 Token" description="在指定区域粘贴您的 Access Token" />
                    <DocStepItem title="选择支付方式" description="选择微信支付并完成付款" />
                    <DocStepItem title="等待处理" description="充值通常在 3-6 小时内完成" />
                </DocOrderedList>
            </DocSection>

            <DocSection id="heading-2">
                <DocH2>充值后验证</DocH2>
                <DocParagraph>
                    充值完成后，您可以登录 ChatGPT 查看订阅状态。Plus 会员将享受更快的响应速度、
                    优先访问权以及 GPT-4 模型的使用权限。
                </DocParagraph>
            </DocSection>

            <DocComments slug="guide-recharge-plus" />
        </DocLayout>
    );
}
