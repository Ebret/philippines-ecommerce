import { describe, it, expect, beforeEach } from 'vitest';
import {
  initializeCSRFConfig,
  initializeCORSConfig,
  generateCSRFToken,
  verifyCSRFToken,
  markCSRFTokenAsUsed,
  validateCORSOrigin,
  generateCORSHeaders,
  validateCORSMethod,
  validateCORSHeaders,
  generateCSRFCookieHeader,
  validateSameSitePolicy,
  validateReferer,
  generateCSRFProtectionReport,
  createCSRFTokenStore,
  storeCSRFToken,
  retrieveCSRFToken,
  cleanupExpiredCSRFTokens,
} from '../lib/csrf-protection';

describe('CSRF & CORS Protection', () => {
  describe('CSRF Configuration', () => {
    it('should initialize CSRF config', () => {
      const config = initializeCSRFConfig();

      expect(config).toBeDefined();
      expect(config.enabled).toBe(true);
      expect(config.tokenLength).toBe(32);
      expect(config.sameSite).toBe('Lax');
      expect(config.secure).toBe(true);
      expect(config.httpOnly).toBe(true);
    });

    it('should initialize CORS config', () => {
      const config = initializeCORSConfig(['http://localhost:3000']);

      expect(config).toBeDefined();
      expect(config.enabled).toBe(true);
      expect(config.allowedOrigins).toContain('http://localhost:3000');
      expect(config.credentials).toBe(true);
    });
  });

  describe('CSRF Token Generation & Verification', () => {
    it('should generate CSRF token', () => {
      const config = initializeCSRFConfig();
      const token = generateCSRFToken(config);

      expect(token).toBeDefined();
      expect(token.token).toBeDefined();
      expect(token.secret).toBeDefined();
      expect(token.used).toBe(false);
      expect(token.expiresAt).toBeGreaterThan(token.createdAt);
    });

    it('should verify valid CSRF token', () => {
      const config = initializeCSRFConfig();
      const token = generateCSRFToken(config);

      const result = verifyCSRFToken(token.token, token, config);

      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject invalid CSRF token', () => {
      const config = initializeCSRFConfig();
      const token = generateCSRFToken(config);

      const result = verifyCSRFToken('invalid_token', token, config);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('does not match');
    });

    it('should reject expired CSRF token', () => {
      const config = initializeCSRFConfig();
      config.tokenExpiry = 1; // 1ms expiry

      const token = generateCSRFToken(config);

      setTimeout(() => {
        const result = verifyCSRFToken(token.token, token, config);

        expect(result.valid).toBe(false);
        expect(result.error).toContain('expired');
      }, 10);
    });

    it('should reject used CSRF token', () => {
      const config = initializeCSRFConfig();
      const token = generateCSRFToken(config);
      const usedToken = markCSRFTokenAsUsed(token);

      const result = verifyCSRFToken(token.token, usedToken, config);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('already been used');
    });

    it('should mark token as used', () => {
      const config = initializeCSRFConfig();
      const token = generateCSRFToken(config);

      const usedToken = markCSRFTokenAsUsed(token);

      expect(usedToken.used).toBe(true);
    });
  });

  describe('CORS Origin Validation', () => {
    it('should validate allowed origin', () => {
      const config = initializeCORSConfig(['http://localhost:3000']);

      const result = validateCORSOrigin('http://localhost:3000', config);

      expect(result.allowed).toBe(true);
    });

    it('should reject disallowed origin', () => {
      const config = initializeCORSConfig(['http://localhost:3000']);

      const result = validateCORSOrigin('http://malicious.com', config);

      expect(result.allowed).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should allow wildcard origin', () => {
      const config = initializeCORSConfig(['*']);

      const result = validateCORSOrigin('http://any-origin.com', config);

      expect(result.allowed).toBe(true);
    });

    it('should handle wildcard patterns', () => {
      const config = initializeCORSConfig(['http://localhost:*']);

      const result = validateCORSOrigin('http://localhost:3000', config);

      expect(result.allowed).toBe(true);
    });
  });

  describe('CORS Headers', () => {
    it('should generate CORS headers', () => {
      const config = initializeCORSConfig(['http://localhost:3000']);

      const headers = generateCORSHeaders('http://localhost:3000', config);

      expect(headers['Access-Control-Allow-Origin']).toBe('http://localhost:3000');
      expect(headers['Access-Control-Allow-Methods']).toBeDefined();
      expect(headers['Access-Control-Allow-Headers']).toBeDefined();
      expect(headers['Access-Control-Allow-Credentials']).toBe('true');
    });

    it('should not generate headers for disallowed origin', () => {
      const config = initializeCORSConfig(['http://localhost:3000']);

      const headers = generateCORSHeaders('http://malicious.com', config);

      expect(Object.keys(headers)).toHaveLength(0);
    });

    it('should validate CORS method', () => {
      const config = initializeCORSConfig();

      expect(validateCORSMethod('GET', config)).toBe(true);
      expect(validateCORSMethod('POST', config)).toBe(true);
      expect(validateCORSMethod('DELETE', config)).toBe(true);
      expect(validateCORSMethod('INVALID', config)).toBe(false);
    });

    it('should validate CORS headers', () => {
      const config = initializeCORSConfig();

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer token',
      };

      const valid = validateCORSHeaders(headers, config);

      expect(valid).toBe(true);
    });
  });

  describe('CSRF Cookie Header', () => {
    it('should generate CSRF cookie header', () => {
      const config = initializeCSRFConfig();
      const token = generateCSRFToken(config);

      const header = generateCSRFCookieHeader(token, config);

      expect(header).toContain(`${config.cookieName}=${token.token}`);
      expect(header).toContain('Secure');
      expect(header).toContain('HttpOnly');
      expect(header).toContain('SameSite=Lax');
    });
  });

  describe('Same-Site Policy', () => {
    it('should allow same-site with Strict', () => {
      const valid = validateSameSitePolicy(
        'http://localhost:3000',
        'http://localhost:3000',
        'Strict'
      );

      expect(valid).toBe(true);
    });

    it('should reject cross-site with Strict', () => {
      const valid = validateSameSitePolicy(
        'http://malicious.com',
        'http://localhost:3000',
        'Strict'
      );

      expect(valid).toBe(false);
    });

    it('should allow all with None', () => {
      const valid = validateSameSitePolicy(
        'http://malicious.com',
        'http://localhost:3000',
        'None'
      );

      expect(valid).toBe(true);
    });
  });

  describe('Referer Validation', () => {
    it('should validate correct referer', () => {
      const valid = validateReferer(
        'http://localhost:3000/page',
        'http://localhost:3000'
      );

      expect(valid).toBe(true);
    });

    it('should reject missing referer', () => {
      const valid = validateReferer(undefined, 'http://localhost:3000');

      expect(valid).toBe(false);
    });

    it('should reject mismatched referer', () => {
      const valid = validateReferer(
        'http://malicious.com/page',
        'http://localhost:3000'
      );

      expect(valid).toBe(false);
    });
  });

  describe('CSRF Token Store', () => {
    it('should create CSRF token store', () => {
      const store = createCSRFTokenStore();

      expect(store).toBeDefined();
      expect(store.size).toBe(0);
    });

    it('should store and retrieve CSRF token', () => {
      const config = initializeCSRFConfig();
      const store = createCSRFTokenStore();
      const token = generateCSRFToken(config);

      storeCSRFToken(store, 'session123', token);

      const retrieved = retrieveCSRFToken(store, 'session123');

      expect(retrieved).toEqual(token);
    });

    it('should cleanup expired tokens', () => {
      const config = initializeCSRFConfig();
      config.tokenExpiry = 1; // 1ms expiry

      const store = createCSRFTokenStore();
      const token = generateCSRFToken(config);

      storeCSRFToken(store, 'session123', token);

      setTimeout(() => {
        const cleaned = cleanupExpiredCSRFTokens(store);

        expect(cleaned).toBeGreaterThan(0);
        expect(store.size).toBe(0);
      }, 10);
    });
  });

  describe('CSRF Protection Report', () => {
    it('should generate CSRF protection report', () => {
      const csrfConfig = initializeCSRFConfig();
      const corsConfig = initializeCORSConfig();

      const report = generateCSRFProtectionReport(csrfConfig, corsConfig);

      expect(report.timestamp).toBeDefined();
      expect(report.csrfConfig).toBeDefined();
      expect(report.corsConfig).toBeDefined();
      expect(report.securityScore).toBeGreaterThan(0);
      expect(report.recommendations).toBeDefined();
    });

    it('should provide recommendations for disabled CSRF', () => {
      const csrfConfig = initializeCSRFConfig();
      csrfConfig.enabled = false;

      const corsConfig = initializeCORSConfig();

      const report = generateCSRFProtectionReport(csrfConfig, corsConfig);

      expect(report.recommendations).toContain('Enable CSRF protection');
    });

    it('should provide recommendations for wildcard CORS', () => {
      const csrfConfig = initializeCSRFConfig();
      const corsConfig = initializeCORSConfig(['*']);

      const report = generateCSRFProtectionReport(csrfConfig, corsConfig);

      expect(report.recommendations.length).toBeGreaterThan(0);
    });
  });
});

