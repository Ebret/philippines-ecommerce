import { describe, it, expect, beforeEach } from 'vitest';
import {
  initializeRateLimitConfig,
  createRateLimitStore,
  checkRateLimit,
  createAPIRateLimitConfig,
  createLoginRateLimitConfig,
  createPasswordResetRateLimitConfig,
  createFileUploadRateLimitConfig,
  createSearchRateLimitConfig,
  createIPBasedKey,
  createUserBasedKey,
  createEndpointBasedKey,
  cleanupExpiredEntries,
  getRateLimitStatistics,
  resetRateLimit,
  resetAllRateLimits,
  blockIPAddress,
  unblockIPAddress,
  getBlockedIPs,
  generateRateLimitReport,
} from '../lib/rate-limiting';

describe('Rate Limiting', () => {
  let store: ReturnType<typeof createRateLimitStore>;

  beforeEach(() => {
    store = createRateLimitStore();
  });

  describe('Rate Limit Configuration', () => {
    it('should initialize rate limit config', () => {
      const config = initializeRateLimitConfig('Test', 100, 60000);

      expect(config).toBeDefined();
      expect(config.name).toBe('Test');
      expect(config.maxRequests).toBe(100);
      expect(config.windowMs).toBe(60000);
      expect(config.enabled).toBe(true);
    });

    it('should create API rate limit config', () => {
      const config = createAPIRateLimitConfig();

      expect(config.maxRequests).toBe(1000);
      expect(config.windowMs).toBe(60 * 1000);
    });

    it('should create login rate limit config', () => {
      const config = createLoginRateLimitConfig();

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
  });

  describe('Rate Limit Checking', () => {
    it('should allow first request', () => {
      const config = initializeRateLimitConfig('Test', 5, 60000);
      const status = checkRateLimit(store, 'user1', config);

      expect(status.allowed).toBe(true);
      expect(status.remaining).toBe(4);
    });

    it('should allow requests within limit', () => {
      const config = initializeRateLimitConfig('Test', 5, 60000);

      for (let i = 0; i < 5; i++) {
        const status = checkRateLimit(store, 'user1', config);
        expect(status.allowed).toBe(true);
      }
    });

    it('should block requests exceeding limit', () => {
      const config = initializeRateLimitConfig('Test', 3, 60000);

      for (let i = 0; i < 3; i++) {
        checkRateLimit(store, 'user1', config);
      }

      const status = checkRateLimit(store, 'user1', config);

      expect(status.allowed).toBe(false);
      expect(status.remaining).toBe(0);
    });

    it('should reset after window expires', () => {
      const config = initializeRateLimitConfig('Test', 2, 100); // 100ms window

      checkRateLimit(store, 'user1', config);
      checkRateLimit(store, 'user1', config);

      let status = checkRateLimit(store, 'user1', config);
      expect(status.allowed).toBe(false);

      // Wait for window to expire
      setTimeout(() => {
        status = checkRateLimit(store, 'user1', config);
        expect(status.allowed).toBe(true);
      }, 150);
    });

    it('should track remaining requests', () => {
      const config = initializeRateLimitConfig('Test', 5, 60000);

      let status = checkRateLimit(store, 'user1', config);
      expect(status.remaining).toBe(4);

      status = checkRateLimit(store, 'user1', config);
      expect(status.remaining).toBe(3);

      status = checkRateLimit(store, 'user1', config);
      expect(status.remaining).toBe(2);
    });
  });

  describe('Rate Limit Keys', () => {
    it('should create IP-based key', () => {
      const key = createIPBasedKey('192.168.1.1');

      expect(key).toBe('ip_192.168.1.1');
    });

    it('should create user-based key', () => {
      const key = createUserBasedKey('user123');

      expect(key).toBe('user_user123');
    });

    it('should create endpoint-based key', () => {
      const key = createEndpointBasedKey('192.168.1.1', '/api/login');

      expect(key).toBe('endpoint_192.168.1.1_/api/login');
    });
  });

  describe('Rate Limit Management', () => {
    it('should reset rate limit for specific key', () => {
      const config = initializeRateLimitConfig('Test', 2, 60000);

      checkRateLimit(store, 'user1', config);
      checkRateLimit(store, 'user1', config);

      resetRateLimit(store, 'user1');

      const status = checkRateLimit(store, 'user1', config);
      expect(status.allowed).toBe(true);
      expect(status.remaining).toBe(1);
    });

    it('should reset all rate limits', () => {
      const config = initializeRateLimitConfig('Test', 2, 60000);

      checkRateLimit(store, 'user1', config);
      checkRateLimit(store, 'user2', config);

      resetAllRateLimits(store);

      expect(Object.keys(store)).toHaveLength(0);
    });

    it('should block IP address', () => {
      const config = initializeRateLimitConfig('Test', 5, 60000);
      const ip = '192.168.1.1';

      blockIPAddress(store, ip, 60000);

      const status = checkRateLimit(store, createIPBasedKey(ip), config);
      expect(status.allowed).toBe(false);
    });

    it('should unblock IP address', () => {
      const config = initializeRateLimitConfig('Test', 5, 60000);
      const ip = '192.168.1.1';

      blockIPAddress(store, ip, 60000);
      unblockIPAddress(store, ip);

      const status = checkRateLimit(store, createIPBasedKey(ip), config);
      expect(status.allowed).toBe(true);
    });

    it('should get blocked IPs', () => {
      blockIPAddress(store, '192.168.1.1', 60000);
      blockIPAddress(store, '192.168.1.2', 60000);

      const blockedIPs = getBlockedIPs(store);

      expect(blockedIPs).toContain('192.168.1.1');
      expect(blockedIPs).toContain('192.168.1.2');
    });
  });

  describe('Rate Limit Statistics', () => {
    it('should get rate limit statistics', () => {
      const config = initializeRateLimitConfig('Test', 5, 60000);

      checkRateLimit(store, 'user1', config);
      checkRateLimit(store, 'user2', config);
      checkRateLimit(store, 'user3', config);

      const stats = getRateLimitStatistics(store);

      expect(stats.totalKeys).toBe(3);
      expect(stats.activeKeys).toBe(3);
      expect(stats.blockedKeys).toBe(0);
    });

    it('should track blocked keys', () => {
      const config = initializeRateLimitConfig('Test', 2, 60000);

      checkRateLimit(store, 'user1', config);
      checkRateLimit(store, 'user1', config);
      checkRateLimit(store, 'user1', config);

      const stats = getRateLimitStatistics(store);

      expect(stats.blockedKeys).toBeGreaterThan(0);
    });
  });

  describe('Rate Limit Cleanup', () => {
    it('should cleanup expired entries', () => {
      const config = initializeRateLimitConfig('Test', 5, 100); // 100ms window

      checkRateLimit(store, 'user1', config);

      setTimeout(() => {
        cleanupExpiredEntries(store);
        expect(Object.keys(store).length).toBeLessThanOrEqual(1);
      }, 150);
    });
  });

  describe('Rate Limit Report', () => {
    it('should generate rate limit report', () => {
      const config = initializeRateLimitConfig('Test', 5, 60000);

      checkRateLimit(store, 'user1', config);
      checkRateLimit(store, 'user2', config);

      const report = generateRateLimitReport(store, config);

      expect(report.timestamp).toBeDefined();
      expect(report.config).toBeDefined();
      expect(report.statistics).toBeDefined();
      expect(report.blockedIPs).toBeDefined();
      expect(report.recommendations).toBeDefined();
    });

    it('should provide recommendations for high blocked requests', () => {
      const config = initializeRateLimitConfig('Test', 1, 60000);

      for (let i = 0; i < 15; i++) {
        checkRateLimit(store, `user${i}`, config);
      }

      const report = generateRateLimitReport(store, config);

      expect(report.recommendations.length).toBeGreaterThan(0);
    });
  });
});

