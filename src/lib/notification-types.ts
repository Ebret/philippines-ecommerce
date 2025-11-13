/**
 * Notification Types and Interfaces
 * Week 8: Notifications System
 */

import { NotificationType, NotificationChannel, NotificationStatus } from '@prisma/client';

export interface NotificationData {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  channels?: NotificationChannel[];
}

export interface SendNotificationOptions {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  channels?: NotificationChannel[];
  priority?: 'low' | 'normal' | 'high';
}

export interface NotificationPreferenceData {
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  inAppNotifications?: boolean;
  pushNotifications?: boolean;
  orderUpdates?: boolean;
  promotions?: boolean;
  accountAlerts?: boolean;
  vendorUpdates?: boolean;
  frequency?: 'immediate' | 'daily' | 'weekly';
}

export interface EmailNotificationPayload {
  to: string;
  subject: string;
  html: string;
  text?: string;
  templateId?: string;
  variables?: Record<string, any>;
}

export interface SMSNotificationPayload {
  to: string;
  message: string;
  templateId?: string;
  variables?: Record<string, any>;
}

export interface InAppNotificationPayload {
  userId: string;
  title: string;
  message: string;
  data?: Record<string, any>;
  actionUrl?: string;
}

export interface NotificationQueueItem {
  notificationId: string;
  channel: NotificationChannel;
  recipient: string;
  payload: EmailNotificationPayload | SMSNotificationPayload | InAppNotificationPayload;
  retryCount: number;
  maxRetries: number;
}

export interface NotificationTemplate {
  id: string;
  type: NotificationType;
  name: string;
  emailSubject?: string;
  emailTemplate?: string;
  smsTemplate?: string;
  inAppTitle?: string;
  inAppMessage?: string;
  variables: string[];
}

export interface NotificationResponse {
  success: boolean;
  notificationId?: string;
  messageId?: string;
  error?: string;
}

export interface BulkNotificationOptions {
  userIds: string[];
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  channels?: NotificationChannel[];
}

