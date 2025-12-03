'use client';

import React from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeedbackProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  onClose?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * VisualFeedback Component
 * Displays success, error, warning, or info messages with smooth animations
 */
export function VisualFeedback({
  type,
  title,
  message,
  onClose,
  action,
}: FeedbackProps) {
  const config = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-success/10',
      borderColor: 'border-success/50',
      textColor: 'text-success',
      titleColor: 'text-success-foreground',
    },
    error: {
      icon: AlertCircle,
      bgColor: 'bg-error/10',
      borderColor: 'border-error/50',
      textColor: 'text-error',
      titleColor: 'text-error-foreground',
    },
    warning: {
      icon: AlertCircle,
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/50',
      textColor: 'text-warning',
      titleColor: 'text-warning-foreground',
    },
    info: {
      icon: Info,
      bgColor: 'bg-info/10',
      borderColor: 'border-info/50',
      textColor: 'text-info',
      titleColor: 'text-info-foreground',
    },
  };

  const Icon = config[type].icon;

  return (
    <div
      className={cn(
        'rounded-lg border p-4 animate-in fade-in slide-in-from-top-2 duration-300',
        config[type].bgColor,
        config[type].borderColor
      )}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', config[type].textColor)} />

        {/* Content */}
        <div className="flex-1">
          <h4 className={cn('font-semibold mb-1', config[type].titleColor)}>{title}</h4>
          <p className="text-sm text-foreground/80">{message}</p>

          {/* Action Button */}
          {action && (
            <button
              onClick={action.onClick}
              className={cn(
                'mt-3 text-sm font-medium px-3 py-1 rounded transition-colors duration-200',
                `hover:${config[type].bgColor}`,
                config[type].textColor
              )}
            >
              {action.label}
            </button>
          )}
        </div>

        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 text-foreground/50 hover:text-foreground transition-colors duration-200"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}

export default VisualFeedback;

