/**
 * Input Validation & Sanitization
 * Prevents injection attacks, XSS, and other input-based vulnerabilities
 */

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  sanitized?: string | Record<string, unknown>;
}

export interface SanitizationConfig {
  allowHTML: boolean;
  allowScripts: boolean;
  maxLength: number;
  trimWhitespace: boolean;
  encodeSpecialChars: boolean;
}

/**
 * Sanitize string input
 */
export function sanitizeString(
  input: string,
  config: Partial<SanitizationConfig> = {}
): string {
  const defaultConfig: SanitizationConfig = {
    allowHTML: false,
    allowScripts: false,
    maxLength: 10000,
    trimWhitespace: true,
    encodeSpecialChars: true,
    ...config,
  };

  let sanitized = input;

  // Trim whitespace
  if (defaultConfig.trimWhitespace) {
    sanitized = sanitized.trim();
  }

  // Check length
  if (sanitized.length > defaultConfig.maxLength) {
    sanitized = sanitized.substring(0, defaultConfig.maxLength);
  }

  // Remove scripts
  if (!defaultConfig.allowScripts) {
    sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
    sanitized = sanitized.replace(/on\w+\s*=\s*[^\s>]*/gi, '');
  }

  // Encode special characters first (before removing HTML)
  if (defaultConfig.encodeSpecialChars) {
    sanitized = encodeSpecialCharacters(sanitized);
  }

  // Remove HTML if not allowed (after encoding)
  if (!defaultConfig.allowHTML) {
    sanitized = sanitized.replace(/&lt;[^&]*&gt;/g, '');
  }

  return sanitized;
}

/**
 * Encode special characters for HTML
 */
export function encodeSpecialCharacters(input: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
  };

  return input.replace(/[&<>"'\/]/g, (char) => map[char] || char);
}

/**
 * Validate email
 */
export function validateEmail(email: string): ValidationResult {
  const errors: string[] = [];

  if (!email) {
    errors.push('Email is required');
  } else if (email.length > 254) {
    errors.push('Email is too long (max 254 characters)');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Invalid email format');
  }

  return {
    valid: errors.length === 0,
    errors,
    sanitized: sanitizeString(email),
  };
}

/**
 * Validate password
 */
export function validatePassword(password: string): ValidationResult {
  const errors: string[] = [];

  if (!password) {
    errors.push('Password is required');
  } else if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  } else if (password.length > 128) {
    errors.push('Password is too long (max 128 characters)');
  } else if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  } else if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  } else if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate URL
 */
export function validateURL(url: string): ValidationResult {
  const errors: string[] = [];

  if (!url) {
    errors.push('URL is required');
  } else {
    try {
      const urlObj = new URL(url);
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        errors.push('URL must use HTTP or HTTPS protocol');
      }
    } catch {
      errors.push('Invalid URL format');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    sanitized: sanitizeString(url),
  };
}

/**
 * Validate phone number (Philippines format)
 */
