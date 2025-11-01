// Connection Pooling Utilities

export interface ConnectionPoolConfig {
  minConnections: number;
  maxConnections: number;
  acquireTimeoutMillis: number;
  idleTimeoutMillis: number;
  reapIntervalMillis: number;
  connectionTimeoutMillis: number;
  statementTimeoutMillis: number;
  validateOnCheckout: boolean;
  validateOnReturn: boolean;
  enableKeepAlive: boolean;
  keepAliveIntervalMillis: number;
}

export interface PooledConnection {
  id: string;
  status: "available" | "in_use" | "idle" | "closed";
  createdAt: number;
  lastUsedAt: number;
  acquiredAt: number;
  releasedAt: number;
  queryCount: number;
  totalQueryTime: number;
  isValid: boolean;
}

export interface ConnectionPoolMetrics {
  totalConnections: number;
  availableConnections: number;
  inUseConnections: number;
  idleConnections: number;
  closedConnections: number;
  averageAcquisitionTime: number;
  averageQueryTime: number;
  connectionWaitTime: number;
  poolUtilization: number;
  connectionErrors: number;
}

export interface ConnectionPoolHealth {
  status: "healthy" | "degraded" | "critical";
  issues: string[];
  recommendations: string[];
  lastCheckTime: number;
}

// Default connection pool configuration
export const DEFAULT_CONNECTION_POOL_CONFIG: ConnectionPoolConfig = {
  minConnections: 5,
  maxConnections: 20,
  acquireTimeoutMillis: 30000, // 30 seconds
  idleTimeoutMillis: 600000, // 10 minutes
  reapIntervalMillis: 60000, // 1 minute
  connectionTimeoutMillis: 10000, // 10 seconds
  statementTimeoutMillis: 30000, // 30 seconds
  validateOnCheckout: true,
  validateOnReturn: true,
  enableKeepAlive: true,
  keepAliveIntervalMillis: 300000, // 5 minutes
};

// Get connection pool configuration for environment
export function getConnectionPoolConfig(environment: "development" | "production" = "production"): ConnectionPoolConfig {
  if (environment === "development") {
    return {
      ...DEFAULT_CONNECTION_POOL_CONFIG,
      minConnections: 2,
      maxConnections: 5,
    };
  }

  return DEFAULT_CONNECTION_POOL_CONFIG;
}

// Initialize pooled connection
export function initializePooledConnection(id: string): PooledConnection {
  const now = Date.now();
  return {
    id,
    status: "available",
    createdAt: now,
    lastUsedAt: now,
    acquiredAt: 0,
    releasedAt: 0,
    queryCount: 0,
    totalQueryTime: 0,
    isValid: true,
  };
}

// Acquire connection from pool
export function acquireConnection(connection: PooledConnection): PooledConnection {
  const updated = { ...connection };
  updated.status = "in_use";
  updated.acquiredAt = Date.now();
  return updated;
}

// Release connection to pool
export function releaseConnection(connection: PooledConnection, queryTime: number = 0): PooledConnection {
  const updated = { ...connection };
  updated.status = "available";
  updated.releasedAt = Date.now();
  updated.lastUsedAt = Date.now();
  updated.queryCount++;
  updated.totalQueryTime += queryTime;
  return updated;
}

// Close connection
export function closeConnection(connection: PooledConnection): PooledConnection {
  const updated = { ...connection };
  updated.status = "closed";
  return updated;
}

// Initialize connection pool metrics
export function initializeConnectionPoolMetrics(): ConnectionPoolMetrics {
  return {
    totalConnections: 0,
    availableConnections: 0,
    inUseConnections: 0,
    idleConnections: 0,
    closedConnections: 0,
    averageAcquisitionTime: 0,
    averageQueryTime: 0,
    connectionWaitTime: 0,
    poolUtilization: 0,
    connectionErrors: 0,
  };
}

