'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface KPIWidgetProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
    label?: string;
  };
  color?: 'primary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
}

const colorClasses = {
  primary: 'bg-primary-50 border-primary-200 text-primary-900',
  success: 'bg-green-50 border-green-200 text-green-900',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-900',
  error: 'bg-red-50 border-red-200 text-red-900',
  info: 'bg-blue-50 border-blue-200 text-blue-900',
};

const iconColorClasses = {
  primary: 'text-primary-600',
  success: 'text-green-600',
  warning: 'text-yellow-600',
  error: 'text-red-600',
  info: 'text-blue-600',
};

const sizeClasses = {
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

const KPIWidget = React.forwardRef<HTMLDivElement, KPIWidgetProps>(
  (
    {
      title,
      value,
      unit,
      icon,
      trend,
      color = 'primary',
      size = 'md',
      onClick,
      className,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        onClick={onClick}
        className={cn(
          'rounded-lg border transition-all',
          colorClasses[color],
          sizeClasses[size],
          onClick && 'cursor-pointer hover:shadow-md',
          className
        )}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-medium opacity-75">{title}</p>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-bold">{value}</span>
              {unit && <span className="text-sm opacity-75">{unit}</span>}
            </div>
          </div>
          {icon && <div className={cn('text-2xl', iconColorClasses[color])}>{icon}</div>}
        </div>

        {trend && (
          <div className="mt-3 flex items-center gap-1">
            <Badge
              variant={
                trend.direction === 'up'
                  ? 'success'
                  : trend.direction === 'down'
                    ? 'error'
                    : 'secondary'
              }
              className="text-xs"
            >
              {trend.direction === 'up' && '↑'}
              {trend.direction === 'down' && '↓'}
              {trend.direction === 'neutral' && '→'}
              {Math.abs(trend.value)}%
            </Badge>
            {trend.label && <span className="text-xs opacity-75">{trend.label}</span>}
          </div>
        )}
      </div>
    );
  }
);
KPIWidget.displayName = 'KPIWidget';

export { KPIWidget };

