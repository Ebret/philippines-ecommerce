/**
 * Email Automation Triggers
 * Handles event-based email automation
 */

import { emailService } from './email-service';
import { prisma } from './prisma';

export class EmailAutomationTriggers {
  /**
   * Trigger: User registered
   */
  static async onUserRegistered(userId: string, email: string, firstName: string) {
    try {
      // Send verification email
      await emailService.queueEmail({
        userId,
        email,
        type: 'ACCOUNT_VERIFICATION',
        templateId: 'accountVerification',
        variables: {
          firstName,
          verificationUrl: `${process.env.NEXT_PUBLIC_APP_URL}/verify?token=abc123`,
        },
        priority: 10,
      });

      // Send welcome email after verification
      setTimeout(async () => {
        await emailService.queueEmail({
          userId,
          email,
          type: 'WELCOME',
          templateId: 'welcome',
          variables: {
            firstName,
            shopUrl: `${process.env.NEXT_PUBLIC_APP_URL}/shop`,
            accountUrl: `${process.env.NEXT_PUBLIC_APP_URL}/account`,
          },
          priority: 8,
        });
      }, 3600000); // 1 hour delay
    } catch (error) {
      console.error('Error in onUserRegistered trigger:', error);
    }
  }

  /**
   * Trigger: Email verified
   */
  static async onEmailVerified(userId: string, email: string, firstName: string) {
    try {
      await emailService.queueEmail({
        userId,
        email,
        type: 'WELCOME',
        templateId: 'welcome',
        variables: {
          firstName,
          shopUrl: `${process.env.NEXT_PUBLIC_APP_URL}/shop`,
          accountUrl: `${process.env.NEXT_PUBLIC_APP_URL}/account`,
        },
        priority: 9,
      });
    } catch (error) {
      console.error('Error in onEmailVerified trigger:', error);
    }
  }

  /**
   * Trigger: Order placed
   */
  static async onOrderPlaced(
    userId: string,
    email: string,
    firstName: string,
    orderNumber: string,
    orderDate: string,
    subtotal: number,
    shippingFee: number,
    totalAmount: number
  ) {
    try {
      // Send order confirmation
      await emailService.queueEmail({
        userId,
        email,
        type: 'ORDER_CONFIRMATION',
        templateId: 'orderConfirmation',
        variables: {
          firstName,
          orderNumber,
          orderDate,
          subtotal: subtotal.toFixed(2),
          shippingFee: shippingFee.toFixed(2),
          totalAmount: totalAmount.toFixed(2),
          trackingUrl: `${process.env.NEXT_PUBLIC_APP_URL}/orders/${orderNumber}/track`,
        },
        priority: 10,
      });

      // Send to vendor
      const order = await prisma.order.findUnique({
        where: { id: orderNumber },
        include: { vendor: true },
      });

      if (order?.vendor?.email) {
        await emailService.queueEmail({
          email: order.vendor.email,
          type: 'VENDOR_NEW_ORDER',
          templateId: 'vendor-new-order',
          variables: {
            vendorName: order.vendor.name,
            orderNumber,
            customerName: firstName,
            totalAmount: totalAmount.toFixed(2),
          },
          priority: 9,
        });
      }
    } catch (error) {
      console.error('Error in onOrderPlaced trigger:', error);
    }
  }

  /**
   * Trigger: Order shipped
   */
  static async onOrderShipped(
    userId: string,
    email: string,
    firstName: string,
    orderNumber: string,
    trackingNumber: string,
    carrier: string
  ) {
    try {
      await emailService.queueEmail({
        userId,
        email,
        type: 'SHIPPING_UPDATE',
        templateId: 'shipping-update',
        variables: {
          firstName,
          orderNumber,
          trackingNumber,
          carrier,
          trackingUrl: `${process.env.NEXT_PUBLIC_APP_URL}/orders/${orderNumber}/track`,
        },
        priority: 8,
      });
    } catch (error) {
      console.error('Error in onOrderShipped trigger:', error);
    }
  }

  /**
   * Trigger: Order delivered
   */
  static async onOrderDelivered(
    userId: string,
    email: string,
    firstName: string,
    orderNumber: string
  ) {
    try {
      await emailService.queueEmail({
        userId,
        email,
        type: 'DELIVERY_CONFIRMATION',
        templateId: 'delivery-confirmation',
        variables: {
          firstName,
          orderNumber,
          reviewUrl: `${process.env.NEXT_PUBLIC_APP_URL}/orders/${orderNumber}/review`,
        },
        priority: 7,
      });
    } catch (error) {
      console.error('Error in onOrderDelivered trigger:', error);
    }
  }

