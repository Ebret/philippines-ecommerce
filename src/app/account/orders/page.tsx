'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/navbar';
import { BreadcrumbNav } from '@/components/ui/breadcrumb';

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
      <>
        <Navbar />
        <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center min-h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading your orders...</p>
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
        <BreadcrumbNav items={[{ label: 'Account', href: '/account/profile' }, { label: 'Orders' }]} />

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-primary">My Orders</h1>
          <p className="text-muted-foreground mt-2">View and manage your orders</p>
        </div>

        {/* Navigation */}
        <div className="mb-8 flex gap-4 border-b border-border">
          <Link href="/account/profile" className="px-4 py-2 text-muted-foreground hover:text-foreground">
            Profile
          </Link>
          <Link href="/account/orders" className="px-4 py-2 border-b-2 border-primary text-primary font-medium">
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
                    fetchOrders();
                  }}
                  className="mt-2 text-sm text-warning hover:underline"
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
            className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
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
          <div className="bg-card rounded-xl shadow-md border border-border p-8 text-center">
            <p className="text-muted-foreground">No orders found</p>
            <Link href="/products" className="mt-4 inline-block text-primary hover:text-primary/80 font-medium">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-card rounded-xl shadow-md border border-border p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-foreground">Order #{order.id.slice(0, 8)}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString('en-PH')}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === 'DELIVERED' ? 'bg-success/10 text-success' :
                    order.status === 'SHIPPED' ? 'bg-secondary/10 text-secondary' :
                    order.status === 'CANCELLED' ? 'bg-error/10 text-error' :
                    'bg-warning/10 text-warning'
                  }`}>
                    {order.status}
                  </span>
                </div>

                <div className="mb-4 space-y-2">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.product.name} x {item.quantity}
                      </span>
                      <span className="text-foreground font-medium">
                        ₱{(item.price * item.quantity).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="text-lg font-bold text-primary">
                      ₱{order.totalAmount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <Link
                    href={`/order-confirmation/${order.id}`}
                    className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-medium transition-all duration-200 shadow-sm hover:shadow-md"
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
    </>
  );
}

