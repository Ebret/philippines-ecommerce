// Query Performance Analysis Utilities

export interface QueryPerformanceMetrics {
  queryId: string;
  query: string;
  executionTime: number;
  rowsAffected: number;
  rowsScanned: number;
  indexUsed: string[];
  fullTableScan: boolean;
  timestamp: number;
  status: "fast" | "slow" | "critical";
}

export interface SlowQuery {
  id: string;
  query: string;
  executionTime: number;
  averageExecutionTime: number;
  maxExecutionTime: number;
  minExecutionTime: number;
  executionCount: number;
  totalTime: number;
  lastExecuted: number;
  status: "slow" | "critical";
  optimizationSuggestions: string[];
}

export interface QueryBottleneck {
  id: string;
  type: "full_table_scan" | "missing_index" | "inefficient_join" | "n_plus_one" | "subquery";
  query: string;
  impact: "high" | "medium" | "low";
  affectedRows: number;
  estimatedImprovement: number;
  recommendations: string[];
}

export interface QueryOptimizationOpportunity {
  id: string;
  query: string;
  currentPerformance: number;
  optimizedPerformance: number;
  improvementPercentage: number;
  optimizationType: string;
  priority: "high" | "medium" | "low";
  estimatedEffort: "low" | "medium" | "high";
  recommendations: string[];
}

export interface DatabaseQueryStats {
  totalQueries: number;
  averageExecutionTime: number;
  slowQueryCount: number;
  criticalQueryCount: number;
  fullTableScanCount: number;
  indexUsageRate: number;
  cacheHitRate: number;
  totalExecutionTime: number;
}

// Slow query thresholds (in milliseconds)
export const SLOW_QUERY_THRESHOLDS = {
  warning: 100, // 100ms
  critical: 500, // 500ms
};

// Query performance status
export function getQueryPerformanceStatus(executionTime: number): "fast" | "slow" | "critical" {
  if (executionTime > SLOW_QUERY_THRESHOLDS.critical) {
    return "critical";
  } else if (executionTime > SLOW_QUERY_THRESHOLDS.warning) {
    return "slow";
  }
  return "fast";
}

// Initialize query performance metrics
export function initializeQueryPerformanceMetrics(
  queryId: string,
  query: string,
  executionTime: number,
  rowsAffected: number,
  rowsScanned: number,
  indexUsed: string[] = [],
  fullTableScan: boolean = false
): QueryPerformanceMetrics {
  return {
    queryId,
    query,
    executionTime,
    rowsAffected,
    rowsScanned,
    indexUsed,
    fullTableScan,
    timestamp: Date.now(),
    status: getQueryPerformanceStatus(executionTime),
  };
}

// Identify slow queries
export function identifySlowQueries(metrics: QueryPerformanceMetrics[]): SlowQuery[] {
  const queryMap = new Map<string, QueryPerformanceMetrics[]>();

  // Group metrics by query
  for (const metric of metrics) {
    if (!queryMap.has(metric.query)) {
      queryMap.set(metric.query, []);
    }
    queryMap.get(metric.query)!.push(metric);
  }

  const slowQueries: SlowQuery[] = [];

  for (const [query, queryMetrics] of queryMap.entries()) {
    const executionTimes = queryMetrics.map((m) => m.executionTime);
    const averageExecutionTime = executionTimes.reduce((a, b) => a + b, 0) / executionTimes.length;

    if (averageExecutionTime > SLOW_QUERY_THRESHOLDS.warning) {
      slowQueries.push({
        id: `slow:${Date.now()}`,
        query,
        executionTime: executionTimes[executionTimes.length - 1],
        averageExecutionTime,
        maxExecutionTime: Math.max(...executionTimes),
        minExecutionTime: Math.min(...executionTimes),
        executionCount: queryMetrics.length,
        totalTime: executionTimes.reduce((a, b) => a + b, 0),
        lastExecuted: queryMetrics[queryMetrics.length - 1].timestamp,
        status: averageExecutionTime > SLOW_QUERY_THRESHOLDS.critical ? "critical" : "slow",
        optimizationSuggestions: getOptimizationSuggestions(query, queryMetrics),
      });
    }
  }

  return slowQueries.sort((a, b) => b.totalTime - a.totalTime);
}

