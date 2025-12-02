'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/navbar';
import { BreadcrumbNav } from '@/components/ui/breadcrumb';

const REGIONS = [
  'NCR', 'CAR', 'Ilocos Region', 'Cagayan Valley', 'Central Luzon',
  'CALABARZON', 'Mimaropa', 'Bicol Region', 'Western Visayas', 'Central Visayas',
  'Eastern Visayas', 'Zamboanga Peninsula', 'Northern Mindanao', 'Davao Region',
  'Soccsksargen', 'Caraga', 'Bangsamoro', 'BARMM'
];

export default function AddressesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'SHIPPING',
    recipientName: '',
    phone: '',
    region: '',
    province: '',
    cityMunicipality: '',
    barangay: '',
    streetAddress: '',
    postalCode: '',
    isDefault: false,
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.email) {
      fetchAddresses();
    }
  }, [session]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users/addresses');
      if (!response.ok) throw new Error('Failed to fetch addresses');
      const data = await response.json();
      setAddresses(data.addresses);
    } catch (err) {
      setError('Failed to load addresses');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/users/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to add address');
      
      await fetchAddresses();
      setShowForm(false);
      setFormData({
        type: 'SHIPPING',
        recipientName: '',
        phone: '',
        region: '',
        province: '',
        cityMunicipality: '',
        barangay: '',
        streetAddress: '',
        postalCode: '',
        isDefault: false,
      });
      alert('Address added successfully');
    } catch (err) {
      setError('Failed to add address');
      console.error(err);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading your addresses...</p>
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
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <BreadcrumbNav items={[{ label: 'Account', href: '/account/profile' }, { label: 'Addresses' }]} />

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-primary">My Addresses</h1>
          <p className="text-muted-foreground mt-2">Manage your shipping and billing addresses</p>
        </div>

        {/* Navigation */}
        <div className="mb-8 flex gap-4 border-b border-border">
          <Link href="/account/profile" className="px-4 py-2 text-muted-foreground hover:text-foreground">
            Profile
          </Link>
          <Link href="/account/orders" className="px-4 py-2 text-muted-foreground hover:text-foreground">
            Orders
          </Link>
          <Link href="/account/addresses" className="px-4 py-2 border-b-2 border-primary text-primary font-medium">
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
                    fetchAddresses();
                  }}
                  className="mt-2 text-sm text-warning hover:underline"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Address Button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="mb-6 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-medium transition-all duration-200"
          >
            + Add New Address
          </button>
        )}

        {/* Add Address Form */}
        {showForm && (
          <div className="mb-8 bg-card rounded-xl shadow-md border border-border p-6">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Add New Address</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-serif text-sm font-medium text-foreground">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border border-border rounded-xl bg-white dark:bg-neutral-700 text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="SHIPPING">Shipping</option>
                    <option value="BILLING">Billing</option>
                  </select>
                </div>
                <div>
                  <label className="block font-serif text-sm font-medium text-foreground">Recipient Name</label>
                  <input
                    type="text"
                    required
                    value={formData.recipientName}
                    onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border border-border rounded-xl bg-white dark:bg-neutral-700 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-serif text-sm font-medium text-foreground">Phone</label>
                <input
                  type="tel"
                  placeholder="09XXXXXXXXX"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-1 w-full px-3 py-2 border border-border rounded-xl bg-white dark:bg-neutral-700 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-serif text-sm font-medium text-foreground">Region</label>
                  <select
                    required
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border border-border rounded-xl bg-white dark:bg-neutral-700 text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select Region</option>
                    {REGIONS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-serif text-sm font-medium text-foreground">Province</label>
                  <input
                    type="text"
                    required
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border border-border rounded-xl bg-white dark:bg-neutral-700 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-serif text-sm font-medium text-foreground">City/Municipality</label>
                  <input
                    type="text"
                    required
                    value={formData.cityMunicipality}
                    onChange={(e) => setFormData({ ...formData, cityMunicipality: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border border-border rounded-xl bg-white dark:bg-neutral-700 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block font-serif text-sm font-medium text-foreground">Barangay</label>
                  <input
                    type="text"
                    required
                    value={formData.barangay}
                    onChange={(e) => setFormData({ ...formData, barangay: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border border-border rounded-xl bg-white dark:bg-neutral-700 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-serif text-sm font-medium text-foreground">Street Address</label>
                <input
                  type="text"
                  required
                  value={formData.streetAddress}
                  onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                  className="mt-1 w-full px-3 py-2 border border-border rounded-xl bg-white dark:bg-neutral-700 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block font-serif text-sm font-medium text-foreground">Postal Code</label>
                <input
                  type="text"
                  placeholder="1234"
                  required
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  className="mt-1 w-full px-3 py-2 border border-border rounded-xl bg-white dark:bg-neutral-700 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  className="h-4 w-4 text-primary-600 rounded"
                />
                <label className="ml-2 text-sm text-foreground">Set as default address</label>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-4 rounded-xl font-medium transition-all duration-200"
                >
                  Add Address
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-muted text-foreground py-2 px-4 rounded-xl hover:bg-neutral-300 dark:hover:bg-neutral-600 font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Addresses List */}
        {addresses.length === 0 ? (
          <div className="bg-card rounded-xl shadow-md border border-border p-8 text-center">
            <p className="text-muted-foreground">No addresses saved yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((address) => (
              <div key={address.id} className="bg-card rounded-xl shadow-md border border-border p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-foreground">{address.recipientName}</h3>
                  <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-400 text-xs font-medium rounded">
                    {address.type}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{address.phone}</p>
                <p className="text-sm text-muted-foreground">
                  {address.streetAddress}, {address.barangay}, {address.cityMunicipality}
                </p>
                <p className="text-sm text-muted-foreground">
                  {address.province}, {address.region} {address.postalCode}
                </p>
                {address.isDefault && (
                  <p className="mt-2 text-xs text-primary font-medium">✓ Default Address</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
}

