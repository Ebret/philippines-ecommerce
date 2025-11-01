import { NextRequest, NextResponse } from "next/server";
import { PaymentMethod } from "@/lib/validations/payment";
import GCashGateway from "@/lib/payment-gateways/gcash";
import PayMayaGateway from "@/lib/payment-gateways/paymaya";
import CardGateway from "@/lib/payment-gateways/card";
import CODGateway from "@/lib/payment-gateways/cod";

/**
 * POST /api/payments/webhook
 * Handle payment gateway webhooks
 */
export async function POST(request: NextRequest) {
  try {
    // Get webhook source from header
    const source = request.headers.get("x-payment-source") || "unknown";
    const body = await request.json();

    console.log(`Webhook received from ${source}:`, body);

    // Route to appropriate gateway handler
    let isValid = false;

    switch (source.toUpperCase()) {
      case "GCASH": {
        const gateway = new GCashGateway({
          apiKey: process.env.GCASH_API_KEY || "",
          apiSecret: process.env.GCASH_API_SECRET || "",
          merchantId: process.env.GCASH_MERCHANT_ID || "",
          webhookSecret: process.env.GCASH_WEBHOOK_SECRET || "",
        });
        isValid = await gateway.handleWebhook(body);
        break;
      }

      case "PAYMAYA": {
        const gateway = new PayMayaGateway({
          apiKey: process.env.PAYMAYA_API_KEY || "",
          apiSecret: process.env.PAYMAYA_API_SECRET || "",
          merchantId: process.env.PAYMAYA_MERCHANT_ID || "",
          webhookSecret: process.env.PAYMAYA_WEBHOOK_SECRET || "",
        });
        isValid = await gateway.handleWebhook(body);
        break;
      }

      case "CARD":
      case "STRIPE":
      case "PAYMONGO": {
        const gateway = new CardGateway({
          apiKey: process.env.CARD_API_KEY || "",
          apiSecret: process.env.CARD_API_SECRET || "",
          merchantId: process.env.CARD_MERCHANT_ID || "",
          webhookSecret: process.env.CARD_WEBHOOK_SECRET || "",
          provider: (process.env.CARD_PROVIDER as "STRIPE" | "PAYMONGO") || "STRIPE",
        });
        isValid = await gateway.handleWebhook(body);
        break;
      }

      case "COD": {
        const gateway = new CODGateway();
        isValid = await gateway.handleWebhook(body);
        break;
      }

      default:
        console.warn(`Unknown webhook source: ${source}`);
        return NextResponse.json(
          { error: "Unknown webhook source" },
          { status: 400 }
        );
    }

    if (!isValid) {
      return NextResponse.json(
        { error: "Webhook validation failed" },
        { status: 400 }
      );
    }

    // In production, update order status based on payment status
    // Update order in database
    // Send confirmation email to customer
    // Update inventory if needed

    console.log("Webhook processed successfully:", {
      source,
      orderId: body.orderId || body.id,
      status: body.status,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Webhook processed successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      {
        error: "Webhook processing failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

