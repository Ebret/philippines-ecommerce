'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface EmailNotificationTemplateProps {
  recipientName: string;
  subject: string;
  preheader?: string;
  title: string;
  content: string;
  sections?: Array<{
    title: string;
    items: Array<{
      label: string;
      value: string;
    }>;
  }>;
  primaryAction?: {
    label: string;
    url: string;
  };
  secondaryAction?: {
    label: string;
    url: string;
  };
  footer?: string;
  companyName?: string;
  companyLogo?: string;
  className?: string;
}

export const EmailNotificationTemplate: React.FC<EmailNotificationTemplateProps> = ({
  recipientName,
  subject,
  preheader,
  title,
  content,
  sections,
  primaryAction,
  secondaryAction,
  footer,
  companyName = 'Philippines E-Commerce',
  companyLogo,
  className,
}) => {
  return (
    <div className={cn('w-full max-w-2xl mx-auto bg-white', className)}>
      {/* Email Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 text-white">
        {companyLogo && (
          <img
            src={companyLogo}
            alt={companyName}
            className="h-8 mb-4"
          />
        )}
        {!companyLogo && (
          <div className="text-2xl font-bold mb-4">{companyName}</div>
        )}
        <h1 className="text-3xl font-bold">{title}</h1>
      </div>

      {/* Email Body */}
      <div className="px-6 py-8">
        {/* Greeting */}
        <p className="text-gray-800 mb-6">
          Hello {recipientName},
        </p>

        {/* Main Content */}
        <div className="text-gray-700 mb-8 leading-relaxed">
          {content}
        </div>

        {/* Sections */}
        {sections && sections.length > 0 && (
          <div className="mb-8 space-y-6">
            {sections.map((section, idx) => (
              <div key={idx}>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  {section.title}
                </h2>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  {section.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="flex justify-between">
                      <span className="text-gray-600">{item.label}</span>
                      <span className="font-semibold text-gray-900">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          {primaryAction && (
            <a
              href={primaryAction.url}
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              {primaryAction.label}
            </a>
          )}
          {secondaryAction && (
            <a
              href={secondaryAction.url}
              className="inline-block bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              {secondaryAction.label}
            </a>
          )}
        </div>

        {/* Footer Message */}
        {footer && (
          <p className="text-sm text-gray-600 italic">
            {footer}
          </p>
        )}
      </div>

      {/* Email Footer */}
      <div className="bg-gray-50 px-6 py-6 border-t border-gray-200">
        <p className="text-xs text-gray-600 text-center mb-2">
          © {new Date().getFullYear()} {companyName}. All rights reserved.
        </p>
        <p className="text-xs text-gray-600 text-center">
          You received this email because you're a valued customer.
        </p>
        <div className="flex justify-center gap-4 mt-4">
          <a href="#" className="text-xs text-blue-600 hover:text-blue-700">
            Unsubscribe
          </a>
          <span className="text-xs text-gray-400">•</span>
          <a href="#" className="text-xs text-blue-600 hover:text-blue-700">
            Preferences
          </a>
          <span className="text-xs text-gray-400">•</span>
          <a href="#" className="text-xs text-blue-600 hover:text-blue-700">
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
};

// Email template presets
export const EmailTemplates = {
  orderConfirmation: (props: Partial<EmailNotificationTemplateProps>) => (
    <EmailNotificationTemplate
      subject="Order Confirmation"
      title="Order Confirmed!"
      content="Thank you for your order. We're preparing your items for shipment."
      {...props}
    />
  ),

  paymentConfirmation: (props: Partial<EmailNotificationTemplateProps>) => (
    <EmailNotificationTemplate
      subject="Payment Received"
      title="Payment Confirmed"
      content="We've received your payment. Your order is now being processed."
      {...props}
    />
  ),

  shipmentNotification: (props: Partial<EmailNotificationTemplateProps>) => (
    <EmailNotificationTemplate
      subject="Your Order is on the Way"
      title="Order Shipped!"
      content="Your order has been shipped and is on its way to you."
      {...props}
    />
  ),

  deliveryNotification: (props: Partial<EmailNotificationTemplateProps>) => (
    <EmailNotificationTemplate
      subject="Your Order Has Been Delivered"
      title="Delivery Complete"
      content="Your order has been successfully delivered. Thank you for shopping with us!"
      {...props}
    />
  ),

  reviewRequest: (props: Partial<EmailNotificationTemplateProps>) => (
    <EmailNotificationTemplate
      subject="Share Your Feedback"
      title="How was your experience?"
      content="We'd love to hear what you think about your recent purchase. Your feedback helps us improve."
      {...props}
    />
  ),

  passwordReset: (props: Partial<EmailNotificationTemplateProps>) => (
    <EmailNotificationTemplate
      subject="Reset Your Password"
      title="Password Reset Request"
      content="We received a request to reset your password. Click the button below to create a new password."
      {...props}
    />
  ),

  welcomeEmail: (props: Partial<EmailNotificationTemplateProps>) => (
    <EmailNotificationTemplate
      subject="Welcome to Philippines E-Commerce"
      title="Welcome!"
      content="Thank you for joining us. We're excited to have you as part of our community."
      {...props}
    />
  ),

  promotionalEmail: (props: Partial<EmailNotificationTemplateProps>) => (
    <EmailNotificationTemplate
      subject="Special Offer Just for You"
      title="Exclusive Deal"
      content="We have a special offer just for you. Don't miss out!"
      {...props}
    />
  ),
};

