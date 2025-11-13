/**
 * Notification Service
 * Handles multi-channel notifications (Email, SMS, In-App)
 * Week 8: Notifications System
 */

import { prisma } from './prisma';
import { NotificationChannel } from '@prisma/client';
import {
  SendNotificationOptions,
  NotificationResponse,
  BulkNotificationOptions,
} from './notification-types';

export class NotificationService {
  /**
   * Send notification to user
   */
  static async sendNotification(
    options: SendNotificationOptions
  ): Promise<NotificationResponse> {
    try {
      // Get user preferences
      const preferences = await prisma.notificationPreference.findUnique({
        where: { userId: options.userId },
      });

      // Determine channels to use
      const channels = options.channels || [NotificationChannel.IN_APP];
      const filteredChannels = channels.filter((channel) => {
        if (channel === NotificationChannel.EMAIL && !preferences?.emailNotifications) return false;
        if (channel === NotificationChannel.SMS && !preferences?.smsNotifications) return false;
        if (channel === NotificationChannel.IN_APP && !preferences?.inAppNotifications) return false;
        if (channel === NotificationChannel.PUSH && !preferences?.pushNotifications) return false;
        return true;
      });

      // Create notification record
      const notification = await prisma.notification.create({
        data: {
          userId: options.userId,
          type: options.type,
          title: options.title,
          message: options.message,
          data: options.data || {},
          channels: filteredChannels,
          status: 'PENDING',
        },
      });

      // Queue notifications for each channel
      for (const channel of filteredChannels) {
        await prisma.notificationQueue.create({
          data: {
            notificationId: notification.id,
            channel,
            recipient: '', // Will be populated by queue processor
            status: 'PENDING',
          },
        });
      }

      return {
        success: true,
        notificationId: notification.id,
      };
    } catch (error) {
      console.error('Error sending notification:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Send bulk notifications
   */
  static async sendBulkNotifications(
    options: BulkNotificationOptions
  ): Promise<NotificationResponse> {
    try {
      const results = await Promise.all(
        options.userIds.map((userId) =>
          this.sendNotification({
            userId,
            type: options.type,
            title: options.title,
            message: options.message,
            data: options.data,
            channels: options.channels,
          })
        )
      );

      const successCount = results.filter((r) => r.success).length;

      return {
        success: successCount === options.userIds.length,
        error: `Sent to ${successCount}/${options.userIds.length} users`,
      };
    } catch (error) {
      console.error('Error sending bulk notifications:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(notificationId: string): Promise<boolean> {
    try {
      await prisma.notification.update({
        where: { id: notificationId },
        data: {
          isRead: true,
          readAt: new Date(),
          status: 'READ',
        },
      });
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }

  /**
   * Get user notifications
   */
  static async getUserNotifications(userId: string, limit = 20, offset = 0) {
    try {
      const notifications = await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      });

      const total = await prisma.notification.count({ where: { userId } });

      return {
        notifications,
        total,
        limit,
        offset,
      };
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return { notifications: [], total: 0, limit, offset };
    }
  }

  /**
   * Get unread count
   */
  static async getUnreadCount(userId: string): Promise<number> {
    try {
      return await prisma.notification.count({
        where: {
          userId,
          isRead: false,
        },
      });
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }

  /**
   * Delete notification
   */
  static async deleteNotification(notificationId: string): Promise<boolean> {
    try {
      await prisma.notification.delete({
        where: { id: notificationId },
      });
      return true;
    } catch (error) {
      console.error('Error deleting notification:', error);
      return false;
    }
  }
}

export const notificationService = new NotificationService();

