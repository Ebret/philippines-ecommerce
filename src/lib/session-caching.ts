// Session and User Data Caching Utilities

export interface CachedSession {
  sessionId: string;
  userId: number;
  data: Record<string, any>;
  createdAt: number;
  expiresAt: number;
  lastAccessedAt: number;
  accessCount: number;
  encrypted: boolean;
}

export interface CachedUserData {
  userId: number;
  preferences: Record<string, any>;
  cart: CartItem[];
  wishlist: number[];
  recentlyViewed: number[];
  createdAt: number;
  expiresAt: number;
  lastSyncedAt: number;
}

export interface CartItem {
  productId: number;
  quantity: number;
  addedAt: number;
  price: number;
}

export interface SessionCacheMetrics {
  activeSessions: number;
  totalSessions: number;
  sessionHitRate: number;
  averageSessionDuration: number;
  sessionTimeouts: number;
  sessionErrors: number;
}

export interface UserDataCacheMetrics {
  cachedUsers: number;
  cartCacheHits: number;
  cartCacheMisses: number;
  preferenceCacheHits: number;
  preferenceCacheMisses: number;
  averageCacheSize: number;
}

// Initialize cached session
export function initializeCachedSession(
  sessionId: string,
  userId: number,
  data: Record<string, any>,
  ttl: number = 86400,
  encrypted: boolean = true
): CachedSession {
  const now = Date.now();
  return {
    sessionId,
    userId,
    data,
    createdAt: now,
    expiresAt: now + ttl * 1000,
    lastAccessedAt: now,
    accessCount: 0,
    encrypted,
  };
}

// Check if session is expired
export function isSessionExpired(session: CachedSession): boolean {
  return Date.now() > session.expiresAt;
}

// Update session access
export function updateSessionAccess(session: CachedSession): CachedSession {
  return {
    ...session,
    accessCount: session.accessCount + 1,
    lastAccessedAt: Date.now(),
  };
}

// Refresh session expiration
export function refreshSessionExpiration(session: CachedSession, ttl: number = 86400): CachedSession {
  const now = Date.now();
  return {
    ...session,
    expiresAt: now + ttl * 1000,
    lastAccessedAt: now,
  };
}

// Initialize cached user data
export function initializeCachedUserData(
  userId: number,
  preferences: Record<string, any> = {},
  ttl: number = 604800
): CachedUserData {
  const now = Date.now();
  return {
    userId,
    preferences,
    cart: [],
    wishlist: [],
    recentlyViewed: [],
    createdAt: now,
    expiresAt: now + ttl * 1000,
    lastSyncedAt: now,
  };
}

// Check if user data is expired
export function isUserDataExpired(userData: CachedUserData): boolean {
  return Date.now() > userData.expiresAt;
}

// Update user data
export function updateUserData(
  userData: CachedUserData,
  updates: Partial<CachedUserData>
): CachedUserData {
  return {
    ...userData,
    ...updates,
    lastSyncedAt: Date.now(),
  };
}

// Add item to cart
export function addToCart(userData: CachedUserData, item: CartItem): CachedUserData {
  const existingItem = userData.cart.find((i) => i.productId === item.productId);

  if (existingItem) {
    existingItem.quantity += item.quantity;
  } else {
    userData.cart.push(item);
  }

  return {
    ...userData,
    lastSyncedAt: Date.now(),
  };
}

// Remove item from cart
export function removeFromCart(userData: CachedUserData, productId: number): CachedUserData {
  return {
    ...userData,
    cart: userData.cart.filter((i) => i.productId !== productId),
    lastSyncedAt: Date.now(),
  };
}

// Clear cart
export function clearCart(userData: CachedUserData): CachedUserData {
  return {
    ...userData,
    cart: [],
    lastSyncedAt: Date.now(),
  };
}

// Add to wishlist
export function addToWishlist(userData: CachedUserData, productId: number): CachedUserData {
  if (!userData.wishlist.includes(productId)) {
    userData.wishlist.push(productId);
  }

  return {
    ...userData,
    lastSyncedAt: Date.now(),
  };
}

// Remove from wishlist
export function removeFromWishlist(userData: CachedUserData, productId: number): CachedUserData {
  return {
    ...userData,
    wishlist: userData.wishlist.filter((id) => id !== productId),
    lastSyncedAt: Date.now(),
  };
}

