import type { Meta, StoryObj } from '@storybook/react';
import { AddressManagement } from './address-management';

const meta = {
  title: 'Components/Profile/AddressManagement',
  component: AddressManagement,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AddressManagement>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MultipleAddresses: Story = {
  args: {
    addresses: [
      {
        id: '1',
        label: 'Home',
        street: '123 Main Street',
        city: 'Manila',
        province: 'Metro Manila',
        zipCode: '1000',
        country: 'Philippines',
        phone: '+63 9123456789',
        isDefault: true,
        type: 'home',
      },
      {
        id: '2',
        label: 'Office',
        street: '456 Business Avenue',
        city: 'Makati',
        province: 'Metro Manila',
        zipCode: '1200',
        country: 'Philippines',
        phone: '+63 9987654321',
        isDefault: false,
        type: 'work',
      },
      {
        id: '3',
        label: 'Vacation Home',
        street: '789 Beach Road',
        city: 'Boracay',
        province: 'Aklan',
        zipCode: '5600',
        country: 'Philippines',
        phone: '+63 9111111111',
        isDefault: false,
        type: 'other',
      },
    ],
    onAdd: () => alert('Add address clicked'),
    onEdit: (address) => alert(`Edit ${address.label}`),
    onDelete: async (id) => {
      console.log('Deleting address:', id);
      await new Promise((resolve) => setTimeout(resolve, 500));
    },
    onSetDefault: async (id) => {
      console.log('Setting default address:', id);
      await new Promise((resolve) => setTimeout(resolve, 500));
    },
  },
};

export const SingleAddress: Story = {
  args: {
    addresses: [
      {
        id: '1',
        label: 'Home',
        street: '123 Main Street',
        city: 'Manila',
        province: 'Metro Manila',
        zipCode: '1000',
        country: 'Philippines',
        phone: '+63 9123456789',
        isDefault: true,
        type: 'home',
      },
    ],
    onAdd: () => alert('Add address clicked'),
    onEdit: (address) => alert(`Edit ${address.label}`),
    onDelete: async (id) => {
      console.log('Deleting address:', id);
      await new Promise((resolve) => setTimeout(resolve, 500));
    },
  },
};

export const EmptyAddresses: Story = {
  args: {
    addresses: [],
    onAdd: () => alert('Add address clicked'),
  },
};

export const ReadOnly: Story = {
  args: {
    addresses: [
      {
        id: '1',
        label: 'Home',
        street: '123 Main Street',
        city: 'Manila',
        province: 'Metro Manila',
        zipCode: '1000',
        country: 'Philippines',
        phone: '+63 9123456789',
        isDefault: true,
        type: 'home',
      },
      {
        id: '2',
        label: 'Office',
        street: '456 Business Avenue',
        city: 'Makati',
        province: 'Metro Manila',
        zipCode: '1200',
        country: 'Philippines',
        phone: '+63 9987654321',
        isDefault: false,
        type: 'work',
      },
    ],
  },
};

export const WorkAddresses: Story = {
  args: {
    addresses: [
      {
        id: '1',
        label: 'Main Office',
        street: '100 Corporate Plaza',
        city: 'Makati',
        province: 'Metro Manila',
        zipCode: '1200',
        country: 'Philippines',
        phone: '+63 9111111111',
        isDefault: true,
        type: 'work',
      },
      {
        id: '2',
        label: 'Branch Office',
        street: '200 Business Hub',
        city: 'Cebu',
        province: 'Cebu',
        zipCode: '6000',
        country: 'Philippines',
        phone: '+63 9222222222',
        isDefault: false,
        type: 'work',
      },
    ],
    onAdd: () => alert('Add address clicked'),
    onEdit: (address) => alert(`Edit ${address.label}`),
    onDelete: async (id) => {
      console.log('Deleting address:', id);
      await new Promise((resolve) => setTimeout(resolve, 500));
    },
    onSetDefault: async (id) => {
      console.log('Setting default address:', id);
      await new Promise((resolve) => setTimeout(resolve, 500));
    },
  },
};

export const MixedTypes: Story = {
  args: {
    addresses: [
      {
        id: '1',
        label: 'Home',
        street: '123 Residential St',
        city: 'Manila',
        province: 'Metro Manila',
        zipCode: '1000',
        country: 'Philippines',
        phone: '+63 9123456789',
        isDefault: true,
        type: 'home',
      },
      {
        id: '2',
        label: 'Work',
        street: '456 Corporate Ave',
        city: 'Makati',
        province: 'Metro Manila',
        zipCode: '1200',
        country: 'Philippines',
        phone: '+63 9987654321',
        isDefault: false,
        type: 'work',
      },
      {
        id: '3',
        label: 'Gym',
        street: '789 Fitness Center',
        city: 'Quezon City',
        province: 'Metro Manila',
        zipCode: '1100',
        country: 'Philippines',
        phone: '+63 9111111111',
        isDefault: false,
        type: 'other',
      },
    ],
    onAdd: () => alert('Add address clicked'),
    onEdit: (address) => alert(`Edit ${address.label}`),
    onDelete: async (id) => {
      console.log('Deleting address:', id);
      await new Promise((resolve) => setTimeout(resolve, 500));
    },
    onSetDefault: async (id) => {
      console.log('Setting default address:', id);
      await new Promise((resolve) => setTimeout(resolve, 500));
    },
  },
};

