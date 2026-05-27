import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '文档中心',
  description: 'PayModels 产品文档、常见问题、使用指南、退款政策和支付方式说明',
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}
