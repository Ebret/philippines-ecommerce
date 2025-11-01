import { describe, it, expect, beforeEach } from 'vitest';
import {
  initializePCIDSSConfig,
  validateCreditCardNumber,
  validateCVV,
  validateCardExpiry,
  detectCardBrand,
  validatePaymentCard,
  generatePaymentToken,
  validatePaymentToken,
  createPaymentSession,
  validatePaymentSession,
  detectFraud,
  createPaymentTransaction,
  createPaymentSecurityLog,
  createPaymentSecurityLogStore,
  addPaymentSecurityLog,
  getPaymentSecurityLogsByTransaction,
  getPaymentSecurityLogsByUser,
  getPaymentSecurityLogsByRiskLevel,
  createPaymentTokenStore,
  storePaymentToken,
  retrievePaymentToken,
  revokePaymentToken,
  createPaymentSessionStore,
  storePaymentSession,
  retrievePaymentSession,
  invalidatePaymentSession,
  generatePCIDSSComplianceReport,
  createTransactionHistoryStore,
  addTransactionToHistory,
  getUserTransactionHistory,
  getTransactionsByStatus,
  getTransactionsByDateRange,
  calculateTransactionStatistics,
  PaymentCard,
} from '../lib/payment-security';

describe('Payment Security & PCI DSS Compliance', () => {
  let config: ReturnType<typeof initializePCIDSSConfig>;
  let tokenStore: ReturnType<typeof createPaymentTokenStore>;
  let sessionStore: ReturnType<typeof createPaymentSessionStore>;
  let logStore: ReturnType<typeof createPaymentSecurityLogStore>;
  let transactionHistory: ReturnType<typeof createTransactionHistoryStore>;

  beforeEach(() => {
    config = initializePCIDSSConfig();
    tokenStore = createPaymentTokenStore();
    sessionStore = createPaymentSessionStore();
    logStore = createPaymentSecurityLogStore();
    transactionHistory = createTransactionHistoryStore();
  });

  describe('PCI DSS Configuration', () => {
    it('should initialize PCI DSS config', () => {
      expect(config).toBeDefined();
      expect(config.version).toBe('3.2.1');
      expect(config.enabled).toBe(true);
      expect(config.requiresEncryption).toBe(true);
      expect(config.requiresTokenization).toBe(true);
    });
  });

  describe('Credit Card Validation', () => {
    it('should validate valid credit card number', () => {
      const valid = validateCreditCardNumber('4532015112830366');
      expect(valid).toBe(true);
    });

    it('should reject invalid credit card number', () => {
      const invalid = validateCreditCardNumber('1234567890123456');
      expect(invalid).toBe(false);
    });

    it('should validate CVV', () => {
      const valid = validateCVV('123');
      expect(valid).toBe(true);
    });

    it('should reject invalid CVV', () => {
      const invalid = validateCVV('12');
      expect(invalid).toBe(false);
    });

    it('should validate card expiry', () => {
      const now = new Date();
      const futureYear = now.getFullYear() + 1;
      const valid = validateCardExpiry(12, futureYear);
      expect(valid).toBe(true);
    });

    it('should reject expired card', () => {
      const now = new Date();
      const pastYear = now.getFullYear() - 1;
      const invalid = validateCardExpiry(1, pastYear);
      expect(invalid).toBe(false);
    });

    it('should detect Visa card', () => {
      const brand = detectCardBrand('4532015112830366');
      expect(brand).toBe('Visa');
    });

    it('should detect Mastercard', () => {
      const brand = detectCardBrand('5425233010103442');
      expect(brand).toBe('Mastercard');
    });

    it('should detect AmEx', () => {
      const brand = detectCardBrand('374245455400126');
      expect(brand).toBe('AmEx');
    });

    it('should validate complete payment card', () => {
      const now = new Date();
      const futureYear = now.getFullYear() + 1;
      const card: PaymentCard = {
        cardNumber: '4532015112830366',
        cardholderName: 'John Doe',
        expiryMonth: 12,
        expiryYear: futureYear,
        cvv: '123',
      };

      const result = validatePaymentCard(card);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject invalid payment card', () => {
      const card: PaymentCard = {
        cardNumber: '1234567890123456',
        cardholderName: '',
        expiryMonth: 13,
        expiryYear: 2020,
        cvv: '12',
      };

      const result = validatePaymentCard(card);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Payment Tokenization', () => {
    it('should generate payment token', () => {
      const now = new Date();
      const futureYear = now.getFullYear() + 1;
      const card: PaymentCard = {
        cardNumber: '4532015112830366',
        cardholderName: 'John Doe',
        expiryMonth: 12,
        expiryYear: futureYear,
        cvv: '123',
      };

      const token = generatePaymentToken(card);

      expect(token).toBeDefined();
      expect(token.token).toBeDefined();
      expect(token.cardLast4).toBe('0366');
      expect(token.cardBrand).toBe('Visa');
      expect(token.active).toBe(true);
    });

    it('should validate payment token', () => {
      const now = new Date();
      const futureYear = now.getFullYear() + 1;
      const card: PaymentCard = {
        cardNumber: '4532015112830366',
        cardholderName: 'John Doe',
        expiryMonth: 12,
        expiryYear: futureYear,
        cvv: '123',
      };

      const token = generatePaymentToken(card);
      const valid = validatePaymentToken(token);

      expect(valid).toBe(true);
    });

    it('should store and retrieve payment token', () => {
      const now = new Date();
      const futureYear = now.getFullYear() + 1;
      const card: PaymentCard = {
        cardNumber: '4532015112830366',
        cardholderName: 'John Doe',
        expiryMonth: 12,
        expiryYear: futureYear,
        cvv: '123',
      };

      const token = generatePaymentToken(card);
      storePaymentToken(tokenStore, token);

      const retrieved = retrievePaymentToken(tokenStore, token.token);

      expect(retrieved).toEqual(token);
    });

    it('should revoke payment token', () => {
      const now = new Date();
      const futureYear = now.getFullYear() + 1;
      const card: PaymentCard = {
        cardNumber: '4532015112830366',
        cardholderName: 'John Doe',
        expiryMonth: 12,
        expiryYear: futureYear,
        cvv: '123',
      };

      const token = generatePaymentToken(card);
      storePaymentToken(tokenStore, token);

      const revoked = revokePaymentToken(tokenStore, token.token);

      expect(revoked).toBe(true);
      const retrieved = retrievePaymentToken(tokenStore, token.token);
      expect(retrieved?.active).toBe(false);
    });
  });

  describe('Payment Sessions', () => {
    it('should create payment session', () => {
      const session = createPaymentSession('user123', '192.168.1.1', 'device123');

      expect(session).toBeDefined();
      expect(session.userId).toBe('user123');
      expect(session.ipAddress).toBe('192.168.1.1');
      expect(session.active).toBe(true);
    });

    it('should validate payment session', () => {
      const session = createPaymentSession('user123', '192.168.1.1');
      const valid = validatePaymentSession(session);

      expect(valid).toBe(true);
    });

    it('should store and retrieve payment session', () => {
      const session = createPaymentSession('user123', '192.168.1.1');
      storePaymentSession(sessionStore, session);

      const retrieved = retrievePaymentSession(sessionStore, session.id);

      expect(retrieved).toEqual(session);
    });

    it('should invalidate payment session', () => {
      const session = createPaymentSession('user123', '192.168.1.1');
      storePaymentSession(sessionStore, session);

      const invalidated = invalidatePaymentSession(sessionStore, session.id);

      expect(invalidated).toBe(true);
    });
  });

  describe('Payment Transactions', () => {
    it('should create payment transaction', () => {
      const transaction = createPaymentTransaction(
        1000,
        'PHP',
        'token123',
        'user123',
        '192.168.1.1',
        10,
        false
      );

      expect(transaction).toBeDefined();
      expect(transaction.amount).toBe(1000);
      expect(transaction.currency).toBe('PHP');
      expect(transaction.status).toBe('pending');
    });

    it('should add transaction to history', () => {
      const transaction = createPaymentTransaction(1000, 'PHP', 'token123', 'user123', '192.168.1.1');
      addTransactionToHistory(transactionHistory, transaction);

      expect(transactionHistory).toHaveLength(1);
    });

    it('should get user transaction history', () => {
      const txn1 = createPaymentTransaction(1000, 'PHP', 'token123', 'user123', '192.168.1.1');
      const txn2 = createPaymentTransaction(2000, 'PHP', 'token456', 'user456', '192.168.1.2');

      addTransactionToHistory(transactionHistory, txn1);
      addTransactionToHistory(transactionHistory, txn2);

      const userHistory = getUserTransactionHistory(transactionHistory, 'user123');

      expect(userHistory).toHaveLength(1);
      expect(userHistory[0].userId).toBe('user123');
    });

    it('should get transactions by status', () => {
      const txn1 = createPaymentTransaction(1000, 'PHP', 'token123', 'user123', '192.168.1.1');
      txn1.status = 'completed';

      const txn2 = createPaymentTransaction(2000, 'PHP', 'token456', 'user123', '192.168.1.1');
      txn2.status = 'failed';

      addTransactionToHistory(transactionHistory, txn1);
      addTransactionToHistory(transactionHistory, txn2);

      const completed = getTransactionsByStatus(transactionHistory, 'completed');

      expect(completed).toHaveLength(1);
      expect(completed[0].status).toBe('completed');
    });

    it('should get transactions by date range', () => {
      const now = Date.now();
      const txn1 = createPaymentTransaction(1000, 'PHP', 'token123', 'user123', '192.168.1.1');
      addTransactionToHistory(transactionHistory, txn1);

      const inRange = getTransactionsByDateRange(transactionHistory, now - 1000, now + 1000);

      expect(inRange.length).toBeGreaterThan(0);
    });

    it('should calculate transaction statistics', () => {
      const txn1 = createPaymentTransaction(1000, 'PHP', 'token123', 'user123', '192.168.1.1');
      txn1.status = 'completed';

      const txn2 = createPaymentTransaction(2000, 'PHP', 'token456', 'user123', '192.168.1.1');
      txn2.status = 'completed';

      addTransactionToHistory(transactionHistory, txn1);
      addTransactionToHistory(transactionHistory, txn2);

      const stats = calculateTransactionStatistics(transactionHistory);

      expect(stats.totalTransactions).toBe(2);
      expect(stats.totalAmount).toBe(3000);
      expect(stats.averageAmount).toBe(1500);
      expect(stats.successRate).toBe(100);
    });
  });

  describe('Fraud Detection', () => {
    it('should detect low-risk transaction', () => {
      const transaction = createPaymentTransaction(1000, 'PHP', 'token123', 'user123', '192.168.1.1');
      const result = detectFraud(transaction, []);

      expect(result.isFraudulent).toBe(false);
      expect(result.riskScore).toBeLessThan(30);
      expect(result.recommendation).toBe('approve');
    });

    it('should detect unusual transaction amount', () => {
      const transaction = createPaymentTransaction(100000, 'PHP', 'token123', 'user123', '192.168.1.1');
      const history = [
        createPaymentTransaction(1000, 'PHP', 'token123', 'user123', '192.168.1.1'),
        createPaymentTransaction(1500, 'PHP', 'token123', 'user123', '192.168.1.1'),
      ];

      const result = detectFraud(transaction, history);

      expect(result.riskScore).toBeGreaterThan(0);
      expect(result.riskFactors.length).toBeGreaterThan(0);
    });

    it('should detect rapid transactions', () => {
      const transaction = createPaymentTransaction(1000, 'PHP', 'token123', 'user123', '192.168.1.1');
      const now = Date.now();
      const history = [
        createPaymentTransaction(1000, 'PHP', 'token123', 'user123', '192.168.1.1'),
        createPaymentTransaction(1000, 'PHP', 'token123', 'user123', '192.168.1.1'),
        createPaymentTransaction(1000, 'PHP', 'token123', 'user123', '192.168.1.1'),
      ];

      const result = detectFraud(transaction, history);

      expect(result.riskScore).toBeGreaterThan(0);
    });
  });

  describe('Payment Security Logging', () => {
    it('should create payment security log', () => {
      const log = createPaymentSecurityLog('tokenize', 'success', 'low', 'txn123', 'user123', '192.168.1.1');

      expect(log).toBeDefined();
      expect(log.action).toBe('tokenize');
      expect(log.status).toBe('success');
      expect(log.riskLevel).toBe('low');
    });

    it('should add payment security log', () => {
      const log = createPaymentSecurityLog('tokenize', 'success');
      addPaymentSecurityLog(logStore, log);

      expect(logStore).toHaveLength(1);
    });

    it('should get payment security logs by transaction', () => {
      const log1 = createPaymentSecurityLog('tokenize', 'success', 'low', 'txn123');
      const log2 = createPaymentSecurityLog('process', 'success', 'low', 'txn456');

      addPaymentSecurityLog(logStore, log1);
      addPaymentSecurityLog(logStore, log2);

      const txnLogs = getPaymentSecurityLogsByTransaction(logStore, 'txn123');

      expect(txnLogs).toHaveLength(1);
      expect(txnLogs[0].transactionId).toBe('txn123');
    });

    it('should get payment security logs by user', () => {
      const log1 = createPaymentSecurityLog('tokenize', 'success', 'low', 'txn123', 'user123');
      const log2 = createPaymentSecurityLog('process', 'success', 'low', 'txn456', 'user456');

      addPaymentSecurityLog(logStore, log1);
      addPaymentSecurityLog(logStore, log2);

      const userLogs = getPaymentSecurityLogsByUser(logStore, 'user123');

      expect(userLogs).toHaveLength(1);
      expect(userLogs[0].userId).toBe('user123');
    });

    it('should get payment security logs by risk level', () => {
      const log1 = createPaymentSecurityLog('tokenize', 'success', 'high');
      const log2 = createPaymentSecurityLog('process', 'success', 'low');

      addPaymentSecurityLog(logStore, log1);
      addPaymentSecurityLog(logStore, log2);

      const highRiskLogs = getPaymentSecurityLogsByRiskLevel(logStore, 'high');

      expect(highRiskLogs).toHaveLength(1);
      expect(highRiskLogs[0].riskLevel).toBe('high');
    });
  });

  describe('PCI DSS Compliance Report', () => {
    it('should generate PCI DSS compliance report', () => {
      const now = new Date();
      const futureYear = now.getFullYear() + 1;
      const card: PaymentCard = {
        cardNumber: '4532015112830366',
        cardholderName: 'John Doe',
        expiryMonth: 12,
        expiryYear: futureYear,
        cvv: '123',
      };

      const token = generatePaymentToken(card);
      storePaymentToken(tokenStore, token);

      const report = generatePCIDSSComplianceReport(config, tokenStore, logStore);

      expect(report.timestamp).toBeDefined();
      expect(report.activeTokens).toBe(1);
      expect(report.totalTokens).toBe(1);
      expect(report.complianceScore).toBeGreaterThan(0);
    });

    it('should provide recommendations for disabled encryption', () => {
      config.requiresEncryption = false;

      const report = generatePCIDSSComplianceReport(config, tokenStore, logStore);

      expect(report.recommendations.length).toBeGreaterThan(0);
      expect(report.complianceScore).toBeLessThan(100);
    });
  });
});

