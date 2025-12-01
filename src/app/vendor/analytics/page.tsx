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
        <div className="flex items-center justify-center min-h-screen bg-background">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading analytics...</p>
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
              <h1 className="font-serif font-serif text-3xl font-bold text-foreground">Analytics</h1>
              <p className="text-muted-foreground mt-2">Detailed sales and performance analytics</p>
            </div>
            <div className="flex gap-2">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 bg-card rounded-xl text-sm font-medium text-foreground hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors duration-200"
              >
                <option value="7days">Last 7 days</option>
                <option value="30days">Last 30 days</option>
                <option value="90days">Last 90 days</option>
                <option value="1year">Last year</option>
              </select>
              <Link href="/vendor/dashboard" className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl text-sm font-medium hover:from-primary-700 hover:to-primary-800 transition-all duration-200">
                Back to Dashboard
              </Link>
            </div>
          </div>

          {analytics && (
            <>
              {/* Customer Insights */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-card rounded-xl shadow-md p-6 border border-border">
                  <p className="text-muted-foreground text-sm font-medium">Total Customers</p>
                  <p className="text-2xl font-bold text-foreground mt-2">{analytics.customerInsights.totalCustomers}</p>
                </div>
                <div className="bg-card rounded-xl shadow-md p-6 border border-border">
                  <p className="text-muted-foreground text-sm font-medium">New Customers</p>
                  <p className="text-2xl font-bold text-foreground mt-2">{analytics.customerInsights.newCustomers}</p>
                </div>
                <div className="bg-card rounded-xl shadow-md p-6 border border-border">
                  <p className="text-muted-foreground text-sm font-medium">Repeat Customers</p>
                  <p className="text-2xl font-bold text-foreground mt-2">{analytics.customerInsights.repeatCustomers}</p>
                </div>
                <div className="bg-card rounded-xl shadow-md p-6 border border-border">
                  <p className="text-muted-foreground text-sm font-medium">Avg Order Value</p>
                  <p className="text-2xl font-bold text-foreground mt-2">
                  ₱{analytics.customerInsights.averageOrderValue.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-card rounded-xl shadow-md mb-8 border border-border">
              <div className="p-6 border-b border-border">
                <h2 className="font-serif text-lg font-semibold text-foreground">Top Products</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted border-b border-border">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase">Sales</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.topProducts.map((product) => (
                      <tr key={product.id} className="border-b border-border hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors duration-200">
                        <td className="px-6 py-4 text-sm font-medium text-foreground">{product.name}</td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{product.sales}</td>
                        <td className="px-6 py-4 text-sm font-medium text-foreground">
                          ₱{product.revenue.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Revenue Breakdown */}
            <div className="bg-card rounded-xl shadow-md border border-border">
              <div className="p-6 border-b border-border">
                <h2 className="font-serif text-lg font-semibold text-foreground">Revenue Breakdown</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {analytics.revenueBreakdown.map((item) => (
                    <div key={item.category}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">{item.category}</span>
                        <span className="text-sm font-semibold text-foreground">
                          ₱{item.revenue.toLocaleString('en-PH', { minimumFractionDigits: 2 })} ({item.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
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

