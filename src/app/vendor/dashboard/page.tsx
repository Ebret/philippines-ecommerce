'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/navbar';

interface DashboardKPI {
  totalSales: number;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  pendingOrders: number;
  completedOrders: number;
  totalProducts: number;
  lowStockProducts: number;
  totalCustomers: number;
  returnRate: number;
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  itemCount: number;
}

export default function VendorDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [kpis, setKpis] = useState<DashboardKPI | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/vendor/dashboard');
        if (!response.ok) throw new Error('Failed to fetch dashboard data');
        const data = await response.json();
        setKpis(data.kpis);
        setRecentOrders(data.recentOrders || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchDashboardData();
    }
  }, [session]);

  if (status === 'loading' || loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen bg-white dark:bg-neutral-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600 dark:text-neutral-400">Loading dashboard...</p>
        </div>
      </div>
      </>
    );
  }

  // Mock data for fallback UI
  const mockKpis = {
    totalSales: 1250,
    totalOrders: 45,
    totalRevenue: 125000,
    averageOrderValue: 2777.78,
    pendingOrders: 8,
    completedOrders: 37,
    totalProducts: 24,
    lowStockProducts: 3,
    totalCustomers: 42,
    returnRate: 2.5,
  };

  const mockRecentOrders = [
    { id: '1', orderNumber: 'ORD-001', status: 'Completed', totalAmount: 5200, createdAt: new Date().toISOString(), itemCount: 3 },
    { id: '2', orderNumber: 'ORD-002', status: 'Processing', totalAmount: 3800, createdAt: new Date().toISOString(), itemCount: 2 },
    { id: '3', orderNumber: 'ORD-003', status: 'Shipped', totalAmount: 7500, createdAt: new Date().toISOString(), itemCount: 4 },
  ];

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-white dark:bg-neutral-950 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-warning-900 dark:text-warning-100 mb-2">⚠️ Unable to Load Live Data</h2>
            <p className="text-warning-800 dark:text-warning-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-warning-600 hover:bg-warning-700 text-white rounded-lg transition-colors"
            >
              Retry Loading
            </button>
          </div>

          {/* Fallback UI with mock data */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Vendor Dashboard</h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-2">Showing sample data (live data unavailable)</p>
          </div>

          {/* KPI Cards with Mock Data */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Revenue */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow border border-neutral-200 dark:border-neutral-700 p-6 opacity-75">
              <p className="text-neutral-600 dark:text-neutral-400 text-sm font-medium">Total Revenue</p>
              <p className="text-2xl font-bold text-primary-600 dark:text-primary-400 mt-2">
                ₱{mockKpis.totalRevenue.toLocaleString('en-PH')}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">Sample data</p>
            </div>

            {/* Total Orders */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow border border-neutral-200 dark:border-neutral-700 p-6 opacity-75">
              <p className="text-neutral-600 dark:text-neutral-400 text-sm font-medium">Total Orders</p>
              <p className="text-2xl font-bold text-success-600 dark:text-success-400 mt-2">{mockKpis.totalOrders}</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">Sample data</p>
            </div>

            {/* Pending Orders */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow border border-neutral-200 dark:border-neutral-700 p-6 opacity-75">
              <p className="text-neutral-600 dark:text-neutral-400 text-sm font-medium">Pending Orders</p>
              <p className="text-2xl font-bold text-warning-600 dark:text-warning-400 mt-2">{mockKpis.pendingOrders}</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">Sample data</p>
            </div>

            {/* Total Products */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow border border-neutral-200 dark:border-neutral-700 p-6 opacity-75">
              <p className="text-neutral-600 dark:text-neutral-400 text-sm font-medium">Total Products</p>
              <p className="text-2xl font-bold text-info-600 dark:text-info-400 mt-2">{mockKpis.totalProducts}</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">Sample data</p>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow border border-neutral-200 dark:border-neutral-700 p-6 opacity-75">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Recent Orders (Sample)</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-700">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Order #</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Items</th>
                  </tr>
                </thead>
                <tbody>
                  {mockRecentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-neutral-100 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/50">
                      <td className="py-3 px-4 text-sm text-neutral-900 dark:text-white">{order.orderNumber}</td>
                      <td className="py-3 px-4 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          order.status === 'Completed' ? 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-400' :
                          order.status === 'Processing' ? 'bg-info-100 text-info-800 dark:bg-info-900/30 dark:text-info-400' :
                          'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-400'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-neutral-900 dark:text-white">₱{order.totalAmount.toLocaleString('en-PH')}</td>
                      <td className="py-3 px-4 text-sm text-neutral-600 dark:text-neutral-400">{order.itemCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white dark:bg-neutral-950 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Vendor Dashboard</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">Welcome back, {session?.user?.name}</p>
        </div>

        {/* KPI Cards */}
        {kpis && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Revenue */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow border border-neutral-200 dark:border-neutral-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm font-medium">Total Revenue</p>
                  <p className="text-2xl font-bold text-primary-600 dark:text-primary-400 mt-2">
                    ₱{kpis.totalRevenue.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="bg-primary-100 dark:bg-primary-900/30 rounded-full p-3">
                  <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Total Orders */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow border border-neutral-200 dark:border-neutral-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm font-medium">Total Orders</p>
                  <p className="text-2xl font-bold text-secondary-600 dark:text-secondary-400 mt-2">{kpis.totalOrders}</p>
                </div>
                <div className="bg-secondary-100 dark:bg-secondary-900/30 rounded-full p-3">
                  <svg className="w-6 h-6 text-secondary-600 dark:text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Pending Orders */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow border border-neutral-200 dark:border-neutral-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm font-medium">Pending Orders</p>
                  <p className="text-2xl font-bold text-warning-600 dark:text-warning-400 mt-2">{kpis.pendingOrders}</p>
                </div>
                <div className="bg-warning-100 dark:bg-warning-900/30 rounded-full p-3">
                  <svg className="w-6 h-6 text-warning-600 dark:text-warning-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Total Products */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow border border-neutral-200 dark:border-neutral-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm font-medium">Total Products</p>
                  <p className="text-2xl font-bold text-accent-600 dark:text-accent-400 mt-2">{kpis.totalProducts}</p>
                </div>
                <div className="bg-accent-100 dark:bg-accent-900/30 rounded-full p-3">
                  <svg className="w-6 h-6 text-accent-600 dark:text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m0 0l8 4m-8-4v10l8 4m0-10l8 4m-8-4v10M8 5v10m8-10v10" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link href="/vendor/products" className="bg-white dark:bg-neutral-800 rounded-lg shadow border border-neutral-200 dark:border-neutral-700 p-4 hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-700 transition-all">
            <p className="font-semibold text-neutral-900 dark:text-white">View Products</p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">Manage your product catalog</p>
          </Link>
          <Link href="/vendor/orders" className="bg-white dark:bg-neutral-800 rounded-lg shadow border border-neutral-200 dark:border-neutral-700 p-4 hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-700 transition-all">
            <p className="font-semibold text-neutral-900 dark:text-white">View Orders</p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">Manage customer orders</p>
          </Link>
          <Link href="/vendor/analytics" className="bg-white dark:bg-neutral-800 rounded-lg shadow border border-neutral-200 dark:border-neutral-700 p-4 hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-700 transition-all">
            <p className="font-semibold text-neutral-900 dark:text-white">View Analytics</p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">Detailed sales analytics</p>
          </Link>
          <Link href="/vendor/earnings" className="bg-white dark:bg-neutral-800 rounded-lg shadow border border-neutral-200 dark:border-neutral-700 p-4 hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-700 transition-all">
            <p className="font-semibold text-neutral-900 dark:text-white">View Earnings</p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">Track your earnings</p>
          </Link>
        </div>

        {/* Recent Orders */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow border border-neutral-200 dark:border-neutral-700">
          <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Recent Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 dark:bg-neutral-700 border-b border-neutral-200 dark:border-neutral-600">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-700 dark:text-neutral-300 uppercase">Order #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-700 dark:text-neutral-300 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-700 dark:text-neutral-300 uppercase">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-700 dark:text-neutral-300 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-700 dark:text-neutral-300 uppercase">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/50">
                      <td className="px-6 py-4 text-sm font-medium text-neutral-900 dark:text-white">{order.orderNumber}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status === 'DELIVERED' ? 'bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-400' :
                          order.status === 'SHIPPED' ? 'bg-secondary-100 dark:bg-secondary-900/30 text-secondary-800 dark:text-secondary-400' :
                          order.status === 'PENDING' ? 'bg-warning-100 dark:bg-warning-900/30 text-warning-800 dark:text-warning-400' :
                          'bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-300'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">{order.itemCount}</td>
                      <td className="px-6 py-4 text-sm font-medium text-primary-600 dark:text-primary-400">
                        ₱{order.totalAmount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">
                        {new Date(order.createdAt).toLocaleDateString('en-PH')}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-neutral-600 dark:text-neutral-400">
                      No recent orders
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

