import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

/**
 * Unit tests for parallax utility functions
 * Tests the core calculation logic without React hooks
 */

// Test the parallax offset calculation logic directly
describe('Parallax Offset Calculations', () => {
  // Pure function to calculate parallax offset (extracted from hook logic)
  const calculateParallaxOffset = (
    scrollY: number,
    speed: number,
    direction: 'up' | 'down',
    maxOffset: number
  ): number => {
    const rawOffset = direction === 'up' ? scrollY * speed : -scrollY * speed;
    return Math.min(Math.abs(rawOffset), maxOffset) * Math.sign(rawOffset);
  };

  describe('Basic Calculations', () => {
    it('should return zero offset when scroll is zero', () => {
      const offset = calculateParallaxOffset(0, 0.5, 'up', 500);
      expect(offset).toBe(0);
    });

    it('should calculate offset based on scroll position and speed', () => {
      // scrollY=100, speed=0.5 => offset=50
      const offset = calculateParallaxOffset(100, 0.5, 'up', 500);
      expect(offset).toBe(50);
    });

    it('should handle full speed (1.0)', () => {
      const offset = calculateParallaxOffset(100, 1.0, 'up', 500);
      expect(offset).toBe(100);
    });

    it('should handle slow speed (0.1)', () => {
      const offset = calculateParallaxOffset(100, 0.1, 'up', 500);
      expect(offset).toBe(10);
    });
  });

  describe('Direction Handling', () => {
    it('should return positive offset for "up" direction', () => {
      const offset = calculateParallaxOffset(100, 0.5, 'up', 500);
      expect(offset).toBeGreaterThan(0);
      expect(offset).toBe(50);
    });

    it('should return negative offset for "down" direction', () => {
      const offset = calculateParallaxOffset(100, 0.5, 'down', 500);
      expect(offset).toBeLessThan(0);
      expect(offset).toBe(-50);
    });
  });

  describe('Max Offset Capping', () => {
    it('should cap offset at maxOffset for "up" direction', () => {
      // scrollY=500, speed=1.0 => raw offset=500, but max=100
      const offset = calculateParallaxOffset(500, 1.0, 'up', 100);
      expect(offset).toBe(100);
    });

    it('should cap offset at -maxOffset for "down" direction', () => {
      // scrollY=500, speed=1.0 => raw offset=-500, but max=100
      const offset = calculateParallaxOffset(500, 1.0, 'down', 100);
      expect(offset).toBe(-100);
    });

    it('should not cap when under maxOffset', () => {
      const offset = calculateParallaxOffset(50, 0.5, 'up', 500);
      expect(offset).toBe(25);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very small scroll values', () => {
      const offset = calculateParallaxOffset(0.1, 0.5, 'up', 500);
      expect(offset).toBeCloseTo(0.05, 5);
    });

    it('should handle very large scroll values', () => {
      const offset = calculateParallaxOffset(10000, 0.5, 'up', 500);
      expect(offset).toBe(500); // Capped at maxOffset
    });

    it('should handle zero speed', () => {
      const offset = calculateParallaxOffset(100, 0, 'up', 500);
      expect(offset).toBe(0);
    });

    it('should handle very high speed', () => {
      const offset = calculateParallaxOffset(100, 2.0, 'up', 500);
      expect(offset).toBe(200);
    });
  });
});

describe('Parallax Configuration Validation', () => {
  // Validation function for parallax options
  const validateParallaxOptions = (options: {
    speed?: number;
    direction?: string;
    maxOffset?: number;
    disabled?: boolean;
  }): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (options.speed !== undefined) {
      if (typeof options.speed !== 'number' || isNaN(options.speed)) {
        errors.push('Speed must be a valid number');
      } else if (options.speed < 0) {
        errors.push('Speed cannot be negative');
      }
    }

    if (options.direction !== undefined) {
      if (!['up', 'down'].includes(options.direction)) {
        errors.push('Direction must be "up" or "down"');
      }
    }

    if (options.maxOffset !== undefined) {
      if (typeof options.maxOffset !== 'number' || options.maxOffset <= 0) {
        errors.push('maxOffset must be a positive number');
      }
    }

    return { valid: errors.length === 0, errors };
  };

  it('should validate default options', () => {
    const result = validateParallaxOptions({});
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should validate valid options', () => {
    const result = validateParallaxOptions({
      speed: 0.5,
      direction: 'up',
      maxOffset: 200,
      disabled: false,
    });
    expect(result.valid).toBe(true);
  });

  it('should reject negative speed', () => {
    const result = validateParallaxOptions({ speed: -0.5 });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Speed cannot be negative');
  });

  it('should reject invalid direction', () => {
    const result = validateParallaxOptions({ direction: 'left' });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Direction must be "up" or "down"');
  });

  it('should reject non-positive maxOffset', () => {
    const result = validateParallaxOptions({ maxOffset: 0 });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('maxOffset must be a positive number');
  });
});

describe('Transform String Generation', () => {
  // Helper to generate CSS transform string
  const generateTransform = (offset: number): string => {
    return `translate3d(0, ${offset}px, 0)`;
  };

  it('should generate correct transform for positive offset', () => {
    expect(generateTransform(50)).toBe('translate3d(0, 50px, 0)');
  });

  it('should generate correct transform for negative offset', () => {
    expect(generateTransform(-50)).toBe('translate3d(0, -50px, 0)');
  });

  it('should generate correct transform for zero offset', () => {
    expect(generateTransform(0)).toBe('translate3d(0, 0px, 0)');
  });

  it('should handle decimal offsets', () => {
    expect(generateTransform(25.5)).toBe('translate3d(0, 25.5px, 0)');
  });
});

