import { ReactNode } from 'react';

interface DocParagraphProps {
  children: ReactNode;
  className?: string;
}

export function DocParagraph({ children, className = '' }: DocParagraphProps) {
  return (
    <p className={`text-base leading-relaxed text-foreground ${className}`}>
      {children}
    </p>
  );
}
