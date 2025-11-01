import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { VerifyPaymentSchema, PaymentMethod } from "@/lib/validations/payment";
import GCashGateway from "@/lib/payment-gateways/gcash";
import PayMayaGateway from "@/lib/payment-gateways/paymaya";
import CardGateway from "@/lib/payment-gateways/card";
import CODGateway from "@/lib/payment-gateways/cod";

/**
 * POST /api/payments/verify
 * Verify payment status
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
    const validationResult = VerifyPaymentSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid verification data", details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { transactionId, orderId, amount, method } = validationResult.data;

    // Route to appropriate payment gateway
    let transaction;

    switch (method) {
      case PaymentMethod.GCASH: {
        const gateway = new GCashGateway({
          apiKey: process.env.GCASH_API_KEY || "",
          apiSecret: process.env.GCASH_API_SECRET || "",
          merchantId: process.env.GCASH_MERCHANT_ID || "",
          webhookSecret: process.env.GCASH_WEBHOOK_SECRET || "",
        });
        transaction = await gateway.verifyPayment(transactionId, "");
        break;
      }

      case PaymentMethod.PAYMAYA: {
        const gateway = new PayMayaGateway({
          apiKey: process.env.PAYMAYA_API_KEY || "",
          apiSecret: process.env.PAYMAYA_API_SECRET || "",
          merchantId: process.env.PAYMAYA_MERCHANT_ID || "",
          webhookSecret: process.env.PAYMAYA_WEBHOOK_SECRET || "",
        });
        transaction = await gateway.verifyPayment(transactionId, "");
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
        transaction = await gateway.verifyPayment(transactionId, "");
        break;
      }

      case PaymentMethod.COD: {
        const gateway = new CODGateway();
        transaction = await gateway.verifyPayment(transactionId, "");
        break;
      }

      default:
        return NextResponse.json(
          { error: "Unsupported payment method" },
          { status: 400 }
        );
    }

    if (!transaction) {
      return NextResponse.json(
        { error: "Payment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        payment: {
          transactionId: transaction.transactionId,
          orderId,
          amount,
          method,
          status: transaction.status,
          verified: transaction.status === "COMPLETED",
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      {
        error: "Payment verification failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