// Update connection pool metrics
export function updateConnectionPoolMetrics(
  metrics: ConnectionPoolMetrics,
  connections: PooledConnection[],
  acquisitionTime: number = 0,
  queryTime: number = 0,
  error: boolean = false
): ConnectionPoolMetrics {
  const updated = { ...metrics };

  updated.totalConnections = connections.length;
  updated.availableConnections = connections.filter((c) => c.status === "available").length;
  updated.inUseConnections = connections.filter((c) => c.status === "in_use").length;
  updated.idleConnections = connections.filter((c) => c.status === "idle").length;
  updated.closedConnections = connections.filter((c) => c.status === "closed").length;

  if (updated.totalConnections > 0) {
    updated.poolUtilization = (updated.inUseConnections / updated.totalConnections) * 100;
  }

  if (acquisitionTime > 0) {
    updated.averageAcquisitionTime =
      (updated.averageAcquisitionTime * (updated.totalConnections - 1) + acquisitionTime) / updated.totalConnections;
  }

  if (queryTime > 0) {
    updated.averageQueryTime =
      (updated.averageQueryTime * (updated.totalConnections - 1) + queryTime) / updated.totalConnections;
  }

  if (error) {
    updated.connectionErrors++;
  }

  return updated;
}

// Get connection pool health status
export function getConnectionPoolHealthStatus(metrics: ConnectionPoolMetrics, config: ConnectionPoolConfig): ConnectionPoolHealth {
  const issues: string[] = [];
  const recommendations: string[] = [];
  let status: "healthy" | "degraded" | "critical" = "healthy";

  // Check pool utilization
  if (metrics.poolUtilization > 90) {
    issues.push(`High pool utilization: ${metrics.poolUtilization.toFixed(2)}%`);
    recommendations.push("Increase max connections");
    status = "critical";
  } else if (metrics.poolUtilization > 70) {
    issues.push(`Pool utilization above target: ${metrics.poolUtilization.toFixed(2)}%`);
    recommendations.push("Monitor pool usage");
    status = "degraded";
  }

  // Check acquisition time
  if (metrics.averageAcquisitionTime > config.acquireTimeoutMillis * 0.5) {
    issues.push(`High connection acquisition time: ${metrics.averageAcquisitionTime.toFixed(2)}ms`);
    recommendations.push("Increase min connections");
    status = "degraded";
  }

  // Check connection errors
  if (metrics.connectionErrors > 10) {
    issues.push(`High connection error rate: ${metrics.connectionErrors} errors`);
    recommendations.push("Check database connectivity");
    status = "critical";
  }

  // Check available connections
  if (metrics.availableConnections === 0) {
    issues.push("No available connections");
    recommendations.push("Increase max connections or reduce query time");
    status = "critical";
  }

  if (status === "healthy") {
    recommendations.push("Connection pool is operating normally");
  }

  return {
    status,
    issues,
    recommendations,
    lastCheckTime: Date.now(),
  };
}

// Get connection pool optimization recommendations
export function getConnectionPoolOptimizationRecommendations(): {
  recommendation: string;
  expectedImprovement: number;
  priority: "high" | "medium" | "low";
}[] {
  return [
    {
      recommendation: "Increase min connections for high-traffic scenarios",
      expectedImprovement: 30,
      priority: "high",
    },
    {
      recommendation: "Implement connection validation on checkout",
      expectedImprovement: 20,
      priority: "high",
    },
    {
      recommendation: "Enable keep-alive for long-lived connections",
      expectedImprovement: 15,
      priority: "medium",
    },
    {
      recommendation: "Monitor and adjust idle timeout",
      expectedImprovement: 10,
      priority: "medium",
    },
    {
      recommendation: "Implement connection reuse strategy",
      expectedImprovement: 25,
      priority: "high",
    },
    {
      recommendation: "Set appropriate statement timeout",
      expectedImprovement: 20,
      priority: "high",
    },
    {
      recommendation: "Monitor connection pool metrics",
      expectedImprovement: 5,
      priority: "medium",
    },
    {
      recommendation: "Implement connection pooling at application level",
      expectedImprovement: 40,
      priority: "high",
    },
  ];
}

