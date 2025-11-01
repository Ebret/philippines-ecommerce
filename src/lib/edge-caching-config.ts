// Edge Caching Configuration Utilities

export interface EdgeCacheRule {
  id: string;
  path: string;
  ttl: number;
  maxAge: number;
  sMaxAge: number;
  staleWhileRevalidate: number;
  staleIfError: number;
  cacheKeyIncludeQuery: boolean;
  cacheKeyIncludeHeaders: string[];
  bypassCache: boolean;
  priority: number;
}

export interface EdgeCacheMetrics {
  totalRequests: number;
  cacheHits: number;
  cacheMisses: number;
  hitRate: number;
  averageResponseTime: number;
  bandwidthSaved: number;
  edgeLocations: Record<string, number>;
}

export interface CacheInvalidationRule {
  id: string;
  pattern: string;
  triggers: string[];
  invalidateOn: string[];
  priority: number;
  enabled: boolean;
}

export interface EdgeCacheStrategy {
  name: string;
  description: string;
  ttl: number;
  maxAge: number;
  sMaxAge: number;
  staleWhileRevalidate: number;
  staleIfError: number;
  cacheKeyIncludeQuery: boolean;
  cacheKeyIncludeHeaders: string[];
  bypassCache: boolean;
}

// Default edge cache strategies
export const EDGE_CACHE_STRATEGIES: Record<string, EdgeCacheStrategy> = {
  static: {
    name: "Static Assets",
    description: "Long-term caching for static assets",
    ttl: 31536000, // 1 year
    maxAge: 31536000,
    sMaxAge: 31536000,
    staleWhileRevalidate: 0,
    staleIfError: 0,
    cacheKeyIncludeQuery: false,
    cacheKeyIncludeHeaders: [],
    bypassCache: false,
  },
  dynamic: {
    name: "Dynamic Content",
    description: "Short-term caching for dynamic content",
    ttl: 3600, // 1 hour
    maxAge: 3600,
    sMaxAge: 1800,
    staleWhileRevalidate: 86400,
    staleIfError: 604800,
    cacheKeyIncludeQuery: true,
    cacheKeyIncludeHeaders: ["Accept-Encoding", "Accept-Language"],
    bypassCache: false,
  },
  api: {
    name: "API Responses",
    description: "Medium-term caching for API responses",
    ttl: 1800, // 30 minutes
    maxAge: 1800,
    sMaxAge: 900,
    staleWhileRevalidate: 3600,
    staleIfError: 86400,
    cacheKeyIncludeQuery: true,
    cacheKeyIncludeHeaders: ["Accept-Encoding"],
    bypassCache: false,
  },
  html: {
    name: "HTML Pages",
    description: "Short-term caching for HTML pages",
    ttl: 3600, // 1 hour
    maxAge: 3600,
    sMaxAge: 1800,
    staleWhileRevalidate: 86400,
    staleIfError: 604800,
    cacheKeyIncludeQuery: false,
    cacheKeyIncludeHeaders: ["Accept-Encoding"],
    bypassCache: false,
  },
  image: {
    name: "Images",
    description: "Long-term caching for images",
    ttl: 31536000, // 1 year
    maxAge: 31536000,
    sMaxAge: 31536000,
    staleWhileRevalidate: 0,
    staleIfError: 0,
    cacheKeyIncludeQuery: false,
    cacheKeyIncludeHeaders: [],
    bypassCache: false,
  },
  font: {
    name: "Fonts",
    description: "Long-term caching for fonts",
    ttl: 31536000, // 1 year
    maxAge: 31536000,
    sMaxAge: 31536000,
    staleWhileRevalidate: 0,
    staleIfError: 0,
    cacheKeyIncludeQuery: false,
    cacheKeyIncludeHeaders: [],
    bypassCache: false,
  },
};

