import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glass?: boolean;
  onClick?: () => void;
  selected?: boolean;
  hoverable?: boolean;
}

export function Card({
  children,
  className = '',
  glass = false,
  onClick,
  selected = false,
  hoverable = false,
}: CardProps) {
  const base = [
    'rounded-2xl border transition-all duration-200',
    glass
      ? 'bg-white/5 backdrop-blur-sm border-white/10'
      : 'bg-dark-800 border-slate-700/50',
    selected
      ? 'border-accent ring-1 ring-accent/40 bg-accent/10'
      : 'border-slate-700/50',
    hoverable || onClick
      ? 'cursor-pointer hover:border-accent/50 hover:bg-dark-700/80'
      : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={base} onClick={onClick} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); } : undefined}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return (
    <div className={`px-6 pt-6 pb-4 border-b border-slate-700/50 ${className}`}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = '' }: CardHeaderProps) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}
