/**
 * Security Headers Middleware
 * 
 * Applies security headers to all HTTP responses
 * Includes CSP, HSTS, X-Frame-Options, and other security headers
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  getSecurityConfig,
  generateCSPHeader,
  generateHSTSHeader,
  validateSecurityConfig,
} from '@/lib/security-config';

/**
 * Apply security headers to response
 */
export function applySecurityHeaders(response: NextResponse): NextResponse {
  const config = getSecurityConfig();

  // Validate configuration
  if (!validateSecurityConfig(config)) {
    console.warn('Security configuration validation failed');
  }

  // Content Security Policy
  if (config.csp.enabled) {
    const cspHeader = generateCSPHeader(config.csp);
    const headerName = config.csp.reportOnly
      ? 'Content-Security-Policy-Report-Only'
      : 'Content-Security-Policy';

    response.headers.set(headerName, cspHeader);

    if (config.csp.reportUri) {
      response.headers.set('Content-Security-Policy-Report-Uri', config.csp.reportUri);
    }
  }

  // HTTP Strict Transport Security
  if (config.hsts.enabled) {
    const hstsHeader = generateHSTSHeader(config.hsts);
    response.headers.set('Strict-Transport-Security', hstsHeader);
  }

  // Security headers
  Object.entries(config.headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Additional security headers
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none');
  response.headers.set('X-Mobile-Web-App-Capable', 'yes');
  response.headers.set('X-Apple-Mobile-Web-App-Capable', 'yes');
  response.headers.set('X-Apple-Mobile-Web-App-Status-Bar-Style', 'black-translucent');

  return response;
}

/**
 * Security headers middleware for Next.js
 */
export function securityHeadersMiddleware(request: NextRequest) {
  // Skip security headers for static assets
  if (
    request.nextUrl.pathname.startsWith('/_next/') ||
    request.nextUrl.pathname.startsWith('/public/') ||
    request.nextUrl.pathname.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)
  ) {
    return NextResponse.next();
  }

  // Create response
  let response = NextResponse.next();

  // Apply security headers
  response = applySecurityHeaders(response);

  return response;
}

/**
 * Get security headers for API responses
 */
export function getSecurityHeadersForAPI(): Record<string, string> {
  const config = getSecurityConfig();
  const headers: Record<string, string> = {};

  // Add all security headers
  Object.entries(config.headers).forEach(([key, value]) => {
    headers[key] = value;
  });

  // Add CSP for API
  if (config.csp.enabled) {
    const cspHeader = generateCSPHeader(config.csp);
    const headerName = config.csp.reportOnly
      ? 'Content-Security-Policy-Report-Only'
      : 'Content-Security-Policy';
    headers[headerName] = cspHeader;
  }

  // Add HSTS for API
  if (config.hsts.enabled) {
    const hstsHeader = generateHSTSHeader(config.hsts);
    headers['Strict-Transport-Security'] = hstsHeader;
  }

  return headers;
}

/**
 * Apply security headers to API response
 */
export function withSecurityHeaders(response: Response): Response {
  const headers = getSecurityHeadersForAPI();

  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

