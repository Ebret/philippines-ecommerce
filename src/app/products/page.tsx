'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProductGrid } from '@/components/products/product-grid';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { BreadcrumbNav } from '@/components/ui/breadcrumb';
import Navbar from '@/components/layout/navbar';

interface Product {
  id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  price: number;
  comparePrice?: number;
  rating: number;
  reviewCount: number;
  images: Array<{ url: string; isPrimary: boolean }>;
  category?: { name: string };
  vendor?: { storeName: string; id: string };
  isFeatured: boolean;
  status: string;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 12,
    total: 0,
    pages: 1,
  });
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data.categories || []);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: '12',
          ...(selectedCategory && { categoryId: selectedCategory }),
          ...(searchQuery && { search: searchQuery }),
        });

        const response = await fetch(`/api/products?${params}`);
        if (response.ok) {
          const data = await response.json();
          
          // Transform API response to match component expectations
          const transformedProducts = data.products.map((product: any) => ({
            id: product.id,
            title: product.name,
            price: product.variants?.[0]?.price ? Number(product.variants[0].price) : 0,
            originalPrice: product.variants?.[0]?.comparePrice ? Number(product.variants[0].comparePrice) : undefined,
            image: product.images?.[0]?.url || '/placeholder.png',
            imageAlt: product.name,
            rating: Number(product.rating) || 0,
            reviewCount: product.reviewCount || 0,
            vendor: product.vendor ? { name: product.vendor.storeName, id: product.vendorId } : undefined,
            inStock: product.status === 'ACTIVE',
            badge: product.isFeatured ? { label: 'Featured', variant: 'success' as const } : undefined,
          }));

          setProducts(transformedProducts);
          setPagination(data.pagination);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, selectedCategory, searchQuery]);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  // Handle sort
  const handleSort = (value: string) => {
    setSortBy(value);
    // Sorting logic would be implemented in the API
  };

  // Handle add to cart
  const handleAddToCart = (productId: string) => {
    console.log('Add to cart:', productId);
    // Cart logic will be implemented later
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <Navbar />

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 pt-4">
        <BreadcrumbNav items={[{ label: 'Products' }]} />
      </div>

      {/* Page Header */}
      <section className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-4xl font-bold mb-2">Our Products</h1>
          <p className="text-lg text-primary-foreground/90">Discover our premium herbal products for health and wellness</p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Filters */}
          <div className="lg:col-span-1">
            <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
              <h2 className="font-serif text-xl font-bold mb-6 text-foreground">Filters</h2>

              {/* Search */}
              <form onSubmit={handleSearch} className="mb-6">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
                <Button type="submit" variant="accent" rounded="full" className="w-full mt-2">
                  Search
                </Button>
              </form>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="font-serif font-semibold mb-3 text-foreground">Category</h3>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full p-2 border border-border rounded-lg bg-background text-foreground"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div className="mb-6">
                <h3 className="font-serif font-semibold mb-3 text-foreground">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => handleSort(e.target.value)}
                  className="w-full p-2 border border-border rounded-lg bg-background text-foreground"
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="mb-4 flex justify-between items-center">
              <p className="text-muted-foreground">
                Showing {products.length > 0 ? (currentPage - 1) * 12 + 1 : 0} to{' '}
                {Math.min(currentPage * 12, pagination.total)} of {pagination.total} products
              </p>
            </div>

            <ProductGrid
              products={products.map(p => ({
                id: p.id,
                title: p.name,
                price: p.price,
                originalPrice: p.comparePrice,
                image: p.images?.[0]?.url || '/placeholder.jpg',
                rating: p.rating,
                reviewCount: p.reviewCount,
                vendor: p.vendor ? { name: p.vendor.storeName, id: p.vendor.id } : undefined,
                inStock: p.status === 'ACTIVE',
              }))}
              isLoading={isLoading}
              columns={3}
              gap="md"
              onAddToCart={handleAddToCart}
              currentPage={currentPage}
              totalPages={pagination.pages}
              onPageChange={setCurrentPage}
              emptyMessage="No products found. Try adjusting your filters."
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8 mt-12">
        <div className="container mx-auto text-center px-4">
          <p className="text-primary-foreground/80 text-sm">&copy; 2026 Extreme Life Herbal. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}

