import { ReactNode } from 'react';

interface DocSectionProps {
    id?: string;
    className?: string;
    children: ReactNode;
}

export function DocSection({ id, className = '', children }: DocSectionProps) {
    return (
        <section id={id} className={`mb-10 scroll-mt-24 ${className}`}>
            {children}
        </section>
    );
}
