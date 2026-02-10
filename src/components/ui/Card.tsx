import type { ReactNode } from 'react';

interface CardProps {
  title?: string;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
}

export function Card({ title, onClick, children, className = '' }: CardProps) {
  const Component = onClick ? 'button' : 'div';
  return (
    <Component
      onClick={onClick}
      className={`
        bg-card border border-border rounded-2xl p-4
        ${onClick ? 'cursor-pointer hover:border-primary/50 active:bg-slate-700 transition-colors w-full text-left' : ''}
        ${className}
      `}
    >
      {title && <h3 className="text-text font-semibold mb-2">{title}</h3>}
      {children}
    </Component>
  );
}
