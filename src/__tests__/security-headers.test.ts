import { describe, it, expect } from 'vitest';
import {
  initializeSecurityHeadersConfig,
  generateSecurityHeaders,
  createCustomCSP,
  createCustomPermissionsPolicy,
  validateSecurityHeaders,
  generateSecurityHeadersReport,
  checkOWASPCompliance,
} from '../lib/security-headers';

describe('Security Headers', () => {
  describe('Security Headers Configuration', () => {
    it('should initialize security headers config', () => {
      const config = initializeSecurityHeadersConfig();

      expect(config).toBeDefined();
      expect(config.enabled).toBe(true);
      expect(config.xFrameOptions).toBe('DENY');
      expect(config.xContentTypeOptions).toBe('nosniff');
    });

    it('should generate security headers', () => {
      const config = initializeSecurityHeadersConfig();
      const headers = generateSecurityHeaders(config);

      expect(headers['Content-Security-Policy']).toBeDefined();
      expect(headers['X-Frame-Options']).toBe('DENY');
      expect(headers['X-Content-Type-Options']).toBe('nosniff');
      expect(headers['X-XSS-Protection']).toBe('1; mode=block');
      expect(headers['Referrer-Policy']).toBeDefined();
      expect(headers['Strict-Transport-Security']).toBeDefined();
    });

    it('should not generate headers when disabled', () => {
      const config = initializeSecurityHeadersConfig();
      config.enabled = false;

      const headers = generateSecurityHeaders(config);

      expect(Object.keys(headers)).toHaveLength(0);
    });
  });

  describe('Custom CSP', () => {
    it('should create custom CSP with default-src', () => {
      const csp = createCustomCSP({
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", 'https://cdn.example.com'],
      });

      expect(csp).toContain("default-src 'self'");
      expect(csp).toContain("script-src 'self' https://cdn.example.com");
    });

    it('should create custom CSP with all directives', () => {
      const csp = createCustomCSP({
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        imgSrc: ["'self'", 'data:'],
        fontSrc: ["'self'"],
        connectSrc: ["'self'"],
        frameAncestors: ["'none'"],
      });

      expect(csp).toContain('default-src');
      expect(csp).toContain('script-src');
      expect(csp).toContain('style-src');
      expect(csp).toContain('img-src');
      expect(csp).toContain('font-src');
      expect(csp).toContain('connect-src');
      expect(csp).toContain('frame-ancestors');
    });
  });

  describe('Custom Permissions Policy', () => {
    it('should create custom Permissions-Policy', () => {
      const policy = createCustomPermissionsPolicy({
        geolocation: [],
        microphone: [],
        camera: [],
      });

      expect(policy).toContain('geolocation=()');
      expect(policy).toContain('microphone=()');
      expect(policy).toContain('camera=()');
    });

    it('should create Permissions-Policy with allowed origins', () => {
      const policy = createCustomPermissionsPolicy({
        geolocation: ['self'],
        camera: ['self', 'https://example.com'],
      });

      expect(policy).toContain('geolocation=(self)');
      expect(policy).toContain('camera=(self https://example.com)');
    });
  });

  describe('Security Headers Validation', () => {
    it('should validate complete security headers', () => {
      const config = initializeSecurityHeadersConfig();
      // Remove unsafe-inline from CSP for validation test
      config.contentSecurityPolicy = "default-src 'self'; script-src 'self' https://cdn.jsdelivr.net; style-src 'self' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'";
      const headers = generateSecurityHeaders(config);

      const validation = validateSecurityHeaders(headers);

      expect(validation.valid).toBe(true);
      expect(validation.missingHeaders).toHaveLength(0);
    });

    it('should detect missing headers', () => {
      const headers = {
        'X-Frame-Options': 'DENY',
      };

      const validation = validateSecurityHeaders(headers);

      expect(validation.valid).toBe(false);
      expect(validation.missingHeaders.length).toBeGreaterThan(0);
    });

    it('should detect unsafe-inline in CSP', () => {
      const headers = {
        'Content-Security-Policy': "script-src 'self' 'unsafe-inline'",
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Strict-Transport-Security': 'max-age=31536000',
      };

      const validation = validateSecurityHeaders(headers);

      expect(validation.issues.length).toBeGreaterThan(0);
      expect(validation.issues[0]).toContain('unsafe-inline');
    });

    it('should detect unsafe-eval in CSP', () => {
      const headers = {
        'Content-Security-Policy': "script-src 'self' 'unsafe-eval'",
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Strict-Transport-Security': 'max-age=31536000',
      };

      const validation = validateSecurityHeaders(headers);

      expect(validation.issues.length).toBeGreaterThan(0);
      expect(validation.issues[0]).toContain('unsafe-eval');
    });
  });

  describe('Security Headers Report', () => {
    it('should generate security headers report', () => {
      const config = initializeSecurityHeadersConfig();
      const report = generateSecurityHeadersReport(config);

      expect(report.timestamp).toBeDefined();
      expect(report.headers).toBeDefined();
      expect(report.securityScore).toBeGreaterThan(0);
      expect(report.recommendations).toBeDefined();
    });

    it('should provide recommendations for missing headers', () => {
      const config = initializeSecurityHeadersConfig();
      config.contentSecurityPolicy = '';

      const report = generateSecurityHeadersReport(config);

      expect(report.recommendations.length).toBeGreaterThan(0);
    });
  });

  describe('OWASP Compliance', () => {
    it('should check OWASP compliance', () => {
      const config = initializeSecurityHeadersConfig();
      const compliance = checkOWASPCompliance(config);

      expect(compliance.compliant).toBe(true);
      expect(compliance.score).toBeGreaterThan(0);
      expect(compliance.issues).toHaveLength(0);
    });

    it('should detect non-compliant X-Frame-Options', () => {
      const config = initializeSecurityHeadersConfig();
      config.xFrameOptions = 'ALLOW-FROM';

      const compliance = checkOWASPCompliance(config);

      expect(compliance.compliant).toBe(false);
      expect(compliance.issues.length).toBeGreaterThan(0);
    });

    it('should detect missing HSTS', () => {
      const config = initializeSecurityHeadersConfig();
      config.strictTransportSecurity = '';

      const compliance = checkOWASPCompliance(config);

      expect(compliance.compliant).toBe(false);
      expect(compliance.issues).toContain('Strict-Transport-Security not configured');
    });

    it('should detect missing CSP', () => {
      const config = initializeSecurityHeadersConfig();
      config.contentSecurityPolicy = '';

      const compliance = checkOWASPCompliance(config);

      expect(compliance.compliant).toBe(false);
      expect(compliance.issues).toContain('Content-Security-Policy not configured');
    });

    it('should provide recommendations for unsafe-inline', () => {
      const config = initializeSecurityHeadersConfig();
      config.contentSecurityPolicy = "script-src 'self' 'unsafe-inline'";

      const compliance = checkOWASPCompliance(config);

      expect(compliance.recommendations.length).toBeGreaterThan(0);
    });
  });
});

