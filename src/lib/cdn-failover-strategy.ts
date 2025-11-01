// CDN Failover Strategy Utilities

export interface OriginServerStatus {
  id: string;
  name: string;
  domain: string;
  status: "healthy" | "unhealthy" | "degraded";
  lastCheckTime: number;
  responseTime: number;
  statusCode: number;
  consecutiveFailures: number;
  consecutiveSuccesses: number;
  weight: number;
  priority: number;
}

export interface FailoverStrategy {
  id: string;
  name: string;
  type: "active-passive" | "active-active" | "round-robin" | "weighted";
  primaryOrigin: string;
  backupOrigins: string[];
  healthCheckInterval: number;
  failoverThreshold: number;
  recoveryThreshold: number;
  enabled: boolean;
}

export interface FailoverEvent {
  id: string;
  timestamp: number;
  type: "failover" | "recovery" | "health_check";
  fromOrigin: string;
  toOrigin: string;
  reason: string;
  status: "success" | "failed";
}

export interface FailoverMetrics {
  totalFailovers: number;
  successfulFailovers: number;
  failedFailovers: number;
  averageFailoverTime: number;
  totalRecoveries: number;
  averageRecoveryTime: number;
  uptime: number;
  lastFailoverTime: number;
}

// Default failover strategies
export const DEFAULT_FAILOVER_STRATEGIES: FailoverStrategy[] = [
  {
    id: "strategy:active-passive",
    name: "Active-Passive Failover",
    type: "active-passive",
    primaryOrigin: "origin1.ecommerce.ph",
    backupOrigins: ["origin2.ecommerce.ph", "origin3.ecommerce.ph"],
    healthCheckInterval: 30,
    failoverThreshold: 3,
    recoveryThreshold: 5,
    enabled: true,
  },
  {
    id: "strategy:active-active",
    name: "Active-Active Failover",
    type: "active-active",
    primaryOrigin: "origin1.ecommerce.ph",
    backupOrigins: ["origin2.ecommerce.ph", "origin3.ecommerce.ph"],
    healthCheckInterval: 30,
    failoverThreshold: 3,
    recoveryThreshold: 5,
    enabled: false,
  },
  {
    id: "strategy:round-robin",
    name: "Round-Robin Load Balancing",
    type: "round-robin",
    primaryOrigin: "origin1.ecommerce.ph",
    backupOrigins: ["origin2.ecommerce.ph", "origin3.ecommerce.ph"],
    healthCheckInterval: 30,
    failoverThreshold: 3,
    recoveryThreshold: 5,
    enabled: false,
  },
];

// Initialize origin server status
export function initializeOriginServerStatus(
  id: string,
  name: string,
  domain: string,
  priority: number = 1,
  weight: number = 100
): OriginServerStatus {
  return {
    id,
    name,
    domain,
    status: "healthy",
    lastCheckTime: Date.now(),
    responseTime: 0,
    statusCode: 200,
    consecutiveFailures: 0,
    consecutiveSuccesses: 0,
    weight,
    priority,
  };
}

// Update origin server status
export function updateOriginServerStatus(
  status: OriginServerStatus,
  responseTime: number,
  statusCode: number,
  success: boolean
): OriginServerStatus {
  const updated = { ...status };
  updated.lastCheckTime = Date.now();
  updated.responseTime = responseTime;
  updated.statusCode = statusCode;

  if (success && statusCode >= 200 && statusCode < 300) {
    updated.consecutiveSuccesses++;
    updated.consecutiveFailures = 0;

    if (updated.consecutiveSuccesses >= 5) {
      updated.status = "healthy";
    } else if (updated.consecutiveSuccesses >= 2) {
      updated.status = "degraded";
    }
  } else {
    updated.consecutiveFailures++;
    updated.consecutiveSuccesses = 0;

    if (updated.consecutiveFailures >= 3) {
      updated.status = "unhealthy";
    } else if (updated.consecutiveFailures >= 1) {
      updated.status = "degraded";
    }
  }

  return updated;
}

// Check if origin server is healthy
export function isOriginServerHealthy(status: OriginServerStatus): boolean {
  return status.status === "healthy";
}

