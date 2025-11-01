// Real-time Performance Monitoring Utilities

export interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  timestamp: number;
  source: "database" | "api" | "frontend" | "system";
  tags: Record<string, string>;
}

export interface SystemResourceMetrics {
  timestamp: number;
  cpuUsage: number;
  memoryUsage: number;
  diskIORate: number;
  networkBandwidth: number;
  activeConnections: number;
  requestsPerSecond: number;
}

export interface APIResponseMetrics {
  timestamp: number;
  endpoint: string;
  method: string;
  responseTime: number;
  statusCode: number;
  requestSize: number;
  responseSize: number;
  cacheHit: boolean;
}

export interface PerformanceTimeSeries {
  metricName: string;
  dataPoints: Array<{
    timestamp: number;
    value: number;
  }>;
  aggregation: "average" | "max" | "min" | "sum";
  interval: number; // milliseconds
}

export interface PerformanceBaseline {
  metricName: string;
  baselineValue: number;
  upperThreshold: number;
  lowerThreshold: number;
  lastUpdated: number;
}

// Initialize performance metric
export function initializePerformanceMetric(
  name: string,
  value: number,
  unit: string,
  source: "database" | "api" | "frontend" | "system",
  tags: Record<string, string> = {}
): PerformanceMetric {
  return {
    id: `metric:${name}:${Date.now()}`,
    name,
    value,
    unit,
    timestamp: Date.now(),
    source,
    tags,
  };
}

// Initialize system resource metrics
export function initializeSystemResourceMetrics(): SystemResourceMetrics {
  return {
    timestamp: Date.now(),
    cpuUsage: 0,
    memoryUsage: 0,
    diskIORate: 0,
    networkBandwidth: 0,
    activeConnections: 0,
    requestsPerSecond: 0,
  };
}

// Update system resource metrics
export function updateSystemResourceMetrics(
  metrics: SystemResourceMetrics,
  cpuUsage: number,
  memoryUsage: number,
  diskIORate: number,
  networkBandwidth: number,
  activeConnections: number,
  requestsPerSecond: number
): SystemResourceMetrics {
  return {
    timestamp: Date.now(),
    cpuUsage: Math.min(cpuUsage, 100),
    memoryUsage: Math.min(memoryUsage, 100),
    diskIORate,
    networkBandwidth,
    activeConnections,
    requestsPerSecond,
  };
}

// Initialize API response metrics
export function initializeAPIResponseMetrics(
  endpoint: string,
  method: string,
  responseTime: number,
  statusCode: number,
  requestSize: number = 0,
  responseSize: number = 0,
  cacheHit: boolean = false
): APIResponseMetrics {
  return {
    timestamp: Date.now(),
    endpoint,
    method,
    responseTime,
    statusCode,
    requestSize,
    responseSize,
    cacheHit,
  };
}

// Calculate average response time
export function calculateAverageResponseTime(metrics: APIResponseMetrics[]): number {
  if (metrics.length === 0) return 0;
  const sum = metrics.reduce((acc, m) => acc + m.responseTime, 0);
  return sum / metrics.length;
}

// Calculate P95 response time
export function calculateP95ResponseTime(metrics: APIResponseMetrics[]): number {
  if (metrics.length === 0) return 0;
  const sorted = [...metrics].sort((a, b) => a.responseTime - b.responseTime);
  const index = Math.ceil(sorted.length * 0.95) - 1;
  return sorted[index]?.responseTime || 0;
}

// Calculate P99 response time
export function calculateP99ResponseTime(metrics: APIResponseMetrics[]): number {
  if (metrics.length === 0) return 0;
  const sorted = [...metrics].sort((a, b) => a.responseTime - b.responseTime);
  const index = Math.ceil(sorted.length * 0.99) - 1;
  return sorted[index]?.responseTime || 0;
}

// Calculate cache hit rate
export function calculateCacheHitRate(metrics: APIResponseMetrics[]): number {
  if (metrics.length === 0) return 0;
  const cacheHits = metrics.filter((m) => m.cacheHit).length;
  return (cacheHits / metrics.length) * 100;
}

// Calculate error rate
export function calculateErrorRate(metrics: APIResponseMetrics[]): number {
  if (metrics.length === 0) return 0;
  const errors = metrics.filter((m) => m.statusCode >= 400).length;
  return (errors / metrics.length) * 100;
}

// Initialize performance time series
export function initializePerformanceTimeSeries(
  metricName: string,
  aggregation: "average" | "max" | "min" | "sum" = "average",
  interval: number = 60000 // 1 minute
): PerformanceTimeSeries {
  return {
    metricName,
    dataPoints: [],
    aggregation,
    interval,
  };
}

// Add data point to time series
export function addDataPointToTimeSeries(
  timeSeries: PerformanceTimeSeries,
  value: number,
  timestamp: number = Date.now()
): PerformanceTimeSeries {
  return {
    ...timeSeries,
    dataPoints: [
      ...timeSeries.dataPoints,
      {
        timestamp,
        value,
      },
    ],
  };
}

