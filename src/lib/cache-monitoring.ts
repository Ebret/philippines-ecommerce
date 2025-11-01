// Cache Performance Monitoring Utilities

export interface CachePerformanceMetrics {
  timestamp: number;
  hitRate: number;
  missRate: number;
  evictionRate: number;
  averageResponseTime: number;
  memoryUsed: number;
  memoryLimit: number;
  totalRequests: number;
  totalHits: number;
  totalMisses: number;
  totalEvictions: number;
}

export interface CacheHealthStatus {
  status: "healthy" | "degraded" | "critical";
  hitRate: number;
  memoryUsage: number;
  responseTime: number;
  issues: string[];
  recommendations: string[];
}

export interface CacheAlert {
  id: string;
  type: "warning" | "error" | "critical";
  message: string;
  timestamp: number;
  metric: string;
  threshold: number;
  currentValue: number;
}

export interface CacheEfficiencyScore {
  score: number;
  rating: "excellent" | "good" | "fair" | "poor";
  hitRate: number;
  memoryEfficiency: number;
  responseTimeEfficiency: number;
  recommendations: string[];
}

// Initialize cache performance metrics
export function initializeCachePerformanceMetrics(): CachePerformanceMetrics {
  return {
    timestamp: Date.now(),
    hitRate: 0,
    missRate: 0,
    evictionRate: 0,
    averageResponseTime: 0,
    memoryUsed: 0,
    memoryLimit: 268435456, // 256MB
    totalRequests: 0,
    totalHits: 0,
    totalMisses: 0,
    totalEvictions: 0,
  };
}

// Update cache performance metrics
export function updateCachePerformanceMetrics(
  metrics: CachePerformanceMetrics,
  hit: boolean,
  responseTime: number,
  memoryUsed: number,
  evicted: boolean = false
): CachePerformanceMetrics {
  const updated = { ...metrics };
  updated.timestamp = Date.now();
  updated.totalRequests++;
  updated.memoryUsed = memoryUsed;

  if (hit) {
    updated.totalHits++;
  } else {
    updated.totalMisses++;
  }

  if (evicted) {
    updated.totalEvictions++;
  }

  const total = updated.totalHits + updated.totalMisses;
  updated.hitRate = total > 0 ? (updated.totalHits / total) * 100 : 0;
  updated.missRate = total > 0 ? (updated.totalMisses / total) * 100 : 0;
  updated.evictionRate = total > 0 ? (updated.totalEvictions / total) * 100 : 0;
  updated.averageResponseTime =
    (updated.averageResponseTime * (updated.totalRequests - 1) + responseTime) / updated.totalRequests;

  return updated;
}

// Get cache health status
export function getCacheHealthStatus(metrics: CachePerformanceMetrics): CacheHealthStatus {
  const issues: string[] = [];
  const recommendations: string[] = [];
  let status: "healthy" | "degraded" | "critical" = "healthy";

  const memoryUsagePercent = (metrics.memoryUsed / metrics.memoryLimit) * 100;

  // Check hit rate
  if (metrics.hitRate < 30) {
    issues.push("Low cache hit rate");
    recommendations.push("Increase cache coverage");
    status = "degraded";
  } else if (metrics.hitRate < 50) {
    recommendations.push("Consider caching more data");
  }

  // Check memory usage
  if (memoryUsagePercent > 90) {
    issues.push("Critical memory usage");
    recommendations.push("Reduce cache size or implement eviction");
    status = "critical";
  } else if (memoryUsagePercent > 80) {
    issues.push("High memory usage");
    recommendations.push("Monitor memory usage");
    status = "degraded";
  }

  // Check response time
  if (metrics.averageResponseTime > 500) {
    issues.push("Slow cache response time");
    recommendations.push("Optimize cache retrieval");
    status = "degraded";
  }

  // Check eviction rate
  if (metrics.evictionRate > 10) {
    issues.push("High eviction rate");
    recommendations.push("Increase cache size or optimize TTL");
    status = "degraded";
  }

  return {
    status,
    hitRate: metrics.hitRate,
    memoryUsage: memoryUsagePercent,
    responseTime: metrics.averageResponseTime,
    issues,
    recommendations,
  };
}

// Create cache alert
export function createCacheAlert(
  type: "warning" | "error" | "critical",
  message: string,
  metric: string,
  threshold: number,
  currentValue: number
): CacheAlert {
  return {
    id: `alert:${Date.now()}:${Math.random()}`,
    type,
    message,
    timestamp: Date.now(),
    metric,
    threshold,
    currentValue,
  };
}

