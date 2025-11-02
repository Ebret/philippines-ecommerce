# Email API Reference

## Base URL
```
https://extremelifeherbal.com/api/emails
```

## Authentication
All endpoints require Bearer token authentication (except unsubscribe):
```
Authorization: Bearer <token>
```

## Endpoints

### 1. Send Email (Admin Only)
**POST** `/send`

Send email directly to recipients.

**Request:**
```json
{
  "to": "user@example.com",
  "subject": "Email Subject",
  "html": "<p>HTML content</p>",
  "text": "Plain text content",
  "from": "sender@extremelifeherbal.com",
  "replyTo": "reply@extremelifeherbal.com",
  "cc": ["cc@example.com"],
  "bcc": ["bcc@example.com"],
  "attachments": [
    {
      "filename": "document.pdf",
      "content": "base64_encoded_content",
      "contentType": "application/pdf"
    }
  ],
  "headers": {
    "X-Custom-Header": "value"
  },
  "tags": ["order", "confirmation"],
  "metadata": {
    "orderId": "ORD-123"
  }
}
```

**Response (Success):**
```json
{
  "success": true,
  "messageId": "msg-123456"
}
```

**Response (Error):**
```json
{
  "error": "Validation error",
  "details": [...]
}
```

**Status Codes:**
- 200: Email sent successfully
- 400: Validation error
- 403: Unauthorized (Admin only)
- 500: Server error

---

### 2. Queue Email
**POST** `/queue`

Queue email for later sending.

**Request:**
```json
{
  "email": "user@example.com",
  "type": "WELCOME",
  "templateId": "welcome",
  "variables": {
    "firstName": "John",
    "shopUrl": "https://extremelifeherbal.com/shop"
  },
  "priority": 5,
  "maxRetries": 3
}
```

**Response (Success):**
```json
{
  "success": true,
  "queueId": "queue-123456"
}
```

**Status Codes:**
- 201: Email queued successfully
- 400: Validation error
- 401: Unauthorized
- 500: Server error

---

### 3. Get Email Queue
**GET** `/queue?status=PENDING&limit=50&offset=0`

Get queued emails for current user.