// Get time series trend
export function getTimeSeriesTrend(timeSeries: PerformanceTimeSeries): "improving" | "stable" | "degrading" {
  if (timeSeries.dataPoints.length < 2) return "stable";

  const recent = timeSeries.dataPoints.slice(-10);
  const older = timeSeries.dataPoints.slice(-20, -10);

  if (older.length === 0) return "stable";

  const recentAvg = recent.reduce((sum, dp) => sum + dp.value, 0) / recent.length;
  const olderAvg = older.reduce((sum, dp) => sum + dp.value, 0) / older.length;

  const percentChange = ((recentAvg - olderAvg) / olderAvg) * 100;

  if (percentChange < -5) return "improving";
  if (percentChange > 5) return "degrading";
  return "stable";
}

// Initialize performance baseline
export function initializePerformanceBaseline(
  metricName: string,
  baselineValue: number,
  thresholdPercentage: number = 20
): PerformanceBaseline {
  const threshold = (baselineValue * thresholdPercentage) / 100;
  return {
    metricName,
    baselineValue,
    upperThreshold: baselineValue + threshold,
    lowerThreshold: Math.max(0, baselineValue - threshold),
    lastUpdated: Date.now(),
  };
}

// Check if metric exceeds baseline
export function checkMetricBaseline(metric: PerformanceMetric, baseline: PerformanceBaseline): "normal" | "warning" | "critical" {
  if (metric.value > baseline.upperThreshold * 1.2) return "critical";
  if (metric.value > baseline.upperThreshold) return "warning";
  if (metric.value < baseline.lowerThreshold) return "warning";
  return "normal";
}

// Get performance monitoring best practices
export function getPerformanceMonitoringBestPractices(): {
  practice: string;
  description: string;
  priority: "high" | "medium" | "low";
}[] {
  return [
    {
      practice: "Monitor API response times",
      description: "Track response times for all API endpoints",
      priority: "high",
    },
    {
      practice: "Monitor system resources",
      description: "Track CPU, memory, and disk usage",
      priority: "high",
    },
    {
      practice: "Monitor error rates",
      description: "Track error rates and exceptions",
      priority: "high",
    },
    {
      practice: "Monitor cache hit rates",
      description: "Track cache effectiveness",
      priority: "medium",
    },
    {
      practice: "Monitor database performance",
      description: "Track database query performance",
      priority: "high",
    },
    {
      practice: "Monitor user experience",
      description: "Track Core Web Vitals and user metrics",
      priority: "high",
    },
    {
      practice: "Set up alerts",
      description: "Configure alerts for performance issues",
      priority: "high",
    },
    {
      practice: "Regular analysis",
      description: "Regularly analyze performance trends",
      priority: "medium",
    },
  ];
}

// Generate performance summary
export function generatePerformanceSummary(
  apiMetrics: APIResponseMetrics[],
  systemMetrics: SystemResourceMetrics,
  timeSeries: PerformanceTimeSeries[]
): {
  summary: string;
  metrics: Record<string, any>;
  trends: Record<string, string>;
  recommendations: string[];
} {
  const avgResponseTime = calculateAverageResponseTime(apiMetrics);
  const p95ResponseTime = calculateP95ResponseTime(apiMetrics);
  const cacheHitRate = calculateCacheHitRate(apiMetrics);
  const errorRate = calculateErrorRate(apiMetrics);

  const recommendations: string[] = [];

  if (avgResponseTime > 500) {
    recommendations.push("Optimize slow API endpoints");
  }
  if (cacheHitRate < 70) {
    recommendations.push("Improve cache hit rate");
  }
  if (errorRate > 1) {
    recommendations.push("Investigate error rate increase");
  }
  if (systemMetrics.cpuUsage > 80) {
    recommendations.push("Reduce CPU usage");
  }
  if (systemMetrics.memoryUsage > 85) {
    recommendations.push("Reduce memory usage");
  }

  const trends: Record<string, string> = {};
  timeSeries.forEach((ts) => {
    trends[ts.metricName] = getTimeSeriesTrend(ts);
  });

  return {
    summary: `Avg response time: ${avgResponseTime.toFixed(2)}ms, P95: ${p95ResponseTime.toFixed(2)}ms, Cache hit rate: ${cacheHitRate.toFixed(2)}%, Error rate: ${errorRate.toFixed(2)}%`,
    metrics: {
      averageResponseTime: avgResponseTime,
      p95ResponseTime,
      p99ResponseTime: calculateP99ResponseTime(apiMetrics),
      cacheHitRate,
      errorRate,
      cpuUsage: systemMetrics.cpuUsage,
      memoryUsage: systemMetrics.memoryUsage,
      activeConnections: systemMetrics.activeConnections,
      requestsPerSecond: systemMetrics.requestsPerSecond,
    },
    trends,
    recommendations,
  };
}

// Get monitoring deployment checklist
export function getMonitoringDeploymentChecklist(): {
  task: string;
  priority: "high" | "medium" | "low";
  completed: boolean;
}[] {
  return [
    { task: "Set up metrics collection", priority: "high", completed: false },
    { task: "Configure performance baselines", priority: "high", completed: false },
    { task: "Set up alert system", priority: "high", completed: false },
    { task: "Create performance dashboard", priority: "high", completed: false },
    { task: "Configure Core Web Vitals monitoring", priority: "high", completed: false },
    { task: "Set up error tracking", priority: "high", completed: false },
    { task: "Configure notification channels", priority: "medium", completed: false },
    { task: "Set up historical data storage", priority: "medium", completed: false },
    { task: "Configure trend analysis", priority: "medium", completed: false },
    { task: "Test monitoring system", priority: "high", completed: false },
  ];
}

