import type { Meta, StoryObj } from '@storybook/react';
import { ProfileEditForm } from './profile-edit-form';

const meta = {
  title: 'Components/Profile/ProfileEditForm',
  component: ProfileEditForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ProfileEditForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    initialData: {
      name: 'Maria Santos',
      email: 'maria@example.com',
      phone: '+63 9123456789',
      bio: 'I love shopping online',
      gender: 'female',
      dateOfBirth: '1990-05-15',
      address: '123 Main Street',
      city: 'Manila',
      province: 'Metro Manila',
      zipCode: '1000',
    },
    onSubmit: async (data) => {
      console.log('Form submitted:', data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
    onCancel: () => alert('Cancelled'),
  },
};

export const EmptyForm: Story = {
  args: {
    initialData: {
      name: '',
      email: '',
    },
    onSubmit: async (data) => {
      console.log('Form submitted:', data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
    onCancel: () => alert('Cancelled'),
  },
};

export const WithoutCancel: Story = {
  args: {
    initialData: {
      name: 'Juan Dela Cruz',
      email: 'juan@example.com',
      phone: '+63 9987654321',
      bio: 'Vendor profile',
      gender: 'male',
      address: '456 Business Ave',
      city: 'Cebu',
      province: 'Cebu',
      zipCode: '6000',
    },
    onSubmit: async (data) => {
      console.log('Form submitted:', data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
  },
};

export const Loading: Story = {
  args: {
    initialData: {
      name: 'Maria Santos',
      email: 'maria@example.com',
      phone: '+63 9123456789',
    },
    onSubmit: async (data) => {
      console.log('Form submitted:', data);
      await new Promise((resolve) => setTimeout(resolve, 3000));
    },
    isLoading: true,
  },
};

export const WithAllFields: Story = {
  args: {
    initialData: {
      name: 'Complete Profile',
      email: 'complete@example.com',
      phone: '+63 9111111111',
      bio: 'This is a complete profile with all fields filled',
      gender: 'female',
      dateOfBirth: '1985-03-20',
      address: '789 Complete Street',
      city: 'Davao',
      province: 'Davao del Sur',
      zipCode: '8000',
    },
    onSubmit: async (data) => {
      console.log('Form submitted:', data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
    onCancel: () => alert('Cancelled'),
  },
};

export const MaleProfile: Story = {
  args: {
    initialData: {
      name: 'John Smith',
      email: 'john@example.com',
      phone: '+63 9222222222',
      gender: 'male',
      dateOfBirth: '1988-07-10',
      address: '321 Male Street',
      city: 'Quezon City',
      province: 'Metro Manila',
      zipCode: '1100',
    },
    onSubmit: async (data) => {
      console.log('Form submitted:', data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
    onCancel: () => alert('Cancelled'),
  },
};

export const OtherGender: Story = {
  args: {
    initialData: {
      name: 'Alex Johnson',
      email: 'alex@example.com',
      phone: '+63 9333333333',
      gender: 'other',
      address: '654 Other Street',
      city: 'Makati',
      province: 'Metro Manila',
      zipCode: '1200',
    },
    onSubmit: async (data) => {
      console.log('Form submitted:', data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
    onCancel: () => alert('Cancelled'),
  },
};

