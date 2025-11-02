import type { Meta, StoryObj } from '@storybook/react';
import { CartItem } from './cart-item';

const meta = {
  title: 'Cart/CartItem',
  component: CartItem,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CartItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: '1',
    productId: 'prod-1',
    title: 'Premium Wireless Headphones',
    price: 2499,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
    quantity: 1,
    vendor: {
      name: 'TechStore PH',
      id: 'vendor-1',
    },
  },
};

export const WithQuantity: Story = {
  args: {
    ...Default.args,
    quantity: 3,
  },
};

export const WithCallbacks: Story = {
  args: {
    ...Default.args,
    onQuantityChange: (qty) => console.log('Quantity changed to:', qty),
    onRemove: () => console.log('Item removed'),
  },
};

export const MaxQuantity: Story = {
  args: {
    ...Default.args,
    quantity: 5,
    maxQuantity: 5,
  },
};

