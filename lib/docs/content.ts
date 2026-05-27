export interface DocContent {
    title: string;
    description: string;
    sections: {
        heading: string;
        content: string;
    }[];
}

export const docContents: Record<string, DocContent> = {
    faq: {
        title: '常见问题',
        description: '关于 ChatGPT Plus / Pro 充值的常见疑问',
        sections: [
            {
                heading: 'Plus 代充安全吗？会不会导致封号？',
                content:
                    '我们通过官方支付渠道为您充值，整个过程无需您的账号密码，只需一个临时会话令牌，充值完成后立即删除。所有充值均走正规通道，至今已为零封号记录，已服务超过 1000 位用户。',
            },
            {
                heading: '没有海外信用卡，如何充值 Plus？',
                content:
                    '这正是 PayModels 的核心价值。您使用微信支付即可完成 ChatGPT Plus 订阅，不需要海外信用卡、PayPal 或任何外币账户。全程以人民币结算，简单便捷。',
            },
            {
                heading: '充值大概多久能到账？',
                content:
                    '充值由人工处理，通常 3–6 小时内完成。到账后我们会通过邮件通知您，您也可以在 ChatGPT 设置页面查看订阅状态。感谢您的耐心等待。',
            },
            {
                heading: 'Plus 代充多少钱？',
                content: '月卡 ¥189/月，支持微信支付。充值不成功全额退款，无任何隐藏费用。',
            },
            {
                heading: '如果充值失败了怎么办？',
                content:
                    '不成功全额退款是我们的承诺。如遇任何问题，可通过页面右下角联系客服，我们会第一时间响应并为您处理。',
            },
            {
                heading: '除了 Plus，还支持哪些服务？',
                content:
                    '目前支持 ChatGPT Plus 月卡，以及 ChatGPT Pro 5X（$120/月）和 Pro 20X（$225/月）的代充。后续将陆续支持更多 AI 服务，敬请期待。',
            },
        ],
    },
    // 其他文档内容将在后续步骤中添加
};
