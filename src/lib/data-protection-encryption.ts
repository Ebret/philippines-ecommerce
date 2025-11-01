/**
 * Data Protection & Encryption
 * Handles sensitive data encryption, key management, and PII protection
 */

import crypto from 'crypto';

export interface EncryptionKey {
  id: string;
  key: Buffer;
  iv: Buffer;
  algorithm: string;
  createdAt: number;
  rotatedAt?: number;
  active: boolean;
  version: number;
}

export interface EncryptedData {
  encrypted: string;
  iv: string;
  algorithm: string;
  keyId: string;
  timestamp: number;
}

export interface EncryptionConfig {
  id: string;
  algorithm: string;
  keyLength: number;
  ivLength: number;
  encoding: 'hex' | 'base64';
  enabled: boolean;
  keyRotationDays: number;
  createdAt: number;
  updatedAt: number;
}

export interface AuditLog {
  id: string;
  timestamp: number;
  action: string;
  dataType: string;
  userId?: string;
  ipAddress?: string;
  status: 'success' | 'failure';
  details?: Record<string, unknown>;
}

export interface PasswordHash {
  hash: string;
  salt: string;
  algorithm: string;
  iterations: number;
  createdAt: number;
}

export interface DataMaskConfig {
  maskEmail: boolean;
  maskPhone: boolean;
  maskCreditCard: boolean;
  maskSSN: boolean;
  maskAddress: boolean;
  visibleChars: number;
}

/**
 * Initialize encryption configuration
 */
