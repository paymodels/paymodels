import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
    {
        q: 'Plus 代充安全吗？会不会导致封号？',
        a: '我们通过官方支付渠道为您充值，整个过程无需您的账号密码，只需一个临时会话令牌，充值完成后立即删除。所有充值均走正规通道，至今已为零封号记录，已服务超过 1000 位用户。',
    },
    {
        q: '没有海外信用卡，如何充值 Plus？',
        a: '这正是 PayModels 的核心价值。您使用微信支付即可完成 ChatGPT Plus 订阅，不需要海外信用卡、PayPal 或任何外币账户。全程以人民币结算，简单便捷。',
    },
    {
        q: '充值大概多久能到账？',
        a: '充值由人工处理，通常 3–6 小时内完成。到账后我们会通过邮件通知您，您也可以在 ChatGPT 设置页面查看订阅状态。感谢您的耐心等待。',
    },
    {
        q: 'Plus 代充多少钱？',
        a: '月卡 ¥189/月，支持微信支付。充值不成功全额退款，无任何隐藏费用。',
    },
    {
        q: '如果充值失败了怎么办？',
        a: '不成功全额退款是我们的承诺。如遇任何问题，可通过页面右下角联系客服，我们会第一时间响应并为您处理。',
    },
    {
        q: '除了 Plus，还支持哪些服务？',
        a: '目前支持 ChatGPT Plus 月卡，以及 ChatGPT Pro 5X（$120/月）和 Pro 20X（$225/月）的代充。后续将陆续支持更多 AI 服务，敬请期待。',
    },
];

export default function FAQ() {
    return (
        <section className="bg-muted/10 py-20 sm:py-28">
            <div className="mx-auto max-w-3xl px-6">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">常见问题</h2>
                    <p className="mt-4 text-muted-foreground">关于 Plus / Pro 充值的常见疑问</p>
                </div>

                <Accordion type="single" collapsible className="mt-12">
                    {faqs.map((faq, i) => (
                        <AccordionItem key={i} value={`item-${i}`}>
                            <AccordionTrigger>{faq.q}</AccordionTrigger>
                            <AccordionContent>
                                <p className="leading-relaxed text-muted-foreground">{faq.a}</p>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
}
