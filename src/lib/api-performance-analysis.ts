// API Endpoint Performance Analysis Utilities

export interface EndpointMetrics {
  endpoint: string;
  method: string;
  averageResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
  errorRate: number;
  requestsPerSecond: number;
  averagePayloadSize: number;
  cacheHitRate: number;
}

export interface PerformanceBottleneck {
  endpoint: string;
  issue: string;
  severity: "critical" | "high" | "medium" | "low";
  recommendation: string;
  estimatedImprovement: number;
}

export interface EndpointOptimization {
  endpoint: string;
  optimizations: string[];
  estimatedImprovement: number;
  priority: "high" | "medium" | "low";
}

// Sample endpoint metrics
const ENDPOINT_METRICS: EndpointMetrics[] = [
  {
    endpoint: "GET /api/products",
    method: "GET",
    averageResponseTime: 450,
    p95ResponseTime: 800,
    p99ResponseTime: 1200,
    errorRate: 0.5,
    requestsPerSecond: 50,
    averagePayloadSize: 150000,
    cacheHitRate: 0.3,
  },
  {
    endpoint: "GET /api/products/[id]",
    method: "GET",
    averageResponseTime: 200,
    p95ResponseTime: 400,
    p99ResponseTime: 600,
    errorRate: 0.2,
    requestsPerSecond: 100,
    averagePayloadSize: 50000,
    cacheHitRate: 0.6,
  },
  {
    endpoint: "POST /api/orders",
    method: "POST",
    averageResponseTime: 800,
    p95ResponseTime: 1500,
    p99ResponseTime: 2000,
    errorRate: 1.0,
    requestsPerSecond: 10,
    averagePayloadSize: 5000,
    cacheHitRate: 0,
  },
  {
    endpoint: "GET /api/orders",
    method: "GET",
    averageResponseTime: 600,
    p95ResponseTime: 1000,
    p99ResponseTime: 1500,
    errorRate: 0.3,
    requestsPerSecond: 30,
    averagePayloadSize: 200000,
    cacheHitRate: 0.2,
  },
  {
    endpoint: "GET /api/inventory",
    method: "GET",
    averageResponseTime: 350,
    p95ResponseTime: 700,
    p99ResponseTime: 1000,
    errorRate: 0.4,
    requestsPerSecond: 40,
    averagePayloadSize: 100000,
    cacheHitRate: 0.4,
  },
  {
    endpoint: "GET /api/vendors",
    method: "GET",
    averageResponseTime: 300,
    p95ResponseTime: 600,
    p99ResponseTime: 900,
    errorRate: 0.2,
    requestsPerSecond: 60,
    averagePayloadSize: 80000,
    cacheHitRate: 0.5,
  },
  {
    endpoint: "GET /api/reviews",
    method: "GET",
    averageResponseTime: 400,
    p95ResponseTime: 800,
    p99ResponseTime: 1200,
    errorRate: 0.3,
    requestsPerSecond: 25,
    averagePayloadSize: 120000,
    cacheHitRate: 0.35,
  },
  {
    endpoint: "POST /api/cart",
    method: "POST",
    averageResponseTime: 250,
    p95ResponseTime: 500,
    p99ResponseTime: 800,
    errorRate: 0.5,
    requestsPerSecond: 80,
    averagePayloadSize: 3000,
    cacheHitRate: 0,
  },
];

// Get all endpoint metrics
export function getAllEndpointMetrics(): EndpointMetrics[] {
  return ENDPOINT_METRICS;
}

// Get endpoint metrics by endpoint
export function getEndpointMetrics(endpoint: string): EndpointMetrics | undefined {
  return ENDPOINT_METRICS.find((m) => m.endpoint === endpoint);
}

// Identify slow endpoints
export function identifySlowEndpoints(threshold: number = 500): EndpointMetrics[] {
  return ENDPOINT_METRICS.filter((m) => m.averageResponseTime > threshold);
}

// Identify high error rate endpoints
export function identifyHighErrorRateEndpoints(threshold: number = 0.5): EndpointMetrics[] {
  return ENDPOINT_METRICS.filter((m) => m.errorRate > threshold);
}

// Identify low cache hit rate endpoints
export function identifyLowCacheHitRateEndpoints(threshold: number = 0.3): EndpointMetrics[] {
  return ENDPOINT_METRICS.filter((m) => m.cacheHitRate < threshold && m.cacheHitRate > 0);
}

// Identify large payload endpoints
export function identifyLargePayloadEndpoints(threshold: number = 100000): EndpointMetrics[] {
  return ENDPOINT_METRICS.filter((m) => m.averagePayloadSize > threshold);
}

