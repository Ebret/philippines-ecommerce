/**
 * API Security
 * Handles API authentication, authorization, rate limiting, and security monitoring
 */

import crypto from 'crypto';

export interface APIKey {
  id: string;
  key: string;
  name: string;
  userId: string;
  permissions: string[];
  createdAt: number;
  expiresAt?: number;
  lastUsedAt?: number;
  active: boolean;
  rotatedAt?: number;
}

export interface JWTToken {
  id: string;
  token: string;
  userId: string;
  expiresAt: number;
  createdAt: number;
  refreshToken?: string;
  scope: string[];
  active: boolean;
}

export interface APIEndpoint {
  id: string;
  path: string;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';
  version: string;
  deprecated: boolean;
  deprecatedAt?: number;
  replacedBy?: string;
  requiredPermissions: string[];
  rateLimit: number; // requests per minute
  requiresAuth: boolean;
}

export interface RateLimitEntry {
  id: string;
  apiKeyId: string;
  endpoint: string;
  requestCount: number;
  windowStart: number;
  windowEnd: number;
  limited: boolean;
}

export interface APIAccessLog {
  id: string;
  timestamp: number;
  apiKeyId?: string;
  userId?: string;
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime: number;
  ipAddress: string;
  userAgent?: string;
  success: boolean;
}

export interface APISecurityEvent {
  id: string;
  timestamp: number;
  eventType: 'unauthorized' | 'forbidden' | 'rate_limit' | 'invalid_token' | 'suspicious_activity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  apiKeyId?: string;
  endpoint: string;
  details: Record<string, unknown>;
  resolved: boolean;
}

export interface CORSConfig {
  id: string;
  allowedOrigins: string[];
  allowedMethods: string[];
  allowedHeaders: string[];
  exposedHeaders: string[];
  maxAge: number;
  allowCredentials: boolean;
  enabled: boolean;
}

export interface APISecurityHeaders {
  'X-API-Version': string;
  'X-RateLimit-Limit': number;
  'X-RateLimit-Remaining': number;
  'X-RateLimit-Reset': number;
  'X-Content-Type-Options': string;
  'X-Frame-Options': string;
}

/**
 * Generate API key
 */
export function generateAPIKey(
  userId: string,
  name: string,
  permissions: string[] = [],
  expiresInDays?: number
): APIKey {
  const key = `sk_${crypto.randomBytes(32).toString('hex')}`;
  const now = Date.now();
  const expiresAt = expiresInDays ? now + expiresInDays * 24 * 60 * 60 * 1000 : undefined;

  return {
    id: `key_${crypto.randomBytes(8).toString('hex')}`,
    key,
    name,
    userId,
    permissions,
    createdAt: now,
    expiresAt,
    active: true,
  };
}

/**
 * Validate API key
 */
export function validateAPIKey(apiKey: APIKey): boolean {
  if (!apiKey.active) return false;
  if (apiKey.expiresAt && apiKey.expiresAt < Date.now()) return false;
  if (!apiKey.key || apiKey.key.length === 0) return false;
  return true;
}

/**
 * Rotate API key
 */
export function rotateAPIKey(apiKey: APIKey): APIKey {
  const newKey = `sk_${crypto.randomBytes(32).toString('hex')}`;
  return {
    ...apiKey,
    key: newKey,
    rotatedAt: Date.now(),
  };
}

/**
 * Create JWT token
 */
export function createJWTToken(
  userId: string,
  scope: string[] = [],
  expiresInMinutes: number = 60
): JWTToken {
  const now = Date.now();
  const expiresAt = now + expiresInMinutes * 60 * 1000;
  const token = crypto.randomBytes(32).toString('hex');
  const refreshToken = crypto.randomBytes(32).toString('hex');

  return {
    id: `jwt_${crypto.randomBytes(8).toString('hex')}`,
    token,
    userId,
    expiresAt,
    createdAt: now,
    refreshToken,
    scope,
    active: true,
  };
}

/**
 * Validate JWT token
 */
export function validateJWTToken(token: JWTToken): boolean {
  if (!token.active) return false;
  if (token.expiresAt < Date.now()) return false;
  if (!token.token || token.token.length === 0) return false;
  return true;
}

/**
 * Check API permission
 */
export function checkAPIPermission(
  apiKey: APIKey,
  requiredPermissions: string[]
): boolean {
  if (!validateAPIKey(apiKey)) return false;
  return requiredPermissions.every((perm) => apiKey.permissions.includes(perm));
}

/**
 * Create rate limit entry
 */
export function createRateLimitEntry(
  apiKeyId: string,
  endpoint: string,
  windowMinutes: number = 1
): RateLimitEntry {
  const now = Date.now();
  const windowStart = now;
  const windowEnd = now + windowMinutes * 60 * 1000;

  return {
    id: `rl_${crypto.randomBytes(8).toString('hex')}`,
    apiKeyId,
    endpoint,
    requestCount: 0,
    windowStart,
    windowEnd,
    limited: false,
  };
}

/**
 * Check rate limit
 */
export function checkRateLimit(
  entry: RateLimitEntry,
  limit: number
): boolean {
  if (Date.now() > entry.windowEnd) {
    return true; // Window expired, allow
  }
  return entry.requestCount < limit;
}

/**
 * Increment rate limit counter
 */
export function incrementRateLimitCounter(entry: RateLimitEntry): void {
  entry.requestCount++;
  if (entry.requestCount >= 100) {
    entry.limited = true;
  }
}

/**
 * Create API access log
 */
