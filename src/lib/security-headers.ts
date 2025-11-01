/**
 * Security Headers Implementation
 * Implements OWASP security headers to prevent common web vulnerabilities
 */

export interface SecurityHeadersConfig {
  id: string;
  enabled: boolean;
  contentSecurityPolicy: string;
  xFrameOptions: 'DENY' | 'SAMEORIGIN' | 'ALLOW-FROM';
  xContentTypeOptions: 'nosniff';
  xXSSProtection: string;
  referrerPolicy: 'no-referrer' | 'no-referrer-when-downgrade' | 'same-origin' | 'origin' | 'strict-origin' | 'origin-when-cross-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url';
  permissionsPolicy: string;
  strictTransportSecurity: string;
  crossOriginEmbedderPolicy: string;
  crossOriginOpenerPolicy: string;
  crossOriginResourcePolicy: 'same-site' | 'same-origin' | 'cross-origin';
  createdAt: number;
  updatedAt: number;
}

export interface SecurityHeadersReport {
  timestamp: number;
  headers: Record<string, string>;
  missingHeaders: string[];
  securityScore: number;
  recommendations: string[];
}

/**
 * Initialize security headers configuration
 */
export function initializeSecurityHeadersConfig(): SecurityHeadersConfig {
  return {
    id: `headers_${Date.now()}`,
    enabled: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
    xFrameOptions: 'DENY',
    xContentTypeOptions: 'nosniff',
    xXSSProtection: '1; mode=block',
    referrerPolicy: 'strict-origin-when-cross-origin',
    permissionsPolicy: 'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()',
    strictTransportSecurity: 'max-age=31536000; includeSubDomains; preload',
    crossOriginEmbedderPolicy: 'require-corp',
    crossOriginOpenerPolicy: 'same-origin',
    crossOriginResourcePolicy: 'same-origin',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

/**
 * Generate security headers object
 */
export function generateSecurityHeaders(config: SecurityHeadersConfig): Record<string, string> {
  if (!config.enabled) {
    return {};
  }

  return {
    'Content-Security-Policy': config.contentSecurityPolicy,
    'X-Frame-Options': config.xFrameOptions,
    'X-Content-Type-Options': config.xContentTypeOptions,
    'X-XSS-Protection': config.xXSSProtection,
    'Referrer-Policy': config.referrerPolicy,
    'Permissions-Policy': config.permissionsPolicy,
    'Strict-Transport-Security': config.strictTransportSecurity,
    'Cross-Origin-Embedder-Policy': config.crossOriginEmbedderPolicy,
    'Cross-Origin-Opener-Policy': config.crossOriginOpenerPolicy,
    'Cross-Origin-Resource-Policy': config.crossOriginResourcePolicy,
  };
}

/**
 * Create custom CSP for specific needs
 */
export function createCustomCSP(options: {
  defaultSrc?: string[];
  scriptSrc?: string[];
  styleSrc?: string[];
  imgSrc?: string[];
  fontSrc?: string[];
  connectSrc?: string[];
  frameSrc?: string[];
  mediaSrc?: string[];
  objectSrc?: string[];
  childSrc?: string[];
  formAction?: string[];
  frameAncestors?: string[];
  baseUri?: string[];
  sandbox?: string[];
}): string {
  const directives: Record<string, string> = {};

  if (options.defaultSrc) {
    directives['default-src'] = options.defaultSrc.join(' ');
  }
  if (options.scriptSrc) {
    directives['script-src'] = options.scriptSrc.join(' ');
  }
  if (options.styleSrc) {
    directives['style-src'] = options.styleSrc.join(' ');
  }
  if (options.imgSrc) {
    directives['img-src'] = options.imgSrc.join(' ');
  }
  if (options.fontSrc) {
    directives['font-src'] = options.fontSrc.join(' ');
  }
  if (options.connectSrc) {
    directives['connect-src'] = options.connectSrc.join(' ');
  }
  if (options.frameSrc) {
    directives['frame-src'] = options.frameSrc.join(' ');
  }
  if (options.mediaSrc) {
    directives['media-src'] = options.mediaSrc.join(' ');
  }
  if (options.objectSrc) {
    directives['object-src'] = options.objectSrc.join(' ');
  }
  if (options.childSrc) {
    directives['child-src'] = options.childSrc.join(' ');
  }
  if (options.formAction) {
    directives['form-action'] = options.formAction.join(' ');
  }
  if (options.frameAncestors) {
    directives['frame-ancestors'] = options.frameAncestors.join(' ');
  }
  if (options.baseUri) {
    directives['base-uri'] = options.baseUri.join(' ');
  }
  if (options.sandbox) {
    directives['sandbox'] = options.sandbox.join(' ');
  }

  return Object.entries(directives)
    .map(([key, value]) => `${key} ${value}`)
    .join('; ');
}

/**
 * Create custom Permissions-Policy
 */
export function createCustomPermissionsPolicy(options: {
  geolocation?: string[];
  microphone?: string[];
  camera?: string[];
  payment?: string[];
  usb?: string[];
  magnetometer?: string[];
  gyroscope?: string[];
  accelerometer?: string[];
  ambientLightSensor?: string[];
  autoplay?: string[];
  encryptedMedia?: string[];
  fullscreen?: string[];
  picture_in_picture?: string[];
  vr?: string[];
  xr?: string[];
}): string {
  const directives: Record<string, string> = {};

  if (options.geolocation) {
    directives['geolocation'] = `(${options.geolocation.join(' ')})`;
  }
  if (options.microphone) {
    directives['microphone'] = `(${options.microphone.join(' ')})`;
  }
  if (options.camera) {
    directives['camera'] = `(${options.camera.join(' ')})`;
  }
  if (options.payment) {
    directives['payment'] = `(${options.payment.join(' ')})`;
  }
  if (options.usb) {
    directives['usb'] = `(${options.usb.join(' ')})`;
  }
  if (options.magnetometer) {
    directives['magnetometer'] = `(${options.magnetometer.join(' ')})`;
  }
  if (options.gyroscope) {
    directives['gyroscope'] = `(${options.gyroscope.join(' ')})`;
  }
  if (options.accelerometer) {
    directives['accelerometer'] = `(${options.accelerometer.join(' ')})`;
  }

  return Object.entries(directives)
    .map(([key, value]) => `${key}=${value}`)
    .join(', ');
}

/**
 * Validate security headers
 */
export function validateSecurityHeaders(headers: Record<string, string>): {
  valid: boolean;
  missingHeaders: string[];
  issues: string[];
} {
  const requiredHeaders = [
    'Content-Security-Policy',
    'X-Frame-Options',
    'X-Content-Type-Options',
    'X-XSS-Protection',
    'Referrer-Policy',
    'Strict-Transport-Security',
  ];

  const missingHeaders = requiredHeaders.filter((header) => !headers[header]);
  const issues: string[] = [];

  if (headers['X-Frame-Options'] === 'ALLOW-FROM') {
    issues.push('X-Frame-Options: ALLOW-FROM is deprecated, use CSP frame-ancestors instead');
  }

  if (headers['Content-Security-Policy']?.includes("'unsafe-inline'")) {
    issues.push('CSP: unsafe-inline in script-src reduces security');
  }

  if (headers['Content-Security-Policy']?.includes("'unsafe-eval'")) {
    issues.push('CSP: unsafe-eval in script-src reduces security');
  }

  return {
    valid: missingHeaders.length === 0 && issues.length === 0,
    missingHeaders,
    issues,
  };
}

/**
 * Generate security headers report
 */
export function generateSecurityHeadersReport(config: SecurityHeadersConfig): SecurityHeadersReport {
  const headers = generateSecurityHeaders(config);
  const validation = validateSecurityHeaders(headers);

  let securityScore = 100;
  securityScore -= validation.missingHeaders.length * 15;
  securityScore -= validation.issues.length * 10;

  const recommendations: string[] = [];

  if (validation.missingHeaders.length > 0) {
    recommendations.push(`Add missing headers: ${validation.missingHeaders.join(', ')}`);
  }

  if (validation.issues.length > 0) {
    recommendations.push(...validation.issues);
  }

  if (config.contentSecurityPolicy.includes("'unsafe-inline'")) {
    recommendations.push('Consider removing unsafe-inline from CSP for better security');
  }

  return {
    timestamp: Date.now(),
    headers,
    missingHeaders: validation.missingHeaders,
    securityScore: Math.max(0, securityScore),
    recommendations,
  };
}

/**
 * Check header compliance with OWASP recommendations
 */
export function checkOWASPCompliance(config: SecurityHeadersConfig): {
  compliant: boolean;
  score: number;
  issues: string[];
  recommendations: string[];
} {
  const issues: string[] = [];
  const recommendations: string[] = [];
  let score = 100;

  // Check CSP
  if (!config.contentSecurityPolicy) {
    issues.push('Content-Security-Policy not configured');
    score -= 20;
  } else if (config.contentSecurityPolicy.includes("'unsafe-inline'")) {
    recommendations.push('Remove unsafe-inline from CSP');
    score -= 10;
  }

  // Check X-Frame-Options
  if (config.xFrameOptions !== 'DENY' && config.xFrameOptions !== 'SAMEORIGIN') {
    issues.push('X-Frame-Options should be DENY or SAMEORIGIN');
    score -= 15;
  }

  // Check X-Content-Type-Options
  if (config.xContentTypeOptions !== 'nosniff') {
    issues.push('X-Content-Type-Options should be nosniff');
    score -= 15;
  }

  // Check HSTS
  if (!config.strictTransportSecurity) {
    issues.push('Strict-Transport-Security not configured');
    score -= 20;
  }

  // Check Referrer-Policy
  if (!config.referrerPolicy) {
    issues.push('Referrer-Policy not configured');
    score -= 10;
  }

  return {
    compliant: issues.length === 0,
    score: Math.max(0, score),
    issues,
    recommendations,
  };
}