// Analyze endpoint performance
export function analyzeEndpointPerformance(
  endpoint: string
): {
  metrics: EndpointMetrics | undefined;
  issues: string[];
  recommendations: string[];
  optimizationScore: number;
} {
  const metrics = getEndpointMetrics(endpoint);
  if (!metrics) {
    return {
      metrics: undefined,
      issues: ["Endpoint not found"],
      recommendations: [],
      optimizationScore: 0,
    };
  }

  const issues: string[] = [];
  const recommendations: string[] = [];
  let optimizationScore = 100;

  // Check response time
  if (metrics.averageResponseTime > 500) {
    issues.push("Slow response time");
    recommendations.push("Optimize database queries");
    recommendations.push("Implement caching");
    optimizationScore -= 20;
  }

  // Check error rate
  if (metrics.errorRate > 0.5) {
    issues.push("High error rate");
    recommendations.push("Investigate error causes");
    recommendations.push("Improve error handling");
    optimizationScore -= 15;
  }

  // Check cache hit rate
  if (metrics.cacheHitRate > 0 && metrics.cacheHitRate < 0.3) {
    issues.push("Low cache hit rate");
    recommendations.push("Improve caching strategy");
    recommendations.push("Increase cache TTL");
    optimizationScore -= 10;
  }

  // Check payload size
  if (metrics.averagePayloadSize > 100000) {
    issues.push("Large payload size");
    recommendations.push("Implement field selection");
    recommendations.push("Use pagination");
    optimizationScore -= 15;
  }

  return {
    metrics,
    issues,
    recommendations,
    optimizationScore: Math.max(0, optimizationScore),
  };
}

// Get performance bottlenecks
export function getPerformanceBottlenecks(): PerformanceBottleneck[] {
  const bottlenecks: PerformanceBottleneck[] = [];

  // Identify slow endpoints
  const slowEndpoints = identifySlowEndpoints(500);
  slowEndpoints.forEach((endpoint) => {
    bottlenecks.push({
      endpoint: endpoint.endpoint,
      issue: "Slow response time",
      severity: endpoint.averageResponseTime > 800 ? "critical" : "high",
      recommendation: "Optimize database queries and implement caching",
      estimatedImprovement: 40,
    });
  });

  // Identify high error rate endpoints
  const highErrorEndpoints = identifyHighErrorRateEndpoints(0.5);
  highErrorEndpoints.forEach((endpoint) => {
    bottlenecks.push({
      endpoint: endpoint.endpoint,
      issue: "High error rate",
      severity: endpoint.errorRate > 1.0 ? "critical" : "high",
      recommendation: "Investigate error causes and improve error handling",
      estimatedImprovement: 30,
    });
  });

  // Identify large payload endpoints
  const largePayloadEndpoints = identifyLargePayloadEndpoints(100000);
  largePayloadEndpoints.forEach((endpoint) => {
    bottlenecks.push({
      endpoint: endpoint.endpoint,
      issue: "Large payload size",
      severity: endpoint.averagePayloadSize > 150000 ? "high" : "medium",
      recommendation: "Implement field selection and pagination",
      estimatedImprovement: 35,
    });
  });

  return bottlenecks;
}

// Get endpoint optimization recommendations
export function getEndpointOptimizations(): EndpointOptimization[] {
  return [
    {
      endpoint: "GET /api/products",
      optimizations: [
        "Add pagination",
        "Implement field selection",
        "Add caching (1 hour TTL)",
        "Optimize database query",
        "Add response compression",
      ],
      estimatedImprovement: 45,
      priority: "high",
    },
    {
      endpoint: "GET /api/orders",
      optimizations: [
        "Add pagination",
        "Implement field selection",
        "Add caching (30 minutes TTL)",
        "Optimize JOIN queries",
        "Add response compression",
      ],
      estimatedImprovement: 40,
      priority: "high",
    },
    {
      endpoint: "POST /api/orders",
      optimizations: [
        "Optimize database write",
        "Implement request validation caching",
        "Use batch inserts",
        "Add async processing",
      ],
      estimatedImprovement: 35,
      priority: "high",
    },
    {
      endpoint: "GET /api/inventory",
      optimizations: [
        "Add pagination",
        "Implement field selection",
        "Add caching (30 minutes TTL)",
        "Optimize database query",
        "Add response compression",
      ],
      estimatedImprovement: 40,
      priority: "medium",
    },
    {
      endpoint: "GET /api/vendors",
      optimizations: [
        "Add pagination",
        "Implement field selection",
        "Add caching (1 hour TTL)",
        "Optimize database query",
      ],
      estimatedImprovement: 30,
      priority: "medium",
    },
    {
      endpoint: "GET /api/reviews",
      optimizations: [
        "Add pagination",
        "Implement field selection",
        "Add caching (30 minutes TTL)",
        "Optimize database query",
        "Add response compression",
      ],
      estimatedImprovement: 35,
      priority: "medium",
    },
  ];
}

