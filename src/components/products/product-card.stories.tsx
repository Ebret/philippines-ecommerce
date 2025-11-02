import type { Meta, StoryObj } from '@storybook/react';
import { ProductCard } from './product-card';

const meta = {
  title: 'Products/ProductCard',
  component: ProductCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ProductCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockProduct = {
  id: '1',
  title: 'Premium Wireless Headphones',
  price: 2499,
  originalPrice: 3999,
  image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
  imageAlt: 'Wireless Headphones',
  rating: 4.5,
  reviewCount: 128,
  vendor: {
    name: 'TechStore PH',
    id: 'vendor-1',
  },
  inStock: true,
};

export const Default: Story = {
  args: mockProduct,
};

export const WithBadge: Story = {
  args: {
    ...mockProduct,
    badge: {
      label: 'New',
      variant: 'success',
    },
  },
};

export const OutOfStock: Story = {
  args: {
    ...mockProduct,
    inStock: false,
  },
};

export const NoDiscount: Story = {
  args: {
    ...mockProduct,
    originalPrice: undefined,
  },
};

export const WithoutRating: Story = {
  args: {
    ...mockProduct,
    rating: 0,
    reviewCount: 0,
  },
};

export const WithAddToCart: Story = {
  args: {
    ...mockProduct,
    onAddToCart: () => alert('Added to cart!'),
  },
};

