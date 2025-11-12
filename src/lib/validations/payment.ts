import { z } from "zod";

// Payment method enum
export enum PaymentMethod {
  GCASH = "GCASH",
  PAYMAYA = "PAYMAYA",
  CREDIT_CARD = "CREDIT_CARD",
  DEBIT_CARD = "DEBIT_CARD",
  BANK_TRANSFER = "BANK_TRANSFER",
  COD = "COD",
}

// Payment status enum
export enum PaymentStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
  PARTIALLY_REFUNDED = "PARTIALLY_REFUNDED",
}

// GCash payment schema
export const GCashPaymentSchema = z.object({
  phoneNumber: z
    .string()
    .regex(/^09\d{9}$/, "Invalid Philippine phone number format"),
  amount: z.number().positive("Amount must be positive"),
  orderId: z.string().min(1, "Order ID is required"),
  description: z.string().optional(),
});

// PayMaya payment schema
export const PayMayaPaymentSchema = z.object({
  email: z.string().email("Invalid email address"),
  amount: z.number().positive("Amount must be positive"),
  orderId: z.string().min(1, "Order ID is required"),
  description: z.string().optional(),
  redirectUrl: z.string().url("Invalid redirect URL").optional(),
});

// Credit/Debit card payment schema
export const CardPaymentSchema = z.object({
  cardNumber: z
    .string()
    .regex(/^\d{13,19}$/, "Invalid card number")
    .transform((val) => val.replace(/\s/g, "")),
  cardholderName: z.string().min(2, "Cardholder name is required"),
  expiryMonth: z
    .number()
    .min(1, "Invalid month")
    .max(12, "Invalid month"),
  expiryYear: z
    .number()
    .min(new Date().getFullYear(), "Card has expired"),
  cvv: z
    .string()
    .regex(/^\d{3,4}$/, "Invalid CVV"),
  amount: z.number().positive("Amount must be positive"),
  orderId: z.string().min(1, "Order ID is required"),
  billingAddress: z.object({
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    province: z.string().min(1, "Province is required"),
    postalCode: z.string().min(1, "Postal code is required"),
  }),
});

// COD payment schema
export const CODPaymentSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  amount: z.number().positive("Amount must be positive"),
  deliveryAddress: z.object({
    recipientName: z.string().min(1, "Recipient name is required"),
    phone: z
      .string()
      .regex(/^09\d{9}$/, "Invalid Philippine phone number format"),
    street: z.string().min(1, "Street is required"),
    barangay: z.string().min(1, "Barangay is required"),
    city: z.string().min(1, "City is required"),
    province: z.string().min(1, "Province is required"),
  }),
  notes: z.string().optional(),
});

// Bank transfer payment schema
export const BankTransferPaymentSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  amount: z.number().positive("Amount must be positive"),
  bankName: z.string().min(1, "Bank name is required"),
  accountName: z.string().min(1, "Account name is required"),
  referenceNumber: z.string().min(1, "Reference number is required"),
  transferDate: z.string().datetime("Invalid date format"),
});

// Generic payment processing schema
export const ProcessPaymentSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  amount: z.number().positive("Amount must be positive"),
  method: z.nativeEnum(PaymentMethod),
  paymentData: z.record(z.string(), z.any()),
  metadata: z.record(z.string(), z.any()).optional(),
});

// Payment verification schema
export const VerifyPaymentSchema = z.object({
  transactionId: z.string().min(1, "Transaction ID is required"),
  orderId: z.string().min(1, "Order ID is required"),
  amount: z.number().positive("Amount must be positive"),
  method: z.nativeEnum(PaymentMethod),
});

// Refund request schema
export const RefundRequestSchema = z.object({
  transactionId: z.string().min(1, "Transaction ID is required"),
  orderId: z.string().min(1, "Order ID is required"),
  amount: z.number().positive("Amount must be positive"),
  reason: z.string().min(10, "Reason must be at least 10 characters"),
  notes: z.string().optional(),
});

// Webhook payload schema for GCash
export const GCashWebhookSchema = z.object({
  transactionId: z.string(),
  orderId: z.string(),
  amount: z.number(),
  status: z.enum(["SUCCESS", "FAILED", "PENDING"]),
  timestamp: z.string().datetime(),
  signature: z.string(),
});

// Webhook payload schema for PayMaya
export const PayMayaWebhookSchema = z.object({
  id: z.string(),
  orderId: z.string(),
  amount: z.number(),
  status: z.enum(["COMPLETED", "FAILED", "PENDING"]),
  createdAt: z.string().datetime(),
  signature: z.string(),
});

// Payment receipt schema
export const PaymentReceiptSchema = z.object({
  receiptNumber: z.string(),
  transactionId: z.string(),
  orderId: z.string(),
  amount: z.number(),
  method: z.nativeEnum(PaymentMethod),
  status: z.nativeEnum(PaymentStatus),
  timestamp: z.string().datetime(),
  payerName: z.string(),
  payerEmail: z.string().email(),
  items: z.array(
    z.object({
      name: z.string(),
      quantity: z.number(),
      price: z.number(),
      subtotal: z.number(),
    })
  ),
  subtotal: z.number(),
  tax: z.number(),
  shipping: z.number(),
  total: z.number(),
});

// Payment history filter schema
export const PaymentHistoryFilterSchema = z.object({
  orderId: z.string().optional(),
  method: z.nativeEnum(PaymentMethod).optional(),
  status: z.nativeEnum(PaymentStatus).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  minAmount: z.number().optional(),
  maxAmount: z.number().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});

// Transaction logging schema
export const TransactionLogSchema = z.object({
  transactionId: z.string(),
  orderId: z.string(),
  userId: z.string(),
  method: z.nativeEnum(PaymentMethod),
  amount: z.number(),
  status: z.nativeEnum(PaymentStatus),
  gatewayResponse: z.record(z.string(), z.any()),
  errorMessage: z.string().optional(),
  timestamp: z.string().datetime(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
});

// Payment method configuration schema
export const PaymentMethodConfigSchema = z.object({
  method: z.nativeEnum(PaymentMethod),
  isEnabled: z.boolean(),
  minAmount: z.number().optional(),
  maxAmount: z.number().optional(),
  processingFee: z.number().default(0),
  description: z.string().optional(),
});

// Batch payment processing schema
export const BatchPaymentSchema = z.object({
  payments: z.array(ProcessPaymentSchema),
  batchId: z.string(),
  totalAmount: z.number(),
  processedAt: z.string().datetime(),
});

export type GCashPayment = z.infer<typeof GCashPaymentSchema>;
export type PayMayaPayment = z.infer<typeof PayMayaPaymentSchema>;
export type CardPayment = z.infer<typeof CardPaymentSchema>;
export type CODPayment = z.infer<typeof CODPaymentSchema>;
export type BankTransferPayment = z.infer<typeof BankTransferPaymentSchema>;
export type ProcessPayment = z.infer<typeof ProcessPaymentSchema>;
export type VerifyPayment = z.infer<typeof VerifyPaymentSchema>;
export type RefundRequest = z.infer<typeof RefundRequestSchema>;
export type PaymentReceipt = z.infer<typeof PaymentReceiptSchema>;
export type PaymentHistoryFilter = z.infer<typeof PaymentHistoryFilterSchema>;
export type TransactionLog = z.infer<typeof TransactionLogSchema>;
export type PaymentMethodConfig = z.infer<typeof PaymentMethodConfigSchema>;
export type BatchPayment = z.infer<typeof BatchPaymentSchema>;

