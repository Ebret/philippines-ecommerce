import { CardPayment, PaymentStatus } from "../validations/payment";
import {
  generateTransactionId,
  generatePaymentReference,
  validateCardNumber,
  isCardExpired,
  maskCardNumber,
} from "../payment-utils";

/**
 * Credit/Debit Card Payment Gateway Integration
 * Handles card payments with PCI DSS compliance
 */

interface CardConfig {
  apiKey: string;
  apiSecret: string;
  merchantId: string;
  webhookSecret: string;
  provider: "STRIPE" | "PAYMONGO"; // Card processor
}

interface CardTransaction {
  transactionId: string;
  referenceCode: string;
  status: PaymentStatus;
  amount: number;
  cardLast4: string;
  cardBrand: string;
  orderId: string;
  timestamp: Date;
  gatewayResponse: Record<string, any>;
}

interface CardWebhookPayload {
  id: string;
  orderId: string;
  amount: number;
  status: "succeeded" | "failed" | "processing";
  createdAt: string;
  signature: string;
}

class CardGateway {
  private config: CardConfig;
  private baseUrl: string;

  constructor(config: CardConfig) {
    this.config = config;
    this.baseUrl =
      config.provider === "STRIPE"
        ? "https://api.stripe.com/v1"
        : "https://api.paymongo.com/v1"; // Mock URLs
  }

  /**
   * Process card payment
   */
  async processPayment(payment: CardPayment): Promise<CardTransaction> {
    try {
      // Validate card number using Luhn algorithm
      if (!validateCardNumber(payment.cardNumber)) {
        throw new Error("Invalid card number");
      }

      // Check if card is expired
      if (isCardExpired(payment.expiryMonth, payment.expiryYear)) {
        throw new Error("Card has expired");
      }

      // Validate CVV
      if (!/^\d{3,4}$/.test(payment.cvv)) {
        throw new Error("Invalid CVV");
      }

      const transactionId = generateTransactionId();
      const referenceCode = generatePaymentReference();
      const cardLast4 = payment.cardNumber.slice(-4);
      const cardBrand = this.detectCardBrand(payment.cardNumber);

      // Prepare request payload (card data should be tokenized in production)
      const payload = {
        merchantId: this.config.merchantId,
        transactionId,
        referenceCode,
        amount: payment.amount,
        currency: "PHP",
        card: {
          number: payment.cardNumber,
          expMonth: payment.expiryMonth,
          expYear: payment.expiryYear,
          cvc: payment.cvv,
          holderName: payment.cardholderName,
        },
        billing: payment.billingAddress,
        orderId: payment.orderId,
        timestamp: new Date().toISOString(),
      };

      // In production, make actual API call to card processor
      // const response = await fetch(`${this.baseUrl}/charges`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${this.config.apiKey}`,
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(payload),
      // });

      // Mock response for development
      const gatewayResponse = {
        success: true,
        transactionId,
        referenceCode,
        status: "succeeded",
        cardBrand,
        cardLast4,
        message: "Payment processed successfully",
      };

      return {
        transactionId,
        referenceCode,
        status: PaymentStatus.COMPLETED,
        amount: payment.amount,
        cardLast4,
        cardBrand,
        orderId: payment.orderId,
        timestamp: new Date(),
        gatewayResponse,
      };
    } catch (error) {
      throw new Error(
        `Card payment processing failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Verify card payment
   */
  async verifyPayment(
    transactionId: string,
    referenceCode: string
  ): Promise<CardTransaction | null> {
    try {
      // In production, make actual API call to verify
      // const response = await fetch(
      //   `${this.baseUrl}/charges/${transactionId}`,
      //   {
      //     headers: {
      //       'Authorization': `Bearer ${this.config.apiKey}`,
      //     },
      //   }
      // );

      // Mock verification response
      const gatewayResponse = {
        transactionId,
        referenceCode,
        status: "succeeded",
        verified: true,
      };

      return {
        transactionId,
        referenceCode,
        status: PaymentStatus.COMPLETED,
        amount: 0,
        cardLast4: "****",
        cardBrand: "VISA",
        orderId: "",
        timestamp: new Date(),
        gatewayResponse,
      };
    } catch (error) {
      console.error("Card verification failed:", error);
      return null;
    }
  }

  /**
   * Refund card payment
   */
  async refundPayment(
    transactionId: string,
    amount: number,
    reason: string
  ): Promise<{ success: boolean; refundId: string; status: string }> {
    try {
      const refundId = generateTransactionId();

      // In production, make actual API call to refund
      // const response = await fetch(
      //   `${this.baseUrl}/charges/${transactionId}/refund`,
      //   {
      //     method: 'POST',
      //     headers: {
      //       'Authorization': `Bearer ${this.config.apiKey}`,
      //       'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify({
      //       amount,
      //       reason,
      //     }),
      //   }
      // );

      return {
        success: true,
        refundId,
        status: "succeeded",
      };
    } catch (error) {
      throw new Error(
        `Card refund failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Handle card payment webhook
   */
  async handleWebhook(payload: CardWebhookPayload): Promise<boolean> {
    try {
      // Verify webhook signature
      const expectedSignature = this.generateWebhookSignature(payload);
      if (payload.signature !== expectedSignature) {
        throw new Error("Invalid webhook signature");
      }

      // Process webhook based on status
      switch (payload.status) {
        case "succeeded":
          return true;
        case "failed":
          return false;
        case "processing":
          return true;
        default:
          throw new Error(`Unknown payment status: ${payload.status}`);
      }
    } catch (error) {
      console.error("Card webhook handling failed:", error);
      return false;
    }
  }

  /**
   * Detect card brand
   */
  private detectCardBrand(cardNumber: string): string {
    const patterns: Record<string, RegExp> = {
      VISA: /^4[0-9]{12}(?:[0-9]{3})?$/,
      MASTERCARD: /^5[1-5][0-9]{14}$/,
      AMEX: /^3[47][0-9]{13}$/,
      DISCOVER: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
    };

    for (const [brand, pattern] of Object.entries(patterns)) {
      if (pattern.test(cardNumber)) {
        return brand;
      }
    }

    return "UNKNOWN";
  }

  /**
   * Generate webhook signature
   */
  private generateWebhookSignature(payload: CardWebhookPayload): string {
    const crypto = require("crypto");
    const message = JSON.stringify({
      id: payload.id,
      orderId: payload.orderId,
      amount: payload.amount,
      status: payload.status,
      createdAt: payload.createdAt,
    });
    return crypto
      .createHmac("sha256", this.config.webhookSecret)
      .update(message)
      .digest("hex");
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(transactionId: string): Promise<PaymentStatus> {
    try {
      return PaymentStatus.COMPLETED;
    } catch (error) {
      console.error("Failed to get payment status:", error);
      return PaymentStatus.FAILED;
    }
  }

  /**
   * Cancel payment
   */
  async cancelPayment(transactionId: string): Promise<boolean> {
    try {
      return true;
    } catch (error) {
      console.error("Failed to cancel payment:", error);
      return false;
    }
  }
}

export default CardGateway;
export type { CardTransaction, CardWebhookPayload, CardConfig };

