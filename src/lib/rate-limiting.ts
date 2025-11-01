/**
 * Rate Limiting & DDoS Protection
 * Prevents abuse and distributed denial of service attacks
 */

export interface RateLimitConfig {
  id: string;
  name: string;
  maxRequests: number;
  windowMs: number; // Time window in milliseconds
  message: string;
  statusCode: number;
  skipSuccessfulRequests: boolean;
  skipFailedRequests: boolean;
  keyGenerator?: (req: Record<string, unknown>) => string;
  enabled: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface RateLimitEntry {
  key: string;
  count: number;
  resetTime: number;
  blocked: boolean;
  blockUntil?: number;
}

export interface RateLimitStore {
  [key: string]: RateLimitEntry;
}

export interface RateLimitStatus {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
  message?: string;
}

/**
 * Initialize rate limit configuration
 */
export function initializeRateLimitConfig(
  name: string,
  maxRequests: number = 100,
  windowMs: number = 60 * 1000 // 1 minute
): RateLimitConfig {
  return {
    id: `ratelimit_${Date.now()}`,
    name,
    maxRequests,
    windowMs,
    message: 'Too many requests, please try again later',
    statusCode: 429,
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
    enabled: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

/**
 * Create default rate limit store
 */
export function createRateLimitStore(): RateLimitStore {
  return {};
}

/**
 * Check rate limit
 */
export function checkRateLimit(
  store: RateLimitStore,
  key: string,
  config: RateLimitConfig
): RateLimitStatus {
  if (!config.enabled) {
    return {
      allowed: true,
      remaining: config.maxRequests,
      resetTime: Date.now() + config.windowMs,
    };
  }

  const now = Date.now();
  const entry = store[key];

  // Create new entry if doesn't exist
  if (!entry) {
    store[key] = {
      key,
      count: 1,
      resetTime: now + config.windowMs,
      blocked: false,
    };

    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime: store[key].resetTime,
    };
  }

  // Check if window has expired
  if (now > entry.resetTime) {
    store[key] = {
      key,
      count: 1,
      resetTime: now + config.windowMs,
      blocked: false,
    };

    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime: store[key].resetTime,
    };
  }

  // Check if blocked
  if (entry.blocked && entry.blockUntil && now < entry.blockUntil) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.blockUntil,
      retryAfter: Math.ceil((entry.blockUntil - now) / 1000),
      message: config.message,
    };
  }

  // Increment count
  entry.count++;

  // Check if limit exceeded
  if (entry.count > config.maxRequests) {
    entry.blocked = true;
    entry.blockUntil = now + config.windowMs;

    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.blockUntil,
      retryAfter: Math.ceil(config.windowMs / 1000),
      message: config.message,
    };
  }

  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Create API rate limit config
 */
export function createAPIRateLimitConfig(): RateLimitConfig {
  return initializeRateLimitConfig('API Rate Limit', 1000, 60 * 1000); // 1000 requests per minute
}

/**
 * Create login rate limit config
 */
export function createLoginRateLimitConfig(): RateLimitConfig {
  return initializeRateLimitConfig('Login Rate Limit', 5, 15 * 60 * 1000); // 5 attempts per 15 minutes
}

/**
 * Create password reset rate limit config
 */
export function createPasswordResetRateLimitConfig(): RateLimitConfig {
  return initializeRateLimitConfig('Password Reset Rate Limit', 3, 60 * 60 * 1000); // 3 attempts per hour
}

/**
 * Create file upload rate limit config
 */
export function createFileUploadRateLimitConfig(): RateLimitConfig {
  return initializeRateLimitConfig('File Upload Rate Limit', 10, 60 * 60 * 1000); // 10 uploads per hour
}

/**
 * Create search rate limit config
 */
export function createSearchRateLimitConfig(): RateLimitConfig {
  return initializeRateLimitConfig('Search Rate Limit', 100, 60 * 1000); // 100 searches per minute
}

