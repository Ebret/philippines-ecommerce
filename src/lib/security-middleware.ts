/**
 * Security Middleware for File Uploads and User Content
 * 
 * Integrates anti-malware scanning and privacy protection
 * into API routes for the Philippines E-Commerce Platform.
 * 
 * @module security-middleware
 */

import { NextResponse } from 'next/server';
import {
  scanFile,
  scanUserContent,
  validateFileExtension,
  validateMimeType,
  validateFileSize,
  sanitizeFilename,
  isExecutableFile,
  generateScanReport,
  getHighestThreatSeverity,
  defaultFileValidationConfig,
  type MalwareScanResult,
  type FileValidationConfig,
  type ThreatInfo,
} from './anti-malware';
import {
  applyPrivacyHeaders,
  createDefaultPrivacyPreferences,
  checkDoNotTrack,
  stripTrackingParams,
  type PrivacyPreferences,
} from './privacy-protection';

// ============================================================================
// Types
// ============================================================================

export interface FileUploadSecurityResult {
  allowed: boolean;
  scanResult?: MalwareScanResult;
  sanitizedFilename?: string;
  errors: string[];
  warnings: string[];
  auditLog: SecurityAuditEntry;
}

export interface ContentSecurityResult {
  allowed: boolean;
  sanitizedContent: string;
  threats: ThreatInfo[];
  originalContent: string;
  auditLog: SecurityAuditEntry;
}

export interface SecurityAuditEntry {
  timestamp: number;
  action: 'file_upload' | 'content_scan' | 'request_blocked';
  userId?: string;
  ip?: string;
  details: Record<string, unknown>;
  result: 'allowed' | 'blocked' | 'sanitized';
  threats?: ThreatInfo[];
}

// ============================================================================
// Configuration
// ============================================================================

export const imageUploadConfig: FileValidationConfig = {
  maxFileSize: 5 * 1024 * 1024, // 5MB for images
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  scanContent: true,
  checkMagicBytes: true,
  quarantineOnThreat: true,
};

export const videoUploadConfig: FileValidationConfig = {
  maxFileSize: 100 * 1024 * 1024, // 100MB for videos
  allowedMimeTypes: ['video/mp4', 'video/webm', 'video/quicktime'],
  allowedExtensions: ['.mp4', '.webm', '.mov'],
  scanContent: true,
  checkMagicBytes: true,
  quarantineOnThreat: true,
};

export const documentUploadConfig: FileValidationConfig = {
  maxFileSize: 10 * 1024 * 1024, // 10MB for documents
  allowedMimeTypes: ['application/pdf', 'text/plain', 'text/csv'],
  allowedExtensions: ['.pdf', '.txt', '.csv'],
  scanContent: true,
  checkMagicBytes: true,
  quarantineOnThreat: true,
};

// ============================================================================
// Security Audit Logging
// ============================================================================

const auditLog: SecurityAuditEntry[] = [];

export function logSecurityEvent(entry: SecurityAuditEntry): void {
  auditLog.push(entry);
  
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[SECURITY AUDIT]', JSON.stringify(entry, null, 2));
  }
  
  // In production, this would log to a database or security monitoring service
  if (entry.result === 'blocked') {
    console.warn('[SECURITY BLOCKED]', {
      action: entry.action,
      threats: entry.threats?.map(t => t.type).join(', '),
      ip: entry.ip,
    });
  }
}

export function getSecurityAuditLog(limit = 100): SecurityAuditEntry[] {
  return auditLog.slice(-limit);
}

// ============================================================================
// File Upload Security
// ============================================================================

/**
 * Scan and validate a file upload for malware and security threats
 */
