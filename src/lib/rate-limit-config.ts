/**
 * Rate Limiting Configuration
 * 
 * Centralized configuration for rate limiting and DDoS protection
 * Includes API limits, login limits, and IP-based blocking
 */

import type { RateLimitConfig } from './rate-limiting';

/**
 * Rate limit configuration for different endpoint types
 */
export interface RateLimitConfigMap {
  api: RateLimitConfig;
  login: RateLimitConfig;
  passwordReset: RateLimitConfig;
  fileUpload: RateLimitConfig;
  search: RateLimitConfig;
  publicEndpoint: RateLimitConfig;
  authenticatedEndpoint: RateLimitConfig;
}

/**
 * IP blocking configuration
 */
export interface IPBlockingConfig {
  enabled: boolean;
  blockDurationMs: number; // How long to block an IP
  violationThreshold: number; // Number of violations before blocking
  violationWindowMs: number; // Time window for counting violations
}

/**
 * Rate limit configuration for production environment
 */
export const productionRateLimitConfig: RateLimitConfigMap = {
  // API endpoints: 100 requests per minute per IP
  api: {
    id: 'api_rate_limit',
    name: 'API Rate Limit',
    maxRequests: 100,
    windowMs: 60 * 1000, // 1 minute
    message: 'Too many API requests, please try again later',
    statusCode: 429,
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
    enabled: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },

  // Login attempts: 5 attempts per 15 minutes
  login: {
    id: 'login_rate_limit',
    name: 'Login Rate Limit',
    maxRequests: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    message: 'Too many login attempts, please try again later',
    statusCode: 429,
    skipSuccessfulRequests: true, // Don't count successful logins
    skipFailedRequests: false,
    enabled: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },

  // Password reset: 3 attempts per hour
  passwordReset: {
    id: 'password_reset_rate_limit',
    name: 'Password Reset Rate Limit',
    maxRequests: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
    message: 'Too many password reset attempts, please try again later',
    statusCode: 429,
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
    enabled: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },

  // File uploads: 10 uploads per hour
  fileUpload: {
    id: 'file_upload_rate_limit',
    name: 'File Upload Rate Limit',
    maxRequests: 10,
    windowMs: 60 * 60 * 1000, // 1 hour
    message: 'Too many file uploads, please try again later',
    statusCode: 429,
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
    enabled: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },

  // Search: 100 searches per minute
  search: {
    id: 'search_rate_limit',
    name: 'Search Rate Limit',
    maxRequests: 100,
    windowMs: 60 * 1000, // 1 minute
    message: 'Too many search requests, please try again later',
    statusCode: 429,
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
    enabled: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },

  // Public endpoints: 50 requests per minute
  publicEndpoint: {
    id: 'public_endpoint_rate_limit',
    name: 'Public Endpoint Rate Limit',
    maxRequests: 50,
    windowMs: 60 * 1000, // 1 minute
    message: 'Too many requests, please try again later',
    statusCode: 429,
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
    enabled: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },

  // Authenticated endpoints: 500 requests per minute
  authenticatedEndpoint: {
    id: 'authenticated_endpoint_rate_limit',
    name: 'Authenticated Endpoint Rate Limit',
    maxRequests: 500,
    windowMs: 60 * 1000, // 1 minute
    message: 'Too many requests, please try again later',
    statusCode: 429,
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
    enabled: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
};

/**
 * Rate limit configuration for development environment
 */
export const developmentRateLimitConfig: RateLimitConfigMap = {
  ...productionRateLimitConfig,
  // Increase limits for development
  api: { ...productionRateLimitConfig.api, maxRequests: 1000 },
  login: { ...productionRateLimitConfig.login, maxRequests: 50 },
  passwordReset: { ...productionRateLimitConfig.passwordReset, maxRequests: 50 },
  fileUpload: { ...productionRateLimitConfig.fileUpload, maxRequests: 100 },
  search: { ...productionRateLimitConfig.search, maxRequests: 1000 },
  publicEndpoint: { ...productionRateLimitConfig.publicEndpoint, maxRequests: 500 },
  authenticatedEndpoint: { ...productionRateLimitConfig.authenticatedEndpoint, maxRequests: 5000 },
};

/**
 * IP blocking configuration
 */
export const ipBlockingConfig: IPBlockingConfig = {
  enabled: true,
  blockDurationMs: 24 * 60 * 60 * 1000, // 24 hours
  violationThreshold: 10, // Block after 10 violations
  violationWindowMs: 60 * 60 * 1000, // Within 1 hour
};

/**
 * Get rate limit configuration based on environment
 */
export function getRateLimitConfig(): RateLimitConfigMap {
  const env = process.env.NODE_ENV || 'development';
  return env === 'production' ? productionRateLimitConfig : developmentRateLimitConfig;
}

/**
 * Get specific rate limit config by type
 */
export function getRateLimitConfigByType(
  type: keyof RateLimitConfigMap
): RateLimitConfig {
  const config = getRateLimitConfig();
  return config[type];
}

/**
 * Validate rate limit configuration
 */
export function validateRateLimitConfig(config: RateLimitConfig): boolean {
  if (!config.id || !config.name) return false;
  if (config.maxRequests <= 0) return false;
  if (config.windowMs <= 0) return false;
  if (config.statusCode < 400 || config.statusCode >= 600) return false;
  return true;
}

/**
 * Validate all rate limit configurations
 */
export function validateAllRateLimitConfigs(): boolean {
  const config = getRateLimitConfig();
  return Object.values(config).every(validateRateLimitConfig);
}

