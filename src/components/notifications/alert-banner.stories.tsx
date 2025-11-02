import type { Meta, StoryObj } from '@storybook/react';
import { AlertBanner } from './alert-banner';

const meta = {
  title: 'Components/Notifications/AlertBanner',
  component: AlertBanner,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AlertBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    title: 'Success',
    message: 'Your changes have been saved successfully.',
    severity: 'success',
    dismissible: true,
  },
};

export const Error: Story = {
  args: {
    title: 'Error',
    message: 'An error occurred while processing your request. Please try again.',
    severity: 'error',
    dismissible: true,
  },
};

export const Info: Story = {
  args: {
    title: 'Information',
    message: 'The system will undergo maintenance on Sunday from 2 AM to 4 AM.',
    severity: 'info',
    dismissible: true,
  },
};

export const Warning: Story = {
  args: {
    title: 'Warning',
    message: 'Your account will be suspended if you do not verify your email within 7 days.',
    severity: 'warning',
    dismissible: true,
  },
};

export const WithAction: Story = {
  args: {
    title: 'System Maintenance',
    message: 'The system will be under maintenance tomorrow.',
    severity: 'warning',
    dismissible: true,
    action: {
      label: 'Learn More',
      onClick: () => alert('Learn More clicked'),
    },
  },
};

export const NotDismissible: Story = {
  args: {
    title: 'Important Notice',
    message: 'This is an important notice that cannot be dismissed.',
    severity: 'error',
    dismissible: false,
  },
};

export const WithCustomIcon: Story = {
  args: {
    title: 'Custom Icon',
    message: 'This alert has a custom icon.',
    severity: 'info',
    dismissible: true,
    icon: '🔔',
  },
};

export const LongMessage: Story = {
  args: {
    title: 'Detailed Information',
    message: 'This is a longer message that provides more detailed information about what is happening. It can span multiple lines and provide comprehensive details to the user.',
    severity: 'info',
    dismissible: true,
  },
};

export const SuccessWithAction: Story = {
  args: {
    title: 'Order Confirmed',
    message: 'Your order has been confirmed and is being prepared.',
    severity: 'success',
    dismissible: true,
    action: {
      label: 'View Order',
      onClick: () => alert('View Order clicked'),
    },
  },
};

export const ErrorWithAction: Story = {
  args: {
    title: 'Payment Failed',
    message: 'Your payment could not be processed.',
    severity: 'error',
    dismissible: true,
    action: {
      label: 'Retry',
      onClick: () => alert('Retry clicked'),
    },
  },
};

export const WarningWithAction: Story = {
  args: {
    title: 'Low Stock',
    message: 'This product is running low on stock.',
    severity: 'warning',
    dismissible: true,
    action: {
      label: 'Buy Now',
      onClick: () => alert('Buy Now clicked'),
    },
  },
};

