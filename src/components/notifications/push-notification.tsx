'use client';

import React, { useEffect, useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const pushNotificationVariants = cva(
  'fixed rounded-lg shadow-2xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300 max-w-sm',
  {
    variants: {
      type: {
        success: 'bg-green-600 text-white',
        error: 'bg-red-600 text-white',
        info: 'bg-blue-600 text-white',
        warning: 'bg-yellow-600 text-white',
      },
      position: {
        'bottom-right': 'bottom-4 right-4',
        'bottom-left': 'bottom-4 left-4',
        'top-right': 'top-4 right-4',
        'top-left': 'top-4 left-4',
      },
    },
    defaultVariants: {
      type: 'info',
      position: 'bottom-right',
    },
  }
);

interface PushNotificationProps extends VariantProps<typeof pushNotificationVariants> {
  title: string;
  message: string;
  icon?: React.ReactNode;
  badge?: number;
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

export const PushNotification: React.FC<PushNotificationProps> = ({
  title,
  message,
  icon,
  badge,
  type = 'info',
  position = 'bottom-right',
  duration = 6000,
  onClose,
  action,
  className,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (duration && duration > 0) {
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
        setProgress(remaining);

        if (remaining === 0) {
          clearInterval(interval);
          setIsVisible(false);
          onClose?.();
        }
      }, 50);

      return () => clearInterval(interval);
    }
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={cn(pushNotificationVariants({ type, position }), className)}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex-shrink-0">
        {icon || (
          <span className="text-2xl font-bold">
            {typeIcons[type as keyof typeof typeIcons]}
          </span>
        )}
        {badge !== undefined && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {badge}
          </span>
        )}
      </div>

      <div className="flex-1">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm opacity-90">{message}</p>
      </div>

      {action && (
        <button
          onClick={action.onClick}
          className="ml-2 font-semibold hover:opacity-80 transition-opacity whitespace-nowrap text-sm"
        >
          {action.label}
        </button>
      )}

      <button
        onClick={() => {
          setIsVisible(false);
          onClose?.();
        }}
        className="ml-2 text-lg font-bold hover:opacity-60 transition-opacity flex-shrink-0"
        aria-label="Close notification"
      >
        ×
      </button>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white opacity-30 rounded-b-lg overflow-hidden">
        <div
          className="h-full bg-white transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

// Push notification container
interface PushNotificationContainerProps {
  notifications: PushNotificationProps[];
  onRemove: (index: number) => void;
}

export const PushNotificationContainer: React.FC<PushNotificationContainerProps> = ({
  notifications,
  onRemove,
}) => {
  return (
    <div className="fixed inset-0 pointer-events-none">
      {notifications.map((notification, index) => (
        <div key={index} className="pointer-events-auto">
          <PushNotification
            {...notification}
            onClose={() => onRemove(index)}
          />
        </div>
      ))}
    </div>
  );
};

// Hook for push notifications
export const usePushNotification = () => {
  const [notifications, setPushNotifications] = useState<PushNotificationProps[]>([]);

  const addNotification = (notification: Omit<PushNotificationProps, 'onClose'>) => {
    const id = Date.now();
    setPushNotifications((prev) => [
      ...prev,
      { ...notification, onClose: () => removeNotification(id) },
    ]);
    return id;
  };

  const removeNotification = (id: number) => {
    setPushNotifications((prev) =>
      prev.filter((_, i) => i !== id)
    );
  };

  const success = (title: string, message: string) =>
    addNotification({ title, message, type: 'success' });

  const error = (title: string, message: string) =>
    addNotification({ title, message, type: 'error' });

  const info = (title: string, message: string) =>
    addNotification({ title, message, type: 'info' });

  const warning = (title: string, message: string) =>
    addNotification({ title, message, type: 'warning' });

  return {
    notifications: notifications,
    addNotification,
    removeNotification,
    success,
    error,
    info,
    warning,
  };
};

// Browser push notification API wrapper
export const useBrowserPushNotification = () => {
  const requestPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  };

  const sendNotification = (title: string, options?: NotificationOptions) => {
    if (Notification.permission === 'granted') {
      new Notification(title, options);
    }
  };

  return { requestPermission, sendNotification };
};