// Get optimization suggestions
function getOptimizationSuggestions(query: string, metrics: QueryPerformanceMetrics[]): string[] {
  const suggestions: string[] = [];

  // Check for full table scans
  const fullTableScans = metrics.filter((m) => m.fullTableScan).length;
  if (fullTableScans > 0) {
    suggestions.push("Add indexes to avoid full table scans");
  }

  // Check for missing indexes
  const noIndexUsage = metrics.filter((m) => m.indexUsed.length === 0).length;
  if (noIndexUsage > 0) {
    suggestions.push("Consider adding indexes for frequently queried columns");
  }

  // Check for high row scan ratio
  const highScanRatio = metrics.filter((m) => m.rowsScanned > m.rowsAffected * 10).length;
  if (highScanRatio > 0) {
    suggestions.push("Optimize query to reduce rows scanned");
  }

  // Check for JOIN operations
  if (query.toUpperCase().includes("JOIN")) {
    suggestions.push("Review JOIN operations for optimization opportunities");
  }

  // Check for subqueries
  if (query.includes("(SELECT")) {
    suggestions.push("Consider replacing subqueries with JOINs");
  }

  return suggestions;
}

// Identify query bottlenecks
export function identifyQueryBottlenecks(metrics: QueryPerformanceMetrics[]): QueryBottleneck[] {
  const bottlenecks: QueryBottleneck[] = [];

  for (const metric of metrics) {
    // Full table scan bottleneck
    if (metric.fullTableScan) {
      bottlenecks.push({
        id: `bottleneck:fts:${Date.now()}`,
        type: "full_table_scan",
        query: metric.query,
        impact: metric.executionTime > 500 ? "high" : "medium",
        affectedRows: metric.rowsScanned,
        estimatedImprovement: 60,
        recommendations: [
          "Add indexes to the WHERE clause columns",
          "Consider partitioning large tables",
          "Review query selectivity",
        ],
      });
    }

    // Missing index bottleneck
    if (metric.indexUsed.length === 0 && metric.rowsScanned > 1000) {
      bottlenecks.push({
        id: `bottleneck:mi:${Date.now()}`,
        type: "missing_index",
        query: metric.query,
        impact: "high",
        affectedRows: metric.rowsScanned,
        estimatedImprovement: 70,
        recommendations: [
          "Analyze query WHERE and JOIN clauses",
          "Create composite indexes for multi-column queries",
          "Monitor index usage statistics",
        ],
      });
    }

    // Inefficient JOIN bottleneck
    if (metric.query.toUpperCase().includes("JOIN") && metric.executionTime > 200) {
      bottlenecks.push({
        id: `bottleneck:ej:${Date.now()}`,
        type: "inefficient_join",
        query: metric.query,
        impact: "medium",
        affectedRows: metric.rowsAffected,
        estimatedImprovement: 40,
        recommendations: [
          "Ensure JOIN columns are indexed",
          "Consider JOIN order optimization",
          "Review JOIN conditions for efficiency",
        ],
      });
    }
  }

  return bottlenecks;
}

// Find N+1 query patterns
export function findNPlusOnePatterns(queries: string[]): QueryBottleneck[] {
  const bottlenecks: QueryBottleneck[] = [];
  const queryPatterns = new Map<string, number>();

  for (const query of queries) {
    const pattern = query.replace(/\d+/g, "?").toLowerCase();
    queryPatterns.set(pattern, (queryPatterns.get(pattern) || 0) + 1);
  }

  for (const [pattern, count] of queryPatterns.entries()) {
    if (count > 10) {
      bottlenecks.push({
        id: `bottleneck:n1:${Date.now()}`,
        type: "n_plus_one",
        query: pattern,
        impact: "high",
        affectedRows: count,
        estimatedImprovement: 80,
        recommendations: [
          "Use batch queries instead of individual queries",
          "Implement eager loading",
          "Use JOIN operations instead of multiple queries",
        ],
      });
    }
  }

  return bottlenecks;
}

// Calculate database query statistics
export function calculateDatabaseQueryStats(metrics: QueryPerformanceMetrics[]): DatabaseQueryStats {
  if (metrics.length === 0) {
    return {
      totalQueries: 0,
      averageExecutionTime: 0,
      slowQueryCount: 0,
      criticalQueryCount: 0,
      fullTableScanCount: 0,
      indexUsageRate: 0,
      cacheHitRate: 0,
      totalExecutionTime: 0,
    };
  }

  const slowQueries = metrics.filter((m) => m.status === "slow").length;
  const criticalQueries = metrics.filter((m) => m.status === "critical").length;
  const fullTableScans = metrics.filter((m) => m.fullTableScan).length;
  const indexUsage = metrics.filter((m) => m.indexUsed.length > 0).length;
  const totalExecutionTime = metrics.reduce((sum, m) => sum + m.executionTime, 0);
  const averageExecutionTime = totalExecutionTime / metrics.length;

  return {
    totalQueries: metrics.length,
    averageExecutionTime,
    slowQueryCount: slowQueries,
    criticalQueryCount: criticalQueries,
    fullTableScanCount: fullTableScans,
    indexUsageRate: (indexUsage / metrics.length) * 100,
    cacheHitRate: 0, // Will be calculated separately
    totalExecutionTime,
  };
}

