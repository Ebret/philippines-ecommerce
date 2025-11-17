/**
 * Security Configuration
 * 
 * Centralized security configuration for the Philippines E-Commerce Platform
 * Includes CSP, HSTS, secure cookies, and other security settings
 */

export interface SecurityConfig {
  csp: ContentSecurityPolicy;
  hsts: HSTSConfig;
  cookies: SecureCookieConfig;
  headers: SecurityHeaders;
}

export interface ContentSecurityPolicy {
  enabled: boolean;
  directives: Record<string, string>;
  reportUri?: string;
  reportOnly?: boolean;
}

export interface HSTSConfig {
  enabled: boolean;
  maxAge: number; // seconds
  includeSubDomains: boolean;
  preload: boolean;
}

export interface SecureCookieConfig {
  secure: boolean; // HTTPS only
  httpOnly: boolean; // Not accessible via JavaScript
  sameSite: 'Strict' | 'Lax' | 'None';
  maxAge?: number; // seconds
  domain?: string;
  path?: string;
}

export interface SecurityHeaders {
  'X-Content-Type-Options': string;
  'X-Frame-Options': string;
  'X-XSS-Protection': string;
  'Referrer-Policy': string;
  'Permissions-Policy': string;
  'Cross-Origin-Embedder-Policy': string;
  'Cross-Origin-Opener-Policy': string;
  'Cross-Origin-Resource-Policy': string;
}

/**
 * Default security configuration for production
 */
export const defaultSecurityConfig: SecurityConfig = {
  csp: {
    enabled: true,
    directives: {
      'default-src': "'self'",
      'script-src': "'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://cdn.tailwindcss.com",
      'style-src': "'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.tailwindcss.com",
      'img-src': "'self' data: https: blob:",
      'font-src': "'self' https://fonts.gstatic.com data:",
      'connect-src': "'self' https: wss:",
      'frame-ancestors': "'none'",
      'base-uri': "'self'",
      'form-action': "'self'",
      'upgrade-insecure-requests': '',
    },
    reportUri: '/api/security/csp-report',
    reportOnly: false,
  },
  hsts: {
    enabled: true,
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
  cookies: {
    secure: true, // HTTPS only
    httpOnly: true, // Not accessible via JavaScript
    sameSite: 'Lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  },
  headers: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'same-origin',
  },
};

/**
 * Development security configuration (more permissive)
 */
export const devSecurityConfig: SecurityConfig = {
  ...defaultSecurityConfig,
  csp: {
    ...defaultSecurityConfig.csp,
    reportOnly: true, // Report violations without blocking
  },
  hsts: {
    ...defaultSecurityConfig.hsts,
    enabled: false, // Disabled in development
  },
  cookies: {
    ...defaultSecurityConfig.cookies,
    secure: false, // Allow HTTP in development
  },
};

/**
 * Get security configuration based on environment
 */
export function getSecurityConfig(): SecurityConfig {
  return process.env.NODE_ENV === 'production'
    ? defaultSecurityConfig
    : devSecurityConfig;
}

/**
 * Generate CSP header value
 */
export function generateCSPHeader(csp: ContentSecurityPolicy): string {
  const directives = Object.entries(csp.directives)
    .map(([key, value]) => `${key} ${value}`.trim())
    .join('; ');

  return directives;
}

/**
 * Generate HSTS header value
 */
export function generateHSTSHeader(hsts: HSTSConfig): string {
  if (!hsts.enabled) return '';

  let header = `max-age=${hsts.maxAge}`;

  if (hsts.includeSubDomains) {
    header += '; includeSubDomains';
  }

  if (hsts.preload) {
    header += '; preload';
  }

  return header;
}

/**
 * Generate secure cookie options
 */
export function getSecureCookieOptions(
  overrides?: Partial<SecureCookieConfig>
): SecureCookieConfig {
  const config = getSecurityConfig();
  return {
    ...config.cookies,
    ...overrides,
  };
}

/**
 * Validate security configuration
 */
export function validateSecurityConfig(config: SecurityConfig): boolean {
  // Ensure CSP is properly configured
  if (config.csp.enabled && !config.csp.directives['default-src']) {
    console.warn('CSP: default-src directive is missing');
    return false;
  }

  // Ensure HSTS maxAge is reasonable
  if (config.hsts.enabled && config.hsts.maxAge < 10800) {
    console.warn('HSTS: maxAge should be at least 10800 seconds (3 hours)');
    return false;
  }

  return true;
}

