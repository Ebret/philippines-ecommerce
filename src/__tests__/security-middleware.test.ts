/**
 * Security Middleware Integration Tests
 * 
 * Tests for file upload security, content sanitization,
 * and privacy protection integration.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  scanFileUpload,
  scanAndSanitizeContent,
  imageUploadConfig,
  videoUploadConfig,
  documentUploadConfig,
  getUploadConfigForType,
  createBlockedResponse,
  getSecurityAuditLog,
  logSecurityEvent,
  sanitizeUrl,
} from '@/lib/security-middleware';

describe('Security Middleware', () => {
  // ============================================================================
  // File Upload Security Tests
  // ============================================================================
  describe('scanFileUpload', () => {
    it('should allow valid image uploads', async () => {
      // Create a simple valid PNG file (minimal header)
      const pngHeader = new Uint8Array([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
      const content = pngHeader.buffer;

      const result = await scanFileUpload(
        {
          name: 'test-image.png',
          type: 'image/png',
          size: content.byteLength,
          content,
        },
        imageUploadConfig,
        'user-123',
        '127.0.0.1'
      );

      expect(result.allowed).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.sanitizedFilename).toBe('test-image.png');
    });

    it('should block executable files', async () => {
      const content = new TextEncoder().encode('malicious content');

      const result = await scanFileUpload(
        {
          name: 'malware.exe',
          type: 'application/x-msdownload',
          size: content.byteLength,
          content: content.buffer,
        },
        imageUploadConfig,
        'user-123',
        '127.0.0.1'
      );

      expect(result.allowed).toBe(false);
      expect(result.errors).toContain('Executable files are not allowed');
    });

    it('should block files with invalid MIME types', async () => {
      const content = new TextEncoder().encode('some content');

      const result = await scanFileUpload(
        {
          name: 'document.txt',
          type: 'text/plain',
          size: content.byteLength,
          content: content.buffer,
        },
        imageUploadConfig,
        'user-123',
        '127.0.0.1'
      );

      expect(result.allowed).toBe(false);
      expect(result.errors.some(e => e.includes('MIME type'))).toBe(true);
    });

    it('should block files exceeding size limit', async () => {
      // Create content larger than 5MB limit
      const largeContent = new Uint8Array(6 * 1024 * 1024);
      
      const result = await scanFileUpload(
        {
          name: 'large-image.jpg',
          type: 'image/jpeg',
          size: largeContent.byteLength,
          content: largeContent.buffer,
        },
        imageUploadConfig,
        'user-123',
        '127.0.0.1'
      );

      expect(result.allowed).toBe(false);
      expect(result.errors.some(e => e.includes('size') || e.includes('large'))).toBe(true);
    });

    it('should sanitize filenames with path traversal', async () => {
      const jpegHeader = new Uint8Array([0xFF, 0xD8, 0xFF, 0xE0]);
      
      const result = await scanFileUpload(
        {
          name: '../../../etc/passwd.jpg',
          type: 'image/jpeg',
          size: jpegHeader.byteLength,
          content: jpegHeader.buffer,
        },
        imageUploadConfig,
        'user-123',
        '127.0.0.1'
      );

      // Filename should be sanitized
      expect(result.sanitizedFilename).not.toContain('..');
      expect(result.sanitizedFilename).not.toContain('/');
    });

    it('should block PHP files disguised as images', async () => {
      const content = new TextEncoder().encode('<?php echo "hacked"; ?>');

      const result = await scanFileUpload(
        {
          name: 'image.php.jpg',
          type: 'image/jpeg',
          size: content.byteLength,
          content: content.buffer,
        },
        imageUploadConfig,
        'user-123',
        '127.0.0.1'
      );

      // Should detect PHP content or invalid file
      expect(result.allowed).toBe(false);
    });

    it('should use correct config for video uploads', async () => {
      const mp4Header = new Uint8Array([0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70]);

      const result = await scanFileUpload(
        {
          name: 'video.mp4',
          type: 'video/mp4',
          size: mp4Header.byteLength,
          content: mp4Header.buffer,
        },
        videoUploadConfig,
        'user-123',
        '127.0.0.1'
      );

      expect(result.allowed).toBe(true);
    });
  });

  // ============================================================================
  // Content Sanitization Tests
  // ============================================================================
  describe('scanAndSanitizeContent', () => {
    it('should allow clean content', () => {
      const result = scanAndSanitizeContent(
        'This is a great product! Highly recommended.',
        'user-123',
        '127.0.0.1',
        'review'
      );

      expect(result.allowed).toBe(true);
      expect(result.sanitizedContent).toBe('This is a great product! Highly recommended.');
      expect(result.threats).toHaveLength(0);
    });

    it('should sanitize script injection attempts', () => {
      const result = scanAndSanitizeContent(
        'Great product! <script>alert("xss")</script>',
        'user-123',
        '127.0.0.1',
        'review'
      );

      expect(result.allowed).toBe(true);
      expect(result.sanitizedContent).not.toContain('<script>');
      expect(result.threats.length).toBeGreaterThan(0);
    });

    it('should sanitize event handler injection', () => {
      const result = scanAndSanitizeContent(
        'Check this <img src="x" onerror="alert(1)">',
        'user-123',
        '127.0.0.1',
        'comment'
      );

      expect(result.sanitizedContent).not.toContain('onerror');
    });

    it('should sanitize javascript: URLs', () => {
      const result = scanAndSanitizeContent(
        'Click <a href="javascript:alert(1)">here</a>',
        'user-123',
        '127.0.0.1',
        'comment'
      );

      expect(result.sanitizedContent).not.toContain('javascript:');
    });

    it('should sanitize iframe injection', () => {
      const result = scanAndSanitizeContent(
        'Look at this <iframe src="http://malicious.com"></iframe>',
        'user-123',
        '127.0.0.1',
        'description'
      );

      expect(result.sanitizedContent).not.toContain('<iframe');
    });

    it('should detect SQL injection patterns', () => {
      const result = scanAndSanitizeContent(
        "'; DROP TABLE users; --",
        'user-123',
        '127.0.0.1',
        'comment'
      );

      expect(result.threats.some(t => t.type === 'sql_injection')).toBe(true);
    });
  });

  // ============================================================================
  // URL Sanitization Tests
  // ============================================================================
  describe('sanitizeUrl', () => {
    it('should strip tracking parameters', () => {
      const url = 'https://example.com/page?utm_source=test&utm_medium=email&name=product';
      const sanitized = sanitizeUrl(url);

      expect(sanitized).not.toContain('utm_source');
      expect(sanitized).not.toContain('utm_medium');
      expect(sanitized).toContain('name=product');
    });

    it('should strip Facebook tracking parameters', () => {
      const url = 'https://example.com/product?fbclid=abc123&ref=share';
      const sanitized = sanitizeUrl(url);

      expect(sanitized).not.toContain('fbclid');
    });

    it('should handle invalid URLs gracefully', () => {
      const invalidUrl = 'not-a-valid-url';
      const result = sanitizeUrl(invalidUrl);

      expect(result).toBe(invalidUrl);
    });
  });

  // ============================================================================
  // Upload Config Tests
  // ============================================================================
  describe('getUploadConfigForType', () => {
    it('should return image config for images', () => {
      const config = getUploadConfigForType('image');
      expect(config.allowedMimeTypes).toContain('image/jpeg');
      expect(config.maxFileSize).toBe(5 * 1024 * 1024);
    });

    it('should return video config for videos', () => {
      const config = getUploadConfigForType('video');
      expect(config.allowedMimeTypes).toContain('video/mp4');
      expect(config.maxFileSize).toBe(100 * 1024 * 1024);
    });

    it('should return document config for documents', () => {
      const config = getUploadConfigForType('document');
      expect(config.allowedMimeTypes).toContain('application/pdf');
      expect(config.maxFileSize).toBe(10 * 1024 * 1024);
    });
  });

  // ============================================================================
  // Blocked Response Tests
  // ============================================================================
  describe('createBlockedResponse', () => {
    it('should create response with security headers', () => {
      const response = createBlockedResponse('Security violation detected', 400);

      expect(response.status).toBe(400);
      expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
      expect(response.headers.get('X-Frame-Options')).toBe('DENY');
    });

    it('should include error message in body', async () => {
      const response = createBlockedResponse('Test error', 403);
      const body = await response.json();

      expect(body.success).toBe(false);
      expect(body.error).toBe('Test error');
      expect(body.securityViolation).toBe(true);
    });
  });

  // ============================================================================
  // Audit Logging Tests
  // ============================================================================
  describe('Security Audit Logging', () => {
    it('should log security events', () => {
      logSecurityEvent({
        timestamp: Date.now(),
        action: 'file_upload',
        userId: 'test-user',
        ip: '127.0.0.1',
        details: { test: true },
        result: 'allowed',
      });

      const logs = getSecurityAuditLog(10);
      expect(logs.length).toBeGreaterThan(0);
      expect(logs[logs.length - 1].userId).toBe('test-user');
    });

    it('should limit audit log retrieval', () => {
      // Add multiple events
      for (let i = 0; i < 10; i++) {
        logSecurityEvent({
          timestamp: Date.now(),
          action: 'content_scan',
          details: { index: i },
          result: 'allowed',
        });
      }

      const logs = getSecurityAuditLog(5);
      expect(logs.length).toBeLessThanOrEqual(5);
    });
  });
});

