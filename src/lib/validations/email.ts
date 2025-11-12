/**
 * Email Validation Schemas
 * Zod schemas for email operations
 */

import { z } from 'zod';

// Email send schema
export const EmailSendSchema = z.object({
  to: z.union([z.string().email(), z.array(z.string().email())]),
  subject: z.string().min(1).max(200),
  html: z.string().optional(),
  text: z.string().optional(),
  from: z.string().email().optional(),
  replyTo: z.string().email().optional(),
  cc: z.array(z.string().email()).optional(),
  bcc: z.array(z.string().email()).optional(),
  attachments: z.array(z.object({
    filename: z.string(),
    content: z.union([z.instanceof(Buffer), z.string()]),
    contentType: z.string().optional(),
  })).optional(),
  headers: z.record(z.string(), z.string()).optional(),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
  trackingId: z.string().optional(),
});

// Email queue schema
export const EmailQueueSchema = z.object({
  userId: z.string().optional(),
  email: z.string().email(),
  type: z.string(),
  templateId: z.string(),
  variables: z.record(z.string(), z.any()),
  priority: z.number().int().min(0).max(10).optional(),
  retryCount: z.number().int().min(0).optional(),
  maxRetries: z.number().int().min(1).optional(),
});

// Email preferences schema
export const EmailPreferencesSchema = z.object({
  marketingEmails: z.boolean().optional(),
  orderNotifications: z.boolean().optional(),
  promotionalEmails: z.boolean().optional(),
  abandonedCartEmails: z.boolean().optional(),
  productRecommendations: z.boolean().optional(),
  vendorCommunications: z.boolean().optional(),
  weeklyNewsletter: z.boolean().optional(),
});

// Email template schema
export const EmailTemplateSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.string(),
  subject: z.string().min(1).max(200),
  htmlContent: z.string(),
  plainTextContent: z.string(),
  variables: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});

// Email log query schema
export const EmailLogQuerySchema = z.object({
  userId: z.string().optional(),
  email: z.string().email().optional(),
  type: z.string().optional(),
  status: z.enum(['PENDING', 'SENT', 'DELIVERED', 'OPENED', 'CLICKED', 'BOUNCED', 'FAILED']).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  limit: z.number().int().min(1).max(100).optional(),
  offset: z.number().int().min(0).optional(),
});

// Email tracking event schema
export const EmailTrackingEventSchema = z.object({
  trackingId: z.string(),
  event: z.enum(['open', 'click', 'bounce', 'unsubscribe']),
  userAgent: z.string().optional(),
  ipAddress: z.string().optional(),
  url: z.string().url().optional(),
});

// Unsubscribe schema
export const UnsubscribeSchema = z.object({
  unsubscribeToken: z.string(),
});

// Email stats query schema
export const EmailStatsQuerySchema = z.object({
  userId: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  type: z.string().optional(),
});

// Bulk email schema
export const BulkEmailSchema = z.object({
  recipients: z.array(z.object({
    email: z.string().email(),
    variables: z.record(z.string(), z.any()),
  })),
  type: z.string(),
  templateId: z.string(),
  priority: z.number().int().min(0).max(10).optional(),
});

// Email campaign schema
export const EmailCampaignSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.string(),
  templateId: z.string(),
  recipients: z.array(z.string().email()),
  variables: z.record(z.string(), z.any()),
  scheduledAt: z.date().optional(),
  priority: z.number().int().min(0).max(10).optional(),
});

// Email automation trigger schema
export const EmailAutomationTriggerSchema = z.object({
  name: z.string().min(1).max(100),
  trigger: z.enum([
    'USER_REGISTERED',
    'EMAIL_VERIFIED',
    'FIRST_PURCHASE',
    'ABANDONED_CART',
    'ORDER_PLACED',
    'ORDER_SHIPPED',
    'ORDER_DELIVERED',
    'PRODUCT_VIEWED',
    'BIRTHDAY',
    'ANNIVERSARY',
  ]),
  templateId: z.string(),
  delayMinutes: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

// Email template variables schema
export const EmailTemplateVariablesSchema = z.record(z.string(), z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.object({}).passthrough(),
]));

// Email rate limit schema
export const EmailRateLimitSchema = z.object({
  userId: z.string(),
  type: z.string(),
  timestamp: z.date(),
});

// Email bounce schema
export const EmailBounceSchema = z.object({
  email: z.string().email(),
  bounceType: z.enum(['PERMANENT', 'TEMPORARY']),
  bounceReason: z.string(),
  timestamp: z.date(),
});

// Email complaint schema
export const EmailComplaintSchema = z.object({
  email: z.string().email(),
  complaintType: z.enum(['ABUSE', 'FRAUD', 'NOT_REQUESTED', 'OTHER']),
  timestamp: z.date(),
});

export type EmailSend = z.infer<typeof EmailSendSchema>;
export type EmailQueue = z.infer<typeof EmailQueueSchema>;
export type EmailPreferences = z.infer<typeof EmailPreferencesSchema>;
export type EmailTemplate = z.infer<typeof EmailTemplateSchema>;
export type EmailLogQuery = z.infer<typeof EmailLogQuerySchema>;
export type EmailTrackingEvent = z.infer<typeof EmailTrackingEventSchema>;
export type Unsubscribe = z.infer<typeof UnsubscribeSchema>;
export type EmailStatsQuery = z.infer<typeof EmailStatsQuerySchema>;
export type BulkEmail = z.infer<typeof BulkEmailSchema>;
export type EmailCampaign = z.infer<typeof EmailCampaignSchema>;
export type EmailAutomationTrigger = z.infer<typeof EmailAutomationTriggerSchema>;
export type EmailBounce = z.infer<typeof EmailBounceSchema>;
export type EmailComplaint = z.infer<typeof EmailComplaintSchema>;

