import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '提交订单',
    description:
        '提交 ChatGPT Plus / Pro 充值订单，填写 Access Token 完成支付。官方渠道充值，充值失败全额退款。',
};

export default function OrderLayout({ children }: { children: React.ReactNode }) {
    return children;
}
