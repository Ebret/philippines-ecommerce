'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface OrderData {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  subtotal: number;
  taxAmount: number;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
  items: Array<{
    id: string;
    productId: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    product: {
      id: string;
      name: string;
      slug: string;
      images: Array<{ url: string }>;
    };
  }>;
  shipment: {
    id: string;
    status: string;
    trackingNumber: string;
    provider: string;
    estimatedDelivery: string;
  } | null;
  shippingAddress: {
    recipientName: string;
    phone: string;
    region: string;
    province: string;
    cityMunicipality: string;
    barangay: string;
    streetAddress: string;
  };
  createdAt: string;
}

export default function OrderDetailsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.email && orderId) {
      fetchOrder();
    }
  }, [session, orderId]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (!response.ok) throw new Error('Failed to fetch order');
      const data = await response.json();
      setOrder(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!order) return <div className="p-8 text-center">Order not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Link href="/account/orders" className="text-green-600 hover:text-green-700 mb-6 inline-block">
          ← Back to Orders
        </Link>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
              <p className="text-gray-600">{new Date(order.createdAt).toLocaleDateString('en-PH')}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
              order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
              order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
              order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {order.status}
            </span>
          </div>

          {/* Order Items */}
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b">
                  {item.product.images[0] && (
                    <img src={item.product.images[0].url} alt={item.product.name} className="w-20 h-20 object-cover rounded" />
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    <p className="text-sm font-medium">₱{item.totalPrice.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t mt-6 pt-6">
            <div className="space-y-2 text-right">
              <div className="flex justify-between"><span>Subtotal:</span><span>₱{order.subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Tax (12%):</span><span>₱{order.taxAmount.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Shipping:</span><span>₱{order.shippingFee.toFixed(2)}</span></div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total:</span><span>₱{order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
          <p className="font-medium">{order.shippingAddress.recipientName}</p>
          <p className="text-gray-600">{order.shippingAddress.streetAddress}</p>
          <p className="text-gray-600">{order.shippingAddress.barangay}, {order.shippingAddress.cityMunicipality}</p>
          <p className="text-gray-600">{order.shippingAddress.province}, {order.shippingAddress.region}</p>
          <p className="text-gray-600">{order.shippingAddress.phone}</p>
        </div>

        {/* Shipment Tracking */}
        {order.shipment && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Shipment Tracking</h2>
            <div className="space-y-2">
              <div className="flex justify-between"><span>Provider:</span><span className="font-medium">{order.shipment.provider}</span></div>
              <div className="flex justify-between"><span>Tracking #:</span><span className="font-medium">{order.shipment.trackingNumber}</span></div>
              <div className="flex justify-between"><span>Status:</span><span className="font-medium">{order.shipment.status}</span></div>
              <div className="flex justify-between"><span>Est. Delivery:</span><span>{new Date(order.shipment.estimatedDelivery).toLocaleDateString('en-PH')}</span></div>
            </div>
            <Link href={`/orders/${order.id}/tracking`} className="mt-4 inline-block text-green-600 hover:text-green-700 font-medium">
              View Full Tracking →
            </Link>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          {order.status === 'PENDING' || order.status === 'CONFIRMED' ? (
            <Link href={`/orders/${order.id}/cancel`} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              Cancel Order
            </Link>
          ) : null}
          {order.status === 'DELIVERED' && (
            <Link href={`/orders/${order.id}/return`} className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
              Request Return
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

