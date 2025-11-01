# Order Management System Documentation

## Overview

The Order Management System is a comprehensive solution for handling order processing, fulfillment, and tracking in the Philippines E-Commerce Platform. It integrates with multiple logistics providers (LBC Express, 2GO Express, JRS Express) and provides complete order lifecycle management.

## Features

### 1. Order Processing Workflow
- **Status Tracking**: PENDING → CONFIRMED → PROCESSING → SHIPPED → DELIVERED
- **Order Cancellation**: Cancel orders in PENDING or CONFIRMED status
- **Order Returns**: Return delivered orders within 30 days
- **Refund Management**: Automatic refund calculation with restocking fees

### 2. Logistics Integration
- **Multiple Providers**: LBC Express, 2GO Express, JRS Express
- **Shipping Rates**: Dynamic rate calculation based on origin/destination
- **Tracking**: Real-time shipment tracking with status updates
- **Webhooks**: Automatic status updates from logistics providers

### 3. Multi-Vendor Support
- **Order Splitting**: Automatic splitting of orders by vendor
- **Vendor Dashboard**: Vendors can manage their orders
- **Fulfillment**: Vendors can update order status and create shipments

### 4. Notifications
- Order confirmation
- Payment confirmation
- Shipment notifications
- Delivery confirmation
- Cancellation and refund notifications

## API Endpoints

### Orders

#### GET /api/orders
List all orders with filtering and pagination.

**Query Parameters:**
- `status`: Filter by order status (PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED, RETURNED)
- `paymentStatus`: Filter by payment status (PENDING, COMPLETED, FAILED, REFUNDED)
- `startDate`: Filter orders from this date (ISO format)
- `endDate`: Filter orders until this date (ISO format)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `sortBy`: Sort field (default: createdAt)
- `sortOrder`: Sort order - asc or desc (default: desc)

**Response:**
```json
{
  "orders": [
    {
      "id": "order-123",
      "orderNumber": "ORD-20251101-ABC123",
      "userId": "user-123",
      "vendorId": "vendor-123",
      "status": "SHIPPED",
      "paymentStatus": "COMPLETED",
      "totalAmount": 5000,
      "shippingFee": 150,
      "items": [...],
      "payments": [...],
      "shipment": {...},
      "createdAt": "2025-11-01T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "pages": 10
  }
}
```

#### GET /api/orders/[id]
Get order details.

**Response:**
```json
{
  "id": "order-123",
  "orderNumber": "ORD-20251101-ABC123",
  "userId": "user-123",
  "status": "SHIPPED",
  "items": [...],
  "shipment": {...},
  "payments": [...]
}
```

#### PATCH /api/orders/[id]
Update order status (admin only).

**Request Body:**
```json
{
  "status": "CONFIRMED",
  "notes": "Order confirmed by admin"
}
```

#### POST /api/orders/[id]/cancel
Cancel an order.

**Request Body:**
```json
{
  "reason": "Customer requested cancellation due to change of mind",
  "refundMethod": "ORIGINAL_PAYMENT"
}
```

**Response:**
```json
{
  "message": "Order cancelled successfully",
  "order": {...},
  "refund": {
    "amount": 4850,
    "method": "ORIGINAL_PAYMENT",
    "status": "PENDING"
  }
}
```

#### POST /api/orders/[id]/return
Request return for a delivered order.

**Request Body:**
```json
{
  "reason": "Product arrived damaged and does not match description",
  "items": [
    {
      "orderItemId": "item-123",
      "quantity": 1,
      "condition": "DAMAGED"
    }
  ],
  "refundMethod": "ORIGINAL_PAYMENT"
}
```

#### GET /api/orders/[id]/tracking
Get shipment tracking information.

**Response:**
```json
{
  "shipment": {
    "id": "shipment-123",
    "trackingNumber": "TRK-LBC-20251101-ABC123",
    "provider": "LBC",
    "status": "IN_TRANSIT",
    "shippedAt": "2025-11-01T12:00:00Z",
    "estimatedDelivery": "2025-11-02T18:00:00Z"
  },
  "tracking": {
    "trackingNumber": "TRK-LBC-20251101-ABC123",
    "provider": "LBC",
    "status": "IN_TRANSIT",
    "location": "Manila Hub",
    "events": [
      {
        "timestamp": "2025-11-01T12:00:00Z",
        "status": "SHIPPED",
        "location": "Manila Hub",
        "description": "Package shipped"
      }
    ]
  }
}
```

### Shipments

#### GET /api/shipments
List all shipments (admin only).

**Query Parameters:**
- `status`: Filter by shipment status
- `provider`: Filter by logistics provider
- `page`: Page number
- `limit`: Items per page
- `sortBy`: Sort field
- `sortOrder`: Sort order

#### POST /api/shipments
Create a new shipment (admin only).

**Request Body:**
```json
{
  "orderId": "order-123",
  "provider": "LBC",
  "trackingNumber": "TRK-LBC-20251101-ABC123",
  "shippingFee": 150,
  "notes": "Shipment created"
}
```

