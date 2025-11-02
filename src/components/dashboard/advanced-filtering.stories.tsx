import type { Meta, StoryObj } from '@storybook/react';
import { AdvancedFiltering } from './advanced-filtering';

const meta = {
  title: 'Components/Dashboard/AdvancedFiltering',
  component: AdvancedFiltering,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AdvancedFiltering>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockProductFields = [
  { key: 'name', label: 'Product Name', type: 'text' as const, placeholder: 'Enter product name' },
  { key: 'category', label: 'Category', type: 'select' as const, options: [
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'books', label: 'Books' },
    { value: 'home', label: 'Home & Garden' },
  ]},
  { key: 'price', label: 'Price', type: 'number' as const, placeholder: 'Enter price' },
  { key: 'quantity', label: 'Quantity', type: 'number' as const, placeholder: 'Enter quantity' },
  { key: 'date', label: 'Date', type: 'date' as const },
];

export const Default: Story = {
  args: {
    fields: mockProductFields,
    onApplyFilters: (filters) => {
      console.log('Applied filters:', filters);
    },
    onClearFilters: () => {
      console.log('Filters cleared');
    },
  },
};

export const TextFilters: Story = {
  args: {
    fields: [
      { key: 'name', label: 'Product Name', type: 'text' as const },
      { key: 'description', label: 'Description', type: 'text' as const },
      { key: 'sku', label: 'SKU', type: 'text' as const },
    ],
    onApplyFilters: (filters) => {
      console.log('Text filters applied:', filters);
    },
  },
};

export const NumberFilters: Story = {
  args: {
    fields: [
      { key: 'price', label: 'Price', type: 'number' as const },
      { key: 'quantity', label: 'Quantity', type: 'number' as const },
      { key: 'rating', label: 'Rating', type: 'number' as const },
    ],
    onApplyFilters: (filters) => {
      console.log('Number filters applied:', filters);
    },
  },
};

export const SelectFilters: Story = {
  args: {
    fields: [
      { key: 'category', label: 'Category', type: 'select' as const, options: [
        { value: 'electronics', label: 'Electronics' },
        { value: 'clothing', label: 'Clothing' },
        { value: 'books', label: 'Books' },
      ]},
      { key: 'status', label: 'Status', type: 'select' as const, options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'archived', label: 'Archived' },
      ]},
    ],
    onApplyFilters: (filters) => {
      console.log('Select filters applied:', filters);
    },
  },
};

export const DateFilters: Story = {
  args: {
    fields: [
      { key: 'createdDate', label: 'Created Date', type: 'date' as const },
      { key: 'modifiedDate', label: 'Modified Date', type: 'date' as const },
      { key: 'publishDate', label: 'Publish Date', type: 'date' as const },
    ],
    onApplyFilters: (filters) => {
      console.log('Date filters applied:', filters);
    },
  },
};

export const RangeFilters: Story = {
  args: {
    fields: [
      { key: 'priceRange', label: 'Price Range', type: 'range' as const },
      { key: 'quantityRange', label: 'Quantity Range', type: 'range' as const },
    ],
    onApplyFilters: (filters) => {
      console.log('Range filters applied:', filters);
    },
  },
};

export const MixedFilters: Story = {
  args: {
    fields: mockProductFields,
    onApplyFilters: (filters) => {
      console.log('Mixed filters applied:', filters);
    },
    onClearFilters: () => {
      console.log('Filters cleared');
    },
  },
};

export const OrderFilters: Story = {
  args: {
    fields: [
      { key: 'orderId', label: 'Order ID', type: 'text' as const },
      { key: 'customer', label: 'Customer', type: 'text' as const },
      { key: 'status', label: 'Status', type: 'select' as const, options: [
        { value: 'pending', label: 'Pending' },
        { value: 'processing', label: 'Processing' },
        { value: 'shipped', label: 'Shipped' },
        { value: 'delivered', label: 'Delivered' },
        { value: 'cancelled', label: 'Cancelled' },
      ]},
      { key: 'amount', label: 'Amount', type: 'number' as const },
      { key: 'orderDate', label: 'Order Date', type: 'date' as const },
    ],
    onApplyFilters: (filters) => {
      console.log('Order filters applied:', filters);
    },
    onClearFilters: () => {
      console.log('Order filters cleared');
    },
  },
};

export const VendorFilters: Story = {
  args: {
    fields: [
      { key: 'vendorName', label: 'Vendor Name', type: 'text' as const },
      { key: 'status', label: 'Status', type: 'select' as const, options: [
        { value: 'active', label: 'Active' },
        { value: 'pending', label: 'Pending' },
        { value: 'suspended', label: 'Suspended' },
      ]},
      { key: 'rating', label: 'Rating', type: 'number' as const },
      { key: 'joinDate', label: 'Join Date', type: 'date' as const },
    ],
    onApplyFilters: (filters) => {
      console.log('Vendor filters applied:', filters);
    },
  },
};

export const Disabled: Story = {
  args: {
    fields: mockProductFields,
    onApplyFilters: (filters) => {
      console.log('Applied filters:', filters);
    },
    disabled: true,
  },
};

export const NoFields: Story = {
  args: {
    fields: [],
    onApplyFilters: (filters) => {
      console.log('Applied filters:', filters);
    },
  },
};