// Get healthy origin servers
export function getHealthyOriginServers(servers: OriginServerStatus[]): OriginServerStatus[] {
  return servers.filter((s) => isOriginServerHealthy(s));
}

// Get next origin server for failover
export function getNextOriginServerForFailover(
  currentOrigin: string,
  servers: OriginServerStatus[],
  strategy: FailoverStrategy
): OriginServerStatus | null {
  const healthyServers = getHealthyOriginServers(servers);

  if (healthyServers.length === 0) {
    // If no healthy servers, return the least unhealthy one
    return servers.sort((a, b) => a.consecutiveFailures - b.consecutiveFailures)[0] || null;
  }

  if (strategy.type === "active-passive") {
    // Return the first healthy backup
    return healthyServers.find((s) => s.domain !== currentOrigin) || healthyServers[0];
  } else if (strategy.type === "round-robin") {
    // Return the next server in the list
    const currentIndex = servers.findIndex((s) => s.domain === currentOrigin);
    return servers[(currentIndex + 1) % servers.length];
  } else if (strategy.type === "weighted") {
    // Return a random server based on weight
    const totalWeight = healthyServers.reduce((sum, s) => sum + s.weight, 0);
    let random = Math.random() * totalWeight;

    for (const server of healthyServers) {
      random -= server.weight;
      if (random <= 0) {
        return server;
      }
    }

    return healthyServers[0];
  }

  return healthyServers[0];
}

// Create failover event
export function createFailoverEvent(
  type: "failover" | "recovery" | "health_check",
  fromOrigin: string,
  toOrigin: string,
  reason: string,
  status: "success" | "failed"
): FailoverEvent {
  return {
    id: `failover:${Date.now()}`,
    timestamp: Date.now(),
    type,
    fromOrigin,
    toOrigin,
    reason,
    status,
  };
}

// Initialize failover metrics
export function initializeFailoverMetrics(): FailoverMetrics {
  return {
    totalFailovers: 0,
    successfulFailovers: 0,
    failedFailovers: 0,
    averageFailoverTime: 0,
    totalRecoveries: 0,
    averageRecoveryTime: 0,
    uptime: 100,
    lastFailoverTime: 0,
  };
}

// Update failover metrics
export function updateFailoverMetrics(
  metrics: FailoverMetrics,
  event: FailoverEvent,
  failoverTime: number
): FailoverMetrics {
  const updated = { ...metrics };

  if (event.type === "failover") {
    updated.totalFailovers++;
    updated.lastFailoverTime = event.timestamp;

    if (event.status === "success") {
      updated.successfulFailovers++;
    } else {
      updated.failedFailovers++;
    }

    updated.averageFailoverTime =
      (updated.averageFailoverTime * (updated.totalFailovers - 1) + failoverTime) / updated.totalFailovers;
  } else if (event.type === "recovery") {
    updated.totalRecoveries++;
    updated.averageRecoveryTime =
      (updated.averageRecoveryTime * (updated.totalRecoveries - 1) + failoverTime) / updated.totalRecoveries;
  }

  // Calculate uptime
  if (updated.totalFailovers > 0) {
    updated.uptime = (updated.successfulFailovers / updated.totalFailovers) * 100;
  }

  return updated;
}

// Get failover strategy recommendations
export function getFailoverStrategyRecommendations(): {
  strategy: string;
  pros: string[];
  cons: string[];
  bestFor: string;
}[] {
  return [
    {
      strategy: "Active-Passive",
      pros: [
        "Simple to implement",
        "Low cost",
        "Easy to manage",
        "Good for small deployments",
      ],
      cons: [
        "Backup server idle",
        "Slower failover",
        "Single point of failure",
      ],
      bestFor: "Small to medium deployments",
    },
    {
      strategy: "Active-Active",
      pros: [
        "Better resource utilization",
        "Faster failover",
        "Higher availability",
        "Load distribution",
      ],
      cons: [
        "More complex",
        "Higher cost",
        "Requires synchronization",
      ],
      bestFor: "Large deployments with high traffic",
    },
    {
      strategy: "Round-Robin",
      pros: [
        "Simple load balancing",
        "Good resource utilization",
        "Easy to implement",
      ],
      cons: [
        "No health awareness",
        "Uneven load distribution",
        "No failover support",
      ],
      bestFor: "Homogeneous server environments",
    },
    {
      strategy: "Weighted",
      pros: [
        "Flexible load distribution",
        "Health aware",
        "Good for heterogeneous servers",
      ],
      cons: [
        "More complex configuration",
        "Requires tuning",
      ],
      bestFor: "Mixed server environments",
    },
  ];
}