#### GET /api/shipments/[id]
Get shipment details.

#### PATCH /api/shipments/[id]
Update shipment status (admin only).

**Request Body:**
```json
{
  "status": "SHIPPED",
  "trackingNumber": "TRK-LBC-20251101-ABC123",
  "notes": "Package shipped"
}
```

#### GET /api/shipments/[id]/track
Get real-time tracking information.

#### POST /api/shipments/webhook
Handle webhook updates from logistics providers.

**Request Body:**
```json
{
  "provider": "LBC",
  "trackingNumber": "TRK-LBC-20251101-ABC123",
  "status": "IN_TRANSIT",
  "timestamp": "2025-11-01T12:00:00Z",
  "location": "Manila Hub",
  "signature": "webhook-signature-hash"
}
```

## Order Status Workflow

```
PENDING
  ├─ CONFIRMED (payment received)
  │   ├─ PROCESSING (preparing shipment)
  │   │   ├─ SHIPPED (handed to logistics)
  │   │   │   ├─ DELIVERED (received by customer)
  │   │   │   │   └─ RETURNED (return request approved)
  │   │   │   └─ FAILED_DELIVERY (delivery failed)
  │   │   └─ CANCELLED (cancelled during processing)
  │   └─ CANCELLED (cancelled before processing)
  └─ CANCELLED (cancelled before payment)
```

## Logistics Providers

### LBC Express
- **Service Types**: Standard, Express
- **Coverage**: Nationwide
- **Rates**: Dynamic based on weight and destination
- **Tracking**: Real-time tracking available

### 2GO Express
- **Service Types**: Standard, Express, Overnight
- **Coverage**: Nationwide
- **Rates**: Competitive rates for provincial areas
- **Tracking**: Real-time tracking available

### JRS Express
- **Service Types**: Standard, Express
- **Coverage**: Nationwide
- **Rates**: Affordable rates for bulk shipments
- **Tracking**: Real-time tracking available

## Refund Calculation

Refunds are calculated as follows:
1. Deduct shipping fee
2. Deduct restocking fee (10% of remaining amount)
3. Ensure non-negative result

**Example:**
- Order Total: ₱1,000
- Shipping Fee: ₱100
- Restocking Fee: 10% of (₱1,000 - ₱100) = ₱90
- **Refund Amount: ₱810**

## Notifications

The system sends notifications for:
- Order confirmation
- Payment confirmation
- Order processing
- Shipment creation
- Shipment shipped
- Out for delivery
- Delivery confirmation
- Delivery failed
- Order cancellation
- Return request
- Return approval
- Refund processed

## Error Handling

### Common Errors

**400 Bad Request**
- Invalid order data
- Invalid status transition
- Order cannot be cancelled
- Order cannot be returned

**401 Unauthorized**
- User not authenticated
- Invalid session

**403 Forbidden**
- User not authorized to access order
- Admin-only endpoint

**404 Not Found**
- Order not found
- Shipment not found
- User not found

**500 Internal Server Error**
- Database error
- Logistics provider error
- Notification service error

## Best Practices

1. **Always validate order status transitions** before updating
2. **Use logistics provider webhooks** for real-time tracking updates
3. **Send notifications** for all order status changes
4. **Calculate refunds accurately** including all fees
5. **Log all order operations** for audit trail
6. **Handle logistics provider failures** gracefully
7. **Implement retry logic** for failed operations
8. **Monitor order processing** for delays

## Testing

Run tests with:
```bash
npm test -- --run
```

All order management tests are in `src/__tests__/orders.test.ts` with 31 comprehensive test cases covering:
- Order utility functions
- Validation schemas
- Logistics providers
- Logistics factory
- Status transitions
- Refund calculations
- Notification generation

## Integration Examples

### Create Order and Shipment
```typescript
// 1. Create order (handled by checkout system)
const order = await prisma.order.create({...});

// 2. Create shipment
const shipment = await fetch('/api/shipments', {
  method: 'POST',
  body: JSON.stringify({
    orderId: order.id,
    provider: 'LBC',
  }),
});

// 3. Get tracking
const tracking = await fetch(`/api/orders/${order.id}/tracking`);
```

### Handle Logistics Webhook
```typescript
// Logistics provider sends webhook
POST /api/shipments/webhook
{
  "provider": "LBC",
  "trackingNumber": "TRK-LBC-20251101-ABC123",
  "status": "DELIVERED",
  "timestamp": "2025-11-02T15:30:00Z",
  "signature": "..."
}

// System automatically:
// 1. Verifies webhook signature
// 2. Updates shipment status
// 3. Updates order status
// 4. Sends delivery notification
```

## Future Enhancements

1. **Advanced Analytics**: Order metrics and trends
2. **Batch Operations**: Bulk order processing
3. **Custom Workflows**: Configurable order workflows
4. **Integration**: More logistics providers
5. **Mobile App**: Mobile order tracking
6. **AI Predictions**: Delivery time predictions

