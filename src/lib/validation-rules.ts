/**
 * Common Validation Rules
 * 
 * Reusable validation rules for form fields with
 * customizable error messages and Philippine-specific formats.
 */

import type { ValidationRule } from '@/hooks/use-form-validation';

/**
 * Required field validation
 */
export const required = (message = 'This field is required'): ValidationRule => ({
  validate: (value: string) => (!value.trim() ? message : null),
});

/**
 * Email validation
 */
export const email = (message = 'Please enter a valid email address'): ValidationRule => ({
  validate: (value: string) => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !emailRegex.test(value) ? message : null;
  },
});

/**
 * Minimum length validation
 */
export const minLength = (min: number, message?: string): ValidationRule => ({
  validate: (value: string) => {
    if (!value) return null;
    return value.length < min
      ? message || `Must be at least ${min} characters`
      : null;
  },
});

/**
 * Maximum length validation
 */
export const maxLength = (max: number, message?: string): ValidationRule => ({
  validate: (value: string) => {
    if (!value) return null;
    return value.length > max
      ? message || `Must be at most ${max} characters`
      : null;
  },
});

/**
 * Pattern validation with custom regex
 */
export const pattern = (regex: RegExp, message: string): ValidationRule => ({
  validate: (value: string) => {
    if (!value) return null;
    return !regex.test(value) ? message : null;
  },
});

/**
 * Philippine phone number validation
 * Accepts: 09XX-XXX-XXXX, 09XXXXXXXXX, +63-XXX-XXX-XXXX, +639XXXXXXXXX
 */
export const phonePhilippines = (message = 'Please enter a valid Philippine phone number'): ValidationRule => ({
  validate: (value: string) => {
    if (!value) return null;
    const cleaned = value.replace(/[\s-]/g, '');
    const phoneRegex = /^(\+63|0)9\d{9}$/;
    return !phoneRegex.test(cleaned) ? message : null;
  },
});

/**
 * Password strength validation
 * Requires: 8+ chars, uppercase, lowercase, number
 */
export const passwordStrength = (message?: string): ValidationRule => ({
  validate: (value: string) => {
    if (!value) return null;
    const hasMinLength = value.length >= 8;
    const hasUppercase = /[A-Z]/.test(value);
    const hasLowercase = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);

    if (!hasMinLength) return message || 'Password must be at least 8 characters';
    if (!hasUppercase) return message || 'Password must contain an uppercase letter';
    if (!hasLowercase) return message || 'Password must contain a lowercase letter';
    if (!hasNumber) return message || 'Password must contain a number';
    return null;
  },
});

/**
 * Confirm password validation
 */
export const confirmPassword = (
  getPassword: () => string,
  message = 'Passwords do not match'
): ValidationRule => ({
  validate: (value: string) => {
    if (!value) return null;
    return value !== getPassword() ? message : null;
  },
});

/**
 * Philippine postal code validation (4 digits)
 */
export const postalCodePhilippines = (message = 'Please enter a valid 4-digit postal code'): ValidationRule => ({
  validate: (value: string) => {
    if (!value) return null;
    const postalRegex = /^\d{4}$/;
    return !postalRegex.test(value) ? message : null;
  },
});

/**
 * URL validation
 */
export const url = (message = 'Please enter a valid URL'): ValidationRule => ({
  validate: (value: string) => {
    if (!value) return null;
    try {
      new URL(value);
      return null;
    } catch {
      return message;
    }
  },
});

/**
 * Numeric only validation
 */
export const numeric = (message = 'Please enter numbers only'): ValidationRule => ({
  validate: (value: string) => {
    if (!value) return null;
    return !/^\d+$/.test(value) ? message : null;
  },
});

/**
 * Price validation (positive number with up to 2 decimal places)
 */
export const price = (message = 'Please enter a valid price'): ValidationRule => ({
  validate: (value: string) => {
    if (!value) return null;
    const priceRegex = /^\d+(\.\d{1,2})?$/;
    const numValue = parseFloat(value);
    if (!priceRegex.test(value) || numValue <= 0) {
      return message;
    }
    return null;
  },
});

// Export all rules as a collection
export const validationRules = {
  required,
  email,
  minLength,
  maxLength,
  pattern,
  phonePhilippines,
  passwordStrength,
  confirmPassword,
  postalCodePhilippines,
  url,
  numeric,
  price,
};

export default validationRules;