// Add to recently viewed
export function addToRecentlyViewed(userData: CachedUserData, productId: number): CachedUserData {
  const filtered = userData.recentlyViewed.filter((id) => id !== productId);
  filtered.unshift(productId);

  return {
    ...userData,
    recentlyViewed: filtered.slice(0, 20), // Keep last 20
    lastSyncedAt: Date.now(),
  };
}

// Initialize session cache metrics
export function initializeSessionCacheMetrics(): SessionCacheMetrics {
  return {
    activeSessions: 0,
    totalSessions: 0,
    sessionHitRate: 0,
    averageSessionDuration: 0,
    sessionTimeouts: 0,
    sessionErrors: 0,
  };
}

// Update session cache metrics
export function updateSessionCacheMetrics(
  metrics: SessionCacheMetrics,
  activeSessions: number,
  hitRate: number,
  duration: number
): SessionCacheMetrics {
  return {
    ...metrics,
    activeSessions,
    totalSessions: metrics.totalSessions + 1,
    sessionHitRate: (metrics.sessionHitRate * (metrics.totalSessions - 1) + hitRate) / metrics.totalSessions,
    averageSessionDuration:
      (metrics.averageSessionDuration * (metrics.totalSessions - 1) + duration) / metrics.totalSessions,
  };
}

// Initialize user data cache metrics
export function initializeUserDataCacheMetrics(): UserDataCacheMetrics {
  return {
    cachedUsers: 0,
    cartCacheHits: 0,
    cartCacheMisses: 0,
    preferenceCacheHits: 0,
    preferenceCacheMisses: 0,
    averageCacheSize: 0,
  };
}

// Update user data cache metrics
export function updateUserDataCacheMetrics(
  metrics: UserDataCacheMetrics,
  dataType: "cart" | "preferences",
  hit: boolean,
  cacheSize: number
): UserDataCacheMetrics {
  const updated = { ...metrics };

  if (dataType === "cart") {
    if (hit) updated.cartCacheHits++;
    else updated.cartCacheMisses++;
  } else {
    if (hit) updated.preferenceCacheHits++;
    else updated.preferenceCacheMisses++;
  }

  const totalSize = updated.cartCacheHits + updated.cartCacheMisses + updated.preferenceCacheHits + updated.preferenceCacheMisses;
  updated.averageCacheSize = totalSize > 0 ? cacheSize / totalSize : 0;

  return updated;
}

// Get session caching configuration
export function getSessionCachingConfig(): {
  ttl: number;
  refreshThreshold: number;
  maxSessions: number;
  encryptionEnabled: boolean;
  recommendations: string[];
} {
  return {
    ttl: 86400, // 24 hours
    refreshThreshold: 3600, // Refresh if less than 1 hour remaining
    maxSessions: 100000,
    encryptionEnabled: true,
    recommendations: [
      "Encrypt sensitive session data",
      "Implement session timeout",
      "Monitor active sessions",
      "Implement session invalidation on logout",
      "Use secure session storage",
    ],
  };
}

// Get cart caching configuration
export function getCartCachingConfig(): {
  ttl: number;
  maxCartSize: number;
  persistToDatabase: boolean;
  syncInterval: number;
  recommendations: string[];
} {
  return {
    ttl: 604800, // 7 days
    maxCartSize: 1000, // Max items in cart
    persistToDatabase: true,
    syncInterval: 300000, // Sync every 5 minutes
    recommendations: [
      "Sync cart to database periodically",
      "Implement cart recovery",
      "Monitor cart abandonment",
      "Implement cart expiration",
      "Cache cart for performance",
    ],
  };
}

// Get user preferences caching configuration
export function getUserPreferencesCachingConfig(): {
  ttl: number;
  cacheable: boolean;
  syncInterval: number;
  recommendations: string[];
} {
  return {
    ttl: 604800, // 7 days
    cacheable: true,
    syncInterval: 600000, // Sync every 10 minutes
    recommendations: [
      "Cache user preferences",
      "Sync preferences to database",
      "Monitor preference changes",
      "Implement preference versioning",
      "Cache language and region preferences",
    ],
  };
}

