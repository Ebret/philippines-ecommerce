'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

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
      <main className="min-h-screen bg-white">
        <nav className="bg-gray-800 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold">Extreme Life Herbal</Link>
          </div>
        </nav>
        <div className="container mx-auto py-12 text-center">
          <p className="text-gray-600 mb-4">Please log in to proceed with checkout</p>
          <Link href="/auth/login" className="text-green-600 hover:text-green-700 font-semibold">
            Log In
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <nav className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">Extreme Life Herbal</Link>
          <ul className="flex gap-6">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/products">Products</Link></li>
            <li><Link href="/cart">Cart</Link></li>
          </ul>
        </div>
      </nav>

      <div className="bg-gray-50 py-4">
        <div className="container mx-auto">
          <div className="flex gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-green-600">Home</Link>
            <span>/</span>
            <Link href="/cart" className="hover:text-green-600">Cart</Link>
            <span>/</span>
            <span className="text-gray-900">Checkout</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-12">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Shipping Address */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Recipient Name *</label>
                    <input
                      type="text"
                      name="recipientName"
                      value={formData.recipientName}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="09XXXXXXXXX"
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1">Region *</label>
                      <select
                        name="region"
                        value={formData.region}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                      >
                        <option value="">Select Region</option>
                        {PHILIPPINES_REGIONS.map(region => (
                          <option key={region} value={region}>{region}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-1">Province *</label>
                      <input
                        type="text"
                        name="province"
                        value={formData.province}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1">City/Municipality *</label>
                      <input
                        type="text"
                        name="cityMunicipality"
                        value={formData.cityMunicipality}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-1">Barangay *</label>
                      <input
                        type="text"
                        name="barangay"
                        value={formData.barangay}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1">Street Address *</label>
                    <input
                      type="text"
                      name="streetAddress"
                      value={formData.streetAddress}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1">Landmark (Optional)</label>
                    <input
                      type="text"
                      name="landmark"
                      value={formData.landmark}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-4">Payment Method</h2>
                <div className="space-y-3">
                  {PAYMENT_METHODS.map(method => (
                    <label key={method.id} className="flex items-center p-3 border border-gray-300 rounded cursor-pointer hover:bg-gray-100">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={formData.paymentMethod === method.id}
                        onChange={handleInputChange}
                        className="mr-3"
                      />
                      <span className="mr-2">{method.icon}</span>
                      <span className="font-semibold">{method.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Order Notes */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-4">Order Notes (Optional)</h2>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Add any special instructions for your order..."
                  className="w-full p-2 border border-gray-300 rounded h-24"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded disabled:bg-gray-400"
              >
                {isLoading ? 'Processing...' : 'Place Order'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 rounded-lg sticky top-4">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₱{cartSummary.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (12%):</span>
                  <span>₱{cartSummary.taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>₱{cartSummary.shippingFee.toFixed(2)}</span>
                </div>
                {cartSummary.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>-₱{cartSummary.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-green-600">₱{cartSummary.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <Link href="/cart" className="block w-full text-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 rounded">
                Back to Cart
              </Link>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 Extreme Life Herbal. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}

