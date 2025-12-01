'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/navbar';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    bio: '',
    gender: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.email) {
      fetchProfile();
    }
  }, [session]);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/users/profile');
      if (!response.ok) throw new Error('Failed to fetch profile');
      const data = await response.json();
      setProfile(data);
      if (data.profile) {
        setFormData({
          firstName: data.profile.firstName || '',
          lastName: data.profile.lastName || '',
          phone: data.profile.phone || '',
          bio: data.profile.bio || '',
          gender: data.profile.gender || '',
        });
      }
    } catch (err) {
      setError('Failed to load profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to update profile');
      
      await fetchProfile();
      setIsEditing(false);
      alert('Profile updated successfully');
    } catch (err) {
      setError('Failed to update profile');
      console.error(err);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-center min-h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading your profile...</p>
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
      <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-primary">My Profile</h1>
          <p className="text-muted-foreground mt-2">Manage your account information</p>
        </div>

        {/* Navigation */}
        <div className="mb-8 flex gap-4 border-b border-border">
          <Link href="/account/profile" className="px-4 py-2 border-b-2 border-primary text-primary font-medium">
            Profile
          </Link>
          <Link href="/account/orders" className="px-4 py-2 text-muted-foreground hover:text-foreground">
            Orders
          </Link>
          <Link href="/account/addresses" className="px-4 py-2 text-muted-foreground hover:text-foreground">
            Addresses
          </Link>
          <Link href="/account/settings" className="px-4 py-2 text-muted-foreground hover:text-foreground">
            Settings
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-warning/10 border border-warning/20 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="text-warning mt-0.5">⚠️</div>
              <div className="flex-1">
                <p className="text-warning font-medium">{error}</p>
                <button
                  onClick={() => {
                    setError('');
                    fetchProfile();
                  }}
                  className="mt-2 text-sm text-warning hover:underline"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-card rounded-xl shadow-md border border-border p-8">
          {!isEditing ? (
            <>
              <div className="space-y-6">
                <div>
                  <label className="block font-serif text-sm font-medium text-muted-foreground">Email</label>
                  <p className="mt-1 text-foreground">{profile?.email}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-serif text-sm font-medium text-muted-foreground">First Name</label>
                    <p className="mt-1 text-foreground">{profile?.profile?.firstName || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="block font-serif text-sm font-medium text-muted-foreground">Last Name</label>
                    <p className="mt-1 text-foreground">{profile?.profile?.lastName || 'Not set'}</p>
                  </div>
                </div>

                <div>
                  <label className="block font-serif text-sm font-medium text-muted-foreground">Phone</label>
                  <p className="mt-1 text-foreground">{profile?.profile?.phone || 'Not set'}</p>
                </div>

                <div>
                  <label className="block font-serif text-sm font-medium text-muted-foreground">Bio</label>
                  <p className="mt-1 text-foreground">{profile?.profile?.bio || 'Not set'}</p>
                </div>

                <div>
                  <label className="block font-serif text-sm font-medium text-muted-foreground">Account Status</label>
                  <p className="mt-1">
                    <span className="inline-block px-3 py-1 bg-success/10 text-success rounded-full text-sm font-medium">
                      {profile?.status}
                    </span>
                  </p>
                </div>

                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-4 rounded-full font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Edit Profile
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-serif text-sm font-medium text-foreground">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block font-serif text-sm font-medium text-foreground">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block font-serif text-sm font-medium text-foreground">Phone</label>
                <input
                  type="tel"
                  placeholder="09XXXXXXXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-1 w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block font-serif text-sm font-medium text-foreground">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                  className="mt-1 w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-4 rounded-full font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-muted text-foreground py-2 px-4 rounded-full hover:bg-muted/80 font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
    </>
  );
}

