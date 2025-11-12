/**
 * Email Templates
 * Renders email templates with variable substitution
 */

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

interface TemplateVariables {
  [key: string]: string | number | boolean | undefined;
}

/**
 * Render email template with variables
 */
export function renderEmailTemplate(
  templateId: string,
  variables: TemplateVariables = {}
): EmailTemplate | null {
  const templates: { [key: string]: (vars: TemplateVariables) => EmailTemplate } = {
    accountVerification: (vars) => ({
      subject: 'Verify Your Email Address',
      html: `
        <h1>Welcome to Philippines E-Commerce!</h1>
        <p>Hi ${vars.firstName || 'there'},</p>
        <p>Please verify your email address by clicking the link below:</p>
        <a href="${vars.verificationUrl}">Verify Email</a>
        <p>If you didn't create this account, please ignore this email.</p>
      `,
      text: `Welcome to Philippines E-Commerce!\n\nHi ${vars.firstName || 'there'},\n\nPlease verify your email by visiting: ${vars.verificationUrl}\n\nIf you didn't create this account, please ignore this email.`,
    }),
    passwordReset: (vars) => ({
      subject: 'Reset Your Password',
      html: `
        <h1>Password Reset Request</h1>
        <p>Hi ${vars.firstName || 'there'},</p>
        <p>Click the link below to reset your password:</p>
        <a href="${vars.resetUrl}">Reset Password</a>
        <p>This link expires in 24 hours.</p>
      `,
      text: `Password Reset Request\n\nHi ${vars.firstName || 'there'},\n\nReset your password: ${vars.resetUrl}\n\nThis link expires in 24 hours.`,
    }),
    welcome: (vars) => ({
      subject: 'Welcome to Philippines E-Commerce',
      html: `
        <h1>Welcome!</h1>
        <p>Hi ${vars.firstName || 'there'},</p>
        <p>Thank you for joining Philippines E-Commerce. We're excited to have you!</p>
        <p><a href="${vars.shopUrl}">Start Shopping</a></p>
        <p><a href="${vars.accountUrl}">View Your Account</a></p>
      `,
      text: `Welcome!\n\nHi ${vars.firstName || 'there'},\n\nThank you for joining Philippines E-Commerce.\n\nStart Shopping: ${vars.shopUrl}\nView Your Account: ${vars.accountUrl}`,
    }),
    orderConfirmation: (vars) => ({
      subject: `Order Confirmation - ${vars.orderNumber}`,
      html: `
        <h1>Order Confirmed!</h1>
        <p>Hi ${vars.firstName || 'there'},</p>
        <p>Thank you for your order!</p>
        <p><strong>Order Number:</strong> ${vars.orderNumber}</p>
        <p><strong>Order Date:</strong> ${vars.orderDate}</p>
        <p><strong>Total Amount:</strong> ₱${vars.totalAmount}</p>
        <p><a href="${vars.trackingUrl}">Track Your Order</a></p>
      `,
      text: `Order Confirmed!\n\nHi ${vars.firstName || 'there'},\n\nOrder Number: ${vars.orderNumber}\nOrder Date: ${vars.orderDate}\nTotal Amount: ₱${vars.totalAmount}\n\nTrack Your Order: ${vars.trackingUrl}`,
    }),
    abandonedCart: (vars) => ({
      subject: 'Your Cart is Waiting!',
      html: `
        <h1>Don't Forget Your Items!</h1>
        <p>Hi ${vars.firstName || 'there'},</p>
        <p>You have ${vars.itemCount} items in your cart worth ₱${vars.cartTotal}</p>
        <p>Use code <strong>${vars.discountCode}</strong> for ${vars.discountPercent}% off!</p>
        <p><a href="${vars.cartUrl}">Complete Your Purchase</a></p>
      `,
      text: `Don't Forget Your Items!\n\nHi ${vars.firstName || 'there'},\n\nYou have ${vars.itemCount} items in your cart worth ₱${vars.cartTotal}\n\nUse code ${vars.discountCode} for ${vars.discountPercent}% off!\n\nComplete Your Purchase: ${vars.cartUrl}`,
    }),
    vendorNewOrder: (vars) => ({
      subject: `New Order - ${vars.orderNumber}`,
      html: `
        <h1>New Order Received!</h1>
        <p>Hi ${vars.vendorName},</p>
        <p>You have received a new order from ${vars.customerName}</p>
        <p><strong>Order Number:</strong> ${vars.orderNumber}</p>
        <p><strong>Total Amount:</strong> ₱${vars.totalAmount}</p>
        <p>Please prepare the items for shipment.</p>
      `,
      text: `New Order Received!\n\nHi ${vars.vendorName},\n\nYou have received a new order from ${vars.customerName}\n\nOrder Number: ${vars.orderNumber}\nTotal Amount: ₱${vars.totalAmount}\n\nPlease prepare the items for shipment.`,
    }),
    shippingUpdate: (vars) => ({
      subject: `Your Order is On Its Way - ${vars.orderNumber}`,
      html: `
        <h1>Your Order is Shipping!</h1>
        <p>Hi ${vars.firstName || 'there'},</p>
        <p>Your order has been shipped!</p>
        <p><strong>Order Number:</strong> ${vars.orderNumber}</p>
        <p><strong>Tracking Number:</strong> ${vars.trackingNumber}</p>
        <p><a href="${vars.trackingUrl}">Track Your Package</a></p>
      `,
      text: `Your Order is Shipping!\n\nHi ${vars.firstName || 'there'},\n\nOrder Number: ${vars.orderNumber}\nTracking Number: ${vars.trackingNumber}\n\nTrack Your Package: ${vars.trackingUrl}`,
    }),
    deliveryConfirmation: (vars) => ({
      subject: `Your Order Has Been Delivered - ${vars.orderNumber}`,
      html: `
        <h1>Order Delivered!</h1>
        <p>Hi ${vars.firstName || 'there'},</p>
        <p>Your order has been successfully delivered!</p>
        <p><strong>Order Number:</strong> ${vars.orderNumber}</p>
        <p>Thank you for shopping with us!</p>
      `,
      text: `Order Delivered!\n\nHi ${vars.firstName || 'there'},\n\nYour order has been successfully delivered!\n\nOrder Number: ${vars.orderNumber}\n\nThank you for shopping with us!`,
    }),
    paymentConfirmation: (vars) => ({
      subject: 'Payment Received',
      html: `
        <h1>Payment Confirmed!</h1>
        <p>Hi ${vars.firstName || 'there'},</p>
        <p>We've received your payment.</p>
        <p><strong>Amount:</strong> ₱${vars.amount}</p>
        <p><strong>Reference Number:</strong> ${vars.referenceNumber}</p>
        <p>Your order is now being processed.</p>
      `,
      text: `Payment Confirmed!\n\nHi ${vars.firstName || 'there'},\n\nAmount: ₱${vars.amount}\nReference Number: ${vars.referenceNumber}\n\nYour order is now being processed.`,
    }),
  };

  const template = templates[templateId];
  if (!template) {
    return null;
  }

  return template(variables);
}

/**
 * Get all available template IDs
 */
export function getAvailableTemplates(): string[] {
  return [
    'accountVerification',
    'passwordReset',
    'welcome',
    'orderConfirmation',
    'abandonedCart',
    'vendorNewOrder',
    'shippingUpdate',
    'deliveryConfirmation',
    'paymentConfirmation',
  ];
}
