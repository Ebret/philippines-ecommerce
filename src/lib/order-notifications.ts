/**
 * Order Notification System
 * Handles email and in-app notifications for order events
 */

export interface NotificationData {
  userId: string;
  orderId: string;
  orderNumber: string;
  userEmail: string;
  userName: string;
  type: NotificationType;
  data: Record<string, unknown>;
}

export type NotificationType =
  | "ORDER_CONFIRMED"
  | "PAYMENT_CONFIRMED"
  | "ORDER_PROCESSING"
  | "SHIPMENT_CREATED"
  | "SHIPMENT_SHIPPED"
  | "SHIPMENT_OUT_FOR_DELIVERY"
  | "SHIPMENT_DELIVERED"
  | "SHIPMENT_FAILED"
  | "ORDER_CANCELLED"
  | "RETURN_REQUESTED"
  | "RETURN_APPROVED"
  | "REFUND_PROCESSED";

/**
 * Generate notification message based on type
 */
export function generateNotificationMessage(
  type: NotificationType,
  data: Record<string, unknown>
): string {
  const messages: Record<NotificationType, (data: Record<string, unknown>) => string> = {
    ORDER_CONFIRMED: (d) =>
      `Your order #${d.orderNumber} has been confirmed. We'll process it shortly.`,
    PAYMENT_CONFIRMED: (d) =>
      `Payment of ₱${d.amount} for order #${d.orderNumber} has been received.`,
    ORDER_PROCESSING: (d) =>
      `Your order #${d.orderNumber} is being processed and will be shipped soon.`,
    SHIPMENT_CREATED: (d) =>
      `Your order #${d.orderNumber} has been prepared for shipment. Tracking: ${d.trackingNumber}`,
    SHIPMENT_SHIPPED: (d) =>
      `Your order #${d.orderNumber} has been shipped via ${d.provider}. Tracking: ${d.trackingNumber}`,
    SHIPMENT_OUT_FOR_DELIVERY: (d) =>
      `Your order #${d.orderNumber} is out for delivery today!`,
    SHIPMENT_DELIVERED: (d) =>
      `Your order #${d.orderNumber} has been delivered. Thank you for your purchase!`,
    SHIPMENT_FAILED: (d) =>
      `Delivery of order #${d.orderNumber} failed. We'll attempt redelivery.`,
    ORDER_CANCELLED: (d) =>
      `Your order #${d.orderNumber} has been cancelled. Refund will be processed within 5-7 business days.`,
    RETURN_REQUESTED: (d) =>
      `Your return request for order #${d.orderNumber} has been received and is pending approval.`,
    RETURN_APPROVED: (d) =>
      `Your return request for order #${d.orderNumber} has been approved. Please arrange pickup.`,
    REFUND_PROCESSED: (d) =>
      `Refund of ₱${d.amount} for order #${d.orderNumber} has been processed.`,
  };

  return messages[type](data);
}

/**
 * Generate email subject based on notification type
 */
export function generateEmailSubject(type: NotificationType): string {
  const subjects: Record<NotificationType, string> = {
    ORDER_CONFIRMED: "Order Confirmed",
    PAYMENT_CONFIRMED: "Payment Received",
    ORDER_PROCESSING: "Order Processing",
    SHIPMENT_CREATED: "Order Prepared for Shipment",
    SHIPMENT_SHIPPED: "Your Order Has Shipped",
    SHIPMENT_OUT_FOR_DELIVERY: "Out for Delivery Today",
    SHIPMENT_DELIVERED: "Order Delivered",
    SHIPMENT_FAILED: "Delivery Attempt Failed",
    ORDER_CANCELLED: "Order Cancelled",
    RETURN_REQUESTED: "Return Request Received",
    RETURN_APPROVED: "Return Approved",
    REFUND_PROCESSED: "Refund Processed",
  };

  return subjects[type];
}

/**
 * Generate email HTML template
 */
