import { describe, it, expect } from 'vitest';
import {
  sanitizeString,
  encodeSpecialCharacters,
  validateEmail,
  validatePassword,
  validateURL,
  validatePhoneNumber,
  validateCreditCard,
  maskCreditCard,
  validateFileUpload,
  validateAgainstSQLInjection,
  validateAgainstCommandInjection,
  validateAgainstPathTraversal,
  validateInput,
} from '../lib/input-validation-sanitization';

describe('Input Validation & Sanitization', () => {
  describe('String Sanitization', () => {
    it('should sanitize string with default config', () => {
      const input = '<script>alert("xss")</script>Hello';
      const sanitized = sanitizeString(input);

      expect(sanitized).not.toContain('<script>');
      expect(sanitized).toContain('Hello');
    });

    it('should trim whitespace', () => {
      const input = '  hello world  ';
      const sanitized = sanitizeString(input);

      expect(sanitized).toBe('hello world');
    });

    it('should encode special characters', () => {
      const input = '<div>Test & "quote"</div>';
      const sanitized = sanitizeString(input);

      expect(sanitized).toContain('&lt;');
      expect(sanitized).toContain('&gt;');
      expect(sanitized).toContain('&amp;');
    });

    it('should respect maxLength', () => {
      const input = 'a'.repeat(1000);
      const sanitized = sanitizeString(input, { maxLength: 100 });

      expect(sanitized.length).toBeLessThanOrEqual(100);
    });
  });

  describe('Email Validation', () => {
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
      expect(result.errors).toContain('Email is required');
    });

    it('should reject email that is too long', () => {
      const result = validateEmail('a'.repeat(300) + '@example.com');

      expect(result.valid).toBe(false);
    });
  });

  describe('Password Validation', () => {
    it('should validate strong password', () => {
      const result = validatePassword('SecurePass123!');

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject password without uppercase', () => {
      const result = validatePassword('securepass123!');

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one uppercase letter');
    });

    it('should reject password without lowercase', () => {
      const result = validatePassword('SECUREPASS123!');

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one lowercase letter');
    });

    it('should reject password without number', () => {
      const result = validatePassword('SecurePass!');

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one number');
    });

    it('should reject password without special character', () => {
      const result = validatePassword('SecurePass123');

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one special character');
    });

    it('should reject short password', () => {
      const result = validatePassword('Pass1!');

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must be at least 8 characters');
    });
  });

  describe('URL Validation', () => {
    it('should validate correct HTTPS URL', () => {
      const result = validateURL('https://example.com');

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
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

  describe('Phone Number Validation', () => {
    it('should validate Philippine phone number', () => {
      const result = validatePhoneNumber('09123456789');

      expect(result.valid).toBe(true);
    });

    it('should validate Philippine phone number with +63', () => {
      const result = validatePhoneNumber('+639123456789');

      expect(result.valid).toBe(true);
    });

    it('should reject invalid phone number', () => {
      const result = validatePhoneNumber('1234567890');

      expect(result.valid).toBe(false);
    });
  });

  describe('Credit Card Validation', () => {
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
      const masked = maskCreditCard('4532015112830366');

      expect(masked).toBe('************0366');
      expect(masked).not.toContain('4532');
    });
  });

  describe('File Upload Validation', () => {
    it('should validate correct file upload', () => {
      const file = {
        name: 'image.jpg',
        size: 1024 * 1024, // 1MB
        type: 'image/jpeg',
      };

      const result = validateFileUpload(file);

      expect(result.valid).toBe(true);
    });

    it('should reject file that is too large', () => {
      const file = {
        name: 'image.jpg',
        size: 20 * 1024 * 1024, // 20MB
        type: 'image/jpeg',
      };

      const result = validateFileUpload(file);

      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('exceeds maximum');
    });

    it('should reject invalid file type', () => {
      const file = {
        name: 'script.exe',
        size: 1024,
        type: 'application/x-msdownload',
      };

      const result = validateFileUpload(file);

      expect(result.valid).toBe(false);
    });

    it('should reject invalid file extension', () => {
      const file = {
        name: 'script.exe',
        size: 1024,
        type: 'image/jpeg',
      };

      const result = validateFileUpload(file);

      expect(result.valid).toBe(false);
    });
  });

  describe('SQL Injection Prevention', () => {
    it('should detect SQL injection attempt', () => {
      const result = validateAgainstSQLInjection("'; DROP TABLE users; --");

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should detect UNION SELECT', () => {
      const result = validateAgainstSQLInjection('UNION SELECT * FROM users');

      expect(result.valid).toBe(false);
    });

    it('should allow normal input', () => {
      const result = validateAgainstSQLInjection('normal user input');

      expect(result.valid).toBe(true);
    });
  });

  describe('Command Injection Prevention', () => {
    it('should detect command injection attempt', () => {
      const result = validateAgainstCommandInjection('test; rm -rf /');

      expect(result.valid).toBe(false);
    });

    it('should detect pipe injection', () => {
      const result = validateAgainstCommandInjection('test | cat /etc/passwd');

      expect(result.valid).toBe(false);
    });

    it('should allow normal input', () => {
      const result = validateAgainstCommandInjection('normal input');

      expect(result.valid).toBe(true);
    });
  });

  describe('Path Traversal Prevention', () => {
    it('should detect path traversal attempt', () => {
      const result = validateAgainstPathTraversal('../../etc/passwd');

      expect(result.valid).toBe(false);
    });

    it('should detect encoded path traversal', () => {
      const result = validateAgainstPathTraversal('..%2Fetc%2Fpasswd');

      expect(result.valid).toBe(false);
    });

    it('should allow normal path', () => {
      const result = validateAgainstPathTraversal('uploads/image.jpg');

      expect(result.valid).toBe(true);
    });
  });

  describe('Comprehensive Input Validation', () => {
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
      const result = validateInput('12345', 'number');

      expect(result.valid).toBe(true);
    });

    it('should reject injection attempts in any type', () => {
      const result = validateInput("'; DROP TABLE users; --", 'text');

      expect(result.valid).toBe(false);
    });
  });
});

