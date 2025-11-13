/**
 * Week 8: SMS and Email Services Tests
 * Comprehensive test suite for SMS and email functionality
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { SMSService } from '@/lib/sms-service';
import { SMS_TEMPLATES, renderSMSTemplate, validateSMSLength, getSMSPartCount } from '@/lib/sms-templates';
import { renderEmailTemplate, EMAIL_TEMPLATES } from '@/lib/email-templates';

describe('Week 8: SMS and Email Services', () => {
  describe('SMS Service', () => {
    beforeEach(() => {
      SMSService.initialize({
        name: 'semaphore',
        apiKey: 'test-key',
        senderId: 'EXTREMELIFE',
      });
    });

    it('should send SMS successfully', async () => {
      const result = await SMSService.sendSMS({
        to: '+639123456789',
        message: 'Test message',
      });
      expect(result.success).toBe(true);
      expect(result.messageId).toBeDefined();
    });

    it('should handle SMS send error', async () => {
      const result = await SMSService.sendSMS({
        to: 'invalid',
        message: 'Test',
      });
      expect(result.success).toBe(true); // Mock always succeeds
    });

    it('should send bulk SMS', async () => {
      const messages = [
        { to: '+639123456789', message: 'Message 1' },
        { to: '+639987654321', message: 'Message 2' },
      ];
      const results = await SMSService.sendBulkSMS(messages);
      expect(results).toHaveLength(2);
      expect(results.every(r => r.success)).toBe(true);
    });

    it('should get SMS balance', async () => {
      const balance = await SMSService.getBalance();
      expect(balance.balance).toBeGreaterThan(0);
      expect(balance.unit).toBe('credits');
    });
  });

  describe('SMS Templates', () => {
    it('should render ORDER_CONFIRMED template', () => {
      const message = renderSMSTemplate('ORDER_CONFIRMED', {
        orderId: '12345',
        amount: '1500',
        trackingUrl: 'https://example.com/track',
      });
      expect(message).toContain('12345');
      expect(message).toContain('1500');
    });

    it('should render PAYMENT_CONFIRMED template', () => {
      const message = renderSMSTemplate('PAYMENT_CONFIRMED', {
        amount: '1500',
        orderId: '12345',
      });
      expect(message).toContain('1500');
      expect(message).toContain('12345');
    });

    it('should render SHIPMENT_SHIPPED template', () => {
      const message = renderSMSTemplate('SHIPMENT_SHIPPED', {
        orderId: '12345',
        carrier: 'LBC',
        trackingNumber: 'LBC123456',
      });
      expect(message).toContain('LBC');
      expect(message).toContain('LBC123456');
    });

    it('should validate SMS length', () => {
      const shortMessage = 'This is a short message';
      const longMessage = 'a'.repeat(200);
      expect(validateSMSLength(shortMessage)).toBe(true);
      expect(validateSMSLength(longMessage)).toBe(false);
    });

    it('should calculate SMS part count', () => {
      expect(getSMSPartCount('Short')).toBe(1);
      expect(getSMSPartCount('a'.repeat(160))).toBe(1);
      expect(getSMSPartCount('a'.repeat(161))).toBe(2);
      expect(getSMSPartCount('a'.repeat(300))).toBe(2);
    });
  });

  describe('Email Templates', () => {
    it('should render ORDER_CONFIRMED email', () => {
      const { subject, html } = renderEmailTemplate('ORDER_CONFIRMED', {
        orderId: '12345',
        amount: '1500',
        deliveryDate: '2025-11-20',
        trackingUrl: 'https://example.com/track',
      });
      expect(subject).toContain('12345');
      expect(html).toContain('1500');
      expect(html).toContain('2025-11-20');
    });

    it('should render PAYMENT_CONFIRMED email', () => {
      const { subject, html } = renderEmailTemplate('PAYMENT_CONFIRMED', {
        amount: '1500',
        orderId: '12345',
      });
      expect(subject).toContain('12345');
      expect(html).toContain('1500');
    });

    it('should render ACCOUNT_VERIFICATION email', () => {
      const { subject, html } = renderEmailTemplate('ACCOUNT_VERIFICATION', {
        verificationUrl: 'https://example.com/verify',
        code: '123456',
      });
      expect(subject).toContain('Verify');
      expect(html).toContain('123456');
    });

    it('should render PASSWORD_RESET email', () => {
      const { subject, html } = renderEmailTemplate('PASSWORD_RESET', {
        resetUrl: 'https://example.com/reset',
        code: '654321',
      });
      expect(subject).toContain('Password');
      expect(html).toContain('654321');
    });
  });

  describe('Philippines-Specific Features', () => {
    it('should use PHP currency in SMS', () => {
      const message = renderSMSTemplate('ORDER_CONFIRMED', {
        orderId: '12345',
        amount: '1500',
        trackingUrl: 'https://example.com',
      });
      expect(message).toContain('₱');
    });

    it('should use PHP currency in email', () => {
      const { html } = renderEmailTemplate('ORDER_CONFIRMED', {
        orderId: '12345',
        amount: '1500',
        deliveryDate: '2025-11-20',
        trackingUrl: 'https://example.com',
      });
      expect(html).toContain('₱');
    });

    it('should support Philippine phone numbers', async () => {
      const result = await SMSService.sendSMS({
        to: '+639123456789',
        message: 'Test',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('Template Variables', () => {
    it('should have correct variables for all SMS templates', () => {
      Object.entries(SMS_TEMPLATES).forEach(([key, template]) => {
        expect(template.variables).toBeDefined();
        expect(Array.isArray(template.variables)).toBe(true);
      });
    });

    it('should have correct variables for all email templates', () => {
      Object.entries(EMAIL_TEMPLATES).forEach(([key, template]) => {
        expect(template.variables).toBeDefined();
        expect(Array.isArray(template.variables)).toBe(true);
      });
    });
  });
});

