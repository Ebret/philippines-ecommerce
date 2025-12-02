'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProductGrid } from '@/components/products/product-grid';
import Navbar from '@/components/layout/navbar';
import { BreadcrumbNav } from '@/components/ui/breadcrumb';

export const dynamic = 'force-dynamic';

interface Filter {
  priceRange: { min: number; max: number };
  categories: Array<{ id: string; name: string; count: number }>;
  brands: Array<{ name: string }>;
  conditions: string[];
  ratings: Array<{ stars: number; count: number }>;
}

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(query);
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

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

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
    return (
      <>
        <Navbar />
        <div className="container mx-auto py-12 px-4">Loading filters...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-12 px-4">
          {/* Breadcrumb */}
          <BreadcrumbNav items={[{ label: 'Search' }]} />

          {/* Search Header */}
          <div className="mb-8">
            <h1 className="font-serif text-3xl font-bold text-primary mb-4">
              {query ? `Results for "${query}"` : 'Search Products'}
            </h1>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="flex gap-2 max-w-xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search for herbal products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
              <Button type="submit" className="h-12 px-6">
                Search
              </Button>
            </form>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-card p-6 rounded-xl border border-border shadow-sm space-y-6">
                <h2 className="font-serif text-xl font-bold text-foreground">Filters</h2>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-serif font-semibold mb-2 text-foreground">Price Range</label>
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
                <label className="block text-sm font-serif font-semibold mb-2 text-foreground">Category</label>
                <select
                  value={selectedFilters.categoryId}
                  onChange={(e) => handleFilterChange('categoryId', e.target.value)}
                  className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground"
                >
                  <option value="">All Categories</option>
                  {filters.categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name} ({cat.count})</option>
                  ))}
                </select>
              </div>

              {/* Brand */}
              <div>
                <label className="block text-sm font-serif font-semibold mb-2 text-foreground">Brand</label>
                <select
                  value={selectedFilters.brand}
                  onChange={(e) => handleFilterChange('brand', e.target.value)}
                  className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground"
                >
                  <option value="">All Brands</option>
                  {filters.brands.map(brand => (
                    <option key={brand.name} value={brand.name}>{brand.name}</option>
                  ))}
                </select>
              </div>

              {/* Condition */}
              <div>
                <label className="block text-sm font-serif font-semibold mb-2 text-foreground">Condition</label>
                <select
                  value={selectedFilters.condition}
                  onChange={(e) => handleFilterChange('condition', e.target.value)}
                  className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground"
                >
                  <option value="">All Conditions</option>
                  {filters.conditions.map(cond => (
                    <option key={cond} value={cond}>{cond}</option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-serif font-semibold mb-2 text-foreground">Sort By</label>
                <select
                  value={selectedFilters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground"
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
    </div>
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <>
        <Navbar />
        <div className="container mx-auto py-12">Loading search...</div>
      </>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