// Get cache efficiency score
export function getCacheEfficiencyScore(metrics: CachePerformanceMetrics): CacheEfficiencyScore {
  let score = 100;
  const memoryUsagePercent = (metrics.memoryUsed / metrics.memoryLimit) * 100;

  // Hit rate efficiency (40% weight)
  const hitRateEfficiency = Math.min(metrics.hitRate, 100);
  score -= (100 - hitRateEfficiency) * 0.4;

  // Memory efficiency (30% weight)
  const memoryEfficiency = Math.max(0, 100 - memoryUsagePercent);
  score -= (100 - memoryEfficiency) * 0.3;

  // Response time efficiency (30% weight)
  const responseTimeEfficiency = Math.max(0, 100 - (metrics.averageResponseTime / 10));
  score -= (100 - responseTimeEfficiency) * 0.3;

  let rating: "excellent" | "good" | "fair" | "poor" = "excellent";
  if (score < 50) rating = "poor";
  else if (score < 70) rating = "fair";
  else if (score < 85) rating = "good";

  const recommendations: string[] = [];
  if (hitRateEfficiency < 50) recommendations.push("Improve cache hit rate");
  if (memoryEfficiency < 50) recommendations.push("Optimize memory usage");
  if (responseTimeEfficiency < 50) recommendations.push("Optimize response time");

  return {
    score: Math.max(0, score),
    rating,
    hitRate: hitRateEfficiency,
    memoryEfficiency,
    responseTimeEfficiency,
    recommendations,
  };
}

// Get cache monitoring alerts
export function getCacheMonitoringAlerts(metrics: CachePerformanceMetrics): CacheAlert[] {
  const alerts: CacheAlert[] = [];
  const memoryUsagePercent = (metrics.memoryUsed / metrics.memoryLimit) * 100;

  // Hit rate alert
  if (metrics.hitRate < 30) {
    alerts.push(
      createCacheAlert(
        "warning",
        "Low cache hit rate detected",
        "hitRate",
        30,
        metrics.hitRate
      )
    );
  }

  // Memory usage alert
  if (memoryUsagePercent > 90) {
    alerts.push(
      createCacheAlert(
        "critical",
        "Critical memory usage",
        "memoryUsage",
        90,
        memoryUsagePercent
      )
    );
  } else if (memoryUsagePercent > 80) {
    alerts.push(
      createCacheAlert(
        "warning",
        "High memory usage",
        "memoryUsage",
        80,
        memoryUsagePercent
      )
    );
  }

  // Response time alert
  if (metrics.averageResponseTime > 500) {
    alerts.push(
      createCacheAlert(
        "warning",
        "Slow cache response time",
        "responseTime",
        500,
        metrics.averageResponseTime
      )
    );
  }

  // Eviction rate alert
  if (metrics.evictionRate > 10) {
    alerts.push(
      createCacheAlert(
        "warning",
        "High eviction rate",
        "evictionRate",
        10,
        metrics.evictionRate
      )
    );
  }

  return alerts;
}

// Get cache performance report
export function generateCachePerformanceReport(metrics: CachePerformanceMetrics): {
  summary: string;
  metrics: Record<string, any>;
  health: CacheHealthStatus;
  efficiency: CacheEfficiencyScore;
  alerts: CacheAlert[];
} {
  const health = getCacheHealthStatus(metrics);
  const efficiency = getCacheEfficiencyScore(metrics);
  const alerts = getCacheMonitoringAlerts(metrics);

  return {
    summary: `Cache performance: ${efficiency.rating} (${efficiency.score.toFixed(1)}%), Hit rate: ${metrics.hitRate.toFixed(2)}%`,
    metrics: {
      hitRate: `${metrics.hitRate.toFixed(2)}%`,
      missRate: `${metrics.missRate.toFixed(2)}%`,
      evictionRate: `${metrics.evictionRate.toFixed(2)}%`,
      averageResponseTime: `${metrics.averageResponseTime.toFixed(2)}ms`,
      memoryUsed: `${(metrics.memoryUsed / (1024 * 1024)).toFixed(2)} MB`,
      memoryLimit: `${(metrics.memoryLimit / (1024 * 1024)).toFixed(2)} MB`,
      totalRequests: metrics.totalRequests,
      totalHits: metrics.totalHits,
      totalMisses: metrics.totalMisses,
      totalEvictions: metrics.totalEvictions,
    },
    health,
    efficiency,
    alerts,
  };
}

