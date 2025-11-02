import type { Meta, StoryObj } from '@storybook/react';
import { PaymentMethod } from './payment-method';

const meta = {
  title: 'Checkout/PaymentMethod',
  component: PaymentMethod,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PaymentMethod>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onSelect: (method) => console.log('Selected payment method:', method),
  },
};

export const GCashSelected: Story = {
  args: {
    selectedMethod: 'gcash',
    onSelect: (method) => console.log('Selected payment method:', method),
  },
};

export const PayMayaSelected: Story = {
  args: {
    selectedMethod: 'paymaya',
    onSelect: (method) => console.log('Selected payment method:', method),
  },
};

export const CreditCardSelected: Story = {
  args: {
    selectedMethod: 'credit_card',
    onSelect: (method) => console.log('Selected payment method:', method),
  },
};

export const CODSelected: Story = {
  args: {
    selectedMethod: 'cod',
    onSelect: (method) => console.log('Selected payment method:', method),
  },
};

