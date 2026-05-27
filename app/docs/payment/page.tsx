import { Metadata } from 'next';
import { DocLayout } from '@/app/components/docs/DocLayout';
import { DocComments } from '@/app/components/docs/DocComments';
import { DocPageHeader } from '@/components/docs/DocPageHeader';
import { DocSection } from '@/components/docs/DocSection';
import { DocH2 } from '@/components/docs/DocH2';
import { DocParagraph } from '@/components/docs/DocParagraph';
import { DocUnorderedList } from '@/components/docs/DocUnorderedList';

export const metadata: Metadata = {
    title: '支付方式说明',
    description: 'PayModels 支持的支付方式介绍',
};

export default function PaymentPage() {
    return (
        <DocLayout slug="payment">
            <DocPageHeader
                title="支付方式说明"
                description="我们支持多种支付方式，确保您能够便捷地完成充值"
            />

            <DocSection id="heading-0">
                <DocH2>微信支付</DocH2>
                <DocParagraph>
                    支持微信扫码支付，无需海外信用卡，全程以人民币结算。
                    支付成功后系统将自动处理您的充值订单。
                </DocParagraph>
            </DocSection>

            <DocSection id="heading-1">
                <DocH2>Stripe 支付</DocH2>
                <DocParagraph>
                    支持国际信用卡和借记卡支付，通过 Stripe 安全支付网关处理。 支持
                    Visa、MasterCard、American Express 等主流信用卡。
                </DocParagraph>
            </DocSection>

            <DocSection id="heading-2">
                <DocH2>支付安全</DocH2>
                <DocUnorderedList>
                    <li>所有支付通过加密通道传输</li>
                    <li>不存储您的银行卡信息</li>
                    <li>支持支付失败自动重试</li>
                </DocUnorderedList>
            </DocSection>

            <DocComments slug="payment" />
        </DocLayout>
    );
}
