'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

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
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account security and preferences</p>
        </div>

        {/* Navigation */}
        <div className="mb-8 flex gap-4 border-b border-gray-200">
          <Link href="/account/profile" className="px-4 py-2 text-gray-600 hover:text-gray-900">
            Profile
          </Link>
          <Link href="/account/orders" className="px-4 py-2 text-gray-600 hover:text-gray-900">
            Orders
          </Link>
          <Link href="/account/addresses" className="px-4 py-2 text-gray-600 hover:text-gray-900">
            Addresses
          </Link>
          <Link href="/account/settings" className="px-4 py-2 border-b-2 border-green-600 text-green-600 font-medium">
            Settings
          </Link>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            {success}
          </div>
        )}

        {/* Change Password Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-xl font-semibold mb-6">Change Password</h2>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Current Password</label>
              <input
                type="password"
                required
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                required
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <p className="mt-1 text-xs text-gray-600">At least 8 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
              <input
                type="password"
                required
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 font-medium disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>

        {/* Notification Preferences Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={preferences.emailNotifications}
                onChange={(e) => setPreferences({ ...preferences, emailNotifications: e.target.checked })}
                className="h-4 w-4 text-green-600 rounded"
              />
              <label className="ml-3 text-sm text-gray-700">
                Email Notifications
                <p className="text-xs text-gray-600">Receive updates via email</p>
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={preferences.smsNotifications}
                onChange={(e) => setPreferences({ ...preferences, smsNotifications: e.target.checked })}
                className="h-4 w-4 text-green-600 rounded"
              />
              <label className="ml-3 text-sm text-gray-700">
                SMS Notifications
                <p className="text-xs text-gray-600">Receive updates via SMS</p>
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={preferences.orderUpdates}
                onChange={(e) => setPreferences({ ...preferences, orderUpdates: e.target.checked })}
                className="h-4 w-4 text-green-600 rounded"
              />
              <label className="ml-3 text-sm text-gray-700">
                Order Updates
                <p className="text-xs text-gray-600">Get notified about order status changes</p>
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={preferences.promotions}
                onChange={(e) => setPreferences({ ...preferences, promotions: e.target.checked })}
                className="h-4 w-4 text-green-600 rounded"
              />
              <label className="ml-3 text-sm text-gray-700">
                Promotions & Offers
                <p className="text-xs text-gray-600">Receive promotional emails and special offers</p>
              </label>
            </div>

            <button
              onClick={handlePreferencesChange}
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 font-medium disabled:opacity-50 mt-6"
            >
              {loading ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </div>

        {/* Logout Section */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-xl font-semibold mb-4">Session</h2>
          <p className="text-gray-600 mb-4">Logged in as {session.user?.email}</p>
          <button
            onClick={() => signOut({ redirect: true, callbackUrl: '/' })}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

