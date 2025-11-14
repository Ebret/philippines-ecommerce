# Payment Gateway Fixes Required

## Summary

The payment gateway integration has **5 CRITICAL ISSUES** that must be fixed before production deployment.

---

## Issue #1: Missing Environment Variables (CRITICAL)

**File**: `.env`  
**Severity**: CRITICAL  
**Impact**: Payment gateways cannot authenticate

### Required Variables

```env
# GCash Integration
GCASH_API_KEY="your-api-key"
GCASH_API_SECRET="your-api-secret"
GCASH_MERCHANT_ID="your-merchant-id"
GCASH_WEBHOOK_SECRET="your-webhook-secret"

# PayMaya Integration
PAYMAYA_API_KEY="your-public-key"
PAYMAYA_API_SECRET="your-secret-key"
PAYMAYA_MERCHANT_ID="your-merchant-id"
PAYMAYA_WEBHOOK_SECRET="your-webhook-secret"
```

### Fix
1. Obtain credentials from GCash and PayMaya
2. Add to production `.env` file
3. Verify credentials are correct

---

## Issue #2: Mock Implementation in Production (CRITICAL)

**Files**: 
- `src/lib/payment-gateways/gcash.ts` (lines 69-86)
- `src/lib/payment-gateways/paymaya.ts` (lines 70-88)

**Severity**: CRITICAL  
**Impact**: No actual payments are processed

### Current Code (Mock)
```typescript
// Mock response for development
const gatewayResponse = {
  success: true,
  transactionId,
  referenceCode,
  status: "PENDING",
  message: "Payment initiated successfully",
};
```

### Required Fix
Replace mock implementation with actual API calls:

```typescript
// Real API call to GCash
const response = await fetch(`${this.baseUrl}/transactions`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${this.config.apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(payload),
});

const gatewayResponse = await response.json();
if (!response.ok) {
  throw new Error(`GCash API error: ${gatewayResponse.message}`);
}
```

---

## Issue #3: No Database Transaction Recording (CRITICAL)

**File**: `src/app/api/payments/process/route.ts` (lines 96-104)  
**Severity**: CRITICAL  
**Impact**: No payment history or audit trail

### Current Code
```typescript
// Log transaction (in production, save to database)
console.log("Payment processed:", {
  transactionId: transaction.transactionId,
  orderId,
  method,
  amount: totalAmount,
  status: transaction.status,
  timestamp: new Date().toISOString(),
});
```

### Required Fix
Save transaction to database:

```typescript
import { prisma } from "@/lib/prisma";

// Save payment to database
const payment = await prisma.payment.create({
  data: {
    orderId,
    paymentMethod: method,
    gateway: "GCASH" | "PAYMAYA",
    gatewayTransactionId: transaction.transactionId,
    amount: totalAmount,
    currency: "PHP",
    status: transaction.status,
    gatewayResponse: transaction.gatewayResponse,
    processedAt: new Date(),
  },
});

// Update order payment status
await prisma.order.update({
  where: { id: orderId },
  data: { paymentStatus: transaction.status },
});
```

---

## Issue #4: Incomplete Verification Methods (HIGH)

**Files**:
- `src/lib/payment-gateways/gcash.ts` (lines 108-145)
- `src/lib/payment-gateways/paymaya.ts` (lines 110-147)

**Severity**: HIGH  
**Impact**: Cannot verify if payments were completed

### Current Code (Mock)
```typescript
// Mock verification response
const gatewayResponse = {
  transactionId,
  referenceCode,
  status: "SUCCESS",
  verified: true,
};

return {
  transactionId,
  referenceCode,
  status: PaymentStatus.COMPLETED,
  amount: 0, // Would be fetched from gateway
  phoneNumber: "", // Would be fetched from gateway
  orderId: "", // Would be fetched from gateway
  timestamp: new Date(),
  gatewayResponse,
};
```

### Required Fix
Implement actual verification API calls to fetch real payment status

---

## Issue #5: Webhook Signature Validation (HIGH)

**File**: `src/app/api/payments/webhook/route.ts` (lines 14-31)  
**Severity**: HIGH  
**Impact**: Webhooks may not be properly validated

### Current Code
```typescript
const source = request.headers.get("x-payment-source") || "unknown";
```

### Required Fix
Implement proper webhook signature verification:

```typescript
const signature = request.headers.get("x-webhook-signature");
const payload = await request.json();

// Verify signature based on payment source
const isValid = verifyWebhookSignature(
  payload,
  signature,
  webhookSecret
);

if (!isValid) {
  return NextResponse.json(
    { error: "Invalid webhook signature" },
    { status: 401 }
  );
}
```

---

## Implementation Priority

1. **CRITICAL** (Must fix before production):
   - Issue #1: Add environment variables
   - Issue #2: Replace mock implementations
   - Issue #3: Add database transaction recording

2. **HIGH** (Should fix before production):
   - Issue #4: Implement verification methods
   - Issue #5: Improve webhook validation

---

## Testing Checklist

After implementing fixes:

- [ ] Test GCash payment processing
- [ ] Test PayMaya payment processing
- [ ] Verify transactions are saved to database
- [ ] Test webhook handling
- [ ] Test payment verification
- [ ] Test error scenarios
- [ ] Test refund processing
- [ ] Verify payment status updates

---

**Last Updated**: November 14, 2025

