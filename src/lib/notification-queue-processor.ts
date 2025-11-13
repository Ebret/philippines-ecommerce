/**
 * Notification Queue Processor
 * Week 8: Notifications System
 * Processes queued notifications with retry logic
 */

import { prisma } from '@/lib/prisma';
import { NotificationStatus, NotificationChannel } from '@prisma/client';
import { SMSService } from '@/lib/sms-service';

export class NotificationQueueProcessor {
  private static readonly MAX_RETRIES = 3;
  private static readonly RETRY_DELAY_MS = 5000; // 5 seconds
  private static readonly BATCH_SIZE = 10;

  /**
   * Process pending notifications in queue
   */
  static async processPendingNotifications(): Promise<void> {
    try {
      const pendingNotifications = await prisma.notificationQueue.findMany({
        where: {
          status: NotificationStatus.PENDING,
          OR: [
            { nextRetryAt: null },
            { nextRetryAt: { lte: new Date() } },
          ],
        },
        take: this.BATCH_SIZE,
      });

      for (const notification of pendingNotifications) {
        await this.processNotification(notification);
      }
    } catch (error) {
      console.error('Error processing notification queue:', error);
    }
  }

  /**
   * Process single notification
   */
  private static async processNotification(notification: any): Promise<void> {
    try {
      const success = await this.sendNotificationByChannel(
        notification.channel,
        notification.recipient,
        notification.notificationId
      );

      if (success) {
        await prisma.notificationQueue.update({
          where: { id: notification.id },
          data: {
            status: NotificationStatus.SENT,
            sentAt: new Date(),
          },
        });
      } else {
        await this.handleRetry(notification);
      }
    } catch (error) {
      console.error('Error processing notification:', error);
      await this.handleRetry(notification);
    }
  }

  /**
   * Send notification by channel
   */
  private static async sendNotificationByChannel(
    channel: NotificationChannel,
    recipient: string,
    notificationId: string
  ): Promise<boolean> {
    try {
      switch (channel) {
        case NotificationChannel.EMAIL:
          // Mock email send
          console.log(`Sending email to ${recipient}`);
          return true;
        case NotificationChannel.SMS:
          // Mock SMS send
          console.log(`Sending SMS to ${recipient}`);
          return true;
        case NotificationChannel.IN_APP:
          // In-app notifications are instant
          return true;
        case NotificationChannel.PUSH:
          // Mock push notification
          console.log(`Sending push to ${recipient}`);
          return true;
        default:
          return false;
      }
    } catch (error) {
      console.error(`Error sending ${channel} notification:`, error);
      return false;
    }
  }

  /**
   * Handle retry logic
   */
  private static async handleRetry(notification: any): Promise<void> {
    const nextRetryCount = notification.retryCount + 1;

    if (nextRetryCount >= this.MAX_RETRIES) {
      await prisma.notificationQueue.update({
        where: { id: notification.id },
        data: {
          status: NotificationStatus.FAILED,
          failedAt: new Date(),
          failureReason: 'Max retries exceeded',
        },
      });
    } else {
      const nextRetryAt = new Date(Date.now() + this.RETRY_DELAY_MS * nextRetryCount);
      await prisma.notificationQueue.update({
        where: { id: notification.id },
        data: {
          retryCount: nextRetryCount,
          nextRetryAt,
        },
      });
    }
  }

  /**
   * Get queue statistics
   */
  static async getQueueStats(): Promise<{
    pending: number;
    sent: number;
    failed: number;
    total: number;
  }> {
    const [pending, sent, failed, total] = await Promise.all([
      prisma.notificationQueue.count({ where: { status: NotificationStatus.PENDING } }),
      prisma.notificationQueue.count({ where: { status: NotificationStatus.SENT } }),
      prisma.notificationQueue.count({ where: { status: NotificationStatus.FAILED } }),
      prisma.notificationQueue.count(),
    ]);

    return { pending, sent, failed, total };
  }
}

