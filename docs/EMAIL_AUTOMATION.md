# Email Automation System Documentation

## Overview

The Philippines E-Commerce Platform includes a comprehensive email automation system for the domain **extremelifeherbal.com**. This system handles transactional emails, marketing automation, vendor communications, and email tracking.

## Configuration

### Email Domain
- **Domain**: extremelifeherbal.com
- **From Email**: noreply@extremelifeherbal.com
- **Support Email**: support@extremelifeherbal.com
- **Vendor Email**: vendors@extremelifeherbal.com
- **Admin Email**: admin@extremelifeherbal.com

### Email Providers
The system supports multiple email providers:
- **SendGrid** (default)
- **Mailgun**
- **AWS SES**

### Environment Variables
```env
# Email Provider
EMAIL_PROVIDER=sendgrid

# SMTP Configuration
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASSWORD=your_api_key

# SendGrid
SENDGRID_API_KEY=your_sendgrid_key

# Mailgun
MAILGUN_API_KEY=your_mailgun_key
MAILGUN_DOMAIN=extremelifeherbal.com

# AWS SES
AWS_REGION=ap-southeast-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key

# App URLs
NEXT_PUBLIC_APP_URL=https://extremelifeherbal.com
```

## Email Types

### Transactional Emails
1. **Account Verification** - Sent when user registers
2. **Password Reset** - Sent when user requests password reset
3. **Welcome** - Sent after email verification
4. **Order Confirmation** - Sent when order is placed
5. **Payment Confirmation** - Sent when payment is confirmed
6. **Shipping Update** - Sent when order ships
7. **Delivery Confirmation** - Sent when order is delivered

### Marketing Emails
1. **Abandoned Cart** - Sent 1 hour after cart abandonment
2. **Product Recommendation** - Sent 24 hours after product view
3. **Promotional** - Sent for special campaigns
4. **Newsletter** - Weekly newsletter

### Vendor Emails
1. **New Order Notification** - Sent to vendor when order placed
2. **Inventory Alert** - Sent when stock is low
3. **Performance Report** - Monthly performance metrics
4. **Commission Statement** - Monthly commission details

### Security Emails
1. **Security Alert** - Sent for suspicious activities

## API Endpoints

### Send Email
```
POST /api/emails/send
Authorization: Bearer token (Admin only)

Body:
{
  "to": "user@example.com",
  "subject": "Email Subject",
  "html": "<p>HTML content</p>",
  "text": "Plain text content",
  "cc": ["cc@example.com"],
  "bcc": ["bcc@example.com"]
}
```

### Queue Email
```
POST /api/emails/queue
Authorization: Bearer token

Body:
{
  "email": "user@example.com",
  "type": "WELCOME",
  "templateId": "welcome",
  "variables": {
    "firstName": "John",
    "shopUrl": "https://extremelifeherbal.com/shop"
  },
  "priority": 5
}
```

### Get Email Preferences
```
GET /api/emails/preferences
Authorization: Bearer token

Response:
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

### Update Email Preferences
```
PATCH /api/emails/preferences
Authorization: Bearer token

Body:
{
  "marketingEmails": false,
  "promotionalEmails": false
}
```

### Get Email Logs
```
GET /api/emails/logs?limit=50&type=WELCOME&status=SENT
Authorization: Bearer token

Response:
{
  "success": true,
  "logs": [...],
  "stats": {
    "total": 100,
    "sent": 95,
    "opened": 45,
    "clicked": 15,
    "bounced": 3,
    "failed": 2,
    "openRate": 45,
    "clickRate": 15
  }
}
```

### Unsubscribe
```
POST /api/emails/unsubscribe
Body: { "unsubscribeToken": "token" }

GET /api/emails/unsubscribe?token=token
```

## Email Templates

### Template Variables
Templates support variable substitution using `${variableName}` syntax.

### Available Templates
- `accountVerification` - Account verification email
- `passwordReset` - Password reset email
- `welcome` - Welcome email
- `orderConfirmation` - Order confirmation email
- `abandonedCart` - Abandoned cart email

### Creating Custom Templates
```typescript
import { renderEmailTemplate } from '@/lib/email-templates';

const template = renderEmailTemplate('welcome', {
  firstName: 'John',
  shopUrl: 'https://extremelifeherbal.com/shop',
  accountUrl: 'https://extremelifeherbal.com/account'
});

// Returns: { subject, html, text }
```

## Email Queue Management

### Queue Configuration
- **Max Retries**: 3
- **Retry Delay**: 5 seconds
- **Batch Size**: 100 emails per batch
- **Processing Interval**: 10 seconds

### Queue Processor
```typescript
import { emailQueueProcessor } from '@/lib/email-queue-processor';

// Start processing
emailQueueProcessor.startProcessing();

// Get queue statistics
const stats = await emailQueueProcessor.getQueueStats();

// Pause/Resume
emailQueueProcessor.pauseProcessing();
emailQueueProcessor.resumeProcessing();

