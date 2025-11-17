/**
 * Rate Limiting Tests
 * 
 * Comprehensive test suite for rate limiting and DDoS protection
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  createRateLimitStore,
  checkRateLimit,
  createIPBasedKey,
  createUserBasedKey,
  createEndpointBasedKey,
  cleanupExpiredEntries,
  blockIPAddress,
  unblockIPAddress,
  getBlockedIPs,
  getRateLimitStatistics,
  resetRateLimit,
  resetAllRateLimits,
  generateRateLimitReport,
  initializeRateLimitConfig,
  createAPIRateLimitConfig,
  createLoginRateLimitConfig,
  createPasswordResetRateLimitConfig,
  createFileUploadRateLimitConfig,
  createSearchRateLimitConfig,
} from '@/lib/rate-limiting';
import {
  getRateLimitConfig,
  getRateLimitConfigByType,
  validateRateLimitConfig,
  validateAllRateLimitConfigs,
} from '@/lib/rate-limit-config';

describe('Rate Limiting', () => {
  let store: ReturnType<typeof createRateLimitStore>;

  beforeEach(() => {
    store = createRateLimitStore();
  });

  describe('Rate Limit Configuration', () => {
    it('should create API rate limit config', () => {
      const config = createAPIRateLimitConfig();
      expect(config.name).toBe('API Rate Limit');
      expect(config.maxRequests).toBe(1000);
      expect(config.windowMs).toBe(60 * 1000);
    });

    it('should create login rate limit config with 5 attempts per 15 minutes', () => {
      const config = createLoginRateLimitConfig();
      expect(config.name).toBe('Login Rate Limit');
      expect(config.maxRequests).toBe(5);
      expect(config.windowMs).toBe(15 * 60 * 1000);
    });

    it('should create password reset rate limit config', () => {
      const config = createPasswordResetRateLimitConfig();
      expect(config.maxRequests).toBe(3);
      expect(config.windowMs).toBe(60 * 60 * 1000);
    });

    it('should create file upload rate limit config', () => {
      const config = createFileUploadRateLimitConfig();
      expect(config.maxRequests).toBe(10);
      expect(config.windowMs).toBe(60 * 60 * 1000);
    });

    it('should create search rate limit config', () => {
      const config = createSearchRateLimitConfig();
      expect(config.maxRequests).toBe(100);
      expect(config.windowMs).toBe(60 * 1000);
    });

    it('should validate rate limit config', () => {
      const config = createAPIRateLimitConfig();
      expect(validateRateLimitConfig(config)).toBe(true);
    });

    it('should reject invalid rate limit config', () => {
      const invalidConfig = {
        ...createAPIRateLimitConfig(),
        maxRequests: -1,
      };
      expect(validateRateLimitConfig(invalidConfig)).toBe(false);
    });

    it('should validate all rate limit configs', () => {
      expect(validateAllRateLimitConfigs()).toBe(true);
    });

    it('should get rate limit config by type', () => {
      process.env.NODE_ENV = 'production';
      const config = getRateLimitConfigByType('login');
      expect(config.maxRequests).toBe(5);
    });
  });

  describe('Rate Limit Enforcement', () => {
    it('should allow first request', () => {
      const config = createAPIRateLimitConfig();
      const status = checkRateLimit(store, 'test_key', config);
      expect(status.allowed).toBe(true);
      expect(status.remaining).toBe(config.maxRequests - 1);
    });

    it('should track request count', () => {
      const config = initializeRateLimitConfig('Test', 5, 60 * 1000);
      const key = 'test_key';

      for (let i = 0; i < 5; i++) {
        const status = checkRateLimit(store, key, config);
        expect(status.allowed).toBe(true);
        expect(status.remaining).toBe(5 - (i + 1));
      }

      // 6th request should be blocked
      const status = checkRateLimit(store, key, config);
      expect(status.allowed).toBe(false);
      expect(status.remaining).toBe(0);
    });

    it('should block requests when limit exceeded', () => {
      const config = initializeRateLimitConfig('Test', 3, 60 * 1000);
      const key = 'test_key';

      // Make 3 requests
      for (let i = 0; i < 3; i++) {
        checkRateLimit(store, key, config);
      }

      // 4th request should be blocked
      const status = checkRateLimit(store, key, config);
      expect(status.allowed).toBe(false);
      expect(status.message).toBe('Too many requests, please try again later');
    });

    it('should reset rate limit after window expires', async () => {
      const config = initializeRateLimitConfig('Test', 2, 100); // 100ms window
      const key = 'test_key';

      // Make 2 requests
      checkRateLimit(store, key, config);
      checkRateLimit(store, key, config);

      // 3rd request should be blocked
      let status = checkRateLimit(store, key, config);
      expect(status.allowed).toBe(false);

      // Wait for window to expire
      await new Promise(resolve => setTimeout(resolve, 150));
      // Reset should allow new requests
      status = checkRateLimit(store, key, config);
      expect(status.allowed).toBe(true);
    });

    it('should return retry-after header', () => {
      const config = initializeRateLimitConfig('Test', 1, 60 * 1000);
      const key = 'test_key';

      checkRateLimit(store, key, config);
      const status = checkRateLimit(store, key, config);

      expect(status.retryAfter).toBeDefined();
      expect(status.retryAfter).toBeGreaterThan(0);
    });
  });

  describe('IP-Based Rate Limiting', () => {
    it('should create IP-based key', () => {
      const key = createIPBasedKey('192.168.1.1');
      expect(key).toBe('ip_192.168.1.1');
    });

    it('should block IP address', () => {
      const ip = '192.168.1.1';
      blockIPAddress(store, ip, 60 * 1000);

      const blockedIPs = getBlockedIPs(store);
      expect(blockedIPs).toContain(ip);
    });

    it('should unblock IP address', () => {
      const ip = '192.168.1.1';
      blockIPAddress(store, ip, 60 * 1000);
      unblockIPAddress(store, ip);

      const blockedIPs = getBlockedIPs(store);
      expect(blockedIPs).not.toContain(ip);
    });

    it('should get list of blocked IPs', () => {
      blockIPAddress(store, '192.168.1.1', 60 * 1000);
      blockIPAddress(store, '192.168.1.2', 60 * 1000);

      const blockedIPs = getBlockedIPs(store);
      expect(blockedIPs).toContain('192.168.1.1');
      expect(blockedIPs).toContain('192.168.1.2');
      expect(blockedIPs.length).toBe(2);
    });
  });

  describe('User-Based Rate Limiting', () => {
    it('should create user-based key', () => {
      const key = createUserBasedKey('user_123');
      expect(key).toBe('user_user_123');
    });

    it('should track rate limit per user', () => {
      const config = initializeRateLimitConfig('Test', 5, 60 * 1000);
      const user1Key = createUserBasedKey('user_1');
      const user2Key = createUserBasedKey('user_2');

      // User 1 makes 5 requests
      for (let i = 0; i < 5; i++) {
        checkRateLimit(store, user1Key, config);
      }

      // User 1 should be blocked
      let status = checkRateLimit(store, user1Key, config);
      expect(status.allowed).toBe(false);

      // User 2 should still be allowed
      status = checkRateLimit(store, user2Key, config);
      expect(status.allowed).toBe(true);
    });
  });

  describe('Endpoint-Based Rate Limiting', () => {
    it('should create endpoint-based key', () => {
      const key = createEndpointBasedKey('192.168.1.1', '/api/users');
      expect(key).toBe('endpoint_192.168.1.1_/api/users');
    });

    it('should track rate limit per endpoint', () => {
      const config = initializeRateLimitConfig('Test', 3, 60 * 1000);
      const endpoint1Key = createEndpointBasedKey('192.168.1.1', '/api/users');
      const endpoint2Key = createEndpointBasedKey('192.168.1.1', '/api/products');

      // Make 3 requests to endpoint 1
      for (let i = 0; i < 3; i++) {
        checkRateLimit(store, endpoint1Key, config);
      }

      // Endpoint 1 should be blocked
      let status = checkRateLimit(store, endpoint1Key, config);
      expect(status.allowed).toBe(false);

      // Endpoint 2 should still be allowed
      status = checkRateLimit(store, endpoint2Key, config);
      expect(status.allowed).toBe(true);
    });
  });

  describe('Rate Limit Management', () => {
    it('should reset specific rate limit', () => {
      const config = initializeRateLimitConfig('Test', 2, 60 * 1000);
      const key = 'test_key';

      checkRateLimit(store, key, config);
      checkRateLimit(store, key, config);

      // Should be blocked
      let status = checkRateLimit(store, key, config);
      expect(status.allowed).toBe(false);

      // Reset
      resetRateLimit(store, key);

      // Should be allowed again
      status = checkRateLimit(store, key, config);
      expect(status.allowed).toBe(true);
    });

    it('should reset all rate limits', () => {
      const config = initializeRateLimitConfig('Test', 1, 60 * 1000);

      checkRateLimit(store, 'key1', config);
      checkRateLimit(store, 'key2', config);

      resetAllRateLimits(store);

      const status1 = checkRateLimit(store, 'key1', config);
      const status2 = checkRateLimit(store, 'key2', config);

      expect(status1.allowed).toBe(true);
      expect(status2.allowed).toBe(true);
    });

    it('should cleanup expired entries', async () => {
      const config = initializeRateLimitConfig('Test', 5, 100);
      const key = 'test_key';

      checkRateLimit(store, key, config);

      // Wait for window to expire
      await new Promise(resolve => setTimeout(resolve, 150));
      cleanupExpiredEntries(store);
      expect(store[key]).toBeUndefined();
    });
  });

  describe('Rate Limit Statistics', () => {
    it('should get rate limit statistics', () => {
      const config = initializeRateLimitConfig('Test', 5, 60 * 1000);

      checkRateLimit(store, 'key1', config);
      checkRateLimit(store, 'key2', config);

      const stats = getRateLimitStatistics(store);
      expect(stats.totalKeys).toBeGreaterThan(0);
      expect(stats.activeKeys).toBeGreaterThan(0);
      expect(stats.blockedKeys).toBe(0);
    });

    it('should generate rate limit report', () => {
      const config = initializeRateLimitConfig('Test', 5, 60 * 1000);

      checkRateLimit(store, 'key1', config);
      blockIPAddress(store, '192.168.1.1', 60 * 1000);

      const report = generateRateLimitReport(store, config);
      expect(report.timestamp).toBeDefined();
      expect(report.config).toBeDefined();
      expect(report.statistics).toBeDefined();
      expect(report.blockedIPs).toContain('192.168.1.1');
    });
  });

  describe('Rate Limit Configuration', () => {
    it('should get production rate limit config', () => {
      process.env.NODE_ENV = 'production';
      const config = getRateLimitConfig();
      expect(config.api).toBeDefined();
      expect(config.login).toBeDefined();
    });

    it('should get development rate limit config', () => {
      process.env.NODE_ENV = 'development';
      const config = getRateLimitConfig();
      expect(config.api).toBeDefined();
      expect(config.api.maxRequests).toBeGreaterThan(100);
    });
  });

  describe('Login Attempt Limiting', () => {
    it('should limit login attempts to 5 per 15 minutes', () => {
      const config = createLoginRateLimitConfig();
      const key = createIPBasedKey('192.168.1.1');

      // Make 5 login attempts
      for (let i = 0; i < 5; i++) {
        const status = checkRateLimit(store, key, config);
        expect(status.allowed).toBe(true);
      }

      // 6th attempt should be blocked
      const status = checkRateLimit(store, key, config);
      expect(status.allowed).toBe(false);
    });
  });

  describe('Disabled Rate Limiting', () => {
    it('should allow all requests when disabled', () => {
      const config = createAPIRateLimitConfig();
      config.enabled = false;

      for (let i = 0; i < 10000; i++) {
        const status = checkRateLimit(store, 'test_key', config);
        expect(status.allowed).toBe(true);
      }
    });
  });
});

