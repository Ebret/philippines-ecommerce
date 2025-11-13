'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  product: { name: string };
}

export default function OrderReturnPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;
  const [items, setItems] = useState<OrderItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<Record<string, { quantity: number; condition: string }>>({});
  const [reason, setReason] = useState('');
  const [refundMethod, setRefundMethod] = useState('ORIGINAL_PAYMENT');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.email && orderId) {
      fetchOrderItems();
    }
  }, [session, orderId]);

  const fetchOrderItems = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (!response.ok) throw new Error('Failed to fetch order');
      const data = await response.json();
      setItems(data.items || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = (itemId: string) => {
    setSelectedItems((prev) => {
      const newSelected = { ...prev };
      if (newSelected[itemId]) {
        delete newSelected[itemId];
      } else {
        newSelected[itemId] = { quantity: 1, condition: 'UNOPENED' };
      }
      return newSelected;
    });
  };

  const updateItemQuantity = (itemId: string, quantity: number) => {
    setSelectedItems((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], quantity: Math.max(1, quantity) },
    }));
  };

  const updateItemCondition = (itemId: string, condition: string) => {
    setSelectedItems((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], condition },
    }));
  };

  const handleReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedItemIds = Object.keys(selectedItems);
    
    if (selectedItemIds.length === 0) {
      setError('Please select at least one item to return');
      return;
    }

    if (!reason.trim() || reason.length < 10) {
      setError('Please provide a reason (at least 10 characters)');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const returnItems = selectedItemIds.map((itemId) => ({
        orderItemId: itemId,
        quantity: selectedItems[itemId].quantity,
        condition: selectedItems[itemId].condition,
      }));

      const response = await fetch(`/api/orders/${orderId}/return`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason, items: returnItems, refundMethod }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to request return');
      }

      setSuccess(true);
      setTimeout(() => router.push(`/orders/${orderId}`), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to request return');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Link href={`/orders/${orderId}`} className="text-green-600 hover:text-green-700 mb-6 inline-block">
          ← Back to Order
        </Link>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Request Return</h1>

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-green-800">
              Return request submitted successfully. Redirecting...
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-800">
              {error}
            </div>
          )}

          <form onSubmit={handleReturn} className="space-y-6">
            {/* Items Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Items to Return *
              </label>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        checked={!!selectedItems[item.id]}
                        onChange={() => toggleItem(item.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{item.product.name}</p>
                        {selectedItems[item.id] && (
                          <div className="mt-3 space-y-2">
                            <div>
                              <label className="text-sm text-gray-600">Quantity</label>
                              <input
                                type="number"
                                min="1"
                                max={item.quantity}
                                value={selectedItems[item.id].quantity}
                                onChange={(e) => updateItemQuantity(item.id, parseInt(e.target.value))}
                                className="w-20 px-2 py-1 border rounded"
                              />
                            </div>
                            <div>
                              <label className="text-sm text-gray-600">Condition</label>
                              <select
                                value={selectedItems[item.id].condition}
                                onChange={(e) => updateItemCondition(item.id, e.target.value)}
                                className="w-full px-2 py-1 border rounded"
                              >
                                <option value="UNOPENED">Unopened</option>
                                <option value="OPENED">Opened</option>
                                <option value="DAMAGED">Damaged</option>
                                <option value="DEFECTIVE">Defective</option>
                              </select>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Return *
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Please tell us why you want to return these items"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                rows={4}
                disabled={submitting}
              />
            </div>

            {/* Refund Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Refund Method
              </label>
              <select
                value={refundMethod}
                onChange={(e) => setRefundMethod(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                disabled={submitting}
              >
                <option value="ORIGINAL_PAYMENT">Refund to Original Payment Method</option>
                <option value="STORE_CREDIT">Store Credit</option>
              </select>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitting || Object.keys(selectedItems).length === 0}
                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-400"
              >
                {submitting ? 'Submitting...' : 'Submit Return Request'}
              </button>
              <Link href={`/orders/${orderId}`} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

