'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ProductDetail } from '@/components/products/product-detail';
import { ReviewList } from '@/components/reviews/review-list';
import { ReviewForm } from '@/components/reviews/review-form';

interface ProductData {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  comparePrice?: number;
  rating: number;
  reviewCount: number;
  images: Array<{ id: string; url: string; altText?: string }>;
  category?: { id: string; name: string };
  vendor?: { id: string; storeName: string };
  sku?: string;
  specifications?: Array<{ label: string; value: string }>;
  reviews?: Array<{
    id: string;
    author: string;
    rating: number;
    comment: string;
    date: string;
  }>;
  status: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [product, setProduct] = useState<ProductData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        // First, try to fetch by slug from search endpoint
        const response = await fetch(`/api/products/search?q=${slug}`);
        if (response.ok) {
          const data = await response.json();
          if (data.products && data.products.length > 0) {
            const productData = data.products[0];
            setProduct({
              id: productData.id,
              name: productData.name,
              slug: productData.slug,
              description: productData.description || '',
              shortDescription: productData.shortDescription || '',
              price: productData.variants?.[0]?.price ? Number(productData.variants[0].price) : 0,
              comparePrice: productData.variants?.[0]?.comparePrice ? Number(productData.variants[0].comparePrice) : undefined,
              rating: Number(productData.rating) || 0,
              reviewCount: productData.reviewCount || 0,
              images: productData.images || [],
              category: productData.category,
              vendor: productData.vendor ? { id: productData.vendorId, storeName: productData.vendor.storeName } : undefined,
              sku: productData.variants?.[0]?.sku,
              status: productData.status,
              specifications: [
                { label: 'Brand', value: productData.brand || 'N/A' },
                { label: 'Condition', value: productData.condition || 'New' },
                { label: 'Weight', value: productData.weight ? `${productData.weight} kg` : 'N/A' },
              ],
              reviews: [],
            });
            return;
          }
        }
        setError('Product not found');
      } catch (error) {
        console.error('Failed to fetch product:', error);
        setError('Failed to load product details');
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const handleAddToCart = () => {
    console.log('Add to cart:', product?.id);
    // Cart logic will be implemented later
  };

  const handleBuyNow = () => {
    console.log('Buy now:', product?.id);
    // Checkout logic will be implemented later
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white dark:bg-neutral-950">
        <div className="container mx-auto py-20 text-center">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-primary-400 mb-4"></div>
            <p className="text-neutral-600 dark:text-neutral-400 font-medium">Loading product details...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-white dark:bg-neutral-950">
        <div className="container mx-auto py-20 text-center">
          <div className="inline-block">
            <div className="text-6xl mb-4">⚠️</div>
            <p className="text-error-600 dark:text-error-400 mb-6 font-semibold text-lg">{error || 'Product not found'}</p>
            <Link href="/products" className="inline-block px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 dark:from-primary-500 dark:to-primary-600 dark:hover:from-primary-600 dark:hover:to-primary-700 text-white font-semibold rounded-lg transition-all duration-200">
              Back to Products
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950">
      {/* Breadcrumb */}
      <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 py-4 border-b border-neutral-200 dark:border-neutral-700">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex gap-2 text-sm text-neutral-600 dark:text-neutral-400">
            <Link href="/" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Products</Link>
            <span>/</span>
            <span className="text-neutral-900 dark:text-white font-semibold">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Detail */}
      <div className="container mx-auto px-4 md:px-8 py-12">
        <ProductDetail
          id={product.id}
          title={product.name}
          description={product.description}
          price={product.price}
          originalPrice={product.comparePrice}
          images={product.images}
          rating={product.rating}
          reviewCount={product.reviewCount}
          vendor={product.vendor ? { id: product.vendor.id, name: product.vendor.storeName } : undefined}
          inStock={product.status === 'ACTIVE'}
          sku={product.sku}
          category={product.category?.name}
          specifications={product.specifications}
          reviews={product.reviews}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
        />
      </div>

      {/* Reviews Section */}
      <div className="bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-950 py-16 border-t border-neutral-200 dark:border-neutral-800">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-neutral-900 dark:text-white mb-2">Customer Reviews</h2>
            <p className="text-neutral-600 dark:text-neutral-400">See what customers think about this product</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {product.reviews && product.reviews.length > 0 ? (
                <ReviewList reviews={product.reviews.map(review => ({
                  id: review.id,
                  rating: review.rating,
                  title: 'Review',
                  content: review.comment,
                  author: { name: review.author, id: review.id },
                  createdAt: review.date,
                }))} />
              ) : (
                <div className="text-center py-12 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
                  <div className="text-5xl mb-4">💬</div>
                  <p className="text-neutral-600 dark:text-neutral-400 font-medium">No reviews yet. Be the first to review this product!</p>
                </div>
              )}
            </div>
            <div>
              <ReviewForm productId={product.id} />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-neutral-900 dark:bg-black text-white py-12 px-4 md:px-8">
        <div className="container mx-auto text-center">
          <p className="text-neutral-400">&copy; 2025 Extreme Life Herbal. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}

