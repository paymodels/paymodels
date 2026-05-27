import { ReactNode } from 'react';

interface DocOrderedListProps {
  children: ReactNode;
  className?: string;
}

export function DocOrderedList({ children, className = '' }: DocOrderedListProps) {
  return (
    <ol className={`list-decimal list-inside space-y-4 text-base leading-relaxed ${className}`}>
      {children}
    </ol>
  );
}
