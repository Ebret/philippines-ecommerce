'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface CartItem {
  id: string;
  variantId: string;
  productId: string;
  productName: string;
  vendorId: string;
  vendorName: string;
  price: number;
  quantity: number;
  image: string;
  sku?: string;
}

interface CartSummary {
  subtotal: number;
  taxAmount: number;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
  itemCount: number;
  vendorCount: number;
}

export default function CartPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartSummary, setCartSummary] = useState<CartSummary>({
    subtotal: 0,
    taxAmount: 0,
    shippingFee: 0,
    discountAmount: 0,
    totalAmount: 0,
    itemCount: 0,
    vendorCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);

  // Fetch cart data
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/cart');
        if (response.ok) {
          const data = await response.json();
          setCartItems(data.items || []);
          setCartSummary(data.summary || {
            subtotal: 0,
            taxAmount: 0,
            shippingFee: 0,
            discountAmount: 0,
            totalAmount: 0,
            itemCount: 0,
            vendorCount: 0,
          });
        } else {
          setError('Failed to load cart');
        }
      } catch (err) {
        console.error('Error fetching cart:', err);
        setError('Failed to load cart');
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user) {
      fetchCart();
    }
  }, [session]);

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveItem(itemId);
      return;
    }

    try {
      const response = await fetch(`/api/cart/items/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (response.ok) {
        const updatedItem = await response.json();
        setCartItems(cartItems.map(item => item.id === itemId ? updatedItem.item : item));
      }
    } catch (err) {
      console.error('Error updating quantity:', err);
      setError('Failed to update quantity');
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      const response = await fetch(`/api/cart/items/${itemId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCartItems(cartItems.filter(item => item.id !== itemId));
      }
    } catch (err) {
      console.error('Error removing item:', err);
      setError('Failed to remove item');
    }
  };

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;

    try {
      const response = await fetch('/api/checkout/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ couponCode: promoCode }),
      });

      if (response.ok) {
        const data = await response.json();
        setAppliedPromo(promoCode);
        setPromoCode('');
        // Update cart summary with discount
        setCartSummary(prev => ({
          ...prev,
          discountAmount: data.discountAmount || 0,
          totalAmount: data.totalAmount || prev.totalAmount,
        }));
      } else {
        setError('Invalid promo code');
      }
    } catch (err) {
      console.error('Error applying promo:', err);
      setError('Failed to apply promo code');
    }
  };

  const handleClearCart = async () => {
    if (!confirm('Are you sure you want to clear your cart?')) return;

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clear' }),
      });

      if (response.ok) {
        setCartItems([]);
        setCartSummary({
          subtotal: 0,
          taxAmount: 0,
          shippingFee: 0,
          discountAmount: 0,
          totalAmount: 0,
          itemCount: 0,
          vendorCount: 0,
        });
      }
    } catch (err) {
      console.error('Error clearing cart:', err);
      setError('Failed to clear cart');
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      setError('Your cart is empty');
      return;
    }
    router.push('/checkout');
  };

  if (!session?.user) {
    return (
      <main className="min-h-screen bg-white">
        <nav className="bg-gray-800 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold">Extreme Life Herbal</Link>
            <ul className="flex gap-6">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/products">Products</Link></li>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>
        </nav>
        <div className="container mx-auto py-12 text-center">
          <p className="text-gray-600 mb-4">Please log in to view your cart</p>
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
          <p className="text-gray-600">Loading cart...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <nav className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">Extreme Life Herbal</Link>
          <ul className="flex gap-6">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/products">Products</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>
      </nav>

      <div className="bg-gray-50 py-4">
        <div className="container mx-auto">
          <div className="flex gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-green-600">Home</Link>
            <span>/</span>
            <span className="text-gray-900">Shopping Cart</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-12">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-700">
            {error}
          </div>
        )}

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-6">Start shopping to add items to your cart</p>
            <Link href="/products" className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-bold mb-6">Shopping Cart ({cartItems.length} items)</h1>
              <div className="space-y-4">
                {cartItems.map(item => (
                  <div key={item.id} className="flex gap-4 p-4 border border-gray-200 rounded-lg">
                    {item.image && (
                      <img src={item.image} alt={item.productName} className="w-24 h-24 object-cover rounded" />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.productName}</h3>
                      <p className="text-sm text-gray-600">{item.vendorName}</p>
                      <p className="text-sm text-gray-600">SKU: {item.sku || 'N/A'}</p>
                      <p className="font-bold text-green-600 mt-2">₱{item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 border border-gray-300 rounded">-</button>
                        <input type="number" value={item.quantity} onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value) || 1)} className="w-12 p-1 border border-gray-300 rounded text-center" />
                        <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 border border-gray-300 rounded">+</button>
                      </div>
                      <button onClick={() => handleRemoveItem(item.id)} className="text-red-600 hover:text-red-700 text-sm font-semibold">
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={handleClearCart} className="mt-6 text-red-600 hover:text-red-700 font-semibold">
                Clear Cart
              </button>
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 p-6 rounded-lg sticky top-4">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₱{cartSummary.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (12%):</span>
                    <span>₱{cartSummary.taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>₱{cartSummary.shippingFee.toFixed(2)}</span>
                  </div>
                  {cartSummary.discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount:</span>
                      <span>-₱{cartSummary.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t pt-3 flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-green-600">₱{cartSummary.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2">Promo Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1 p-2 border border-gray-300 rounded"
                      disabled={!!appliedPromo}
                    />
                    <button
                      onClick={handleApplyPromo}
                      disabled={!!appliedPromo}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:bg-gray-400"
                    >
                      Apply
                    </button>
                  </div>
                  {appliedPromo && (
                    <p className="text-sm text-green-600 mt-2">Promo code "{appliedPromo}" applied</p>
                  )}
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded mb-3"
                >
                  Proceed to Checkout
                </button>
                <Link href="/products" className="block w-full text-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 Extreme Life Herbal. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}

