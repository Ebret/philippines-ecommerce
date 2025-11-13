/**
 * SMS Templates for Philippines Market
 * Week 8: Notifications System
 */

export const SMS_TEMPLATES = {
  ORDER_CONFIRMED: {
    template: 'Order #{orderId} confirmed! Total: ₱{amount}. Track at {trackingUrl}',
    variables: ['orderId', 'amount', 'trackingUrl'],
  },
  PAYMENT_CONFIRMED: {
    template: 'Payment of ₱{amount} received for Order #{orderId}. Thank you!',
    variables: ['amount', 'orderId'],
  },
  SHIPMENT_SHIPPED: {
    template: 'Order #{orderId} shipped via {carrier}. Tracking: {trackingNumber}',
    variables: ['orderId', 'carrier', 'trackingNumber'],
  },
  SHIPMENT_DELIVERED: {
    template: 'Order #{orderId} delivered! Thank you for shopping with us.',
    variables: ['orderId'],
  },
  ORDER_CANCELLED: {
    template: 'Order #{orderId} has been cancelled. Refund of ₱{amount} will be processed.',
    variables: ['orderId', 'amount'],
  },
  RETURN_INITIATED: {
    template: 'Return for Order #{orderId} initiated. Please wait for pickup instructions.',
    variables: ['orderId'],
  },
  RETURN_APPROVED: {
    template: 'Return for Order #{orderId} approved. Refund of ₱{amount} will be processed.',
    variables: ['orderId', 'amount'],
  },
  ACCOUNT_VERIFICATION: {
    template: 'Your verification code is: {code}. Valid for 10 minutes.',
    variables: ['code'],
  },
  PASSWORD_RESET: {
    template: 'Password reset code: {code}. Do not share this code with anyone.',
    variables: ['code'],
  },
  VENDOR_APPROVED: {
    template: 'Congratulations! Your vendor account has been approved.',
    variables: [],
  },
  VENDOR_SUSPENDED: {
    template: 'Your vendor account has been suspended. Contact support for details.',
    variables: [],
  },
  PRODUCT_REVIEW: {
    template: 'Thank you for reviewing {productName}! Your feedback helps us improve.',
    variables: ['productName'],
  },
  PROMOTION: {
    template: 'Special offer! Get {discount}% off on {productName}. Use code: {code}',
    variables: ['discount', 'productName', 'code'],
  },
  SYSTEM_ALERT: {
    template: 'Alert: {message}',
    variables: ['message'],
  },
};

export function renderSMSTemplate(
  templateKey: keyof typeof SMS_TEMPLATES,
  variables: Record<string, string | number>
): string {
  const template = SMS_TEMPLATES[templateKey];
  if (!template) {
    return '';
  }

  let message = template.template;
  for (const [key, value] of Object.entries(variables)) {
    message = message.replace(`{${key}}`, String(value));
  }

  return message;
}

export function validateSMSLength(message: string): boolean {
  // SMS standard is 160 characters for single message
  // Multi-part SMS: 153 characters per part
  return message.length <= 160;
}

export function getSMSPartCount(message: string): number {
  if (message.length <= 160) return 1;
  return Math.ceil(message.length / 153);
}

