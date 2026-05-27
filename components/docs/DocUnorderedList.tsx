import { ReactNode } from 'react';

interface DocUnorderedListProps {
  children: ReactNode;
  className?: string;
}

export function DocUnorderedList({ children, className = '' }: DocUnorderedListProps) {
  return (
    <ul className={`list-disc list-inside space-y-2 text-base leading-relaxed ${className}`}>
      {children}
    </ul>
  );
}
