/**
 * Rate Limiting Middleware
 * 
 * Implements rate limiting and DDoS protection for Next.js
 * Prevents abuse by limiting requests per IP, user, or endpoint
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  createRateLimitStore,
  checkRateLimit,
  createIPBasedKey,
  createEndpointBasedKey,
  cleanupExpiredEntries,
  blockIPAddress,
  getBlockedIPs,
} from '@/lib/rate-limiting';
import {
  getRateLimitConfigByType,
  ipBlockingConfig,
} from '@/lib/rate-limit-config';
import type { RateLimitStore } from '@/lib/rate-limiting';

// Global rate limit store (in-memory)
// In production, consider using Redis for distributed rate limiting
let globalRateLimitStore: RateLimitStore = createRateLimitStore();

/**
 * Get client IP address from request
 */
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
  return ip;
}

/**
 * Check if IP is blocked
 */
function isIPBlocked(ip: string): boolean {
  const blockedIPs = getBlockedIPs(globalRateLimitStore);
  return blockedIPs.includes(ip);
}

/**
 * Apply rate limiting to request
 */
export function applyRateLimit(
  request: NextRequest,
  limitType: 'api' | 'login' | 'passwordReset' | 'fileUpload' | 'search' | 'publicEndpoint' | 'authenticatedEndpoint'
): { allowed: boolean; response?: NextResponse } {
  const ip = getClientIP(request);
  const pathname = request.nextUrl.pathname;

  // Check if IP is blocked
  if (isIPBlocked(ip)) {
    return {
      allowed: false,
      response: NextResponse.json(
        { error: 'Your IP has been blocked due to too many requests' },
        { status: 429 }
      ),
    };
  }

  // Get rate limit config
  const config = getRateLimitConfigByType(limitType);

  // Create rate limit key
  const key = createEndpointBasedKey(ip, pathname);

  // Check rate limit
  const status = checkRateLimit(globalRateLimitStore, key, config);

  // If not allowed, check if we should block the IP
  if (!status.allowed) {
    // Track violations for this IP
    const ipKey = `violations_${ip}`;
    const violations = globalRateLimitStore[ipKey];

    if (violations) {
      violations.count++;

      // Block IP if violations exceed threshold
      if (violations.count >= ipBlockingConfig.violationThreshold) {
        blockIPAddress(globalRateLimitStore, ip, ipBlockingConfig.blockDurationMs);
      }
    } else {
      globalRateLimitStore[ipKey] = {
        key: ipKey,
        count: 1,
        resetTime: Date.now() + ipBlockingConfig.violationWindowMs,
        blocked: false,
      };
    }

    return {
      allowed: false,
      response: NextResponse.json(
        {
          error: status.message || 'Too many requests',
          retryAfter: status.retryAfter,
        },
        {
          status: config.statusCode,
          headers: {
            'Retry-After': String(status.retryAfter || Math.ceil(config.windowMs / 1000)),
            'X-RateLimit-Limit': String(config.maxRequests),
            'X-RateLimit-Remaining': String(status.remaining),
            'X-RateLimit-Reset': String(Math.ceil(status.resetTime / 1000)),
          },
        }
      ),
    };
  }

  // Request allowed, return response with rate limit headers
  const response = NextResponse.next();
  response.headers.set('X-RateLimit-Limit', String(config.maxRequests));
  response.headers.set('X-RateLimit-Remaining', String(status.remaining));
  response.headers.set('X-RateLimit-Reset', String(Math.ceil(status.resetTime / 1000)));

  return { allowed: true, response };
}

/**
 * Rate limiting middleware for Next.js
 */
export function rateLimitMiddleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip rate limiting for static assets
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/public/') ||
    pathname.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)
  ) {
    return NextResponse.next();
  }

  // Determine rate limit type based on pathname
  let limitType: 'api' | 'login' | 'passwordReset' | 'fileUpload' | 'search' | 'publicEndpoint' | 'authenticatedEndpoint' = 'publicEndpoint';

  if (pathname.startsWith('/api/')) {
    limitType = 'api';
  } else if (pathname.includes('/auth/login') || pathname.includes('/api/auth/login')) {
    limitType = 'login';
  } else if (pathname.includes('/auth/reset-password') || pathname.includes('/api/auth/reset-password')) {
    limitType = 'passwordReset';
  } else if (pathname.includes('/upload') || pathname.includes('/api/upload')) {
    limitType = 'fileUpload';
  } else if (pathname.includes('/search') || pathname.includes('/api/search')) {
    limitType = 'search';
  }

  // Apply rate limiting
  const result = applyRateLimit(request, limitType);

  if (!result.allowed && result.response) {
    return result.response;
  }

  // Periodically clean up expired entries
  if (Math.random() < 0.01) { // 1% of requests
    cleanupExpiredEntries(globalRateLimitStore);
  }

  return result.response || NextResponse.next();
}

/**
 * Get rate limit statistics
 */
export function getRateLimitStats() {
  const blockedIPs = getBlockedIPs(globalRateLimitStore);
  const totalKeys = Object.keys(globalRateLimitStore).length;

  return {
    totalKeys,
    blockedIPs,
    blockedIPCount: blockedIPs.length,
    storeSize: JSON.stringify(globalRateLimitStore).length,
  };
}

/**
 * Reset rate limit store (for testing)
 */
export function resetRateLimitStore() {
  globalRateLimitStore = createRateLimitStore();
}

/**
 * Get global rate limit store (for testing)
 */
export function getGlobalRateLimitStore(): RateLimitStore {
  return globalRateLimitStore;
}