export async function scanFileUpload(
  file: {
    name: string;
    type: string;
    size: number;
    content: ArrayBuffer | string;
  },
  config: FileValidationConfig = defaultFileValidationConfig,
  userId?: string,
  ip?: string
): Promise<FileUploadSecurityResult> {
  const errors: string[] = [];
  const warnings: string[] = [];
  const timestamp = Date.now();

  // Sanitize filename first
  const sanitizedFilename = sanitizeFilename(file.name);
  
  // Check for executable files
  if (isExecutableFile(sanitizedFilename, file.type)) {
    const auditEntry: SecurityAuditEntry = {
      timestamp,
      action: 'file_upload',
      userId,
      ip,
      details: { filename: file.name, type: file.type, size: file.size },
      result: 'blocked',
      threats: [{ type: 'malware', severity: 'critical', description: 'Executable file upload blocked' }],
    };
    logSecurityEvent(auditEntry);

    return {
      allowed: false,
      sanitizedFilename,
      errors: ['Executable files are not allowed'],
      warnings,
      auditLog: auditEntry,
    };
  }

  // Validate file extension
  const extResult = validateFileExtension(sanitizedFilename, config);
  if (!extResult.valid) {
    errors.push(extResult.error || 'Invalid file extension');
  }

  // Validate MIME type
  const mimeResult = validateMimeType(file.type, config);
  if (!mimeResult.valid) {
    errors.push(mimeResult.error || 'Invalid MIME type');
  }

  // Validate file size
  const sizeResult = validateFileSize(file.size, config);
  if (!sizeResult.valid) {
    errors.push(sizeResult.error || 'File too large');
  }

  // If basic validation fails, reject immediately
  if (errors.length > 0) {
    const auditEntry: SecurityAuditEntry = {
      timestamp,
      action: 'file_upload',
      userId,
      ip,
      details: { filename: file.name, type: file.type, size: file.size, errors },
      result: 'blocked',
    };
    logSecurityEvent(auditEntry);

    return {
      allowed: false,
      sanitizedFilename,
      errors,
      warnings,
      auditLog: auditEntry,
    };
  }

  // Perform deep malware scan
  const scanResult = await scanFile(file, config);

  if (!scanResult.safe) {
    const highestSeverity = getHighestThreatSeverity(scanResult);
    const report = generateScanReport(scanResult);

    const auditEntry: SecurityAuditEntry = {
      timestamp,
      action: 'file_upload',
      userId,
      ip,
      details: {
        filename: file.name,
        type: file.type,
        size: file.size,
        fileHash: scanResult.fileHash,
        scanReport: report,
      },
      result: 'blocked',
      threats: scanResult.threats,
    };
    logSecurityEvent(auditEntry);

    // Add threat descriptions to errors
    for (const threat of scanResult.threats) {
      if (threat.severity === 'critical' || threat.severity === 'high') {
        errors.push(`Security threat detected: ${threat.description}`);
      } else {
        warnings.push(`Security warning: ${threat.description}`);
      }
    }

    return {
      allowed: false,
      scanResult,
      sanitizedFilename,
      errors,
      warnings,
      auditLog: auditEntry,
    };
  }

  // File passed all security checks
  const auditEntry: SecurityAuditEntry = {
    timestamp,
    action: 'file_upload',
    userId,
    ip,
    details: {
      filename: sanitizedFilename,
      type: file.type,
      size: file.size,
      fileHash: scanResult.fileHash,
    },
    result: 'allowed',
  };
  logSecurityEvent(auditEntry);

  return {
    allowed: true,
    scanResult,
    sanitizedFilename,
    errors: [],
    warnings,
    auditLog: auditEntry,
  };
}

// ============================================================================
// User Content Security
// ============================================================================

/**
 * Scan and sanitize user-generated content for malicious code
 */
export function scanAndSanitizeContent(
  content: string,
  userId?: string,
  ip?: string,
  contentType: 'review' | 'comment' | 'description' | 'message' = 'comment'
): ContentSecurityResult {
  const timestamp = Date.now();

  // Scan content for threats
  const scanResult = scanUserContent(content);

  if (!scanResult.safe) {
    const auditEntry: SecurityAuditEntry = {
      timestamp,
      action: 'content_scan',
      userId,
      ip,
      details: {
        contentType,
        contentLength: content.length,
        threatCount: scanResult.threats.length,
      },
      result: 'sanitized',
      threats: scanResult.threats,
    };
    logSecurityEvent(auditEntry);

    return {
      allowed: true,
      sanitizedContent: scanResult.sanitized,
      threats: scanResult.threats,
      originalContent: content,
      auditLog: auditEntry,
    };
  }

  const auditEntry: SecurityAuditEntry = {
    timestamp,
    action: 'content_scan',
    userId,
    ip,
    details: { contentType, contentLength: content.length },
    result: 'allowed',
  };
  logSecurityEvent(auditEntry);

  return {
    allowed: true,
    sanitizedContent: content,
    threats: [],
    originalContent: content,
    auditLog: auditEntry,
  };
}

// ============================================================================
// Privacy Protection for API Responses
// ============================================================================

/**
 * Apply privacy protection headers to API response
 */
export function applyPrivacyProtection(
  response: NextResponse,
  requestHeaders: Headers,
  customPreferences?: Partial<PrivacyPreferences>
): NextResponse {
  const preferences = {
    ...createDefaultPrivacyPreferences(),
    ...customPreferences,
  };

  // Check Do Not Track header
  if (checkDoNotTrack(requestHeaders)) {
    preferences.doNotTrack = true;
  }

  // Apply privacy headers
  applyPrivacyHeaders(response.headers, preferences);

  return response;
}

/**
 * Strip tracking parameters from URLs in API requests
 */
export function sanitizeUrl(url: string): string {
  return stripTrackingParams(url);
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Create a blocked response with security headers
 */
export function createBlockedResponse(
  message: string,
  status: number = 400,
  auditEntry?: SecurityAuditEntry
): NextResponse {
  const response = NextResponse.json(
    {
      success: false,
      error: message,
      securityViolation: true,
    },
    { status }
  );

  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');

  return response;
}

/**
 * Get upload configuration for file type
 */
export function getUploadConfigForType(
  fileType: 'image' | 'video' | 'document'
): FileValidationConfig {
  switch (fileType) {
    case 'image':
      return imageUploadConfig;
    case 'video':
      return videoUploadConfig;
    case 'document':
      return documentUploadConfig;
    default:
      return defaultFileValidationConfig;
  }
}

