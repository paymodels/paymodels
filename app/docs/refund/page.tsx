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
    title: '退款政策',
    description: 'PayModels 充值失败全额退款政策说明',
};

export default function RefundPage() {
    return (
        <DocLayout slug="refund">
            <DocPageHeader title="退款政策" description="不成功全额退款是我们的承诺" />

            <DocSection id="heading-0">
                <DocH2>退款原则</DocH2>
                <DocParagraph>
                    如果由于任何原因导致您的充值未能成功完成，我们将全额退还您支付的所有费用。
                    无需任何理由，无需复杂流程，退款将在 3-5 个工作日内原路返回。
                </DocParagraph>
            </DocSection>

            <DocSection id="heading-1">
                <DocH2>退款流程</DocH2>
                <DocOrderedList>
                    <DocStepItem
                        title="联系客服"
                        description="通过页面右下角的客服按钮或邮件联系"
                    />
                    <DocStepItem title="提供信息" description="提供订单号和支付凭证" />
                    <DocStepItem title="审核处理" description="我们将在 24 小时内审核并处理" />
                    <DocStepItem title="退款到账" description="3-5 个工作日内原路退回" />
                </DocOrderedList>
            </DocSection>

            <DocSection id="heading-2">
                <DocH2>注意事项</DocH2>
                <DocUnorderedList>
                    <li>已成功完成的充值不支持退款</li>
                    <li>退款将退回至原支付账户</li>
                    <li>如有疑问请联系客服获取帮助</li>
                </DocUnorderedList>
            </DocSection>

            <DocComments slug="refund" />
        </DocLayout>
    );
}