// Get cache monitoring dashboard data
export function getCacheMonitoringDashboard(metrics: CachePerformanceMetrics[]): {
  currentMetrics: CachePerformanceMetrics;
  averageHitRate: number;
  peakMemoryUsage: number;
  averageResponseTime: number;
  trend: "improving" | "stable" | "degrading";
  recommendations: string[];
} {
  if (metrics.length === 0) {
    return {
      currentMetrics: initializeCachePerformanceMetrics(),
      averageHitRate: 0,
      peakMemoryUsage: 0,
      averageResponseTime: 0,
      trend: "stable",
      recommendations: [],
    };
  }

  const currentMetrics = metrics[metrics.length - 1];
  const averageHitRate = metrics.reduce((sum, m) => sum + m.hitRate, 0) / metrics.length;
  const peakMemoryUsage = Math.max(...metrics.map((m) => m.memoryUsed));
  const averageResponseTime = metrics.reduce((sum, m) => sum + m.averageResponseTime, 0) / metrics.length;

  let trend: "improving" | "stable" | "degrading" = "stable";
  if (metrics.length > 1) {
    const previousHitRate = metrics[metrics.length - 2].hitRate;
    if (currentMetrics.hitRate > previousHitRate + 5) {
      trend = "improving";
    } else if (currentMetrics.hitRate < previousHitRate - 5) {
      trend = "degrading";
    }
  }

  const recommendations: string[] = [];
  if (averageHitRate < 50) recommendations.push("Increase cache coverage");
  if (peakMemoryUsage > metrics[0].memoryLimit * 0.8) recommendations.push("Monitor memory usage");
  if (averageResponseTime > 300) recommendations.push("Optimize cache performance");

  return {
    currentMetrics,
    averageHitRate,
    peakMemoryUsage,
    averageResponseTime,
    trend,
    recommendations,
  };
}

// Get cache optimization opportunities
export function getCacheOptimizationOpportunities(metrics: CachePerformanceMetrics): {
  opportunity: string;
  impact: "high" | "medium" | "low";
  effort: "low" | "medium" | "high";
  estimatedImprovement: number;
}[] {
  const opportunities = [];

  if (metrics.hitRate < 50) {
    opportunities.push({
      opportunity: "Increase cache coverage",
      impact: "high",
      effort: "medium",
      estimatedImprovement: 20,
    });
  }

  if (metrics.averageResponseTime > 300) {
    opportunities.push({
      opportunity: "Optimize cache retrieval",
      impact: "medium",
      effort: "medium",
      estimatedImprovement: 15,
    });
  }

  if (metrics.evictionRate > 5) {
    opportunities.push({
      opportunity: "Increase cache size",
      impact: "medium",
      effort: "low",
      estimatedImprovement: 10,
    });
  }

  if ((metrics.memoryUsed / metrics.memoryLimit) * 100 > 70) {
    opportunities.push({
      opportunity: "Implement cache compression",
      impact: "medium",
      effort: "high",
      estimatedImprovement: 25,
    });
  }

  return opportunities;
}

// Get cache performance trends
export function getCachePerformanceTrends(metrics: CachePerformanceMetrics[]): {
  hitRateTrend: number[];
  memoryTrend: number[];
  responseTimeTrend: number[];
  overallTrend: "improving" | "stable" | "degrading";
} {
  const hitRateTrend = metrics.map((m) => m.hitRate);
  const memoryTrend = metrics.map((m) => (m.memoryUsed / m.memoryLimit) * 100);
  const responseTimeTrend = metrics.map((m) => m.averageResponseTime);

  let overallTrend: "improving" | "stable" | "degrading" = "stable";
  if (metrics.length > 1) {
    const recentHitRate = hitRateTrend.slice(-5).reduce((a, b) => a + b, 0) / Math.min(5, hitRateTrend.length);
    const previousHitRate = hitRateTrend.slice(0, -5).reduce((a, b) => a + b, 0) / Math.max(1, hitRateTrend.length - 5);

    if (recentHitRate > previousHitRate + 5) {
      overallTrend = "improving";
    } else if (recentHitRate < previousHitRate - 5) {
      overallTrend = "degrading";
    }
  }

  return {
    hitRateTrend,
    memoryTrend,
    responseTimeTrend,
    overallTrend,
  };
}

