// CDN Performance Monitoring Utilities

export interface CDNPerformanceMetrics {
  timestamp: number;
  totalRequests: number;
  cacheHits: number;
  cacheMisses: number;
  hitRate: number;
  averageResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
  bandwidthUsed: number;
  bandwidthSaved: number;
  errorRate: number;
  totalErrors: number;
  edgeLocations: Record<string, CDNEdgeMetrics>;
}

export interface CDNEdgeMetrics {
  location: string;
  requests: number;
  cacheHits: number;
  hitRate: number;
  averageResponseTime: number;
  bandwidth: number;
  errors: number;
}

export interface CDNAlert {
  id: string;
  type: "warning" | "critical" | "info";
  message: string;
  metric: string;
  threshold: number;
  currentValue: number;
  timestamp: number;
  resolved: boolean;
}

export interface CDNHealthStatus {
  status: "healthy" | "degraded" | "critical";
  issues: string[];
  recommendations: string[];
  lastCheckTime: number;
}

export interface CDNPerformanceReport {
  period: string;
  totalRequests: number;
  averageHitRate: number;
  averageResponseTime: number;
  bandwidthSaved: number;
  topEdgeLocations: { location: string; requests: number }[];
  topErrors: { error: string; count: number }[];
  recommendations: string[];
}

// Alert thresholds
export const CDN_ALERT_THRESHOLDS = {
  hitRate: {
    warning: 70,
    critical: 50,
  },
  responseTime: {
    warning: 1000,
    critical: 2000,
  },
  errorRate: {
    warning: 1,
    critical: 5,
  },
  bandwidth: {
    warning: 1000000000, // 1GB
    critical: 5000000000, // 5GB
  },
};

// Initialize CDN performance metrics
export function initializeCDNPerformanceMetrics(): CDNPerformanceMetrics {
  return {
    timestamp: Date.now(),
    totalRequests: 0,
    cacheHits: 0,
    cacheMisses: 0,
    hitRate: 0,
    averageResponseTime: 0,
    p95ResponseTime: 0,
    p99ResponseTime: 0,
    bandwidthUsed: 0,
    bandwidthSaved: 0,
    errorRate: 0,
    totalErrors: 0,
    edgeLocations: {},
  };
}

// Update CDN performance metrics
export function updateCDNPerformanceMetrics(
  metrics: CDNPerformanceMetrics,
  cacheHit: boolean,
  responseTime: number,
  bandwidth: number,
  edgeLocation: string,
  error: boolean = false
): CDNPerformanceMetrics {
  const updated = { ...metrics };
  updated.totalRequests++;
  updated.bandwidthUsed += bandwidth;

  if (cacheHit) {
    updated.cacheHits++;
    updated.bandwidthSaved += bandwidth;
  } else {
    updated.cacheMisses++;
  }

  updated.hitRate = (updated.cacheHits / updated.totalRequests) * 100;
  updated.averageResponseTime =
    (updated.averageResponseTime * (updated.totalRequests - 1) + responseTime) / updated.totalRequests;

  if (error) {
    updated.totalErrors++;
  }

  updated.errorRate = (updated.totalErrors / updated.totalRequests) * 100;

  // Update edge location metrics
  if (!updated.edgeLocations[edgeLocation]) {
    updated.edgeLocations[edgeLocation] = {
      location: edgeLocation,
      requests: 0,
      cacheHits: 0,
      hitRate: 0,
      averageResponseTime: 0,
      bandwidth: 0,
      errors: 0,
    };
  }

  const edgeMetrics = updated.edgeLocations[edgeLocation];
  edgeMetrics.requests++;
  edgeMetrics.bandwidth += bandwidth;

  if (cacheHit) {
    edgeMetrics.cacheHits++;
  }

  edgeMetrics.hitRate = (edgeMetrics.cacheHits / edgeMetrics.requests) * 100;
  edgeMetrics.averageResponseTime =
    (edgeMetrics.averageResponseTime * (edgeMetrics.requests - 1) + responseTime) / edgeMetrics.requests;

  if (error) {
    edgeMetrics.errors++;
  }

  return updated;
}