/**
 * Create IP-based rate limit key
 */
export function createIPBasedKey(ip: string): string {
  return `ip_${ip}`;
}

/**
 * Create user-based rate limit key
 */
export function createUserBasedKey(userId: string): string {
  return `user_${userId}`;
}

/**
 * Create endpoint-based rate limit key
 */
export function createEndpointBasedKey(ip: string, endpoint: string): string {
  return `endpoint_${ip}_${endpoint}`;
}

/**
 * Clean up expired entries
 */
export function cleanupExpiredEntries(store: RateLimitStore): void {
  const now = Date.now();

  for (const key in store) {
    const entry = store[key];
    if (now > entry.resetTime && !entry.blocked) {
      delete store[key];
    }
  }
}

/**
 * Get rate limit statistics
 */
export function getRateLimitStatistics(store: RateLimitStore): {
  totalKeys: number;
  blockedKeys: number;
  activeKeys: number;
  averageCount: number;
} {
  const now = Date.now();
  let blockedCount = 0;
  let activeCount = 0;
  let totalCount = 0;

  for (const key in store) {
    const entry = store[key];
    if (now <= entry.resetTime) {
      activeCount++;
      totalCount += entry.count;
    }
    if (entry.blocked && entry.blockUntil && now < entry.blockUntil) {
      blockedCount++;
    }
  }

  return {
    totalKeys: Object.keys(store).length,
    blockedKeys: blockedCount,
    activeKeys: activeCount,
    averageCount: activeCount > 0 ? totalCount / activeCount : 0,
  };
}

/**
 * Reset rate limit for specific key
 */
export function resetRateLimit(store: RateLimitStore, key: string): void {
  delete store[key];
}

/**
 * Reset all rate limits
 */
export function resetAllRateLimits(store: RateLimitStore): void {
  for (const key in store) {
    delete store[key];
  }
}

/**
 * Block IP address
 */
export function blockIPAddress(store: RateLimitStore, ip: string, durationMs: number = 24 * 60 * 60 * 1000): void {
  const key = createIPBasedKey(ip);
  const now = Date.now();

  store[key] = {
    key,
    count: 0,
    resetTime: now + durationMs,
    blocked: true,
    blockUntil: now + durationMs,
  };
}

/**
 * Unblock IP address
 */
export function unblockIPAddress(store: RateLimitStore, ip: string): void {
  const key = createIPBasedKey(ip);
  delete store[key];
}

/**
 * Get blocked IPs
 */
export function getBlockedIPs(store: RateLimitStore): string[] {
  const now = Date.now();
  const blockedIPs: string[] = [];

  for (const key in store) {
    const entry = store[key];
    if (key.startsWith('ip_') && entry.blocked && entry.blockUntil && now < entry.blockUntil) {
      blockedIPs.push(key.replace('ip_', ''));
    }
  }

  return blockedIPs;
}

/**
 * Generate rate limit report
 */
export function generateRateLimitReport(
  store: RateLimitStore,
  config: RateLimitConfig
): {
  timestamp: number;
  config: RateLimitConfig;
  statistics: ReturnType<typeof getRateLimitStatistics>;
  blockedIPs: string[];
  recommendations: string[];
} {
  const stats = getRateLimitStatistics(store);
  const blockedIPs = getBlockedIPs(store);
  const recommendations: string[] = [];

  if (stats.blockedKeys > 10) {
    recommendations.push('High number of blocked requests - consider reviewing rate limit configuration');
  }

  if (stats.averageCount > config.maxRequests * 0.8) {
    recommendations.push('Average request count approaching limit - monitor for potential attacks');
  }

  if (blockedIPs.length > 5) {
    recommendations.push('Multiple IPs blocked - possible DDoS attack');
  }

  return {
    timestamp: Date.now(),
    config,
    statistics: stats,
    blockedIPs,
    recommendations,
  };
}