// Clear old items
await emailQueueProcessor.clearOldItems(30); // 30 days old
```

## Email Automation Triggers

### Trigger Events
```typescript
import { EmailAutomationTriggers } from '@/lib/email-automation-triggers';

// User registered
await EmailAutomationTriggers.onUserRegistered(userId, email, firstName);

// Order placed
await EmailAutomationTriggers.onOrderPlaced(
  userId, email, firstName, orderNumber, orderDate, 
  subtotal, shippingFee, totalAmount
);

// Order shipped
await EmailAutomationTriggers.onOrderShipped(
  userId, email, firstName, orderNumber, trackingNumber, carrier
);

// Cart abandoned
await EmailAutomationTriggers.onCartAbandoned(
  userId, email, firstName, itemCount, cartTotal, 
  discountCode, discountPercent
);

// Password reset
await EmailAutomationTriggers.onPasswordResetRequested(
  email, firstName, resetToken
);
```

## Email Tracking

### Tracking Features
- **Open Tracking**: Tracks when emails are opened
- **Click Tracking**: Tracks when links are clicked
- **Bounce Tracking**: Tracks bounced emails
- **Unsubscribe Tracking**: Tracks unsubscribe events

### Tracking Metrics
- Open Rate: (Opens / Total) × 100
- Click Rate: (Clicks / Total) × 100
- Bounce Rate: (Bounces / Total) × 100
- Failure Rate: (Failures / Total) × 100

## Email Preferences

### Default Preferences
All preferences default to `true` (opt-in):
- Marketing Emails
- Order Notifications
- Promotional Emails
- Abandoned Cart Emails
- Product Recommendations
- Vendor Communications
- Weekly Newsletter

### Unsubscribe Management
- One-click unsubscribe links in all emails
- List-Unsubscribe header support
- Unsubscribe token validation
- GDPR compliance

## Rate Limiting

### Limits
- **Per Minute**: 60 emails
- **Per Hour**: 1,000 emails
- **Per Day**: 10,000 emails

## Database Schema

### EmailPreferences
```prisma
model EmailPreferences {
  id                      String   @id @default(cuid())
  userProfileId           String   @unique
  marketingEmails         Boolean  @default(true)
  orderNotifications      Boolean  @default(true)
  promotionalEmails       Boolean  @default(true)
  abandonedCartEmails     Boolean  @default(true)
  productRecommendations  Boolean  @default(true)
  vendorCommunications    Boolean  @default(true)
  weeklyNewsletter        Boolean  @default(true)
  unsubscribeToken        String   @unique
  createdAt               DateTime @default(now())
  updatedAt               DateTime @updatedAt
}
```

### EmailLog
```prisma
model EmailLog {
  id        String   @id @default(cuid())
  userId    String?
  email     String
  type      String
  subject   String
  status    EmailStatus
  sentAt    DateTime?
  openedAt  DateTime?
  clickedAt DateTime?
  metadata  Json?
  createdAt DateTime @default(now())
}
```

### EmailQueue
```prisma
model EmailQueue {
  id            String   @id @default(cuid())
  userId        String?
  email         String
  type          String
  templateId    String
  variables     Json
  status        QueueStatus
  priority      Int      @default(0)
  retryCount    Int      @default(0)
  maxRetries    Int      @default(3)
  sentAt        DateTime?
  failedAt      DateTime?
  failureReason String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

## Testing

### Run Tests
```bash
npm test -- src/__tests__/email-automation.test.ts --run
```

### Test Coverage
- 86 comprehensive tests
- Email Configuration (10 tests)
- Email Service (10 tests)
- Email Templates (10 tests)
- Email Validation (8 tests)
- Email Preferences (9 tests)
- Email Queue (6 tests)
- Email Tracking (10 tests)
- Email Types (16 tests)
- Integration Tests (7 tests)

## Storybook

### View Email Templates
```bash
npm run storybook
```

Navigate to: `Email/Templates` section

## Best Practices

1. **Always use email queue** for non-critical emails
2. **Respect user preferences** before sending marketing emails
3. **Include unsubscribe links** in all emails
4. **Use templates** for consistent branding
5. **Monitor queue statistics** regularly
6. **Test emails** before sending to production
7. **Handle bounces** and update email lists
8. **Implement rate limiting** to avoid spam filters
9. **Use proper authentication** (SPF, DKIM, DMARC)
10. **Log all email activities** for compliance

## Troubleshooting

### Emails Not Sending
1. Check SMTP configuration
2. Verify API keys
3. Check email queue status
4. Review email logs for errors

### High Bounce Rate
1. Verify email addresses
2. Check sender reputation
3. Review email content
4. Implement list cleaning

### Low Open Rate
1. Improve subject lines
2. Optimize send times
3. Segment audience
4. A/B test content

## Support

For issues or questions, contact:
- Support: support@extremelifeherbal.com
- Vendors: vendors@extremelifeherbal.com
- Admin: admin@extremelifeherbal.com

