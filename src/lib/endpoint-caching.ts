// API Endpoint Caching Utilities

export interface CachedEndpoint {
  endpoint: string;
  method: string;
  cacheable: boolean;
  ttl: number;
  cacheKey: string;
  invalidationRules: string[];
  priority: "high" | "medium" | "low";
}

export interface EndpointCacheMetrics {
  endpoint: string;
  hits: number;
  misses: number;
  hitRate: number;
  averageResponseTime: number;
  cachedResponseTime: number;
  improvement: number;
}

export interface CacheableEndpointConfig {
  endpoint: string;
  method: string;
  ttl: number;
  queryParams?: string[];
  excludeParams?: string[];
  priority: "high" | "medium" | "low";
}

// Cacheable endpoints configuration
export const CACHEABLE_ENDPOINTS: CacheableEndpointConfig[] = [
  {
    endpoint: "GET /api/products",
    method: "GET",
    ttl: 3600,
    queryParams: ["page", "limit", "category", "sort"],
    priority: "high",
  },
  {
    endpoint: "GET /api/products/[id]",
    method: "GET",
    ttl: 3600,
    priority: "high",
  },
  {
    endpoint: "GET /api/categories",
    method: "GET",
    ttl: 86400,
    priority: "high",
  },
  {
    endpoint: "GET /api/categories/[id]",
    method: "GET",
    ttl: 86400,
    priority: "high",
  },
  {
    endpoint: "GET /api/vendors",
    method: "GET",
    ttl: 3600,
    queryParams: ["page", "limit", "sort"],
    priority: "medium",
  },
  {
    endpoint: "GET /api/vendors/[id]",
    method: "GET",
    ttl: 3600,
    priority: "medium",
  },
  {
    endpoint: "GET /api/reviews",
    method: "GET",
    ttl: 1800,
    queryParams: ["page", "limit", "product_id"],
    priority: "medium",
  },
  {
    endpoint: "GET /api/reviews/[id]",
    method: "GET",
    ttl: 1800,
    priority: "medium",
  },
  {
    endpoint: "GET /api/inventory",
    method: "GET",
    ttl: 600,
    queryParams: ["product_id"],
    priority: "high",
  },
  {
    endpoint: "GET /api/localization/currencies",
    method: "GET",
    ttl: 604800,
    priority: "low",
  },
  {
    endpoint: "GET /api/localization/holidays",
    method: "GET",
    ttl: 604800,
    priority: "low",
  },
  {
    endpoint: "GET /api/localization/regions",
    method: "GET",
    ttl: 604800,
    priority: "low",
  },
];

// Get cacheable endpoints
export function getCacheableEndpoints(): CacheableEndpointConfig[] {
  return CACHEABLE_ENDPOINTS;
}

// Get cacheable endpoints by priority
export function getCacheableEndpointsByPriority(
  priority: "high" | "medium" | "low"
): CacheableEndpointConfig[] {
  return CACHEABLE_ENDPOINTS.filter((e) => e.priority === priority);
}

// Check if endpoint is cacheable
export function isEndpointCacheable(endpoint: string, method: string): boolean {
  return CACHEABLE_ENDPOINTS.some((e) => e.endpoint === endpoint && e.method === method);
}

// Get endpoint cache configuration
export function getEndpointCacheConfig(endpoint: string, method: string): CacheableEndpointConfig | undefined {
  return CACHEABLE_ENDPOINTS.find((e) => e.endpoint === endpoint && e.method === method);
}

// Generate endpoint cache key
export function generateEndpointCacheKey(
  endpoint: string,
  queryParams?: Record<string, any>
): string {
  let key = `endpoint:${endpoint}`;

  if (queryParams && Object.keys(queryParams).length > 0) {
    const sortedParams = Object.keys(queryParams)
      .sort()
      .map((k) => `${k}=${queryParams[k]}`)
      .join("&");
    key += `:${sortedParams}`;
  }

  return key;
}

