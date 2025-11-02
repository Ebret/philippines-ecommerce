import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary-100 text-primary-800',
        secondary: 'bg-secondary-100 text-secondary-800',
        success: 'bg-success-100 text-success-800',
        error: 'bg-error-100 text-error-800',
        warning: 'bg-warning-100 text-warning-800',
        neutral: 'bg-neutral-100 text-neutral-800',
        outline: 'border border-primary-300 text-primary-700',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1 text-sm',
        lg: 'px-4 py-1.5 text-base',
      },
      interactive: {
        true: 'cursor-pointer hover:opacity-80',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      interactive: false,
    },
  }
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;
  onClose?: () => void;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  (
    { className, variant, size, interactive, icon, onClose, children, ...props },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(badgeVariants({ variant, size, interactive }), className)}
      {...props}
    >
      {icon && <span className="mr-1">{icon}</span>}
      {children}
      {onClose && (
        <button
          onClick={onClose}
          className="ml-1 inline-flex items-center rounded-full hover:bg-black/20"
          aria-label="Close badge"
        >
          ×
        </button>
      )}
    </div>
  )
);
Badge.displayName = 'Badge';

export { Badge, badgeVariants };

