'use client';

import React, { useEffect, useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const toastVariants = cva(
  'fixed rounded-lg shadow-lg p-4 flex items-center gap-3 animate-in fade-in slide-in-from-right-5 duration-300',
  {
    variants: {
      type: {
        success: 'bg-green-50 border border-green-200 text-green-800',
        error: 'bg-red-50 border border-red-200 text-red-800',
        info: 'bg-blue-50 border border-blue-200 text-blue-800',
        warning: 'bg-yellow-50 border border-yellow-200 text-yellow-800',
      },
      position: {
        'top-right': 'top-4 right-4',
        'top-left': 'top-4 left-4',
        'bottom-right': 'bottom-4 right-4',
        'bottom-left': 'bottom-4 left-4',
      },
      size: {
        sm: 'text-sm max-w-xs',
        md: 'text-base max-w-sm',
        lg: 'text-lg max-w-md',
      },
    },
    defaultVariants: {
      type: 'info',
      position: 'top-right',
      size: 'md',
    },
  }
);

interface ToastNotificationProps extends VariantProps<typeof toastVariants> {
  message: string;
  title?: string;
  icon?: React.ReactNode;
  duration?: number;
  onClose?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const typeIcons = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
  warning: '⚠',
};

export const ToastNotification: React.FC<ToastNotificationProps> = ({
  message,
  title,
  icon,
  type = 'info',
  position = 'top-right',
  size = 'md',
  duration = 5000,
  onClose,
  action,
  className,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={cn(toastVariants({ type, position, size }), className)}
      role="alert"
      aria-live="polite"
    >
      {icon || (
        <span className="text-lg font-bold">
          {typeIcons[type as keyof typeof typeIcons]}
        </span>
      )}
      <div className="flex-1">
        {title && <div className="font-semibold">{title}</div>}
        <div>{message}</div>
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="ml-2 font-semibold hover:opacity-80 transition-opacity"
        >
          {action.label}
        </button>
      )}
      <button
        onClick={() => {
          setIsVisible(false);
          onClose?.();
        }}
        className="ml-2 text-lg font-bold hover:opacity-60 transition-opacity"
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
};

// Toast Container for managing multiple toasts
interface ToastContainerProps {
  toasts: ToastNotificationProps[];
  onRemove: (index: number) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  return (
    <div className="fixed inset-0 pointer-events-none">
      {toasts.map((toast, index) => (
        <div key={index} className="pointer-events-auto">
          <ToastNotification
            {...toast}
            onClose={() => onRemove(index)}
          />
        </div>
      ))}
    </div>
  );
};

// Hook for using toast notifications
export const useToast = () => {
  const [toasts, setToasts] = useState<ToastNotificationProps[]>([]);

  const addToast = (toast: Omit<ToastNotificationProps, 'onClose'>) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { ...toast, onClose: () => removeToast(id) }]);
    return id;
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((_, i) => i !== id));
  };

  const success = (message: string, title?: string) =>
    addToast({ message, title, type: 'success' });

  const error = (message: string, title?: string) =>
    addToast({ message, title, type: 'error' });

  const info = (message: string, title?: string) =>
    addToast({ message, title, type: 'info' });

  const warning = (message: string, title?: string) =>
    addToast({ message, title, type: 'warning' });

  return { toasts, addToast, removeToast, success, error, info, warning };
};

