# Email Automation System Setup Guide

## Prerequisites

- Node.js 20+
- PostgreSQL 15+
- npm or yarn
- Email provider account (SendGrid, Mailgun, or AWS SES)

## Installation

### 1. Install Dependencies

```bash
npm install nodemailer zod
```

### 2. Update Environment Variables

Create or update `.env.local`:

```env
# Email Provider (sendgrid, mailgun, or ses)
EMAIL_PROVIDER=sendgrid

# SMTP Configuration
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASSWORD=your_api_key

# SendGrid Configuration
SENDGRID_API_KEY=your_sendgrid_api_key

# Mailgun Configuration
MAILGUN_API_KEY=your_mailgun_api_key
MAILGUN_DOMAIN=extremelifeherbal.com

# AWS SES Configuration
AWS_REGION=ap-southeast-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key

# Application URLs
NEXT_PUBLIC_APP_URL=https://extremelifeherbal.com
```

### 3. Update Prisma Schema

The Prisma schema has been updated with email models:
- `EmailPreferences`
- `EmailLog`
- `EmailTemplate`
- `EmailQueue`

Run migrations:

```bash
npx prisma migrate dev --name add_email_models
```

### 4. Configure Email Provider

#### SendGrid Setup

1. Create SendGrid account at https://sendgrid.com
2. Generate API key
3. Add to `.env.local`:
   ```env
   SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
   ```

#### Mailgun Setup

1. Create Mailgun account at https://mailgun.com
2. Verify domain: extremelifeherbal.com
3. Get API key
4. Add to `.env.local`:
   ```env
   MAILGUN_API_KEY=key-xxxxxxxxxxxxx
   MAILGUN_DOMAIN=extremelifeherbal.com
   ```

#### AWS SES Setup

1. Create AWS account
2. Verify domain: extremelifeherbal.com
3. Create IAM user with SES permissions
4. Add to `.env.local`:
   ```env
   AWS_REGION=ap-southeast-1
   AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
   AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
   ```

### 5. Configure Domain Authentication

#### SPF Record
Add to DNS:
```
v=spf1 include:sendgrid.net ~all
```

#### DKIM Record
Add to DNS (provided by email provider):
```
v=DKIM1; k=rsa; p=MIGfMA0BgkqhkiG9w0BAQEFAAOCAQ8AMIGfMA0BgkqhkiG9w0BAQEFAAOCAQ8A...
```

#### DMARC Record
Add to DNS:
```
v=DMARC1; p=quarantine; rua=mailto:admin@extremelifeherbal.com
```

## Integration

### 1. User Registration

Update registration route to send verification email:

```typescript
import { EmailAutomationTriggers } from '@/lib/email-automation-triggers';

// In registration handler
await EmailAutomationTriggers.onUserRegistered(
  user.id,
  user.email,
  user.profile.firstName
);
```

### 2. Order Management

Update order creation to send confirmation:

```typescript
import { EmailAutomationTriggers } from '@/lib/email-automation-triggers';

// In order creation handler
await EmailAutomationTriggers.onOrderPlaced(
  userId,
  userEmail,
  firstName,
  order.id,
  new Date().toISOString(),
  subtotal,
  shippingFee,
  totalAmount
);
```

### 3. Shipping Updates

Update shipping handler:

```typescript
import { EmailAutomationTriggers } from '@/lib/email-automation-triggers';

// In shipping update handler
await EmailAutomationTriggers.onOrderShipped(
  userId,
  userEmail,
  firstName,
  orderId,
  trackingNumber,
  carrier
);
```

### 4. Cart Abandonment

Add to cart abandonment detection:

```typescript
import { EmailAutomationTriggers } from '@/lib/email-automation-triggers';

// In cart abandonment handler
await EmailAutomationTriggers.onCartAbandoned(
  userId,
  userEmail,
  firstName,
  itemCount,
  cartTotal,
  'COMEBACK15',
  15
);
```

### 5. Password Reset

Update password reset:

```typescript
import { EmailAutomationTriggers } from '@/lib/email-automation-triggers';

// In password reset handler
await EmailAutomationTriggers.onPasswordResetRequested(
  email,
  firstName,
  resetToken
);
```

## Queue Processing

### Start Queue Processor

In your application initialization (e.g., `src/app/layout.tsx` or API route):

```typescript
import { emailQueueProcessor } from '@/lib/email-queue-processor';

// Start processing on app initialization
if (typeof window === 'undefined') {
  emailQueueProcessor.startProcessing();
}
```

### Monitor Queue

Create an admin dashboard to monitor queue:

