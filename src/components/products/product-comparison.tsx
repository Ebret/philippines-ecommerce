/**
 * ProductComparison Component
 * Phase 26.4.4: Product Comparison
 * 
 * Features:
 * - Side-by-side product comparison
 * - Attribute highlighting
 * - Add/remove products
 * - Export comparison
 */

'use client';

import { useState, useMemo } from 'react';
import { 
  Scale, Plus, X, Check, Minus, Star, 
  ShoppingCart, Heart, Download, Share2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface ComparisonProduct {
  id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  compareAtPrice?: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  attributes: Record<string, string | number | boolean>;
  features: string[];
}

interface ProductComparisonProps {
  products: ComparisonProduct[];
  onRemove: (productId: string) => void;
  onAddToCart: (productId: string) => void;
  onAddToWishlist: (productId: string) => void;
  maxProducts?: number;
  className?: string;
}

export function ProductComparison({
  products,
  onRemove,
  onAddToCart,
  onAddToWishlist,
  maxProducts = 4,
  className,
}: ProductComparisonProps) {
  const [highlightDifferences, setHighlightDifferences] = useState(true);

  // Get all unique attributes
  const allAttributes = useMemo(() => {
    const attrs = new Set<string>();
    products.forEach(p => {
      Object.keys(p.attributes).forEach(key => attrs.add(key));
    });
    return Array.from(attrs).sort();
  }, [products]);

  // Get all unique features
  const allFeatures = useMemo(() => {
    const features = new Set<string>();
    products.forEach(p => {
      p.features.forEach(f => features.add(f));
    });
    return Array.from(features).sort();
  }, [products]);

  // Check if attribute values differ
  const attributesDiffer = (attr: string) => {
    const values = products.map(p => p.attributes[attr]);
    return new Set(values.map(v => String(v))).size > 1;
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };

  // Format attribute value
  const formatValue = (value: string | number | boolean | undefined) => {
    if (value === undefined) return '-';
    if (typeof value === 'boolean') return value ? <Check className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-red-500" />;
    return String(value);
  };

  // Render stars
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={cn(
              'w-4 h-4',
              star <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
            )}
          />
        ))}
      </div>
    );
  };

  // Export comparison
  const exportComparison = () => {
    const data = {
      products: products.map(p => ({
        name: p.name,
        price: p.price,
        rating: p.rating,
        attributes: p.attributes,
        features: p.features,
      })),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'product-comparison.json';
    link.click();
  };

  if (products.length === 0) {
    return (
      <div className={cn('text-center py-12 border-2 border-dashed border-border rounded-lg', className)}>
        <Scale className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">No products to compare</p>
        <p className="text-sm text-muted-foreground">Add products to start comparing</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold flex items-center gap-2">
            <Scale className="w-5 h-5 text-primary" />
            Compare Products ({products.length}/{maxProducts})
          </h3>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={highlightDifferences}
              onChange={(e) => setHighlightDifferences(e.target.checked)}
              className="rounded border-border"
            />
            <span className="text-sm">Highlight differences</span>
          </label>
          <Button variant="outline" size="sm" onClick={exportComparison}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          {/* Product Headers */}
          <thead>
            <tr>
              <th className="p-4 text-left bg-muted/50 border border-border w-48">
                <span className="text-sm font-medium text-muted-foreground">Product</span>
              </th>
              {products.map(product => (
                <th key={product.id} className="p-4 border border-border min-w-[200px]">
                  <div className="relative">
                    <button
                      onClick={() => onRemove(product.id)}
                      className="absolute -top-2 -right-2 p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-32 object-contain mb-3"
                    />
                    <h4 className="font-medium text-sm line-clamp-2">{product.name}</h4>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {/* Price Row */}
            <tr>
              <td className="p-4 bg-muted/50 border border-border font-medium text-sm">Price</td>
              {products.map(product => (
                <td key={product.id} className="p-4 border border-border text-center">
                  <span className="text-lg font-bold text-primary">
                    {formatCurrency(product.price)}
                  </span>
                  {product.compareAtPrice && product.compareAtPrice > product.price && (
                    <span className="block text-sm text-muted-foreground line-through">
                      {formatCurrency(product.compareAtPrice)}
                    </span>
                  )}
                </td>
              ))}
            </tr>

            {/* Rating Row */}
            <tr>
              <td className="p-4 bg-muted/50 border border-border font-medium text-sm">Rating</td>
              {products.map(product => (
                <td key={product.id} className="p-4 border border-border">
                  <div className="flex flex-col items-center gap-1">
                    {renderStars(product.rating)}
                    <span className="text-sm text-muted-foreground">
                      ({product.reviewCount} reviews)
                    </span>
                  </div>
                </td>
              ))}
            </tr>

            {/* Availability Row */}
            <tr>
              <td className="p-4 bg-muted/50 border border-border font-medium text-sm">Availability</td>
              {products.map(product => (
                <td key={product.id} className="p-4 border border-border text-center">
                  {product.inStock ? (
                    <span className="text-green-600 font-medium">In Stock</span>
                  ) : (
                    <span className="text-red-600 font-medium">Out of Stock</span>
                  )}
                </td>
              ))}
            </tr>

            {/* Attributes */}
            {allAttributes.map(attr => {
              const differs = attributesDiffer(attr);
              return (
                <tr key={attr}>
                  <td className="p-4 bg-muted/50 border border-border font-medium text-sm">
                    {attr}
                  </td>
                  {products.map(product => (
                    <td
                      key={product.id}
                      className={cn(
                        'p-4 border border-border text-center',
                        highlightDifferences && differs && 'bg-amber-50 dark:bg-amber-900/20'
                      )}
                    >
                      {formatValue(product.attributes[attr])}
                    </td>
                  ))}
                </tr>
              );
            })}

            {/* Features */}
            <tr>
              <td className="p-4 bg-muted/50 border border-border font-medium text-sm" colSpan={products.length + 1}>
                Features
              </td>
            </tr>
            {allFeatures.map(feature => (
              <tr key={feature}>
                <td className="p-4 bg-muted/50 border border-border text-sm">{feature}</td>
                {products.map(product => (
                  <td key={product.id} className="p-4 border border-border text-center">
                    {product.features.includes(feature) ? (
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    ) : (
                      <Minus className="w-5 h-5 text-gray-300 mx-auto" />
                    )}
                  </td>
                ))}
              </tr>
            ))}

            {/* Actions Row */}
            <tr>
              <td className="p-4 bg-muted/50 border border-border font-medium text-sm">Actions</td>
              {products.map(product => (
                <td key={product.id} className="p-4 border border-border">
                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      onClick={() => onAddToCart(product.id)}
                      disabled={!product.inStock}
                      className="w-full"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onAddToWishlist(product.id)}
                      className="w-full"
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      Wishlist
                    </Button>
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

