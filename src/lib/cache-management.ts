// Cache Management System Utilities

export interface CacheEntry<T> {
  key: string;
  value: T;
  ttl: number;
  createdAt: number;
  expiresAt: number;
  hits: number;
  lastAccessedAt: number;
}

export interface CacheStats {
  totalEntries: number;
  totalHits: number;
  totalMisses: number;
  hitRate: number;
  averageEntrySize: number;
  totalMemoryUsed: number;
  oldestEntry: number;
  newestEntry: number;
}

export interface CacheInvalidationEvent {
  type: "create" | "update" | "delete";
  dataType: string;
  id?: string | number;
  timestamp: number;
  affectedKeys: string[];
}

export interface CacheWarmingJob {
  id: string;
  endpoint: string;
  frequency: number;
  lastRun?: number;
  nextRun: number;
  status: "pending" | "running" | "completed" | "failed";
  itemsWarmed: number;
}

// Cache key generation strategies
export const CACHE_KEY_STRATEGIES = {
  product: (id: number) => `product:${id}`,
  productList: (page: number, limit: number) => `products:list:${page}:${limit}`,
  category: (id: number) => `category:${id}`,
  categoryList: () => `categories:list`,
  vendor: (id: number) => `vendor:${id}`,
  vendorList: (page: number) => `vendors:list:${page}`,
  order: (id: number) => `order:${id}`,
  orderList: (userId: number, page: number) => `orders:user:${userId}:${page}`,
  inventory: (productId: number) => `inventory:${productId}`,
  review: (id: number) => `review:${id}`,
  reviewList: (productId: number, page: number) => `reviews:product:${productId}:${page}`,
  session: (sessionId: string) => `session:${sessionId}`,
  cart: (userId: number) => `cart:${userId}`,
  userPreferences: (userId: number) => `user:preferences:${userId}`,
};

// Cache invalidation patterns
export const CACHE_INVALIDATION_PATTERNS: Record<string, string[]> = {
  products: ["products:*", "products:list:*", "inventory:*"],
  categories: ["categories:*", "categories:list"],
  vendors: ["vendors:*", "vendors:list:*"],
  orders: ["orders:*", "orders:user:*"],
  inventory: ["inventory:*", "products:list:*"],
  reviews: ["reviews:*", "reviews:product:*"],
};

// Initialize cache entry
export function initializeCacheEntry<T>(
  key: string,
  value: T,
  ttl: number
): CacheEntry<T> {
  const now = Date.now();
  return {
    key,
    value,
    ttl,
    createdAt: now,
    expiresAt: now + ttl * 1000,
    hits: 0,
    lastAccessedAt: now,
  };
}

// Check if cache entry is expired
export function isCacheEntryExpired<T>(entry: CacheEntry<T>): boolean {
  return Date.now() > entry.expiresAt;
}

// Update cache entry access
export function updateCacheEntryAccess<T>(entry: CacheEntry<T>): CacheEntry<T> {
  return {
    ...entry,
    hits: entry.hits + 1,
    lastAccessedAt: Date.now(),
  };
}

// Calculate cache entry size (approximate)
export function calculateCacheEntrySize<T>(entry: CacheEntry<T>): number {
  const json = JSON.stringify(entry.value);
  return new Blob([json]).size;
}

// Initialize cache statistics
export function initializeCacheStats(): CacheStats {
  return {
    totalEntries: 0,
    totalHits: 0,
    totalMisses: 0,
    hitRate: 0,
    averageEntrySize: 0,
    totalMemoryUsed: 0,
    oldestEntry: Date.now(),
    newestEntry: Date.now(),
  };
}

// Update cache statistics
export function updateCacheStats(
  stats: CacheStats,
  entries: CacheEntry<any>[],
  hit: boolean
): CacheStats {
  const updated = { ...stats };
  updated.totalEntries = entries.length;

  if (hit) {
    updated.totalHits++;
  } else {
    updated.totalMisses++;
  }

  const total = updated.totalHits + updated.totalMisses;
  updated.hitRate = total > 0 ? (updated.totalHits / total) * 100 : 0;

  if (entries.length > 0) {
    const totalSize = entries.reduce((sum, e) => sum + calculateCacheEntrySize(e), 0);
    updated.averageEntrySize = totalSize / entries.length;
    updated.totalMemoryUsed = totalSize;
    updated.oldestEntry = Math.min(...entries.map((e) => e.createdAt));
    updated.newestEntry = Math.max(...entries.map((e) => e.createdAt));
  }

  return updated;
}

