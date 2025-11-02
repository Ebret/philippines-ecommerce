import type { Meta, StoryObj } from '@storybook/react';
import { AccountSecurity } from './account-security';

const meta = {
  title: 'Components/Profile/AccountSecurity',
  component: AccountSecurity,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AccountSecurity>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Secure: Story = {
  args: {
    settings: {
      twoFactorEnabled: true,
      lastPasswordChange: new Date('2024-10-01'),
      activeSessions: 1,
      loginAttempts: 0,
      trustedDevices: [
        {
          id: '1',
          name: 'Chrome on Windows',
          lastUsed: new Date('2024-11-02'),
        },
        {
          id: '2',
          name: 'Safari on iPhone',
          lastUsed: new Date('2024-11-01'),
        },
      ],
    },
    onChangePassword: () => alert('Change password clicked'),
    onDisable2FA: () => alert('Disable 2FA clicked'),
    onLogoutAllSessions: async () => {
      console.log('Logging out all sessions');
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
    onRemoveTrustedDevice: async (id) => {
      console.log('Removing device:', id);
      await new Promise((resolve) => setTimeout(resolve, 500));
    },
  },
};

export const NotSecure: Story = {
  args: {
    settings: {
      twoFactorEnabled: false,
      lastPasswordChange: new Date('2023-01-01'),
      activeSessions: 5,
      loginAttempts: 8,
      trustedDevices: [],
    },
    onChangePassword: () => alert('Change password clicked'),
    onEnable2FA: () => alert('Enable 2FA clicked'),
    onLogoutAllSessions: async () => {
      console.log('Logging out all sessions');
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
  },
};

export const With2FA: Story = {
  args: {
    settings: {
      twoFactorEnabled: true,
      lastPasswordChange: new Date('2024-09-15'),
      activeSessions: 2,
      loginAttempts: 0,
      trustedDevices: [
        {
          id: '1',
          name: 'Chrome on Windows',
          lastUsed: new Date('2024-11-02'),
        },
      ],
    },
    onChangePassword: () => alert('Change password clicked'),
    onDisable2FA: () => alert('Disable 2FA clicked'),
    onLogoutAllSessions: async () => {
      console.log('Logging out all sessions');
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
    onRemoveTrustedDevice: async (id) => {
      console.log('Removing device:', id);
      await new Promise((resolve) => setTimeout(resolve, 500));
    },
  },
};

export const Without2FA: Story = {
  args: {
    settings: {
      twoFactorEnabled: false,
      lastPasswordChange: new Date('2024-08-20'),
      activeSessions: 1,
      loginAttempts: 0,
      trustedDevices: [
        {
          id: '1',
          name: 'Firefox on Linux',
          lastUsed: new Date('2024-11-02'),
        },
      ],
    },
    onChangePassword: () => alert('Change password clicked'),
    onEnable2FA: () => alert('Enable 2FA clicked'),
    onLogoutAllSessions: async () => {
      console.log('Logging out all sessions');
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
    onRemoveTrustedDevice: async (id) => {
      console.log('Removing device:', id);
      await new Promise((resolve) => setTimeout(resolve, 500));
    },
  },
};

export const MultipleSessions: Story = {
  args: {
    settings: {
      twoFactorEnabled: true,
      lastPasswordChange: new Date('2024-10-01'),
      activeSessions: 4,
      loginAttempts: 0,
      trustedDevices: [
        {
          id: '1',
          name: 'Chrome on Windows',
          lastUsed: new Date('2024-11-02'),
        },
        {
          id: '2',
          name: 'Safari on iPhone',
          lastUsed: new Date('2024-11-02'),
        },
        {
          id: '3',
          name: 'Chrome on MacBook',
          lastUsed: new Date('2024-11-01'),
        },
        {
          id: '4',
          name: 'Firefox on Linux',
          lastUsed: new Date('2024-10-31'),
        },
      ],
    },
    onChangePassword: () => alert('Change password clicked'),
    onDisable2FA: () => alert('Disable 2FA clicked'),
    onLogoutAllSessions: async () => {
      console.log('Logging out all sessions');
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
    onRemoveTrustedDevice: async (id) => {
      console.log('Removing device:', id);
      await new Promise((resolve) => setTimeout(resolve, 500));
    },
  },
};

export const SuspiciousActivity: Story = {
  args: {
    settings: {
      twoFactorEnabled: false,
      lastPasswordChange: new Date('2024-06-01'),
      activeSessions: 3,
      loginAttempts: 5,
      trustedDevices: [
        {
          id: '1',
          name: 'Unknown Device',
          lastUsed: new Date('2024-11-02'),
        },
      ],
    },
    onChangePassword: () => alert('Change password clicked'),
    onEnable2FA: () => alert('Enable 2FA clicked'),
    onLogoutAllSessions: async () => {
      console.log('Logging out all sessions');
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
    onRemoveTrustedDevice: async (id) => {
      console.log('Removing device:', id);
      await new Promise((resolve) => setTimeout(resolve, 500));
    },
  },
};

export const ReadOnly: Story = {
  args: {
    settings: {
      twoFactorEnabled: true,
      lastPasswordChange: new Date('2024-10-01'),
      activeSessions: 1,
      loginAttempts: 0,
      trustedDevices: [
        {
          id: '1',
          name: 'Chrome on Windows',
          lastUsed: new Date('2024-11-02'),
        },
      ],
    },
  },
};