// Get CDN health status
export function getCDNHealthStatus(metrics: CDNPerformanceMetrics): CDNHealthStatus {
  const issues: string[] = [];
  const recommendations: string[] = [];
  let status: "healthy" | "degraded" | "critical" = "healthy";

  // Check hit rate
  if (metrics.hitRate < CDN_ALERT_THRESHOLDS.hitRate.critical) {
    issues.push(`Low cache hit rate: ${metrics.hitRate.toFixed(2)}%`);
    recommendations.push("Increase cache coverage and TTL values");
    status = "critical";
  } else if (metrics.hitRate < CDN_ALERT_THRESHOLDS.hitRate.warning) {
    issues.push(`Cache hit rate below target: ${metrics.hitRate.toFixed(2)}%`);
    recommendations.push("Review cache rules and TTL values");
    status = "degraded";
  }

  // Check response time
  if (metrics.averageResponseTime > CDN_ALERT_THRESHOLDS.responseTime.critical) {
    issues.push(`High response time: ${metrics.averageResponseTime.toFixed(2)}ms`);
    recommendations.push("Check origin server performance");
    status = "critical";
  } else if (metrics.averageResponseTime > CDN_ALERT_THRESHOLDS.responseTime.warning) {
    issues.push(`Response time above target: ${metrics.averageResponseTime.toFixed(2)}ms`);
    recommendations.push("Optimize origin server or increase edge locations");
    status = "degraded";
  }

  // Check error rate
  if (metrics.errorRate > CDN_ALERT_THRESHOLDS.errorRate.critical) {
    issues.push(`High error rate: ${metrics.errorRate.toFixed(2)}%`);
    recommendations.push("Investigate origin server errors");
    status = "critical";
  } else if (metrics.errorRate > CDN_ALERT_THRESHOLDS.errorRate.warning) {
    issues.push(`Error rate above target: ${metrics.errorRate.toFixed(2)}%`);
    recommendations.push("Monitor origin server health");
    status = "degraded";
  }

  if (status === "healthy") {
    recommendations.push("CDN performance is optimal");
  }

  return {
    status,
    issues,
    recommendations,
    lastCheckTime: Date.now(),
  };
}

// Create CDN alert
export function createCDNAlert(
  type: "warning" | "critical" | "info",
  message: string,
  metric: string,
  threshold: number,
  currentValue: number
): CDNAlert {
  return {
    id: `alert:${Date.now()}`,
    type,
    message,
    metric,
    threshold,
    currentValue,
    timestamp: Date.now(),
    resolved: false,
  };
}

// Get CDN alerts
export function getCDNAlerts(metrics: CDNPerformanceMetrics): CDNAlert[] {
  const alerts: CDNAlert[] = [];

  // Check hit rate
  if (metrics.hitRate < CDN_ALERT_THRESHOLDS.hitRate.critical) {
    alerts.push(
      createCDNAlert(
        "critical",
        `Cache hit rate critically low: ${metrics.hitRate.toFixed(2)}%`,
        "hitRate",
        CDN_ALERT_THRESHOLDS.hitRate.critical,
        metrics.hitRate
      )
    );
  } else if (metrics.hitRate < CDN_ALERT_THRESHOLDS.hitRate.warning) {
    alerts.push(
      createCDNAlert(
        "warning",
        `Cache hit rate below target: ${metrics.hitRate.toFixed(2)}%`,
        "hitRate",
        CDN_ALERT_THRESHOLDS.hitRate.warning,
        metrics.hitRate
      )
    );
  }

  // Check response time
  if (metrics.averageResponseTime > CDN_ALERT_THRESHOLDS.responseTime.critical) {
    alerts.push(
      createCDNAlert(
        "critical",
        `Response time critically high: ${metrics.averageResponseTime.toFixed(2)}ms`,
        "responseTime",
        CDN_ALERT_THRESHOLDS.responseTime.critical,
        metrics.averageResponseTime
      )
    );
  } else if (metrics.averageResponseTime > CDN_ALERT_THRESHOLDS.responseTime.warning) {
    alerts.push(
      createCDNAlert(
        "warning",
        `Response time above target: ${metrics.averageResponseTime.toFixed(2)}ms`,
        "responseTime",
        CDN_ALERT_THRESHOLDS.responseTime.warning,
        metrics.averageResponseTime
      )
    );
  }

  // Check error rate
  if (metrics.errorRate > CDN_ALERT_THRESHOLDS.errorRate.critical) {
    alerts.push(
      createCDNAlert(
        "critical",
        `Error rate critically high: ${metrics.errorRate.toFixed(2)}%`,
        "errorRate",
        CDN_ALERT_THRESHOLDS.errorRate.critical,
        metrics.errorRate
      )
    );
  } else if (metrics.errorRate > CDN_ALERT_THRESHOLDS.errorRate.warning) {
    alerts.push(
      createCDNAlert(
        "warning",
        `Error rate above target: ${metrics.errorRate.toFixed(2)}%`,
        "errorRate",
        CDN_ALERT_THRESHOLDS.errorRate.warning,
        metrics.errorRate
      )
    );
  }

  return alerts;
}