// Get cache invalidation event
export function createCacheInvalidationEvent(
  type: "create" | "update" | "delete",
  dataType: string,
  id?: string | number
): CacheInvalidationEvent {
  const patterns = CACHE_INVALIDATION_PATTERNS[dataType] || [];
  const affectedKeys = patterns.map((pattern) => {
    if (id && pattern.includes("*")) {
      return pattern.replace("*", String(id));
    }
    return pattern;
  });

  return {
    type,
    dataType,
    id,
    timestamp: Date.now(),
    affectedKeys,
  };
}

// Get cache warming job
export function createCacheWarmingJob(
  endpoint: string,
  frequency: number
): CacheWarmingJob {
  return {
    id: `warming:${endpoint}:${Date.now()}`,
    endpoint,
    frequency,
    nextRun: Date.now() + frequency,
    status: "pending",
    itemsWarmed: 0,
  };
}

// Update cache warming job
export function updateCacheWarmingJob(
  job: CacheWarmingJob,
  status: "pending" | "running" | "completed" | "failed",
  itemsWarmed?: number
): CacheWarmingJob {
  return {
    ...job,
    status,
    lastRun: Date.now(),
    nextRun: Date.now() + job.frequency,
    itemsWarmed: itemsWarmed !== undefined ? itemsWarmed : job.itemsWarmed,
  };
}

// Get cache eviction strategy
export function getCacheEvictionStrategy(): {
  policy: string;
  maxEntries: number;
  maxMemory: string;
  recommendations: string[];
} {
  return {
    policy: "LRU (Least Recently Used)",
    maxEntries: 100000,
    maxMemory: "256mb",
    recommendations: [
      "Monitor cache memory usage",
      "Implement memory alerts",
      "Use appropriate eviction policies",
      "Archive old cache data",
      "Implement cache compression",
    ],
  };
}

// Get cache compression strategy
export function getCacheCompressionStrategy(): {
  enabled: boolean;
  threshold: number;
  algorithm: string;
  expectedReduction: number;
} {
  return {
    enabled: true,
    threshold: 1024, // Compress if larger than 1KB
    algorithm: "gzip",
    expectedReduction: 60, // 60% reduction
  };
}

// Get cache consistency strategy
export function getCacheConsistencyStrategy(): {
  strategy: string;
  writeThrough: boolean;
  writeAround: boolean;
  writeBehind: boolean;
  recommendations: string[];
} {
  return {
    strategy: "Cache-Aside with TTL",
    writeThrough: false,
    writeAround: true,
    writeBehind: false,
    recommendations: [
      "Use cache-aside pattern for read-heavy workloads",
      "Implement write-through for critical data",
      "Use write-behind for non-critical data",
      "Monitor cache consistency",
      "Implement cache versioning",
    ],
  };
}

// Get cache monitoring strategy
export function getCacheMonitoringStrategy(): {
  metrics: string[];
  alertThresholds: Record<string, number>;
  reportingInterval: number;
} {
  return {
    metrics: [
      "Hit rate",
      "Miss rate",
      "Eviction rate",
      "Memory usage",
      "Response time",
      "Entry count",
      "Average entry size",
    ],
    alertThresholds: {
      hitRate: 50, // Alert if below 50%
      memoryUsage: 80, // Alert if above 80%
      responseTime: 500, // Alert if above 500ms
      evictionRate: 10, // Alert if above 10%
    },
    reportingInterval: 300000, // 5 minutes
  };
}

