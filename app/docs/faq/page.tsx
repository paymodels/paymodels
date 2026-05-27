import { Metadata } from 'next';
import { DocLayout } from '@/app/components/docs/DocLayout';
import { DocComments } from '@/app/components/docs/DocComments';
import { DocPageHeader } from '@/components/docs/DocPageHeader';
import { DocSection } from '@/components/docs/DocSection';
import { DocH2 } from '@/components/docs/DocH2';
import { DocParagraph } from '@/components/docs/DocParagraph';
import { docContents } from '@/lib/docs/content';

export const metadata: Metadata = {
    title: '常见问题',
    description: '关于 ChatGPT Plus / Pro 充值的常见疑问',
};

export default function FAQPage() {
    const content = docContents.faq;

    return (
        <DocLayout slug="faq">
            <DocPageHeader title={content.title} description={content.description} />

            <div className="flex flex-col gap-8">
                {content.sections.map((section, index) => (
                    <DocSection key={index} id={`heading-${index}`}>
                        <DocH2>{section.heading}</DocH2>
                        <DocParagraph>{section.content}</DocParagraph>
                    </DocSection>
                ))}
            </div>

            <DocComments slug="faq" />
        </DocLayout>
    );
}
