import { describe, it, expect, beforeEach } from 'vitest';
import {
  generateAPIKey,
  validateAPIKey,
  rotateAPIKey,
  createJWTToken,
  validateJWTToken,
  checkAPIPermission,
  createRateLimitEntry,
  checkRateLimit,
  incrementRateLimitCounter,
  createAPIAccessLog,
  createAPISecurityEvent,
  createCORSConfig,
  validateCORSRequest,
  generateAPISecurityHeaders,
  getAccessLogsByEndpoint,
  getAccessLogsByStatusCode,
  getFailedAPIRequests,
  getSecurityEventsBySeverity,
  getUnresolvedSecurityEvents,
  calculateAPIPerformanceMetrics,
  generateAPISecurityReport,
  APIKey,
  APIAccessLog,
  APISecurityEvent,
} from '../lib/api-security';

describe('API Security', () => {
  let apiKeys: APIKey[] = [];
  let accessLogs: APIAccessLog[] = [];
  let securityEvents: APISecurityEvent[] = [];

  beforeEach(() => {
    apiKeys = [];
    accessLogs = [];
    securityEvents = [];
  });

  describe('API Key Management', () => {
    it('should generate API key', () => {
      const key = generateAPIKey('user123', 'Test Key', ['read', 'write']);

      expect(key).toBeDefined();
      expect(key.userId).toBe('user123');
      expect(key.name).toBe('Test Key');
      expect(key.permissions).toContain('read');
      expect(key.active).toBe(true);
      expect(key.key).toMatch(/^sk_/);
    });

    it('should validate active API key', () => {
      const key = generateAPIKey('user123', 'Test Key');

      expect(validateAPIKey(key)).toBe(true);
    });

    it('should reject expired API key', () => {
      const key = generateAPIKey('user123', 'Test Key', [], -1);
      // Simulate expiration by setting expiresAt to past
      key.expiresAt = Date.now() - 1000;

      expect(validateAPIKey(key)).toBe(false);
    });

    it('should reject inactive API key', () => {
      const key = generateAPIKey('user123', 'Test Key');
      key.active = false;

      expect(validateAPIKey(key)).toBe(false);
    });

    it('should rotate API key', () => {
      const originalKey = generateAPIKey('user123', 'Test Key');
      const originalKeyValue = originalKey.key;

      const rotatedKey = rotateAPIKey(originalKey);

      expect(rotatedKey.key).not.toBe(originalKeyValue);
      expect(rotatedKey.rotatedAt).toBeDefined();
    });

    it('should check API permissions', () => {
      const key = generateAPIKey('user123', 'Test Key', ['read', 'write']);

      expect(checkAPIPermission(key, ['read'])).toBe(true);
      expect(checkAPIPermission(key, ['read', 'write'])).toBe(true);
      expect(checkAPIPermission(key, ['admin'])).toBe(false);
    });
  });

  describe('JWT Token Management', () => {
    it('should create JWT token', () => {
      const token = createJWTToken('user123', ['read', 'write']);

      expect(token).toBeDefined();
      expect(token.userId).toBe('user123');
      expect(token.scope).toContain('read');
      expect(token.active).toBe(true);
      expect(token.refreshToken).toBeDefined();
    });

    it('should validate active JWT token', () => {
      const token = createJWTToken('user123');

      expect(validateJWTToken(token)).toBe(true);
    });

    it('should reject expired JWT token', () => {
      const token = createJWTToken('user123', [], 0);
      token.expiresAt = Date.now() - 1000;

      expect(validateJWTToken(token)).toBe(false);
    });

    it('should reject inactive JWT token', () => {
      const token = createJWTToken('user123');
      token.active = false;

      expect(validateJWTToken(token)).toBe(false);
    });
  });

  describe('Rate Limiting', () => {
    it('should create rate limit entry', () => {
      const entry = createRateLimitEntry('key123', '/api/users');

      expect(entry).toBeDefined();
      expect(entry.apiKeyId).toBe('key123');
      expect(entry.endpoint).toBe('/api/users');
      expect(entry.requestCount).toBe(0);
      expect(entry.limited).toBe(false);
    });

    it('should check rate limit', () => {
      const entry = createRateLimitEntry('key123', '/api/users');

      expect(checkRateLimit(entry, 100)).toBe(true);
    });

    it('should increment rate limit counter', () => {
      const entry = createRateLimitEntry('key123', '/api/users');

      incrementRateLimitCounter(entry);
      expect(entry.requestCount).toBe(1);

      incrementRateLimitCounter(entry);
      expect(entry.requestCount).toBe(2);
    });

    it('should mark as limited when threshold exceeded', () => {
      const entry = createRateLimitEntry('key123', '/api/users');

      for (let i = 0; i < 100; i++) {
        incrementRateLimitCounter(entry);
      }

      expect(entry.limited).toBe(true);
    });
  });

  describe('API Access Logging', () => {
    it('should create API access log', () => {
      const log = createAPIAccessLog(
        '/api/users',
        'GET',
        200,
        150,
        '192.168.1.1',
        true,
        'key123',
        'user123'
      );

      expect(log).toBeDefined();
      expect(log.endpoint).toBe('/api/users');
      expect(log.statusCode).toBe(200);
      expect(log.success).toBe(true);
      accessLogs.push(log);
    });

    it('should get access logs by endpoint', () => {
      accessLogs.push(createAPIAccessLog('/api/users', 'GET', 200, 100, '192.168.1.1', true));
      accessLogs.push(createAPIAccessLog('/api/users', 'POST', 201, 200, '192.168.1.1', true));
      accessLogs.push(createAPIAccessLog('/api/products', 'GET', 200, 150, '192.168.1.1', true));

      const userLogs = getAccessLogsByEndpoint(accessLogs, '/api/users');

      expect(userLogs.length).toBeGreaterThan(0);
    });

    it('should get access logs by status code', () => {
      accessLogs.push(createAPIAccessLog('/api/users', 'GET', 200, 100, '192.168.1.1', true));
      accessLogs.push(createAPIAccessLog('/api/users', 'POST', 400, 50, '192.168.1.1', false));
      accessLogs.push(createAPIAccessLog('/api/products', 'GET', 500, 200, '192.168.1.1', false));

      const errorLogs = getAccessLogsByStatusCode(accessLogs, 500);

      expect(errorLogs.length).toBeGreaterThan(0);
    });

    it('should get failed API requests', () => {
      accessLogs.push(createAPIAccessLog('/api/users', 'GET', 200, 100, '192.168.1.1', true));
      accessLogs.push(createAPIAccessLog('/api/users', 'POST', 400, 50, '192.168.1.1', false));
      accessLogs.push(createAPIAccessLog('/api/products', 'GET', 500, 200, '192.168.1.1', false));

      const failedLogs = getFailedAPIRequests(accessLogs);

      expect(failedLogs.length).toBeGreaterThan(0);
      expect(failedLogs.every((l) => !l.success)).toBe(true);
    });
  });

  describe('API Security Events', () => {
    it('should create API security event', () => {
      const event = createAPISecurityEvent(
        'unauthorized',
        'high',
        '/api/admin',
        { reason: 'Invalid token' },
        'key123'
      );

      expect(event).toBeDefined();
      expect(event.eventType).toBe('unauthorized');
      expect(event.severity).toBe('high');
      securityEvents.push(event);
    });

    it('should get security events by severity', () => {
      securityEvents.push(createAPISecurityEvent('unauthorized', 'high', '/api/admin', {}));
      securityEvents.push(createAPISecurityEvent('rate_limit', 'medium', '/api/users', {}));
      securityEvents.push(createAPISecurityEvent('invalid_token', 'critical', '/api/auth', {}));

      const criticalEvents = getSecurityEventsBySeverity(securityEvents, 'critical');

      expect(criticalEvents.length).toBeGreaterThan(0);
      expect(criticalEvents.every((e) => e.severity === 'critical')).toBe(true);
    });

    it('should get unresolved security events', () => {
      const event1 = createAPISecurityEvent('unauthorized', 'high', '/api/admin', {});
      const event2 = createAPISecurityEvent('rate_limit', 'medium', '/api/users', {});

      securityEvents.push(event1, event2);
      event1.resolved = true;

      const unresolved = getUnresolvedSecurityEvents(securityEvents);

      expect(unresolved.length).toBeGreaterThan(0);
      expect(unresolved.every((e) => !e.resolved)).toBe(true);
    });
  });

  describe('CORS Configuration', () => {
    it('should create CORS config', () => {
      const config = createCORSConfig(
        ['http://localhost:3000', 'https://example.com'],
        ['GET', 'POST'],
        ['Content-Type']
      );

      expect(config).toBeDefined();
      expect(config.allowedOrigins).toContain('http://localhost:3000');
      expect(config.enabled).toBe(true);
    });

    it('should validate CORS request', () => {
      const config = createCORSConfig(['http://localhost:3000'], ['GET', 'POST']);

      expect(validateCORSRequest(config, 'http://localhost:3000', 'GET')).toBe(true);
      expect(validateCORSRequest(config, 'http://localhost:3000', 'DELETE')).toBe(false);
      expect(validateCORSRequest(config, 'http://other.com', 'GET')).toBe(false);
    });

    it('should allow wildcard origin', () => {
      const config = createCORSConfig(['*'], ['GET', 'POST']);

      expect(validateCORSRequest(config, 'http://any-origin.com', 'GET')).toBe(true);
    });
  });

  describe('API Security Headers', () => {
    it('should generate API security headers', () => {
      const headers = generateAPISecurityHeaders('v1', 100, 95, Date.now() + 60000);

      expect(headers['X-API-Version']).toBe('v1');
      expect(headers['X-RateLimit-Limit']).toBe(100);
      expect(headers['X-RateLimit-Remaining']).toBe(95);
      expect(headers['X-Content-Type-Options']).toBe('nosniff');
      expect(headers['X-Frame-Options']).toBe('DENY');
    });
  });

  describe('API Performance Metrics', () => {
    it('should calculate API performance metrics', () => {
      accessLogs.push(createAPIAccessLog('/api/users', 'GET', 200, 100, '192.168.1.1', true));
      accessLogs.push(createAPIAccessLog('/api/users', 'GET', 200, 150, '192.168.1.1', true));
      accessLogs.push(createAPIAccessLog('/api/users', 'GET', 500, 200, '192.168.1.1', false));

      const metrics = calculateAPIPerformanceMetrics(accessLogs);

      expect(metrics.totalRequests).toBe(3);
      expect(metrics.failedRequests).toBe(1);
      expect(metrics.successRate).toBeGreaterThan(0);
      expect(metrics.averageResponseTime).toBeGreaterThan(0);
    });
  });

  describe('API Security Report', () => {
    it('should generate API security report', () => {
      accessLogs.push(createAPIAccessLog('/api/users', 'GET', 200, 100, '192.168.1.1', true));
      accessLogs.push(createAPIAccessLog('/api/users', 'GET', 500, 200, '192.168.1.1', false));
      securityEvents.push(createAPISecurityEvent('unauthorized', 'high', '/api/admin', {}));
      securityEvents.push(createAPISecurityEvent('rate_limit', 'critical', '/api/users', {}));

      const report = generateAPISecurityReport(accessLogs, securityEvents);

      expect(report).toBeDefined();
      expect(report.timestamp).toBeDefined();
      expect(report.totalRequests).toBe(2);
      expect(report.failedRequests).toBe(1);
      expect(report.totalSecurityEvents).toBe(2);
    });
  });
});

