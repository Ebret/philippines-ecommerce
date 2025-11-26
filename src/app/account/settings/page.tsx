'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/navbar';

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    orderUpdates: true,
    promotions: true,
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to change password');
      }

      setSuccess('Password changed successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handlePreferencesChange = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users/preferences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) throw new Error('Failed to update preferences');
      setSuccess('Preferences updated successfully');
    } catch (err) {
      setError('Failed to update preferences');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-white dark:bg-neutral-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-neutral-600 dark:text-neutral-400">Loading your settings...</p>
            </div>
          </div>
        </div>
      </div>
      </>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white dark:bg-neutral-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Account Settings</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">Manage your account security and preferences</p>
        </div>

        {/* Navigation */}
        <div className="mb-8 flex gap-4 border-b border-neutral-200 dark:border-neutral-700">
          <Link href="/account/profile" className="px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white">
            Profile
          </Link>
          <Link href="/account/orders" className="px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white">
            Orders
          </Link>
          <Link href="/account/addresses" className="px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white">
            Addresses
          </Link>
          <Link href="/account/settings" className="px-4 py-2 border-b-2 border-primary-600 text-primary-600 dark:text-primary-400 font-medium">
            Settings
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="text-error-600 dark:text-error-400 mt-0.5">❌</div>
              <div className="flex-1">
                <p className="text-error-800 dark:text-error-400 font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="text-success-600 dark:text-success-400 mt-0.5">✅</div>
              <div className="flex-1">
                <p className="text-success-800 dark:text-success-400 font-medium">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Change Password Section */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md border border-neutral-200 dark:border-neutral-700 p-8 mb-6">
          <h2 className="text-xl font-semibold mb-6 text-neutral-900 dark:text-white">Change Password</h2>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Current Password</label>
              <input
                type="password"
                required
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="mt-1 w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">New Password</label>
              <input
                type="password"
                required
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="mt-1 w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">At least 8 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Confirm New Password</label>
              <input
                type="password"
                required
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="mt-1 w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 dark:from-primary-500 dark:to-primary-600 dark:hover:from-primary-600 dark:hover:to-primary-700 text-white py-2 px-4 rounded-lg font-medium disabled:opacity-50 transition-all duration-200"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>

        {/* Notification Preferences Section */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md border border-neutral-200 dark:border-neutral-700 p-8 mb-6">
          <h2 className="text-xl font-semibold mb-6 text-neutral-900 dark:text-white">Notification Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={preferences.emailNotifications}
                onChange={(e) => setPreferences({ ...preferences, emailNotifications: e.target.checked })}
                className="h-4 w-4 text-primary-600 rounded"
              />
              <label className="ml-3 text-sm text-neutral-700 dark:text-neutral-300">
                Email Notifications
                <p className="text-xs text-neutral-600 dark:text-neutral-400">Receive updates via email</p>
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={preferences.smsNotifications}
                onChange={(e) => setPreferences({ ...preferences, smsNotifications: e.target.checked })}
                className="h-4 w-4 text-primary-600 rounded"
              />
              <label className="ml-3 text-sm text-neutral-700 dark:text-neutral-300">
                SMS Notifications
                <p className="text-xs text-neutral-600 dark:text-neutral-400">Receive updates via SMS</p>
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={preferences.orderUpdates}
                onChange={(e) => setPreferences({ ...preferences, orderUpdates: e.target.checked })}
                className="h-4 w-4 text-primary-600 rounded"
              />
              <label className="ml-3 text-sm text-neutral-700 dark:text-neutral-300">
                Order Updates
                <p className="text-xs text-neutral-600 dark:text-neutral-400">Get notified about order status changes</p>
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={preferences.promotions}
                onChange={(e) => setPreferences({ ...preferences, promotions: e.target.checked })}
                className="h-4 w-4 text-primary-600 rounded"
              />
              <label className="ml-3 text-sm text-neutral-700 dark:text-neutral-300">
                Promotions & Offers
                <p className="text-xs text-neutral-600 dark:text-neutral-400">Receive promotional emails and special offers</p>
              </label>
            </div>

            <button
              onClick={handlePreferencesChange}
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 dark:from-primary-500 dark:to-primary-600 dark:hover:from-primary-600 dark:hover:to-primary-700 text-white py-2 px-4 rounded-lg font-medium disabled:opacity-50 mt-6 transition-all duration-200"
            >
              {loading ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </div>

        {/* Logout Section */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md border border-neutral-200 dark:border-neutral-700 p-8">
          <h2 className="text-xl font-semibold mb-4 text-neutral-900 dark:text-white">Session</h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">Logged in as {session.user?.email}</p>
          <button
            onClick={() => signOut({ redirect: true, callbackUrl: '/' })}
            className="w-full bg-gradient-to-r from-error-600 to-error-700 hover:from-error-700 hover:to-error-800 dark:from-error-500 dark:to-error-600 dark:hover:from-error-600 dark:hover:to-error-700 text-white py-2 px-4 rounded-lg font-medium transition-all duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
    </>
  );
}

