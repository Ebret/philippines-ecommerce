/**
 * Email Queue Processor
 * Processes queued emails and sends them
 */

import { prisma } from './prisma';
import { emailService } from './email-service';
import { renderEmailTemplate } from './email-templates';
import { EMAIL_CONFIG } from './email-config';

class EmailQueueProcessor {
  private isProcessing = false;
  private processingInterval: NodeJS.Timeout | null = null;

  /**
   * Start processing email queue
   */
  startProcessing() {
    if (this.isProcessing) {
      console.log('Email queue processor already running');
      return;
    }

    this.isProcessing = true;
    console.log('Starting email queue processor');

    this.processingInterval = setInterval(() => {
      this.processQueue();
    }, EMAIL_CONFIG.queue.processingIntervalMs);

    // Process immediately on start
    this.processQueue();
  }

  /**
   * Stop processing email queue
   */
  stopProcessing() {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }
    this.isProcessing = false;
    console.log('Stopped email queue processor');
  }

  /**
   * Process pending emails in queue
   */
  private async processQueue() {
    try {
      // Get pending emails, ordered by priority
      const pendingEmails = await prisma.emailQueue.findMany({
        where: { status: 'PENDING' },
        orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }],
        take: EMAIL_CONFIG.queue.batchSize,
      });

      if (pendingEmails.length === 0) {
        return;
      }

      console.log(`Processing ${pendingEmails.length} queued emails`);

      for (const queueItem of pendingEmails) {
        await this.processQueueItem(queueItem);
      }
    } catch (error) {
      console.error('Error processing email queue:', error);
    }
  }

  /**
   * Process individual queue item
   */
  private async processQueueItem(queueItem: any) {
    try {
      // Update status to processing
      await prisma.emailQueue.update({
        where: { id: queueItem.id },
        data: { status: 'PROCESSING' },
      });

      // Render email template
      const template = renderEmailTemplate(queueItem.templateId, queueItem.variables);

      if (!template) {
        throw new Error(`Template not found: ${queueItem.templateId}`);
      }

      // Send email
      const result = await emailService.sendEmail({
        to: queueItem.email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });

      if (result.success) {
        // Update queue item to sent
        await prisma.emailQueue.update({
          where: { id: queueItem.id },
          data: {
            status: 'SENT',
            sentAt: new Date(),
          },
        });

        // Log email
        await emailService.logEmail(
          queueItem.email,
          queueItem.type,
          template.subject,
          'SENT',
          queueItem.userId,
          { queueId: queueItem.id, messageId: result.messageId }
        );

        console.log(`Email sent: ${queueItem.email} (${queueItem.type})`);
      } else {
        // Handle send failure
        await this.handleSendFailure(queueItem, result.error || 'Unknown error');
      }
    } catch (error) {
      console.error(`Error processing queue item ${queueItem.id}:`, error);
      await this.handleSendFailure(queueItem, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  /**
   * Handle send failure with retry logic
   */
  private async handleSendFailure(queueItem: any, error: string) {
    const retryCount = (queueItem.retryCount || 0) + 1;
    const maxRetries = queueItem.maxRetries || EMAIL_CONFIG.queue.maxRetries;

    if (retryCount < maxRetries) {
      // Schedule retry
      const retryDelay = EMAIL_CONFIG.queue.retryDelayMs * retryCount;
      const nextRetryAt = new Date(Date.now() + retryDelay);

      await prisma.emailQueue.update({
        where: { id: queueItem.id },
        data: {
          status: 'RETRY',
          retryCount,
          nextRetryAt,
        },
      });

      console.log(`Email retry scheduled for ${queueItem.email} (attempt ${retryCount}/${maxRetries})`);
    } else {
      // Max retries exceeded
      await prisma.emailQueue.update({
        where: { id: queueItem.id },
        data: {
          status: 'FAILED',
          error: error,
        },
      });

      // Log failure
      await emailService.logEmail(
        queueItem.email,
        queueItem.type,
        `Failed: ${queueItem.type}`,
        'FAILED',
        queueItem.userId,
        { queueId: queueItem.id, error, retryCount }
      );

      console.error(`Email failed after ${retryCount} attempts: ${queueItem.email}`);
    }
  }

  /**
   * Retry failed emails
   */
  async retryFailedEmails() {
    try {
      const failedEmails = await prisma.emailQueue.findMany({
        where: { status: 'FAILED' },
      });

      console.log(`Retrying ${failedEmails.length} failed emails`);

      for (const email of failedEmails) {
        await prisma.emailQueue.update({
          where: { id: email.id },
          data: {
            status: 'PENDING',
            retryCount: 0,
          },
        });
      }
    } catch (error) {
      console.error('Error retrying failed emails:', error);
    }
  }

  /**
   * Get queue statistics
   */
  async getQueueStats() {
    try {
      const [pending, processing, sent, failed, retry] = await Promise.all([
        prisma.emailQueue.count({ where: { status: 'PENDING' } }),
        prisma.emailQueue.count({ where: { status: 'PROCESSING' } }),
        prisma.emailQueue.count({ where: { status: 'SENT' } }),
        prisma.emailQueue.count({ where: { status: 'FAILED' } }),
        prisma.emailQueue.count({ where: { status: 'RETRY' } }),
      ]);

      return {
        pending,
        processing,
        sent,
        failed,
        retry,
        total: pending + processing + sent + failed + retry,
      };
    } catch (error) {
      console.error('Error getting queue stats:', error);
      return null;
    }
  }

  /**
   * Clear old queue items
   */
  async clearOldItems(daysOld: number = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const result = await prisma.emailQueue.deleteMany({
        where: {
          status: 'SENT',
          sentAt: { lt: cutoffDate },
        },
      });

      console.log(`Cleared ${result.count} old email queue items`);
      return result.count;
    } catch (error) {
      console.error('Error clearing old queue items:', error);
      return 0;
    }
  }

  /**
   * Get queue items by status
   */
  async getQueueItems(status: string, limit: number = 50) {
    try {
      return await prisma.emailQueue.findMany({
        where: { status: status as any },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });
    } catch (error) {
      console.error('Error getting queue items:', error);
      return [];
    }
  }

  /**
   * Pause queue processing
   */
  pauseProcessing() {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }
    console.log('Email queue processor paused');
  }

  /**
   * Resume queue processing
   */
  resumeProcessing() {
    if (!this.processingInterval) {
      this.processingInterval = setInterval(() => {
        this.processQueue();
      }, EMAIL_CONFIG.queue.processingIntervalMs);
    }
    console.log('Email queue processor resumed');
  }
}

export const emailQueueProcessor = new EmailQueueProcessor();

