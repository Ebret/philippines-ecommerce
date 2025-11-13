'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface EarningsData {
  totalEarnings: number;
  totalCommission: number;
  pendingPayout: number;
  lastPayoutDate: string;
  payoutHistory: Array<{
    id: string;
    amount: number;
    status: string;
    requestDate: string;
    payoutDate: string;
  }>;
}

export default function VendorEarnings() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [earnings, setEarnings] = useState<EarningsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestingPayout, setRequestingPayout] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/vendor/earnings');
        if (!response.ok) throw new Error('Failed to fetch earnings');
        const data = await response.json();
        setEarnings(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchEarnings();
    }
  }, [session]);

  const handleRequestPayout = async () => {
    if (!earnings || earnings.pendingPayout <= 0) {
      alert('No pending earnings to request payout');
      return;
    }

    try {
      setRequestingPayout(true);
      const response = await fetch('/api/vendor/earnings/request-payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: earnings.pendingPayout }),
      });

      if (!response.ok) throw new Error('Failed to request payout');
      alert('Payout request submitted successfully');
      // Refresh earnings data
      const refreshResponse = await fetch('/api/vendor/earnings');
      const data = await refreshResponse.json();
      setEarnings(data);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setRequestingPayout(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading earnings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Earnings & Payouts</h1>
            <p className="text-gray-600 mt-2">Track your earnings and manage payouts</p>
          </div>
          <Link href="/vendor/dashboard" className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">
            Back to Dashboard
          </Link>
        </div>

        {earnings && (
          <>
            {/* Earnings Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm font-medium">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  ₱{earnings.totalEarnings.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm font-medium">Total Commission</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  ₱{earnings.totalCommission.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm font-medium">Pending Payout</p>
                <p className="text-2xl font-bold text-green-600 mt-2">
                  ₱{earnings.pendingPayout.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm font-medium">Last Payout</p>
                <p className="text-lg font-semibold text-gray-900 mt-2">
                  {earnings.lastPayoutDate ? new Date(earnings.lastPayoutDate).toLocaleDateString('en-PH') : 'N/A'}
                </p>
              </div>
            </div>

            {/* Request Payout Button */}
            <div className="mb-8">
              <button
                onClick={handleRequestPayout}
                disabled={requestingPayout || earnings.pendingPayout <= 0}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {requestingPayout ? 'Processing...' : 'Request Payout'}
              </button>
            </div>

            {/* Payout History */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Payout History</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Request Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Payout Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {earnings.payoutHistory.length > 0 ? (
                      earnings.payoutHistory.map((payout) => (
                        <tr key={payout.id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            ₱{payout.amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              payout.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                              payout.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {payout.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(payout.requestDate).toLocaleDateString('en-PH')}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {payout.payoutDate ? new Date(payout.payoutDate).toLocaleDateString('en-PH') : 'Pending'}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-4 text-center text-gray-600">
                          No payout history
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