**Query Parameters:**
- `status` (optional): PENDING, PROCESSING, SENT, FAILED, RETRY
- `limit` (optional): Max results (default: 50)
- `offset` (optional): Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "items": [
    {
      "id": "queue-123",
      "email": "user@example.com",
      "type": "WELCOME",
      "status": "PENDING",
      "priority": 5,
      "createdAt": "2024-11-02T12:00:00Z"
    }
  ],
  "total": 100,
  "limit": 50,
  "offset": 0
}
```

**Status Codes:**
- 200: Success
- 401: Unauthorized
- 500: Server error

---

### 4. Get Email Preferences
**GET** `/preferences`

Get email preferences for current user.

**Response:**
```json
{
  "success": true,
  "preferences": {
    "marketingEmails": true,
    "orderNotifications": true,
    "promotionalEmails": true,
    "abandonedCartEmails": true,
    "productRecommendations": true,
    "vendorCommunications": true,
    "weeklyNewsletter": true
  }
}
```

**Status Codes:**
- 200: Success
- 401: Unauthorized
- 404: User not found
- 500: Server error

---

### 5. Update Email Preferences
**PATCH** `/preferences`

Update email preferences for current user.

**Request:**
```json
{
  "marketingEmails": false,
  "promotionalEmails": false,
  "weeklyNewsletter": true
}
```

**Response:**
```json
{
  "success": true,
  "preferences": {
    "marketingEmails": false,
    "promotionalEmails": false,
    "weeklyNewsletter": true
  }
}
```

**Status Codes:**
- 200: Success
- 400: Validation error
- 401: Unauthorized
- 500: Server error

---

### 6. Get Email Logs
**GET** `/logs?limit=50&type=WELCOME&status=SENT`

Get email logs for current user.

**Query Parameters:**
- `limit` (optional): Max results (default: 50)
- `type` (optional): Email type filter
- `status` (optional): Email status filter

**Response:**
```json
{
  "success": true,
  "logs": [
    {
      "id": "log-123",
      "email": "user@example.com",
      "type": "WELCOME",
      "subject": "Welcome to Extreme Life Herbal",
      "status": "OPENED",
      "sentAt": "2024-11-02T12:00:00Z",
      "openedAt": "2024-11-02T12:15:00Z"
    }
  ],
  "stats": {
    "total": 100,
    "sent": 95,
    "opened": 45,
    "clicked": 15,
    "bounced": 3,
    "failed": 2,
    "openRate": 45,
    "clickRate": 15,
    "bounceRate": 3,
    "failureRate": 2
  }
}
```

**Status Codes:**
- 200: Success
- 401: Unauthorized
- 500: Server error

---

### 7. Unsubscribe (Public)
**POST** `/unsubscribe`

Unsubscribe user from emails.

**Request:**
```json
{
  "unsubscribeToken": "token-123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully unsubscribed from emails"
}
```

**Status Codes:**
- 200: Success
- 400: Invalid token
- 500: Server error

---

### 8. Unsubscribe via Link (Public)
**GET** `/unsubscribe?token=token-123456`

Unsubscribe via email link.

**Response:**
- Redirects to `/email/unsubscribe-success` on success
- Redirects to `/email/unsubscribe-error` on failure

---

## Error Responses

### Validation Error
```json
{
  "error": "Validation error",
  "details": [
    {
      "code": "invalid_type",
      "expected": "string",
      "received": "number",
      "path": ["to"],
      "message": "Expected string, received number"
    }
  ]
}
```

### Unauthorized
```json
{
  "error": "Unauthorized"
}
```

### Not Found
```json
{
  "error": "User not found"
}
```

### Server Error
```json
{
  "error": "Failed to send email"
}
```

## Rate Limiting

Rate limits are applied per user:
- **Per Minute**: 60 requests
- **Per Hour**: 1,000 requests
- **Per Day**: 10,000 requests

When rate limit is exceeded:
```json
{
  "error": "Rate limit exceeded",
  "retryAfter": 60
}
```

## Email Types

### Transactional
- `ACCOUNT_VERIFICATION`
- `PASSWORD_RESET`
- `WELCOME`
- `ORDER_CONFIRMATION`
- `PAYMENT_CONFIRMATION`
- `SHIPPING_UPDATE`
- `DELIVERY_CONFIRMATION`

### Marketing
- `ABANDONED_CART`
- `PRODUCT_RECOMMENDATION`
- `PROMOTIONAL`
- `NEWSLETTER`

### Vendor
- `VENDOR_NEW_ORDER`
- `VENDOR_INVENTORY_ALERT`
- `VENDOR_PERFORMANCE_REPORT`
- `VENDOR_COMMISSION_STATEMENT`

### Security
- `SECURITY_ALERT`

## Email Status

- `PENDING`: Waiting to be sent
- `PROCESSING`: Currently being sent
- `SENT`: Successfully sent
- `DELIVERED`: Delivered to recipient
- `OPENED`: Opened by recipient
- `CLICKED`: Link clicked by recipient
- `BOUNCED`: Bounced (hard or soft)
- `FAILED`: Failed to send

## Queue Status

- `PENDING`: Waiting to be processed
- `PROCESSING`: Currently processing
- `SENT`: Successfully sent
- `FAILED`: Failed after max retries
- `RETRY`: Scheduled for retry

## Examples

### Send Welcome Email
```bash
curl -X POST https://extremelifeherbal.com/api/emails/queue \
  -H "Authorization: Bearer token" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "type": "WELCOME",
    "templateId": "welcome",
    "variables": {
      "firstName": "John",
      "shopUrl": "https://extremelifeherbal.com/shop",
      "accountUrl": "https://extremelifeherbal.com/account"
    },
    "priority": 9
  }'
```

### Get Email Statistics
```bash
curl -X GET https://extremelifeherbal.com/api/emails/logs \
  -H "Authorization: Bearer token"
```

### Update Preferences
```bash
curl -X PATCH https://extremelifeherbal.com/api/emails/preferences \
  -H "Authorization: Bearer token" \
  -H "Content-Type: application/json" \
  -d '{
    "marketingEmails": false,
    "promotionalEmails": false
  }'
```

## Webhooks (Future)

Webhook support for email events:
- `email.sent`
- `email.opened`
- `email.clicked`
- `email.bounced`
- `email.complained`
- `email.unsubscribed`

## Changelog

### v1.0.0 (2024-11-02)
- Initial release
- Email sending and queuing
- Email preferences management
- Email tracking and logging
- Unsubscribe management
- 86 comprehensive tests
- Full documentation

