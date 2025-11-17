/**
 * Input Validation Middleware
 * 
 * Validates and sanitizes all incoming requests
 * Prevents SQL injection, XSS, command injection, and path traversal attacks
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  sanitizeString,
  validateAgainstSQLInjection,
  validateAgainstCommandInjection,
  validateAgainstPathTraversal,
} from '@/lib/input-validation-sanitization';

/**
 * Validate request body
 */
export async function validateRequestBody(request: NextRequest): Promise<{
  valid: boolean;
  errors: string[];
  data?: Record<string, unknown>;
}> {
  try {
    const contentType = request.headers.get('content-type');

    if (!contentType?.includes('application/json')) {
      return {
        valid: true,
        errors: [],
      };
    }

    const body = await request.json();

    // Validate each field
    const errors: string[] = [];

    for (const [key, value] of Object.entries(body)) {
      if (typeof value === 'string') {
        // Check for SQL injection
        const sqlCheck = validateAgainstSQLInjection(value);
        if (!sqlCheck.valid) {
          errors.push(`Field "${key}": ${sqlCheck.errors[0]}`);
        }

        // Check for command injection
        const cmdCheck = validateAgainstCommandInjection(value);
        if (!cmdCheck.valid) {
          errors.push(`Field "${key}": ${cmdCheck.errors[0]}`);
        }

        // Check for path traversal
        const pathCheck = validateAgainstPathTraversal(value);
        if (!pathCheck.valid) {
          errors.push(`Field "${key}": ${pathCheck.errors[0]}`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      data: body,
    };
  } catch (error) {
    return {
      valid: false,
      errors: ['Invalid request body'],
    };
  }
}

/**
 * Validate query parameters
 */
export function validateQueryParams(request: NextRequest): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const searchParams = request.nextUrl.searchParams;

  for (const [key, value] of searchParams.entries()) {
    // Check for SQL injection
    const sqlCheck = validateAgainstSQLInjection(value);
    if (!sqlCheck.valid) {
      errors.push(`Query param "${key}": ${sqlCheck.errors[0]}`);
    }

    // Check for command injection
    const cmdCheck = validateAgainstCommandInjection(value);
    if (!cmdCheck.valid) {
      errors.push(`Query param "${key}": ${cmdCheck.errors[0]}`);
    }

    // Check for path traversal
    const pathCheck = validateAgainstPathTraversal(value);
    if (!pathCheck.valid) {
      errors.push(`Query param "${key}": ${pathCheck.errors[0]}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate URL path
 */
export function validateURLPath(pathname: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check for path traversal
  const pathCheck = validateAgainstPathTraversal(pathname);
  if (!pathCheck.valid) {
    errors.push(`URL path: ${pathCheck.errors[0]}`);
  }

  // Check for null bytes
  if (pathname.includes('\0')) {
    errors.push('URL path contains null bytes');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Input validation middleware for Next.js
 */
export async function inputValidationMiddleware(request: NextRequest) {
  // Skip validation for static assets
  if (
    request.nextUrl.pathname.startsWith('/_next/') ||
    request.nextUrl.pathname.startsWith('/public/') ||
    request.nextUrl.pathname.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)
  ) {
    return NextResponse.next();
  }

  // Validate URL path
  const pathValidation = validateURLPath(request.nextUrl.pathname);
  if (!pathValidation.valid) {
    console.warn('Invalid URL path:', pathValidation.errors);
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }

  // Validate query parameters
  const queryValidation = validateQueryParams(request);
  if (!queryValidation.valid) {
    console.warn('Invalid query parameters:', queryValidation.errors);
    return NextResponse.json(
      { error: 'Invalid query parameters' },
      { status: 400 }
    );
  }

  // Validate request body for POST/PUT/PATCH
  if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
    const bodyValidation = await validateRequestBody(request);
    if (!bodyValidation.valid) {
      console.warn('Invalid request body:', bodyValidation.errors);
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }
  }

  return NextResponse.next();
}

/**
 * Sanitize object recursively
 */
export function sanitizeObject(obj: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeObject(value as Record<string, unknown>);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map((item) =>
        typeof item === 'string' ? sanitizeString(item) : item
      );
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Sanitize array of strings
 */
export function sanitizeArray(arr: string[]): string[] {
  return arr.map((item) => sanitizeString(item));
}

