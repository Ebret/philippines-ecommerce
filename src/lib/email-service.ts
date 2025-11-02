/**
 * Email Service - Handles email sending, queuing, and tracking
 * Supports multiple providers: SendGrid, Mailgun, AWS SES
 */

import { EMAIL_CONFIG, EmailSendOptions, EmailTemplateVariables, EmailQueueItem } from './email-config';
import { prisma } from './prisma';
import nodemailer from 'nodemailer';

class EmailService {
  private transporter: any;
  private provider: string;

  constructor() {
    this.provider = EMAIL_CONFIG.provider;
    this.initializeTransporter();
  }

  /**
   * Initialize email transporter based on configured provider
   */
  private initializeTransporter() {
    if (this.provider === 'sendgrid') {
      this.transporter = nodemailer.createTransport({
        host: EMAIL_CONFIG.smtp.host,
        port: EMAIL_CONFIG.smtp.port,
        secure: EMAIL_CONFIG.smtp.secure,
        auth: {
          user: EMAIL_CONFIG.smtp.auth.user,
          pass: EMAIL_CONFIG.smtp.auth.pass,
        },
      });
    } else if (this.provider === 'mailgun') {
      this.transporter = nodemailer.createTransport({
        host: 'smtp.mailgun.org',
        port: 587,
        secure: false,
        auth: {
          user: `postmaster@${EMAIL_CONFIG.mailgun.domain}`,
          pass: EMAIL_CONFIG.mailgun.apiKey,
        },
      });
    } else if (this.provider === 'ses') {
      // AWS SES configuration would go here
      this.transporter = nodemailer.createTransport({
        host: EMAIL_CONFIG.smtp.host,
        port: EMAIL_CONFIG.smtp.port,
        secure: EMAIL_CONFIG.smtp.secure,
        auth: {
          user: EMAIL_CONFIG.smtp.auth.user,
          pass: EMAIL_CONFIG.smtp.auth.pass,
        },
      });
    }
  }

  /**
   * Send email directly
   */
  async sendEmail(options: EmailSendOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      if (EMAIL_CONFIG.development.captureEmails) {
        options.to = EMAIL_CONFIG.development.captureEmailAddress;
      }

      const mailOptions = {
        from: options.from || `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.fromEmail}>`,
        to: Array.isArray(options.to) ? options.to.join(',') : options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        replyTo: options.replyTo || EMAIL_CONFIG.supportEmail,
        cc: options.cc?.join(','),
        bcc: options.bcc?.join(','),
        attachments: options.attachments,
        headers: {
          ...options.headers,
          'X-Mailer': 'Extreme Life Herbal',
          'X-Priority': '3',
        },
      };

      const info = await this.transporter.sendMail(mailOptions);

      if (EMAIL_CONFIG.development.logEmails) {
        console.log(`Email sent: ${info.messageId}`);
      }

      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error) {
      console.error('Email send error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Queue email for later sending
   */
  async queueEmail(item: EmailQueueItem): Promise<{ success: boolean; queueId?: string; error?: string }> {
    try {
      const queueItem = await prisma.emailQueue.create({
        data: {
          userId: item.userId,
          email: item.email,
          type: item.type,
          templateId: item.templateId,
          variables: item.variables,
          priority: item.priority || 0,
          maxRetries: item.maxRetries || EMAIL_CONFIG.queue.maxRetries,
          status: 'PENDING',
        },
      });

      return {
        success: true,
        queueId: queueItem.id,
      };
    } catch (error) {
      console.error('Email queue error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Log email activity
   */
  async logEmail(
    email: string,
    type: string,
    subject: string,
    status: string,
    userId?: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    try {
      await prisma.emailLog.create({
        data: {
          userId,
          email,
          type,
          subject,
          status: status as any,
          metadata,
        },
      });
    } catch (error) {
      console.error('Email log error:', error);
    }
  }

  /**
   * Get email preferences for user
   */
  async getEmailPreferences(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { profile: { include: { emailPreferences: true } } },
      });

      return user?.profile?.emailPreferences || null;
    } catch (error) {
      console.error('Get email preferences error:', error);
      return null;
    }
  }

  /**
   * Update email preferences
   */
  async updateEmailPreferences(userId: string, preferences: Record<string, boolean>) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true },
      });

      if (!user?.profile) {
        return { success: false, error: 'User profile not found' };
      }

      const updated = await prisma.emailPreferences.upsert({
        where: { userProfileId: user.profile.id },
        update: preferences,
        create: {
          userProfileId: user.profile.id,
          ...preferences,
        },
      });

      return { success: true, data: updated };
    } catch (error) {
      console.error('Update email preferences error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Unsubscribe user from emails
   */
  async unsubscribeUser(unsubscribeToken: string) {
    try {
      const preferences = await prisma.emailPreferences.findUnique({
        where: { unsubscribeToken },
      });

      if (!preferences) {
        return { success: false, error: 'Invalid unsubscribe token' };
      }

      await prisma.emailPreferences.update({
        where: { id: preferences.id },
        data: {
          marketingEmails: false,
          promotionalEmails: false,
          abandonedCartEmails: false,
          productRecommendations: false,
          weeklyNewsletter: false,
        },
      });

      return { success: true };
    } catch (error) {
      console.error('Unsubscribe error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Get email logs for user
   */
  async getEmailLogs(userId: string, limit: number = 50) {
    try {
      return await prisma.emailLog.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });
    } catch (error) {
      console.error('Get email logs error:', error);
      return [];
    }
  }

  /**
   * Get email statistics
   */
  async getEmailStats(userId?: string) {
    try {
      const where = userId ? { userId } : {};

      const [total, sent, opened, clicked, bounced, failed] = await Promise.all([
        prisma.emailLog.count({ where }),
        prisma.emailLog.count({ where: { ...where, status: 'SENT' } }),
        prisma.emailLog.count({ where: { ...where, status: 'OPENED' } }),
        prisma.emailLog.count({ where: { ...where, status: 'CLICKED' } }),
        prisma.emailLog.count({ where: { ...where, status: 'BOUNCED' } }),
        prisma.emailLog.count({ where: { ...where, status: 'FAILED' } }),
      ]);

      return {
        total,
        sent,
        opened,
        clicked,
        bounced,
        failed,
        openRate: total > 0 ? (opened / total) * 100 : 0,
        clickRate: total > 0 ? (clicked / total) * 100 : 0,
        bounceRate: total > 0 ? (bounced / total) * 100 : 0,
        failureRate: total > 0 ? (failed / total) * 100 : 0,
      };
    } catch (error) {
      console.error('Get email stats error:', error);
      return null;
    }
  }
}

export const emailService = new EmailService();