// Get failover health check recommendations
export function getFailoverHealthCheckRecommendations(): {
  recommendation: string;
  interval: number;
  timeout: number;
  threshold: number;
}[] {
  return [
    {
      recommendation: "HTTP health check",
      interval: 30,
      timeout: 5,
      threshold: 3,
    },
    {
      recommendation: "TCP health check",
      interval: 30,
      timeout: 5,
      threshold: 3,
    },
    {
      recommendation: "DNS health check",
      interval: 60,
      timeout: 10,
      threshold: 2,
    },
    {
      recommendation: "Custom health check",
      interval: 30,
      timeout: 5,
      threshold: 3,
    },
  ];
}

// Get failover performance metrics
export function getFailoverPerformanceMetrics(): {
  metric: string;
  currentTime: number;
  optimizedTime: number;
  improvement: number;
  improvementPercentage: number;
}[] {
  return [
    {
      metric: "Failover detection time",
      currentTime: 60000,
      optimizedTime: 10000,
      improvement: 50000,
      improvementPercentage: 83,
    },
    {
      metric: "Failover execution time",
      currentTime: 5000,
      optimizedTime: 1000,
      improvement: 4000,
      improvementPercentage: 80,
    },
    {
      metric: "Recovery time",
      currentTime: 30000,
      optimizedTime: 5000,
      improvement: 25000,
      improvementPercentage: 83,
    },
    {
      metric: "Overall failover time",
      currentTime: 95000,
      optimizedTime: 16000,
      improvement: 79000,
      improvementPercentage: 83,
    },
  ];
}

// Generate failover report
export function generateFailoverReport(metrics: FailoverMetrics): {
  summary: string;
  details: Record<string, any>;
  recommendations: string[];
} {
  return {
    summary: `Total failovers: ${metrics.totalFailovers}, Successful: ${metrics.successfulFailovers}, Uptime: ${metrics.uptime.toFixed(2)}%`,
    details: {
      totalFailovers: metrics.totalFailovers,
      successfulFailovers: metrics.successfulFailovers,
      failedFailovers: metrics.failedFailovers,
      averageFailoverTime: `${metrics.averageFailoverTime.toFixed(2)}ms`,
      totalRecoveries: metrics.totalRecoveries,
      averageRecoveryTime: `${metrics.averageRecoveryTime.toFixed(2)}ms`,
      uptime: `${metrics.uptime.toFixed(2)}%`,
      lastFailoverTime: new Date(metrics.lastFailoverTime).toISOString(),
    },
    recommendations: [
      metrics.uptime < 99.9 ? "Improve failover strategy" : "Failover strategy is effective",
      metrics.averageFailoverTime > 10000 ? "Reduce failover detection time" : "Failover time is good",
    ],
  };
}

// Get failover deployment checklist
export function getFailoverDeploymentChecklist(): {
  task: string;
  priority: "high" | "medium" | "low";
  completed: boolean;
}[] {
  return [
    { task: "Select failover strategy", priority: "high", completed: false },
    { task: "Configure origin servers", priority: "high", completed: false },
    { task: "Set up health checks", priority: "high", completed: false },
    { task: "Configure failover rules", priority: "high", completed: false },
    { task: "Test failover scenarios", priority: "high", completed: false },
    { task: "Set up monitoring", priority: "high", completed: false },
    { task: "Configure alerts", priority: "medium", completed: false },
    { task: "Document failover process", priority: "medium", completed: false },
    { task: "Train team", priority: "medium", completed: false },
    { task: "Implement disaster recovery", priority: "medium", completed: false },
  ];
}