export function validatePhoneNumber(phone: string): ValidationResult {
  const errors: string[] = [];

  if (!phone) {
    errors.push('Phone number is required');
  } else {
    const digitsOnly = phone.replace(/\D/g, '');
    // Accept 09XXXXXXXXX (11 digits) or 639XXXXXXXXX (12 digits)
    if (!/^(09\d{9}|639\d{9})$/.test(digitsOnly)) {
      errors.push('Invalid Philippine phone number format (09XXXXXXXXX or +639XXXXXXXXX)');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    sanitized: sanitizeString(phone),
  };
}

/**
 * Validate credit card number (Luhn algorithm)
 */
export function validateCreditCard(cardNumber: string): ValidationResult {
  const errors: string[] = [];
  const sanitized = cardNumber.replace(/\D/g, '');

  if (!sanitized) {
    errors.push('Card number is required');
  } else if (sanitized.length < 13 || sanitized.length > 19) {
    errors.push('Card number must be between 13 and 19 digits');
  } else if (!luhnCheck(sanitized)) {
    errors.push('Invalid card number (failed Luhn check)');
  }

  return {
    valid: errors.length === 0,
    errors,
    sanitized: maskCreditCard(sanitized),
  };
}

/**
 * Luhn algorithm for credit card validation
 */
function luhnCheck(cardNumber: string): boolean {
  let sum = 0;
  let isEven = false;

  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

/**
 * Mask credit card number
 */
export function maskCreditCard(cardNumber: string): string {
  const sanitized = cardNumber.replace(/\D/g, '');
  if (sanitized.length < 4) return '****';
  return '*'.repeat(sanitized.length - 4) + sanitized.slice(-4);
}

/**
 * Validate file upload
 */
export function validateFileUpload(
  file: { name: string; size: number; type: string },
  options: {
    maxSize?: number;
    allowedTypes?: string[];
    allowedExtensions?: string[];
  } = {}
): ValidationResult {
  const errors: string[] = [];
  const defaultOptions = {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
    allowedExtensions: ['jpg', 'jpeg', 'png', 'webp', 'pdf'],
    ...options,
  };

  if (!file.name) {
    errors.push('File name is required');
  } else if (file.size > defaultOptions.maxSize) {
    errors.push(`File size exceeds maximum of ${defaultOptions.maxSize / 1024 / 1024}MB`);
  } else if (!defaultOptions.allowedTypes.includes(file.type)) {
    errors.push(`File type not allowed. Allowed types: ${defaultOptions.allowedTypes.join(', ')}`);
  } else {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !defaultOptions.allowedExtensions.includes(extension)) {
      errors.push(`File extension not allowed. Allowed: ${defaultOptions.allowedExtensions.join(', ')}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    sanitized: sanitizeString(file.name),
  };
}

/**
 * Prevent SQL injection - validate against common patterns
 */
export function validateAgainstSQLInjection(input: string): ValidationResult {
  const errors: string[] = [];
  const sqlPatterns = [
    /(\b(UNION|SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|SCRIPT)\b)/gi,
    /(-{2}|\/\*|\*\/|;)/g,
    /(xp_|sp_)/gi,
  ];

  for (const pattern of sqlPatterns) {
    if (pattern.test(input)) {
      errors.push('Input contains potentially malicious SQL patterns');
      break;
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Prevent command injection
 */
export function validateAgainstCommandInjection(input: string): ValidationResult {
  const errors: string[] = [];
  const commandPatterns = [
    /[;&|`$(){}[\]<>]/g,
    /\$\{.*\}/g,
    /`.*`/g,
  ];

  for (const pattern of commandPatterns) {
    if (pattern.test(input)) {
      errors.push('Input contains potentially malicious command patterns');
      break;
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Prevent path traversal
 */
export function validateAgainstPathTraversal(input: string): ValidationResult {
  const errors: string[] = [];

  if (/\.\.[\/\\]/.test(input) || /\.\.%2[fF]/.test(input)) {
    errors.push('Input contains path traversal patterns');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Comprehensive input validation
 */
export function validateInput(
  input: string,
  type: 'email' | 'password' | 'url' | 'phone' | 'text' | 'number' = 'text'
): ValidationResult {
  let result: ValidationResult;

  switch (type) {
    case 'email':
      result = validateEmail(input);
      break;
    case 'password':
      result = validatePassword(input);
      break;
    case 'url':
      result = validateURL(input);
      break;
    case 'phone':
      result = validatePhoneNumber(input);
      break;
    case 'number':
      result = {
        valid: /^-?\d+(\.\d+)?$/.test(input),
        errors: /^-?\d+(\.\d+)?$/.test(input) ? [] : ['Invalid number format'],
      };
      break;
    default:
      result = {
        valid: true,
        errors: [],
        sanitized: sanitizeString(input),
      };
  }

  // Additional checks
  const sqlCheck = validateAgainstSQLInjection(input);
  const cmdCheck = validateAgainstCommandInjection(input);
  const pathCheck = validateAgainstPathTraversal(input);

  if (!sqlCheck.valid) result.errors.push(...sqlCheck.errors);
  if (!cmdCheck.valid) result.errors.push(...cmdCheck.errors);
  if (!pathCheck.valid) result.errors.push(...pathCheck.errors);

  result.valid = result.errors.length === 0;

  return result;
}

