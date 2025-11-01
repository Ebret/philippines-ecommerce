// Database Query Caching Utilities

export interface CachedQuery {
  queryId: string;
  query: string;
  params: any[];
  result: any;
  ttl: number;
  createdAt: number;
  expiresAt: number;
  hits: number;
  lastAccessedAt: number;
  queryTime: number;
  resultSize: number;
}

export interface QueryCacheMetrics {
  totalQueries: number;
  cachedQueries: number;
  cacheHits: number;
  cacheMisses: number;
  hitRate: number;
  averageQueryTime: number;
  averageCachedTime: number;
  totalTimeSaved: number;
}

export interface QueryCachingStrategy {
  queryType: string;
  cacheable: boolean;
  ttl: number;
  invalidationRules: string[];
  priority: "high" | "medium" | "low";
}

// Query caching strategies
export const QUERY_CACHING_STRATEGIES: QueryCachingStrategy[] = [
  {
    queryType: "SELECT products",
    cacheable: true,
    ttl: 3600,
    invalidationRules: ["INSERT products", "UPDATE products", "DELETE products"],
    priority: "high",
  },
  {
    queryType: "SELECT categories",
    cacheable: true,
    ttl: 86400,
    invalidationRules: ["INSERT categories", "UPDATE categories"],
    priority: "high",
  },
  {
    queryType: "SELECT vendors",
    cacheable: true,
    ttl: 3600,
    invalidationRules: ["INSERT vendors", "UPDATE vendors"],
    priority: "medium",
  },
  {
    queryType: "SELECT reviews",
    cacheable: true,
    ttl: 1800,
    invalidationRules: ["INSERT reviews", "UPDATE reviews", "DELETE reviews"],
    priority: "medium",
  },
  {
    queryType: "SELECT inventory",
    cacheable: true,
    ttl: 600,
    invalidationRules: ["UPDATE inventory"],
    priority: "high",
  },
  {
    queryType: "SELECT orders",
    cacheable: true,
    ttl: 1800,
    invalidationRules: ["INSERT orders", "UPDATE orders"],
    priority: "medium",
  },
  {
    queryType: "SELECT users",
    cacheable: true,
    ttl: 3600,
    invalidationRules: ["UPDATE users"],
    priority: "low",
  },
];

// Generate query cache key
export function generateQueryCacheKey(query: string, params: any[]): string {
  const paramString = JSON.stringify(params);
  const hash = hashString(query + paramString);
  return `query:${hash}`;
}

// Hash string for cache key
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

// Initialize cached query
export function initializeCachedQuery(
  query: string,
  params: any[],
  result: any,
  ttl: number,
  queryTime: number
): CachedQuery {
  const now = Date.now();
  const resultSize = JSON.stringify(result).length;

  return {
    queryId: generateQueryCacheKey(query, params),
    query,
    params,
    result,
    ttl,
    createdAt: now,
    expiresAt: now + ttl * 1000,
    hits: 0,
    lastAccessedAt: now,
    queryTime,
    resultSize,
  };
}

// Check if cached query is expired
export function isCachedQueryExpired(cachedQuery: CachedQuery): boolean {
  return Date.now() > cachedQuery.expiresAt;
}

// Update cached query access
export function updateCachedQueryAccess(cachedQuery: CachedQuery): CachedQuery {
  return {
    ...cachedQuery,
    hits: cachedQuery.hits + 1,
    lastAccessedAt: Date.now(),
  };
}

// Get query caching strategy
export function getQueryCachingStrategy(queryType: string): QueryCachingStrategy | undefined {
  return QUERY_CACHING_STRATEGIES.find((s) => queryType.includes(s.queryType));
}

// Check if query is cacheable
export function isQueryCacheable(query: string): boolean {
  const strategy = QUERY_CACHING_STRATEGIES.find((s) => query.includes(s.queryType));
  return strategy ? strategy.cacheable : false;
}

// Get query cache TTL
export function getQueryCacheTTL(query: string): number {
  const strategy = QUERY_CACHING_STRATEGIES.find((s) => query.includes(s.queryType));
  return strategy ? strategy.ttl : 3600;
}

// Get query cache invalidation rules
export function getQueryCacheInvalidationRules(query: string): string[] {
  const strategy = QUERY_CACHING_STRATEGIES.find((s) => query.includes(s.queryType));
  return strategy ? strategy.invalidationRules : [];
}

// Initialize query cache metrics
export function initializeQueryCacheMetrics(): QueryCacheMetrics {
  return {
    totalQueries: 0,
    cachedQueries: 0,
    cacheHits: 0,
    cacheMisses: 0,
    hitRate: 0,
    averageQueryTime: 0,
    averageCachedTime: 0,
    totalTimeSaved: 0,
  };
}

// Update query cache metrics
export function updateQueryCacheMetrics(
  metrics: QueryCacheMetrics,
  hit: boolean,
  queryTime: number,
  cachedTime?: number
): QueryCacheMetrics {
  const updated = { ...metrics };
  updated.totalQueries++;

  if (hit) {
    updated.cacheHits++;
    if (cachedTime !== undefined) {
      updated.averageCachedTime =
        (updated.averageCachedTime * (updated.cacheHits - 1) + cachedTime) / updated.cacheHits;
      updated.totalTimeSaved += queryTime - cachedTime;
    }
  } else {
    updated.cacheMisses++;
    updated.cachedQueries++;
    updated.averageQueryTime =
      (updated.averageQueryTime * (updated.cacheMisses - 1) + queryTime) / updated.cacheMisses;
  }

  updated.hitRate =
    updated.totalQueries > 0 ? (updated.cacheHits / updated.totalQueries) * 100 : 0;

  return updated;
}

