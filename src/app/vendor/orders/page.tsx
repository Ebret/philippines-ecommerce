'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/navbar';

interface VendorOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  status: string;
  totalAmount: number;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function VendorOrders() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<VendorOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/vendor/orders?status=${filterStatus}&page=${page}`);
        if (!response.ok) throw new Error('Failed to fetch orders');
        const data = await response.json();
        setOrders(data.orders || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchOrders();
    }
  }, [session, filterStatus, page]);

  if (status === 'loading' || loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen bg-background">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading orders...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background p-8">
          <div className="bg-error/10 border border-error/20 rounded-xl p-4">
            <p className="text-error">Error: {error}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="font-serif font-serif text-3xl font-bold text-foreground">Order Management</h1>
            <p className="text-muted-foreground mt-2">Manage and track customer orders</p>
          </div>
          <Link href="/vendor/dashboard" className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl text-sm font-medium hover:from-primary-700 hover:to-primary-800 transition-all duration-200">
            Back to Dashboard
          </Link>
        </div>

        {/* Filter */}
        <div className="mb-6">
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 bg-card rounded-xl text-sm font-medium text-foreground hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors duration-200"
          >
            <option value="all">All Orders</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {/* Orders Table */}
        <div className="bg-card rounded-xl shadow-md overflow-hidden border border-border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase">Order #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order.id} className="border-b border-border hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors duration-200">
                      <td className="px-6 py-4 text-sm font-medium text-foreground">
                        <Link href={`/orders/${order.id}`} className="text-primary hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200">
                          {order.orderNumber}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{order.customerName}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status === 'DELIVERED' ? 'bg-success-100 dark:bg-success-900/30 text-success' :
                          order.status === 'SHIPPED' ? 'bg-secondary-100 dark:bg-secondary-900/30 text-secondary-800 dark:text-secondary-400' :
                          order.status === 'PROCESSING' ? 'bg-info-100 dark:bg-info-900/30 text-info-800 dark:text-info-400' :
                          order.status === 'CONFIRMED' ? 'bg-warning-100 dark:bg-warning-900/30 text-warning' :
                          order.status === 'PENDING' ? 'bg-accent-100 dark:bg-accent-900/30 text-accent-800 dark:text-accent-400' :
                          'bg-error-100 dark:bg-error-900/30 text-error'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{order.itemCount}</td>
                      <td className="px-6 py-4 text-sm font-medium text-foreground">
                        ₱{order.totalAmount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString('en-PH')}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-muted-foreground">
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 bg-card rounded-xl text-sm font-medium text-foreground hover:bg-neutral-50 dark:hover:bg-neutral-700 disabled:opacity-50 transition-colors duration-200"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm font-medium text-foreground">Page {page}</span>
          <button
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 bg-card rounded-xl text-sm font-medium text-foreground hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors duration-200"
          >
            Next
          </button>
        </div>
      </div>
    </div>
    </>
  );
}

