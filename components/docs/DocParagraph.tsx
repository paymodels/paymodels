import { ReactNode } from 'react';

interface DocParagraphProps {
    children: ReactNode;
    className?: string;
}

export function DocParagraph({ children, className = '' }: DocParagraphProps) {
    return (
        <p className={`text-base leading-[1.8] text-foreground/85 max-w-[65ch] ${className}`}>
            {children}
        </p>
    );
}
