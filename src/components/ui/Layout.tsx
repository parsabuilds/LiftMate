import type { ReactNode } from 'react';

interface LayoutProps {
  title?: string;
  children: ReactNode;
}

export function Layout({ title, children }: LayoutProps) {
  return (
    <div className="max-w-[430px] mx-auto px-4 pb-24 min-h-screen" style={{ paddingTop: 'calc(1.5rem + env(safe-area-inset-top))' }}>
      {title && <h1 className="text-2xl font-bold text-text mb-6">{title}</h1>}
      {children}
    </div>
  );
}
