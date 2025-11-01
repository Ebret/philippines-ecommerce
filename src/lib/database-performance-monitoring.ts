// Database Performance Monitoring Utilities

export interface SlowQueryAlert {
  id: string;
  query: string;
  executionTime: number;
  threshold: number;
  severity: "warning" | "critical";
  timestamp: number;
  affectedRows: number;
  recommendations: string[];
}

export interface DatabasePerformanceMetrics {
  timestamp: number;
  queryCount: number;
  averageQueryTime: number;
  maxQueryTime: number;
  minQueryTime: number;
  slowQueryCount: number;
  connectionCount: number;
  activeConnections: number;
  cacheHitRate: number;
  diskIORate: number;
  cpuUsage: number;
  memoryUsage: number;
}

export interface PerformanceAlert {
  id: string;
  type: "slow_query" | "high_cpu" | "high_memory" | "connection_pool" | "disk_io";
  severity: "info" | "warning" | "critical";
  message: string;
  timestamp: number;
  value: number;
  threshold: number;
  recommendations: string[];
}

export interface PerformanceDashboard {
  timestamp: number;
  metrics: DatabasePerformanceMetrics;
  alerts: PerformanceAlert[];
  trends: {
    queryTimetrend: "improving" | "stable" | "degrading";
    cacheHitRateTrend: "improving" | "stable" | "degrading";
    connectionTrend: "increasing" | "stable" | "decreasing";
  };
  recommendations: string[];
}

// Performance alert thresholds
export const PERFORMANCE_ALERT_THRESHOLDS = {
  slowQueryTime: 500, // 500ms
  warningQueryTime: 100, // 100ms
  highCPUUsage: 80, // 80%
  highMemoryUsage: 85, // 85%
  lowCacheHitRate: 70, // 70%
  highDiskIORate: 80, // 80%
  maxConnections: 20,
  warningConnections: 15,
};

// Initialize database performance metrics
export function initializeDatabasePerformanceMetrics(): DatabasePerformanceMetrics {
  return {
    timestamp: Date.now(),
    queryCount: 0,
    averageQueryTime: 0,
    maxQueryTime: 0,
    minQueryTime: 0,
    slowQueryCount: 0,
    connectionCount: 0,
    activeConnections: 0,
    cacheHitRate: 0,
    diskIORate: 0,
    cpuUsage: 0,
    memoryUsage: 0,
  };
}

// Update database performance metrics
export function updateDatabasePerformanceMetrics(
  metrics: DatabasePerformanceMetrics,
  queryTime: number,
  connectionCount: number,
  activeConnections: number,
  cacheHitRate: number,
  cpuUsage: number,
  memoryUsage: number
): DatabasePerformanceMetrics {
  const updated = { ...metrics };

  updated.queryCount++;
  updated.averageQueryTime = (updated.averageQueryTime * (updated.queryCount - 1) + queryTime) / updated.queryCount;
  updated.maxQueryTime = Math.max(updated.maxQueryTime, queryTime);
  updated.minQueryTime = updated.minQueryTime === 0 ? queryTime : Math.min(updated.minQueryTime, queryTime);

  if (queryTime > PERFORMANCE_ALERT_THRESHOLDS.slowQueryTime) {
    updated.slowQueryCount++;
  }

  updated.connectionCount = connectionCount;
  updated.activeConnections = activeConnections;
  updated.cacheHitRate = cacheHitRate;
  updated.cpuUsage = cpuUsage;
  updated.memoryUsage = memoryUsage;

  return updated;
}

// Create slow query alert
export function createSlowQueryAlert(
  query: string,
  executionTime: number,
  affectedRows: number = 0
): SlowQueryAlert {
  const severity = executionTime > PERFORMANCE_ALERT_THRESHOLDS.slowQueryTime ? "critical" : "warning";

  const recommendations: string[] = [];
  if (query.toUpperCase().includes("SELECT *")) {
    recommendations.push("Avoid SELECT *, specify only needed columns");
  }
  if (query.toUpperCase().includes("LIKE '%")) {
    recommendations.push("Avoid leading wildcards in LIKE patterns");
  }
  if (query.toUpperCase().includes("IN (SELECT")) {
    recommendations.push("Replace IN subqueries with JOINs");
  }

  return {
    id: `alert:slow:${Date.now()}`,
    query,
    executionTime,
    threshold: PERFORMANCE_ALERT_THRESHOLDS.slowQueryTime,
    severity,
    timestamp: Date.now(),
    affectedRows,
    recommendations,
  };
}

