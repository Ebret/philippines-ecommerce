import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const avatarVariants = cva(
  'inline-flex items-center justify-center rounded-full bg-neutral-200 text-neutral-700 font-semibold',
  {
    variants: {
      size: {
        xs: 'h-6 w-6 text-xs',
        sm: 'h-8 w-8 text-sm',
        md: 'h-10 w-10 text-base',
        lg: 'h-12 w-12 text-lg',
        xl: 'h-16 w-16 text-xl',
        '2xl': 'h-20 w-20 text-2xl',
      },
      variant: {
        default: 'bg-primary-100 text-primary-700',
        secondary: 'bg-secondary-100 text-secondary-700',
        success: 'bg-success-100 text-success-700',
        error: 'bg-error-100 text-error-700',
        warning: 'bg-warning-100 text-warning-700',
        neutral: 'bg-neutral-200 text-neutral-700',
      },
      status: {
        none: '',
        online: 'ring-2 ring-success-500',
        offline: 'ring-2 ring-neutral-400',
        away: 'ring-2 ring-warning-500',
        busy: 'ring-2 ring-error-500',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
      status: 'none',
    },
  }
);

interface AvatarProps
  extends React.ImgHTMLAttributes<HTMLImageElement>,
    VariantProps<typeof avatarVariants> {
  initials?: string;
  fallback?: React.ReactNode;
}

const Avatar = React.forwardRef<HTMLImageElement, AvatarProps>(
  (
    {
      className,
      size,
      variant,
      status,
      src,
      alt,
      initials,
      fallback,
      ...props
    },
    ref
  ) => {
    const [imageError, setImageError] = React.useState(false);

    const handleError = () => {
      setImageError(true);
    };

    const displayContent = imageError || !src ? (
      <div className={cn(avatarVariants({ size, variant, status }), className)}>
        {fallback || initials || '?'}
      </div>
    ) : (
      <img
        ref={ref}
        src={src}
        alt={alt}
        className={cn(avatarVariants({ size, variant, status }), className)}
        onError={handleError}
        {...props}
      />
    );

    return displayContent;
  }
);
Avatar.displayName = 'Avatar';

export { Avatar, avatarVariants };

