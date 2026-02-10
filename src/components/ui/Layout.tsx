import type { ReactNode } from 'react';

interface LayoutProps {
  title?: string;
  children: ReactNode;
}

export function Layout({ title, children }: LayoutProps) {
  return (
    <div className="max-w-[430px] mx-auto px-4 pb-24 pt-6 min-h-screen">
      {title && <h1 className="text-2xl font-bold text-text mb-6">{title}</h1>}
      {children}
    </div>
  );
}
