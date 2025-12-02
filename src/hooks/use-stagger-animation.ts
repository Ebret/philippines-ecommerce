'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for staggered fade-in animations
 * Uses Intersection Observer for performance-optimized visibility detection
 * 
 * @param itemCount - Number of items to animate
 * @param options - Configuration options for the animation
 * @returns Object containing visibility states and ref setter
 * 
 * @example
 * const { isVisible, containerRef, getItemDelay } = useStaggerAnimation(products.length);
 */
interface UseStaggerAnimationOptions {
  /** Delay between each item animation in milliseconds */
  staggerDelay?: number;
  /** Initial delay before animations start in milliseconds */
  initialDelay?: number;
  /** Intersection observer threshold (0-1) */
  threshold?: number;
  /** Whether to only animate once (no re-animation on scroll out/in) */
  animateOnce?: boolean;
  /** Disable animations entirely */
  disabled?: boolean;
  /** Root margin for intersection observer */
  rootMargin?: string;
}

interface UseStaggerAnimationReturn {
  /** Whether the container is in view */
  isInView: boolean;
  /** Array of visibility states for each item */
  itemVisibility: boolean[];
  /** Ref to attach to the container element */
  containerRef: React.RefObject<HTMLElement | null>;
  /** Get the delay for a specific item index */
  getItemDelay: (index: number) => number;
  /** Get animation classes for an item */
  getItemClasses: (index: number) => string;
  /** Get inline styles for an item */
  getItemStyles: (index: number) => React.CSSProperties;
  /** Reset all animations */
  reset: () => void;
}

export function useStaggerAnimation(
  itemCount: number,
  options: UseStaggerAnimationOptions = {}
): UseStaggerAnimationReturn {
  const {
    staggerDelay = 100,
    initialDelay = 0,
    threshold = 0.1,
    animateOnce = true,
    disabled = false,
    rootMargin = '50px',
  } = options;

  const [isInView, setIsInView] = useState(false);
  const [itemVisibility, setItemVisibility] = useState<boolean[]>(
    new Array(itemCount).fill(false)
  );
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef<HTMLElement | null>(null);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // Cleanup function for timeouts
  const clearTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  // Reset function
  const reset = useCallback(() => {
    clearTimeouts();
    setItemVisibility(new Array(itemCount).fill(false));
    setHasAnimated(false);
    setIsInView(false);
  }, [itemCount, clearTimeouts]);

  // Intersection Observer setup
  useEffect(() => {
    if (typeof window === 'undefined' || disabled) return;

    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;
        
        if (animateOnce && hasAnimated && !isVisible) {
          // Keep items visible if animateOnce is true
          return;
        }
        
        setIsInView(isVisible);
        
        if (isVisible && (!animateOnce || !hasAnimated)) {
          setHasAnimated(true);
          
          // Stagger the visibility of each item
          clearTimeouts();
          
          for (let i = 0; i < itemCount; i++) {
            const timeout = setTimeout(() => {
              setItemVisibility((prev) => {
                const next = [...prev];
                next[i] = true;
                return next;
              });
            }, initialDelay + i * staggerDelay);
            
            timeoutsRef.current.push(timeout);
          }
        } else if (!isVisible && !animateOnce) {
          // Reset visibility when scrolling out (if not animateOnce)
          clearTimeouts();
          setItemVisibility(new Array(itemCount).fill(false));
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      clearTimeouts();
    };
  }, [itemCount, staggerDelay, initialDelay, threshold, animateOnce, disabled, rootMargin, hasAnimated, clearTimeouts]);

  // Get delay for a specific item
  const getItemDelay = useCallback(
    (index: number): number => initialDelay + index * staggerDelay,
    [initialDelay, staggerDelay]
  );

  // Get animation classes for an item
  const getItemClasses = useCallback(
    (index: number): string => {
      if (disabled) return '';
      const isVisible = itemVisibility[index];
      return isVisible
        ? 'opacity-100 translate-y-0 scale-100'
        : 'opacity-0 translate-y-8 scale-95';
    },
    [itemVisibility, disabled]
  );

  // Get inline styles for an item
  const getItemStyles = useCallback(
    (index: number): React.CSSProperties => {
      if (disabled) return {};
      return {
        transitionProperty: 'opacity, transform',
        transitionDuration: '500ms',
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        transitionDelay: `${getItemDelay(index)}ms`,
      };
    },
    [disabled, getItemDelay]
  );

  return {
    isInView,
    itemVisibility,
    containerRef,
    getItemDelay,
    getItemClasses,
    getItemStyles,
    reset,
  };
}

export default useStaggerAnimation;

