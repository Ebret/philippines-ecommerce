import type { Meta, StoryObj } from '@storybook/react';
import { renderEmailTemplate } from '@/lib/email-templates';

/**
 * Email Templates for Philippines E-Commerce Platform
 * Displays all email templates used in the system
 */

const meta: Meta = {
  title: 'Email/Templates',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

// ============ Account Verification Email ============
export const AccountVerification: StoryObj = {
  render: () => {
    const template = renderEmailTemplate('accountVerification', {
      firstName: 'John',
      verificationUrl: 'https://extremelifeherbal.com/verify?token=abc123',
    });

    return (
      <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '20px', textAlign: 'center' }}>
            <h1 style={{ margin: 0 }}>Verify Your Email</h1>
          </div>
          <div style={{ padding: '20px' }}>
            <p><strong>Subject:</strong> {template?.subject}</p>
            <hr />
            <div dangerouslySetInnerHTML={{ __html: template?.html || '' }} />
          </div>
        </div>
      </div>
    );
  },
};

// ============ Password Reset Email ============
export const PasswordReset: StoryObj = {
  render: () => {
    const template = renderEmailTemplate('passwordReset', {
      firstName: 'Jane',
      resetUrl: 'https://extremelifeherbal.com/reset-password?token=xyz789',
    });

    return (
      <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '20px', textAlign: 'center' }}>
            <h1 style={{ margin: 0 }}>Password Reset</h1>
          </div>
          <div style={{ padding: '20px' }}>
            <p><strong>Subject:</strong> {template?.subject}</p>
            <hr />
            <div dangerouslySetInnerHTML={{ __html: template?.html || '' }} />
          </div>
        </div>
      </div>
    );
  },
};

// ============ Welcome Email ============
export const Welcome: StoryObj = {
  render: () => {
    const template = renderEmailTemplate('welcome', {
      firstName: 'Maria',
      shopUrl: 'https://extremelifeherbal.com/shop',
      accountUrl: 'https://extremelifeherbal.com/account',
    });

    return (
      <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '20px', textAlign: 'center' }}>
            <h1 style={{ margin: 0 }}>Welcome!</h1>
          </div>
          <div style={{ padding: '20px' }}>
            <p><strong>Subject:</strong> {template?.subject}</p>
            <hr />
            <div dangerouslySetInnerHTML={{ __html: template?.html || '' }} />
          </div>
        </div>
      </div>
    );
  },
};

// ============ Order Confirmation Email ============
export const OrderConfirmation: StoryObj = {
  render: () => {
    const template = renderEmailTemplate('orderConfirmation', {
      firstName: 'Carlos',
      orderNumber: 'ORD-2024-001234',
      orderDate: '2024-11-02',
      subtotal: '2,500.00',
      shippingFee: '150.00',
      totalAmount: '2,650.00',
      trackingUrl: 'https://extremelifeherbal.com/orders/ORD-2024-001234/track',
    });

    return (
      <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '20px', textAlign: 'center' }}>
            <h1 style={{ margin: 0 }}>Order Confirmed!</h1>
          </div>
          <div style={{ padding: '20px' }}>
            <p><strong>Subject:</strong> {template?.subject}</p>
            <hr />
            <div dangerouslySetInnerHTML={{ __html: template?.html || '' }} />
          </div>
        </div>
      </div>
    );
  },
};

// ============ Abandoned Cart Email ============
export const AbandonedCart: StoryObj = {
  render: () => {
    const template = renderEmailTemplate('abandonedCart', {
      firstName: 'Ana',
      itemCount: '3',
      cartTotal: '1,850.00',
      discountCode: 'COMEBACK15',
      discountPercent: '15',
      cartUrl: 'https://extremelifeherbal.com/cart',
    });

    return (
      <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '20px', textAlign: 'center' }}>
            <h1 style={{ margin: 0 }}>Your Cart is Waiting!</h1>
          </div>
          <div style={{ padding: '20px' }}>
            <p><strong>Subject:</strong> {template?.subject}</p>
            <hr />
            <div dangerouslySetInnerHTML={{ __html: template?.html || '' }} />
          </div>
        </div>
      </div>
    );
  },
};

