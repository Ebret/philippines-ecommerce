'use client';

import React from 'react';
import { useStaggerAnimation } from '@/hooks/use-stagger-animation';
import { cn } from '@/lib/utils';

/**
 * AnimatedGrid Component
 * 
 * A wrapper component that provides staggered fade-in animations for grid items.
 * Uses Intersection Observer for performance-optimized animations that trigger
 * when the grid enters the viewport.
 * 
 * Features:
 * - Configurable stagger delay between items
 * - GPU-accelerated CSS transforms
 * - Respects prefers-reduced-motion
 * - Accessible (doesn't affect screen readers)
 * 
 * @example
 * <AnimatedGrid columns={3} staggerDelay={100}>
 *   {products.map(product => <ProductCard key={product.id} />)}
 * </AnimatedGrid>
 */

interface AnimatedGridProps {
  children: React.ReactNode;
  /** Number of columns (1-6) */
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Delay between each item animation in ms */
  staggerDelay?: number;
  /** Initial delay before animations start in ms */
  initialDelay?: number;
  /** Gap between grid items */
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  /** Additional container className */
  className?: string;
  /** Additional item wrapper className */
  itemClassName?: string;
  /** Disable animations */
  disabled?: boolean;
  /** Animate only once */
  animateOnce?: boolean;
}

const columnClasses = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
  6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
};

const gapClasses = {
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
  xl: 'gap-10',
};

export function AnimatedGrid({
  children,
  columns = 3,
  staggerDelay = 100,
  initialDelay = 0,
  gap = 'lg',
  className,
  itemClassName,
  disabled = false,
  animateOnce = true,
}: AnimatedGridProps) {
  const childArray = React.Children.toArray(children);
  const itemCount = childArray.length;

  const {
    containerRef,
    getItemClasses,
    getItemStyles,
  } = useStaggerAnimation(itemCount, {
    staggerDelay,
    initialDelay,
    animateOnce,
    disabled,
  });

  return (
    <div
      ref={containerRef as React.RefObject<HTMLDivElement>}
      className={cn(
        'grid',
        columnClasses[columns],
        gapClasses[gap],
        className
      )}
    >
      {childArray.map((child, index) => (
        <div
          key={index}
          className={cn(
            // Base animation classes
            'motion-reduce:opacity-100 motion-reduce:translate-y-0 motion-reduce:scale-100',
            // Animation state classes
            !disabled && getItemClasses(index),
            itemClassName
          )}
          style={!disabled ? getItemStyles(index) : undefined}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

/**
 * AnimatedGridItem Component
 * 
 * A standalone animated item for custom grid implementations.
 * Useful when you need more control over the grid layout.
 */
interface AnimatedGridItemProps {
  children: React.ReactNode;
  /** Item index for stagger calculation */
  index: number;
  /** Whether the item is visible */
  isVisible: boolean;
  /** Delay for this item in ms */
  delay?: number;
  /** Additional className */
  className?: string;
  /** Custom animation duration in ms */
  duration?: number;
}

export function AnimatedGridItem({
  children,
  index,
  isVisible,
  delay = 0,
  className,
  duration = 500,
}: AnimatedGridItemProps) {
  return (
    <div
      className={cn(
        'motion-reduce:opacity-100 motion-reduce:translate-y-0 motion-reduce:scale-100',
        'transition-all',
        isVisible
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-8 scale-95',
        className
      )}
      style={{
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default AnimatedGrid;