// Get session security recommendations
export function getSessionSecurityRecommendations(): {
  recommendations: string[];
  bestPractices: string[];
  securityMeasures: string[];
} {
  return {
    recommendations: [
      "Use HTTPS for session transmission",
      "Implement session encryption",
      "Use secure session cookies",
      "Implement CSRF protection",
      "Monitor session activity",
      "Implement session timeout",
    ],
    bestPractices: [
      "Regenerate session ID on login",
      "Invalidate session on logout",
      "Use secure random session IDs",
      "Implement session binding",
      "Monitor for session hijacking",
    ],
    securityMeasures: [
      "Encrypt session data",
      "Use secure storage",
      "Implement access controls",
      "Monitor unauthorized access",
      "Implement audit logging",
    ],
  };
}

// Get cart recovery strategy
export function getCartRecoveryStrategy(): {
  strategy: string;
  recoveryMethods: string[];
  timeWindow: number;
  recommendations: string[];
} {
  return {
    strategy: "Persistent cart with recovery",
    recoveryMethods: [
      "Recover from database on login",
      "Recover from cache on session restore",
      "Email cart recovery link",
      "Show abandoned cart notification",
    ],
    timeWindow: 604800, // 7 days
    recommendations: [
      "Implement cart persistence",
      "Send cart recovery emails",
      "Show abandoned cart notifications",
      "Implement cart expiration",
      "Monitor cart abandonment rate",
    ],
  };
}

// Get user data sync strategy
export function getUserDataSyncStrategy(): {
  strategy: string;
  syncMethods: string[];
  conflictResolution: string;
  recommendations: string[];
} {
  return {
    strategy: "Periodic sync with conflict resolution",
    syncMethods: [
      "Sync on logout",
      "Sync periodically (every 5 minutes)",
      "Sync on critical changes",
      "Sync on session refresh",
    ],
    conflictResolution: "Last-write-wins",
    recommendations: [
      "Implement periodic sync",
      "Handle sync conflicts",
      "Monitor sync failures",
      "Implement sync retry logic",
      "Log sync operations",
    ],
  };
}

// Generate session caching report
export function generateSessionCachingReport(metrics: SessionCacheMetrics): {
  summary: string;
  details: Record<string, any>;
  recommendations: string[];
} {
  return {
    summary: `Active sessions: ${metrics.activeSessions}, Session hit rate: ${metrics.sessionHitRate.toFixed(2)}%`,
    details: {
      activeSessions: metrics.activeSessions,
      totalSessions: metrics.totalSessions,
      sessionHitRate: `${metrics.sessionHitRate.toFixed(2)}%`,
      averageSessionDuration: `${metrics.averageSessionDuration.toFixed(0)}ms`,
      sessionTimeouts: metrics.sessionTimeouts,
      sessionErrors: metrics.sessionErrors,
    },
    recommendations: [
      metrics.sessionHitRate < 80 ? "Improve session caching" : "Session caching is good",
      metrics.sessionErrors > 0 ? "Investigate session errors" : "No session errors",
    ],
  };
}

// Generate user data caching report
export function generateUserDataCachingReport(metrics: UserDataCacheMetrics): {
  summary: string;
  details: Record<string, any>;
  recommendations: string[];
} {
  const cartHitRate = metrics.cartCacheHits + metrics.cartCacheMisses > 0
    ? (metrics.cartCacheHits / (metrics.cartCacheHits + metrics.cartCacheMisses)) * 100
    : 0;
  const prefHitRate = metrics.preferenceCacheHits + metrics.preferenceCacheMisses > 0
    ? (metrics.preferenceCacheHits / (metrics.preferenceCacheHits + metrics.preferenceCacheMisses)) * 100
    : 0;

  return {
    summary: `Cached users: ${metrics.cachedUsers}, Cart hit rate: ${cartHitRate.toFixed(2)}%, Preference hit rate: ${prefHitRate.toFixed(2)}%`,
    details: {
      cachedUsers: metrics.cachedUsers,
      cartCacheHits: metrics.cartCacheHits,
      cartCacheMisses: metrics.cartCacheMisses,
      cartHitRate: `${cartHitRate.toFixed(2)}%`,
      preferenceCacheHits: metrics.preferenceCacheHits,
      preferenceCacheMisses: metrics.preferenceCacheMisses,
      preferenceHitRate: `${prefHitRate.toFixed(2)}%`,
      averageCacheSize: `${(metrics.averageCacheSize / 1024).toFixed(2)} KB`,
    },
    recommendations: [
      cartHitRate < 70 ? "Improve cart caching" : "Cart caching is good",
      prefHitRate < 70 ? "Improve preference caching" : "Preference caching is good",
    ],
  };
}

