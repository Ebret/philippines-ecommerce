import { describe, it, expect, beforeEach } from 'vitest';
import {
  initializeEncryptionConfig,
  generateEncryptionKey,
  encryptData,
  decryptData,
  hashPassword,
  verifyPassword,
  maskEmail,
  maskPhoneNumber,
  maskCreditCard,
  maskSSN,
  maskAddress,
  maskSensitiveData,
  initializeAuditLog,
  createAuditLog,
  initializeDataMaskConfig,
  checkKeyRotation,
  rotateEncryptionKey,
  createKeyStore,
  storeEncryptionKey,
  retrieveEncryptionKey,
  getActiveEncryptionKey,
  deactivateOldKeys,
  createAuditLogStore,
  addAuditLog,
  getAuditLogsByAction,
  getAuditLogsByUser,
  getAuditLogsByDateRange,
  generateDataProtectionReport,
  encryptSensitiveObject,
  decryptSensitiveObject,
} from '../lib/data-protection-encryption';

describe('Data Protection & Encryption', () => {
  let config: ReturnType<typeof initializeEncryptionConfig>;
  let encryptionKey: ReturnType<typeof generateEncryptionKey>;
  let keyStore: ReturnType<typeof createKeyStore>;
  let auditLogs: ReturnType<typeof createAuditLogStore>;

  beforeEach(() => {
    config = initializeEncryptionConfig();
    encryptionKey = generateEncryptionKey(config);
    keyStore = createKeyStore();
    auditLogs = createAuditLogStore();
  });

  describe('Encryption Configuration', () => {
    it('should initialize encryption config', () => {
      expect(config).toBeDefined();
      expect(config.algorithm).toBe('aes-256-cbc');
      expect(config.keyLength).toBe(32);
      expect(config.ivLength).toBe(16);
      expect(config.enabled).toBe(true);
    });

    it('should generate encryption key', () => {
      expect(encryptionKey).toBeDefined();
      expect(encryptionKey.key).toBeDefined();
      expect(encryptionKey.iv).toBeDefined();
      expect(encryptionKey.active).toBe(true);
      expect(encryptionKey.version).toBe(1);
    });
  });

  describe('Data Encryption & Decryption', () => {
    it('should encrypt data', () => {
      const plaintext = 'sensitive data';
      const encrypted = encryptData(plaintext, encryptionKey, config);

      expect(encrypted).toBeDefined();
      expect(encrypted.encrypted).toBeDefined();
      expect(encrypted.iv).toBeDefined();
      expect(encrypted.keyId).toBe(encryptionKey.id);
      expect(encrypted.encrypted).not.toBe(plaintext);
    });

    it('should decrypt data', () => {
      const plaintext = 'sensitive data';
      const encrypted = encryptData(plaintext, encryptionKey, config);
      const decrypted = decryptData(encrypted, encryptionKey, config);

      expect(decrypted).toBe(plaintext);
    });

    it('should handle multiple encryptions differently', () => {
      const plaintext = 'same data';
      const encrypted1 = encryptData(plaintext, encryptionKey, config);
      const encrypted2 = encryptData(plaintext, encryptionKey, config);

      expect(encrypted1.encrypted).not.toBe(encrypted2.encrypted);
    });

    it('should encrypt payment information', () => {
      const cardNumber = '4532015112830366';
      const encrypted = encryptData(cardNumber, encryptionKey, config);
      const decrypted = decryptData(encrypted, encryptionKey, config);

      expect(decrypted).toBe(cardNumber);
    });

    it('should encrypt PII data', () => {
      const ssn = '123-45-6789';
      const encrypted = encryptData(ssn, encryptionKey, config);
      const decrypted = decryptData(encrypted, encryptionKey, config);

      expect(decrypted).toBe(ssn);
    });
  });

  describe('Password Hashing & Verification', () => {
    it('should hash password', () => {
      const password = 'SecurePass123!';
      const hash = hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash.hash).toBeDefined();
      expect(hash.salt).toBeDefined();
      expect(hash.algorithm).toBe('pbkdf2');
      expect(hash.iterations).toBe(10);
    });

    it('should verify correct password', () => {
      const password = 'SecurePass123!';
      const hash = hashPassword(password);

      const verified = verifyPassword(password, hash);

      expect(verified).toBe(true);
    });

    it('should reject incorrect password', () => {
      const password = 'SecurePass123!';
      const hash = hashPassword(password);

      const verified = verifyPassword('WrongPassword', hash);

      expect(verified).toBe(false);
    });

    it('should generate different hashes for same password', () => {
      const password = 'SecurePass123!';
      const hash1 = hashPassword(password);
      const hash2 = hashPassword(password);

      expect(hash1.hash).not.toBe(hash2.hash);
      expect(hash1.salt).not.toBe(hash2.salt);
    });
  });

  describe('Data Masking', () => {
    it('should mask email address', () => {
      const email = 'user@example.com';
      const masked = maskEmail(email);

      expect(masked).toContain('@example.com');
      expect(masked).toContain('*');
      expect(masked).not.toContain('user@');
    });

    it('should mask phone number', () => {
      const phone = '09123456789';
      const masked = maskPhoneNumber(phone);

      expect(masked).toContain('6789');
      expect(masked).toContain('*');
      expect(masked).not.toContain('0912');
    });

    it('should mask credit card', () => {
      const card = '4532015112830366';
      const masked = maskCreditCard(card);

      expect(masked).toContain('0366');
      expect(masked).toContain('*');
      expect(masked).not.toContain('4532');
    });

    it('should mask SSN', () => {
      const ssn = '123-45-6789';
      const masked = maskSSN(ssn);

      expect(masked).toContain('6789');
      expect(masked).toContain('*');
    });

    it('should mask address', () => {
      const address = '123 Main Street, City, State 12345';
      const masked = maskAddress(address);

      expect(masked).toContain('123 Main S');
      expect(masked).toContain('*');
    });

    it('should mask sensitive data in object', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '09123456789',
        cardNumber: '4532015112830366',
      };

      const maskConfig = initializeDataMaskConfig();
      const masked = maskSensitiveData(data, maskConfig);

      expect(masked.email).toContain('*');
      expect(masked.phone).toContain('*');
      expect(masked.cardNumber).toContain('*');
      expect(masked.name).toBe('John Doe');
    });
  });

  describe('Audit Logging', () => {
    it('should initialize audit log', () => {
      const log = initializeAuditLog('encrypt', 'payment_info', 'success', 'user123', '192.168.1.1');

      expect(log).toBeDefined();
      expect(log.action).toBe('encrypt');
      expect(log.dataType).toBe('payment_info');
      expect(log.status).toBe('success');
      expect(log.userId).toBe('user123');
      expect(log.ipAddress).toBe('192.168.1.1');
    });

    it('should create audit log with details', () => {
      const details = { fieldCount: 5, encryptionTime: 10 };
      const log = createAuditLog('encrypt', 'payment_info', details, 'user123');

      expect(log.details).toEqual(details);
    });

    it('should add audit log to store', () => {
      const log = initializeAuditLog('encrypt', 'payment_info');
      addAuditLog(auditLogs, log);

      expect(auditLogs).toHaveLength(1);
      expect(auditLogs[0]).toEqual(log);
    });

    it('should get audit logs by action', () => {
      addAuditLog(auditLogs, initializeAuditLog('encrypt', 'payment_info'));
      addAuditLog(auditLogs, initializeAuditLog('decrypt', 'payment_info'));
      addAuditLog(auditLogs, initializeAuditLog('encrypt', 'pii_data'));

      const encryptLogs = getAuditLogsByAction(auditLogs, 'encrypt');

      expect(encryptLogs).toHaveLength(2);
    });

    it('should get audit logs by user', () => {
      addAuditLog(auditLogs, initializeAuditLog('encrypt', 'payment_info', 'success', 'user1'));
      addAuditLog(auditLogs, initializeAuditLog('decrypt', 'payment_info', 'success', 'user2'));
      addAuditLog(auditLogs, initializeAuditLog('encrypt', 'pii_data', 'success', 'user1'));

      const user1Logs = getAuditLogsByUser(auditLogs, 'user1');

      expect(user1Logs).toHaveLength(2);
    });

    it('should get audit logs by date range', () => {
      const now = Date.now();
      addAuditLog(auditLogs, initializeAuditLog('encrypt', 'payment_info'));
      addAuditLog(auditLogs, initializeAuditLog('decrypt', 'payment_info'));

      const logsInRange = getAuditLogsByDateRange(auditLogs, now - 1000, now + 1000);

      expect(logsInRange.length).toBeGreaterThan(0);
    });
  });

  describe('Key Management', () => {
    it('should check key rotation', () => {
      const needsRotation = checkKeyRotation(encryptionKey, 90);

      expect(needsRotation).toBe(false);
    });

    it('should rotate encryption key', () => {
      const newKey = rotateEncryptionKey(encryptionKey, config);

      expect(newKey.version).toBe(encryptionKey.version + 1);
      expect(newKey.id).not.toBe(encryptionKey.id);
      expect(newKey.active).toBe(true);
    });

    it('should store and retrieve encryption key', () => {
      storeEncryptionKey(keyStore, encryptionKey);

      const retrieved = retrieveEncryptionKey(keyStore, encryptionKey.id);

      expect(retrieved).toEqual(encryptionKey);
    });

    it('should get active encryption key', () => {
      storeEncryptionKey(keyStore, encryptionKey);

      const activeKey = getActiveEncryptionKey(keyStore);

      expect(activeKey).toEqual(encryptionKey);
    });

    it('should deactivate old keys', () => {
      const key1 = generateEncryptionKey(config);
      key1.version = 1;
      const key2 = generateEncryptionKey(config);
      key2.version = 2;
      const key3 = generateEncryptionKey(config);
      key3.version = 3;

      storeEncryptionKey(keyStore, key1);
      storeEncryptionKey(keyStore, key2);
      storeEncryptionKey(keyStore, key3);

      deactivateOldKeys(keyStore, 2);

      const activeKeys = Array.from(keyStore.values()).filter((k) => k.active);
      expect(activeKeys.length).toBeLessThanOrEqual(2);
    });
  });

  describe('Data Mask Configuration', () => {
    it('should initialize data mask config', () => {
      const maskConfig = initializeDataMaskConfig();

      expect(maskConfig.maskEmail).toBe(true);
      expect(maskConfig.maskPhone).toBe(true);
      expect(maskConfig.maskCreditCard).toBe(true);
      expect(maskConfig.maskSSN).toBe(true);
      expect(maskConfig.maskAddress).toBe(true);
      expect(maskConfig.visibleChars).toBe(4);
    });
  });

  describe('Sensitive Object Encryption', () => {
    it('should encrypt sensitive object fields', () => {
      const obj = {
        name: 'John Doe',
        email: 'john@example.com',
        cardNumber: '4532015112830366',
      };

      const encrypted = encryptSensitiveObject(obj, ['cardNumber'], encryptionKey, config);

      expect(encrypted.name).toBe('John Doe');
      expect(encrypted.email).toBe('john@example.com');
      expect(typeof encrypted.cardNumber).toBe('object');
    });

    it('should decrypt sensitive object fields', () => {
      const obj = {
        name: 'John Doe',
        cardNumber: '4532015112830366',
      };

      const encrypted = encryptSensitiveObject(obj, ['cardNumber'], encryptionKey, config);
      const decrypted = decryptSensitiveObject(encrypted, ['cardNumber'], encryptionKey, config);

      expect(decrypted.cardNumber).toBe('4532015112830366');
    });
  });

  describe('Data Protection Report', () => {
    it('should generate data protection report', () => {
      storeEncryptionKey(keyStore, encryptionKey);
      addAuditLog(auditLogs, initializeAuditLog('encrypt', 'payment_info'));

      const report = generateDataProtectionReport(config, keyStore, auditLogs);

      expect(report.timestamp).toBeDefined();
      expect(report.activeKeys).toBe(1);
      expect(report.totalKeys).toBe(1);
      expect(report.auditLogCount).toBe(1);
      expect(report.securityScore).toBeGreaterThan(0);
    });

    it('should provide recommendations for no active keys', () => {
      const report = generateDataProtectionReport(config, keyStore, auditLogs);

      expect(report.recommendations.length).toBeGreaterThan(0);
      expect(report.recommendations[0]).toContain('No active encryption keys');
    });
  });
});

