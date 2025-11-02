import type { Meta, StoryObj } from '@storybook/react';
import { PreferenceSettings } from './preference-settings';

const meta = {
  title: 'Components/Profile/PreferenceSettings',
  component: PreferenceSettings,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PreferenceSettings>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    preferences: {
      language: 'en',
      currency: 'PHP',
      theme: 'light',
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      marketingEmails: true,
      productRecommendations: true,
      orderUpdates: true,
      promotionalOffers: false,
      privacyLevel: 'public',
    },
    onSave: async (preferences) => {
      console.log('Preferences saved:', preferences);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
  },
};

export const Tagalog: Story = {
  args: {
    preferences: {
      language: 'tl',
      currency: 'PHP',
      theme: 'light',
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: true,
      marketingEmails: false,
      productRecommendations: true,
      orderUpdates: true,
      promotionalOffers: true,
      privacyLevel: 'friends',
    },
    onSave: async (preferences) => {
      console.log('Preferences saved:', preferences);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
  },
};

export const Filipino: Story = {
  args: {
    preferences: {
      language: 'fil',
      currency: 'PHP',
      theme: 'dark',
      emailNotifications: false,
      pushNotifications: false,
      smsNotifications: false,
      marketingEmails: false,
      productRecommendations: false,
      orderUpdates: true,
      promotionalOffers: false,
      privacyLevel: 'private',
    },
    onSave: async (preferences) => {
      console.log('Preferences saved:', preferences);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
  },
};

export const USD: Story = {
  args: {
    preferences: {
      language: 'en',
      currency: 'USD',
      theme: 'auto',
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: true,
      marketingEmails: true,
      productRecommendations: true,
      orderUpdates: true,
      promotionalOffers: true,
      privacyLevel: 'public',
    },
    onSave: async (preferences) => {
      console.log('Preferences saved:', preferences);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
  },
};

export const DarkTheme: Story = {
  args: {
    preferences: {
      language: 'en',
      currency: 'PHP',
      theme: 'dark',
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: true,
      marketingEmails: true,
      productRecommendations: true,
      orderUpdates: true,
      promotionalOffers: true,
      privacyLevel: 'public',
    },
    onSave: async (preferences) => {
      console.log('Preferences saved:', preferences);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
  },
};

export const AllNotificationsDisabled: Story = {
  args: {
    preferences: {
      language: 'en',
      currency: 'PHP',
      theme: 'light',
      emailNotifications: false,
      pushNotifications: false,
      smsNotifications: false,
      marketingEmails: false,
      productRecommendations: false,
      orderUpdates: false,
      promotionalOffers: false,
      privacyLevel: 'private',
    },
    onSave: async (preferences) => {
      console.log('Preferences saved:', preferences);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
  },
};

export const PrivateProfile: Story = {
  args: {
    preferences: {
      language: 'en',
      currency: 'PHP',
      theme: 'light',
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: true,
      marketingEmails: false,
      productRecommendations: false,
      orderUpdates: true,
      promotionalOffers: false,
      privacyLevel: 'private',
    },
    onSave: async (preferences) => {
      console.log('Preferences saved:', preferences);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
  },
};

export const FriendsOnly: Story = {
  args: {
    preferences: {
      language: 'en',
      currency: 'PHP',
      theme: 'light',
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: true,
      marketingEmails: true,
      productRecommendations: true,
      orderUpdates: true,
      promotionalOffers: true,
      privacyLevel: 'friends',
    },
    onSave: async (preferences) => {
      console.log('Preferences saved:', preferences);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
  },
};

