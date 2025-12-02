'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for parallax scrolling effects
 * Provides smooth, performant parallax transformations based on scroll position
 * 
 * @param speed - Parallax speed multiplier (0.1 = slow, 1.0 = normal scroll speed)
 * @param direction - Direction of parallax movement ('up' | 'down')
 * @returns Object containing scrollY position and calculated offset
 * 
 * @example
 * const { offset, scrollY } = useParallax({ speed: 0.5, direction: 'up' });
 * // Use offset in transform: `translateY(${offset}px)`
 */
interface UseParallaxOptions {
  speed?: number;
  direction?: 'up' | 'down';
  maxOffset?: number;
  disabled?: boolean;
}

interface UseParallaxReturn {
  scrollY: number;
  offset: number;
  isScrolling: boolean;
}

export function useParallax({
  speed = 0.5,
  direction = 'up',
  maxOffset = 500,
  disabled = false,
}: UseParallaxOptions = {}): UseParallaxReturn {
  const [scrollY, setScrollY] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const rafRef = useRef<number | null>(null);

  // Throttled scroll handler using requestAnimationFrame
  const handleScroll = useCallback(() => {
    if (disabled) return;

    // Cancel any pending animation frame
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    // Use requestAnimationFrame for smooth performance
    rafRef.current = requestAnimationFrame(() => {
      setScrollY(window.scrollY);
      setIsScrolling(true);

      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Set scrolling to false after scroll ends
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    });
  }, [disabled]);

  useEffect(() => {
    // Check for SSR
    if (typeof window === 'undefined' || disabled) return;

    // Set initial scroll position
    setScrollY(window.scrollY);

    // Add scroll listener with passive option for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      
      // Cleanup animation frame
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      
      // Cleanup timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [handleScroll, disabled]);

  // Calculate parallax offset
  const rawOffset = direction === 'up' ? scrollY * speed : -scrollY * speed;
  const offset = Math.min(Math.abs(rawOffset), maxOffset) * Math.sign(rawOffset);

  return { scrollY, offset, isScrolling };
}

/**
 * Custom hook for element-based parallax (when element comes into view)
 * Uses Intersection Observer for performance
 */
interface UseElementParallaxOptions extends UseParallaxOptions {
  threshold?: number;
}

export function useElementParallax({
  speed = 0.3,
  direction = 'up',
  maxOffset = 200,
  threshold = 0.1,
  disabled = false,
}: UseElementParallaxOptions = {}) {
  const [isInView, setIsInView] = useState(false);
  const [elementOffset, setElementOffset] = useState(0);
  const elementRef = useRef<HTMLElement | null>(null);

  const { offset, scrollY, isScrolling } = useParallax({
    speed,
    direction,
    maxOffset,
    disabled: disabled || !isInView,
  });

  useEffect(() => {
    if (typeof window === 'undefined' || disabled) return;

    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        if (entry.isIntersecting) {
          // Calculate offset relative to element position
          const rect = entry.boundingClientRect;
          const viewportHeight = window.innerHeight;
          const elementCenter = rect.top + rect.height / 2;
          const viewportCenter = viewportHeight / 2;
          const relativeOffset = (elementCenter - viewportCenter) * speed;
          setElementOffset(relativeOffset);
        }
      },
      { threshold, rootMargin: '50px' }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [speed, threshold, disabled]);

  return {
    ref: elementRef,
    offset: isInView ? offset + elementOffset : 0,
    isInView,
    scrollY,
    isScrolling,
  };
}

export default useParallax;

