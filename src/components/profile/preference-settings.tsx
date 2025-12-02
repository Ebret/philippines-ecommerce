'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export interface UserPreferences {
  language: 'en' | 'tl' | 'fil';
  currency: 'PHP' | 'USD';
  theme: 'light' | 'dark' | 'auto';
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
  productRecommendations: boolean;
  orderUpdates: boolean;
  promotionalOffers: boolean;
  privacyLevel: 'public' | 'friends' | 'private';
}

interface PreferenceSettingsProps {
  preferences: UserPreferences;
  onSave: (preferences: UserPreferences) => Promise<void>;
  isLoading?: boolean;
  className?: string;
}

export const PreferenceSettings: React.FC<PreferenceSettingsProps> = ({
  preferences,
  onSave,
  isLoading = false,
  className,
}) => {
  const [settings, setSettings] = useState<UserPreferences>(preferences);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleToggle = (key: keyof UserPreferences) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    setSaveSuccess(false);
  };

  const handleSelectChange = (
    key: keyof UserPreferences,
    value: string
  ) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
    setSaveSuccess(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(settings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={cn('bg-card text-card-foreground rounded-lg shadow-md border border-border p-6 space-y-6', className)}>
      <h2 className="text-2xl font-bold text-foreground">Preferences</h2>

      {saveSuccess && (
        <div className="bg-success/10 border border-success/30 text-success px-4 py-3 rounded-lg">
          ✓ Preferences saved successfully
        </div>
      )}

      {/* Display Settings */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Display Settings
        </h3>
        <div className="space-y-4">
          {/* Language */}
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-foreground">Language</label>
              <p className="text-sm text-muted-foreground">Choose your preferred language</p>
            </div>
            <select
              value={settings.language}
              onChange={(e) =>
                handleSelectChange('language', e.target.value)
              }
              disabled={isSaving || isLoading}
              className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="en">English</option>
              <option value="tl">Tagalog</option>
              <option value="fil">Filipino</option>
            </select>
          </div>

          {/* Currency */}
          <div className="flex items-center justify-between border-t border-border pt-4">
            <div>
              <label className="font-medium text-foreground">Currency</label>
              <p className="text-sm text-muted-foreground">Choose your preferred currency</p>
            </div>
            <select
              value={settings.currency}
              onChange={(e) =>
                handleSelectChange('currency', e.target.value)
              }
              disabled={isSaving || isLoading}
              className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="PHP">Philippine Peso (₱)</option>
              <option value="USD">US Dollar ($)</option>
            </select>
          </div>

          {/* Theme */}
          <div className="flex items-center justify-between border-t border-border pt-4">
            <div>
              <label className="font-medium text-foreground">Theme</label>
              <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
            </div>
            <select
              value={settings.theme}
              onChange={(e) => handleSelectChange('theme', e.target.value)}
              disabled={isSaving || isLoading}
              className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Notification Settings
        </h3>
        <div className="space-y-3">
          {[
            {
              key: 'emailNotifications' as const,
              label: 'Email Notifications',
              description: 'Receive notifications via email',
            },
            {
              key: 'pushNotifications' as const,
              label: 'Push Notifications',
              description: 'Receive push notifications on your device',
            },
            {
              key: 'smsNotifications' as const,
              label: 'SMS Notifications',
              description: 'Receive notifications via SMS',
            },
            {
              key: 'orderUpdates' as const,
              label: 'Order Updates',
              description: 'Get notified about your order status',
            },
            {
              key: 'productRecommendations' as const,
              label: 'Product Recommendations',
              description: 'Receive personalized product recommendations',
            },
          ].map(({ key, label, description }) => (
            <div
              key={key}
              className="flex items-center justify-between border-b border-border pb-3 last:border-b-0"
            >
              <div>
                <label className="font-medium text-foreground">{label}</label>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
              <button
                onClick={() => handleToggle(key)}
                disabled={isSaving || isLoading}
                className={cn(
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  settings[key]
                    ? 'bg-primary'
                    : 'bg-muted'
                )}
              >
                <span
                  className={cn(
                    'inline-block h-4 w-4 transform rounded-full bg-card transition-transform shadow-sm',
                    settings[key] ? 'translate-x-6' : 'translate-x-1'
                  )}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Marketing Settings */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Marketing Settings
        </h3>
        <div className="space-y-3">
          {[
            {
              key: 'marketingEmails' as const,
              label: 'Marketing Emails',
              description: 'Receive marketing emails and newsletters',
            },
            {
              key: 'promotionalOffers' as const,
              label: 'Promotional Offers',
              description: 'Get notified about special deals and promotions',
            },
          ].map(({ key, label, description }) => (
            <div
              key={key}
              className="flex items-center justify-between border-b border-border pb-3 last:border-b-0"
            >
              <div>
                <label className="font-medium text-foreground">{label}</label>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
              <button
                onClick={() => handleToggle(key)}
                disabled={isSaving || isLoading}
                className={cn(
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  settings[key]
                    ? 'bg-primary'
                    : 'bg-muted'
                )}
              >
                <span
                  className={cn(
                    'inline-block h-4 w-4 transform rounded-full bg-card transition-transform shadow-sm',
                    settings[key] ? 'translate-x-6' : 'translate-x-1'
                  )}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy Settings */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Privacy Settings
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <label className="font-medium text-foreground">Privacy Level</label>
            <p className="text-sm text-muted-foreground">Control who can see your profile</p>
          </div>
          <select
            value={settings.privacyLevel}
            onChange={(e) =>
              handleSelectChange('privacyLevel', e.target.value)
            }
            disabled={isSaving || isLoading}
            className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="public">Public</option>
            <option value="friends">Friends Only</option>
            <option value="private">Private</option>
          </select>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex gap-3 pt-4 border-t border-border">
        <button
          onClick={handleSave}
          disabled={isSaving || isLoading}
          className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:bg-primary-dark disabled:opacity-50 transition-colors"
        >
          {isSaving || isLoading ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>
    </div>
  );
};

