'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/layout/navbar';

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
  shippingAddress: {
    recipientName: string;
    phone: string;
    region: string;
    province: string;
    cityMunicipality: string;
    barangay: string;
    streetAddress: string;
    landmark?: string;
  };
  items: Array<{
    id: string;
    productName: string;
    vendorName: string;
    quantity: number;
    price: number;
  }>;
  createdAt: string;
}

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const { data: session } = useSession();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/orders/${orderId}`);
        if (response.ok) {
          const data = await response.json();
          setOrder(data.order);
        } else {
          setError('Order not found');
        }
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details');
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user && orderId) {
      fetchOrder();
    }
  }, [session, orderId]);

  if (!session?.user) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-white dark:bg-neutral-950">
          <div className="container mx-auto py-12 text-center">
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">Please log in to view your order</p>
            <Link href="/auth/login" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold">
              Log In
            </Link>
          </div>
        </main>
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-white dark:bg-neutral-950">
          <div className="container mx-auto py-12 text-center">
            <p className="text-neutral-600 dark:text-neutral-400">Loading order details...</p>
          </div>
        </main>
      </>
    );
  }

  if (error || !order) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-white dark:bg-neutral-950">
          <div className="container mx-auto py-12 text-center">
            <p className="text-error-600 dark:text-error-400 mb-4">{error || 'Order not found'}</p>
            <Link href="/products" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold">
              Back to Products
            </Link>
          </div>
        </main>
      </>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-400';
      case 'PROCESSING':
        return 'bg-secondary-100 dark:bg-secondary-900/30 text-secondary-800 dark:text-secondary-400';
      case 'SHIPPED':
        return 'bg-accent-100 dark:bg-accent-900/30 text-accent-800 dark:text-accent-400';
      case 'DELIVERED':
        return 'bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-400';
      case 'CANCELLED':
        return 'bg-error-100 dark:bg-error-900/30 text-error-800 dark:text-error-400';
      default:
        return 'bg-neutral-100 dark:bg-neutral-900/30 text-neutral-800 dark:text-neutral-400';
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white dark:bg-neutral-950">
        <div className="bg-neutral-50 dark:bg-neutral-900 py-4 border-b border-neutral-200 dark:border-neutral-800">
        <div className="container mx-auto">
          <div className="flex gap-2 text-sm text-neutral-600 dark:text-neutral-400">
            <Link href="/" className="hover:text-primary-600 dark:hover:text-primary-400">Home</Link>
            <span>/</span>
            <span className="text-neutral-900 dark:text-white">Order Confirmation</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-12">
        {/* Success Message */}
        <div className="mb-8 p-6 bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 rounded-lg text-center">
          <h1 className="text-3xl font-bold text-success-700 dark:text-success-400 mb-2">Order Confirmed!</h1>
          <p className="text-neutral-600 dark:text-neutral-400">Thank you for your purchase. Your order has been received.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Header */}
            <div className="bg-neutral-50 dark:bg-neutral-900 p-6 rounded-lg border border-neutral-200 dark:border-neutral-800">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Order #{order.orderNumber}</h2>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-PH', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className={`px-4 py-2 rounded font-semibold ${getStatusColor(order.status)}`}>
                  {order.status}
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-neutral-50 dark:bg-neutral-900 p-6 rounded-lg border border-neutral-200 dark:border-neutral-800">
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">Shipping Address</h3>
              <div className="space-y-1 text-neutral-700 dark:text-neutral-300">
                <p className="font-semibold">{order.shippingAddress.recipientName}</p>
                <p>{order.shippingAddress.streetAddress}</p>
                {order.shippingAddress.landmark && (
                  <p>Landmark: {order.shippingAddress.landmark}</p>
                )}
                <p>
                  {order.shippingAddress.barangay}, {order.shippingAddress.cityMunicipality}
                </p>
                <p>
                  {order.shippingAddress.province}, {order.shippingAddress.region}
                </p>
                <p className="font-semibold mt-2">{order.shippingAddress.phone}</p>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-neutral-50 dark:bg-neutral-900 p-6 rounded-lg border border-neutral-200 dark:border-neutral-800">
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">Order Items</h3>
              <div className="space-y-3">
                {order.items.map(item => (
                  <div key={item.id} className="flex justify-between items-center pb-3 border-b border-neutral-200 dark:border-neutral-700">
                    <div>
                      <p className="font-semibold text-neutral-900 dark:text-white">{item.productName}</p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">{item.vendorName}</p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-neutral-900 dark:text-white">₱{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Status */}
            <div className="bg-neutral-50 dark:bg-neutral-900 p-6 rounded-lg border border-neutral-200 dark:border-neutral-800">
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">Payment Status</h3>
              <div className={`px-4 py-2 rounded font-semibold inline-block ${
                order.paymentStatus === 'PAID' ? 'bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-400' :
                order.paymentStatus === 'PENDING' ? 'bg-warning-100 dark:bg-warning-900/30 text-warning-800 dark:text-warning-400' :
                'bg-error-100 dark:bg-error-900/30 text-error-800 dark:text-error-400'
              }`}>
                {order.paymentStatus}
              </div>
              {order.paymentStatus === 'PENDING' && (
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-3">
                  Please complete your payment to confirm your order.
                </p>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-neutral-50 dark:bg-neutral-900 p-6 rounded-lg border border-neutral-200 dark:border-neutral-800 sticky top-4">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-neutral-700 dark:text-neutral-300">
                  <span>Subtotal:</span>
                  <span>₱{order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-700 dark:text-neutral-300">
                  <span>Tax (12%):</span>
                  <span>₱{order.taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-700 dark:text-neutral-300">
                  <span>Shipping:</span>
                  <span>₱{order.shippingFee.toFixed(2)}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-primary-600 dark:text-primary-400">
                    <span>Discount:</span>
                    <span>-₱{order.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-neutral-200 dark:border-neutral-700 pt-3 flex justify-between font-bold text-lg">
                  <span className="text-neutral-900 dark:text-white">Total:</span>
                  <span className="text-primary-600 dark:text-primary-400">₱{order.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Link href="/products" className="block w-full text-center bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white font-bold py-2 rounded-lg transition-colors">
                  Continue Shopping
                </Link>
                <Link href="/account/orders" className="block w-full text-center bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-900 dark:text-white font-bold py-2 rounded-lg transition-colors">
                  View All Orders
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-12 bg-secondary-50 dark:bg-secondary-900/20 p-6 rounded-lg border border-secondary-200 dark:border-secondary-800">
          <h3 className="text-lg font-bold text-secondary-900 dark:text-secondary-400 mb-3">What's Next?</h3>
          <ul className="space-y-2 text-secondary-800 dark:text-secondary-300">
            <li>✓ Order confirmation email has been sent to your registered email</li>
            <li>✓ You will receive a tracking number once your order is shipped</li>
            <li>✓ You can track your order status in your account dashboard</li>
            <li>✓ For inquiries, please contact our customer support team</li>
          </ul>
        </div>
      </div>

      <footer className="bg-neutral-800 dark:bg-neutral-900 text-white py-8 mt-12">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 Extreme Life Herbal. All rights reserved.</p>
        </div>
      </footer>
    </main>
    </>
  );
}

