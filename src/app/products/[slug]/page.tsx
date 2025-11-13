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
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </main>
    );
  }

  if (error || !product) {
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
          <p className="text-red-600 mb-4">{error || 'Product not found'}</p>
          <Link href="/products" className="text-green-600 hover:text-green-700">
            Back to Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
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

      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto">
          <div className="flex gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-green-600">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-green-600">Products</Link>
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Detail */}
      <div className="container mx-auto py-12">
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
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>
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
                <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
              )}
            </div>
            <div>
              <ReviewForm productId={product.id} />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 Extreme Life Herbal. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}

