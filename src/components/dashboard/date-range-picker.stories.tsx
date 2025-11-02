import type { Meta, StoryObj } from '@storybook/react';
import { DateRangePicker } from './date-range-picker';

const meta = {
  title: 'Components/Dashboard/DateRangePicker',
  component: DateRangePicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DateRangePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

const today = new Date();
const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
const lastYear = new Date(today.getFullYear() - 1, today.getMonth(), 1);

export const Default: Story = {
  args: {
    onDateRangeChange: (range) => {
      console.log('Date range changed:', range);
    },
  },
};

export const WithInitialRange: Story = {
  args: {
    initialRange: {
      startDate: new Date(today.getFullYear(), today.getMonth(), 1),
      endDate: today,
    },
    onDateRangeChange: (range) => {
      console.log('Date range changed:', range);
    },
  },
};

export const LastWeek: Story = {
  args: {
    initialRange: {
      startDate: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
      endDate: today,
    },
    onDateRangeChange: (range) => {
      console.log('Last week selected:', range);
    },
  },
};

export const LastMonth: Story = {
  args: {
    initialRange: {
      startDate: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000),
      endDate: today,
    },
    onDateRangeChange: (range) => {
      console.log('Last month selected:', range);
    },
  },
};

export const LastQuarter: Story = {
  args: {
    initialRange: {
      startDate: new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000),
      endDate: today,
    },
    onDateRangeChange: (range) => {
      console.log('Last quarter selected:', range);
    },
  },
};

export const LastYear: Story = {
  args: {
    initialRange: {
      startDate: lastYear,
      endDate: today,
    },
    onDateRangeChange: (range) => {
      console.log('Last year selected:', range);
    },
  },
};

export const CustomRange: Story = {
  args: {
    initialRange: {
      startDate: new Date(2024, 0, 15),
      endDate: new Date(2024, 2, 20),
    },
    onDateRangeChange: (range) => {
      console.log('Custom range selected:', range);
    },
  },
};

export const CurrentMonth: Story = {
  args: {
    initialRange: {
      startDate: new Date(today.getFullYear(), today.getMonth(), 1),
      endDate: today,
    },
    onDateRangeChange: (range) => {
      console.log('Current month selected:', range);
    },
  },
};

export const PreviousMonth: Story = {
  args: {
    initialRange: {
      startDate: new Date(today.getFullYear(), today.getMonth() - 1, 1),
      endDate: new Date(today.getFullYear(), today.getMonth(), 0),
    },
    onDateRangeChange: (range) => {
      console.log('Previous month selected:', range);
    },
  },
};

export const SingleDay: Story = {
  args: {
    initialRange: {
      startDate: today,
      endDate: today,
    },
    onDateRangeChange: (range) => {
      console.log('Single day selected:', range);
    },
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    onDateRangeChange: (range) => {
      console.log('Date range changed:', range);
    },
  },
};

export const SalesAnalytics: Story = {
  args: {
    initialRange: {
      startDate: new Date(today.getFullYear(), today.getMonth(), 1),
      endDate: today,
    },
    onDateRangeChange: (range) => {
      console.log('Sales analytics date range:', range);
    },
  },
};

export const RevenueReport: Story = {
  args: {
    initialRange: {
      startDate: new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000),
      endDate: today,
    },
    onDateRangeChange: (range) => {
      console.log('Revenue report date range:', range);
    },
  },
};

export const OrderTracking: Story = {
  args: {
    initialRange: {
      startDate: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000),
      endDate: today,
    },
    onDateRangeChange: (range) => {
      console.log('Order tracking date range:', range);
    },
  },
};

export const InventoryAnalysis: Story = {
  args: {
    initialRange: {
      startDate: new Date(today.getFullYear(), today.getMonth(), 1),
      endDate: today,
    },
    onDateRangeChange: (range) => {
      console.log('Inventory analysis date range:', range);
    },
  },
};

export const CustomerInsights: Story = {
  args: {
    initialRange: {
      startDate: new Date(today.getTime() - 180 * 24 * 60 * 60 * 1000),
      endDate: today,
    },
    onDateRangeChange: (range) => {
      console.log('Customer insights date range:', range);
    },
  },
};

