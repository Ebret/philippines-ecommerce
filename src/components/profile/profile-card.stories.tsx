import type { Meta, StoryObj } from '@storybook/react';
import { ProfileCard } from './profile-card';

const meta = {
  title: 'Components/Profile/ProfileCard',
  component: ProfileCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ProfileCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CustomerProfile: Story = {
  args: {
    profile: {
      id: '1',
      name: 'Maria Santos',
      email: 'maria@example.com',
      phone: '+63 9123456789',
      role: 'customer',
      joinDate: new Date('2023-01-15'),
      totalOrders: 15,
      totalSpent: 50000,
      rating: 4.5,
      verified: true,
      status: 'active',
    },
    onEdit: () => alert('Edit clicked'),
    onMessage: () => alert('Message clicked'),
    onFollow: () => alert('Follow clicked'),
    isFollowing: false,
  },
};

export const VendorProfile: Story = {
  args: {
    profile: {
      id: '2',
      name: 'Juan Dela Cruz',
      email: 'juan@vendor.com',
      phone: '+63 9987654321',
      role: 'vendor',
      joinDate: new Date('2022-06-20'),
      totalOrders: 250,
      totalSpent: 500000,
      rating: 4.8,
      verified: true,
      status: 'active',
    },
    onMessage: () => alert('Message clicked'),
    onFollow: () => alert('Follow clicked'),
    isFollowing: true,
  },
};

export const AdminProfile: Story = {
  args: {
    profile: {
      id: '3',
      name: 'Admin User',
      email: 'admin@platform.com',
      role: 'admin',
      joinDate: new Date('2021-01-01'),
      verified: true,
      status: 'active',
    },
    onEdit: () => alert('Edit clicked'),
  },
};

export const InactiveProfile: Story = {
  args: {
    profile: {
      id: '4',
      name: 'Inactive User',
      email: 'inactive@example.com',
      role: 'customer',
      joinDate: new Date('2023-12-01'),
      totalOrders: 2,
      totalSpent: 5000,
      rating: 3.0,
      verified: false,
      status: 'inactive',
    },
  },
};

export const SuspendedProfile: Story = {
  args: {
    profile: {
      id: '5',
      name: 'Suspended User',
      email: 'suspended@example.com',
      role: 'customer',
      joinDate: new Date('2023-06-15'),
      totalOrders: 8,
      totalSpent: 25000,
      rating: 2.0,
      verified: true,
      status: 'suspended',
    },
  },
};

export const WithoutStats: Story = {
  args: {
    profile: {
      id: '6',
      name: 'New User',
      email: 'newuser@example.com',
      role: 'customer',
      joinDate: new Date(),
      verified: false,
      status: 'active',
    },
    onEdit: () => alert('Edit clicked'),
  },
};

export const FollowingProfile: Story = {
  args: {
    profile: {
      id: '7',
      name: 'Popular Vendor',
      email: 'popular@vendor.com',
      phone: '+63 9111111111',
      role: 'vendor',
      joinDate: new Date('2022-01-01'),
      totalOrders: 500,
      totalSpent: 1000000,
      rating: 4.9,
      verified: true,
      status: 'active',
    },
    onFollow: () => alert('Unfollow clicked'),
    isFollowing: true,
  },
};

