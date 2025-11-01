# Payment Gateway Integration Guide

## Overview

The Payment Gateway Integration for the Philippines E-Commerce Platform provides comprehensive payment processing with support for multiple payment methods including GCash, PayMaya, credit/debit cards, and Cash on Delivery (COD).

## Architecture

### Core Components

1. **Payment Validation Schemas** (`src/lib/validations/payment.ts`)
   - GCashPaymentSchema: Validates GCash wallet payments
   - PayMayaPaymentSchema: Validates PayMaya digital wallet payments
   - CardPaymentSchema: Validates credit/debit card payments
   - CODPaymentSchema: Validates Cash on Delivery payments
   - RefundRequestSchema: Validates refund requests
   - WebhookPayloadSchemas: Validates gateway webhooks

2. **Payment Utility Functions** (`src/lib/payment-utils.ts`)
   - `generateTransactionId()`: Creates unique transaction identifiers
   - `generateReceiptNumber()`: Generates receipt numbers
   - `calculateProcessingFee()`: Calculates method-specific fees
   - `validateCardNumber()`: Validates card numbers using Luhn algorithm
   - `maskCardNumber()`: Masks card numbers for display
   - `validateCVV()`: Validates CVV codes
   - `isCardExpired()`: Checks card expiration
   - `generateWebhookSignature()`: Creates webhook signatures
   - `verifyWebhookSignature()`: Verifies webhook authenticity
   - `isEligibleForRefund()`: Checks refund eligibility

3. **Payment Gateways**
   - GCash Gateway (`src/lib/payment-gateways/gcash.ts`)
   - PayMaya Gateway (`src/lib/payment-gateways/paymaya.ts`)
   - Card Gateway (`src/lib/payment-gateways/card.ts`)
   - COD Gateway (`src/lib/payment-gateways/cod.ts`)

4. **Receipt & Transaction Logging** (`src/lib/payment-receipt.ts`)
   - Receipt generation (text and HTML formats)
   - Transaction logging
   - Payment history tracking

5. **API Routes**
   - Payment Processing: `/api/payments/process`
   - Payment Verification: `/api/payments/verify`
   - Refund Processing: `/api/payments/refund`
   - Payment Details: `/api/payments/[id]`
   - Webhook Handler: `/api/payments/webhook`

## Supported Payment Methods

### 1. GCash
- **Type**: Digital Wallet
- **Processing Fee**: 2%
- **Validation**: Philippine phone number (09XXXXXXXXX)
- **Status**: PENDING → COMPLETED
- **Webhook Support**: Yes

### 2. PayMaya
- **Type**: Digital Wallet
- **Processing Fee**: 2.5%
- **Validation**: Email address
- **Status**: PENDING → COMPLETED
- **Webhook Support**: Yes

### 3. Credit/Debit Card
- **Type**: Card Payment
- **Processing Fee**: 3% (Credit), 2% (Debit)
- **Validation**: Luhn algorithm, CVV, expiration date
- **PCI DSS Compliance**: Required
- **Webhook Support**: Yes
- **Providers**: Stripe, PayMongo

### 4. Cash on Delivery (COD)
- **Type**: Post-Payment
- **Processing Fee**: 0%
- **Maximum Amount**: ₱50,000
- **Status**: PENDING → COMPLETED (on delivery)
- **Webhook Support**: Yes (delivery confirmation)

## API Endpoints

### POST /api/payments/process
Process payment through selected gateway.

**Request:**
```json
{
  "orderId": "ORD-001",
  "amount": 1500,
  "method": "GCASH",
  "paymentData": {
    "phoneNumber": "09123456789"
  },
  "metadata": {
    "userId": "user-123"
  }
}
```

**Response:**
```json
{
  "success": true,
  "transaction": {
    "transactionId": "TXN-...",
    "referenceCode": "REF-...",
    "orderId": "ORD-001",
    "amount": 1530,
    "processingFee": 30,
    "method": "GCASH",
    "status": "PENDING",
    "timestamp": "2025-11-01T..."
  }
}
```

### POST /api/payments/verify
Verify payment status.

**Request:**
```json
{
  "transactionId": "TXN-...",
  "orderId": "ORD-001",
  "amount": 1500,
  "method": "GCASH"
}
```

**Response:**
```json
{
  "success": true,
  "payment": {
    "transactionId": "TXN-...",
    "orderId": "ORD-001",
    "amount": 1500,
    "method": "GCASH",
    "status": "COMPLETED",
    "verified": true
  }
}
```

### POST /api/payments/refund
Request refund for a payment.

**Request:**
```json
{
  "transactionId": "TXN-...",
  "orderId": "ORD-001",
  "amount": 1500,
  "reason": "Customer requested refund due to product defect",
  "notes": "Item was damaged upon delivery"
}
```

**Response:**
```json
{
  "success": true,
  "refund": {
    "refundId": "RFD-...",
    "transactionId": "TXN-...",
    "orderId": "ORD-001",
    "amount": 1500,
    "reason": "...",
    "status": "PENDING",
    "timestamp": "2025-11-01T..."
  }
}
```

### GET /api/payments/[id]
Get payment details.

