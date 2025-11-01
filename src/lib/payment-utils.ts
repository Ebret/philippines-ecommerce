import crypto from "crypto";
import { PaymentMethod, PaymentStatus } from "./validations/payment";

/**
 * Generate unique transaction ID
 */
export function generateTransactionId(): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 15);
  return `TXN-${timestamp}-${randomStr}`.toUpperCase();
}

/**
 * Generate receipt number
 */
export function generateReceiptNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `RCP-${year}${month}${day}-${random}`;
}

/**
 * Calculate processing fee based on payment method
 */
export function calculateProcessingFee(
  amount: number,
  method: PaymentMethod
): number {
  const feePercentages: Record<PaymentMethod, number> = {
    [PaymentMethod.GCASH]: 0.02, // 2%
    [PaymentMethod.PAYMAYA]: 0.025, // 2.5%
    [PaymentMethod.CREDIT_CARD]: 0.03, // 3%
    [PaymentMethod.DEBIT_CARD]: 0.02, // 2%
    [PaymentMethod.BANK_TRANSFER]: 0.01, // 1%
    [PaymentMethod.COD]: 0, // No fee
  };

  const percentage = feePercentages[method] || 0;
  return Math.round(amount * percentage * 100) / 100;
}

/**
 * Calculate total amount with processing fee
 */
export function calculateTotalWithFee(
  amount: number,
  method: PaymentMethod
): number {
  const fee = calculateProcessingFee(amount, method);
  return Math.round((amount + fee) * 100) / 100;
}

/**
 * Validate card number using Luhn algorithm
 */
export function validateCardNumber(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, "");
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
 * Mask card number for display
 */
export function maskCardNumber(cardNumber: string): string {
  const digits = cardNumber.replace(/\D/g, "");
  const lastFour = digits.slice(-4);
  return `****-****-****-${lastFour}`;
}

/**
 * Validate CVV
 */
export function validateCVV(cvv: string): boolean {
  return /^\d{3,4}$/.test(cvv);
}

/**
 * Check if card is expired
 */
export function isCardExpired(month: number, year: number): boolean {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  if (year < currentYear) return true;
  if (year === currentYear && month < currentMonth) return true;

  return false;
}

/**
 * Generate HMAC signature for webhook verification
 */
export function generateWebhookSignature(
  payload: Record<string, any>,
  secret: string
): string {
  const message = JSON.stringify(payload);
  return crypto.createHmac("sha256", secret).update(message).digest("hex");
}

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(
  payload: Record<string, any>,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = generateWebhookSignature(payload, secret);
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

/**
 * Format payment status for display
 */
export function formatPaymentStatus(status: PaymentStatus): string {
  const statusMap: Record<PaymentStatus, string> = {
    [PaymentStatus.PENDING]: "Pending",
    [PaymentStatus.PROCESSING]: "Processing",
    [PaymentStatus.COMPLETED]: "Completed",
    [PaymentStatus.FAILED]: "Failed",
    [PaymentStatus.CANCELLED]: "Cancelled",
    [PaymentStatus.REFUNDED]: "Refunded",
    [PaymentStatus.PARTIALLY_REFUNDED]: "Partially Refunded",
  };
  return statusMap[status] || status;
}

/**
 * Format payment method for display
 */
export function formatPaymentMethod(method: PaymentMethod): string {
  const methodMap: Record<PaymentMethod, string> = {
    [PaymentMethod.GCASH]: "GCash",
    [PaymentMethod.PAYMAYA]: "PayMaya",
    [PaymentMethod.CREDIT_CARD]: "Credit Card",
    [PaymentMethod.DEBIT_CARD]: "Debit Card",
    [PaymentMethod.BANK_TRANSFER]: "Bank Transfer",
    [PaymentMethod.COD]: "Cash on Delivery",
  };
  return methodMap[method] || method;
}

/**
 * Check if payment method is available
 */
export function isPaymentMethodAvailable(
  method: PaymentMethod,
  amount: number,
  enabledMethods: Record<PaymentMethod, boolean>
): boolean {
  if (!enabledMethods[method]) return false;

  // COD has a maximum amount limit
  if (method === PaymentMethod.COD && amount > 50000) return false;

  return true;
}

/**
 * Calculate refund amount
 */
export function calculateRefundAmount(
  originalAmount: number,
  refundPercentage: number = 100
): number {
  const refundAmount = (originalAmount * refundPercentage) / 100;
  return Math.round(refundAmount * 100) / 100;
}

/**
 * Generate payment reference code
 */
export function generatePaymentReference(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Validate Philippine phone number
 */
export function validatePhoneNumber(phone: string): boolean {
  return /^09\d{9}$/.test(phone);
}

/**
 * Format Philippine phone number
 */
export function formatPhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length !== 11) return phone;
  return `+63${digits.substring(1)}`;
}

/**
 * Check if payment is eligible for refund
 */
export function isEligibleForRefund(
  status: PaymentStatus,
  daysSincePayment: number
): boolean {
  // Can only refund completed payments
  if (status !== PaymentStatus.COMPLETED) return false;

  // Refund window is 30 days
  if (daysSincePayment > 30) return false;

  return true;
}

/**
 * Get payment method icon
 */
export function getPaymentMethodIcon(method: PaymentMethod): string {
  const iconMap: Record<PaymentMethod, string> = {
    [PaymentMethod.GCASH]: "💳",
    [PaymentMethod.PAYMAYA]: "💳",
    [PaymentMethod.CREDIT_CARD]: "💳",
    [PaymentMethod.DEBIT_CARD]: "💳",
    [PaymentMethod.BANK_TRANSFER]: "🏦",
    [PaymentMethod.COD]: "🚚",
  };
  return iconMap[method] || "💰";
}

/**
 * Encrypt sensitive payment data
 */
export function encryptPaymentData(
  data: string,
  encryptionKey: string
): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(encryptionKey, "hex"),
    iv
  );
  let encrypted = cipher.update(data, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}

/**
 * Decrypt sensitive payment data
 */
export function decryptPaymentData(
  encryptedData: string,
  encryptionKey: string
): string {
  const parts = encryptedData.split(":");
  const iv = Buffer.from(parts[0], "hex");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(encryptionKey, "hex"),
    iv
  );
  let decrypted = decipher.update(parts[1], "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

/**
 * Get payment method description
 */
export function getPaymentMethodDescription(method: PaymentMethod): string {
  const descriptions: Record<PaymentMethod, string> = {
    [PaymentMethod.GCASH]: "Pay using your GCash wallet",
    [PaymentMethod.PAYMAYA]: "Pay using your PayMaya account",
    [PaymentMethod.CREDIT_CARD]: "Pay using your credit card",
    [PaymentMethod.DEBIT_CARD]: "Pay using your debit card",
    [PaymentMethod.BANK_TRANSFER]: "Transfer funds to our bank account",
    [PaymentMethod.COD]: "Pay when you receive your order",
  };
  return descriptions[method] || "Payment method";
}

