// Redis Integration Utilities

export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db: number;
  maxRetries: number;
  retryDelayMs: number;
  connectionTimeoutMs: number;
  enableOfflineQueue: boolean;
}

export interface RedisConnectionPool {
  size: number;
  activeConnections: number;
  idleConnections: number;
  waitingRequests: number;
}

export interface RedisMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  connectionErrors: number;
  timeoutErrors: number;
}

export interface CacheKeyPattern {
  prefix: string;
  ttl: number;
  invalidationRules: string[];
}

// Default Redis configuration
export const DEFAULT_REDIS_CONFIG: RedisConfig = {
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  password: process.env.REDIS_PASSWORD,
  db: 0,
  maxRetries: 3,
  retryDelayMs: 100,
  connectionTimeoutMs: 5000,
  enableOfflineQueue: true,
};

// Cache key patterns for different data types
export const CACHE_KEY_PATTERNS: Record<string, CacheKeyPattern> = {
  products: {
    prefix: "products:",
    ttl: 3600, // 1 hour
    invalidationRules: ["POST /api/products", "PATCH /api/products/*", "DELETE /api/products/*"],
  },
  categories: {
    prefix: "categories:",
    ttl: 86400, // 24 hours
    invalidationRules: ["POST /api/categories", "PATCH /api/categories/*"],
  },
  vendors: {
    prefix: "vendors:",
    ttl: 3600, // 1 hour
    invalidationRules: ["PATCH /api/vendors/*"],
  },
  orders: {
    prefix: "orders:",
    ttl: 1800, // 30 minutes
    invalidationRules: ["POST /api/orders", "PATCH /api/orders/*"],
  },
  inventory: {
    prefix: "inventory:",
    ttl: 600, // 10 minutes
    invalidationRules: ["PATCH /api/inventory/*", "POST /api/inventory/adjust"],
  },
  reviews: {
    prefix: "reviews:",
    ttl: 1800, // 30 minutes
    invalidationRules: ["POST /api/reviews", "PATCH /api/reviews/*"],
  },
  sessions: {
    prefix: "session:",
    ttl: 86400, // 24 hours
    invalidationRules: ["POST /api/auth/logout"],
  },
  cart: {
    prefix: "cart:",
    ttl: 604800, // 7 days
    invalidationRules: ["POST /api/cart/clear", "DELETE /api/cart/items/*"],
  },
};

// Get Redis configuration
export function getRedisConfig(environment: "development" | "production" = "production"): RedisConfig {
  if (environment === "development") {
    return {
      ...DEFAULT_REDIS_CONFIG,
      maxRetries: 1,
      retryDelayMs: 50,
    };
  }

  return DEFAULT_REDIS_CONFIG;
}

// Generate cache key
export function generateCacheKey(type: string, id?: string | number, suffix?: string): string {
  const pattern = CACHE_KEY_PATTERNS[type];
  if (!pattern) {
    return `${type}:${id}${suffix ? `:${suffix}` : ""}`;
  }

  const key = `${pattern.prefix}${id || "all"}${suffix ? `:${suffix}` : ""}`;
  return key;
}

// Get cache TTL
export function getCacheTTL(type: string): number {
  const pattern = CACHE_KEY_PATTERNS[type];
  return pattern ? pattern.ttl : 3600; // Default 1 hour
}

// Get cache invalidation rules
export function getCacheInvalidationRules(type: string): string[] {
  const pattern = CACHE_KEY_PATTERNS[type];
  return pattern ? pattern.invalidationRules : [];
}

// Create connection pool configuration
export function createConnectionPoolConfig(
  poolSize: number = 10
): {
  minConnections: number;
  maxConnections: number;
  acquireTimeoutMs: number;
  idleTimeoutMs: number;
} {
  return {
    minConnections: Math.max(2, Math.floor(poolSize / 3)),
    maxConnections: poolSize,
    acquireTimeoutMs: 5000,
    idleTimeoutMs: 30000,
  };
}