// Create performance alert
export function createPerformanceAlert(
  type: "slow_query" | "high_cpu" | "high_memory" | "connection_pool" | "disk_io",
  value: number,
  threshold: number
): PerformanceAlert {
  const severity = value > threshold * 1.2 ? "critical" : value > threshold ? "warning" : "info";

  const recommendations: string[] = [];

  switch (type) {
    case "high_cpu":
      recommendations.push("Optimize slow queries");
      recommendations.push("Add indexes to frequently queried columns");
      recommendations.push("Consider query caching");
      break;
    case "high_memory":
      recommendations.push("Reduce result set sizes");
      recommendations.push("Implement pagination");
      recommendations.push("Archive old data");
      break;
    case "connection_pool":
      recommendations.push("Increase max connections");
      recommendations.push("Reduce query execution time");
      recommendations.push("Implement connection pooling");
      break;
    case "disk_io":
      recommendations.push("Add indexes to reduce full table scans");
      recommendations.push("Implement caching");
      recommendations.push("Archive old data");
      break;
  }

  return {
    id: `alert:${type}:${Date.now()}`,
    type,
    severity,
    message: `${type} alert: ${value.toFixed(2)} (threshold: ${threshold.toFixed(2)})`,
    timestamp: Date.now(),
    value,
    threshold,
    recommendations,
  };
}

// Check performance thresholds
export function checkPerformanceThresholds(metrics: DatabasePerformanceMetrics): PerformanceAlert[] {
  const alerts: PerformanceAlert[] = [];

  // Check CPU usage
  if (metrics.cpuUsage > PERFORMANCE_ALERT_THRESHOLDS.highCPUUsage) {
    alerts.push(createPerformanceAlert("high_cpu", metrics.cpuUsage, PERFORMANCE_ALERT_THRESHOLDS.highCPUUsage));
  }

  // Check memory usage
  if (metrics.memoryUsage > PERFORMANCE_ALERT_THRESHOLDS.highMemoryUsage) {
    alerts.push(createPerformanceAlert("high_memory", metrics.memoryUsage, PERFORMANCE_ALERT_THRESHOLDS.highMemoryUsage));
  }

  // Check cache hit rate
  if (metrics.cacheHitRate < PERFORMANCE_ALERT_THRESHOLDS.lowCacheHitRate) {
    alerts.push(createPerformanceAlert("disk_io", 100 - metrics.cacheHitRate, 100 - PERFORMANCE_ALERT_THRESHOLDS.lowCacheHitRate));
  }

  // Check connection pool
  if (metrics.activeConnections > PERFORMANCE_ALERT_THRESHOLDS.warningConnections) {
    alerts.push(createPerformanceAlert("connection_pool", metrics.activeConnections, PERFORMANCE_ALERT_THRESHOLDS.warningConnections));
  }

  return alerts;
}

// Generate performance dashboard
export function generatePerformanceDashboard(
  metrics: DatabasePerformanceMetrics,
  previousMetrics?: DatabasePerformanceMetrics
): PerformanceDashboard {
  const alerts = checkPerformanceThresholds(metrics);

  // Determine trends
  const queryTimeTrendValue = previousMetrics
    ? metrics.averageQueryTime < previousMetrics.averageQueryTime
      ? "improving"
      : metrics.averageQueryTime > previousMetrics.averageQueryTime
        ? "degrading"
        : "stable"
    : "stable";

  const cacheHitRateTrendValue = previousMetrics
    ? metrics.cacheHitRate > previousMetrics.cacheHitRate
      ? "improving"
      : metrics.cacheHitRate < previousMetrics.cacheHitRate
        ? "degrading"
        : "stable"
    : "stable";

  const connectionTrendValue = previousMetrics
    ? metrics.activeConnections > previousMetrics.activeConnections
      ? "increasing"
      : metrics.activeConnections < previousMetrics.activeConnections
        ? "decreasing"
        : "stable"
    : "stable";

  const recommendations: string[] = [];
  if (metrics.slowQueryCount > 0) {
    recommendations.push(`Optimize ${metrics.slowQueryCount} slow queries`);
  }
  if (metrics.cacheHitRate < 80) {
    recommendations.push("Improve cache hit rate");
  }
  if (metrics.cpuUsage > 70) {
    recommendations.push("Reduce CPU usage");
  }

  return {
    timestamp: Date.now(),
    metrics,
    alerts,
    trends: {
      queryTimetrend: queryTimeTrendValue,
      cacheHitRateTrend: cacheHitRateTrendValue,
      connectionTrend: connectionTrendValue,
    },
    recommendations,
  };
}

