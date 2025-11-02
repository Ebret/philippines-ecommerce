import React from 'react';
import { cn } from '@/lib/utils';

interface RatingProps {
  value: number;
  maxValue?: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  color?: 'primary' | 'secondary' | 'warning';
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
};

const colorClasses = {
  primary: 'text-primary-500',
  secondary: 'text-secondary-500',
  warning: 'text-warning-500',
};

const Rating: React.FC<RatingProps> = ({
  value,
  maxValue = 5,
  onChange,
  readOnly = false,
  size = 'md',
  showLabel = true,
  color = 'warning',
}) => {
  const [hoverValue, setHoverValue] = React.useState<number | null>(null);

  const displayValue = hoverValue !== null ? hoverValue : value;

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {Array.from({ length: maxValue }).map((_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= displayValue;

          return (
            <button
              key={index}
              onClick={() => !readOnly && onChange?.(starValue)}
              onMouseEnter={() => !readOnly && setHoverValue(starValue)}
              onMouseLeave={() => !readOnly && setHoverValue(null)}
              disabled={readOnly}
              className={cn(
                'transition-colors',
                readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
              )}
              aria-label={`Rate ${starValue} out of ${maxValue}`}
            >
              <svg
                className={cn(
                  sizeClasses[size],
                  isFilled ? colorClasses[color] : 'text-neutral-300'
                )}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          );
        })}
      </div>

      {showLabel && (
        <span className="text-sm text-neutral-600">
          {displayValue.toFixed(1)} / {maxValue}
        </span>
      )}
    </div>
  );
};

export { Rating };