// Initialize Redis metrics
export function initializeRedisMetrics(): RedisMetrics {
  return {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    averageResponseTime: 0,
    connectionErrors: 0,
    timeoutErrors: 0,
  };
}

// Update Redis metrics
export function updateRedisMetrics(
  metrics: RedisMetrics,
  responseTime: number,
  success: boolean,
  errorType?: "connection" | "timeout"
): RedisMetrics {
  const updated = { ...metrics };
  updated.totalRequests++;

  if (success) {
    updated.successfulRequests++;
    updated.averageResponseTime =
      (updated.averageResponseTime * (updated.successfulRequests - 1) + responseTime) /
      updated.successfulRequests;
  } else {
    updated.failedRequests++;
    if (errorType === "connection") updated.connectionErrors++;
    if (errorType === "timeout") updated.timeoutErrors++;
  }

  return updated;
}

// Calculate cache hit rate
export function calculateCacheHitRate(
  hits: number,
  misses: number
): {
  hitRate: number;
  missRate: number;
  totalRequests: number;
} {
  const totalRequests = hits + misses;
  const hitRate = totalRequests > 0 ? (hits / totalRequests) * 100 : 0;
  const missRate = totalRequests > 0 ? (misses / totalRequests) * 100 : 0;

  return {
    hitRate,
    missRate,
    totalRequests,
  };
}

// Get cache efficiency score
export function getCacheEfficiencyScore(
  hitRate: number,
  averageResponseTime: number
): {
  score: number;
  rating: "excellent" | "good" | "fair" | "poor";
  recommendations: string[];
} {
  let score = 100;
  const recommendations: string[] = [];

  // Penalize for low hit rate
  if (hitRate < 30) {
    score -= 30;
    recommendations.push("Increase cache TTL or cache more data");
  } else if (hitRate < 50) {
    score -= 15;
    recommendations.push("Consider increasing cache coverage");
  }

  // Penalize for slow response time
  if (averageResponseTime > 500) {
    score -= 20;
    recommendations.push("Optimize cache retrieval");
  } else if (averageResponseTime > 200) {
    score -= 10;
    recommendations.push("Consider optimizing cache performance");
  }

  let rating: "excellent" | "good" | "fair" | "poor" = "excellent";
  if (score < 50) rating = "poor";
  else if (score < 70) rating = "fair";
  else if (score < 85) rating = "good";

  return {
    score: Math.max(0, score),
    rating,
    recommendations,
  };
}

// Get cache warming strategy
export function getCacheWarmingStrategy(): {
  endpoints: string[];
  frequency: number;
  priority: "high" | "medium" | "low";
  estimatedImprovement: number;
} {
  return {
    endpoints: [
      "GET /api/products",
      "GET /api/categories",
      "GET /api/vendors",
      "GET /api/localization/currencies",
      "GET /api/localization/holidays",
    ],
    frequency: 3600, // 1 hour
    priority: "high",
    estimatedImprovement: 40,
  };
}

// Get cache invalidation strategy
export function getCacheInvalidationStrategy(): {
  strategy: string;
  patterns: Record<string, string[]>;
  recommendations: string[];
} {
  return {
    strategy: "Event-based cache invalidation with TTL fallback",
    patterns: {
      products: ["on_product_create", "on_product_update", "on_product_delete"],
      categories: ["on_category_create", "on_category_update"],
      inventory: ["on_inventory_adjust", "on_order_create"],
      orders: ["on_order_status_change", "on_order_cancel"],
    },
    recommendations: [
      "Implement event-driven cache invalidation",
      "Use cache tags for related data",
      "Implement cache versioning",
      "Monitor cache invalidation frequency",
      "Use cache warming for critical data",
    ],
  };
}

