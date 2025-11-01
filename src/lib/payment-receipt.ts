import { PaymentMethod, PaymentStatus } from "./validations/payment";
import { generateReceiptNumber } from "./payment-utils";

/**
 * Payment Receipt and Transaction Logging
 */

export interface ReceiptItem {
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface PaymentReceipt {
  receiptNumber: string;
  transactionId: string;
  orderId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  timestamp: Date;
  payerName: string;
  payerEmail: string;
  items: ReceiptItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  notes?: string;
}

export interface TransactionLog {
  id: string;
  transactionId: string;
  orderId: string;
  userId: string;
  method: PaymentMethod;
  amount: number;
  status: PaymentStatus;
  gatewayResponse: Record<string, any>;
  errorMessage?: string;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Generate payment receipt
 */
export function generateReceipt(
  transactionId: string,
  orderId: string,
  amount: number,
  method: PaymentMethod,
  status: PaymentStatus,
  payerName: string,
  payerEmail: string,
  items: ReceiptItem[],
  subtotal: number,
  tax: number,
  shipping: number,
  notes?: string
): PaymentReceipt {
  const receiptNumber = generateReceiptNumber();

  return {
    receiptNumber,
    transactionId,
    orderId,
    amount,
    method,
    status,
    timestamp: new Date(),
    payerName,
    payerEmail,
    items,
    subtotal,
    tax,
    shipping,
    total: amount,
    notes,
  };
}

/**
 * Format receipt for display
 */
export function formatReceiptForDisplay(receipt: PaymentReceipt): string {
  const methodName = getPaymentMethodName(receipt.method);
  const statusName = getPaymentStatusName(receipt.status);

  let receiptText = `
╔════════════════════════════════════════════════════════════════╗
║                    PAYMENT RECEIPT                             ║
╚════════════════════════════════════════════════════════════════╝

Receipt Number:     ${receipt.receiptNumber}
Transaction ID:     ${receipt.transactionId}
Order ID:           ${receipt.orderId}
Date & Time:        ${receipt.timestamp.toLocaleString("en-PH")}

─────────────────────────────────────────────────────────────────
PAYER INFORMATION
─────────────────────────────────────────────────────────────────
Name:               ${receipt.payerName}
Email:              ${receipt.payerEmail}

─────────────────────────────────────────────────────────────────
PAYMENT DETAILS
─────────────────────────────────────────────────────────────────
Payment Method:     ${methodName}
Payment Status:     ${statusName}

─────────────────────────────────────────────────────────────────
ORDER ITEMS
─────────────────────────────────────────────────────────────────
`;

  receipt.items.forEach((item) => {
    receiptText += `${item.name.padEnd(40)} x${item.quantity.toString().padStart(3)} ₱${item.subtotal.toFixed(2).padStart(10)}\n`;
  });

  receiptText += `
─────────────────────────────────────────────────────────────────
AMOUNT BREAKDOWN
─────────────────────────────────────────────────────────────────
Subtotal:           ₱${receipt.subtotal.toFixed(2).padStart(10)}
Tax (12% VAT):      ₱${receipt.tax.toFixed(2).padStart(10)}
Shipping:           ₱${receipt.shipping.toFixed(2).padStart(10)}
─────────────────────────────────────────────────────────────────
TOTAL AMOUNT:       ₱${receipt.total.toFixed(2).padStart(10)}
═════════════════════════════════════════════════════════════════

${receipt.notes ? `Notes: ${receipt.notes}\n` : ""}

Thank you for your purchase!
For inquiries, contact our customer service.

═════════════════════════════════════════════════════════════════
`;

  return receiptText;
}

/**
 * Generate receipt as HTML
 */
export function generateReceiptHTML(receipt: PaymentReceipt): string {
  const methodName = getPaymentMethodName(receipt.method);
  const statusName = getPaymentStatusName(receipt.status);
  const statusColor = receipt.status === PaymentStatus.COMPLETED ? "#28a745" : "#ffc107";

  const itemsHTML = receipt.items
    .map(
      (item) => `
    <tr>
      <td>${item.name}</td>
      <td style="text-align: center;">${item.quantity}</td>
      <td style="text-align: right;">₱${item.price.toFixed(2)}</td>
      <td style="text-align: right;">₱${item.subtotal.toFixed(2)}</td>
    </tr>
  `
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Receipt - ${receipt.receiptNumber}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f5f5f5;
      margin: 0;
      padding: 20px;
    }
    .receipt-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .receipt-header {
      text-align: center;
      border-bottom: 2px solid #333;
      padding-bottom: 20px;
      margin-bottom: 20px;
    }
    .receipt-header h1 {
      margin: 0;
      color: #333;
    }
    .receipt-section {
      margin-bottom: 20px;
    }
    .receipt-section h3 {
      background-color: #f0f0f0;
      padding: 10px;
      margin: 0 0 10px 0;
      border-left: 4px solid #007bff;
    }
    .receipt-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #eee;
    }
    .receipt-row.total {
      font-weight: bold;
      font-size: 18px;
      border-top: 2px solid #333;
      border-bottom: 2px solid #333;
      padding: 15px 0;
      margin-top: 10px;
    }
    .status-badge {
      display: inline-block;
      padding: 5px 15px;
      border-radius: 20px;
      color: white;
      font-weight: bold;
      background-color: ${statusColor};
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
    }
    table th {
      background-color: #f0f0f0;
      padding: 10px;
      text-align: left;
      border-bottom: 2px solid #333;
    }
    table td {
      padding: 10px;
      border-bottom: 1px solid #eee;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      color: #666;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="receipt-container">
    <div class="receipt-header">
      <h1>PAYMENT RECEIPT</h1>
      <p style="margin: 10px 0 0 0; color: #666;">Receipt #${receipt.receiptNumber}</p>
    </div>

    <div class="receipt-section">
      <h3>Receipt Information</h3>
      <div class="receipt-row">
        <span>Receipt Number:</span>
        <strong>${receipt.receiptNumber}</strong>
      </div>
      <div class="receipt-row">
        <span>Transaction ID:</span>
        <strong>${receipt.transactionId}</strong>
      </div>
      <div class="receipt-row">
        <span>Order ID:</span>
        <strong>${receipt.orderId}</strong>
      </div>
      <div class="receipt-row">
        <span>Date & Time:</span>
        <strong>${receipt.timestamp.toLocaleString("en-PH")}</strong>
      </div>
    </div>

    <div class="receipt-section">
      <h3>Payer Information</h3>
      <div class="receipt-row">
        <span>Name:</span>
        <strong>${receipt.payerName}</strong>
      </div>
      <div class="receipt-row">
        <span>Email:</span>
        <strong>${receipt.payerEmail}</strong>
      </div>
    </div>

    <div class="receipt-section">
      <h3>Payment Details</h3>
      <div class="receipt-row">
        <span>Payment Method:</span>
        <strong>${methodName}</strong>
      </div>
      <div class="receipt-row">
        <span>Payment Status:</span>
        <span class="status-badge">${statusName}</span>
      </div>
    </div>

    <div class="receipt-section">
      <h3>Order Items</h3>
      <table>
        <thead>
          <tr>
            <th>Item Name</th>
            <th style="text-align: center;">Qty</th>
            <th style="text-align: right;">Price</th>
            <th style="text-align: right;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHTML}
        </tbody>
      </table>
    </div>

    <div class="receipt-section">
      <h3>Amount Breakdown</h3>
      <div class="receipt-row">
        <span>Subtotal:</span>
        <strong>₱${receipt.subtotal.toFixed(2)}</strong>
      </div>
      <div class="receipt-row">
        <span>Tax (12% VAT):</span>
        <strong>₱${receipt.tax.toFixed(2)}</strong>
      </div>
      <div class="receipt-row">
        <span>Shipping:</span>
        <strong>₱${receipt.shipping.toFixed(2)}</strong>
      </div>
      <div class="receipt-row total">
        <span>TOTAL AMOUNT:</span>
        <strong>₱${receipt.total.toFixed(2)}</strong>
      </div>
    </div>

    ${receipt.notes ? `<div class="receipt-section"><strong>Notes:</strong> ${receipt.notes}</div>` : ""}

    <div class="footer">
      <p>Thank you for your purchase!</p>
      <p>For inquiries, contact our customer service.</p>
      <p style="margin-top: 20px; color: #999;">This is an automated receipt. Please keep it for your records.</p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Log transaction
 */
export function logTransaction(
  transactionId: string,
  orderId: string,
  userId: string,
  method: PaymentMethod,
  amount: number,
  status: PaymentStatus,
  gatewayResponse: Record<string, any>,
  errorMessage?: string,
  ipAddress?: string,
  userAgent?: string
): TransactionLog {
  const log: TransactionLog = {
    id: `LOG-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    transactionId,
    orderId,
    userId,
    method,
    amount,
    status,
    gatewayResponse,
    errorMessage,
    timestamp: new Date(),
    ipAddress,
    userAgent,
  };

  // In production, save to database
  console.log("Transaction logged:", log);

  return log;
}

/**
 * Get payment method name
 */
function getPaymentMethodName(method: PaymentMethod): string {
  const names: Record<PaymentMethod, string> = {
    [PaymentMethod.GCASH]: "GCash",
    [PaymentMethod.PAYMAYA]: "PayMaya",
    [PaymentMethod.CREDIT_CARD]: "Credit Card",
    [PaymentMethod.DEBIT_CARD]: "Debit Card",
    [PaymentMethod.BANK_TRANSFER]: "Bank Transfer",
    [PaymentMethod.COD]: "Cash on Delivery",
  };
  return names[method] || method;
}

/**
 * Get payment status name
 */
function getPaymentStatusName(status: PaymentStatus): string {
  const names: Record<PaymentStatus, string> = {
    [PaymentStatus.PENDING]: "Pending",
    [PaymentStatus.PROCESSING]: "Processing",
    [PaymentStatus.COMPLETED]: "Completed",
    [PaymentStatus.FAILED]: "Failed",
    [PaymentStatus.CANCELLED]: "Cancelled",
    [PaymentStatus.REFUNDED]: "Refunded",
    [PaymentStatus.PARTIALLY_REFUNDED]: "Partially Refunded",
  };
  return names[status] || status;
}

