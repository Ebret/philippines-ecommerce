import type { Meta, StoryObj } from '@storybook/react';
import { ProductGrid } from './product-grid';

const meta = {
  title: 'Products/ProductGrid',
  component: ProductGrid,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ProductGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockProducts = Array.from({ length: 12 }, (_, i) => ({
  id: `${i + 1}`,
  title: `Product ${i + 1}`,
  price: 1000 + i * 500,
  originalPrice: 2000 + i * 500,
  image: `https://images.unsplash.com/photo-${1500000000000 + i}?w=500&h=500&fit=crop`,
  rating: 4 + Math.random(),
  reviewCount: 50 + i * 10,
  vendor: {
    name: `Vendor ${(i % 3) + 1}`,
    id: `vendor-${(i % 3) + 1}`,
  },
  inStock: i % 5 !== 0,
}));

export const Default: Story = {
  args: {
    products: mockProducts,
    columns: 3,
    gap: 'md',
  },
};

export const TwoColumns: Story = {
  args: {
    products: mockProducts,
    columns: 2,
    gap: 'md',
  },
};

export const FourColumns: Story = {
  args: {
    products: mockProducts,
    columns: 4,
    gap: 'md',
  },
};

export const WithPagination: Story = {
  args: {
    products: mockProducts.slice(0, 6),
    columns: 3,
    gap: 'md',
    currentPage: 1,
    totalPages: 3,
    onPageChange: (page) => console.log('Page changed to:', page),
  },
};

export const Loading: Story = {
  args: {
    products: [],
    isLoading: true,
    columns: 3,
    gap: 'md',
  },
};

export const Empty: Story = {
  args: {
    products: [],
    columns: 3,
    gap: 'md',
    emptyMessage: 'No products available',
  },
};

