/**
 * Input Validation Tests
 * 
 * Comprehensive tests for input validation and sanitization
 */

import { describe, it, expect } from 'vitest';
import {
  sanitizeString,
  encodeSpecialCharacters,
  validateEmail,
  validatePassword,
  validateURL,
  validatePhoneNumber,
  validateCreditCard,
  validateFileUpload,
  validateAgainstSQLInjection,
  validateAgainstCommandInjection,
  validateAgainstPathTraversal,
  validateInput,
  maskCreditCard,
} from '@/lib/input-validation-sanitization';
import {
  sanitizeObject,
  sanitizeArray,
  validateURLPath,
} from '@/middleware/input-validation';

describe('Input Validation & Sanitization', () => {
  describe('sanitizeString', () => {
    it('should trim whitespace', () => {
      const result = sanitizeString('  hello world  ');
      expect(result).toBe('hello world');
    });

    it('should remove script tags', () => {
      const result = sanitizeString('<script>alert("xss")</script>hello');
      expect(result).not.toContain('<script>');
    });

    it('should remove event handlers', () => {
      const result = sanitizeString('<img onclick="alert(1)" src="x">');
      expect(result).not.toContain('onclick');
    });

    it('should encode special characters', () => {
      const result = sanitizeString('<div>test</div>');
      expect(result).toContain('&lt;');
      expect(result).toContain('&gt;');
    });

    it('should respect maxLength', () => {
      const result = sanitizeString('a'.repeat(1000), { maxLength: 100 });
      expect(result.length).toBeLessThanOrEqual(100);
    });
  });

  describe('encodeSpecialCharacters', () => {
    it('should encode HTML special characters', () => {
      const result = encodeSpecialCharacters('<script>alert("xss")</script>');
      expect(result).toContain('&lt;');
      expect(result).toContain('&gt;');
      expect(result).toContain('&quot;');
    });

    it('should encode ampersand', () => {
      const result = encodeSpecialCharacters('Tom & Jerry');
      expect(result).toBe('Tom &amp; Jerry');
    });

    it('should encode single quotes', () => {
      const result = encodeSpecialCharacters("It's");
      expect(result).toContain('&#39;');
    });
  });

  describe('validateEmail', () => {
    it('should validate correct email', () => {
      const result = validateEmail('user@example.com');
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject invalid email format', () => {
      const result = validateEmail('invalid-email');
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should reject empty email', () => {
      const result = validateEmail('');
      expect(result.valid).toBe(false);
    });

    it('should reject email exceeding max length', () => {
      const result = validateEmail('a'.repeat(255) + '@example.com');
      expect(result.valid).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should validate strong password', () => {
      const result = validatePassword('SecurePass123!');
      expect(result.valid).toBe(true);
    });

    it('should reject password without uppercase', () => {
      const result = validatePassword('securepass123!');
      expect(result.valid).toBe(false);
    });

    it('should reject password without lowercase', () => {
      const result = validatePassword('SECUREPASS123!');
      expect(result.valid).toBe(false);
    });

    it('should reject password without number', () => {
      const result = validatePassword('SecurePass!');
      expect(result.valid).toBe(false);
    });

    it('should reject password without special character', () => {
      const result = validatePassword('SecurePass123');
      expect(result.valid).toBe(false);
    });

    it('should reject password shorter than 8 characters', () => {
      const result = validatePassword('Pass1!');
      expect(result.valid).toBe(false);
    });
  });

  describe('validateURL', () => {
    it('should validate correct HTTPS URL', () => {
      const result = validateURL('https://example.com');
      expect(result.valid).toBe(true);
    });

    it('should validate correct HTTP URL', () => {
      const result = validateURL('http://example.com');
      expect(result.valid).toBe(true);
    });

    it('should reject invalid URL', () => {
      const result = validateURL('not a url');
      expect(result.valid).toBe(false);
    });

    it('should reject FTP URL', () => {
      const result = validateURL('ftp://example.com');
      expect(result.valid).toBe(false);
    });
  });

  describe('validatePhoneNumber', () => {
    it('should validate Philippine phone number 09XXXXXXXXX', () => {
      const result = validatePhoneNumber('09123456789');
      expect(result.valid).toBe(true);
    });

    it('should validate Philippine phone number +639XXXXXXXXX', () => {
      const result = validatePhoneNumber('+639123456789');
      expect(result.valid).toBe(true);
    });

    it('should reject invalid phone number', () => {
      const result = validatePhoneNumber('1234567890');
      expect(result.valid).toBe(false);
    });
  });

  describe('validateCreditCard', () => {
    it('should validate valid credit card number', () => {
      // Valid test card number (Visa)
      const result = validateCreditCard('4532015112830366');
      expect(result.valid).toBe(true);
    });

    it('should reject invalid credit card number', () => {
      const result = validateCreditCard('1234567890123456');
      expect(result.valid).toBe(false);
    });

    it('should mask credit card number', () => {
      const result = validateCreditCard('4532015112830366');
      expect(result.sanitized).toBe('************0366');
    });
  });

  describe('maskCreditCard', () => {
    it('should mask credit card correctly', () => {
      const result = maskCreditCard('4532015112830366');
      expect(result).toBe('************0366');
    });

    it('should show only last 4 digits', () => {
      const result = maskCreditCard('4532015112830366');
      expect(result.slice(-4)).toBe('0366');
    });
  });

  describe('validateFileUpload', () => {
    it('should validate correct file upload', () => {
      const result = validateFileUpload({
        name: 'image.jpg',
        size: 1024 * 1024, // 1MB
        type: 'image/jpeg',
      });
      expect(result.valid).toBe(true);
    });

    it('should reject file exceeding max size', () => {
      const result = validateFileUpload({
        name: 'image.jpg',
        size: 20 * 1024 * 1024, // 20MB
        type: 'image/jpeg',
      });
      expect(result.valid).toBe(false);
    });

    it('should reject disallowed file type', () => {
      const result = validateFileUpload({
        name: 'script.exe',
        size: 1024,
        type: 'application/x-msdownload',
      });
      expect(result.valid).toBe(false);
    });

    it('should reject disallowed file extension', () => {
      const result = validateFileUpload({
        name: 'script.exe',
        size: 1024,
        type: 'image/jpeg',
      });
      expect(result.valid).toBe(false);
    });
  });

  describe('validateAgainstSQLInjection', () => {
    it('should detect SQL injection attempt', () => {
      const result = validateAgainstSQLInjection("'; DROP TABLE users; --");
      expect(result.valid).toBe(false);
    });

    it('should detect UNION SELECT injection', () => {
      const result = validateAgainstSQLInjection("1' UNION SELECT * FROM users --");
      expect(result.valid).toBe(false);
    });

    it('should allow normal text', () => {
      const result = validateAgainstSQLInjection('John Doe');
      expect(result.valid).toBe(true);
    });
  });

  describe('validateAgainstCommandInjection', () => {
    it('should detect command injection attempt', () => {
      const result = validateAgainstCommandInjection('test; rm -rf /');
      expect(result.valid).toBe(false);
    });

    it('should detect backtick injection', () => {
      const result = validateAgainstCommandInjection('test`whoami`');
      expect(result.valid).toBe(false);
    });

    it('should allow normal text', () => {
      const result = validateAgainstCommandInjection('hello world');
      expect(result.valid).toBe(true);
    });
  });

  describe('validateAgainstPathTraversal', () => {
    it('should detect path traversal attempt', () => {
      const result = validateAgainstPathTraversal('../../etc/passwd');
      expect(result.valid).toBe(false);
    });

    it('should detect encoded path traversal', () => {
      const result = validateAgainstPathTraversal('..%2Fetc%2Fpasswd');
      expect(result.valid).toBe(false);
    });

    it('should allow normal path', () => {
      const result = validateAgainstPathTraversal('/uploads/image.jpg');
      expect(result.valid).toBe(true);
    });
  });

  describe('validateInput', () => {
    it('should validate email type', () => {
      const result = validateInput('user@example.com', 'email');
      expect(result.valid).toBe(true);
    });

    it('should validate password type', () => {
      const result = validateInput('SecurePass123!', 'password');
      expect(result.valid).toBe(true);
    });

    it('should validate URL type', () => {
      const result = validateInput('https://example.com', 'url');
      expect(result.valid).toBe(true);
    });

    it('should validate phone type', () => {
      const result = validateInput('09123456789', 'phone');
      expect(result.valid).toBe(true);
    });

    it('should validate number type', () => {
      const result = validateInput('123.45', 'number');
      expect(result.valid).toBe(true);
    });

    it('should detect injection in any type', () => {
      const result = validateInput("'; DROP TABLE users; --", 'text');
      expect(result.valid).toBe(false);
    });
  });

  describe('sanitizeObject', () => {
    it('should sanitize object fields', () => {
      const result = sanitizeObject({
        name: '<script>alert("xss")</script>John',
        email: 'john@example.com',
      });

      expect(result.name).not.toContain('<script>');
      expect(result.email).toBe('john@example.com');
    });

    it('should handle nested objects', () => {
      const result = sanitizeObject({
        user: {
          name: '<img src=x onerror="alert(1)">',
        } as unknown as Record<string, unknown>,
      });

      expect(JSON.stringify(result)).not.toContain('onerror');
    });
  });

  describe('sanitizeArray', () => {
    it('should sanitize array of strings', () => {
      const result = sanitizeArray([
        '<script>alert("xss")</script>',
        'normal text',
      ]);

      expect(result[0]).not.toContain('<script>');
      expect(result[1]).toBe('normal text');
    });
  });

  describe('validateURLPath', () => {
    it('should validate normal path', () => {
      const result = validateURLPath('/api/users');
      expect(result.valid).toBe(true);
    });

    it('should reject path traversal', () => {
      const result = validateURLPath('/api/../../etc/passwd');
      expect(result.valid).toBe(false);
    });

    it('should reject null bytes', () => {
      const result = validateURLPath('/api/users\0');
      expect(result.valid).toBe(false);
    });
  });
});

