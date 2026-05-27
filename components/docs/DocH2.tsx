import { ReactNode } from 'react';

interface DocH2Props {
  children: ReactNode;
}

export function DocH2({ children }: DocH2Props) {
  return (
    <h2 className="text-xl sm:text-2xl font-semibold tracking-tight mb-4 text-foreground scroll-mt-24">
      {children}
    </h2>
  );
}
