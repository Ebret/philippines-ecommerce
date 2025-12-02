import { describe, it, expect } from 'vitest';

/**
 * Unit tests for form validation utility functions
 * Tests the core validation logic without React hooks
 */

// Validation rule type
interface ValidationRule {
  validate: (value: string) => string | null;
}

// Common validation rules
const validationRules = {
  required: (message = 'This field is required'): ValidationRule => ({
    validate: (value: string) => (!value.trim() ? message : null),
  }),

  email: (message = 'Invalid email address'): ValidationRule => ({
    validate: (value: string) => {
      if (!value) return null; // Let required handle empty
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return !emailRegex.test(value) ? message : null;
    },
  }),

  minLength: (min: number, message?: string): ValidationRule => ({
    validate: (value: string) => {
      if (!value) return null;
      return value.length < min
        ? message || `Must be at least ${min} characters`
        : null;
    },
  }),

  maxLength: (max: number, message?: string): ValidationRule => ({
    validate: (value: string) => {
      if (!value) return null;
      return value.length > max
        ? message || `Must be at most ${max} characters`
        : null;
    },
  }),

  pattern: (regex: RegExp, message: string): ValidationRule => ({
    validate: (value: string) => {
      if (!value) return null;
      return !regex.test(value) ? message : null;
    },
  }),

  phone: (message = 'Invalid phone number'): ValidationRule => ({
    validate: (value: string) => {
      if (!value) return null;
      // Philippine phone format: 09XX-XXX-XXXX or +63-XXX-XXX-XXXX
      const phoneRegex = /^(\+63|0)9\d{2}[-\s]?\d{3}[-\s]?\d{4}$/;
      return !phoneRegex.test(value.replace(/\s/g, '')) ? message : null;
    },
  }),
};

describe('Validation Rules', () => {
  describe('required', () => {
    const rule = validationRules.required();

    it('should return error for empty string', () => {
      expect(rule.validate('')).toBe('This field is required');
    });

    it('should return error for whitespace only', () => {
      expect(rule.validate('   ')).toBe('This field is required');
    });

    it('should return null for valid value', () => {
      expect(rule.validate('hello')).toBeNull();
    });

    it('should use custom message', () => {
      const customRule = validationRules.required('Name is required');
      expect(customRule.validate('')).toBe('Name is required');
    });
  });

  describe('email', () => {
    const rule = validationRules.email();

    it('should return null for empty value (let required handle)', () => {
      expect(rule.validate('')).toBeNull();
    });

    it('should return error for invalid email', () => {
      expect(rule.validate('invalid')).toBe('Invalid email address');
      expect(rule.validate('invalid@')).toBe('Invalid email address');
      expect(rule.validate('@domain.com')).toBe('Invalid email address');
    });

    it('should return null for valid email', () => {
      expect(rule.validate('test@example.com')).toBeNull();
      expect(rule.validate('user.name@domain.co.uk')).toBeNull();
    });
  });

  describe('minLength', () => {
    const rule = validationRules.minLength(8);

    it('should return null for empty value', () => {
      expect(rule.validate('')).toBeNull();
    });

    it('should return error for short value', () => {
      expect(rule.validate('short')).toBe('Must be at least 8 characters');
    });

    it('should return null for valid length', () => {
      expect(rule.validate('longenough')).toBeNull();
    });

    it('should use custom message', () => {
      const customRule = validationRules.minLength(8, 'Password too short');
      expect(customRule.validate('short')).toBe('Password too short');
    });
  });

  describe('maxLength', () => {
    const rule = validationRules.maxLength(10);

    it('should return null for empty value', () => {
      expect(rule.validate('')).toBeNull();
    });

    it('should return error for long value', () => {
      expect(rule.validate('this is too long')).toBe('Must be at most 10 characters');
    });

    it('should return null for valid length', () => {
      expect(rule.validate('short')).toBeNull();
    });
  });

  describe('pattern', () => {
    const rule = validationRules.pattern(/^[A-Z]+$/, 'Must be uppercase letters only');

    it('should return null for empty value', () => {
      expect(rule.validate('')).toBeNull();
    });

    it('should return error for non-matching value', () => {
      expect(rule.validate('lowercase')).toBe('Must be uppercase letters only');
    });

    it('should return null for matching value', () => {
      expect(rule.validate('UPPERCASE')).toBeNull();
    });
  });

  describe('phone (Philippine format)', () => {
    const rule = validationRules.phone();

    it('should return null for empty value', () => {
      expect(rule.validate('')).toBeNull();
    });

    it('should return error for invalid phone', () => {
      expect(rule.validate('12345')).toBe('Invalid phone number');
      expect(rule.validate('0812-345-6789')).toBe('Invalid phone number');
    });

    it('should return null for valid Philippine phone', () => {
      expect(rule.validate('09171234567')).toBeNull();
      expect(rule.validate('0917-123-4567')).toBeNull();
      expect(rule.validate('+639171234567')).toBeNull();
    });
  });
});