// Get performance monitoring best practices
export function getPerformanceMonitoringBestPractices(): {
  practice: string;
  description: string;
  expectedImprovement: number;
}[] {
  return [
    {
      practice: "Monitor slow queries",
      description: "Track and analyze slow-running queries",
      expectedImprovement: 50,
    },
    {
      practice: "Track cache hit rate",
      description: "Monitor cache effectiveness",
      expectedImprovement: 30,
    },
    {
      practice: "Monitor connection pool",
      description: "Track connection pool utilization",
      expectedImprovement: 20,
    },
    {
      practice: "Monitor CPU usage",
      description: "Track CPU utilization",
      expectedImprovement: 15,
    },
    {
      practice: "Monitor memory usage",
      description: "Track memory consumption",
      expectedImprovement: 15,
    },
    {
      practice: "Set up alerts",
      description: "Configure alerts for performance issues",
      expectedImprovement: 25,
    },
    {
      practice: "Create dashboards",
      description: "Visualize performance metrics",
      expectedImprovement: 10,
    },
    {
      practice: "Regular analysis",
      description: "Regularly analyze performance trends",
      expectedImprovement: 20,
    },
  ];
}

// Get performance monitoring deployment checklist
export function getPerformanceMonitoringDeploymentChecklist(): {
  task: string;
  priority: "high" | "medium" | "low";
  completed: boolean;
}[] {
  return [
    { task: "Set up query logging", priority: "high", completed: false },
    { task: "Configure slow query log", priority: "high", completed: false },
    { task: "Set up metrics collection", priority: "high", completed: false },
    { task: "Create performance dashboard", priority: "high", completed: false },
    { task: "Configure alerts", priority: "high", completed: false },
    { task: "Set up monitoring tools", priority: "medium", completed: false },
    { task: "Configure log retention", priority: "medium", completed: false },
    { task: "Test monitoring system", priority: "high", completed: false },
    { task: "Document procedures", priority: "medium", completed: false },
    { task: "Train team", priority: "low", completed: false },
  ];
}

// Generate performance monitoring report
export function generatePerformanceMonitoringReport(dashboard: PerformanceDashboard): {
  summary: string;
  details: Record<string, any>;
  alerts: PerformanceAlert[];
  recommendations: string[];
} {
  return {
    summary: `Average query time: ${dashboard.metrics.averageQueryTime.toFixed(2)}ms, Slow queries: ${dashboard.metrics.slowQueryCount}, Cache hit rate: ${dashboard.metrics.cacheHitRate.toFixed(2)}%`,
    details: {
      queryCount: dashboard.metrics.queryCount,
      averageQueryTime: `${dashboard.metrics.averageQueryTime.toFixed(2)}ms`,
      maxQueryTime: `${dashboard.metrics.maxQueryTime.toFixed(2)}ms`,
      slowQueryCount: dashboard.metrics.slowQueryCount,
      cacheHitRate: `${dashboard.metrics.cacheHitRate.toFixed(2)}%`,
      cpuUsage: `${dashboard.metrics.cpuUsage.toFixed(2)}%`,
      memoryUsage: `${dashboard.metrics.memoryUsage.toFixed(2)}%`,
      activeConnections: dashboard.metrics.activeConnections,
      queryTimeTrend: dashboard.trends.queryTimetrend,
      cacheHitRateTrend: dashboard.trends.cacheHitRateTrend,
    },
    alerts: dashboard.alerts,
    recommendations: dashboard.recommendations,
  };
}

