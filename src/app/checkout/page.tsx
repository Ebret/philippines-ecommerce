'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Check, ChevronRight, Lock, Truck, CreditCard } from 'lucide-react';

interface CheckoutFormData {
  recipientName: string;
  phone: string;
  region: string;
  province: string;
  cityMunicipality: string;
  barangay: string;
  streetAddress: string;
  landmark?: string;
  paymentMethod: string;
  notes?: string;
}

const PHILIPPINES_REGIONS = [
  'NCR (National Capital Region)',
  'Calabarzon',
  'Mimaropa',
  'Bicol',
  'Western Visayas',
  'Central Visayas',
  'Eastern Visayas',
  'Zamboanga Peninsula',
  'Northern Mindanao',
  'Davao',
  'Soccsksargen',
  'Caraga',
  'Bangsamoro',
  'Cordillera',
  'Ilocos',
  'Cagayan Valley',
  'Central Luzon',
];

const PAYMENT_METHODS = [
  { id: 'gcash', name: 'GCash', icon: '📱' },
  { id: 'paymaya', name: 'PayMaya', icon: '💳' },
  { id: 'credit_card', name: 'Credit/Debit Card', icon: '💳' },
  { id: 'bank_transfer', name: 'Bank Transfer', icon: '🏦' },
  { id: 'cod', name: 'Cash on Delivery', icon: '💵' },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cartSummary, setCartSummary] = useState({
    subtotal: 0,
    taxAmount: 0,
    shippingFee: 0,
    discountAmount: 0,
    totalAmount: 0,
  });
  const [formData, setFormData] = useState<CheckoutFormData>({
    recipientName: '',
    phone: '',
    region: '',
    province: '',
    cityMunicipality: '',
    barangay: '',
    streetAddress: '',
    landmark: '',
    paymentMethod: 'cod',
    notes: '',
  });

  useEffect(() => {
    const fetchCartSummary = async () => {
      try {
        const response = await fetch('/api/cart');
        if (response.ok) {
          const data = await response.json();
          setCartSummary(data.summary);
        }
      } catch (err) {
        console.error('Error fetching cart:', err);
      }
    };

    if (session?.user) {
      fetchCartSummary();
    }
  }, [session]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.recipientName.trim()) {
      setError('Recipient name is required');
      return false;
    }
    if (!formData.phone.match(/^09\d{9}$/)) {
      setError('Phone must be a valid Philippine number (09XXXXXXXXX)');
      return false;
    }
    if (!formData.region) {
      setError('Region is required');
      return false;
    }
    if (!formData.province) {
      setError('Province is required');
      return false;
    }
    if (!formData.cityMunicipality) {
      setError('City/Municipality is required');
      return false;
    }
    if (!formData.barangay) {
      setError('Barangay is required');
      return false;
    }
    if (!formData.streetAddress.trim()) {
      setError('Street address is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shippingAddress: {
            recipientName: formData.recipientName,
            phone: formData.phone,
            region: formData.region,
            province: formData.province,
            cityMunicipality: formData.cityMunicipality,
            barangay: formData.barangay,
            streetAddress: formData.streetAddress,
            landmark: formData.landmark,
          },
          paymentMethod: formData.paymentMethod,
          notes: formData.notes,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Redirect to payment page or order confirmation
        router.push(`/order-confirmation/${data.orderId}`);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to create order');
      }
    } catch (err) {
      console.error('Error creating order:', err);
      setError('Failed to create order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!session?.user) {
    return (
      <main className="min-h-screen bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 md:px-8 py-20 text-center">
          <div className="inline-block">
            <div className="text-6xl mb-4">🔐</div>
            <p className="text-gray-600 dark:text-gray-400 mb-6 font-medium text-lg">Please log in to proceed with checkout</p>
            <Link href="/auth/login" className="inline-block px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 dark:from-emerald-500 dark:to-emerald-600 dark:hover:from-emerald-600 dark:hover:to-emerald-700 text-white font-semibold rounded-lg transition-all duration-200">
              Log In
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">
      {/* Breadcrumb */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/cart" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Cart</Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white font-semibold">Checkout</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Secure Checkout</h1>
          <p className="text-gray-600 dark:text-gray-400">Complete your order securely</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12 flex items-center justify-between max-w-2xl">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-600 text-white font-bold">
              <Check className="w-5 h-5" />
            </div>
            <span className="font-semibold text-gray-900 dark:text-white">Cart</span>
          </div>
          <div className="flex-1 h-1 bg-emerald-600 mx-2"></div>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-600 text-white font-bold">
              2
            </div>
            <span className="font-semibold text-gray-900 dark:text-white">Checkout</span>
          </div>
          <div className="flex-1 h-1 bg-gray-300 dark:bg-gray-700 mx-2"></div>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 font-bold">
              3
            </div>
            <span className="font-semibold text-gray-600 dark:text-gray-400">Confirmation</span>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 font-medium">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Shipping Address */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-6">
                  <Truck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Shipping Address</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Recipient Name *</label>
                    <input
                      type="text"
                      name="recipientName"
                      value={formData.recipientName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="09XXXXXXXXX"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Region *</label>
                      <select
                        name="region"
                        value={formData.region}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                      >
                        <option value="">Select Region</option>
                        {PHILIPPINES_REGIONS.map(region => (
                          <option key={region} value={region}>{region}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Province *</label>
                      <input
                        type="text"
                        name="province"
                        value={formData.province}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">City/Municipality *</label>
                      <input
                        type="text"
                        name="cityMunicipality"
                        value={formData.cityMunicipality}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Barangay *</label>
                      <input
                        type="text"
                        name="barangay"
                        value={formData.barangay}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Street Address *</label>
                    <input
                      type="text"
                      name="streetAddress"
                      value={formData.streetAddress}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Landmark (Optional)</label>
                    <input
                      type="text"
                      name="landmark"
                      value={formData.landmark}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-6">
                  <CreditCard className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Payment Method</h2>
                </div>
                <div className="space-y-3">
                  {PAYMENT_METHODS.map(method => (
                    <label key={method.id} className="flex items-center p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-emerald-300 dark:hover:border-emerald-600 transition-colors" style={{borderColor: formData.paymentMethod === method.id ? '#22c55e' : undefined}}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={formData.paymentMethod === method.id}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-emerald-600 mr-3"
                      />
                      <span className="text-2xl mr-3">{method.icon}</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{method.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Order Notes */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Order Notes (Optional)</h2>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Add any special instructions for your order..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 h-24 resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 dark:from-emerald-500 dark:to-emerald-600 dark:hover:from-emerald-600 dark:hover:to-emerald-700 text-white font-bold rounded-lg transition-all duration-200 disabled:bg-gray-400 dark:disabled:bg-gray-600 flex items-center justify-center gap-2"
              >
                <Lock className="w-5 h-5" />
                {isLoading ? 'Processing...' : 'Place Order Securely'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 sticky top-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal:</span>
                  <span className="font-semibold">₱{cartSummary.subtotal.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Tax (12%):</span>
                  <span className="font-semibold">₱{cartSummary.taxAmount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Shipping:</span>
                  <span className="font-semibold">₱{cartSummary.shippingFee.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
                </div>
                {cartSummary.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>Discount:</span>
                    <span>-₱{cartSummary.discountAmount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold text-gray-900 dark:text-white">Total:</span>
                <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">₱{cartSummary.totalAmount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
              </div>

              <Link href="/cart" className="block w-full text-center px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold rounded-lg transition-colors">
                Back to Cart
              </Link>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 dark:bg-black text-white py-12 px-4 md:px-8 mt-12">
        <div className="container mx-auto text-center">
          <p className="text-gray-400">&copy; 2025 Extreme Life Herbal. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}

