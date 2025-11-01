import {
  PerformanceMetric,
  CoreWebVitals,
  APIPerformanceMetric,
  DatabaseQueryMetric,
  BundleAnalysis,
  CacheMetric,
  LoadTestResult,
} from "./validations/performance";

// Performance Metrics Collection
export function collectPerformanceMetric(
  name: string,
  value: number,
  unit: "ms" | "kb" | "mb" | "percent" | "count",
  tags?: Record<string, string>
): PerformanceMetric {
  return {
    name,
    value,
    unit,
    timestamp: new Date(),
    tags,
  };
}

// Core Web Vitals Measurement
export function measureCoreWebVitals(): CoreWebVitals {
  const vitals: CoreWebVitals = {
    timestamp: new Date(),
  };

  // First Contentful Paint
  if (typeof window !== "undefined" && "PerformanceObserver" in window) {
    const paintEntries = performance.getEntriesByType("paint");
    const fcp = paintEntries.find((entry) => entry.name === "first-contentful-paint");
    if (fcp) vitals.fcp = fcp.startTime;

    // Largest Contentful Paint
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        vitals.lcp = lastEntry.startTime;
      });
      observer.observe({ entryTypes: ["largest-contentful-paint"] });
    } catch (e) {
      // LCP not supported
    }

    // Cumulative Layout Shift
    try {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        vitals.cls = clsValue;
      });
      observer.observe({ entryTypes: ["layout-shift"] });
    } catch (e) {
      // CLS not supported
    }

    // Time to Interactive
    const navigationTiming = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
    if (navigationTiming) {
      vitals.tti = navigationTiming.domInteractive - navigationTiming.fetchStart;
    }

    // Total Blocking Time
    try {
      let tbtValue = 0;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const blockingTime = (entry as any).duration - 50;
          if (blockingTime > 0) {
            tbtValue += blockingTime;
          }
        }
        vitals.tbt = tbtValue;
      });
      observer.observe({ entryTypes: ["longtask"] });
    } catch (e) {
      // TBT not supported
    }
  }

  return vitals;
}

// API Performance Tracking
export function trackAPIPerformance(
  endpoint: string,
  method: "GET" | "POST" | "PATCH" | "DELETE" | "PUT",
  responseTime: number,
  statusCode: number,
  requestSize?: number,
  responseSize?: number
): APIPerformanceMetric {
  return {
    endpoint,
    method,
    responseTime,
    statusCode,
    requestSize,
    responseSize,
    timestamp: new Date(),
  };
}

// Database Query Performance Tracking
export function trackDatabaseQuery(
  query: string,
  executionTime: number,
  rowsAffected?: number,
  indexUsed?: boolean
): DatabaseQueryMetric {
  return {
    query,
    executionTime,
    rowsAffected,
    indexUsed,
    timestamp: new Date(),
  };
}

// Bundle Size Analysis
export function analyzeBundleSize(
  totalSize: number,
  gzippedSize: number,
  modules?: Array<{ name: string; size: number; gzippedSize: number }>
): BundleAnalysis {
  const moduleList = modules?.map((m) => ({
    ...m,
    percentage: (m.size / totalSize) * 100,
  })) || [];

  return {
    totalSize,
    gzippedSize,
    modules: moduleList,
    timestamp: new Date(),
  };
}

// Cache Performance Metrics
export function calculateCacheMetrics(
  cacheKey: string,
  hitCount: number,
  missCount: number,
  size?: number,
  ttl?: number
): CacheMetric {
  const totalRequests = hitCount + missCount;
  const hitRate = totalRequests > 0 ? (hitCount / totalRequests) * 100 : 0;

  return {
    cacheKey,
    hitCount,
    missCount,
    hitRate,
    size,
    ttl,
    timestamp: new Date(),
  };
}

// Performance Comparison
export function comparePerformance(
  baseline: number,
  current: number
): { improvement: number; percentageChange: number; isImproved: boolean } {
  const improvement = baseline - current;
  const percentageChange = (improvement / baseline) * 100;
  const isImproved = improvement > 0;

  return {
    improvement,
    percentageChange,
    isImproved,
  };
}

// Calculate Average Response Time
export function calculateAverageResponseTime(metrics: APIPerformanceMetric[]): number {
  if (metrics.length === 0) return 0;
  const total = metrics.reduce((sum, m) => sum + m.responseTime, 0);
  return total / metrics.length;
}

// Calculate P95 Response Time
export function calculateP95ResponseTime(metrics: APIPerformanceMetric[]): number {
  if (metrics.length === 0) return 0;
  const sorted = [...metrics].sort((a, b) => a.responseTime - b.responseTime);
  const index = Math.ceil(sorted.length * 0.95) - 1;
  return sorted[index]?.responseTime || 0;
}

