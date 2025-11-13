'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface TrackingData {
  id: string;
  orderNumber: string;
  trackingNumber: string;
  provider: string;
  status: string;
  estimatedDelivery: string;
  timeline: Array<{
    status: string;
    timestamp: string;
    location?: string;
    notes?: string;
  }>;
}

export default function OrderTrackingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;
  const [tracking, setTracking] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.email && orderId) {
      fetchTracking();
    }
  }, [session, orderId]);

  const fetchTracking = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}/tracking`);
      if (!response.ok) throw new Error('Failed to fetch tracking');
      const data = await response.json();
      setTracking(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tracking');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!tracking) return <div className="p-8 text-center">Tracking not found</div>;

  const statusColors: Record<string, string> = {
    'PREPARING': 'bg-gray-100 text-gray-800',
    'SHIPPED': 'bg-blue-100 text-blue-800',
    'IN_TRANSIT': 'bg-blue-100 text-blue-800',
    'OUT_FOR_DELIVERY': 'bg-yellow-100 text-yellow-800',
    'DELIVERED': 'bg-green-100 text-green-800',
    'FAILED_DELIVERY': 'bg-red-100 text-red-800',
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Link href={`/orders/${orderId}`} className="text-green-600 hover:text-green-700 mb-6 inline-block">
          ← Back to Order
        </Link>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Shipment Tracking</h1>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-600">Order Number</p>
              <p className="font-medium">{tracking.orderNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Tracking Number</p>
              <p className="font-medium">{tracking.trackingNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Provider</p>
              <p className="font-medium">{tracking.provider}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Est. Delivery</p>
              <p className="font-medium">{new Date(tracking.estimatedDelivery).toLocaleDateString('en-PH')}</p>
            </div>
          </div>

          <div className="mb-6">
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusColors[tracking.status] || 'bg-gray-100'}`}>
              {tracking.status}
            </span>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Tracking Timeline</h2>
            {tracking.timeline && tracking.timeline.length > 0 ? (
              <div className="space-y-4">
                {tracking.timeline.map((event, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 bg-green-600 rounded-full"></div>
                      {index < tracking.timeline.length - 1 && (
                        <div className="w-0.5 h-12 bg-gray-300 my-2"></div>
                      )}
                    </div>
                    <div className="pb-4">
                      <p className="font-medium text-gray-900">{event.status}</p>
                      <p className="text-sm text-gray-600">{new Date(event.timestamp).toLocaleString('en-PH')}</p>
                      {event.location && <p className="text-sm text-gray-600">{event.location}</p>}
                      {event.notes && <p className="text-sm text-gray-600">{event.notes}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No tracking updates yet</p>
            )}
          </div>
        </div>

        {/* Provider Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Tracking Information</h3>
          <p className="text-sm text-blue-800">
            Track your shipment with {tracking.provider} using tracking number: <span className="font-mono font-medium">{tracking.trackingNumber}</span>
          </p>
          <p className="text-sm text-blue-800 mt-2">
            For more details, visit the {tracking.provider} website or contact their customer service.
          </p>
        </div>
      </div>
    </div>
  );
}

