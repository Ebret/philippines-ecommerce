'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  lastPasswordChange: Date;
  activeSessions: number;
  loginAttempts: number;
  trustedDevices: Array<{
    id: string;
    name: string;
    lastUsed: Date;
  }>;
}

interface AccountSecurityProps {
  settings: SecuritySettings;
  onChangePassword?: () => void;
  onEnable2FA?: () => void;
  onDisable2FA?: () => void;
  onLogoutAllSessions?: () => Promise<void>;
  onRemoveTrustedDevice?: (id: string) => Promise<void>;
  isLoading?: boolean;
  className?: string;
}

export const AccountSecurity: React.FC<AccountSecurityProps> = ({
  settings,
  onChangePassword,
  onEnable2FA,
  onDisable2FA,
  onLogoutAllSessions,
  onRemoveTrustedDevice,
  isLoading = false,
  className,
}) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [removingDeviceId, setRemovingDeviceId] = useState<string | null>(null);

  const handleLogoutAllSessions = async () => {
    if (!onLogoutAllSessions) return;
    setIsLoggingOut(true);
    try {
      await onLogoutAllSessions();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleRemoveDevice = async (id: string) => {
    if (!onRemoveTrustedDevice) return;
    setRemovingDeviceId(id);
    try {
      await onRemoveTrustedDevice(id);
    } finally {
      setRemovingDeviceId(null);
    }
  };

  const lastPasswordChangeDate = new Date(settings.lastPasswordChange).toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className={cn('bg-card text-card-foreground rounded-lg shadow-md border border-border p-6 space-y-6', className)}>
      <h2 className="text-2xl font-bold text-foreground">Account Security</h2>

      {/* Password Section */}
      <div className="border-b border-border pb-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Password</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-foreground">
              Last changed: <span className="font-semibold">{lastPasswordChangeDate}</span>
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Change your password regularly to keep your account secure
            </p>
          </div>
          {onChangePassword && (
            <button
              onClick={onChangePassword}
              disabled={isLoading}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:bg-primary-dark disabled:opacity-50 transition-colors"
            >
              Change Password
            </button>
          )}
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="border-b border-border pb-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Two-Factor Authentication
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'inline-block w-3 h-3 rounded-full',
                  settings.twoFactorEnabled ? 'bg-success' : 'bg-muted'
                )}
              />
              <span className="font-semibold text-foreground">
                {settings.twoFactorEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Add an extra layer of security to your account
            </p>
          </div>
          {settings.twoFactorEnabled ? (
            onDisable2FA && (
              <button
                onClick={onDisable2FA}
                disabled={isLoading}
                className="text-error hover:text-error/80 font-semibold disabled:opacity-50 transition-colors"
              >
                Disable
              </button>
            )
          ) : (
            onEnable2FA && (
              <button
                onClick={onEnable2FA}
                disabled={isLoading}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:bg-primary-dark disabled:opacity-50 transition-colors"
              >
                Enable
              </button>
            )
          )}
        </div>
      </div>

      {/* Active Sessions */}
      <div className="border-b border-border pb-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Active Sessions
        </h3>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-foreground">
              You have <span className="font-semibold">{settings.activeSessions}</span> active session(s)
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Logout from all other sessions for security
            </p>
          </div>
          {onLogoutAllSessions && (
            <button
              onClick={handleLogoutAllSessions}
              disabled={isLoading || isLoggingOut}
              className="text-error hover:text-error/80 font-semibold disabled:opacity-50 transition-colors"
            >
              {isLoggingOut ? 'Logging out...' : 'Logout All'}
            </button>
          )}
        </div>
      </div>

      {/* Login Attempts */}
      <div className="border-b border-border pb-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Login Attempts
        </h3>
        <div className="flex items-center gap-3">
          <span
            className={cn(
              'inline-block w-3 h-3 rounded-full',
              settings.loginAttempts > 3 ? 'bg-error' : 'bg-success'
            )}
          />
          <p className="text-foreground">
            <span className="font-semibold">{settings.loginAttempts}</span> failed login attempt(s) in the last 24 hours
          </p>
        </div>
      </div>

      {/* Trusted Devices */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Trusted Devices
        </h3>
        {settings.trustedDevices.length === 0 ? (
          <p className="text-muted-foreground">No trusted devices</p>
        ) : (
          <div className="space-y-3">
            {settings.trustedDevices.map((device) => {
              const lastUsedDate = new Date(device.lastUsed).toLocaleDateString('en-PH', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              });

              return (
                <div
                  key={device.id}
                  className="flex items-center justify-between border border-border rounded-lg p-4 bg-muted/30"
                >
                  <div>
                    <p className="font-semibold text-foreground">{device.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Last used: {lastUsedDate}
                    </p>
                  </div>
                  {onRemoveTrustedDevice && (
                    <button
                      onClick={() => handleRemoveDevice(device.id)}
                      disabled={isLoading || removingDeviceId === device.id}
                      className="text-error hover:text-error/80 font-semibold text-sm disabled:opacity-50 transition-colors"
                    >
                      {removingDeviceId === device.id ? 'Removing...' : 'Remove'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Security Tips */}
      <div className="bg-info/10 border border-info/30 rounded-lg p-4">
        <h4 className="font-semibold text-info mb-2">Security Tips</h4>
        <ul className="text-sm text-info/90 space-y-1">
          <li>• Use a strong, unique password</li>
          <li>• Enable two-factor authentication</li>
          <li>• Review your active sessions regularly</li>
          <li>• Remove trusted devices you no longer use</li>
          <li>• Never share your password with anyone</li>
        </ul>
      </div>
    </div>
  );
};

