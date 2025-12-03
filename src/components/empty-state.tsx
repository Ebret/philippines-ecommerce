'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
  variant?: 'default' | 'minimal' | 'compact';
}

/**
 * EmptyState Component
 * Displays a beautiful empty state with icon, title, description, and optional action
 * Supports multiple variants for different use cases
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  variant = 'default',
}: EmptyStateProps) {
  const baseClasses = 'rounded-xl border border-border/50 bg-card/50 text-center';
  
  const variantClasses = {
    default: 'p-12',
    minimal: 'p-8',
    compact: 'p-6',
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} animate-in fade-in slide-in-from-bottom-2 duration-500`}>
      {/* Icon */}
      {Icon && (
        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-lg bg-muted/50 group">
            <Icon className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
          </div>
        </div>
      )}

      {/* Title */}
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>

      {/* Description */}
      <p className="text-muted-foreground mb-6 max-w-sm mx-auto">{description}</p>

      {/* Action Button */}
      {action && (
        <Link
          href={action.href}
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all duration-300 hover:shadow-lg"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}

export default EmptyState;

