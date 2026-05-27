import { ReactNode } from 'react';

interface DocAlertProps {
  variant?: 'info' | 'warning' | 'success';
  children: ReactNode;
}

export function DocAlert({ variant = 'info', children }: DocAlertProps) {
  const variantStyles = {
    info: 'bg-muted/50 border-border',
    warning: 'bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800',
    success: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800',
  };

  return (
    <div className={`rounded-lg border p-4 my-6 ${variantStyles[variant]}`}>
      {children}
    </div>
  );
}
