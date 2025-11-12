import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { RefundRequestSchema, PaymentMethod, PaymentStatus } from "@/lib/validations/payment";
import GCashGateway from "@/lib/payment-gateways/gcash";
import PayMayaGateway from "@/lib/payment-gateways/paymaya";
import CardGateway from "@/lib/payment-gateways/card";
import CODGateway from "@/lib/payment-gateways/cod";
import { isEligibleForRefund } from "@/lib/payment-utils";

/**
 * POST /api/payments/refund
 * Request refund for a payment
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate request
    const validationResult = RefundRequestSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid refund request", details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { transactionId, orderId, amount, reason, notes } = validationResult.data;

    // Check if payment is eligible for refund
    // In production, fetch actual payment status from database
    const daysSincePayment = 5; // Mock value
    if (!isEligibleForRefund(PaymentStatus.COMPLETED, daysSincePayment)) {
      return NextResponse.json(
        { error: "Payment is not eligible for refund" },
        { status: 400 }
      );
    }

    // Get payment method from database (mock for now)
    const method = PaymentMethod.GCASH as PaymentMethod; // Would be fetched from database

    // Route to appropriate payment gateway
    let refundResult;

    switch (method) {
      case PaymentMethod.GCASH: {
        const gateway = new GCashGateway({
          apiKey: process.env.GCASH_API_KEY || "",
          apiSecret: process.env.GCASH_API_SECRET || "",
          merchantId: process.env.GCASH_MERCHANT_ID || "",
          webhookSecret: process.env.GCASH_WEBHOOK_SECRET || "",
        });
        refundResult = await gateway.refundPayment(transactionId, amount, reason);
        break;
      }

      case PaymentMethod.PAYMAYA: {
        const gateway = new PayMayaGateway({
          apiKey: process.env.PAYMAYA_API_KEY || "",
          apiSecret: process.env.PAYMAYA_API_SECRET || "",
          merchantId: process.env.PAYMAYA_MERCHANT_ID || "",
          webhookSecret: process.env.PAYMAYA_WEBHOOK_SECRET || "",
        });
        refundResult = await gateway.refundPayment(transactionId, amount, reason);
        break;
      }

      case PaymentMethod.CREDIT_CARD:
      case PaymentMethod.DEBIT_CARD: {
        const gateway = new CardGateway({
          apiKey: process.env.CARD_API_KEY || "",
          apiSecret: process.env.CARD_API_SECRET || "",
          merchantId: process.env.CARD_MERCHANT_ID || "",
          webhookSecret: process.env.CARD_WEBHOOK_SECRET || "",
          provider: (process.env.CARD_PROVIDER as "STRIPE" | "PAYMONGO") || "STRIPE",
        });
        refundResult = await gateway.refundPayment(transactionId, amount, reason);
        break;
      }

      case PaymentMethod.COD: {
        const gateway = new CODGateway();
        refundResult = await gateway.refundPayment(transactionId, amount, reason);
        break;
      }

      default:
        return NextResponse.json(
          { error: "Unsupported payment method" },
          { status: 400 }
        );
    }

    // Log refund request (in production, save to database)
    console.log("Refund processed:", {
      refundId: refundResult.refundId,
      transactionId,
      orderId,
      amount,
      reason,
      status: refundResult.status,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        refund: {
          refundId: refundResult.refundId,
          transactionId,
          orderId,
          amount,
          reason,
          status: refundResult.status,
          timestamp: new Date().toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Refund processing error:", error);
    return NextResponse.json(
      {
        error: "Refund processing failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