  /**
   * Trigger: Cart abandoned
   */
  static async onCartAbandoned(
    userId: string,
    email: string,
    firstName: string,
    itemCount: number,
    cartTotal: number,
    discountCode: string,
    discountPercent: number
  ) {
    try {
      // Send after 1 hour
      setTimeout(async () => {
        const prefs = await emailService.getEmailPreferences(userId);
        if (prefs?.abandonedCartEmails !== false) {
          await emailService.queueEmail({
            userId,
            email,
            type: 'ABANDONED_CART',
            templateId: 'abandonedCart',
            variables: {
              firstName,
              itemCount: itemCount.toString(),
              cartTotal: cartTotal.toFixed(2),
              discountCode,
              discountPercent: discountPercent.toString(),
              cartUrl: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
            },
            priority: 6,
          });
        }
      }, 3600000); // 1 hour delay
    } catch (error) {
      console.error('Error in onCartAbandoned trigger:', error);
    }
  }

  /**
   * Trigger: Product viewed
   */
  static async onProductViewed(
    userId: string,
    email: string,
    firstName: string,
    productId: string,
    productName: string
  ) {
    try {
      // Send product recommendation after 24 hours
      setTimeout(async () => {
        const prefs = await emailService.getEmailPreferences(userId);
        if (prefs?.productRecommendations !== false) {
          await emailService.queueEmail({
            userId,
            email,
            type: 'PRODUCT_RECOMMENDATION',
            templateId: 'product-recommendation',
            variables: {
              firstName,
              productName,
              productUrl: `${process.env.NEXT_PUBLIC_APP_URL}/products/${productId}`,
            },
            priority: 5,
          });
        }
      }, 86400000); // 24 hours delay
    } catch (error) {
      console.error('Error in onProductViewed trigger:', error);
    }
  }

  /**
   * Trigger: Password reset requested
   */
  static async onPasswordResetRequested(
    email: string,
    firstName: string,
    resetToken: string
  ) {
    try {
      await emailService.queueEmail({
        email,
        type: 'PASSWORD_RESET',
        templateId: 'passwordReset',
        variables: {
          firstName,
          resetUrl: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`,
        },
        priority: 10,
      });
    } catch (error) {
      console.error('Error in onPasswordResetRequested trigger:', error);
    }
  }

  /**
   * Trigger: Payment confirmed
   */
  static async onPaymentConfirmed(
    userId: string,
    email: string,
    firstName: string,
    orderNumber: string,
    amount: number,
    paymentMethod: string
  ) {
    try {
      await emailService.queueEmail({
        userId,
        email,
        type: 'PAYMENT_CONFIRMATION',
        templateId: 'payment-confirmation',
        variables: {
          firstName,
          orderNumber,
          amount: amount.toFixed(2),
          paymentMethod,
        },
        priority: 9,
      });
    } catch (error) {
      console.error('Error in onPaymentConfirmed trigger:', error);
    }
  }

  /**
   * Trigger: Vendor inventory low
   */
  static async onVendorInventoryLow(
    vendorId: string,
    vendorEmail: string,
    vendorName: string,
    productName: string,
    currentStock: number,
    threshold: number
  ) {
    try {
      await emailService.queueEmail({
        email: vendorEmail,
        type: 'VENDOR_INVENTORY_ALERT',
        templateId: 'vendor-inventory-alert',
        variables: {
          vendorName,
          productName,
          currentStock: currentStock.toString(),
          threshold: threshold.toString(),
          dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/vendor/dashboard`,
        },
        priority: 8,
      });
    } catch (error) {
      console.error('Error in onVendorInventoryLow trigger:', error);
    }
  }

  /**
   * Trigger: Vendor commission statement
   */
  static async onVendorCommissionStatement(
    vendorId: string,
    vendorEmail: string,
    vendorName: string,
    period: string,
    totalSales: number,
    commission: number
  ) {
    try {
      await emailService.queueEmail({
        email: vendorEmail,
        type: 'VENDOR_COMMISSION_STATEMENT',
        templateId: 'vendor-commission-statement',
        variables: {
          vendorName,
          period,
          totalSales: totalSales.toFixed(2),
          commission: commission.toFixed(2),
          statementUrl: `${process.env.NEXT_PUBLIC_APP_URL}/vendor/statements`,
        },
        priority: 7,
      });
    } catch (error) {
      console.error('Error in onVendorCommissionStatement trigger:', error);
    }
  }

  /**
   * Trigger: Security alert
   */
  static async onSecurityAlert(
    userId: string,
    email: string,
    firstName: string,
    alertType: string,
    details: string
  ) {
    try {
      await emailService.queueEmail({
        userId,
        email,
        type: 'SECURITY_ALERT',
        templateId: 'security-alert',
        variables: {
          firstName,
          alertType,
          details,
          accountUrl: `${process.env.NEXT_PUBLIC_APP_URL}/account/security`,
        },
        priority: 10,
      });
    } catch (error) {
      console.error('Error in onSecurityAlert trigger:', error);
    }
  }

  /**
   * Trigger: Newsletter subscription
   */
  static async onNewsletterSubscription(
    userId: string,
    email: string,
    firstName: string
  ) {
    try {
      await emailService.queueEmail({
        userId,
        email,
        type: 'NEWSLETTER',
        templateId: 'newsletter',
        variables: {
          firstName,
          unsubscribeUrl: `${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?token=abc123`,
        },
        priority: 5,
      });
    } catch (error) {
      console.error('Error in onNewsletterSubscription trigger:', error);
    }
  }
}

