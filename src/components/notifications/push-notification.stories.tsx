import type { Meta, StoryObj } from '@storybook/react';
import { PushNotification } from './push-notification';

const meta = {
  title: 'Components/Notifications/PushNotification',
  component: PushNotification,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PushNotification>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    title: 'Order Confirmed',
    message: 'Your order #12345 has been confirmed.',
    type: 'success',
    position: 'bottom-right',
  },
};

export const Error: Story = {
  args: {
    title: 'Payment Failed',
    message: 'Your payment could not be processed. Please try again.',
    type: 'error',
    position: 'bottom-right',
  },
};

export const Info: Story = {
  args: {
    title: 'New Message',
    message: 'You have a new message from support.',
    type: 'info',
    position: 'bottom-right',
  },
};

export const Warning: Story = {
  args: {
    title: 'Low Stock',
    message: 'This item is running low on stock.',
    type: 'warning',
    position: 'bottom-right',
  },
};

export const WithBadge: Story = {
  args: {
    title: 'Messages',
    message: 'You have 5 new messages.',
    type: 'info',
    position: 'bottom-right',
    badge: 5,
  },
};

export const WithAction: Story = {
  args: {
    title: 'Order Update',
    message: 'Your order is ready for pickup.',
    type: 'success',
    position: 'bottom-right',
    action: {
      label: 'View',
      onClick: () => alert('View clicked'),
    },
  },
};

export const TopRight: Story = {
  args: {
    title: 'Notification',
    message: 'This notification appears at the top right.',
    type: 'info',
    position: 'top-right',
  },
};

export const TopLeft: Story = {
  args: {
    title: 'Notification',
    message: 'This notification appears at the top left.',
    type: 'info',
    position: 'top-left',
  },
};

export const BottomLeft: Story = {
  args: {
    title: 'Notification',
    message: 'This notification appears at the bottom left.',
    type: 'info',
    position: 'bottom-left',
  },
};

export const LongDuration: Story = {
  args: {
    title: 'Important Notice',
    message: 'This notification will stay for 15 seconds.',
    type: 'warning',
    position: 'bottom-right',
    duration: 15000,
  },
};

export const ShortDuration: Story = {
  args: {
    title: 'Quick Update',
    message: 'This notification will disappear quickly.',
    type: 'info',
    position: 'bottom-right',
    duration: 2000,
  },
};

export const WithCustomIcon: Story = {
  args: {
    title: 'Celebration',
    message: 'You earned a badge!',
    type: 'success',
    position: 'bottom-right',
    icon: '🎉',
  },
};

export const HighBadgeCount: Story = {
  args: {
    title: 'Notifications',
    message: 'You have many unread notifications.',
    type: 'info',
    position: 'bottom-right',
    badge: 99,
  },
};

export const LongMessage: Story = {
  args: {
    title: 'Detailed Update',
    message: 'Your order has been shipped and is on its way. You can track it using the tracking number provided in your email.',
    type: 'success',
    position: 'bottom-right',
  },
};

