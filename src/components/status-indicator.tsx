'use client';

import React from 'react';
import { cn } from '@/lib/utils';

type StatusType = 'online' | 'offline' | 'idle' | 'busy' | 'success' | 'error' | 'warning' | 'info';

interface StatusIndicatorProps {
  status: StatusType;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  showLabel?: boolean;
}

/**
 * StatusIndicator Component
 * Displays a status dot with optional label and animation
 * Useful for showing online/offline status, system health, etc.
 */
export function StatusIndicator({
  status,
  label,
  size = 'md',
  animated = true,
  showLabel = true,
}: StatusIndicatorProps) {
  const statusConfig = {
    online: {
      color: 'bg-success',
      label: 'Online',
      pulse: true,
    },
    offline: {
      color: 'bg-error',
      label: 'Offline',
      pulse: false,
    },
    idle: {
      color: 'bg-warning',
      label: 'Idle',
      pulse: false,
    },
    busy: {
      color: 'bg-accent',
      label: 'Busy',
      pulse: true,
    },
    success: {
      color: 'bg-success',
      label: 'Success',
      pulse: false,
    },
    error: {
      color: 'bg-error',
      label: 'Error',
      pulse: false,
    },
    warning: {
      color: 'bg-warning',
      label: 'Warning',
      pulse: false,
    },
    info: {
      color: 'bg-info',
      label: 'Info',
      pulse: false,
    },
  };

  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  const config = statusConfig[status];
  const displayLabel = label || (showLabel ? config.label : '');

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        {/* Pulse ring (optional) */}
        {animated && config.pulse && (
          <div
            className={cn(
              'absolute inset-0 rounded-full animate-pulse',
              config.color,
              sizeClasses[size]
            )}
            style={{ opacity: 0.5 }}
          />
        )}

        {/* Status dot */}
        <div
          className={cn(
            'rounded-full shadow-sm',
            config.color,
            sizeClasses[size]
          )}
        />
      </div>

      {/* Label */}
      {displayLabel && (
        <span className="text-sm font-medium text-foreground">{displayLabel}</span>
      )}
    </div>
  );
}

export default StatusIndicator;

