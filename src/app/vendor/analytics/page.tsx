'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/navbar';

interface AnalyticsData {
  salesTrend: Array<{ date: string; sales: number; orders: number }>;
  revenueBreakdown: Array<{ category: string; revenue: number; percentage: number }>;
  topProducts: Array<{ id: string; name: string; sales: number; revenue: number }>;
  customerInsights: {
    totalCustomers: number;
    newCustomers: number;
    repeatCustomers: number;
    averageOrderValue: number;
  };
  trafficSources: Array<{ source: string; visits: number; conversions: number }>;
}

export default function VendorAnalytics() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState('30days');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/vendor/analytics?range=${dateRange}`);
        if (!response.ok) throw new Error('Failed to fetch analytics');
        const data = await response.json();
        setAnalytics(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchAnalytics();
    }
  }, [session, dateRange]);

  if (status === 'loading' || loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen bg-white dark:bg-neutral-950">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-neutral-600 dark:text-neutral-400">Loading analytics...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-white dark:bg-neutral-950 p-8">
          <div className="bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg p-4">
            <p className="text-error-800 dark:text-error-400">Error: {error}</p>
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
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Analytics</h1>
              <p className="text-neutral-600 dark:text-neutral-400 mt-2">Detailed sales and performance analytics</p>
            </div>
            <div className="flex gap-2">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors duration-200"
              >
                <option value="7days">Last 7 days</option>
                <option value="30days">Last 30 days</option>
                <option value="90days">Last 90 days</option>
                <option value="1year">Last year</option>
              </select>
              <Link href="/vendor/dashboard" className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg text-sm font-medium hover:from-primary-700 hover:to-primary-800 transition-all duration-200">
                Back to Dashboard
              </Link>
            </div>
          </div>

          {analytics && (
            <>
              {/* Customer Insights */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6 border border-neutral-200 dark:border-neutral-700">
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm font-medium">Total Customers</p>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-white mt-2">{analytics.customerInsights.totalCustomers}</p>
                </div>
                <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6 border border-neutral-200 dark:border-neutral-700">
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm font-medium">New Customers</p>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-white mt-2">{analytics.customerInsights.newCustomers}</p>
                </div>
                <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6 border border-neutral-200 dark:border-neutral-700">
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm font-medium">Repeat Customers</p>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-white mt-2">{analytics.customerInsights.repeatCustomers}</p>
                </div>
                <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6 border border-neutral-200 dark:border-neutral-700">
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm font-medium">Avg Order Value</p>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-white mt-2">
                  ₱{analytics.customerInsights.averageOrderValue.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md mb-8 border border-neutral-200 dark:border-neutral-700">
              <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Top Products</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-700 dark:text-neutral-300 uppercase">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-700 dark:text-neutral-300 uppercase">Sales</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-700 dark:text-neutral-300 uppercase">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.topProducts.map((product) => (
                      <tr key={product.id} className="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors duration-200">
                        <td className="px-6 py-4 text-sm font-medium text-neutral-900 dark:text-white">{product.name}</td>
                        <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">{product.sales}</td>
                        <td className="px-6 py-4 text-sm font-medium text-neutral-900 dark:text-white">
                          ₱{product.revenue.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Revenue Breakdown */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md border border-neutral-200 dark:border-neutral-700">
              <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Revenue Breakdown</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {analytics.revenueBreakdown.map((item) => (
                    <div key={item.category}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{item.category}</span>
                        <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                          ₱{item.revenue.toLocaleString('en-PH', { minimumFractionDigits: 2 })} ({item.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-primary-600 to-primary-700 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
    </>
  );
}

