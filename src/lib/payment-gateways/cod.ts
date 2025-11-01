import { CODPayment, PaymentStatus } from "../validations/payment";
import { generateTransactionId, generatePaymentReference } from "../payment-utils";

/**
 * Cash on Delivery (COD) Payment Handler
 * Handles COD payments with order confirmation
 */

interface CODTransaction {
  transactionId: string;
  referenceCode: string;
  status: PaymentStatus;
  amount: number;
  orderId: string;
  deliveryAddress: {
    recipientName: string;
    phone: string;
    street: string;
    barangay: string;
    city: string;
    province: string;
  };
  notes?: string;
  timestamp: Date;
  gatewayResponse: Record<string, any>;
}

interface CODWebhookPayload {
  transactionId: string;
  orderId: string;
  status: "CONFIRMED" | "FAILED" | "PENDING";
  timestamp: string;
  signature: string;
}

class CODGateway {
  /**
   * Process COD payment
   */
  async processPayment(payment: CODPayment): Promise<CODTransaction> {
    try {
      // Validate delivery address
      if (!payment.deliveryAddress.recipientName) {
        throw new Error("Recipient name is required");
      }

      if (!/^09\d{9}$/.test(payment.deliveryAddress.phone)) {
        throw new Error("Invalid Philippine phone number format");
      }

      // COD has a maximum amount limit
      if (payment.amount > 50000) {
        throw new Error("COD is not available for orders exceeding ₱50,000");
      }

      const transactionId = generateTransactionId();
      const referenceCode = generatePaymentReference();

      // Mock response for development
      const gatewayResponse = {
        success: true,
        transactionId,
        referenceCode,
        status: "PENDING",
        message: "COD order confirmed. Payment will be collected upon delivery.",
        estimatedDelivery: this.calculateEstimatedDelivery(),
      };

      return {
        transactionId,
        referenceCode,
        status: PaymentStatus.PENDING,
        amount: payment.amount,
        orderId: payment.orderId,
        deliveryAddress: payment.deliveryAddress,
        notes: payment.notes,
        timestamp: new Date(),
        gatewayResponse,
      };
    } catch (error) {
      throw new Error(
        `COD payment processing failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Verify COD payment (confirm delivery)
   */
  async verifyPayment(
    transactionId: string,
    referenceCode: string
  ): Promise<CODTransaction | null> {
    try {
      // Mock verification response
      const gatewayResponse = {
        transactionId,
        referenceCode,
        status: "CONFIRMED",
        verified: true,
        message: "Payment confirmed upon delivery",
      };

      return {
        transactionId,
        referenceCode,
        status: PaymentStatus.COMPLETED,
        amount: 0,
        orderId: "",
        deliveryAddress: {
          recipientName: "",
          phone: "",
          street: "",
          barangay: "",
          city: "",
          province: "",
        },
        timestamp: new Date(),
        gatewayResponse,
      };
    } catch (error) {
      console.error("COD verification failed:", error);
      return null;
    }
  }

  /**
   * Refund COD payment
   */
  async refundPayment(
    transactionId: string,
    amount: number,
    reason: string
  ): Promise<{ success: boolean; refundId: string; status: string }> {
    try {
      const refundId = generateTransactionId();

      // For COD, refund means cancelling the order before delivery
      return {
        success: true,
        refundId,
        status: "PENDING",
      };
    } catch (error) {
      throw new Error(
        `COD refund failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Handle COD webhook (delivery confirmation)
   */
  async handleWebhook(payload: CODWebhookPayload): Promise<boolean> {
    try {
      // Process webhook based on status
      switch (payload.status) {
        case "CONFIRMED":
          // Payment confirmed upon delivery
          return true;
        case "FAILED":
          // Delivery failed
          return false;
        case "PENDING":
          // Delivery pending
          return true;
        default:
          throw new Error(`Unknown payment status: ${payload.status}`);
      }
    } catch (error) {
      console.error("COD webhook handling failed:", error);
      return false;
    }
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(transactionId: string): Promise<PaymentStatus> {
    try {
      // For COD, status depends on delivery status
      // In production, check with logistics partner
      return PaymentStatus.PENDING;
    } catch (error) {
      console.error("Failed to get payment status:", error);
      return PaymentStatus.FAILED;
    }
  }

  /**
   * Cancel COD payment
   */
  async cancelPayment(transactionId: string): Promise<boolean> {
    try {
      // Cancel COD order before delivery
      return true;
    } catch (error) {
      console.error("Failed to cancel payment:", error);
      return false;
    }
  }

  /**
   * Calculate estimated delivery date
   */
  private calculateEstimatedDelivery(): string {
    const deliveryDate = new Date();
    // Add 3-5 business days for delivery
    deliveryDate.setDate(deliveryDate.getDate() + 3);
    return deliveryDate.toISOString();
  }

  /**
   * Confirm payment upon delivery
   */
  async confirmPaymentOnDelivery(
    transactionId: string,
    amount: number
  ): Promise<boolean> {
    try {
      // Mark payment as completed when courier confirms delivery
      return true;
    } catch (error) {
      console.error("Failed to confirm payment on delivery:", error);
      return false;
    }
  }

  /**
   * Get COD payment instructions
   */
  getPaymentInstructions(): string {
    return `
      Cash on Delivery (COD) Payment Instructions:
      1. Your order will be delivered to the address you provided
      2. Payment must be made in full upon delivery
      3. Please have the exact amount ready
      4. The courier will provide a receipt
      5. For inquiries, contact our customer service
    `;
  }
}

export default CODGateway;
export type { CODTransaction, CODWebhookPayload };

