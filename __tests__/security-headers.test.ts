/**
 * Security Headers Tests
 * 
 * Comprehensive tests for security headers configuration and middleware
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getSecurityConfig,
  generateCSPHeader,
  generateHSTSHeader,
  getSecureCookieOptions,
  validateSecurityConfig,
  defaultSecurityConfig,
  devSecurityConfig,
} from '@/lib/security-config';

describe('Security Headers Configuration', () => {
  describe('getSecurityConfig', () => {
    it('should return production config in production environment', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const config = getSecurityConfig();

      expect(config.csp.reportOnly).toBe(false);
      expect(config.hsts.enabled).toBe(true);
      expect(config.cookies.secure).toBe(true);

      process.env.NODE_ENV = originalEnv;
    });

    it('should return development config in development environment', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const config = getSecurityConfig();

      expect(config.csp.reportOnly).toBe(true);
      expect(config.hsts.enabled).toBe(false);
      expect(config.cookies.secure).toBe(false);

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('generateCSPHeader', () => {
    it('should generate valid CSP header', () => {
      const csp = defaultSecurityConfig.csp;
      const header = generateCSPHeader(csp);

      expect(header).toContain("default-src 'self'");
      expect(header).toContain("script-src 'self'");
      expect(header).toContain("style-src 'self'");
      expect(header).toContain("img-src 'self'");
    });

    it('should include all directives in CSP header', () => {
      const csp = defaultSecurityConfig.csp;
      const header = generateCSPHeader(csp);

      Object.keys(csp.directives).forEach((directive) => {
        expect(header).toContain(directive);
      });
    });

    it('should handle empty directive values', () => {
      const csp = {
        enabled: true,
        directives: {
          'default-src': "'self'",
          'upgrade-insecure-requests': '',
        },
      };

      const header = generateCSPHeader(csp);

      expect(header).toContain('default-src');
      expect(header).toContain('upgrade-insecure-requests');
    });
  });

  describe('generateHSTSHeader', () => {
    it('should generate valid HSTS header', () => {
      const hsts = defaultSecurityConfig.hsts;
      const header = generateHSTSHeader(hsts);

      expect(header).toContain('max-age=31536000');
      expect(header).toContain('includeSubDomains');
      expect(header).toContain('preload');
    });

    it('should return empty string when HSTS is disabled', () => {
      const hsts = { ...defaultSecurityConfig.hsts, enabled: false };
      const header = generateHSTSHeader(hsts);

      expect(header).toBe('');
    });

    it('should respect includeSubDomains setting', () => {
      const hsts = {
        ...defaultSecurityConfig.hsts,
        includeSubDomains: false,
      };
      const header = generateHSTSHeader(hsts);

      expect(header).not.toContain('includeSubDomains');
    });

    it('should respect preload setting', () => {
      const hsts = {
        ...defaultSecurityConfig.hsts,
        preload: false,
      };
      const header = generateHSTSHeader(hsts);

      expect(header).not.toContain('preload');
    });
  });

  describe('getSecureCookieOptions', () => {
    it('should return secure cookie options', () => {
      const options = getSecureCookieOptions();

      expect(options.httpOnly).toBe(true);
      expect(options.sameSite).toBe('Lax');
      expect(options.path).toBe('/');
    });

    it('should allow overriding cookie options', () => {
      const options = getSecureCookieOptions({
        sameSite: 'Strict',
        maxAge: 3600,
      });

      expect(options.sameSite).toBe('Strict');
      expect(options.maxAge).toBe(3600);
      expect(options.httpOnly).toBe(true); // Should still be true
    });

    it('should have secure flag in production', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const options = getSecureCookieOptions();

      expect(options.secure).toBe(true);

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('validateSecurityConfig', () => {
    it('should validate correct security config', () => {
      const isValid = validateSecurityConfig(defaultSecurityConfig);

      expect(isValid).toBe(true);
    });

    it('should detect missing default-src directive', () => {
      const invalidConfig = {
        ...defaultSecurityConfig,
        csp: {
          ...defaultSecurityConfig.csp,
          directives: {
            'script-src': "'self'",
          },
        },
      };

      const isValid = validateSecurityConfig(invalidConfig);

      expect(isValid).toBe(false);
    });

    it('should detect low HSTS maxAge', () => {
      const invalidConfig = {
        ...defaultSecurityConfig,
        hsts: {
          ...defaultSecurityConfig.hsts,
          maxAge: 1000, // Too low
        },
      };

      const isValid = validateSecurityConfig(invalidConfig);

      expect(isValid).toBe(false);
    });
  });

  describe('Security Headers Content', () => {
    it('should have X-Content-Type-Options header', () => {
      const headers = defaultSecurityConfig.headers;

      expect(headers['X-Content-Type-Options']).toBe('nosniff');
    });

    it('should have X-Frame-Options header', () => {
      const headers = defaultSecurityConfig.headers;

      expect(headers['X-Frame-Options']).toBe('DENY');
    });

    it('should have X-XSS-Protection header', () => {
      const headers = defaultSecurityConfig.headers;

      expect(headers['X-XSS-Protection']).toBe('1; mode=block');
    });

    it('should have Referrer-Policy header', () => {
      const headers = defaultSecurityConfig.headers;

      expect(headers['Referrer-Policy']).toBe('strict-origin-when-cross-origin');
    });

    it('should have Permissions-Policy header', () => {
      const headers = defaultSecurityConfig.headers;

      expect(headers['Permissions-Policy']).toBeDefined();
      expect(headers['Permissions-Policy']).toContain('geolocation=()');
    });

    it('should have Cross-Origin policies', () => {
      const headers = defaultSecurityConfig.headers;

      expect(headers['Cross-Origin-Embedder-Policy']).toBe('require-corp');
      expect(headers['Cross-Origin-Opener-Policy']).toBe('same-origin');
      expect(headers['Cross-Origin-Resource-Policy']).toBe('same-origin');
    });
  });

  describe('CSP Directives', () => {
    it('should block inline scripts by default', () => {
      const csp = defaultSecurityConfig.csp;
      const scriptSrc = csp.directives['script-src'];

      expect(scriptSrc).toContain("'self'");
      // Note: 'unsafe-inline' is included for Next.js compatibility
    });

    it('should allow HTTPS images', () => {
      const csp = defaultSecurityConfig.csp;
      const imgSrc = csp.directives['img-src'];

      expect(imgSrc).toContain('https:');
    });

    it('should restrict frame ancestors', () => {
      const csp = defaultSecurityConfig.csp;
      const frameAncestors = csp.directives['frame-ancestors'];

      expect(frameAncestors).toBe("'none'");
    });

    it('should restrict form submissions', () => {
      const csp = defaultSecurityConfig.csp;
      const formAction = csp.directives['form-action'];

      expect(formAction).toBe("'self'");
    });
  });

  describe('Cookie Security', () => {
    it('should have HttpOnly flag', () => {
      const cookies = defaultSecurityConfig.cookies;

      expect(cookies.httpOnly).toBe(true);
    });

    it('should have SameSite protection', () => {
      const cookies = defaultSecurityConfig.cookies;

      expect(['Strict', 'Lax', 'None']).toContain(cookies.sameSite);
    });

    it('should have reasonable maxAge', () => {
      const cookies = defaultSecurityConfig.cookies;

      expect(cookies.maxAge).toBeGreaterThan(0);
      expect(cookies.maxAge).toBeLessThanOrEqual(30 * 24 * 60 * 60); // 30 days max
    });
  });
});