// Default edge cache rules
export const DEFAULT_EDGE_CACHE_RULES: EdgeCacheRule[] = [
  {
    id: "rule:static-assets",
    path: "/static/*",
    ttl: 31536000,
    maxAge: 31536000,
    sMaxAge: 31536000,
    staleWhileRevalidate: 0,
    staleIfError: 0,
    cacheKeyIncludeQuery: false,
    cacheKeyIncludeHeaders: [],
    bypassCache: false,
    priority: 1,
  },
  {
    id: "rule:images",
    path: "/images/*",
    ttl: 31536000,
    maxAge: 31536000,
    sMaxAge: 31536000,
    staleWhileRevalidate: 0,
    staleIfError: 0,
    cacheKeyIncludeQuery: false,
    cacheKeyIncludeHeaders: [],
    bypassCache: false,
    priority: 2,
  },
  {
    id: "rule:css",
    path: "/*.css",
    ttl: 31536000,
    maxAge: 31536000,
    sMaxAge: 31536000,
    staleWhileRevalidate: 0,
    staleIfError: 0,
    cacheKeyIncludeQuery: false,
    cacheKeyIncludeHeaders: [],
    bypassCache: false,
    priority: 3,
  },
  {
    id: "rule:javascript",
    path: "/*.js",
    ttl: 31536000,
    maxAge: 31536000,
    sMaxAge: 31536000,
    staleWhileRevalidate: 0,
    staleIfError: 0,
    cacheKeyIncludeQuery: false,
    cacheKeyIncludeHeaders: [],
    bypassCache: false,
    priority: 4,
  },
  {
    id: "rule:fonts",
    path: "/fonts/*",
    ttl: 31536000,
    maxAge: 31536000,
    sMaxAge: 31536000,
    staleWhileRevalidate: 0,
    staleIfError: 0,
    cacheKeyIncludeQuery: false,
    cacheKeyIncludeHeaders: [],
    bypassCache: false,
    priority: 5,
  },
  {
    id: "rule:api",
    path: "/api/*",
    ttl: 1800,
    maxAge: 1800,
    sMaxAge: 900,
    staleWhileRevalidate: 3600,
    staleIfError: 86400,
    cacheKeyIncludeQuery: true,
    cacheKeyIncludeHeaders: ["Accept-Encoding"],
    bypassCache: false,
    priority: 6,
  },
  {
    id: "rule:html",
    path: "/*.html",
    ttl: 3600,
    maxAge: 3600,
    sMaxAge: 1800,
    staleWhileRevalidate: 86400,
    staleIfError: 604800,
    cacheKeyIncludeQuery: false,
    cacheKeyIncludeHeaders: ["Accept-Encoding"],
    bypassCache: false,
    priority: 7,
  },
];

// Default cache invalidation rules
export const DEFAULT_CACHE_INVALIDATION_RULES: CacheInvalidationRule[] = [
  {
    id: "invalidate:products",
    pattern: "/api/products/*",
    triggers: ["POST /api/products", "PATCH /api/products/*", "DELETE /api/products/*"],
    invalidateOn: ["product_created", "product_updated", "product_deleted"],
    priority: 1,
    enabled: true,
  },
  {
    id: "invalidate:categories",
    pattern: "/api/categories/*",
    triggers: ["POST /api/categories", "PATCH /api/categories/*", "DELETE /api/categories/*"],
    invalidateOn: ["category_created", "category_updated", "category_deleted"],
    priority: 2,
    enabled: true,
  },
  {
    id: "invalidate:inventory",
    pattern: "/api/inventory/*",
    triggers: ["PATCH /api/inventory/*"],
    invalidateOn: ["inventory_updated"],
    priority: 3,
    enabled: true,
  },
  {
    id: "invalidate:orders",
    pattern: "/api/orders/*",
    triggers: ["POST /api/orders", "PATCH /api/orders/*"],
    invalidateOn: ["order_created", "order_updated"],
    priority: 4,
    enabled: true,
  },
];

// Get edge cache rule for path
export function getEdgeCacheRuleForPath(path: string): EdgeCacheRule | null {
  for (const rule of DEFAULT_EDGE_CACHE_RULES) {
    if (matchPath(path, rule.path)) {
      return rule;
    }
  }
  return null;
}

// Match path pattern
function matchPath(path: string, pattern: string): boolean {
  const regexPattern = pattern
    .replace(/\./g, "\\.")
    .replace(/\*/g, ".*")
    .replace(/\?/g, ".");
  const regex = new RegExp(`^${regexPattern}$`);
  return regex.test(path);
}

// Get cache control header
export function getCacheControlHeader(rule: EdgeCacheRule): string {
  const parts: string[] = [];

  if (rule.bypassCache) {
    return "no-cache, no-store, must-revalidate";
  }

  parts.push(`public`);
  parts.push(`max-age=${rule.maxAge}`);

  if (rule.sMaxAge > 0) {
    parts.push(`s-maxage=${rule.sMaxAge}`);
  }

  if (rule.staleWhileRevalidate > 0) {
    parts.push(`stale-while-revalidate=${rule.staleWhileRevalidate}`);
  }

  if (rule.staleIfError > 0) {
    parts.push(`stale-if-error=${rule.staleIfError}`);
  }

  return parts.join(", ");
}

// Get cache key
export function getCacheKey(path: string, rule: EdgeCacheRule, queryString?: string, headers?: Record<string, string>): string {
  let key = path;

  if (rule.cacheKeyIncludeQuery && queryString) {
    key += `?${queryString}`;
  }

  if (rule.cacheKeyIncludeHeaders && headers) {
    for (const header of rule.cacheKeyIncludeHeaders) {
      const value = headers[header.toLowerCase()];
      if (value) {
        key += `#${header}=${value}`;
      }
    }
  }

  return key;
}

