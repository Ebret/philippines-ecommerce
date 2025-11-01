// Error Tracking and Monitoring Utilities

export interface ErrorEvent {
  id: string;
  type: "error" | "warning" | "exception" | "unhandled_rejection";
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  stack?: string;
  source: string;
  timestamp: number;
  userId?: string;
  sessionId?: string;
  url?: string;
  userAgent?: string;
  context: Record<string, any>;
}

export interface ErrorPattern {
  id: string;
  errorType: string;
  pattern: string;
  occurrences: number;
  firstSeen: number;
  lastSeen: number;
  affectedUsers: number;
  severity: "low" | "medium" | "high" | "critical";
  status: "new" | "investigating" | "resolved" | "ignored";
}

export interface PerformanceBottleneck {
  id: string;
  type: "slow_query" | "slow_api" | "slow_render" | "memory_leak" | "cpu_spike";
  description: string;
  location: string;
  severity: "low" | "medium" | "high" | "critical";
  detectedAt: number;
  metrics: Record<string, number>;
  recommendations: string[];
}

export interface ErrorStatistics {
  totalErrors: number;
  errorsByType: Record<string, number>;
  errorsBySeverity: Record<string, number>;
  errorsBySource: Record<string, number>;
  affectedUsers: number;
  errorRate: number; // errors per minute
  averageResolutionTime: number;
}

// Initialize error event
export function initializeErrorEvent(
  type: "error" | "warning" | "exception" | "unhandled_rejection",
  severity: "low" | "medium" | "high" | "critical",
  message: string,
  source: string,
  context: Record<string, any> = {},
  stack?: string,
  userId?: string,
  sessionId?: string,
  url?: string,
  userAgent?: string
): ErrorEvent {
  return {
    id: `error:${Date.now()}`,
    type,
    severity,
    message,
    stack,
    source,
    timestamp: Date.now(),
    userId,
    sessionId,
    url,
    userAgent,
    context,
  };
}

// Initialize error pattern
export function initializeErrorPattern(
  errorType: string,
  pattern: string,
  severity: "low" | "medium" | "high" | "critical" = "medium"
): ErrorPattern {
  return {
    id: `pattern:${Date.now()}`,
    errorType,
    pattern,
    occurrences: 1,
    firstSeen: Date.now(),
    lastSeen: Date.now(),
    affectedUsers: 1,
    severity,
    status: "new",
  };
}

// Update error pattern
export function updateErrorPattern(pattern: ErrorPattern, affectedUserId?: string): ErrorPattern {
  const updated = {
    ...pattern,
    occurrences: pattern.occurrences + 1,
    lastSeen: Date.now(),
  };

  if (affectedUserId && !pattern.affectedUsers) {
    updated.affectedUsers = 1;
  }

  return updated;
}

// Initialize performance bottleneck
export function initializePerformanceBottleneck(
  type: "slow_query" | "slow_api" | "slow_render" | "memory_leak" | "cpu_spike",
  description: string,
  location: string,
  severity: "low" | "medium" | "high" | "critical",
  metrics: Record<string, number> = {},
  recommendations: string[] = []
): PerformanceBottleneck {
  return {
    id: `bottleneck:${Date.now()}`,
    type,
    description,
    location,
    severity,
    detectedAt: Date.now(),
    metrics,
    recommendations,
  };
}

// Categorize error by type
export function categorizeErrorByType(message: string): string {
  if (message.includes("TypeError")) return "TypeError";
  if (message.includes("ReferenceError")) return "ReferenceError";
  if (message.includes("SyntaxError")) return "SyntaxError";
  if (message.includes("RangeError")) return "RangeError";
  if (message.includes("Network")) return "NetworkError";
  if (message.includes("Timeout")) return "TimeoutError";
  if (message.includes("Database")) return "DatabaseError";
  if (message.includes("Authentication")) return "AuthenticationError";
  if (message.includes("Authorization")) return "AuthorizationError";
  if (message.includes("Validation")) return "ValidationError";
  return "UnknownError";
}

// Categorize error by severity
export function categorizeErrorBySeverity(message: string, statusCode?: number): "low" | "medium" | "high" | "critical" {
  if (statusCode && statusCode >= 500) return "critical";
  if (statusCode && statusCode >= 400) return "high";
  if (message.includes("critical") || message.includes("fatal")) return "critical";
  if (message.includes("error") || message.includes("failed")) return "high";
  if (message.includes("warning")) return "medium";
  return "low";
}

// Detect performance bottleneck
export function detectPerformanceBottleneck(
  metricName: string,
  currentValue: number,
  baselineValue: number,
  threshold: number = 1.5 // 50% increase
): PerformanceBottleneck | null {
  if (currentValue > baselineValue * threshold) {
    const percentageIncrease = ((currentValue - baselineValue) / baselineValue) * 100;
    const severity = percentageIncrease > 100 ? "critical" : percentageIncrease > 50 ? "high" : "medium";

    const recommendations: string[] = [];
    if (metricName.includes("query")) {
      recommendations.push("Optimize database query");
      recommendations.push("Add indexes");
      recommendations.push("Review query execution plan");
    } else if (metricName.includes("api")) {
      recommendations.push("Optimize API endpoint");
      recommendations.push("Implement caching");
      recommendations.push("Review API logic");
    } else if (metricName.includes("memory")) {
      recommendations.push("Check for memory leaks");
      recommendations.push("Optimize memory usage");
      recommendations.push("Review object allocation");
    }

    return initializePerformanceBottleneck(
      "slow_query",
      `${metricName} increased by ${percentageIncrease.toFixed(2)}%`,
      metricName,
      severity,
      {
        currentValue,
        baselineValue,
        percentageIncrease,
      },
      recommendations
    );
  }

  return null;
}