// Calculate P99 Response Time
export function calculateP99ResponseTime(metrics: APIPerformanceMetric[]): number {
  if (metrics.length === 0) return 0;
  const sorted = [...metrics].sort((a, b) => a.responseTime - b.responseTime);
  const index = Math.ceil(sorted.length * 0.99) - 1;
  return sorted[index]?.responseTime || 0;
}

// Calculate Success Rate
export function calculateSuccessRate(metrics: APIPerformanceMetric[]): number {
  if (metrics.length === 0) return 0;
  const successful = metrics.filter((m) => m.statusCode >= 200 && m.statusCode < 300).length;
  return (successful / metrics.length) * 100;
}

// Calculate Throughput (requests per second)
export function calculateThroughput(
  totalRequests: number,
  durationSeconds: number
): number {
  if (durationSeconds === 0) return 0;
  return totalRequests / durationSeconds;
}

// Identify Slow Endpoints
export function identifySlowEndpoints(
  metrics: APIPerformanceMetric[],
  threshold: number = 1000
): APIPerformanceMetric[] {
  return metrics.filter((m) => m.responseTime > threshold);
}

// Identify Failed Requests
export function identifyFailedRequests(metrics: APIPerformanceMetric[]): APIPerformanceMetric[] {
  return metrics.filter((m) => m.statusCode >= 400);
}

// Calculate Database Query Performance
export function calculateQueryPerformance(
  metrics: DatabaseQueryMetric[]
): {
  averageTime: number;
  slowestQuery: DatabaseQueryMetric | null;
  fastestQuery: DatabaseQueryMetric | null;
  totalQueries: number;
} {
  if (metrics.length === 0) {
    return {
      averageTime: 0,
      slowestQuery: null,
      fastestQuery: null,
      totalQueries: 0,
    };
  }

  const averageTime = metrics.reduce((sum, m) => sum + m.executionTime, 0) / metrics.length;
  const slowestQuery = metrics.reduce((max, m) =>
    m.executionTime > max.executionTime ? m : max
  );
  const fastestQuery = metrics.reduce((min, m) =>
    m.executionTime < min.executionTime ? m : min
  );

  return {
    averageTime,
    slowestQuery,
    fastestQuery,
    totalQueries: metrics.length,
  };
}

// Calculate Bundle Size Reduction
export function calculateBundleSizeReduction(
  original: number,
  optimized: number
): { reduction: number; percentageReduction: number } {
  const reduction = original - optimized;
  const percentageReduction = (reduction / original) * 100;

  return {
    reduction,
    percentageReduction,
  };
}

// Estimate Load Time
export function estimateLoadTime(
  bundleSize: number,
  bandwidth: number // in Mbps
): number {
  // Convert bundle size from KB to bits
  const bits = bundleSize * 8 * 1024;
  // Convert bandwidth from Mbps to bits per second
  const bitsPerSecond = bandwidth * 1000000;
  // Calculate time in seconds
  return (bits / bitsPerSecond) * 1000; // Return in milliseconds
}

// Performance Score Calculation (0-100)
export function calculatePerformanceScore(vitals: CoreWebVitals): number {
  let score = 100;

  // FCP scoring (target: < 1.8s)
  if (vitals.fcp) {
    if (vitals.fcp > 3000) score -= 30;
    else if (vitals.fcp > 1800) score -= 15;
  }

  // LCP scoring (target: < 2.5s)
  if (vitals.lcp) {
    if (vitals.lcp > 4000) score -= 30;
    else if (vitals.lcp > 2500) score -= 15;
  }

  // CLS scoring (target: < 0.1)
  if (vitals.cls) {
    if (vitals.cls > 0.25) score -= 30;
    else if (vitals.cls > 0.1) score -= 15;
  }

  // TTI scoring (target: < 3.8s)
  if (vitals.tti) {
    if (vitals.tti > 7000) score -= 20;
    else if (vitals.tti > 3800) score -= 10;
  }

  // TBT scoring (target: < 200ms)
  if (vitals.tbt) {
    if (vitals.tbt > 600) score -= 20;
    else if (vitals.tbt > 200) score -= 10;
  }

  return Math.max(0, score);
}

// Format Performance Metrics for Display
export function formatPerformanceMetric(value: number, unit: string): string {
  switch (unit) {
    case "ms":
      return `${value.toFixed(2)}ms`;
    case "kb":
      return `${(value / 1024).toFixed(2)}KB`;
    case "mb":
      return `${(value / 1024 / 1024).toFixed(2)}MB`;
    case "percent":
      return `${value.toFixed(2)}%`;
    case "count":
      return `${Math.round(value)}`;
    default:
      return `${value.toFixed(2)}`;
  }
}