export function generateEmailTemplate(
  notification: NotificationData
): string {
  const subject = generateEmailSubject(notification.type);
  const message = generateNotificationMessage(notification.type, notification.data);

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #007bff; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
          .button { display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; }
          .order-details { background-color: white; padding: 15px; margin: 15px 0; border-left: 4px solid #007bff; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${subject}</h1>
          </div>
          <div class="content">
            <p>Hi ${notification.userName},</p>
            <p>${message}</p>
            <div class="order-details">
              <strong>Order Number:</strong> ${notification.orderNumber}<br>
              ${notification.data.trackingNumber ? `<strong>Tracking Number:</strong> ${notification.data.trackingNumber}<br>` : ""}
              ${notification.data.amount ? `<strong>Amount:</strong> ₱${notification.data.amount}<br>` : ""}
              ${notification.data.provider ? `<strong>Shipping Provider:</strong> ${notification.data.provider}<br>` : ""}
            </div>
            <p>
              <a href="https://yoursite.com/orders/${notification.orderId}" class="button">View Order</a>
            </p>
            <p>If you have any questions, please contact our support team.</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 Philippines E-Commerce Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Send notification (mock implementation)
 * In production, integrate with email service like SendGrid or Resend
 */
export async function sendNotification(
  notification: NotificationData
): Promise<boolean> {
  try {
    console.log(`Sending ${notification.type} notification to ${notification.userEmail}`);
    console.log(`Order: ${notification.orderNumber}`);
    console.log(`Message: ${generateNotificationMessage(notification.type, notification.data)}`);

    // Mock implementation - in production, call actual email service
    // Example with Resend:
    // const response = await resend.emails.send({
    //   from: "orders@yoursite.com",
    //   to: notification.userEmail,
    //   subject: generateEmailSubject(notification.type),
    //   html: generateEmailTemplate(notification),
    // });

    return true;
  } catch (error) {
    console.error("Error sending notification:", error);
    return false;
  }
}

/**
 * Send order confirmation notification
 */
export async function sendOrderConfirmation(
  userId: string,
  orderId: string,
  orderNumber: string,
  userEmail: string,
  userName: string
): Promise<boolean> {
  return sendNotification({
    userId,
    orderId,
    orderNumber,
    userEmail,
    userName,
    type: "ORDER_CONFIRMED",
    data: { orderNumber },
  });
}

/**
 * Send payment confirmation notification
 */
export async function sendPaymentConfirmation(
  userId: string,
  orderId: string,
  orderNumber: string,
  userEmail: string,
  userName: string,
  amount: number
): Promise<boolean> {
  return sendNotification({
    userId,
    orderId,
    orderNumber,
    userEmail,
    userName,
    type: "PAYMENT_CONFIRMED",
    data: { orderNumber, amount },
  });
}

/**
 * Send shipment notification
 */
export async function sendShipmentNotification(
  userId: string,
  orderId: string,
  orderNumber: string,
  userEmail: string,
  userName: string,
  trackingNumber: string,
  provider: string
): Promise<boolean> {
  return sendNotification({
    userId,
    orderId,
    orderNumber,
    userEmail,
    userName,
    type: "SHIPMENT_SHIPPED",
    data: { orderNumber, trackingNumber, provider },
  });
}

/**
 * Send delivery notification
 */
export async function sendDeliveryNotification(
  userId: string,
  orderId: string,
  orderNumber: string,
  userEmail: string,
  userName: string
): Promise<boolean> {
  return sendNotification({
    userId,
    orderId,
    orderNumber,
    userEmail,
    userName,
    type: "SHIPMENT_DELIVERED",
    data: { orderNumber },
  });
}

/**
 * Send cancellation notification
 */
export async function sendCancellationNotification(
  userId: string,
  orderId: string,
  orderNumber: string,
  userEmail: string,
  userName: string,
  reason: string
): Promise<boolean> {
  return sendNotification({
    userId,
    orderId,
    orderNumber,
    userEmail,
    userName,
    type: "ORDER_CANCELLED",
    data: { orderNumber, reason },
  });
}

/**
 * Send refund notification
 */
export async function sendRefundNotification(
  userId: string,
  orderId: string,
  orderNumber: string,
  userEmail: string,
  userName: string,
  amount: number
): Promise<boolean> {
  return sendNotification({
    userId,
    orderId,
    orderNumber,
    userEmail,
    userName,
    type: "REFUND_PROCESSED",
    data: { orderNumber, amount },
  });
}