```typescript
import { emailQueueProcessor } from '@/lib/email-queue-processor';

// Get queue statistics
const stats = await emailQueueProcessor.getQueueStats();
console.log(`Pending: ${stats.pending}, Sent: ${stats.sent}, Failed: ${stats.failed}`);

// Get failed items
const failed = await emailQueueProcessor.getQueueItems('FAILED', 50);

// Retry failed emails
await emailQueueProcessor.retryFailedEmails();
```

## Testing

### Run Tests

```bash
npm test -- src/__tests__/email-automation.test.ts --run
```

### Test Email Sending

```typescript
import { emailService } from '@/lib/email-service';

const result = await emailService.sendEmail({
  to: 'test@example.com',
  subject: 'Test Email',
  html: '<p>This is a test email</p>',
  text: 'This is a test email',
});

console.log(result);
```

### Test Queue

```typescript
import { emailService } from '@/lib/email-service';

const result = await emailService.queueEmail({
  email: 'test@example.com',
  type: 'WELCOME',
  templateId: 'welcome',
  variables: { firstName: 'John' },
});

console.log(result);
```

## Storybook

View email templates in Storybook:

```bash
npm run storybook
```

Navigate to: `Email/Templates`

## Monitoring

### Email Logs

Query email logs:

```typescript
import { prisma } from '@/lib/prisma';

const logs = await prisma.emailLog.findMany({
  where: { userId: 'user-id' },
  orderBy: { createdAt: 'desc' },
  take: 50,
});
```

### Email Statistics

Get email statistics:

```typescript
import { emailService } from '@/lib/email-service';

const stats = await emailService.getEmailStats('user-id');
console.log(`Open Rate: ${stats.openRate}%`);
console.log(`Click Rate: ${stats.clickRate}%`);
```

### Queue Status

Monitor queue status:

```typescript
import { emailQueueProcessor } from '@/lib/email-queue-processor';

const stats = await emailQueueProcessor.getQueueStats();
console.log(stats);
// Output: { pending: 10, processing: 2, sent: 1000, failed: 5, retry: 3, total: 1020 }
```

## Troubleshooting

### Emails Not Sending

1. Check SMTP configuration in `.env.local`
2. Verify API keys are correct
3. Check email queue status
4. Review email logs for errors

```typescript
const logs = await prisma.emailLog.findMany({
  where: { status: 'FAILED' },
  orderBy: { createdAt: 'desc' },
  take: 10,
});
```

### High Bounce Rate

1. Verify email addresses are valid
2. Check sender reputation
3. Review email content for spam triggers
4. Implement list cleaning

### Queue Not Processing

1. Verify queue processor is started
2. Check for errors in logs
3. Verify database connection
4. Check email provider API status

## Performance Optimization

### Batch Processing

Configure batch size in `email-config.ts`:

```typescript
queue: {
  batchSize: 100, // Process 100 emails per batch
  processingIntervalMs: 10000, // Every 10 seconds
}
```

### Rate Limiting

Configure rate limits:

```typescript
rateLimit: {
  perMinute: 60,
  perHour: 1000,
  perDay: 10000,
}
```

### Database Indexing

Ensure proper indexes on email tables:

```sql
CREATE INDEX idx_email_queue_status ON email_queue(status);
CREATE INDEX idx_email_queue_priority ON email_queue(priority DESC);
CREATE INDEX idx_email_log_user_id ON email_log(user_id);
CREATE INDEX idx_email_log_status ON email_log(status);
```

## Security

### Email Validation

All emails are validated using Zod schemas:

```typescript
import { EmailSendSchema } from '@/lib/validations/email';

const validated = EmailSendSchema.parse(emailData);
```

### Authentication

All endpoints require authentication (except unsubscribe):

```typescript
const session = await getServerSession(authOptions);
if (!session?.user?.email) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

### GDPR Compliance

- Unsubscribe links in all emails
- Email preferences management
- Data retention policies
- Privacy policy compliance

## Maintenance

### Clean Old Queue Items

```typescript
import { emailQueueProcessor } from '@/lib/email-queue-processor';

// Clear items older than 30 days
await emailQueueProcessor.clearOldItems(30);
```

### Backup Email Logs

```bash
pg_dump -t email_log extremelifeherbal_db > email_logs_backup.sql
```

## Support

For issues or questions:
- Documentation: `/docs/EMAIL_AUTOMATION.md`
- API Reference: `/docs/EMAIL_API.md`
- Tests: `src/__tests__/email-automation.test.ts`
- Storybook: `npm run storybook`