// Calculate overall API performance score
export function calculateOverallAPIPerformanceScore(): {
  score: number;
  rating: "excellent" | "good" | "fair" | "poor";
  summary: string;
} {
  const metrics = getAllEndpointMetrics();
  const avgResponseTime = metrics.reduce((sum, m) => sum + m.averageResponseTime, 0) / metrics.length;
  const avgErrorRate = metrics.reduce((sum, m) => sum + m.errorRate, 0) / metrics.length;
  const avgCacheHitRate = metrics.reduce((sum, m) => sum + m.cacheHitRate, 0) / metrics.length;

  let score = 100;

  // Penalize for slow response time
  if (avgResponseTime > 500) score -= 30;
  else if (avgResponseTime > 300) score -= 15;

  // Penalize for high error rate
  if (avgErrorRate > 0.5) score -= 20;
  else if (avgErrorRate > 0.2) score -= 10;

  // Reward for good cache hit rate
  if (avgCacheHitRate > 0.5) score += 10;
  else if (avgCacheHitRate > 0.3) score += 5;

  let rating: "excellent" | "good" | "fair" | "poor" = "excellent";
  if (score < 50) rating = "poor";
  else if (score < 70) rating = "fair";
  else if (score < 85) rating = "good";

  const summary =
    rating === "excellent"
      ? "API performance is excellent"
      : rating === "good"
        ? "API performance is good, some optimizations recommended"
        : rating === "fair"
          ? "API performance needs improvement"
          : "API performance is poor, immediate action required";

  return {
    score: Math.max(0, Math.min(100, score)),
    rating,
    summary,
  };
}

// Get performance analysis report
export function getPerformanceAnalysisReport(): {
  endpoints: EndpointMetrics[];
  bottlenecks: PerformanceBottleneck[];
  optimizations: EndpointOptimization[];
  overallScore: number;
  recommendations: string[];
} {
  return {
    endpoints: getAllEndpointMetrics(),
    bottlenecks: getPerformanceBottlenecks(),
    optimizations: getEndpointOptimizations(),
    overallScore: calculateOverallAPIPerformanceScore().score,
    recommendations: [
      "Implement caching for frequently accessed endpoints",
      "Optimize database queries for slow endpoints",
      "Add pagination to large result set endpoints",
      "Implement field selection for all endpoints",
      "Monitor error rates and investigate high error endpoints",
      "Use response compression for large payloads",
      "Implement rate limiting to prevent abuse",
      "Add performance monitoring and alerting",
    ],
  };
}

// Get endpoint performance comparison
export function getEndpointPerformanceComparison(): {
  fastest: EndpointMetrics;
  slowest: EndpointMetrics;
  highestErrorRate: EndpointMetrics;
  lowestErrorRate: EndpointMetrics;
  largestPayload: EndpointMetrics;
  smallestPayload: EndpointMetrics;
} {
  const metrics = getAllEndpointMetrics();

  return {
    fastest: metrics.reduce((min, m) => (m.averageResponseTime < min.averageResponseTime ? m : min)),
    slowest: metrics.reduce((max, m) => (m.averageResponseTime > max.averageResponseTime ? m : max)),
    highestErrorRate: metrics.reduce((max, m) => (m.errorRate > max.errorRate ? m : max)),
    lowestErrorRate: metrics.reduce((min, m) => (m.errorRate < min.errorRate ? m : min)),
    largestPayload: metrics.reduce((max, m) => (m.averagePayloadSize > max.averagePayloadSize ? m : max)),
    smallestPayload: metrics.reduce((min, m) => (m.averagePayloadSize < min.averagePayloadSize ? m : min)),
  };
}

// Estimate total API optimization potential
export function estimateTotalAPIOptimizationPotential(): {
  currentAverageResponseTime: number;
  optimizedAverageResponseTime: number;
  improvement: number;
  improvementPercentage: number;
} {
  const metrics = getAllEndpointMetrics();
  const currentAvg = metrics.reduce((sum, m) => sum + m.averageResponseTime, 0) / metrics.length;
  const optimizations = getEndpointOptimizations();
  const avgOptimization = optimizations.reduce((sum, o) => sum + o.estimatedImprovement, 0) / optimizations.length;

  const optimizedAvg = currentAvg * (1 - avgOptimization / 100);

  return {
    currentAverageResponseTime: Math.round(currentAvg),
    optimizedAverageResponseTime: Math.round(optimizedAvg),
    improvement: Math.round(currentAvg - optimizedAvg),
    improvementPercentage: Math.round(avgOptimization),
  };
}