// Get cache performance metrics
export function getCachePerformanceMetrics(stats: CacheStats): {
  efficiency: number;
  rating: "excellent" | "good" | "fair" | "poor";
  recommendations: string[];
} {
  let efficiency = 100;
  const recommendations: string[] = [];

  // Penalize for low hit rate
  if (stats.hitRate < 30) {
    efficiency -= 30;
    recommendations.push("Increase cache coverage");
  } else if (stats.hitRate < 50) {
    efficiency -= 15;
    recommendations.push("Consider caching more data");
  }

  // Penalize for high memory usage
  if (stats.totalMemoryUsed > 200 * 1024 * 1024) {
    efficiency -= 20;
    recommendations.push("Reduce cache size or implement compression");
  }

  let rating: "excellent" | "good" | "fair" | "poor" = "excellent";
  if (efficiency < 50) rating = "poor";
  else if (efficiency < 70) rating = "fair";
  else if (efficiency < 85) rating = "good";

  return {
    efficiency: Math.max(0, efficiency),
    rating,
    recommendations,
  };
}

// Get cache optimization recommendations
export function getCacheOptimizationRecommendations(): {
  recommendations: string[];
  priority: string[];
  estimatedImprovement: number;
} {
  return {
    recommendations: [
      "Implement cache warming for high-traffic endpoints",
      "Use appropriate TTL values",
      "Implement cache invalidation on data changes",
      "Monitor cache hit rates",
      "Implement cache compression",
      "Use connection pooling",
      "Implement cache versioning",
      "Monitor memory usage",
    ],
    priority: [
      "Cache products and categories (high traffic)",
      "Cache user sessions (medium traffic)",
      "Cache shopping carts (medium traffic)",
      "Cache inventory data (high traffic)",
      "Cache reviews (medium traffic)",
    ],
    estimatedImprovement: 45,
  };
}

// Get cache warming schedule
export function getCacheWarmingSchedule(): {
  jobs: Array<{
    endpoint: string;
    frequency: number;
    priority: "high" | "medium" | "low";
  }>;
  totalTime: number;
} {
  return {
    jobs: [
      { endpoint: "GET /api/products", frequency: 3600, priority: "high" },
      { endpoint: "GET /api/categories", frequency: 86400, priority: "high" },
      { endpoint: "GET /api/vendors", frequency: 3600, priority: "medium" },
      { endpoint: "GET /api/localization/currencies", frequency: 604800, priority: "medium" },
      { endpoint: "GET /api/localization/holidays", frequency: 604800, priority: "medium" },
    ],
    totalTime: 5000, // 5 seconds
  };
}

// Get cache invalidation schedule
export function getCacheInvalidationSchedule(): {
  patterns: Array<{
    pattern: string;
    trigger: string;
    priority: "high" | "medium" | "low";
  }>;
} {
  return {
    patterns: [
      { pattern: "product:*", trigger: "on_product_change", priority: "high" },
      { pattern: "inventory:*", trigger: "on_inventory_change", priority: "high" },
      { pattern: "order:*", trigger: "on_order_change", priority: "high" },
      { pattern: "category:*", trigger: "on_category_change", priority: "medium" },
      { pattern: "vendor:*", trigger: "on_vendor_change", priority: "medium" },
      { pattern: "review:*", trigger: "on_review_change", priority: "medium" },
    ],
  };
}

// Get cache statistics report
export function generateCacheStatisticsReport(stats: CacheStats): {
  summary: string;
  details: Record<string, any>;
  recommendations: string[];
} {
  const metrics = getCachePerformanceMetrics(stats);

  return {
    summary: `Cache efficiency: ${metrics.rating} (${metrics.efficiency.toFixed(1)}%)`,
    details: {
      totalEntries: stats.totalEntries,
      hitRate: `${stats.hitRate.toFixed(2)}%`,
      missRate: `${((100 - stats.hitRate).toFixed(2))}%`,
      totalHits: stats.totalHits,
      totalMisses: stats.totalMisses,
      averageEntrySize: `${(stats.averageEntrySize / 1024).toFixed(2)} KB`,
      totalMemoryUsed: `${(stats.totalMemoryUsed / (1024 * 1024)).toFixed(2)} MB`,
    },
    recommendations: metrics.recommendations,
  };
}

