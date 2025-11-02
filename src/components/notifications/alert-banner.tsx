'use client';

import React, { useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const alertBannerVariants = cva(
  'w-full px-4 py-3 flex items-center gap-3 border-b-4 animate-in fade-in slide-in-from-top-2 duration-300',
  {
    variants: {
      severity: {
        success: 'bg-green-50 border-green-500 text-green-800',
        error: 'bg-red-50 border-red-500 text-red-800',
        info: 'bg-blue-50 border-blue-500 text-blue-800',
        warning: 'bg-yellow-50 border-yellow-500 text-yellow-800',
      },
      dismissible: {
        true: 'pr-12',
        false: '',
      },
    },
    defaultVariants: {
      severity: 'info',
      dismissible: true,
    },
  }
);

interface AlertBannerProps extends VariantProps<typeof alertBannerVariants> {
  title: string;
  message?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss?: () => void;
  className?: string;
}

const severityIcons = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
  warning: '⚠',
};

export const AlertBanner: React.FC<AlertBannerProps> = ({
  title,
  message,
  icon,
  severity = 'info',
  dismissible = true,
  action,
  onDismiss,
  className,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  return (
    <div
      className={cn(alertBannerVariants({ severity, dismissible }), className)}
      role="alert"
      aria-live="assertive"
    >
      {icon || (
        <span className="text-xl font-bold flex-shrink-0">
          {severityIcons[severity as keyof typeof severityIcons]}
        </span>
      )}
      <div className="flex-1">
        <div className="font-semibold">{title}</div>
        {message && <div className="text-sm opacity-90">{message}</div>}
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="ml-2 font-semibold hover:opacity-80 transition-opacity whitespace-nowrap"
        >
          {action.label}
        </button>
      )}
      {dismissible && (
        <button
          onClick={handleDismiss}
          className="absolute right-4 text-lg font-bold hover:opacity-60 transition-opacity"
          aria-label="Dismiss alert"
        >
          ×
        </button>
      )}
    </div>
  );
};

// Multiple alerts container
interface AlertBannerContainerProps {
  alerts: AlertBannerProps[];
  onRemove: (index: number) => void;
}

export const AlertBannerContainer: React.FC<AlertBannerContainerProps> = ({
  alerts,
  onRemove,
}) => {
  return (
    <div className="w-full space-y-0">
      {alerts.map((alert, index) => (
        <AlertBanner
          key={index}
          {...alert}
          onDismiss={() => onRemove(index)}
        />
      ))}
    </div>
  );
};

// Hook for managing alerts
export const useAlertBanner = () => {
  const [alerts, setAlerts] = useState<AlertBannerProps[]>([]);

  const addAlert = (alert: Omit<AlertBannerProps, 'onDismiss'>) => {
    const id = Date.now();
    setAlerts((prev) => [...prev, { ...alert, onDismiss: () => removeAlert(id) }]);
    return id;
  };

  const removeAlert = (id: number) => {
    setAlerts((prev) => prev.filter((_, i) => i !== id));
  };

  const success = (title: string, message?: string) =>
    addAlert({ title, message, severity: 'success' });

  const error = (title: string, message?: string) =>
    addAlert({ title, message, severity: 'error' });

  const info = (title: string, message?: string) =>
    addAlert({ title, message, severity: 'info' });

  const warning = (title: string, message?: string) =>
    addAlert({ title, message, severity: 'warning' });

  return { alerts, addAlert, removeAlert, success, error, info, warning };
};

