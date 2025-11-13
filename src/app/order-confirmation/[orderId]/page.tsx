'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

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
      <main className="min-h-screen bg-white">
        <nav className="bg-gray-800 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold">Extreme Life Herbal</Link>
          </div>
        </nav>
        <div className="container mx-auto py-12 text-center">
          <p className="text-gray-600 mb-4">Please log in to view your order</p>
          <Link href="/auth/login" className="text-green-600 hover:text-green-700 font-semibold">
            Log In
          </Link>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white">
        <nav className="bg-gray-800 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold">Extreme Life Herbal</Link>
          </div>
        </nav>
        <div className="container mx-auto py-12 text-center">
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-white">
        <nav className="bg-gray-800 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold">Extreme Life Herbal</Link>
          </div>
        </nav>
        <div className="container mx-auto py-12 text-center">
          <p className="text-red-600 mb-4">{error || 'Order not found'}</p>
          <Link href="/products" className="text-green-600 hover:text-green-700 font-semibold">
            Back to Products
          </Link>
        </div>
      </main>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <nav className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">Extreme Life Herbal</Link>
          <ul className="flex gap-6">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/products">Products</Link></li>
            <li><Link href="/cart">Cart</Link></li>
          </ul>
        </div>
      </nav>

      <div className="bg-gray-50 py-4">
        <div className="container mx-auto">
          <div className="flex gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-green-600">Home</Link>
            <span>/</span>
            <span className="text-gray-900">Order Confirmation</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-12">
        {/* Success Message */}
        <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-lg text-center">
          <h1 className="text-3xl font-bold text-green-700 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">Thank you for your purchase. Your order has been received.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Header */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold">Order #{order.orderNumber}</h2>
                  <p className="text-gray-600 text-sm">
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
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Shipping Address</h3>
              <div className="space-y-1 text-gray-700">
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
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Order Items</h3>
              <div className="space-y-3">
                {order.items.map(item => (
                  <div key={item.id} className="flex justify-between items-center pb-3 border-b">
                    <div>
                      <p className="font-semibold">{item.productName}</p>
                      <p className="text-sm text-gray-600">{item.vendorName}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold">₱{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Status */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Payment Status</h3>
              <div className={`px-4 py-2 rounded font-semibold inline-block ${
                order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' :
                order.paymentStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {order.paymentStatus}
              </div>
              {order.paymentStatus === 'PENDING' && (
                <p className="text-sm text-gray-600 mt-3">
                  Please complete your payment to confirm your order.
                </p>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 rounded-lg sticky top-4">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₱{order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (12%):</span>
                  <span>₱{order.taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>₱{order.shippingFee.toFixed(2)}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>-₱{order.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-green-600">₱{order.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Link href="/products" className="block w-full text-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded">
                  Continue Shopping
                </Link>
                <Link href="/account/orders" className="block w-full text-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 rounded">
                  View All Orders
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-12 bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h3 className="text-lg font-bold text-blue-900 mb-3">What's Next?</h3>
          <ul className="space-y-2 text-blue-800">
            <li>✓ Order confirmation email has been sent to your registered email</li>
            <li>✓ You will receive a tracking number once your order is shipped</li>
            <li>✓ You can track your order status in your account dashboard</li>
            <li>✓ For inquiries, please contact our customer support team</li>
          </ul>
        </div>
      </div>

      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 Extreme Life Herbal. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}

