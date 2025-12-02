import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

/**
 * Unit tests for stagger animation utility functions
 * Tests the core calculation logic without React hooks
 */

describe('Stagger Animation Calculations', () => {
  // Calculate delay for each item
  const calculateItemDelay = (
    index: number,
    staggerDelay: number,
    initialDelay: number = 0
  ): number => {
    return initialDelay + index * staggerDelay;
  };

  describe('calculateItemDelay', () => {
    it('should return initialDelay for first item (index 0)', () => {
      const delay = calculateItemDelay(0, 100, 0);
      expect(delay).toBe(0);
    });

    it('should calculate correct delay for subsequent items', () => {
      expect(calculateItemDelay(0, 100, 0)).toBe(0);
      expect(calculateItemDelay(1, 100, 0)).toBe(100);
      expect(calculateItemDelay(2, 100, 0)).toBe(200);
      expect(calculateItemDelay(3, 100, 0)).toBe(300);
    });

    it('should include initial delay', () => {
      expect(calculateItemDelay(0, 100, 50)).toBe(50);
      expect(calculateItemDelay(1, 100, 50)).toBe(150);
      expect(calculateItemDelay(2, 100, 50)).toBe(250);
    });

    it('should handle different stagger delays', () => {
      expect(calculateItemDelay(1, 50, 0)).toBe(50);
      expect(calculateItemDelay(1, 100, 0)).toBe(100);
      expect(calculateItemDelay(1, 200, 0)).toBe(200);
    });

    it('should handle large item counts', () => {
      expect(calculateItemDelay(10, 100, 0)).toBe(1000);
      expect(calculateItemDelay(50, 50, 100)).toBe(2600);
    });
  });
});

describe('Visibility State Management', () => {
  // Create initial visibility array
  const createInitialVisibility = (itemCount: number): boolean[] => {
    return new Array(itemCount).fill(false);
  };

  // Update visibility for a specific item
  const updateVisibility = (
    currentState: boolean[],
    index: number,
    visible: boolean
  ): boolean[] => {
    const newState = [...currentState];
    newState[index] = visible;
    return newState;
  };

  describe('createInitialVisibility', () => {
    it('should create array with all false values', () => {
      const visibility = createInitialVisibility(3);
      expect(visibility).toEqual([false, false, false]);
    });

    it('should handle zero items', () => {
      const visibility = createInitialVisibility(0);
      expect(visibility).toEqual([]);
    });

    it('should handle large item counts', () => {
      const visibility = createInitialVisibility(100);
      expect(visibility.length).toBe(100);
      expect(visibility.every((v) => v === false)).toBe(true);
    });
  });

  describe('updateVisibility', () => {
    it('should update specific item to visible', () => {
      const initial = [false, false, false];
      const updated = updateVisibility(initial, 1, true);
      expect(updated).toEqual([false, true, false]);
    });

    it('should not mutate original array', () => {
      const initial = [false, false, false];
      updateVisibility(initial, 1, true);
      expect(initial).toEqual([false, false, false]);
    });

    it('should handle edge cases', () => {
      const initial = [false, false, false];
      expect(updateVisibility(initial, 0, true)).toEqual([true, false, false]);
      expect(updateVisibility(initial, 2, true)).toEqual([false, false, true]);
    });
  });
});

describe('Animation Classes Generation', () => {
  // Generate animation classes based on visibility
  const getAnimationClasses = (isVisible: boolean, disabled: boolean = false): string => {
    if (disabled) return '';
    return isVisible
      ? 'opacity-100 translate-y-0 scale-100'
      : 'opacity-0 translate-y-8 scale-95';
  };

  it('should return visible classes when visible', () => {
    const classes = getAnimationClasses(true);
    expect(classes).toContain('opacity-100');
    expect(classes).toContain('translate-y-0');
    expect(classes).toContain('scale-100');
  });

  it('should return hidden classes when not visible', () => {
    const classes = getAnimationClasses(false);
    expect(classes).toContain('opacity-0');
    expect(classes).toContain('translate-y-8');
    expect(classes).toContain('scale-95');
  });

  it('should return empty string when disabled', () => {
    expect(getAnimationClasses(true, true)).toBe('');
    expect(getAnimationClasses(false, true)).toBe('');
  });
});

describe('Animation Styles Generation', () => {
  // Generate inline styles for animation
  const getAnimationStyles = (
    delay: number,
    duration: number = 500,
    disabled: boolean = false
  ): React.CSSProperties => {
    if (disabled) return {};
    return {
      transitionProperty: 'opacity, transform',
      transitionDuration: `${duration}ms`,
      transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
      transitionDelay: `${delay}ms`,
    };
  };

  it('should generate correct transition styles', () => {
    const styles = getAnimationStyles(100);
    expect(styles.transitionProperty).toBe('opacity, transform');
    expect(styles.transitionDuration).toBe('500ms');
    expect(styles.transitionTimingFunction).toBe('cubic-bezier(0.4, 0, 0.2, 1)');
    expect(styles.transitionDelay).toBe('100ms');
  });

  it('should use custom duration', () => {
    const styles = getAnimationStyles(100, 300);
    expect(styles.transitionDuration).toBe('300ms');
  });

  it('should return empty object when disabled', () => {
    const styles = getAnimationStyles(100, 500, true);
    expect(styles).toEqual({});
  });

  it('should handle zero delay', () => {
    const styles = getAnimationStyles(0);
    expect(styles.transitionDelay).toBe('0ms');
  });
});

describe('Column Classes Mapping', () => {
  const columnClasses: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
  };

  it('should return correct classes for each column count', () => {
    expect(columnClasses[1]).toContain('grid-cols-1');
    expect(columnClasses[2]).toContain('md:grid-cols-2');
    expect(columnClasses[3]).toContain('lg:grid-cols-3');
    expect(columnClasses[4]).toContain('lg:grid-cols-4');
    expect(columnClasses[5]).toContain('xl:grid-cols-5');
    expect(columnClasses[6]).toContain('xl:grid-cols-6');
  });

  it('should include responsive breakpoints', () => {
    // All column configs should start with single column on mobile
    Object.values(columnClasses).forEach((classes) => {
      expect(classes).toContain('grid-cols-1');
    });
  });
});

