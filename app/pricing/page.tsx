import type { Metadata } from 'next';
import PricingSection from '@/app/components/PricingSection';

export const metadata: Metadata = {
    title: '方案价格',
    description:
        'ChatGPT Plus 月卡 ¥189、Pro 5X ¥864、Pro 20X ¥1620，官方渠道充值，安全可靠。',
};

export default function PricingPage() {
    return <PricingSection />;
}
