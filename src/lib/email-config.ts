/**
 * Email Configuration for Philippines E-Commerce Platform
 * Domain: extremelifeherbal.com
 * Supports multiple email providers (SendGrid, Mailgun, AWS SES)
 */

export const EMAIL_CONFIG = {
  domain: 'extremelifeherbal.com',
  fromEmail: 'noreply@extremelifeherbal.com',
  fromName: 'Extreme Life Herbal',
  supportEmail: 'support@extremelifeherbal.com',
  vendorEmail: 'vendors@extremelifeherbal.com',
  adminEmail: 'admin@extremelifeherbal.com',
  
  // SMTP Configuration
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.sendgrid.net',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER || 'apikey',
      pass: process.env.SMTP_PASSWORD || '',
    },
  },

  // Email Provider Configuration
  provider: (process.env.EMAIL_PROVIDER || 'sendgrid') as 'sendgrid' | 'mailgun' | 'ses',
  
  // SendGrid Configuration
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY || '',
  },

  // Mailgun Configuration
  mailgun: {
    apiKey: process.env.MAILGUN_API_KEY || '',
    domain: process.env.MAILGUN_DOMAIN || 'extremelifeherbal.com',
  },

  // AWS SES Configuration
  ses: {
    region: process.env.AWS_REGION || 'ap-southeast-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },

  // Email Queue Configuration
  queue: {
    maxRetries: 3,
    retryDelayMs: 5000,
    batchSize: 100,
    processingIntervalMs: 10000,
  },

  // Email Tracking Configuration
  tracking: {
    enableOpenTracking: true,
    enableClickTracking: true,
    enableUnsubscribeTracking: true,
  },

  // Rate Limiting
  rateLimit: {
    perMinute: 60,
    perHour: 1000,
    perDay: 10000,
  },

  // Email Templates
  templates: {
    accountVerification: 'account-verification',
    passwordReset: 'password-reset',
    welcome: 'welcome',
    orderConfirmation: 'order-confirmation',
    paymentConfirmation: 'payment-confirmation',
    shippingUpdate: 'shipping-update',
    deliveryConfirmation: 'delivery-confirmation',
    orderCancelled: 'order-cancelled',
    returnInitiated: 'return-initiated',
    returnApproved: 'return-approved',
    refundProcessed: 'refund-processed',
    abandonedCart: 'abandoned-cart',
    productRecommendation: 'product-recommendation',
    promotional: 'promotional',
    vendorNewOrder: 'vendor-new-order',
    vendorInventoryAlert: 'vendor-inventory-alert',
    vendorPerformanceReport: 'vendor-performance-report',
    vendorCommissionStatement: 'vendor-commission-statement',
    newsletter: 'newsletter',
    accountUpdate: 'account-update',
    securityAlert: 'security-alert',
  },

  // Email Preferences
  preferences: {
    defaultMarketingEmails: true,
    defaultOrderNotifications: true,
    defaultPromotionalEmails: true,
    defaultAbandonedCartEmails: true,
    defaultProductRecommendations: true,
    defaultVendorCommunications: true,
    defaultWeeklyNewsletter: true,
  },

  // Unsubscribe Configuration
  unsubscribe: {
    enableOneClickUnsubscribe: true,
    enableListUnsubscribe: true,
  },

  // Development Configuration
  development: {
    logEmails: true,
    captureEmails: process.env.CAPTURE_EMAILS === 'true',
    captureEmailAddress: process.env.CAPTURE_EMAIL_ADDRESS || 'dev@extremelifeherbal.com',
  },
};

// Email Provider Type
export type EmailProvider = 'sendgrid' | 'mailgun' | 'ses';

// Email Send Options
export interface EmailSendOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  replyTo?: string;
  cc?: string[];
  bcc?: string[];
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
  headers?: Record<string, string>;
  tags?: string[];
  metadata?: Record<string, any>;
  trackingId?: string;
}

// Email Template Variables
export interface EmailTemplateVariables {
  [key: string]: string | number | boolean | object;
}

// Email Queue Item
export interface EmailQueueItem {
  userId?: string;
  email: string;
  type: string;
  templateId: string;
  variables: EmailTemplateVariables;
  priority?: number;
  retryCount?: number;
  maxRetries?: number;
}

// Email Log Entry
export interface EmailLogEntry {
  userId?: string;
  email: string;
  type: string;
  subject: string;
  status: 'PENDING' | 'SENT' | 'DELIVERED' | 'OPENED' | 'CLICKED' | 'BOUNCED' | 'FAILED';
  sentAt?: Date;
  openedAt?: Date;
  clickedAt?: Date;
  bounceReason?: string;
  metadata?: Record<string, any>;
}

// Email Tracking Event
export interface EmailTrackingEvent {
  trackingId: string;
  event: 'open' | 'click' | 'bounce' | 'unsubscribe';
  timestamp: Date;
  userAgent?: string;
  ipAddress?: string;
  url?: string;
}

