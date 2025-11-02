import type { Meta, StoryObj } from '@storybook/react';
import { CustomReports } from './custom-reports';

const meta = {
  title: 'Components/Dashboard/CustomReports',
  component: CustomReports,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CustomReports>;

export default meta;
type Story = StoryObj<typeof meta>;

const salesReportData = [
  { label: 'January', value: 45000 },
  { label: 'February', value: 52000 },
  { label: 'March', value: 48000 },
  { label: 'April', value: 61000 },
  { label: 'May', value: 55000 },
  { label: 'June', value: 67000 },
];

const categoryDistributionData = [
  { label: 'Electronics', value: 35 },
  { label: 'Clothing', value: 25 },
  { label: 'Books', value: 20 },
  { label: 'Home & Garden', value: 15 },
  { label: 'Sports', value: 5 },
];

const orderTrendData = [
  { label: 'Week 1', value: 120 },
  { label: 'Week 2', value: 145 },
  { label: 'Week 3', value: 132 },
  { label: 'Week 4', value: 168 },
];

const vendorPerformanceData = [
  { label: 'Vendor A', value: 4.8 },
  { label: 'Vendor B', value: 4.5 },
  { label: 'Vendor C', value: 4.2 },
  { label: 'Vendor D', value: 4.9 },
];

export const Default: Story = {
  args: {
    reports: [
      {
        title: 'Monthly Sales',
        type: 'bar' as const,
        data: salesReportData,
      },
      {
        title: 'Category Distribution',
        type: 'pie' as const,
        data: categoryDistributionData,
      },
    ],
    onExportReport: (reportTitle) => {
      console.log(`Exported report: ${reportTitle}`);
    },
  },
};

export const SalesReport: Story = {
  args: {
    reports: [
      {
        title: 'Monthly Sales',
        type: 'bar' as const,
        data: salesReportData,
      },
    ],
    onExportReport: (reportTitle) => {
      console.log(`Exported: ${reportTitle}`);
    },
  },
};

export const CategoryAnalysis: Story = {
  args: {
    reports: [
      {
        title: 'Category Distribution',
        type: 'pie' as const,
        data: categoryDistributionData,
      },
    ],
    onExportReport: (reportTitle) => {
      console.log(`Exported: ${reportTitle}`);
    },
  },
};

export const OrderTrends: Story = {
  args: {
    reports: [
      {
        title: 'Order Trends',
        type: 'line' as const,
        data: orderTrendData,
      },
    ],
    onExportReport: (reportTitle) => {
      console.log(`Exported: ${reportTitle}`);
    },
  },
};

export const MultipleReports: Story = {
  args: {
    reports: [
      {
        title: 'Monthly Sales',
        type: 'bar' as const,
        data: salesReportData,
      },
      {
        title: 'Category Distribution',
        type: 'pie' as const,
        data: categoryDistributionData,
      },
      {
        title: 'Order Trends',
        type: 'line' as const,
        data: orderTrendData,
      },
      {
        title: 'Vendor Performance',
        type: 'bar' as const,
        data: vendorPerformanceData,
      },
    ],
    onExportReport: (reportTitle) => {
      console.log(`Exported: ${reportTitle}`);
    },
  },
};

export const VendorPerformance: Story = {
  args: {
    reports: [
      {
        title: 'Vendor Ratings',
        type: 'bar' as const,
        data: vendorPerformanceData,
      },
    ],
    onExportReport: (reportTitle) => {
      console.log(`Exported: ${reportTitle}`);
    },
  },
};

export const ComprehensiveDashboard: Story = {
  args: {
    reports: [
      {
        title: 'Revenue Overview',
        type: 'line' as const,
        data: [
          { label: 'Q1', value: 150000 },
          { label: 'Q2', value: 180000 },
          { label: 'Q3', value: 165000 },
          { label: 'Q4', value: 210000 },
        ],
      },
      {
        title: 'Product Categories',
        type: 'pie' as const,
        data: categoryDistributionData,
      },
      {
        title: 'Monthly Performance',
        type: 'bar' as const,
        data: salesReportData,
      },
      {
        title: 'Order Volume',
        type: 'line' as const,
        data: orderTrendData,
      },
    ],
    onExportReport: (reportTitle) => {
      console.log(`Exported comprehensive report: ${reportTitle}`);
    },
  },
};

export const Disabled: Story = {
  args: {
    reports: [
      {
        title: 'Monthly Sales',
        type: 'bar' as const,
        data: salesReportData,
      },
    ],
    disabled: true,
  },
};

export const EmptyReports: Story = {
  args: {
    reports: [],
  },
};

export const InventoryReport: Story = {
  args: {
    reports: [
      {
        title: 'Inventory Levels',
        type: 'bar' as const,
        data: [
          { label: 'Electronics', value: 450 },
          { label: 'Clothing', value: 320 },
          { label: 'Books', value: 280 },
          { label: 'Home', value: 150 },
        ],
      },
      {
        title: 'Stock Status',
        type: 'pie' as const,
        data: [
          { label: 'In Stock', value: 85 },
          { label: 'Low Stock', value: 10 },
          { label: 'Out of Stock', value: 5 },
        ],
      },
    ],
    onExportReport: (reportTitle) => {
      console.log(`Exported inventory report: ${reportTitle}`);
    },
  },
};

export const CustomerAnalytics: Story = {
  args: {
    reports: [
      {
        title: 'Customer Growth',
        type: 'line' as const,
        data: [
          { label: 'Jan', value: 1000 },
          { label: 'Feb', value: 1200 },
          { label: 'Mar', value: 1450 },
          { label: 'Apr', value: 1680 },
          { label: 'May', value: 1920 },
          { label: 'Jun', value: 2150 },
        ],
      },
      {
        title: 'Customer Segments',
        type: 'pie' as const,
        data: [
          { label: 'New', value: 30 },
          { label: 'Returning', value: 50 },
          { label: 'VIP', value: 20 },
        ],
      },
    ],
    onExportReport: (reportTitle) => {
      console.log(`Exported customer analytics: ${reportTitle}`);
    },
  },
};