export function initializeEncryptionConfig(): EncryptionConfig {
  return {
    id: `enc_${Date.now()}`,
    algorithm: 'aes-256-cbc',
    keyLength: 32, // 256 bits
    ivLength: 16, // 128 bits
    encoding: 'hex',
    enabled: true,
    keyRotationDays: 90,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

/**
 * Generate encryption key
 */
export function generateEncryptionKey(config: EncryptionConfig): EncryptionKey {
  const key = crypto.randomBytes(config.keyLength);
  const iv = crypto.randomBytes(config.ivLength);

  return {
    id: `key_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    key,
    iv,
    algorithm: config.algorithm,
    createdAt: Date.now(),
    active: true,
    version: 1,
  };
}

/**
 * Encrypt data
 */
export function encryptData(
  data: string,
  encryptionKey: EncryptionKey,
  config: EncryptionConfig
): EncryptedData {
  // Generate a new IV for each encryption for better security
  const iv = crypto.randomBytes(config.ivLength);
  const cipher = crypto.createCipheriv(config.algorithm, encryptionKey.key, iv);
  let encrypted = cipher.update(data, 'utf8', config.encoding);
  encrypted += cipher.final(config.encoding);

  return {
    encrypted,
    iv: iv.toString(config.encoding),
    algorithm: config.algorithm,
    keyId: encryptionKey.id,
    timestamp: Date.now(),
  };
}

/**
 * Decrypt data
 */
export function decryptData(
  encryptedData: EncryptedData,
  encryptionKey: EncryptionKey,
  config: EncryptionConfig
): string {
  const iv = Buffer.from(encryptedData.iv, config.encoding);
  const decipher = crypto.createDecipheriv(config.algorithm, encryptionKey.key, iv);
  let decrypted = decipher.update(encryptedData.encrypted, config.encoding, 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

/**
 * Hash password using bcrypt-like approach
 */
export function hashPassword(password: string, iterations: number = 10): PasswordHash {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, iterations, 64, 'sha512').toString('hex');

  return {
    hash,
    salt,
    algorithm: 'pbkdf2',
    iterations,
    createdAt: Date.now(),
  };
}

/**
 * Verify password
 */
export function verifyPassword(password: string, passwordHash: PasswordHash): boolean {
  const hash = crypto.pbkdf2Sync(password, passwordHash.salt, passwordHash.iterations, 64, 'sha512').toString('hex');
  return hash === passwordHash.hash;
}

/**
 * Mask email address
 */
export function maskEmail(email: string, visibleChars: number = 3): string {
  const [localPart, domain] = email.split('@');
  if (!domain) return email;

  const maskedLocal = localPart.substring(0, visibleChars) + '*'.repeat(Math.max(1, localPart.length - visibleChars));
  return `${maskedLocal}@${domain}`;
}

/**
 * Mask phone number
 */
export function maskPhoneNumber(phone: string, visibleChars: number = 4): string {
  const digitsOnly = phone.replace(/\D/g, '');
  if (digitsOnly.length < visibleChars) return phone;

  const masked = '*'.repeat(digitsOnly.length - visibleChars) + digitsOnly.slice(-visibleChars);
  return masked;
}

/**
 * Mask credit card number
 */
export function maskCreditCard(cardNumber: string, visibleChars: number = 4): string {
  const digitsOnly = cardNumber.replace(/\D/g, '');
  if (digitsOnly.length < visibleChars) return '****';

  return '*'.repeat(digitsOnly.length - visibleChars) + digitsOnly.slice(-visibleChars);
}

/**
 * Mask SSN
 */
export function maskSSN(ssn: string, visibleChars: number = 4): string {
  const digitsOnly = ssn.replace(/\D/g, '');
  if (digitsOnly.length < visibleChars) return ssn;

  return '*'.repeat(digitsOnly.length - visibleChars) + digitsOnly.slice(-visibleChars);
}

/**
 * Mask address
 */
export function maskAddress(address: string, visibleChars: number = 10): string {
  if (address.length <= visibleChars) return address;
  return address.substring(0, visibleChars) + '*'.repeat(Math.max(1, address.length - visibleChars));
}

/**
 * Mask sensitive data in object
 */
export function maskSensitiveData(
  data: Record<string, unknown>,
  config: DataMaskConfig
): Record<string, unknown> {
  const masked = { ...data };

  for (const [key, value] of Object.entries(masked)) {
    if (typeof value !== 'string') continue;

    const lowerKey = key.toLowerCase();

    if (config.maskEmail && (lowerKey.includes('email') || lowerKey.includes('mail'))) {
      masked[key] = maskEmail(value);
    } else if (config.maskPhone && (lowerKey.includes('phone') || lowerKey.includes('mobile'))) {
      masked[key] = maskPhoneNumber(value);
    } else if (config.maskCreditCard && (lowerKey.includes('card') || lowerKey.includes('credit'))) {
      masked[key] = maskCreditCard(value);
    } else if (config.maskSSN && (lowerKey.includes('ssn') || lowerKey.includes('social'))) {
      masked[key] = maskSSN(value);
    } else if (config.maskAddress && (lowerKey.includes('address') || lowerKey.includes('street'))) {
      masked[key] = maskAddress(value);
    }
  }

  return masked;
}

/**
 * Initialize audit log
 */
export function initializeAuditLog(
  action: string,
  dataType: string,
  status: 'success' | 'failure' = 'success',
  userId?: string,
  ipAddress?: string
): AuditLog {
  return {
    id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now(),
    action,
    dataType,
    userId,
    ipAddress,
    status,
  };
}

/**
 * Create audit log with details
 */
export function createAuditLog(
  action: string,
  dataType: string,
  details?: Record<string, unknown>,
  userId?: string,
  ipAddress?: string
): AuditLog {
  const log = initializeAuditLog(action, dataType, 'success', userId, ipAddress);
  log.details = details;
  return log;
}

/**
 * Initialize data mask configuration
 */
export function initializeDataMaskConfig(): DataMaskConfig {
  return {
    maskEmail: true,
    maskPhone: true,
    maskCreditCard: true,
    maskSSN: true,
    maskAddress: true,
    visibleChars: 4,
  };
}

/**
 * Check if key needs rotation
 */
export function checkKeyRotation(key: EncryptionKey, rotationDays: number): boolean {
  const now = Date.now();
  const keyAge = now - key.createdAt;
  const rotationMs = rotationDays * 24 * 60 * 60 * 1000;

  return keyAge > rotationMs;
}

/**
 * Rotate encryption key
 */
export function rotateEncryptionKey(oldKey: EncryptionKey, config: EncryptionConfig): EncryptionKey {
  const newKey = generateEncryptionKey(config);
  newKey.version = oldKey.version + 1;

  return newKey;
}

/**
 * Create key store
 */
export function createKeyStore(): Map<string, EncryptionKey> {
  return new Map();
}

/**
 * Store encryption key
 */
export function storeEncryptionKey(store: Map<string, EncryptionKey>, key: EncryptionKey): void {
  store.set(key.id, key);
}

/**
 * Retrieve encryption key
 */
export function retrieveEncryptionKey(store: Map<string, EncryptionKey>, keyId: string): EncryptionKey | undefined {
  return store.get(keyId);
}

/**
 * Get active encryption key
 */
export function getActiveEncryptionKey(store: Map<string, EncryptionKey>): EncryptionKey | undefined {
  for (const key of store.values()) {
    if (key.active) {
      return key;
    }
  }
  return undefined;
}

/**
 * Deactivate old keys
 */
export function deactivateOldKeys(store: Map<string, EncryptionKey>, keepVersions: number = 2): void {
  const keys = Array.from(store.values()).sort((a, b) => b.version - a.version);

  for (let i = keepVersions; i < keys.length; i++) {
    keys[i].active = false;
  }
}

/**
 * Create audit log store
 */
export function createAuditLogStore(): AuditLog[] {
  return [];
}

/**
 * Add audit log
 */
export function addAuditLog(store: AuditLog[], log: AuditLog): void {
  store.push(log);
}

/**
 * Get audit logs by action
 */
export function getAuditLogsByAction(store: AuditLog[], action: string): AuditLog[] {
  return store.filter((log) => log.action === action);
}

/**
 * Get audit logs by user
 */
export function getAuditLogsByUser(store: AuditLog[], userId: string): AuditLog[] {
  return store.filter((log) => log.userId === userId);
}

/**
 * Get audit logs by date range
 */
export function getAuditLogsByDateRange(store: AuditLog[], startTime: number, endTime: number): AuditLog[] {
  return store.filter((log) => log.timestamp >= startTime && log.timestamp <= endTime);
}

/**
 * Generate data protection report
 */
export function generateDataProtectionReport(
  config: EncryptionConfig,
  keyStore: Map<string, EncryptionKey>,
  auditLogs: AuditLog[]
): {
  timestamp: number;
  config: EncryptionConfig;
  activeKeys: number;
  totalKeys: number;
  auditLogCount: number;
  recommendations: string[];
  securityScore: number;
} {
  const activeKeys = Array.from(keyStore.values()).filter((k) => k.active).length;
  const totalKeys = keyStore.size;
  const recommendations: string[] = [];
  let securityScore = 100;

  if (!config.enabled) {
    recommendations.push('Enable encryption');
    securityScore -= 30;
  }

  if (activeKeys === 0) {
    recommendations.push('No active encryption keys - generate new key');
    securityScore -= 40;
  }

  if (totalKeys === 0) {
    recommendations.push('No encryption keys configured');
    securityScore -= 50;
  }

  // Check for key rotation
  const activeKey = getActiveEncryptionKey(keyStore);
  if (activeKey && checkKeyRotation(activeKey, config.keyRotationDays)) {
    recommendations.push('Active key needs rotation');
    securityScore -= 15;
  }

  return {
    timestamp: Date.now(),
    config,
    activeKeys,
    totalKeys,
    auditLogCount: auditLogs.length,
    recommendations,
    securityScore: Math.max(0, securityScore),
  };
}

/**
 * Encrypt sensitive object
 */
export function encryptSensitiveObject(
  obj: Record<string, unknown>,
  sensitiveFields: string[],
  encryptionKey: EncryptionKey,
  config: EncryptionConfig
): Record<string, unknown> {
  const encrypted = { ...obj };

  for (const field of sensitiveFields) {
    if (field in encrypted && typeof encrypted[field] === 'string') {
      const encryptedData = encryptData(encrypted[field] as string, encryptionKey, config);
      encrypted[field] = encryptedData;
    }
  }

  return encrypted;
}

/**
 * Decrypt sensitive object
 */
export function decryptSensitiveObject(
  obj: Record<string, unknown>,
  sensitiveFields: string[],
  encryptionKey: EncryptionKey,
  config: EncryptionConfig
): Record<string, unknown> {
  const decrypted = { ...obj };

  for (const field of sensitiveFields) {
    if (field in decrypted && typeof decrypted[field] === 'object' && decrypted[field] !== null) {
      const encryptedData = decrypted[field] as EncryptedData;
      try {
        decrypted[field] = decryptData(encryptedData, encryptionKey, config);
      } catch {
        // Decryption failed, keep encrypted
      }
    }
  }

  return decrypted;
}

