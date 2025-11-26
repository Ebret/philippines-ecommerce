'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight } from 'lucide-react';
import Navbar from '@/components/layout/navbar';

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
      <>
        <Navbar />
        <main className="min-h-screen bg-white dark:bg-neutral-950">
        <div className="container mx-auto px-4 md:px-8 py-20 text-center">
          <div className="inline-block">
            <div className="text-6xl mb-4">🔐</div>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6 font-medium text-lg">Please log in to view your cart</p>
            <Link href="/auth/login" className="inline-block px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 dark:from-primary-500 dark:to-primary-600 dark:hover:from-primary-600 dark:hover:to-primary-700 text-white font-semibold rounded-lg transition-all duration-200">
              Log In
            </Link>
          </div>
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
        <div className="container mx-auto px-4 md:px-8 py-20 text-center">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-primary-400 mb-4"></div>
            <p className="text-neutral-600 dark:text-neutral-400 font-medium">Loading cart...</p>
          </div>
        </div>
      </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white dark:bg-neutral-950">
      {/* Breadcrumb */}
      <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 py-4 border-b border-neutral-200 dark:border-neutral-700">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex gap-2 text-sm text-neutral-600 dark:text-neutral-400">
            <Link href="/" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-neutral-900 dark:text-white font-semibold">Shopping Cart</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-12">
        {error && (
          <div className="mb-6 p-4 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg text-error-700 dark:text-error-400 font-medium">
            {error}
          </div>
        )}

        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block">
              <div className="text-6xl mb-4">🛒</div>
              <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-2">Your Cart is Empty</h1>
              <p className="text-neutral-600 dark:text-neutral-400 mb-8 text-lg">Start shopping to add items to your cart</p>
              <Link href="/products" className="inline-block px-8 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 dark:from-primary-500 dark:to-primary-600 dark:hover:from-primary-600 dark:hover:to-primary-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-2">Shopping Cart</h1>
                <p className="text-neutral-600 dark:text-neutral-400">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart</p>
              </div>
              <div className="space-y-4">
                {cartItems.map(item => (
                  <div key={item.id} className="group flex gap-4 p-5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                    {item.image && (
                      <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-700">
                        <img src={item.image} alt={item.productName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-neutral-900 dark:text-white text-lg line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{item.productName}</h3>
                      <p className="text-sm text-primary-600 dark:text-primary-400 font-semibold uppercase tracking-wide">{item.vendorName}</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">SKU: {item.sku || 'N/A'}</p>
                      <p className="font-bold text-primary-600 dark:text-primary-400 text-lg mt-2">₱{item.price.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</p>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-700 rounded-lg p-1">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4 text-neutral-600 dark:text-neutral-300" />
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
                          className="w-10 p-1 text-center bg-transparent text-neutral-900 dark:text-white font-semibold border-0 focus:outline-none"
                        />
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4 text-neutral-600 dark:text-neutral-300" />
                        </button>
                      </div>
                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-2 text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/20 rounded-lg transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={handleClearCart}
                className="mt-8 px-4 py-2 text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/20 rounded-lg font-semibold transition-colors"
              >
                Clear Cart
              </button>
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 sticky top-4">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">Order Summary</h2>

                {/* Price Breakdown */}
                <div className="space-y-4 mb-6 pb-6 border-b border-neutral-200 dark:border-neutral-700">
                  <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                    <span>Subtotal:</span>
                    <span className="font-semibold">₱{cartSummary.subtotal.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                    <span>Tax (12%):</span>
                    <span className="font-semibold">₱{cartSummary.taxAmount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                    <span>Shipping:</span>
                    <span className="font-semibold">₱{cartSummary.shippingFee.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
                  </div>
                  {cartSummary.discountAmount > 0 && (
                    <div className="flex justify-between text-primary-600 dark:text-primary-400 font-semibold">
                      <span>Discount:</span>
                      <span>-₱{cartSummary.discountAmount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-bold text-neutral-900 dark:text-white">Total:</span>
                  <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">₱{cartSummary.totalAmount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
                </div>

                {/* Promo Code */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-neutral-900 dark:text-white mb-2">Promo Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1 px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      disabled={!!appliedPromo}
                    />
                    <button
                      onClick={handleApplyPromo}
                      disabled={!!appliedPromo}
                      className="px-4 py-2 bg-secondary-600 hover:bg-secondary-700 dark:bg-secondary-500 dark:hover:bg-secondary-600 text-white rounded-lg font-semibold transition-colors disabled:bg-neutral-400 dark:disabled:bg-neutral-600"
                    >
                      Apply
                    </button>
                  </div>
                  {appliedPromo && (
                    <p className="text-sm text-primary-600 dark:text-primary-400 mt-2 font-semibold">✓ Promo code "{appliedPromo}" applied</p>
                  )}
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  className="w-full px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 dark:from-primary-500 dark:to-primary-600 dark:hover:from-primary-600 dark:hover:to-primary-700 text-white font-bold rounded-lg transition-all duration-200 mb-3 flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Proceed to Checkout
                </button>
                <Link href="/products" className="block w-full text-center px-6 py-3 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-900 dark:text-white font-semibold rounded-lg transition-colors">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="bg-neutral-900 dark:bg-black text-white py-12 px-4 md:px-8 mt-12">
        <div className="container mx-auto text-center">
          <p className="text-neutral-400">&copy; 2025 Extreme Life Herbal. All rights reserved.</p>
        </div>
      </footer>
    </main>
    </>
  );
}