// Get session caching configuration
export function getSessionCachingConfig(): {
  ttl: number;
  refreshThreshold: number;
  maxSessions: number;
  encryptionEnabled: boolean;
} {
  return {
    ttl: 86400, // 24 hours
    refreshThreshold: 3600, // Refresh if less than 1 hour remaining
    maxSessions: 100000,
    encryptionEnabled: true,
  };
}

// Get cart caching configuration
export function getCartCachingConfig(): {
  ttl: number;
  maxCartSize: number;
  persistToDatabase: boolean;
  syncInterval: number;
} {
  return {
    ttl: 604800, // 7 days
    maxCartSize: 1000, // Max items in cart
    persistToDatabase: true,
    syncInterval: 300000, // Sync every 5 minutes
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

// Get cache memory management strategy
export function getCacheMemoryManagementStrategy(): {
  maxMemory: string;
  evictionPolicy: string;
  memoryMonitoring: boolean;
  recommendations: string[];
} {
  return {
    maxMemory: "256mb",
    evictionPolicy: "allkeys-lru", // Least Recently Used
    memoryMonitoring: true,
    recommendations: [
      "Monitor Redis memory usage",
      "Implement memory alerts",
      "Use appropriate eviction policies",
      "Compress large cached values",
      "Archive old cache data",
    ],
  };
}

// Get Redis performance optimization tips
export function getRedisPerformanceOptimizations(): {
  tips: string[];
  expectedImprovement: number;
} {
  return {
    tips: [
      "Use pipelining for batch operations",
      "Implement connection pooling",
      "Use appropriate data structures",
      "Monitor slow commands",
      "Implement key expiration",
      "Use Redis Cluster for scaling",
      "Enable persistence for critical data",
      "Monitor memory fragmentation",
    ],
    expectedImprovement: 50,
  };
}

// Get cache statistics
export function getCacheStatistics(
  hits: number,
  misses: number,
  evictions: number,
  memoryUsed: number
): {
  hitRate: number;
  missRate: number;
  evictionRate: number;
  memoryUsedMB: number;
  efficiency: number;
} {
  const total = hits + misses;
  const hitRate = total > 0 ? (hits / total) * 100 : 0;
  const missRate = total > 0 ? (misses / total) * 100 : 0;
  const evictionRate = total > 0 ? (evictions / total) * 100 : 0;
  const memoryUsedMB = memoryUsed / (1024 * 1024);
  const efficiency = (hitRate * 0.7 + (100 - evictionRate) * 0.3) / 100;

  return {
    hitRate,
    missRate,
    evictionRate,
    memoryUsedMB,
    efficiency,
  };
}

// Get cache warming recommendations
export function getCacheWarmingRecommendations(): {
  recommendations: string[];
  priority: string[];
  estimatedTime: number;
} {
  return {
    recommendations: [
      "Warm cache on application startup",
      "Warm frequently accessed endpoints",
      "Warm user-specific data on login",
      "Warm seasonal/promotional data",
      "Implement background cache warming",
      "Monitor cache warming performance",
    ],
    priority: [
      "Products (high traffic)",
      "Categories (high traffic)",
      "Vendors (medium traffic)",
      "Localization data (medium traffic)",
      "User sessions (on-demand)",
    ],
    estimatedTime: 5000, // 5 seconds
  };
}

// Get cache invalidation recommendations
export function getCacheInvalidationRecommendations(): {
  recommendations: string[];
  patterns: string[];
  bestPractices: string[];
} {
  return {
    recommendations: [
      "Invalidate on data changes",
      "Use event-driven invalidation",
      "Implement cache versioning",
      "Use cache tags for related data",
      "Monitor invalidation frequency",
      "Implement smart invalidation",
    ],
    patterns: [
      "Time-based expiration (TTL)",
      "Event-based invalidation",
      "Manual invalidation",
      "Dependency-based invalidation",
      "Pattern-based invalidation",
    ],
    bestPractices: [
      "Keep TTL reasonable",
      "Invalidate related data together",
      "Log cache invalidations",
      "Monitor cache hit rates",
      "Test invalidation logic",
    ],
  };
}

