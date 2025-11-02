import type { Meta, StoryObj } from '@storybook/react';
import { KPIWidget } from './kpi-widget';

const meta = {
  title: 'Components/Dashboard/KPIWidget',
  component: KPIWidget,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof KPIWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TotalSales: Story = {
  args: {
    title: 'Total Sales',
    value: '₱118,900',
    trend: { value: 12, direction: 'up', label: 'vs last week' },
    color: 'success',
    icon: '📊',
  },
};

export const TotalOrders: Story = {
  args: {
    title: 'Total Orders',
    value: '1,245',
    trend: { value: 8, direction: 'up', label: 'vs last week' },
    color: 'primary',
    icon: '📦',
  },
};

export const AverageRating: Story = {
  args: {
    title: 'Avg Rating',
    value: '4.6',
    unit: '/ 5',
    trend: { value: 2, direction: 'up', label: 'vs last month' },
    color: 'warning',
    icon: '⭐',
  },
};

export const ConversionRate: Story = {
  args: {
    title: 'Conversion Rate',
    value: '3.2',
    unit: '%',
    trend: { value: 0.5, direction: 'up', label: 'vs last week' },
    color: 'info',
    icon: '📈',
  },
};

export const DownwardTrend: Story = {
  args: {
    title: 'Bounce Rate',
    value: '42.5',
    unit: '%',
    trend: { value: 5, direction: 'down', label: 'vs last week' },
    color: 'error',
    icon: '📉',
  },
};

export const NeutralTrend: Story = {
  args: {
    title: 'System Health',
    value: '99.8',
    unit: '%',
    trend: { value: 0, direction: 'neutral', label: 'stable' },
    color: 'info',
    icon: '✅',
  },
};

export const SmallSize: Story = {
  args: {
    title: 'Small Widget',
    value: '256',
    size: 'sm',
    color: 'primary',
    icon: '📊',
  },
};

export const LargeSize: Story = {
  args: {
    title: 'Large Widget',
    value: '₱500,000',
    size: 'lg',
    trend: { value: 25, direction: 'up', label: 'growth' },
    color: 'success',
    icon: '💰',
  },
};

export const WithoutTrend: Story = {
  args: {
    title: 'Active Users',
    value: '8,542',
    color: 'primary',
    icon: '👥',
  },
};

export const Clickable: Story = {
  args: {
    title: 'Click Me',
    value: '1,234',
    color: 'primary',
    icon: '🖱️',
    onClick: () => alert('Widget clicked!'),
  },
};

