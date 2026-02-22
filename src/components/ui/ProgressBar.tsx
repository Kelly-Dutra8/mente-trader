import React from 'react';

interface ProgressBarProps {
  value: number;   // 0–100
  max?: number;
  label?: string;
  showLabel?: boolean;
  color?: 'blue' | 'green' | 'red' | 'yellow';
  size?: 'sm' | 'md' | 'lg';
}

const colorClasses = {
  blue: 'bg-accent',
  green: 'bg-profit',
  red: 'bg-loss',
  yellow: 'bg-yellow-500',
};

const sizeClasses = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

export function ProgressBar({
  value,
  max = 100,
  label,
  showLabel = true,
  color = 'blue',
  size = 'md',
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className="w-full">
      {(label || showLabel) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-xs text-slate-400">{label}</span>}
          {showLabel && (
            <span className="text-xs font-medium text-slate-300">
              {Math.round(pct)}%
            </span>
          )}
        </div>
      )}
      <div className={`w-full bg-dark-700 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