// Get CDN efficiency score
export function getCDNEfficiencyScore(metrics: CDNPerformanceMetrics): number {
  let score = 100;

  // Deduct for low hit rate
  if (metrics.hitRate < 80) {
    score -= (80 - metrics.hitRate) * 0.5;
  }

  // Deduct for high response time
  if (metrics.averageResponseTime > 500) {
    score -= Math.min((metrics.averageResponseTime - 500) / 10, 20);
  }

  // Deduct for high error rate
  if (metrics.errorRate > 1) {
    score -= (metrics.errorRate - 1) * 5;
  }

  return Math.max(0, Math.min(100, score));
}

// Generate CDN performance report
export function generateCDNPerformanceReport(
  metrics: CDNPerformanceMetrics,
  period: string = "1 hour"
): CDNPerformanceReport {
  const topEdgeLocations = Object.values(metrics.edgeLocations)
    .sort((a, b) => b.requests - a.requests)
    .slice(0, 5)
    .map((m) => ({ location: m.location, requests: m.requests }));

  return {
    period,
    totalRequests: metrics.totalRequests,
    averageHitRate: metrics.hitRate,
    averageResponseTime: metrics.averageResponseTime,
    bandwidthSaved: metrics.bandwidthSaved,
    topEdgeLocations,
    topErrors: [],
    recommendations: [
      metrics.hitRate < 80 ? "Increase cache coverage" : "Cache coverage is good",
      metrics.averageResponseTime > 500 ? "Optimize origin server" : "Response time is good",
      metrics.errorRate > 1 ? "Investigate errors" : "Error rate is acceptable",
    ],
  };
}

// Get CDN optimization opportunities
export function getCDNOptimizationOpportunities(metrics: CDNPerformanceMetrics): {
  opportunity: string;
  impact: string;
  effort: string;
  priority: number;
}[] {
  const opportunities = [];

  if (metrics.hitRate < 80) {
    opportunities.push({
      opportunity: "Increase cache TTL for static assets",
      impact: "High - Could improve hit rate by 10-20%",
      effort: "Low - Configuration change",
      priority: 1,
    });
  }

  if (metrics.averageResponseTime > 500) {
    opportunities.push({
      opportunity: "Add more edge locations",
      impact: "High - Could reduce response time by 30-50%",
      effort: "Medium - Requires CDN configuration",
      priority: 2,
    });
  }

  if (metrics.errorRate > 1) {
    opportunities.push({
      opportunity: "Implement health checks and failover",
      impact: "High - Could reduce error rate by 50-80%",
      effort: "Medium - Requires implementation",
      priority: 3,
    });
  }

  opportunities.push({
    opportunity: "Implement image optimization",
    impact: "Medium - Could reduce bandwidth by 30-50%",
    effort: "Medium - Requires CDN configuration",
    priority: 4,
  });

  return opportunities;
}

// Get CDN performance trends
export function getCDNPerformanceTrends(
  metrics: CDNPerformanceMetrics[]
): {
  metric: string;
  trend: "improving" | "degrading" | "stable";
  change: number;
} {
  if (metrics.length < 2) {
    return { metric: "N/A", trend: "stable", change: 0 };
  }

  const latest = metrics[metrics.length - 1];
  const previous = metrics[metrics.length - 2];

  const hitRateChange = latest.hitRate - previous.hitRate;
  const responseTimeChange = latest.averageResponseTime - previous.averageResponseTime;

  let trend: "improving" | "degrading" | "stable" = "stable";
  let change = 0;

  if (hitRateChange > 5) {
    trend = "improving";
    change = hitRateChange;
  } else if (hitRateChange < -5) {
    trend = "degrading";
    change = hitRateChange;
  } else if (responseTimeChange < -50) {
    trend = "improving";
    change = -responseTimeChange;
  } else if (responseTimeChange > 50) {
    trend = "degrading";
    change = responseTimeChange;
  }

  return { metric: "CDN Performance", trend, change };
}

// Get CDN monitoring dashboard data
export function getCDNMonitoringDashboardData(metrics: CDNPerformanceMetrics): {
  hitRate: number;
  responseTime: number;
  errorRate: number;
  bandwidthSaved: number;
  topEdgeLocations: { location: string; hitRate: number }[];
  healthStatus: string;
  efficiencyScore: number;
} {
  const topEdgeLocations = Object.values(metrics.edgeLocations)
    .sort((a, b) => b.hitRate - a.hitRate)
    .slice(0, 5)
    .map((m) => ({ location: m.location, hitRate: m.hitRate }));

  const healthStatus = getCDNHealthStatus(metrics).status;
  const efficiencyScore = getCDNEfficiencyScore(metrics);

  return {
    hitRate: metrics.hitRate,
    responseTime: metrics.averageResponseTime,
    errorRate: metrics.errorRate,
    bandwidthSaved: metrics.bandwidthSaved,
    topEdgeLocations,
    healthStatus,
    efficiencyScore,
  };
}

