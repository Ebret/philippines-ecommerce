import { describe, it, expect, beforeEach } from "vitest";
import {
  GCashPaymentSchema,
  PayMayaPaymentSchema,
  CardPaymentSchema,
  CODPaymentSchema,
  RefundRequestSchema,
  PaymentMethod,
  PaymentStatus,
} from "@/lib/validations/payment";
import {
  generateTransactionId,
  generateReceiptNumber,
  calculateProcessingFee,
  calculateTotalWithFee,
  validateCardNumber,
  maskCardNumber,
  validateCVV,
  isCardExpired,
  formatPaymentStatus,
  formatPaymentMethod,
  isPaymentMethodAvailable,
  calculateRefundAmount,
  generatePaymentReference,
  validatePhoneNumber,
  formatPhoneNumber,
  isEligibleForRefund,
  getPaymentMethodIcon,
} from "@/lib/payment-utils";
import GCashGateway from "@/lib/payment-gateways/gcash";
import PayMayaGateway from "@/lib/payment-gateways/paymaya";
import CardGateway from "@/lib/payment-gateways/card";
import CODGateway from "@/lib/payment-gateways/cod";

describe("Payment Validation Schemas", () => {
  it("should validate GCash payment data", () => {
    const validData = {
      phoneNumber: "09123456789",
      amount: 1000,
      orderId: "ORD-001",
      description: "Test payment",
    };
    const result = GCashPaymentSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should reject invalid phone number for GCash", () => {
    const invalidData = {
      phoneNumber: "1234567890",
      amount: 1000,
      orderId: "ORD-001",
    };
    const result = GCashPaymentSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("should validate PayMaya payment data", () => {
    const validData = {
      email: "user@example.com",
      amount: 1500,
      orderId: "ORD-002",
    };
    const result = PayMayaPaymentSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should validate card payment data", () => {
    const validData = {
      cardNumber: "4532015112830366",
      cardholderName: "John Doe",
      expiryMonth: 12,
      expiryYear: 2025,
      cvv: "123",
      amount: 2000,
      orderId: "ORD-003",
      billingAddress: {
        street: "123 Main St",
        city: "Manila",
        province: "Metro Manila",
        postalCode: "1000",
      },
    };
    const result = CardPaymentSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should validate COD payment data", () => {
    const validData = {
      orderId: "ORD-004",
      amount: 1200,
      deliveryAddress: {
        recipientName: "Jane Doe",
        phone: "09987654321",
        street: "456 Oak Ave",
        barangay: "Barangay 1",
        city: "Quezon City",
        province: "Metro Manila",
      },
    };
    const result = CODPaymentSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should validate refund request", () => {
    const validData = {
      transactionId: "TXN-001",
      orderId: "ORD-001",
      amount: 1000,
      reason: "Customer requested refund due to product defect",
    };
    const result = RefundRequestSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });
});

describe("Payment Utility Functions", () => {
  it("should generate unique transaction IDs", () => {
    const txn1 = generateTransactionId();
    const txn2 = generateTransactionId();
    expect(txn1).toMatch(/^TXN-/);
    expect(txn2).toMatch(/^TXN-/);
    expect(txn1).not.toBe(txn2);
  });

  it("should generate receipt numbers", () => {
    const receipt = generateReceiptNumber();
    expect(receipt).toMatch(/^RCP-\d{8}-[A-Z0-9]{6}$/);
  });

  it("should calculate processing fees correctly", () => {
    const amount = 1000;
    const gcashFee = calculateProcessingFee(amount, PaymentMethod.GCASH);
    const paymayaFee = calculateProcessingFee(amount, PaymentMethod.PAYMAYA);
    const codFee = calculateProcessingFee(amount, PaymentMethod.COD);

    expect(gcashFee).toBe(20); // 2%
    expect(paymayaFee).toBe(25); // 2.5%
    expect(codFee).toBe(0); // No fee
  });

  it("should calculate total with fee", () => {
    const amount = 1000;
    const total = calculateTotalWithFee(amount, PaymentMethod.GCASH);
    expect(total).toBe(1020);
  });

  it("should validate card numbers using Luhn algorithm", () => {
    expect(validateCardNumber("4532015112830366")).toBe(true);
    expect(validateCardNumber("1234567890123456")).toBe(false);
  });

  it("should mask card numbers", () => {
    const masked = maskCardNumber("4532015112830366");
    expect(masked).toBe("****-****-****-0366");
  });

  it("should validate CVV", () => {
    expect(validateCVV("123")).toBe(true);
    expect(validateCVV("1234")).toBe(true);
    expect(validateCVV("12")).toBe(false);
    expect(validateCVV("12345")).toBe(false);
  });

  it("should check card expiration", () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    expect(isCardExpired(currentMonth, currentYear - 1)).toBe(true);
    expect(isCardExpired(currentMonth - 1, currentYear)).toBe(true);
    expect(isCardExpired(currentMonth + 1, currentYear)).toBe(false);
  });

  it("should format payment status", () => {
    expect(formatPaymentStatus(PaymentStatus.PENDING)).toBe("Pending");
    expect(formatPaymentStatus(PaymentStatus.COMPLETED)).toBe("Completed");
    expect(formatPaymentStatus(PaymentStatus.FAILED)).toBe("Failed");
  });

  it("should format payment method", () => {
    expect(formatPaymentMethod(PaymentMethod.GCASH)).toBe("GCash");
    expect(formatPaymentMethod(PaymentMethod.PAYMAYA)).toBe("PayMaya");
    expect(formatPaymentMethod(PaymentMethod.COD)).toBe("Cash on Delivery");
  });

  it("should check payment method availability", () => {
    const enabledMethods = {
      [PaymentMethod.GCASH]: true,
      [PaymentMethod.PAYMAYA]: true,
      [PaymentMethod.CREDIT_CARD]: true,
      [PaymentMethod.DEBIT_CARD]: true,
      [PaymentMethod.BANK_TRANSFER]: true,
      [PaymentMethod.COD]: true,
    };

    expect(isPaymentMethodAvailable(PaymentMethod.GCASH, 1000, enabledMethods)).toBe(true);
    expect(isPaymentMethodAvailable(PaymentMethod.COD, 60000, enabledMethods)).toBe(false);
  });

  it("should calculate refund amount", () => {
    expect(calculateRefundAmount(1000, 100)).toBe(1000);
    expect(calculateRefundAmount(1000, 50)).toBe(500);
    expect(calculateRefundAmount(1000, 25)).toBe(250);
  });

  it("should validate Philippine phone numbers", () => {
    expect(validatePhoneNumber("09123456789")).toBe(true);
    expect(validatePhoneNumber("09987654321")).toBe(true);
    expect(validatePhoneNumber("1234567890")).toBe(false);
    expect(validatePhoneNumber("09123")).toBe(false);
  });

  it("should format Philippine phone numbers", () => {
    const formatted = formatPhoneNumber("09123456789");
    expect(formatted).toBe("+639123456789");
  });

  it("should check refund eligibility", () => {
    expect(isEligibleForRefund(PaymentStatus.COMPLETED, 5)).toBe(true);
    expect(isEligibleForRefund(PaymentStatus.COMPLETED, 35)).toBe(false);
    expect(isEligibleForRefund(PaymentStatus.PENDING, 5)).toBe(false);
  });

  it("should get payment method icon", () => {
    expect(getPaymentMethodIcon(PaymentMethod.GCASH)).toBe("💳");
    expect(getPaymentMethodIcon(PaymentMethod.COD)).toBe("🚚");
    expect(getPaymentMethodIcon(PaymentMethod.BANK_TRANSFER)).toBe("🏦");
  });
});

describe("Payment Gateways", () => {
  it("should process GCash payment", async () => {
    const gateway = new GCashGateway({
      apiKey: "test-key",
      apiSecret: "test-secret",
      merchantId: "test-merchant",
      webhookSecret: "test-webhook",
    });

    const payment = {
      phoneNumber: "09123456789",
      amount: 1000,
      orderId: "ORD-001",
    };

    const transaction = await gateway.processPayment(payment);
    expect(transaction.transactionId).toMatch(/^TXN-/);
    expect(transaction.status).toBe(PaymentStatus.PENDING);
    expect(transaction.amount).toBe(1000);
  });

  it("should process PayMaya payment", async () => {
    const gateway = new PayMayaGateway({
      apiKey: "test-key",
      apiSecret: "test-secret",
      merchantId: "test-merchant",
      webhookSecret: "test-webhook",
    });

    const payment = {
      email: "user@example.com",
      amount: 1500,
      orderId: "ORD-002",
    };

    const transaction = await gateway.processPayment(payment);
    expect(transaction.transactionId).toMatch(/^TXN-/);
    expect(transaction.status).toBe(PaymentStatus.PENDING);
  });

  it("should process card payment", async () => {
    const gateway = new CardGateway({
      apiKey: "test-key",
      apiSecret: "test-secret",
      merchantId: "test-merchant",
      webhookSecret: "test-webhook",
      provider: "STRIPE",
    });

    const payment = {
      cardNumber: "4532015112830366",
      cardholderName: "John Doe",
      expiryMonth: 12,
      expiryYear: 2025,
      cvv: "123",
      amount: 2000,
      orderId: "ORD-003",
      billingAddress: {
        street: "123 Main St",
        city: "Manila",
        province: "Metro Manila",
        postalCode: "1000",
      },
    };

    const transaction = await gateway.processPayment(payment);
    expect(transaction.status).toBe(PaymentStatus.COMPLETED);
    expect(transaction.cardLast4).toBe("0366");
  });

  it("should process COD payment", async () => {
    const gateway = new CODGateway();

    const payment = {
      orderId: "ORD-004",
      amount: 1200,
      deliveryAddress: {
        recipientName: "Jane Doe",
        phone: "09987654321",
        street: "456 Oak Ave",
        barangay: "Barangay 1",
        city: "Quezon City",
        province: "Metro Manila",
      },
    };

    const transaction = await gateway.processPayment(payment);
    expect(transaction.status).toBe(PaymentStatus.PENDING);
    expect(transaction.amount).toBe(1200);
  });

  it("should reject COD payment exceeding limit", async () => {
    const gateway = new CODGateway();

    const payment = {
      orderId: "ORD-005",
      amount: 60000,
      deliveryAddress: {
        recipientName: "Jane Doe",
        phone: "09987654321",
        street: "456 Oak Ave",
        barangay: "Barangay 1",
        city: "Quezon City",
        province: "Metro Manila",
      },
    };

    await expect(gateway.processPayment(payment)).rejects.toThrow(
      "COD is not available for orders exceeding ₱50,000"
    );
  });
});

