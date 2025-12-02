'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDelete: (id: string) => void;
  onDeleteAll: () => void;
  className?: string;
}

const typeColors = {
  success: 'bg-success/10 border-l-4 border-success text-success',
  error: 'bg-error/10 border-l-4 border-error text-error',
  info: 'bg-info/10 border-l-4 border-info text-info',
  warning: 'bg-warning/10 border-l-4 border-warning text-warning',
};

const typeIcons = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
  warning: '⚠',
};

const formatTime = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
};

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onDeleteAll,
  className,
}) => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const unreadCount = notifications.filter((n) => !n.read).length;
  const filteredNotifications =
    filter === 'unread' ? notifications.filter((n) => !n.read) : notifications;

  return (
    <div className={cn('w-full max-w-2xl mx-auto', className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
          {unreadCount > 0 && (
            <p className="text-sm text-muted-foreground">{unreadCount} unread</p>
          )}
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="px-3 py-1 text-sm font-medium text-primary hover:bg-primary/10 rounded"
            >
              Mark all as read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={onDeleteAll}
              className="px-3 py-1 text-sm font-medium text-error hover:bg-error/10 rounded"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-4 px-4 py-3 border-b border-border">
        <button
          onClick={() => setFilter('all')}
          className={cn(
            'pb-2 font-medium transition-colors',
            filter === 'all'
              ? 'text-primary border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={cn(
            'pb-2 font-medium transition-colors',
            filter === 'unread'
              ? 'text-primary border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      <div className="divide-y divide-border max-h-96 overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <p className="text-lg font-medium">No notifications</p>
            <p className="text-sm">You're all caught up!</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={cn(
                'p-4 hover:bg-muted transition-colors cursor-pointer',
                !notification.read && 'bg-primary/5'
              )}
              onClick={() => onMarkAsRead(notification.id)}
            >
              <div className="flex gap-3">
                <span
                  className={cn(
                    'text-lg font-bold flex-shrink-0 w-8 h-8 flex items-center justify-center rounded',
                    typeColors[notification.type]
                  )}
                >
                  {typeIcons[notification.type]}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {notification.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">
                      {formatTime(notification.timestamp)}
                    </span>
                    {notification.action && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          notification.action?.onClick();
                        }}
                        className="text-xs font-medium text-primary hover:text-primary-dark"
                      >
                        {notification.action.label}
                      </button>
                    )}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(notification.id);
                  }}
                  className="text-muted-foreground hover:text-foreground flex-shrink-0"
                  aria-label="Delete notification"
                >
                  ×
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Hook for managing notifications
export const useNotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (
    notification: Omit<Notification, 'id' | 'timestamp' | 'read'>
  ) => {
    const id = Date.now().toString();
    setNotifications((prev) => [
      {
        ...notification,
        id,
        timestamp: new Date(),
        read: false,
      },
      ...prev,
    ]);
    return id;
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const deleteAll = () => {
    setNotifications([]);
  };

  return {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAll,
  };
};

