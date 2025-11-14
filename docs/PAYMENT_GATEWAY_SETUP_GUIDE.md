# Payment Gateway Setup Guide

## Overview

This guide provides step-by-step instructions for setting up GCash and PayMaya payment gateways in the Philippines E-Commerce Platform.

---

## 1. GCash Integration Setup

### Prerequisites
- GCash Merchant Account
- API Key and API Secret from GCash
- Merchant ID from GCash
- Webhook Secret for webhook verification

### Configuration Steps

1. **Obtain GCash Credentials**:
   - Visit: https://merchant.gcash.com
   - Sign up for a merchant account
   - Navigate to API Settings
   - Generate API Key and API Secret
   - Note your Merchant ID

2. **Add to Environment Variables** (`.env`):
   ```
   GCASH_API_KEY="your-gcash-api-key"
   GCASH_API_SECRET="your-gcash-api-secret"
   GCASH_MERCHANT_ID="your-merchant-id"
   GCASH_WEBHOOK_SECRET="your-webhook-secret"
   ```

3. **Configure Webhook URL**:
   - In GCash Merchant Dashboard
   - Set Webhook URL to: `https://extremelifeherbal.com/api/payments/webhook`
   - Add header: `x-payment-source: GCASH`

### API Endpoints

**Process Payment**:
```
POST /api/payments/process
Content-Type: application/json

{
  "orderId": "ORD-001",
  "amount": 1500,
  "method": "GCASH",
  "paymentData": {
    "phoneNumber": "09123456789"
  }
}
```

**Verify Payment**:
```
POST /api/payments/verify
Content-Type: application/json

{
  "transactionId": "TXN-...",
  "method": "GCASH"
}
```

---

## 2. PayMaya Integration Setup

### Prerequisites
- PayMaya Merchant Account
- Public Key and Secret Key from PayMaya
- Merchant ID from PayMaya
- Webhook Secret for webhook verification

### Configuration Steps

1. **Obtain PayMaya Credentials**:
   - Visit: https://merchant.paymaya.com
   - Sign up for a merchant account
   - Navigate to API Settings
   - Generate Public Key and Secret Key
   - Note your Merchant ID

2. **Add to Environment Variables** (`.env`):
   ```
   PAYMAYA_API_KEY="your-paymaya-public-key"
   PAYMAYA_API_SECRET="your-paymaya-secret-key"
   PAYMAYA_MERCHANT_ID="your-merchant-id"
   PAYMAYA_WEBHOOK_SECRET="your-webhook-secret"
   ```

3. **Configure Webhook URL**:
   - In PayMaya Merchant Dashboard
   - Set Webhook URL to: `https://extremelifeherbal.com/api/payments/webhook`
   - Add header: `x-payment-source: PAYMAYA`

### API Endpoints

**Process Payment**:
```
POST /api/payments/process
Content-Type: application/json

{
  "orderId": "ORD-001",
  "amount": 1500,
  "method": "PAYMAYA",
  "paymentData": {
    "email": "customer@example.com"
  }
}
```

**Verify Payment**:
```
POST /api/payments/verify
Content-Type: application/json

{
  "transactionId": "TXN-...",
  "method": "PAYMAYA"
}
```

---

## 3. Webhook Configuration

### Webhook Handler
- **Endpoint**: `POST /api/payments/webhook`
- **Location**: `src/app/api/payments/webhook/route.ts`

### Webhook Signature Verification
All webhooks are verified using HMAC-SHA256 signature:

```typescript
const expectedSignature = crypto
  .createHmac("sha256", webhookSecret)
  .update(JSON.stringify(payload))
  .digest("hex");

if (payload.signature !== expectedSignature) {
  throw new Error("Invalid webhook signature");
}
```

### Webhook Payload Format

**GCash Webhook**:
```json
{
  "transactionId": "TXN-...",
  "orderId": "ORD-001",
  "amount": 1500,
  "status": "SUCCESS",
  "timestamp": "2025-11-14T10:00:00Z",
  "signature": "..."
}
```

**PayMaya Webhook**:
```json
{
  "id": "PAY-...",
  "orderId": "ORD-001",
  "amount": 1500,
  "status": "COMPLETED",
  "createdAt": "2025-11-14T10:00:00Z",
  "signature": "..."
}
```

---

## 4. Testing Payment Gateways

### Test Mode
Both gateways support test mode for development:

1. Use test API credentials
2. Use test phone numbers/emails
3. Verify webhook handling in test environment

### Test Cases
- [ ] Successful payment
- [ ] Failed payment
- [ ] Pending payment
- [ ] Webhook verification
- [ ] Refund processing
- [ ] Payment verification

---

## 5. Troubleshooting

### Common Issues

**Issue**: "Invalid API Key"
- **Solution**: Verify API credentials in `.env` file

**Issue**: "Webhook signature validation failed"
- **Solution**: Ensure webhook secret matches in both gateway and `.env`

**Issue**: "Payment status not updating"
- **Solution**: Check webhook endpoint is accessible and returning 200 OK

---

## 6. Security Considerations

1. **Never commit credentials** to version control
2. **Use environment variables** for all sensitive data
3. **Verify webhook signatures** on every webhook
4. **Use HTTPS** for all API calls
5. **Encrypt sensitive data** in database
6. **Implement rate limiting** on payment endpoints
7. **Log all transactions** for audit trail

---

**Last Updated**: November 14, 2025