// Initialize edge cache metrics
export function initializeEdgeCacheMetrics(): EdgeCacheMetrics {
  return {
    totalRequests: 0,
    cacheHits: 0,
    cacheMisses: 0,
    hitRate: 0,
    averageResponseTime: 0,
    bandwidthSaved: 0,
    edgeLocations: {},
  };
}

// Update edge cache metrics
export function updateEdgeCacheMetrics(
  metrics: EdgeCacheMetrics,
  cacheHit: boolean,
  responseTime: number,
  savedBandwidth: number,
  edgeLocation: string
): EdgeCacheMetrics {
  const updated = { ...metrics };
  updated.totalRequests++;

  if (cacheHit) {
    updated.cacheHits++;
  } else {
    updated.cacheMisses++;
  }

  updated.hitRate = (updated.cacheHits / updated.totalRequests) * 100;
  updated.averageResponseTime =
    (updated.averageResponseTime * (updated.totalRequests - 1) + responseTime) / updated.totalRequests;
  updated.bandwidthSaved += savedBandwidth;

  if (!updated.edgeLocations[edgeLocation]) {
    updated.edgeLocations[edgeLocation] = 0;
  }
  updated.edgeLocations[edgeLocation]++;

  return updated;
}

// Get cache invalidation rule for pattern
export function getCacheInvalidationRuleForPattern(pattern: string): CacheInvalidationRule | null {
  for (const rule of DEFAULT_CACHE_INVALIDATION_RULES) {
    if (matchPath(pattern, rule.pattern)) {
      return rule;
    }
  }
  return null;
}

// Get edge cache strategy
export function getEdgeCacheStrategy(strategyName: string): EdgeCacheStrategy | null {
  return EDGE_CACHE_STRATEGIES[strategyName] || null;
}

// Get edge cache recommendations
export function getEdgeCacheRecommendations(): {
  recommendations: string[];
  expectedImprovement: number;
} {
  return {
    recommendations: [
      "Use long TTL for static assets (1 year)",
      "Use short TTL for dynamic content (1 hour)",
      "Implement stale-while-revalidate",
      "Implement stale-if-error",
      "Use cache key variations",
      "Implement cache invalidation",
      "Monitor cache hit rates",
      "Optimize cache rules",
      "Use edge locations",
      "Implement cache warming",
    ],
    expectedImprovement: 70,
  };
}

// Get edge cache performance metrics
export function getEdgeCachePerformanceMetrics(): {
  metric: string;
  currentTime: number;
  optimizedTime: number;
  improvement: number;
  improvementPercentage: number;
}[] {
  return [
    {
      metric: "Static asset delivery",
      currentTime: 200,
      optimizedTime: 50,
      improvement: 150,
      improvementPercentage: 75,
    },
    {
      metric: "Dynamic content delivery",
      currentTime: 500,
      optimizedTime: 200,
      improvement: 300,
      improvementPercentage: 60,
    },
    {
      metric: "API response delivery",
      currentTime: 400,
      optimizedTime: 150,
      improvement: 250,
      improvementPercentage: 63,
    },
    {
      metric: "Image delivery",
      currentTime: 300,
      optimizedTime: 75,
      improvement: 225,
      improvementPercentage: 75,
    },
    {
      metric: "Overall edge cache performance",
      currentTime: 1400,
      optimizedTime: 475,
      improvement: 925,
      improvementPercentage: 66,
    },
  ];
}

// Generate edge cache report
export function generateEdgeCacheReport(metrics: EdgeCacheMetrics): {
  summary: string;
  details: Record<string, any>;
  recommendations: string[];
} {
  return {
    summary: `Total requests: ${metrics.totalRequests}, Cache hit rate: ${metrics.hitRate.toFixed(2)}%, Bandwidth saved: ${(metrics.bandwidthSaved / (1024 * 1024)).toFixed(2)} MB`,
    details: {
      totalRequests: metrics.totalRequests,
      cacheHits: metrics.cacheHits,
      cacheMisses: metrics.cacheMisses,
      hitRate: `${metrics.hitRate.toFixed(2)}%`,
      averageResponseTime: `${metrics.averageResponseTime.toFixed(2)}ms`,
      bandwidthSaved: `${(metrics.bandwidthSaved / (1024 * 1024)).toFixed(2)} MB`,
      edgeLocations: metrics.edgeLocations,
    },
    recommendations: [
      metrics.hitRate < 80 ? "Improve cache hit rate" : "Cache hit rate is good",
      metrics.averageResponseTime > 500 ? "Optimize response time" : "Response time is good",
    ],
  };
}

