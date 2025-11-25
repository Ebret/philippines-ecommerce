'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.email) {
      fetchOrders();
    }
  }, [session, statusFilter, page]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
      });
      if (statusFilter) params.append('status', statusFilter);

      const response = await fetch(`/api/users/orders?${params}`);
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setOrders(data.orders);
    } catch (err) {
      setError('Failed to load orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-neutral-600 dark:text-neutral-400">Loading your orders...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">My Orders</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">View and manage your orders</p>
        </div>

        {/* Navigation */}
        <div className="mb-8 flex gap-4 border-b border-neutral-200 dark:border-neutral-700">
          <Link href="/account/profile" className="px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white">
            Profile
          </Link>
          <Link href="/account/orders" className="px-4 py-2 border-b-2 border-primary-600 text-primary-600 dark:text-primary-400 font-medium">
            Orders
          </Link>
          <Link href="/account/addresses" className="px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white">
            Addresses
          </Link>
          <Link href="/account/settings" className="px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white">
            Settings
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="text-warning-600 dark:text-warning-400 mt-0.5">⚠️</div>
              <div className="flex-1">
                <p className="text-warning-800 dark:text-warning-400 font-medium">{error}</p>
                <button
                  onClick={() => {
                    setError('');
                    fetchOrders();
                  }}
                  className="mt-2 text-sm text-warning-700 dark:text-warning-300 hover:underline"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filter */}
        <div className="mb-6">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Orders</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md border border-neutral-200 dark:border-neutral-700 p-8 text-center">
            <p className="text-neutral-600 dark:text-neutral-400">No orders found</p>
            <Link href="/products" className="mt-4 inline-block text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white dark:bg-neutral-800 rounded-lg shadow-md border border-neutral-200 dark:border-neutral-700 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Order #{order.id.slice(0, 8)}</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {new Date(order.createdAt).toLocaleDateString('en-PH')}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === 'DELIVERED' ? 'bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-400' :
                    order.status === 'SHIPPED' ? 'bg-secondary-100 dark:bg-secondary-900/30 text-secondary-800 dark:text-secondary-400' :
                    order.status === 'CANCELLED' ? 'bg-error-100 dark:bg-error-900/30 text-error-800 dark:text-error-400' :
                    'bg-warning-100 dark:bg-warning-900/30 text-warning-800 dark:text-warning-400'
                  }`}>
                    {order.status}
                  </span>
                </div>

                <div className="mb-4 space-y-2">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-neutral-600 dark:text-neutral-400">
                        {item.product.name} x {item.quantity}
                      </span>
                      <span className="text-neutral-900 dark:text-white font-medium">
                        ₱{(item.price * item.quantity).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Total Amount</p>
                    <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
                      ₱{order.totalAmount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <Link
                    href={`/order-confirmation/${order.id}`}
                    className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 dark:from-primary-500 dark:to-primary-600 dark:hover:from-primary-600 dark:hover:to-primary-700 text-white rounded-lg font-medium transition-all duration-200"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

