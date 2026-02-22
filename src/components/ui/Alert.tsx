import React from 'react';
import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';

type AlertType = 'info' | 'warning' | 'success' | 'error';

interface AlertProps {
  type?: AlertType;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const configs: Record<AlertType, { bg: string; border: string; icon: React.ReactNode; titleColor: string }> = {
  info: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    titleColor: 'text-blue-400',
    icon: <Info size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />,
  },
  warning: {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    titleColor: 'text-yellow-400',
    icon: <AlertTriangle size={18} className="text-yellow-400 flex-shrink-0 mt-0.5" />,
  },
  success: {
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    titleColor: 'text-green-400',
    icon: <CheckCircle size={18} className="text-green-400 flex-shrink-0 mt-0.5" />,
  },
  error: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    titleColor: 'text-red-400',
    icon: <XCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />,
  },
};

export function Alert({ type = 'info', title, children, className = '' }: AlertProps) {
  const cfg = configs[type];

  return (
    <div
      className={`flex gap-3 p-4 rounded-xl border ${cfg.bg} ${cfg.border} ${className}`}
    >
      {cfg.icon}
      <div className="flex-1 min-w-0">
        {title && (
          <p className={`font-semibold text-sm mb-1 ${cfg.titleColor}`}>{title}</p>
        )}
        <div className="text-sm text-slate-300 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