// Get connection pool sizing recommendations
export function getConnectionPoolSizingRecommendations(expectedConcurrentUsers: number): {
  minConnections: number;
  maxConnections: number;
  reasoning: string;
} {
  // Formula: max_connections = (expected_concurrent_users * 1.5) + buffer
  const maxConnections = Math.ceil(expectedConcurrentUsers * 1.5) + 5;
  const minConnections = Math.ceil(expectedConcurrentUsers * 0.5);

  return {
    minConnections,
    maxConnections,
    reasoning: `Based on ${expectedConcurrentUsers} expected concurrent users, recommended pool size is ${minConnections}-${maxConnections} connections`,
  };
}

// Generate connection pool report
export function generateConnectionPoolReport(metrics: ConnectionPoolMetrics, config: ConnectionPoolConfig): {
  summary: string;
  details: Record<string, any>;
  recommendations: string[];
} {
  const health = getConnectionPoolHealthStatus(metrics, config);

  return {
    summary: `Pool utilization: ${metrics.poolUtilization.toFixed(2)}%, Available: ${metrics.availableConnections}, In use: ${metrics.inUseConnections}`,
    details: {
      totalConnections: metrics.totalConnections,
      availableConnections: metrics.availableConnections,
      inUseConnections: metrics.inUseConnections,
      idleConnections: metrics.idleConnections,
      poolUtilization: `${metrics.poolUtilization.toFixed(2)}%`,
      averageAcquisitionTime: `${metrics.averageAcquisitionTime.toFixed(2)}ms`,
      averageQueryTime: `${metrics.averageQueryTime.toFixed(2)}ms`,
      connectionErrors: metrics.connectionErrors,
      healthStatus: health.status,
    },
    recommendations: health.recommendations,
  };
}

// Get connection pool best practices
export function getConnectionPoolBestPractices(): {
  practice: string;
  description: string;
  expectedImprovement: number;
}[] {
  return [
    {
      practice: "Set appropriate pool size",
      description: "Configure min and max connections based on expected load",
      expectedImprovement: 40,
    },
    {
      practice: "Enable connection validation",
      description: "Validate connections on checkout and return",
      expectedImprovement: 20,
    },
    {
      practice: "Use connection keep-alive",
      description: "Enable keep-alive to maintain connection health",
      expectedImprovement: 15,
    },
    {
      practice: "Monitor pool metrics",
      description: "Track pool utilization and performance",
      expectedImprovement: 10,
    },
    {
      practice: "Set statement timeout",
      description: "Prevent long-running queries from blocking connections",
      expectedImprovement: 20,
    },
    {
      practice: "Implement connection reuse",
      description: "Reuse connections efficiently",
      expectedImprovement: 25,
    },
    {
      practice: "Handle connection errors",
      description: "Implement proper error handling and recovery",
      expectedImprovement: 15,
    },
    {
      practice: "Tune idle timeout",
      description: "Balance between connection reuse and resource usage",
      expectedImprovement: 10,
    },
  ];
}

// Get connection pool deployment checklist
export function getConnectionPoolDeploymentChecklist(): {
  task: string;
  priority: "high" | "medium" | "low";
  completed: boolean;
}[] {
  return [
    { task: "Configure pool size", priority: "high", completed: false },
    { task: "Enable connection validation", priority: "high", completed: false },
    { task: "Set statement timeout", priority: "high", completed: false },
    { task: "Enable keep-alive", priority: "medium", completed: false },
    { task: "Configure idle timeout", priority: "medium", completed: false },
    { task: "Set up monitoring", priority: "high", completed: false },
    { task: "Configure alerts", priority: "medium", completed: false },
    { task: "Test under load", priority: "high", completed: false },
    { task: "Document configuration", priority: "medium", completed: false },
    { task: "Train team", priority: "low", completed: false },
  ];
}