// Get query optimization opportunities
export function getQueryOptimizationOpportunities(
  slowQueries: SlowQuery[]
): QueryOptimizationOpportunity[] {
  const opportunities: QueryOptimizationOpportunity[] = [];

  for (const slowQuery of slowQueries) {
    const estimatedOptimizedTime = slowQuery.averageExecutionTime * 0.4; // 60% improvement
    const improvementPercentage = ((slowQuery.averageExecutionTime - estimatedOptimizedTime) / slowQuery.averageExecutionTime) * 100;

    opportunities.push({
      id: `opp:${Date.now()}`,
      query: slowQuery.query,
      currentPerformance: slowQuery.averageExecutionTime,
      optimizedPerformance: estimatedOptimizedTime,
      improvementPercentage,
      optimizationType: slowQuery.status === "critical" ? "Index Addition" : "Query Rewriting",
      priority: slowQuery.status === "critical" ? "high" : "medium",
      estimatedEffort: slowQuery.executionCount > 100 ? "high" : "medium",
      recommendations: slowQuery.optimizationSuggestions,
    });
  }

  return opportunities.sort((a, b) => b.improvementPercentage - a.improvementPercentage);
}

// Generate query performance report
export function generateQueryPerformanceReport(metrics: QueryPerformanceMetrics[]): {
  summary: string;
  stats: DatabaseQueryStats;
  slowQueries: SlowQuery[];
  bottlenecks: QueryBottleneck[];
  opportunities: QueryOptimizationOpportunity[];
  recommendations: string[];
} {
  const stats = calculateDatabaseQueryStats(metrics);
  const slowQueries = identifySlowQueries(metrics);
  const bottlenecks = identifyQueryBottlenecks(metrics);
  const opportunities = getQueryOptimizationOpportunities(slowQueries);

  const recommendations: string[] = [];
  if (stats.slowQueryCount > 0) {
    recommendations.push(`Optimize ${stats.slowQueryCount} slow queries`);
  }
  if (stats.fullTableScanCount > 0) {
    recommendations.push(`Add indexes to eliminate ${stats.fullTableScanCount} full table scans`);
  }
  if (stats.indexUsageRate < 80) {
    recommendations.push("Improve index usage rate");
  }

  return {
    summary: `Total queries: ${stats.totalQueries}, Average execution time: ${stats.averageExecutionTime.toFixed(2)}ms, Slow queries: ${stats.slowQueryCount}`,
    stats,
    slowQueries,
    bottlenecks,
    opportunities,
    recommendations,
  };
}

// Get query optimization checklist
export function getQueryOptimizationChecklist(): {
  task: string;
  priority: "high" | "medium" | "low";
  completed: boolean;
}[] {
  return [
    { task: "Analyze slow queries", priority: "high", completed: false },
    { task: "Identify missing indexes", priority: "high", completed: false },
    { task: "Add missing indexes", priority: "high", completed: false },
    { task: "Remove unused indexes", priority: "medium", completed: false },
    { task: "Optimize JOIN operations", priority: "high", completed: false },
    { task: "Rewrite inefficient queries", priority: "high", completed: false },
    { task: "Implement query caching", priority: "medium", completed: false },
    { task: "Set up query monitoring", priority: "medium", completed: false },
    { task: "Configure alerts", priority: "medium", completed: false },
    { task: "Performance testing", priority: "high", completed: false },
  ];
}

// Get query optimization best practices
export function getQueryOptimizationBestPractices(): {
  practice: string;
  description: string;
  expectedImprovement: number;
}[] {
  return [
    {
      practice: "Use indexes on WHERE clause columns",
      description: "Add indexes to columns used in WHERE clauses",
      expectedImprovement: 70,
    },
    {
      practice: "Use composite indexes for multi-column queries",
      description: "Create indexes on multiple columns for complex queries",
      expectedImprovement: 60,
    },
    {
      practice: "Avoid full table scans",
      description: "Use indexes to avoid scanning entire tables",
      expectedImprovement: 80,
    },
    {
      practice: "Optimize JOIN operations",
      description: "Ensure JOIN columns are indexed and properly ordered",
      expectedImprovement: 50,
    },
    {
      practice: "Use EXPLAIN to analyze queries",
      description: "Use EXPLAIN to understand query execution plans",
      expectedImprovement: 40,
    },
    {
      practice: "Implement query caching",
      description: "Cache frequently executed queries",
      expectedImprovement: 90,
    },
    {
      practice: "Batch similar queries",
      description: "Combine multiple queries into batch operations",
      expectedImprovement: 60,
    },
    {
      practice: "Use pagination for large result sets",
      description: "Limit result sets with LIMIT and OFFSET",
      expectedImprovement: 50,
    },
  ];
}

