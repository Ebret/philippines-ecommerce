import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ProcessPaymentSchema, PaymentMethod } from "@/lib/validations/payment";
import GCashGateway from "@/lib/payment-gateways/gcash";
import PayMayaGateway from "@/lib/payment-gateways/paymaya";
import CardGateway from "@/lib/payment-gateways/card";
import CODGateway from "@/lib/payment-gateways/cod";
import { calculateProcessingFee } from "@/lib/payment-utils";

/**
 * POST /api/payments/process
 * Process payment through selected gateway
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
    const validationResult = ProcessPaymentSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid payment data", details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { orderId, amount, method, paymentData, metadata } = validationResult.data;

    // Calculate processing fee
    const processingFee = calculateProcessingFee(amount, method);
    const totalAmount = amount + processingFee;

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
        transaction = await gateway.processPayment(paymentData as any);
        break;
      }

      case PaymentMethod.PAYMAYA: {
        const gateway = new PayMayaGateway({
          apiKey: process.env.PAYMAYA_API_KEY || "",
          apiSecret: process.env.PAYMAYA_API_SECRET || "",
          merchantId: process.env.PAYMAYA_MERCHANT_ID || "",
          webhookSecret: process.env.PAYMAYA_WEBHOOK_SECRET || "",
        });
        transaction = await gateway.processPayment(paymentData as any);
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
        transaction = await gateway.processPayment(paymentData as any);
        break;
      }

      case PaymentMethod.COD: {
        const gateway = new CODGateway();
        transaction = await gateway.processPayment(paymentData as any);
        break;
      }

      default:
        return NextResponse.json(
          { error: "Unsupported payment method" },
          { status: 400 }
        );
    }

    // Log transaction (in production, save to database)
    console.log("Payment processed:", {
      transactionId: transaction.transactionId,
      orderId,
      method,
      amount: totalAmount,
      status: transaction.status,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        transaction: {
          transactionId: transaction.transactionId,
          referenceCode: transaction.referenceCode,
          orderId,
          amount: totalAmount,
          processingFee,
          method,
          status: transaction.status,
          timestamp: transaction.timestamp,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Payment processing error:", error);
    return NextResponse.json(
      {
        error: "Payment processing failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

