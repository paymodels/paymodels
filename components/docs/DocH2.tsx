import { ReactNode } from 'react';

interface DocH2Props {
  children: ReactNode;
}

export function DocH2({ children }: DocH2Props) {
  return <h2 className="text-2xl font-semibold mb-4">{children}</h2>;
}