// ============ Email Template Preview Component ============
export const AllTemplates: StoryObj = {
  render: () => {
    const templates = [
      {
        name: 'Account Verification',
        type: 'accountVerification',
        variables: { firstName: 'John', verificationUrl: 'https://extremelifeherbal.com/verify' },
      },
      {
        name: 'Password Reset',
        type: 'passwordReset',
        variables: { firstName: 'Jane', resetUrl: 'https://extremelifeherbal.com/reset' },
      },
      {
        name: 'Welcome',
        type: 'welcome',
        variables: { firstName: 'Maria', shopUrl: 'https://extremelifeherbal.com/shop', accountUrl: 'https://extremelifeherbal.com/account' },
      },
      {
        name: 'Order Confirmation',
        type: 'orderConfirmation',
        variables: { firstName: 'Carlos', orderNumber: 'ORD-001', orderDate: '2024-11-02', subtotal: '2500', shippingFee: '150', totalAmount: '2650', trackingUrl: 'https://extremelifeherbal.com/track' },
      },
      {
        name: 'Abandoned Cart',
        type: 'abandonedCart',
        variables: { firstName: 'Ana', itemCount: '3', cartTotal: '1850', discountCode: 'COMEBACK15', discountPercent: '15', cartUrl: 'https://extremelifeherbal.com/cart' },
      },
    ];

    return (
      <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Email Templates Preview</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {templates.map((t) => (
            <div key={t.type} style={{ backgroundColor: 'white', borderRadius: '8px', padding: '15px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#667eea' }}>{t.name}</h3>
              <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>Type: {t.type}</p>
              <p style={{ margin: '10px 0 0 0', fontSize: '12px', color: '#999' }}>Click to preview</p>
            </div>
          ))}
        </div>
      </div>
    );
  },
};

// ============ Email Configuration Info ============
export const Configuration: StoryObj = {
  render: () => (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'white', borderRadius: '8px', padding: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h1 style={{ color: '#667eea', marginBottom: '20px' }}>Email Configuration</h1>
        
        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '18px', color: '#333', marginBottom: '10px' }}>Domain Configuration</h2>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li>Domain: extremelifeherbal.com</li>
            <li>From Email: noreply@extremelifeherbal.com</li>
            <li>Support Email: support@extremelifeherbal.com</li>
            <li>Vendor Email: vendors@extremelifeherbal.com</li>
            <li>Admin Email: admin@extremelifeherbal.com</li>
          </ul>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '18px', color: '#333', marginBottom: '10px' }}>Email Providers</h2>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li>SendGrid</li>
            <li>Mailgun</li>
            <li>AWS SES</li>
          </ul>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '18px', color: '#333', marginBottom: '10px' }}>Email Types Supported</h2>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li>Account Verification</li>
            <li>Password Reset</li>
            <li>Welcome</li>
            <li>Order Confirmation</li>
            <li>Payment Confirmation</li>
            <li>Shipping Updates</li>
            <li>Delivery Confirmation</li>
            <li>Abandoned Cart</li>
            <li>Product Recommendations</li>
            <li>Promotional Campaigns</li>
            <li>Vendor Notifications</li>
            <li>Newsletter</li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontSize: '18px', color: '#333', marginBottom: '10px' }}>Features</h2>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li>✓ Email Queue Management</li>
            <li>✓ Open & Click Tracking</li>
            <li>✓ Email Preferences Management</li>
            <li>✓ Unsubscribe Management</li>
            <li>✓ Email Logging & Analytics</li>
            <li>✓ HTML & Plain Text Formats</li>
            <li>✓ Template Variables</li>
            <li>✓ Rate Limiting</li>
            <li>✓ GDPR Compliance</li>
          </ul>
        </section>
      </div>
    </div>
  ),
};