export function createAPIAccessLog(
  endpoint: string,
  method: string,
  statusCode: number,
  responseTime: number,
  ipAddress: string,
  success: boolean,
  apiKeyId?: string,
  userId?: string,
  userAgent?: string
): APIAccessLog {
  return {
    id: `log_${crypto.randomBytes(8).toString('hex')}`,
    timestamp: Date.now(),
    apiKeyId,
    userId,
    endpoint,
    method,
    statusCode,
    responseTime,
    ipAddress,
    userAgent,
    success,
  };
}

/**
 * Create API security event
 */
export function createAPISecurityEvent(
  eventType: APISecurityEvent['eventType'],
  severity: APISecurityEvent['severity'],
  endpoint: string,
  details: Record<string, unknown>,
  apiKeyId?: string
): APISecurityEvent {
  return {
    id: `evt_${crypto.randomBytes(8).toString('hex')}`,
    timestamp: Date.now(),
    eventType,
    severity,
    apiKeyId,
    endpoint,
    details,
    resolved: false,
  };
}

/**
 * Create CORS configuration
 */
export function createCORSConfig(
  allowedOrigins: string[] = ['http://localhost:3000'],
  allowedMethods: string[] = ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: string[] = ['Content-Type', 'Authorization'],
  maxAge: number = 86400
): CORSConfig {
  return {
    id: `cors_${crypto.randomBytes(8).toString('hex')}`,
    allowedOrigins,
    allowedMethods,
    allowedHeaders,
    exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining'],
    maxAge,
    allowCredentials: true,
    enabled: true,
  };
}

/**
 * Validate CORS request
 */
export function validateCORSRequest(
  config: CORSConfig,
  origin: string,
  method: string
): boolean {
  if (!config.enabled) return false;
  if (!config.allowedOrigins.includes(origin) && !config.allowedOrigins.includes('*')) {
    return false;
  }
  if (!config.allowedMethods.includes(method)) return false;
  return true;
}

/**
 * Generate API security headers
 */
export function generateAPISecurityHeaders(
  version: string,
  rateLimit: number,
  remaining: number,
  resetTime: number
): APISecurityHeaders {
  return {
    'X-API-Version': version,
    'X-RateLimit-Limit': rateLimit,
    'X-RateLimit-Remaining': remaining,
    'X-RateLimit-Reset': resetTime,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  };
}

/**
 * Get API access logs by endpoint
 */
export function getAccessLogsByEndpoint(
  logs: APIAccessLog[],
  endpoint: string
): APIAccessLog[] {
  return logs.filter((log) => log.endpoint === endpoint);
}

/**
 * Get API access logs by status code
 */
export function getAccessLogsByStatusCode(
  logs: APIAccessLog[],
  statusCode: number
): APIAccessLog[] {
  return logs.filter((log) => log.statusCode === statusCode);
}

/**
 * Get failed API requests
 */
export function getFailedAPIRequests(logs: APIAccessLog[]): APIAccessLog[] {
  return logs.filter((log) => !log.success);
}

/**
 * Get security events by severity
 */
export function getSecurityEventsBySeverity(
  events: APISecurityEvent[],
  severity: APISecurityEvent['severity']
): APISecurityEvent[] {
  return events.filter((e) => e.severity === severity);
}

/**
 * Get unresolved security events
 */
export function getUnresolvedSecurityEvents(events: APISecurityEvent[]): APISecurityEvent[] {
  return events.filter((e) => !e.resolved);
}

/**
 * Calculate API performance metrics
 */
export function calculateAPIPerformanceMetrics(logs: APIAccessLog[]): Record<string, unknown> {
  if (logs.length === 0) {
    return {
      totalRequests: 0,
      successRate: 0,
      averageResponseTime: 0,
      failedRequests: 0,
    };
  }

  const successCount = logs.filter((l) => l.success).length;
  const failedCount = logs.filter((l) => !l.success).length;
  const avgResponseTime = logs.reduce((sum, l) => sum + l.responseTime, 0) / logs.length;

  return {
    totalRequests: logs.length,
    successRate: (successCount / logs.length) * 100,
    averageResponseTime: avgResponseTime,
    failedRequests: failedCount,
    p95ResponseTime: calculatePercentile(logs.map((l) => l.responseTime), 95),
    p99ResponseTime: calculatePercentile(logs.map((l) => l.responseTime), 99),
  };
}

/**
 * Calculate percentile
 */
function calculatePercentile(values: number[], percentile: number): number {
  const sorted = values.sort((a, b) => a - b);
  const index = Math.ceil((percentile / 100) * sorted.length) - 1;
  return sorted[Math.max(0, index)];
}

/**
 * Generate API security report
 */
export function generateAPISecurityReport(
  accessLogs: APIAccessLog[],
  securityEvents: APISecurityEvent[]
): Record<string, unknown> {
  const failedRequests = getFailedAPIRequests(accessLogs);
  const unresolvedEvents = getUnresolvedSecurityEvents(securityEvents);
  const criticalEvents = getSecurityEventsBySeverity(securityEvents, 'critical');

  return {
    timestamp: Date.now(),
    totalRequests: accessLogs.length,
    failedRequests: failedRequests.length,
    failureRate: accessLogs.length > 0 ? (failedRequests.length / accessLogs.length) * 100 : 0,
    totalSecurityEvents: securityEvents.length,
    unresolvedEvents: unresolvedEvents.length,
    criticalEvents: criticalEvents.length,
    performanceMetrics: calculateAPIPerformanceMetrics(accessLogs),
    overallSecurityStatus: criticalEvents.length > 0 ? 'critical' : 'secure',
  };
}

