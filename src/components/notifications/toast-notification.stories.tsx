import type { Meta, StoryObj } from '@storybook/react';
import { ToastNotification } from './toast-notification';

const meta = {
  title: 'Components/Notifications/ToastNotification',
  component: ToastNotification,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ToastNotification>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    message: 'Your order has been placed successfully!',
    title: 'Success',
    type: 'success',
    position: 'top-right',
    size: 'md',
  },
};

export const Error: Story = {
  args: {
    message: 'Failed to process your payment. Please try again.',
    title: 'Error',
    type: 'error',
    position: 'top-right',
    size: 'md',
  },
};

export const Info: Story = {
  args: {
    message: 'Your order is being prepared for shipment.',
    title: 'Information',
    type: 'info',
    position: 'top-right',
    size: 'md',
  },
};

export const Warning: Story = {
  args: {
    message: 'Your session will expire in 5 minutes.',
    title: 'Warning',
    type: 'warning',
    position: 'top-right',
    size: 'md',
  },
};

export const WithAction: Story = {
  args: {
    message: 'Your order has been cancelled.',
    title: 'Order Cancelled',
    type: 'info',
    position: 'top-right',
    size: 'md',
    action: {
      label: 'Undo',
      onClick: () => alert('Undo clicked'),
    },
  },
};

export const TopLeft: Story = {
  args: {
    message: 'Notification from top left',
    title: 'Position',
    type: 'info',
    position: 'top-left',
    size: 'md',
  },
};

export const BottomRight: Story = {
  args: {
    message: 'Notification from bottom right',
    title: 'Position',
    type: 'success',
    position: 'bottom-right',
    size: 'md',
  },
};

export const BottomLeft: Story = {
  args: {
    message: 'Notification from bottom left',
    title: 'Position',
    type: 'warning',
    position: 'bottom-left',
    size: 'md',
  },
};

export const SmallSize: Story = {
  args: {
    message: 'Small notification',
    title: 'Small',
    type: 'info',
    position: 'top-right',
    size: 'sm',
  },
};

export const LargeSize: Story = {
  args: {
    message: 'This is a large notification with more detailed information about what happened.',
    title: 'Large Notification',
    type: 'success',
    position: 'top-right',
    size: 'lg',
  },
};

export const WithCustomIcon: Story = {
  args: {
    message: 'Custom icon notification',
    title: 'Custom',
    type: 'info',
    position: 'top-right',
    size: 'md',
    icon: '🎉',
  },
};

export const LongDuration: Story = {
  args: {
    message: 'This notification will stay for 10 seconds',
    title: 'Long Duration',
    type: 'info',
    position: 'top-right',
    size: 'md',
    duration: 10000,
  },
};

export const NoDuration: Story = {
  args: {
    message: 'This notification will not auto-dismiss',
    title: 'Persistent',
    type: 'warning',
    position: 'top-right',
    size: 'md',
    duration: 0,
  },
};