// Get expensive queries
export function getExpensiveQueries(): {
  query: string;
  estimatedTime: number;
  cacheable: boolean;
  ttl: number;
  priority: "high" | "medium" | "low";
}[] {
  return [
    {
      query: "SELECT * FROM products WITH complex joins",
      estimatedTime: 500,
      cacheable: true,
      ttl: 3600,
      priority: "high",
    },
    {
      query: "SELECT * FROM reviews WITH aggregations",
      estimatedTime: 400,
      cacheable: true,
      ttl: 1800,
      priority: "medium",
    },
    {
      query: "SELECT * FROM orders WITH user data",
      estimatedTime: 350,
      cacheable: true,
      ttl: 1800,
      priority: "medium",
    },
    {
      query: "SELECT * FROM inventory WITH product data",
      estimatedTime: 300,
      cacheable: true,
      ttl: 600,
      priority: "high",
    },
  ];
}

// Get query cache-aside pattern
export function getQueryCacheAsidePattern(): {
  steps: string[];
  benefits: string[];
  considerations: string[];
} {
  return {
    steps: [
      "1. Check cache for query result",
      "2. If cache hit, return cached result",
      "3. If cache miss, execute query",
      "4. Store result in cache",
      "5. Return result to client",
    ],
    benefits: [
      "Simple to implement",
      "No cache invalidation on write",
      "Lazy loading of data",
      "Reduces database load",
    ],
    considerations: [
      "Cache misses on first access",
      "Stale data possible",
      "Cache warming needed",
      "Memory overhead",
    ],
  };
}

// Get query result caching configuration
export function getQueryResultCachingConfig(): {
  enabled: boolean;
  defaultTTL: number;
  maxCacheSize: number;
  compressionEnabled: boolean;
  recommendations: string[];
} {
  return {
    enabled: true,
    defaultTTL: 3600,
    maxCacheSize: 1000000, // 1MB
    compressionEnabled: true,
    recommendations: [
      "Cache expensive queries",
      "Use cache-aside pattern",
      "Implement automatic invalidation",
      "Monitor cache memory usage",
      "Implement cache eviction policies",
    ],
  };
}

// Get query performance improvement
export function getQueryPerformanceImprovement(): {
  query: string;
  currentTime: number;
  cachedTime: number;
  improvement: number;
  improvementPercentage: number;
}[] {
  return [
    {
      query: "SELECT products with joins",
      currentTime: 500,
      cachedTime: 50,
      improvement: 450,
      improvementPercentage: 90,
    },
    {
      query: "SELECT reviews with aggregations",
      currentTime: 400,
      cachedTime: 40,
      improvement: 360,
      improvementPercentage: 90,
    },
    {
      query: "SELECT orders with user data",
      currentTime: 350,
      cachedTime: 35,
      improvement: 315,
      improvementPercentage: 90,
    },
    {
      query: "SELECT inventory with product data",
      currentTime: 300,
      cachedTime: 30,
      improvement: 270,
      improvementPercentage: 90,
    },
  ];
}

// Get query caching recommendations
export function getQueryCachingRecommendations(): {
  recommendations: string[];
  priority: string[];
  estimatedImprovement: number;
} {
  return {
    recommendations: [
      "Cache expensive queries",
      "Use cache-aside pattern",
      "Implement query result compression",
      "Monitor cache hit rates",
      "Implement cache warming",
      "Use query parameter-based cache keys",
      "Implement automatic cache invalidation",
      "Monitor cache memory usage",
    ],
    priority: [
      "Cache product queries (high traffic)",
      "Cache inventory queries (high traffic)",
      "Cache review queries (medium traffic)",
      "Cache order queries (medium traffic)",
      "Cache user queries (low traffic)",
    ],
    estimatedImprovement: 50,
  };
}

// Generate query caching report
export function generateQueryCachingReport(metrics: QueryCacheMetrics): {
  summary: string;
  details: Record<string, any>;
  recommendations: string[];
} {
  return {
    summary: `Query cache hit rate: ${metrics.hitRate.toFixed(2)}%, Total time saved: ${metrics.totalTimeSaved}ms`,
    details: {
      totalQueries: metrics.totalQueries,
      cachedQueries: metrics.cachedQueries,
      cacheHits: metrics.cacheHits,
      cacheMisses: metrics.cacheMisses,
      hitRate: `${metrics.hitRate.toFixed(2)}%`,
      averageQueryTime: `${metrics.averageQueryTime.toFixed(2)}ms`,
      averageCachedTime: `${metrics.averageCachedTime.toFixed(2)}ms`,
      totalTimeSaved: `${metrics.totalTimeSaved}ms`,
    },
    recommendations: [
      metrics.hitRate < 50 ? "Increase cache coverage" : "Cache coverage is good",
      metrics.averageQueryTime > 300 ? "Optimize slow queries" : "Query performance is good",
    ],
  };
}
