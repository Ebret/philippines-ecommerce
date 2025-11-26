'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/navbar';

interface ProductPerformance {
  id: string;
  name: string;
  sku: string;
  sales: number;
  revenue: number;
  rating: number;
  stock: number;
  status: string;
}

export default function VendorProducts() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<ProductPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('revenue');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/vendor/products/performance?sortBy=${sortBy}`);
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data.products || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchProducts();
    }
  }, [session, sortBy]);

  if (status === 'loading' || loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen bg-white dark:bg-neutral-950">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-neutral-600 dark:text-neutral-400">Loading products...</p>
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
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Product Performance</h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-2">Track your product sales and performance metrics</p>
          </div>
          <Link href="/vendor/dashboard" className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg text-sm font-medium hover:from-primary-700 hover:to-primary-800 transition-all duration-200">
            Back to Dashboard
          </Link>
        </div>

        {/* Sort Options */}
        <div className="mb-6 flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors duration-200"
          >
            <option value="revenue">Sort by Revenue</option>
            <option value="sales">Sort by Sales</option>
            <option value="rating">Sort by Rating</option>
            <option value="stock">Sort by Stock</option>
          </select>
        </div>

        {/* Products Table */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md overflow-hidden border border-neutral-200 dark:border-neutral-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-700 dark:text-neutral-300 uppercase">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-700 dark:text-neutral-300 uppercase">SKU</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-700 dark:text-neutral-300 uppercase">Sales</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-700 dark:text-neutral-300 uppercase">Revenue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-700 dark:text-neutral-300 uppercase">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-700 dark:text-neutral-300 uppercase">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-700 dark:text-neutral-300 uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product.id} className="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors duration-200">
                      <td className="px-6 py-4 text-sm font-medium text-neutral-900 dark:text-white">{product.name}</td>
                      <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">{product.sku}</td>
                      <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">{product.sales}</td>
                      <td className="px-6 py-4 text-sm font-medium text-neutral-900 dark:text-white">
                        ₱{product.revenue.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center">
                          <span className="text-accent-500">★</span>
                          <span className="ml-1 text-neutral-900 dark:text-white font-medium">{product.rating.toFixed(1)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          product.stock > 50 ? 'bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-400' :
                          product.stock > 10 ? 'bg-warning-100 dark:bg-warning-900/30 text-warning-800 dark:text-warning-400' :
                          'bg-error-100 dark:bg-error-900/30 text-error-800 dark:text-error-400'
                        }`}>
                          {product.stock} units
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          product.status === 'ACTIVE' ? 'bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-400' :
                          'bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-300'
                        }`}>
                          {product.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-neutral-600 dark:text-neutral-400">
                      No products found
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

