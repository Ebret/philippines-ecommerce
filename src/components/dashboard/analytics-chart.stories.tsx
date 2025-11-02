import type { Meta, StoryObj } from '@storybook/react';
import { AnalyticsChart } from './analytics-chart';

const meta = {
  title: 'Components/Dashboard/AnalyticsChart',
  component: AnalyticsChart,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AnalyticsChart>;

export default meta;
type Story = StoryObj<typeof meta>;

const salesData = [
  { label: 'Mon', value: 12500 },
  { label: 'Tue', value: 15800 },
  { label: 'Wed', value: 14200 },
  { label: 'Thu', value: 18900 },
  { label: 'Fri', value: 22100 },
  { label: 'Sat', value: 25600 },
  { label: 'Sun', value: 19800 },
];

const categoryData = [
  { label: 'Electronics', value: 45000 },
  { label: 'Fashion', value: 32000 },
  { label: 'Home', value: 28000 },
  { label: 'Sports', value: 15900 },
];

const revenueData = [
  { label: 'Week 1', value: 125000 },
  { label: 'Week 2', value: 158000 },
  { label: 'Week 3', value: 142000 },
  { label: 'Week 4', value: 189000 },
];

export const BarChart: Story = {
  args: {
    title: 'Sales This Week',
    data: salesData,
    type: 'bar',
    currency: true,
    height: 300,
    showLegend: true,
    showGrid: true,
  },
};

export const LineChart: Story = {
  args: {
    title: 'Revenue Trend',
    data: revenueData,
    type: 'line',
    currency: true,
    height: 300,
    showLegend: true,
    showGrid: true,
  },
};

export const PieChart: Story = {
  args: {
    title: 'Sales by Category',
    data: categoryData,
    type: 'pie',
    height: 300,
    showLegend: true,
  },
};

export const BarChartWithoutLegend: Story = {
  args: {
    title: 'Daily Sales',
    data: salesData,
    type: 'bar',
    currency: true,
    height: 250,
    showLegend: false,
  },
};

export const LineChartWithoutGrid: Story = {
  args: {
    title: 'User Growth',
    data: [
      { label: 'Jan', value: 1000 },
      { label: 'Feb', value: 1500 },
      { label: 'Mar', value: 2000 },
      { label: 'Apr', value: 2800 },
    ],
    type: 'line',
    height: 300,
    showGrid: false,
  },
};

export const PieChartWithoutLegend: Story = {
  args: {
    title: 'Market Share',
    data: [
      { label: 'Company A', value: 40 },
      { label: 'Company B', value: 30 },
      { label: 'Company C', value: 20 },
      { label: 'Others', value: 10 },
    ],
    type: 'pie',
    height: 300,
    showLegend: false,
  },
};

export const SmallChart: Story = {
  args: {
    title: 'Quick Stats',
    data: salesData.slice(0, 3),
    type: 'bar',
    height: 200,
  },
};

export const LargeChart: Story = {
  args: {
    title: 'Detailed Analytics',
    data: salesData,
    type: 'bar',
    currency: true,
    height: 400,
  },
};

export const NonCurrencyChart: Story = {
  args: {
    title: 'User Count',
    data: [
      { label: 'Week 1', value: 1200 },
      { label: 'Week 2', value: 1800 },
      { label: 'Week 3', value: 2100 },
      { label: 'Week 4', value: 2500 },
    ],
    type: 'bar',
    currency: false,
    height: 300,
  },
};

export const ColoredBars: Story = {
  args: {
    title: 'Performance by Region',
    data: [
      { label: 'North', value: 45000, color: 'bg-blue-600' },
      { label: 'South', value: 32000, color: 'bg-green-600' },
      { label: 'East', value: 28000, color: 'bg-yellow-600' },
      { label: 'West', value: 15900, color: 'bg-red-600' },
    ],
    type: 'bar',
    currency: true,
    height: 300,
  },
};