**Response:**
```json
{
  "success": true,
  "payment": {
    "id": "...",
    "transactionId": "TXN-...",
    "orderId": "ORD-001",
    "amount": 1500,
    "method": "GCASH",
    "status": "COMPLETED",
    "timestamp": "2025-11-01T...",
    "receipt": {
      "receiptNumber": "RCP-...",
      "items": [...],
      "subtotal": 1200,
      "tax": 144,
      "shipping": 50,
      "total": 1394
    }
  }
}
```

### POST /api/payments/webhook
Handle payment gateway webhooks.

**Headers:**
```
x-payment-source: GCASH
```

**Request:**
```json
{
  "transactionId": "TXN-...",
  "orderId": "ORD-001",
  "amount": 1500,
  "status": "SUCCESS",
  "timestamp": "2025-11-01T...",
  "signature": "..."
}
```

## Processing Fees

| Payment Method | Fee Rate | Example (₱1000) |
|---|---|---|
| GCash | 2% | ₱20 |
| PayMaya | 2.5% | ₱25 |
| Credit Card | 3% | ₱30 |
| Debit Card | 2% | ₱20 |
| Bank Transfer | 1% | ₱10 |
| COD | 0% | ₱0 |

## Security Considerations

### PCI DSS Compliance
- Never store full card numbers
- Use tokenization for card data
- Implement SSL/TLS encryption
- Regular security audits

### Data Protection
- Encrypt sensitive payment data
- Use HMAC signatures for webhooks
- Implement rate limiting
- Log all transactions

### Validation
- Validate all input data with Zod schemas
- Verify webhook signatures
- Check card expiration dates
- Validate CVV codes

## Refund Policy

### Eligibility
- Payment must be in COMPLETED status
- Refund window: 30 days from payment
- Full or partial refunds supported

### Process
1. Customer requests refund
2. Admin reviews request
3. Refund processed through gateway
4. Customer receives refund
5. Transaction logged

## Testing

### Running Tests
```bash
npm test -- src/__tests__/payment.test.ts
```

### Test Coverage
- **27 total tests** (100% pass rate)
- Validation schemas: 6 tests
- Utility functions: 16 tests
- Payment gateways: 5 tests

### Key Test Areas
- Payment method validation
- Card number validation (Luhn algorithm)
- Processing fee calculations
- Refund eligibility checks
- Gateway payment processing
- COD amount limits

## Environment Variables

```env
# GCash Configuration
GCASH_API_KEY=your_gcash_api_key
GCASH_API_SECRET=your_gcash_api_secret
GCASH_MERCHANT_ID=your_gcash_merchant_id
GCASH_WEBHOOK_SECRET=your_gcash_webhook_secret

# PayMaya Configuration
PAYMAYA_API_KEY=your_paymaya_api_key
PAYMAYA_API_SECRET=your_paymaya_api_secret
PAYMAYA_MERCHANT_ID=your_paymaya_merchant_id
PAYMAYA_WEBHOOK_SECRET=your_paymaya_webhook_secret

# Card Payment Configuration
CARD_API_KEY=your_card_api_key
CARD_API_SECRET=your_card_api_secret
CARD_MERCHANT_ID=your_card_merchant_id
CARD_WEBHOOK_SECRET=your_card_webhook_secret
CARD_PROVIDER=STRIPE # or PAYMONGO

# Encryption
PAYMENT_ENCRYPTION_KEY=your_encryption_key
```

## Integration with Cart & Checkout

The payment system integrates seamlessly with the Shopping Cart & Checkout System:

1. **Cart Summary**: Includes payment method selection
2. **Checkout**: Validates payment data before processing
3. **Order Creation**: Links payment to order
4. **Receipt**: Generated after successful payment
5. **Order Status**: Updated based on payment status

## Future Enhancements

1. **Real-time Payment Status**: WebSocket updates
2. **Installment Plans**: Flexible payment options
3. **Loyalty Points**: Reward integration
4. **Multi-currency**: International payments
5. **Payment Analytics**: Dashboard and reporting
6. **Fraud Detection**: Advanced security measures
7. **Subscription Payments**: Recurring billing
8. **Payment Reconciliation**: Automated matching

## Troubleshooting

### Common Issues

**Payment Processing Failed**
- Check API credentials
- Verify webhook configuration
- Review error logs

**Webhook Not Received**
- Verify webhook URL
- Check firewall settings
- Review gateway logs

**Refund Not Processed**
- Check refund eligibility
- Verify gateway configuration
- Review transaction status

## Support & Maintenance

For issues or questions:
1. Check test files for usage examples
2. Review API endpoint implementations
3. Consult validation schemas for data requirements
4. Check utility functions for calculation logic
5. Review gateway implementations for integration details

## Deployment Checklist

- [ ] Set all environment variables
- [ ] Configure payment gateway credentials
- [ ] Set up webhook endpoints
- [ ] Enable SSL/TLS encryption
- [ ] Configure rate limiting
- [ ] Set up error monitoring
- [ ] Test all payment methods
- [ ] Verify webhook handling
- [ ] Set up transaction logging
- [ ] Configure backup payment methods

