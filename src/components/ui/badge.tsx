import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-3 py-1 text-xs font-bold transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'bg-primary/10 text-primary hover:bg-primary/20',
        secondary: 'bg-secondary/10 text-secondary-foreground hover:bg-secondary/20',
        success: 'bg-success/10 text-success hover:bg-success/20',
        error: 'bg-error/10 text-error hover:bg-error/20',
        warning: 'bg-warning/10 text-warning hover:bg-warning/20',
        accent: 'bg-accent/10 text-accent-foreground hover:bg-accent/20',
        neutral: 'bg-muted text-muted-foreground hover:bg-muted/80',
        outline: 'border border-primary/30 text-primary hover:border-primary/50 hover:bg-primary/5',
        // Platform-specific badges (Extreme Life style)
        shopee: 'bg-[#EE4D2D] text-white hover:bg-[#EE4D2D]/90 shadow-sm',
        lazada: 'bg-[#0F156D] text-white hover:bg-[#0F156D]/90 shadow-sm',
        flashSale: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-sm animate-pulse',
        // Stock status badges
        inStock: 'bg-success/10 text-success border border-success/20',
        lowStock: 'bg-warning/10 text-warning border border-warning/20',
        outOfStock: 'bg-error/10 text-error border border-error/20',
        // Category badge (backdrop blur style)
        category: 'bg-background/80 backdrop-blur text-primary border border-primary/20 shadow-sm',
        // Discount badge
        discount: 'bg-error text-white shadow-sm',
      },
      size: {
        sm: 'px-2 py-0.5 text-[10px]',
        md: 'px-3 py-1 text-xs',
        lg: 'px-4 py-1.5 text-sm',
      },
      interactive: {
        true: 'cursor-pointer hover:scale-105',
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