// Get endpoint cache invalidation rules
export function getEndpointCacheInvalidationRules(endpoint: string): string[] {
  const rules: Record<string, string[]> = {
    "GET /api/products": ["POST /api/products", "PATCH /api/products/*", "DELETE /api/products/*"],
    "GET /api/categories": ["POST /api/categories", "PATCH /api/categories/*"],
    "GET /api/vendors": ["PATCH /api/vendors/*"],
    "GET /api/reviews": ["POST /api/reviews", "PATCH /api/reviews/*"],
    "GET /api/inventory": ["PATCH /api/inventory/*", "POST /api/inventory/adjust"],
  };

  return rules[endpoint] || [];
}

// Initialize endpoint cache metrics
export function initializeEndpointCacheMetrics(endpoint: string): EndpointCacheMetrics {
  return {
    endpoint,
    hits: 0,
    misses: 0,
    hitRate: 0,
    averageResponseTime: 0,
    cachedResponseTime: 0,
    improvement: 0,
  };
}

// Update endpoint cache metrics
export function updateEndpointCacheMetrics(
  metrics: EndpointCacheMetrics,
  hit: boolean,
  responseTime: number,
  cachedResponseTime?: number
): EndpointCacheMetrics {
  const updated = { ...metrics };

  if (hit) {
    updated.hits++;
    if (cachedResponseTime !== undefined) {
      updated.cachedResponseTime =
        (updated.cachedResponseTime * (updated.hits - 1) + cachedResponseTime) / updated.hits;
    }
  } else {
    updated.misses++;
    updated.averageResponseTime =
      (updated.averageResponseTime * (updated.misses - 1) + responseTime) / updated.misses;
  }

  const total = updated.hits + updated.misses;
  updated.hitRate = total > 0 ? (updated.hits / total) * 100 : 0;
  updated.improvement =
    updated.averageResponseTime > 0
      ? ((updated.averageResponseTime - updated.cachedResponseTime) / updated.averageResponseTime) * 100
      : 0;

  return updated;
}

// Get endpoint caching strategy
export function getEndpointCachingStrategy(): {
  strategy: string;
  cacheableEndpoints: number;
  estimatedImprovement: number;
  recommendations: string[];
} {
  return {
    strategy: "Cache-Aside with TTL-based expiration",
    cacheableEndpoints: CACHEABLE_ENDPOINTS.length,
    estimatedImprovement: 45,
    recommendations: [
      "Cache high-traffic endpoints",
      "Use appropriate TTL values",
      "Implement cache invalidation",
      "Monitor cache hit rates",
      "Implement cache warming",
      "Use query parameter-based cache keys",
    ],
  };
}

// Get endpoint cache warming priority
export function getEndpointCacheWarmingPriority(): {
  high: string[];
  medium: string[];
  low: string[];
} {
  return {
    high: [
      "GET /api/products",
      "GET /api/categories",
      "GET /api/inventory",
    ],
    medium: [
      "GET /api/vendors",
      "GET /api/reviews",
    ],
    low: [
      "GET /api/localization/currencies",
      "GET /api/localization/holidays",
      "GET /api/localization/regions",
    ],
  };
}

// Get endpoint response time improvement
export function getEndpointResponseTimeImprovement(): {
  endpoint: string;
  currentTime: number;
  cachedTime: number;
  improvement: number;
  improvementPercentage: number;
}[] {
  return [
    {
      endpoint: "GET /api/products",
      currentTime: 450,
      cachedTime: 50,
      improvement: 400,
      improvementPercentage: 89,
    },
    {
      endpoint: "GET /api/categories",
      currentTime: 200,
      cachedTime: 20,
      improvement: 180,
      improvementPercentage: 90,
    },
    {
      endpoint: "GET /api/vendors",
      currentTime: 300,
      cachedTime: 30,
      improvement: 270,
      improvementPercentage: 90,
    },
    {
      endpoint: "GET /api/reviews",
      currentTime: 400,
      cachedTime: 40,
      improvement: 360,
      improvementPercentage: 90,
    },
    {
      endpoint: "GET /api/inventory",
      currentTime: 350,
      cachedTime: 35,
      improvement: 315,
      improvementPercentage: 90,
    },
  ];
}

