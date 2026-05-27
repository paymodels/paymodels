import { Metadata } from 'next';
import { DocLayout } from '@/app/components/docs/DocLayout';
import { DocComments } from '@/app/components/docs/DocComments';
import { docContents } from '@/lib/docs/content';

export const metadata: Metadata = {
  title: '常见问题',
  description: '关于 ChatGPT Plus / Pro 充值的常见疑问',
};

export default function FAQPage() {
  const content = docContents.faq;

  return (
    <DocLayout slug="faq">
      <h1 className="text-3xl font-bold tracking-tight mb-4">{content.title}</h1>
      <p className="text-lg text-muted-foreground mb-8">{content.description}</p>

      <div className="flex flex-col gap-8">
        {content.sections.map((section, index) => (
          <section key={index} id={`heading-${index}`}>
            <h2 className="text-2xl font-semibold mb-4">{section.heading}</h2>
            <p className="text-base leading-relaxed text-foreground">
              {section.content}
            </p>
          </section>
        ))}
      </div>

      <DocComments slug="faq" />
    </DocLayout>
  );
}
