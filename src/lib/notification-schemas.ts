/**
 * Notification Validation Schemas
 * Week 8: Notifications System
 */

import { z } from 'zod';
import { NotificationType, NotificationChannel } from '@prisma/client';

export const SendNotificationSchema = z.object({
  userId: z.string().cuid(),
  type: z.enum([
    'ORDER_CONFIRMED',
    'PAYMENT_CONFIRMED',
    'SHIPMENT_SHIPPED',
    'SHIPMENT_DELIVERED',
    'ORDER_CANCELLED',
    'RETURN_INITIATED',
    'RETURN_APPROVED',
    'ACCOUNT_VERIFICATION',
    'PASSWORD_RESET',
    'VENDOR_APPROVED',
    'VENDOR_SUSPENDED',
    'PRODUCT_REVIEW',
    'PROMOTION',
    'SYSTEM_ALERT',
  ]),
  title: z.string().min(1).max(200),
  message: z.string().min(1).max(5000),
  data: z.record(z.string(), z.any()).optional(),
  channels: z.array(z.enum(['EMAIL', 'SMS', 'IN_APP', 'PUSH'])).optional(),
  priority: z.enum(['low', 'normal', 'high']).optional(),
});

export const NotificationPreferenceSchema = z.object({
  emailNotifications: z.boolean().optional(),
  smsNotifications: z.boolean().optional(),
  inAppNotifications: z.boolean().optional(),
  pushNotifications: z.boolean().optional(),
  orderUpdates: z.boolean().optional(),
  promotions: z.boolean().optional(),
  accountAlerts: z.boolean().optional(),
  vendorUpdates: z.boolean().optional(),
  frequency: z.enum(['immediate', 'daily', 'weekly']).optional(),
});

export const GetNotificationsSchema = z.object({
  limit: z.number().int().positive().max(100).default(20),
  offset: z.number().int().nonnegative().default(0),
  type: z.enum([
    'ORDER_CONFIRMED',
    'PAYMENT_CONFIRMED',
    'SHIPMENT_SHIPPED',
    'SHIPMENT_DELIVERED',
    'ORDER_CANCELLED',
    'RETURN_INITIATED',
    'RETURN_APPROVED',
    'ACCOUNT_VERIFICATION',
    'PASSWORD_RESET',
    'VENDOR_APPROVED',
    'VENDOR_SUSPENDED',
    'PRODUCT_REVIEW',
    'PROMOTION',
    'SYSTEM_ALERT',
  ]).optional(),
  isRead: z.boolean().optional(),
});

export const MarkAsReadSchema = z.object({
  notificationId: z.string().cuid('Invalid notification ID'),
});

export const DeleteNotificationSchema = z.object({
  notificationId: z.string().cuid('Invalid notification ID'),
});

export const BulkNotificationSchema = z.object({
  userIds: z.array(z.string().cuid()).min(1).max(1000),
  type: z.enum([
    'ORDER_CONFIRMED',
    'PAYMENT_CONFIRMED',
    'SHIPMENT_SHIPPED',
    'SHIPMENT_DELIVERED',
    'ORDER_CANCELLED',
    'RETURN_INITIATED',
    'RETURN_APPROVED',
    'ACCOUNT_VERIFICATION',
    'PASSWORD_RESET',
    'VENDOR_APPROVED',
    'VENDOR_SUSPENDED',
    'PRODUCT_REVIEW',
    'PROMOTION',
    'SYSTEM_ALERT',
  ]),
  title: z.string().min(1).max(200),
  message: z.string().min(1).max(5000),
  data: z.record(z.string(), z.any()).optional(),
  channels: z.array(z.enum(['EMAIL', 'SMS', 'IN_APP', 'PUSH'])).optional(),
});

export const EmailNotificationSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1).max(200),
  html: z.string().min(1),
  text: z.string().optional(),
  templateId: z.string().optional(),
  variables: z.record(z.string(), z.any()).optional(),
});

export const SMSNotificationSchema = z.object({
  to: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
  message: z.string().min(1).max(160),
  templateId: z.string().optional(),
  variables: z.record(z.string(), z.any()).optional(),
});

export const InAppNotificationSchema = z.object({
  userId: z.string().cuid(),
  title: z.string().min(1).max(200),
  message: z.string().min(1).max(5000),
  data: z.record(z.string(), z.any()).optional(),
  actionUrl: z.string().url().optional(),
});

// Type exports
export type SendNotificationInput = z.infer<typeof SendNotificationSchema>;
export type NotificationPreferenceInput = z.infer<typeof NotificationPreferenceSchema>;
export type GetNotificationsInput = z.infer<typeof GetNotificationsSchema>;
export type BulkNotificationInput = z.infer<typeof BulkNotificationSchema>;
export type EmailNotificationInput = z.infer<typeof EmailNotificationSchema>;
export type SMSNotificationInput = z.infer<typeof SMSNotificationSchema>;
export type InAppNotificationInput = z.infer<typeof InAppNotificationSchema>;

