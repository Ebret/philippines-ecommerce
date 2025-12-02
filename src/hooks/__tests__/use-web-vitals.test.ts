import { describe, it, expect } from 'vitest';

/**
 * Unit tests for Web Vitals utility functions
 * Tests the core calculation logic without React hooks
 */

// Web Vitals thresholds (FID deprecated in v5, replaced by INP)
const WEB_VITALS_THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 800, poor: 1800 },
  INP: { good: 200, poor: 500 },
} as const;

// Get rating for a metric value
function getMetricRating(
  name: keyof typeof WEB_VITALS_THRESHOLDS,
  value: number
): 'good' | 'needs-improvement' | 'poor' {
  const thresholds = WEB_VITALS_THRESHOLDS[name];
  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.poor) return 'needs-improvement';
  return 'poor';
}

// Format metric value for display
function formatMetricValue(name: string, value: number): string {
  if (name === 'CLS') {
    return value.toFixed(3);
  }
  return `${Math.round(value)}ms`;
}

// Get metric description
function getMetricDescription(name: string): string {
  const descriptions: Record<string, string> = {
    LCP: 'Largest Contentful Paint - measures loading performance',
    FID: 'First Input Delay - measures interactivity',
    CLS: 'Cumulative Layout Shift - measures visual stability',
    FCP: 'First Contentful Paint - measures initial render time',
    TTFB: 'Time to First Byte - measures server response time',
    INP: 'Interaction to Next Paint - measures responsiveness',
  };
  return descriptions[name] || 'Unknown metric';
}

describe('getMetricRating', () => {
  describe('LCP (Largest Contentful Paint)', () => {
    it('should return good for values <= 2500ms', () => {
      expect(getMetricRating('LCP', 1000)).toBe('good');
      expect(getMetricRating('LCP', 2500)).toBe('good');
    });

    it('should return needs-improvement for values between 2500-4000ms', () => {
      expect(getMetricRating('LCP', 2501)).toBe('needs-improvement');
      expect(getMetricRating('LCP', 4000)).toBe('needs-improvement');
    });

    it('should return poor for values > 4000ms', () => {
      expect(getMetricRating('LCP', 4001)).toBe('poor');
      expect(getMetricRating('LCP', 10000)).toBe('poor');
    });
  });

  describe('CLS (Cumulative Layout Shift)', () => {
    it('should return good for values <= 0.1', () => {
      expect(getMetricRating('CLS', 0.05)).toBe('good');
      expect(getMetricRating('CLS', 0.1)).toBe('good');
    });

    it('should return needs-improvement for values between 0.1-0.25', () => {
      expect(getMetricRating('CLS', 0.11)).toBe('needs-improvement');
      expect(getMetricRating('CLS', 0.25)).toBe('needs-improvement');
    });

    it('should return poor for values > 0.25', () => {
      expect(getMetricRating('CLS', 0.26)).toBe('poor');
    });
  });

  describe('FCP (First Contentful Paint)', () => {
    it('should return good for values <= 1800ms', () => {
      expect(getMetricRating('FCP', 1000)).toBe('good');
      expect(getMetricRating('FCP', 1800)).toBe('good');
    });

    it('should return needs-improvement for values between 1800-3000ms', () => {
      expect(getMetricRating('FCP', 1801)).toBe('needs-improvement');
      expect(getMetricRating('FCP', 3000)).toBe('needs-improvement');
    });

    it('should return poor for values > 3000ms', () => {
      expect(getMetricRating('FCP', 3001)).toBe('poor');
    });
  });

  describe('TTFB (Time to First Byte)', () => {
    it('should return good for values <= 800ms', () => {
      expect(getMetricRating('TTFB', 500)).toBe('good');
      expect(getMetricRating('TTFB', 800)).toBe('good');
    });

    it('should return needs-improvement for values between 800-1800ms', () => {
      expect(getMetricRating('TTFB', 801)).toBe('needs-improvement');
      expect(getMetricRating('TTFB', 1800)).toBe('needs-improvement');
    });

    it('should return poor for values > 1800ms', () => {
      expect(getMetricRating('TTFB', 1801)).toBe('poor');
    });
  });

  describe('INP (Interaction to Next Paint)', () => {
    it('should return good for values <= 200ms', () => {
      expect(getMetricRating('INP', 100)).toBe('good');
      expect(getMetricRating('INP', 200)).toBe('good');
    });

    it('should return needs-improvement for values between 200-500ms', () => {
      expect(getMetricRating('INP', 201)).toBe('needs-improvement');
      expect(getMetricRating('INP', 500)).toBe('needs-improvement');
    });

    it('should return poor for values > 500ms', () => {
      expect(getMetricRating('INP', 501)).toBe('poor');
    });
  });
});

describe('formatMetricValue', () => {
  it('should format CLS with 3 decimal places', () => {
    expect(formatMetricValue('CLS', 0.1)).toBe('0.100');
    expect(formatMetricValue('CLS', 0.123456)).toBe('0.123');
  });

  it('should format other metrics with ms suffix', () => {
    expect(formatMetricValue('LCP', 2500)).toBe('2500ms');
    expect(formatMetricValue('FCP', 1800)).toBe('1800ms');
    expect(formatMetricValue('TTFB', 800)).toBe('800ms');
    expect(formatMetricValue('INP', 200)).toBe('200ms');
  });
});

describe('getMetricDescription', () => {
  it('should return correct descriptions for all metrics', () => {
    expect(getMetricDescription('LCP')).toContain('loading performance');
    expect(getMetricDescription('CLS')).toContain('visual stability');
    expect(getMetricDescription('FCP')).toContain('initial render');
    expect(getMetricDescription('TTFB')).toContain('server response');
    expect(getMetricDescription('INP')).toContain('responsiveness');
  });

  it('should return unknown for unrecognized metrics', () => {
    expect(getMetricDescription('UNKNOWN')).toBe('Unknown metric');
  });
});

