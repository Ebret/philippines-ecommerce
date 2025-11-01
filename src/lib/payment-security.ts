/**
 * Payment Security & PCI DSS Compliance
 * Handles secure payment processing, tokenization, and fraud detection
 */

import crypto from 'crypto';

export interface PaymentCard {
  cardNumber: string;
  cardholderName: string;
  expiryMonth: number;
  expiryYear: number;
  cvv: string;
}

export interface PaymentToken {
  token: string;
  cardLast4: string;
  cardBrand: string;
  expiryMonth: number;
  expiryYear: number;
  createdAt: number;
  expiresAt: number;
  active: boolean;
}

export interface PaymentTransaction {
  id: string;
  amount: number;
  currency: string;
  tokenId: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  timestamp: number;
  userId: string;
  ipAddress: string;
  deviceId?: string;
  riskScore: number;
  fraudDetected: boolean;
}

export interface PCIDSSConfig {
  id: string;
  version: string;
  enabled: boolean;
  requiresEncryption: boolean;
  requiresTokenization: boolean;
  requiresAuditLogging: boolean;
  dataRetentionDays: number;
  cvvRetentionDays: number;
  createdAt: number;
  updatedAt: number;
}

export interface PaymentSecurityLog {
  id: string;
  timestamp: number;
  action: string;
  transactionId?: string;
  userId?: string;
  ipAddress?: string;
  status: 'success' | 'failure';
  details?: Record<string, unknown>;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface FraudDetectionResult {
  isFraudulent: boolean;
  riskScore: number;
  riskFactors: string[];
  recommendation: 'approve' | 'review' | 'decline';
}

export interface PaymentSession {
  id: string;
  userId: string;
  sessionToken: string;
  createdAt: number;
  expiresAt: number;
  active: boolean;
  ipAddress: string;
  deviceId?: string;
}

/**
 * Initialize PCI DSS configuration
 */
export function initializePCIDSSConfig(): PCIDSSConfig {
  return {
    id: `pci_${Date.now()}`,
    version: '3.2.1',
    enabled: true,
    requiresEncryption: true,
    requiresTokenization: true,
    requiresAuditLogging: true,
    dataRetentionDays: 90,
    cvvRetentionDays: 0, // Never store CVV
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

/**
 * Validate credit card number using Luhn algorithm
 */
export function validateCreditCardNumber(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);

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
 * Validate CVV
 */
export function validateCVV(cvv: string): boolean {
  const cvvRegex = /^\d{3,4}$/;
  return cvvRegex.test(cvv);
}

/**
 * Validate card expiry
 */
export function validateCardExpiry(month: number, year: number): boolean {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;
  if (month < 1 || month > 12) return false;

  return true;
}

/**
 * Detect card brand
 */
export function detectCardBrand(cardNumber: string): string {
  const digits = cardNumber.replace(/\D/g, '');

  if (/^4[0-9]{12}(?:[0-9]{3})?$/.test(digits)) return 'Visa';
  if (/^5[1-5][0-9]{14}$/.test(digits)) return 'Mastercard';
  if (/^3[47][0-9]{13}$/.test(digits)) return 'AmEx';
  if (/^6(?:011|5[0-9]{2})[0-9]{12}$/.test(digits)) return 'Discover';
  if (/^(?:2131|1800|35\d{3})\d{11}$/.test(digits)) return 'JCB';

  return 'Unknown';
}

/**
 * Validate payment card
 */
export function validatePaymentCard(card: PaymentCard): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!validateCreditCardNumber(card.cardNumber)) {
    errors.push('Invalid credit card number');
  }

  if (!validateCVV(card.cvv)) {
    errors.push('Invalid CVV');
  }

  if (!validateCardExpiry(card.expiryMonth, card.expiryYear)) {
    errors.push('Card has expired or invalid expiry date');
  }

  if (!card.cardholderName || card.cardholderName.trim().length === 0) {
    errors.push('Cardholder name is required');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Generate payment token
 */
export function generatePaymentToken(card: PaymentCard): PaymentToken {
  const tokenData = `${card.cardNumber}${Date.now()}${Math.random()}`;
  const token = crypto.createHash('sha256').update(tokenData).digest('hex');
  const cardLast4 = card.cardNumber.slice(-4);
  const cardBrand = detectCardBrand(card.cardNumber);

  return {
    token,
    cardLast4,
    cardBrand,
    expiryMonth: card.expiryMonth,
    expiryYear: card.expiryYear,
    createdAt: Date.now(),
    expiresAt: Date.now() + 365 * 24 * 60 * 60 * 1000, // 1 year
    active: true,
  };
}

/**
 * Validate payment token
 */
export function validatePaymentToken(token: PaymentToken): boolean {
  if (!token.active) return false;
  if (token.expiresAt < Date.now()) return false;
  if (!token.token || token.token.length === 0) return false;

  return true;
}

/**
 * Create payment session
 */
export function createPaymentSession(
  userId: string,
  ipAddress: string,
  deviceId?: string
): PaymentSession {
  const sessionToken = crypto.randomBytes(32).toString('hex');
  const now = Date.now();
  const expiresAt = now + 30 * 60 * 1000; // 30 minutes

  return {
    id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    sessionToken,
    createdAt: now,
    expiresAt,
    active: true,
    ipAddress,
    deviceId,
  };
}

/**
 * Validate payment session
 */
export function validatePaymentSession(session: PaymentSession): boolean {
  if (!session.active) return false;
  if (session.expiresAt < Date.now()) return false;
  if (!session.sessionToken || session.sessionToken.length === 0) return false;

  return true;
}

/**
 * Detect fraud using multiple factors
 */
export function detectFraud(transaction: PaymentTransaction, userHistory: PaymentTransaction[]): FraudDetectionResult {
  let riskScore = 0;
  const riskFactors: string[] = [];

  // Check for unusual amount
  if (userHistory.length > 0) {
    const avgAmount = userHistory.reduce((sum, t) => sum + t.amount, 0) / userHistory.length;
    if (transaction.amount > avgAmount * 3) {
      riskScore += 20;
      riskFactors.push('Unusual transaction amount');
    }
  }

  // Check for rapid transactions
  const recentTransactions = userHistory.filter((t) => Date.now() - t.timestamp < 5 * 60 * 1000);
  if (recentTransactions.length > 2) {
    riskScore += 25;
    riskFactors.push('Multiple rapid transactions');
  }

  // Check for high-risk countries (simplified)
  const highRiskCountries = ['KP', 'IR', 'SY'];
  if (highRiskCountries.includes(transaction.ipAddress.substring(0, 2))) {
    riskScore += 30;
    riskFactors.push('High-risk country detected');
  }

  // Check for velocity abuse
  const dailyTransactions = userHistory.filter((t) => Date.now() - t.timestamp < 24 * 60 * 60 * 1000);
  if (dailyTransactions.length > 10) {
    riskScore += 20;
    riskFactors.push('High transaction velocity');
  }

  // Determine recommendation
  let recommendation: 'approve' | 'review' | 'decline' = 'approve';
  if (riskScore >= 50) {
    recommendation = 'decline';
  } else if (riskScore >= 30) {
    recommendation = 'review';
  }

  return {
    isFraudulent: riskScore >= 50,
    riskScore: Math.min(100, riskScore),
    riskFactors,
    recommendation,
  };
}

/**
 * Create payment transaction
 */
export function createPaymentTransaction(
  amount: number,
  currency: string,
  tokenId: string,
  userId: string,
  ipAddress: string,
  riskScore: number = 0,
  fraudDetected: boolean = false,
  deviceId?: string
): PaymentTransaction {
  return {
    id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    amount,
    currency,
    tokenId,
    status: 'pending',
    timestamp: Date.now(),
    userId,
    ipAddress,
    deviceId,
    riskScore,
    fraudDetected,
  };
}

/**
 * Create payment security log
 */
export function createPaymentSecurityLog(
  action: string,
  status: 'success' | 'failure',
  riskLevel: 'low' | 'medium' | 'high' = 'low',
  transactionId?: string,
  userId?: string,
  ipAddress?: string,
  details?: Record<string, unknown>
): PaymentSecurityLog {
  return {
    id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now(),
    action,
    transactionId,
    userId,
    ipAddress,
    status,
    details,
    riskLevel,
  };
}

/**
 * Create payment security log store
 */
export function createPaymentSecurityLogStore(): PaymentSecurityLog[] {
  return [];
}

/**
 * Add payment security log
 */
export function addPaymentSecurityLog(store: PaymentSecurityLog[], log: PaymentSecurityLog): void {
  store.push(log);
}

/**
 * Get payment security logs by transaction
 */
export function getPaymentSecurityLogsByTransaction(
  store: PaymentSecurityLog[],
  transactionId: string
): PaymentSecurityLog[] {
  return store.filter((log) => log.transactionId === transactionId);
}

/**
 * Get payment security logs by user
 */
export function getPaymentSecurityLogsByUser(store: PaymentSecurityLog[], userId: string): PaymentSecurityLog[] {
  return store.filter((log) => log.userId === userId);
}

/**
 * Get payment security logs by risk level
 */
export function getPaymentSecurityLogsByRiskLevel(
  store: PaymentSecurityLog[],
  riskLevel: 'low' | 'medium' | 'high'
): PaymentSecurityLog[] {
  return store.filter((log) => log.riskLevel === riskLevel);
}

/**
 * Create payment token store
 */
export function createPaymentTokenStore(): Map<string, PaymentToken> {
  return new Map();
}

/**
 * Store payment token
 */
export function storePaymentToken(store: Map<string, PaymentToken>, token: PaymentToken): void {
  store.set(token.token, token);
}

/**
 * Retrieve payment token
 */
export function retrievePaymentToken(store: Map<string, PaymentToken>, tokenId: string): PaymentToken | undefined {
  return store.get(tokenId);
}

/**
 * Revoke payment token
 */
export function revokePaymentToken(store: Map<string, PaymentToken>, tokenId: string): boolean {
  const token = store.get(tokenId);
  if (token) {
    token.active = false;
    return true;
  }
  return false;
}

/**
 * Create payment session store
 */
export function createPaymentSessionStore(): Map<string, PaymentSession> {
  return new Map();
}

/**
 * Store payment session
 */
export function storePaymentSession(store: Map<string, PaymentSession>, session: PaymentSession): void {
  store.set(session.id, session);
}

/**
 * Retrieve payment session
 */
export function retrievePaymentSession(store: Map<string, PaymentSession>, sessionId: string): PaymentSession | undefined {
  return store.get(sessionId);
}

/**
 * Invalidate payment session
 */
export function invalidatePaymentSession(store: Map<string, PaymentSession>, sessionId: string): boolean {
  const session = store.get(sessionId);
  if (session) {
    session.active = false;
    return true;
  }
  return false;
}

/**
 * Generate PCI DSS compliance report
 */
export function generatePCIDSSComplianceReport(
  config: PCIDSSConfig,
  tokenStore: Map<string, PaymentToken>,
  logStore: PaymentSecurityLog[]
): {
  timestamp: number;
  config: PCIDSSConfig;
  activeTokens: number;
  totalTokens: number;
  securityLogCount: number;
  complianceScore: number;
  recommendations: string[];
} {
  const activeTokens = Array.from(tokenStore.values()).filter((t) => t.active).length;
  const totalTokens = tokenStore.size;
  const recommendations: string[] = [];
  let complianceScore = 100;

  if (!config.enabled) {
    recommendations.push('Enable PCI DSS compliance');
    complianceScore -= 30;
  }

  if (!config.requiresEncryption) {
    recommendations.push('Enable payment data encryption');
    complianceScore -= 20;
  }

  if (!config.requiresTokenization) {
    recommendations.push('Enable payment tokenization');
    complianceScore -= 25;
  }

  if (!config.requiresAuditLogging) {
    recommendations.push('Enable audit logging for payment transactions');
    complianceScore -= 15;
  }

  if (totalTokens === 0) {
    recommendations.push('No payment tokens configured');
    complianceScore -= 10;
  }

  // Check for high-risk logs
  const highRiskLogs = logStore.filter((log) => log.riskLevel === 'high');
  if (highRiskLogs.length > 5) {
    recommendations.push('Review high-risk payment activities');
    complianceScore -= 10;
  }

  return {
    timestamp: Date.now(),
    config,
    activeTokens,
    totalTokens,
    securityLogCount: logStore.length,
    complianceScore: Math.max(0, complianceScore),
    recommendations,
  };
}

/**
 * Create transaction history store
 */
export function createTransactionHistoryStore(): PaymentTransaction[] {
  return [];
}

/**
 * Add transaction to history
 */
export function addTransactionToHistory(store: PaymentTransaction[], transaction: PaymentTransaction): void {
  store.push(transaction);
}

/**
 * Get user transaction history
 */
export function getUserTransactionHistory(store: PaymentTransaction[], userId: string): PaymentTransaction[] {
  return store.filter((t) => t.userId === userId);
}

/**
 * Get transactions by status
 */
export function getTransactionsByStatus(
  store: PaymentTransaction[],
  status: 'pending' | 'completed' | 'failed' | 'refunded'
): PaymentTransaction[] {
  return store.filter((t) => t.status === status);
}

/**
 * Get transactions by date range
 */
export function getTransactionsByDateRange(
  store: PaymentTransaction[],
  startTime: number,
  endTime: number
): PaymentTransaction[] {
  return store.filter((t) => t.timestamp >= startTime && t.timestamp <= endTime);
}

/**
 * Calculate transaction statistics
 */
export function calculateTransactionStatistics(transactions: PaymentTransaction[]): {
  totalTransactions: number;
  totalAmount: number;
  averageAmount: number;
  successRate: number;
  fraudRate: number;
} {
  if (transactions.length === 0) {
    return {
      totalTransactions: 0,
      totalAmount: 0,
      averageAmount: 0,
      successRate: 0,
      fraudRate: 0,
    };
  }

  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
  const successCount = transactions.filter((t) => t.status === 'completed').length;
  const fraudCount = transactions.filter((t) => t.fraudDetected).length;

  return {
    totalTransactions: transactions.length,
    totalAmount,
    averageAmount: totalAmount / transactions.length,
    successRate: (successCount / transactions.length) * 100,
    fraudRate: (fraudCount / transactions.length) * 100,
  };
}

