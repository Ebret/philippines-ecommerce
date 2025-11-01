/**
 * CSRF & CORS Protection
 * Prevents cross-site request forgery and cross-origin attacks
 */

import crypto from 'crypto';

export interface CSRFToken {
  token: string;
  secret: string;
  createdAt: number;
  expiresAt: number;
  used: boolean;
}

export interface CSRFConfig {
  id: string;
  enabled: boolean;
  tokenLength: number;
  tokenExpiry: number; // milliseconds
  headerName: string;
  parameterName: string;
  cookieName: string;
  sameSite: 'Strict' | 'Lax' | 'None';
  secure: boolean;
  httpOnly: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface CORSConfig {
  id: string;
  enabled: boolean;
  allowedOrigins: string[];
  allowedMethods: string[];
  allowedHeaders: string[];
  exposedHeaders: string[];
  credentials: boolean;
  maxAge: number;
  preflightContinue: boolean;
  optionsSuccessStatus: number;
  createdAt: number;
  updatedAt: number;
}

export interface CSRFValidationResult {
  valid: boolean;
  error?: string;
  tokenAge?: number;
}

export interface CORSValidationResult {
  allowed: boolean;
  origin: string;
  error?: string;
}

/**
 * Initialize CSRF configuration
 */
export function initializeCSRFConfig(): CSRFConfig {
  return {
    id: `csrf_${Date.now()}`,
    enabled: true,
    tokenLength: 32,
    tokenExpiry: 60 * 60 * 1000, // 1 hour
    headerName: 'X-CSRF-Token',
    parameterName: '_csrf',
    cookieName: '__csrf',
    sameSite: 'Lax',
    secure: true,
    httpOnly: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

/**
 * Initialize CORS configuration
 */
export function initializeCORSConfig(allowedOrigins: string[] = ['http://localhost:3000']): CORSConfig {
  return {
    id: `cors_${Date.now()}`,
    enabled: true,
    allowedOrigins,
    allowedMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
    exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
    credentials: true,
    maxAge: 86400, // 24 hours
    preflightContinue: false,
    optionsSuccessStatus: 200,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

/**
 * Generate CSRF token
 */
export function generateCSRFToken(config: CSRFConfig): CSRFToken {
  const token = crypto.randomBytes(config.tokenLength).toString('hex');
  const secret = crypto.randomBytes(config.tokenLength).toString('hex');
  const now = Date.now();

  return {
    token,
    secret,
    createdAt: now,
    expiresAt: now + config.tokenExpiry,
    used: false,
  };
}

/**
 * Verify CSRF token
 */
export function verifyCSRFToken(
  token: string,
  storedToken: CSRFToken,
  config: CSRFConfig
): CSRFValidationResult {
  const now = Date.now();

  // Check if token has expired
  if (now > storedToken.expiresAt) {
    return {
      valid: false,
      error: 'CSRF token has expired',
      tokenAge: now - storedToken.createdAt,
    };
  }

  // Check if token has been used
  if (storedToken.used) {
    return {
      valid: false,
      error: 'CSRF token has already been used',
    };
  }

  // Verify token matches
  if (token !== storedToken.token) {
    return {
      valid: false,
      error: 'CSRF token does not match',
    };
  }

  return {
    valid: true,
    tokenAge: now - storedToken.createdAt,
  };
}

/**
 * Mark CSRF token as used
 */
export function markCSRFTokenAsUsed(token: CSRFToken): CSRFToken {
  return {
    ...token,
    used: true,
  };
}

/**
 * Validate CORS origin
 */
export function validateCORSOrigin(
  origin: string,
  config: CORSConfig
): CORSValidationResult {
  if (!config.enabled) {
    return {
      allowed: true,
      origin,
    };
  }

  // Check if origin is in allowed list
  const isAllowed = config.allowedOrigins.some((allowedOrigin) => {
    if (allowedOrigin === '*') {
      return true;
    }
    if (allowedOrigin.includes('*')) {
      // Handle wildcard patterns
      const pattern = allowedOrigin.replace(/\*/g, '.*');
      return new RegExp(`^${pattern}$`).test(origin);
    }
    return allowedOrigin === origin;
  });

  if (!isAllowed) {
    return {
      allowed: false,
      origin,
      error: `Origin ${origin} is not allowed`,
    };
  }

  return {
    allowed: true,
    origin,
  };
}

/**
 * Generate CORS headers
 */
export function generateCORSHeaders(
  origin: string,
  config: CORSConfig
): Record<string, string> {
  const validation = validateCORSOrigin(origin, config);

  if (!validation.allowed) {
    return {};
  }

  const headers: Record<string, string> = {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': config.allowedMethods.join(', '),
    'Access-Control-Allow-Headers': config.allowedHeaders.join(', '),
    'Access-Control-Expose-Headers': config.exposedHeaders.join(', '),
    'Access-Control-Max-Age': config.maxAge.toString(),
  };

  if (config.credentials) {
    headers['Access-Control-Allow-Credentials'] = 'true';
  }

  return headers;
}

/**
 * Validate HTTP method for CORS
 */
export function validateCORSMethod(
  method: string,
  config: CORSConfig
): boolean {
  return config.allowedMethods.includes(method.toUpperCase());
}

/**
 * Validate CORS headers
 */
export function validateCORSHeaders(
  headers: Record<string, string>,
  config: CORSConfig
): boolean {
  const requestHeaders = Object.keys(headers).map((h) => h.toLowerCase());

  return requestHeaders.every((header) =>
    config.allowedHeaders.map((h) => h.toLowerCase()).includes(header)
  );
}

/**
 * Generate CSRF cookie header
 */
export function generateCSRFCookieHeader(
  token: CSRFToken,
  config: CSRFConfig
): string {
  let header = `${config.cookieName}=${token.token}`;

  if (config.secure) {
    header += '; Secure';
  }

  if (config.httpOnly) {
    header += '; HttpOnly';
  }

  header += `; SameSite=${config.sameSite}`;
  header += '; Path=/';

  return header;
}

/**
 * Validate same-site cookie policy
 */
export function validateSameSitePolicy(
  origin: string,
  siteOrigin: string,
  sameSite: 'Strict' | 'Lax' | 'None'
): boolean {
  if (sameSite === 'None') {
    return true; // Allow all origins
  }

  const isSameSite = origin === siteOrigin;

  if (sameSite === 'Strict') {
    return isSameSite;
  }

  if (sameSite === 'Lax') {
    // Allow same-site and safe cross-site requests (GET, HEAD, OPTIONS)
    return isSameSite;
  }

  return false;
}

/**
 * Validate referer header
 */
export function validateReferer(
  referer: string | undefined,
  expectedOrigin: string
): boolean {
  if (!referer) {
    return false; // Referer header missing
  }

  try {
    const refererUrl = new URL(referer);
    const expectedUrl = new URL(expectedOrigin);

    return refererUrl.origin === expectedUrl.origin;
  } catch {
    return false; // Invalid referer URL
  }
}

/**
 * Generate CSRF protection report
 */
export function generateCSRFProtectionReport(
  config: CSRFConfig,
  corsConfig: CORSConfig
): {
  timestamp: number;
  csrfConfig: CSRFConfig;
  corsConfig: CORSConfig;
  securityScore: number;
  recommendations: string[];
} {
  const recommendations: string[] = [];
  let securityScore = 100;

  if (!config.enabled) {
    recommendations.push('Enable CSRF protection');
    securityScore -= 30;
  }

  if (!config.secure) {
    recommendations.push('Enable secure flag for CSRF cookies');
    securityScore -= 15;
  }

  if (!config.httpOnly) {
    recommendations.push('Enable httpOnly flag for CSRF cookies');
    securityScore -= 15;
  }

  if (config.sameSite === 'None') {
    recommendations.push('Consider using SameSite=Lax or Strict instead of None');
    securityScore -= 10;
  }

  if (!corsConfig.enabled) {
    recommendations.push('Enable CORS protection');
    securityScore -= 20;
  }

  if (corsConfig.allowedOrigins.includes('*')) {
    recommendations.push('Avoid using wildcard (*) for allowed origins');
    securityScore -= 20;
  }

  if (corsConfig.credentials && corsConfig.allowedOrigins.includes('*')) {
    recommendations.push('Cannot use credentials with wildcard origin');
    securityScore -= 30;
  }

  return {
    timestamp: Date.now(),
    csrfConfig: config,
    corsConfig,
    securityScore: Math.max(0, securityScore),
    recommendations,
  };
}

/**
 * Create CSRF token store
 */
export function createCSRFTokenStore(): Map<string, CSRFToken> {
  return new Map();
}

/**
 * Store CSRF token
 */
export function storeCSRFToken(
  store: Map<string, CSRFToken>,
  sessionId: string,
  token: CSRFToken
): void {
  store.set(sessionId, token);
}

/**
 * Retrieve CSRF token
 */
export function retrieveCSRFToken(
  store: Map<string, CSRFToken>,
  sessionId: string
): CSRFToken | undefined {
  return store.get(sessionId);
}

/**
 * Clean up expired CSRF tokens
 */
export function cleanupExpiredCSRFTokens(store: Map<string, CSRFToken>): number {
  const now = Date.now();
  let cleaned = 0;

  for (const [key, token] of store.entries()) {
    if (now > token.expiresAt) {
      store.delete(key);
      cleaned++;
    }
  }

  return cleaned;
}

