import type { Meta, StoryObj } from '@storybook/react';
import { ExportFunctionality } from './export-functionality';

const meta = {
  title: 'Components/Dashboard/ExportFunctionality',
  component: ExportFunctionality,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ExportFunctionality>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockProductData = [
  { id: 1, name: 'Laptop', category: 'Electronics', price: 50000, quantity: 5, status: 'Active' },
  { id: 2, name: 'Mouse', category: 'Electronics', price: 500, quantity: 50, status: 'Active' },
  { id: 3, name: 'Keyboard', category: 'Electronics', price: 1500, quantity: 30, status: 'Active' },
  { id: 4, name: 'Monitor', category: 'Electronics', price: 8000, quantity: 10, status: 'Inactive' },
  { id: 5, name: 'Headphones', category: 'Electronics', price: 2000, quantity: 25, status: 'Active' },
];

const mockProductColumns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Product Name' },
  { key: 'category', label: 'Category' },
  { key: 'price', label: 'Price (PHP)' },
  { key: 'quantity', label: 'Quantity' },
  { key: 'status', label: 'Status' },
];

export const Default: Story = {
  args: {
    data: mockProductData,
    columns: mockProductColumns,
    filename: 'products-export',
    formats: ['csv', 'pdf'],
    onExport: (format, filename) => {
      console.log(`Exported as ${format}: ${filename}`);
    },
  },
};

export const CSVOnly: Story = {
  args: {
    data: mockProductData,
    columns: mockProductColumns,
    filename: 'products-csv',
    formats: ['csv'],
    onExport: (format, filename) => {
      console.log(`Exported as ${format}: ${filename}`);
    },
  },
};

export const PDFOnly: Story = {
  args: {
    data: mockProductData,
    columns: mockProductColumns,
    filename: 'products-pdf',
    formats: ['pdf'],
    onExport: (format, filename) => {
      console.log(`Exported as ${format}: ${filename}`);
    },
  },
};

export const LargeDataset: Story = {
  args: {
    data: Array.from({ length: 1000 }, (_, i) => ({
      id: i + 1,
      name: `Product ${i + 1}`,
      category: ['Electronics', 'Clothing', 'Books'][i % 3],
      price: Math.floor(Math.random() * 50000) + 100,
      quantity: Math.floor(Math.random() * 100),
      status: i % 2 === 0 ? 'Active' : 'Inactive',
    })),
    columns: mockProductColumns,
    filename: 'large-export',
    formats: ['csv', 'pdf'],
    onExport: (format, filename) => {
      console.log(`Exported ${1000} rows as ${format}: ${filename}`);
    },
  },
};

export const EmptyData: Story = {
  args: {
    data: [],
    columns: mockProductColumns,
    filename: 'empty-export',
    formats: ['csv', 'pdf'],
  },
};

export const WithCustomFilename: Story = {
  args: {
    data: mockProductData,
    columns: mockProductColumns,
    filename: 'my-custom-report-2024',
    formats: ['csv', 'pdf'],
    onExport: (format, filename) => {
      console.log(`Exported as ${format}: ${filename}`);
    },
  },
};

export const Disabled: Story = {
  args: {
    data: mockProductData,
    columns: mockProductColumns,
    filename: 'products-export',
    formats: ['csv', 'pdf'],
    disabled: true,
  },
};

export const SalesData: Story = {
  args: {
    data: [
      { date: '2024-01-01', sales: 50000, orders: 125, customers: 89 },
      { date: '2024-01-02', sales: 65000, orders: 156, customers: 102 },
      { date: '2024-01-03', sales: 45000, orders: 98, customers: 76 },
      { date: '2024-01-04', sales: 78000, orders: 189, customers: 145 },
      { date: '2024-01-05', sales: 92000, orders: 210, customers: 167 },
    ],
    columns: [
      { key: 'date', label: 'Date' },
      { key: 'sales', label: 'Sales (PHP)' },
      { key: 'orders', label: 'Orders' },
      { key: 'customers', label: 'Customers' },
    ],
    filename: 'sales-report-2024',
    formats: ['csv', 'pdf'],
    onExport: (format, filename) => {
      console.log(`Sales report exported as ${format}: ${filename}`);
    },
  },
};

export const OrderData: Story = {
  args: {
    data: [
      { orderId: 'ORD-001', customer: 'John Doe', amount: 5000, status: 'Delivered', date: '2024-01-01' },
      { orderId: 'ORD-002', customer: 'Jane Smith', amount: 8500, status: 'Shipped', date: '2024-01-02' },
      { orderId: 'ORD-003', customer: 'Bob Johnson', amount: 3200, status: 'Processing', date: '2024-01-03' },
    ],
    columns: [
      { key: 'orderId', label: 'Order ID' },
      { key: 'customer', label: 'Customer' },
      { key: 'amount', label: 'Amount (PHP)' },
      { key: 'status', label: 'Status' },
      { key: 'date', label: 'Date' },
    ],
    filename: 'orders-export',
    formats: ['csv', 'pdf'],
    onExport: (format, filename) => {
      console.log(`Orders exported as ${format}: ${filename}`);
    },
  },
};

export const WithFormatting: Story = {
  args: {
    data: [
      { id: 1, name: 'Product A', price: 1000, discount: 0.1 },
      { id: 2, name: 'Product B', price: 2000, discount: 0.15 },
    ],
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Name' },
      { key: 'price', label: 'Price', format: (v: number) => `₱${v.toLocaleString()}` },
      { key: 'discount', label: 'Discount', format: (v: number) => `${(v * 100).toFixed(0)}%` },
    ],
    filename: 'formatted-export',
    formats: ['csv', 'pdf'],
    onExport: (format, filename) => {
      console.log(`Formatted data exported as ${format}: ${filename}`);
    },
  },
};

