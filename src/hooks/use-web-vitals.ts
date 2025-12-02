'use client';

import { useState, useEffect, useCallback } from 'react';
import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from 'web-vitals';

/**
 * Web Vitals metric data structure
 */
export interface WebVitalMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  navigationType: string;
  timestamp: number;
}

/**
 * Web Vitals thresholds for rating
 * Based on Google's Core Web Vitals thresholds
 * Note: FID has been deprecated and replaced by INP in web-vitals v5
 */
export const WEB_VITALS_THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 }, // Largest Contentful Paint (ms)
  CLS: { good: 0.1, poor: 0.25 },  // Cumulative Layout Shift
  FCP: { good: 1800, poor: 3000 }, // First Contentful Paint (ms)
  TTFB: { good: 800, poor: 1800 }, // Time to First Byte (ms)
  INP: { good: 200, poor: 500 },   // Interaction to Next Paint (ms)
} as const;

/**
 * Get rating for a metric value
 */
export function getMetricRating(
  name: keyof typeof WEB_VITALS_THRESHOLDS,
  value: number
): 'good' | 'needs-improvement' | 'poor' {
  const thresholds = WEB_VITALS_THRESHOLDS[name];
  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Format metric value for display
 */
export function formatMetricValue(name: string, value: number): string {
  if (name === 'CLS') {
    return value.toFixed(3);
  }
  return `${Math.round(value)}ms`;
}

/**
 * Get metric description
 */
export function getMetricDescription(name: string): string {
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

/**
 * Web Vitals hook return type
 */
export interface UseWebVitalsReturn {
  metrics: Record<string, WebVitalMetric>;
  isLoading: boolean;
  overallScore: 'good' | 'needs-improvement' | 'poor' | null;
  refresh: () => void;
}

/**
 * Custom hook for tracking Web Vitals metrics
 * 
 * Features:
 * - Tracks all Core Web Vitals (LCP, FID, CLS, FCP, TTFB, INP)
 * - Provides rating for each metric (good, needs-improvement, poor)
 * - Calculates overall performance score
 * - Real-time updates as metrics are collected
 * 
 * @example
 * const { metrics, overallScore, isLoading } = useWebVitals();
 */
export function useWebVitals(): UseWebVitalsReturn {
  const [metrics, setMetrics] = useState<Record<string, WebVitalMetric>>({});
  const [isLoading, setIsLoading] = useState(true);

  const handleMetric = useCallback((metric: Metric) => {
    const name = metric.name as keyof typeof WEB_VITALS_THRESHOLDS;
    const rating = getMetricRating(name, metric.value);

    setMetrics((prev) => ({
      ...prev,
      [metric.name]: {
        name: metric.name,
        value: metric.value,
        rating,
        delta: metric.delta,
        id: metric.id,
        navigationType: metric.navigationType || 'unknown',
        timestamp: Date.now(),
      },
    }));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Register all Web Vitals observers
    // Note: FID has been deprecated in web-vitals v5, replaced by INP
    onCLS(handleMetric);
    onFCP(handleMetric);
    onINP(handleMetric);
    onLCP(handleMetric);
    onTTFB(handleMetric);

    // Set loading to false after a timeout if no metrics are collected
    const timeout = setTimeout(() => setIsLoading(false), 5000);
    return () => clearTimeout(timeout);
  }, [handleMetric]);

  // Calculate overall score based on collected metrics
  const overallScore = useCallback((): 'good' | 'needs-improvement' | 'poor' | null => {
    const metricValues = Object.values(metrics);
    if (metricValues.length === 0) return null;

    const ratings = metricValues.map((m) => m.rating);
    if (ratings.some((r) => r === 'poor')) return 'poor';
    if (ratings.some((r) => r === 'needs-improvement')) return 'needs-improvement';
    return 'good';
  }, [metrics])();

  const refresh = useCallback(() => {
    setMetrics({});
    setIsLoading(true);
    // Trigger a page reload to collect fresh metrics
    window.location.reload();
  }, []);

  return {
    metrics,
    isLoading,
    overallScore,
    refresh,
  };
}

export default useWebVitals;