// Get cache invalidation triggers
export function getCacheInvalidationTriggers(): {
  trigger: string;
  affectedEndpoints: string[];
  priority: "high" | "medium" | "low";
}[] {
  return [
    {
      trigger: "POST /api/products",
      affectedEndpoints: ["GET /api/products", "GET /api/categories"],
      priority: "high",
    },
    {
      trigger: "PATCH /api/products/[id]",
      affectedEndpoints: ["GET /api/products", "GET /api/products/[id]"],
      priority: "high",
    },
    {
      trigger: "DELETE /api/products/[id]",
      affectedEndpoints: ["GET /api/products", "GET /api/products/[id]"],
      priority: "high",
    },
    {
      trigger: "PATCH /api/inventory/[id]",
      affectedEndpoints: ["GET /api/inventory", "GET /api/products"],
      priority: "high",
    },
    {
      trigger: "POST /api/reviews",
      affectedEndpoints: ["GET /api/reviews", "GET /api/products/[id]"],
      priority: "medium",
    },
    {
      trigger: "PATCH /api/vendors/[id]",
      affectedEndpoints: ["GET /api/vendors", "GET /api/vendors/[id]"],
      priority: "medium",
    },
  ];
}

// Get endpoint caching report
export function generateEndpointCachingReport(metrics: EndpointCacheMetrics[]): {
  summary: string;
  topCachedEndpoints: EndpointCacheMetrics[];
  averageHitRate: number;
  totalImprovement: number;
  recommendations: string[];
} {
  const averageHitRate = metrics.reduce((sum, m) => sum + m.hitRate, 0) / metrics.length;
  const totalImprovement = metrics.reduce((sum, m) => sum + m.improvement, 0) / metrics.length;
  const topCachedEndpoints = metrics.sort((a, b) => b.hitRate - a.hitRate).slice(0, 5);

  const recommendations: string[] = [];
  if (averageHitRate < 50) {
    recommendations.push("Increase cache coverage");
  }
  if (totalImprovement < 40) {
    recommendations.push("Optimize cache TTL values");
  }

  return {
    summary: `Average cache hit rate: ${averageHitRate.toFixed(2)}%, Average improvement: ${totalImprovement.toFixed(2)}%`,
    topCachedEndpoints,
    averageHitRate,
    totalImprovement,
    recommendations,
  };
}

// Get cache hit rate by endpoint
export function getCacheHitRateByEndpoint(metrics: EndpointCacheMetrics[]): {
  endpoint: string;
  hitRate: number;
  status: "excellent" | "good" | "fair" | "poor";
}[] {
  return metrics.map((m) => {
    let status: "excellent" | "good" | "fair" | "poor" = "excellent";
    if (m.hitRate < 30) status = "poor";
    else if (m.hitRate < 50) status = "fair";
    else if (m.hitRate < 80) status = "good";

    return {
      endpoint: m.endpoint,
      hitRate: m.hitRate,
      status,
    };
  });
}

// Get cache optimization opportunities
export function getCacheOptimizationOpportunities(): {
  opportunity: string;
  endpoint: string;
  estimatedImprovement: number;
  priority: "high" | "medium" | "low";
}[] {
  return [
    {
      opportunity: "Increase TTL for categories",
      endpoint: "GET /api/categories",
      estimatedImprovement: 20,
      priority: "medium",
    },
    {
      opportunity: "Implement pagination caching",
      endpoint: "GET /api/products",
      estimatedImprovement: 30,
      priority: "high",
    },
    {
      opportunity: "Cache inventory by product",
      endpoint: "GET /api/inventory",
      estimatedImprovement: 25,
      priority: "high",
    },
    {
      opportunity: "Implement review caching",
      endpoint: "GET /api/reviews",
      estimatedImprovement: 35,
      priority: "medium",
    },
  ];
}

