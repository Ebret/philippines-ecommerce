'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProductGrid } from '@/components/products/product-grid';

interface Filter {
  priceRange: { min: number; max: number };
  categories: Array<{ id: string; name: string; count: number }>;
  brands: Array<{ name: string }>;
  conditions: string[];
  ratings: Array<{ stars: number; count: number }>;
}

function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [filters, setFilters] = useState<Filter | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [selectedFilters, setSelectedFilters] = useState({
    minPrice: 0,
    maxPrice: 100000,
    categoryId: '',
    brand: '',
    condition: '',
    minRating: 0,
    inStock: false,
    sortBy: 'newest',
  });

  // Fetch filters
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await fetch('/api/search/filters');
        if (response.ok) {
          const data = await response.json();
          setFilters(data);
          setSelectedFilters(prev => ({
            ...prev,
            minPrice: data.priceRange.min,
            maxPrice: data.priceRange.max,
          }));
        }
      } catch (error) {
        console.error('Failed to fetch filters:', error);
      }
    };
    fetchFilters();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          query: query || '',
          page: currentPage.toString(),
          limit: '12',
          minPrice: selectedFilters.minPrice.toString(),
          maxPrice: selectedFilters.maxPrice.toString(),
          sortBy: selectedFilters.sortBy,
          ...(selectedFilters.categoryId && { categoryId: selectedFilters.categoryId }),
          ...(selectedFilters.brand && { brand: selectedFilters.brand }),
          ...(selectedFilters.condition && { condition: selectedFilters.condition }),
          ...(selectedFilters.minRating && { minRating: selectedFilters.minRating.toString() }),
          ...(selectedFilters.inStock && { inStock: 'true' }),
        });

        const response = await fetch(`/api/search/results?${params}`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data.products);
          setTotalPages(data.pagination.pages);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [query, currentPage, selectedFilters]);

  const handleFilterChange = (key: string, value: any) => {
    setSelectedFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  if (!filters) {
    return <div className="container mx-auto py-12">Loading filters...</div>;
  }

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">Search Results</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-6 rounded-lg space-y-6">
            <h2 className="text-xl font-bold">Filters</h2>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-semibold mb-2">Price Range</label>
              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={selectedFilters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', parseFloat(e.target.value))}
                  className="w-full"
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={selectedFilters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold mb-2">Category</label>
              <select
                value={selectedFilters.categoryId}
                onChange={(e) => handleFilterChange('categoryId', e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">All Categories</option>
                {filters.categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name} ({cat.count})</option>
                ))}
              </select>
            </div>

            {/* Brand */}
            <div>
              <label className="block text-sm font-semibold mb-2">Brand</label>
              <select
                value={selectedFilters.brand}
                onChange={(e) => handleFilterChange('brand', e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">All Brands</option>
                {filters.brands.map(brand => (
                  <option key={brand.name} value={brand.name}>{brand.name}</option>
                ))}
              </select>
            </div>

            {/* Condition */}
            <div>
              <label className="block text-sm font-semibold mb-2">Condition</label>
              <select
                value={selectedFilters.condition}
                onChange={(e) => handleFilterChange('condition', e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">All Conditions</option>
                {filters.conditions.map(cond => (
                  <option key={cond} value={cond}>{cond}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-semibold mb-2">Sort By</label>
              <select
                value={selectedFilters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="newest">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="sales">Most Popular</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="lg:col-span-3">
          <ProductGrid
            products={products.map(p => ({
              id: p.id,
              title: p.name,
              price: p.price,
              image: p.image,
              rating: p.rating,
              reviewCount: p.reviewCount,
              vendor: p.vendor ? { name: p.vendor, id: '' } : undefined,
              inStock: p.inStock,
            }))}
            isLoading={isLoading}
            columns={3}
            gap="md"
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            emptyMessage="No products found matching your criteria."
          />
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container mx-auto py-12">Loading search...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
