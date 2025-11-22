import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'bg-primary/10 text-primary hover:bg-primary/20',
        secondary: 'bg-secondary/10 text-secondary hover:bg-secondary/20',
        success: 'bg-success/10 text-success hover:bg-success/20',
        error: 'bg-error/10 text-error hover:bg-error/20',
        warning: 'bg-warning/10 text-warning hover:bg-warning/20',
        accent: 'bg-accent/10 text-accent hover:bg-accent/20',
        neutral: 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200',
        outline: 'border border-primary/30 text-primary hover:border-primary/50 hover:bg-primary/5',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1 text-sm',
        lg: 'px-4 py-1.5 text-base',
      },
      interactive: {
        true: 'cursor-pointer',
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

