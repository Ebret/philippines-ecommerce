'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IconBadgeProps {
  icon: LucideIcon;
  label?: string;
  badge?: number | string;
  variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'success' | 'error' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  onClick?: () => void;
}

/**
 * IconBadge Component
 * Displays an icon with optional badge and label
 * Supports multiple variants and sizes with smooth animations
 */
export function IconBadge({
  icon: Icon,
  label,
  badge,
  variant = 'default',
  size = 'md',
  animated = false,
  onClick,
}: IconBadgeProps) {
  const variantClasses = {
    default: 'bg-muted text-muted-foreground',
    primary: 'bg-primary/20 text-primary',
    secondary: 'bg-secondary/20 text-secondary',
    accent: 'bg-accent/20 text-accent',
    success: 'bg-success/20 text-success',
    error: 'bg-error/20 text-error',
    warning: 'bg-warning/20 text-warning',
  };

  const sizeClasses = {
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-4',
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const badgeVariantClasses = {
    default: 'bg-accent text-accent-foreground',
    primary: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    accent: 'bg-accent text-accent-foreground',
    success: 'bg-success text-success-foreground',
    error: 'bg-error text-error-foreground',
    warning: 'bg-warning text-warning-foreground',
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          'relative rounded-lg transition-all duration-300',
          variantClasses[variant],
          sizeClasses[size],
          animated && 'hover:scale-110 cursor-pointer',
          onClick && 'cursor-pointer'
        )}
        onClick={onClick}
      >
        <Icon className={cn('transition-transform duration-300', iconSizeClasses[size])} />

        {/* Badge */}
        {badge && (
          <div
            className={cn(
              'absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shadow-lg',
              badgeVariantClasses[variant],
              animated && 'animate-pulse'
            )}
          >
            {typeof badge === 'number' && badge > 99 ? '99+' : badge}
          </div>
        )}
      </div>

      {/* Label */}
      {label && <span className="text-sm font-medium text-foreground">{label}</span>}
    </div>
  );
}

export default IconBadge;