// Get error statistics
export function getErrorStatistics(errors: ErrorEvent[]): ErrorStatistics {
  const errorsByType: Record<string, number> = {};
  const errorsBySeverity: Record<string, number> = {};
  const errorsBySource: Record<string, number> = {};
  const affectedUserIds = new Set<string>();

  errors.forEach((error) => {
    errorsByType[error.type] = (errorsByType[error.type] || 0) + 1;
    errorsBySeverity[error.severity] = (errorsBySeverity[error.severity] || 0) + 1;
    errorsBySource[error.source] = (errorsBySource[error.source] || 0) + 1;

    if (error.userId) {
      affectedUserIds.add(error.userId);
    }
  });

  const timeSpan = errors.length > 0 ? (errors[errors.length - 1].timestamp - errors[0].timestamp) / 60000 : 1; // minutes
  const errorRate = errors.length / Math.max(timeSpan, 1);

  return {
    totalErrors: errors.length,
    errorsByType,
    errorsBySeverity,
    errorsBySource,
    affectedUsers: affectedUserIds.size,
    errorRate,
    averageResolutionTime: 0,
  };
}

// Get error recommendations
export function getErrorRecommendations(errors: ErrorEvent[]): string[] {
  const recommendations: string[] = [];
  const stats = getErrorStatistics(errors);

  if (stats.errorsBySeverity["critical"] && stats.errorsBySeverity["critical"] > 0) {
    recommendations.push("Address critical errors immediately");
  }

  if (stats.errorRate > 1) {
    recommendations.push("Error rate is high, investigate root causes");
  }

  if (stats.affectedUsers > 10) {
    recommendations.push("Multiple users affected, prioritize resolution");
  }

  const networkErrors = errors.filter((e) => e.message.includes("Network"));
  if (networkErrors.length > 5) {
    recommendations.push("Investigate network connectivity issues");
  }

  const databaseErrors = errors.filter((e) => e.message.includes("Database"));
  if (databaseErrors.length > 3) {
    recommendations.push("Check database health and connections");
  }

  return recommendations;
}

// Get error tracking best practices
export function getErrorTrackingBestPractices(): {
  practice: string;
  description: string;
  priority: "high" | "medium" | "low";
}[] {
  return [
    {
      practice: "Capture all errors",
      description: "Set up global error handlers for all error types",
      priority: "high",
    },
    {
      practice: "Include context",
      description: "Capture user, session, and request context with errors",
      priority: "high",
    },
    {
      practice: "Track error patterns",
      description: "Identify recurring errors and patterns",
      priority: "high",
    },
    {
      practice: "Monitor error rate",
      description: "Track error rate trends over time",
      priority: "high",
    },
    {
      practice: "Set up alerts",
      description: "Alert on critical errors and error rate spikes",
      priority: "high",
    },
    {
      practice: "Analyze stack traces",
      description: "Analyze stack traces to identify root causes",
      priority: "medium",
    },
    {
      practice: "Track affected users",
      description: "Identify which users are affected by errors",
      priority: "medium",
    },
    {
      practice: "Regular review",
      description: "Regularly review and analyze error logs",
      priority: "medium",
    },
  ];
}

// Get error tracking deployment checklist
export function getErrorTrackingDeploymentChecklist(): {
  task: string;
  priority: "high" | "medium" | "low";
  completed: boolean;
}[] {
  return [
    { task: "Set up global error handler", priority: "high", completed: false },
    { task: "Configure error logging", priority: "high", completed: false },
    { task: "Set up error tracking service", priority: "high", completed: false },
    { task: "Configure error alerts", priority: "high", completed: false },
    { task: "Set up error dashboard", priority: "high", completed: false },
    { task: "Configure error grouping", priority: "medium", completed: false },
    { task: "Set up error notifications", priority: "medium", completed: false },
    { task: "Configure error retention", priority: "medium", completed: false },
    { task: "Test error tracking", priority: "high", completed: false },
    { task: "Document error handling procedures", priority: "medium", completed: false },
  ];
}

// Get error severity distribution
export function getErrorSeverityDistribution(errors: ErrorEvent[]): {
  severity: string;
  count: number;
  percentage: number;
}[] {
  const stats = getErrorStatistics(errors);
  const total = errors.length;

  return [
    {
      severity: "critical",
      count: stats.errorsBySeverity["critical"] || 0,
      percentage: ((stats.errorsBySeverity["critical"] || 0) / total) * 100,
    },
    {
      severity: "high",
      count: stats.errorsBySeverity["high"] || 0,
      percentage: ((stats.errorsBySeverity["high"] || 0) / total) * 100,
    },
    {
      severity: "medium",
      count: stats.errorsBySeverity["medium"] || 0,
      percentage: ((stats.errorsBySeverity["medium"] || 0) / total) * 100,
    },
    {
      severity: "low",
      count: stats.errorsBySeverity["low"] || 0,
      percentage: ((stats.errorsBySeverity["low"] || 0) / total) * 100,
    },
  ];
}

