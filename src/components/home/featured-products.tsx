'use client';

import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AnimatedGrid } from '@/components/ui/animated-grid';

/**
 * Featured Products Section with Staggered Animations
 *
 * Displays a grid of featured products with smooth fade-in animations
 * that trigger when the section enters the viewport.
 * Uses solid white/dark background cards for maximum readability.
 */

// Product data (in a real app, this would come from an API)
const featuredProducts = [
  {
    id: 1,
    name: 'Herbal Tea',
    description: 'Premium herbal tea blend',
    price: 199,
    emoji: '🍃',
    category: 'Tea',
    badge: 'Popular',
    rating: 5,
    reviews: 128,
  },
  {
    id: 2,
    name: 'Vitamin Supplement',
    description: 'Natural vitamin supplement',
    price: 299,
    emoji: '💊',
    category: 'Supplements',
    badge: 'Best Seller',
    discount: 20,
    rating: 5,
    reviews: 256,
  },
  {
    id: 3,
    name: 'Herbal Oil',
    description: 'Pure herbal oil extract',
    price: 349,
    emoji: '🌿',
    category: 'Oils',
    badge: 'New',
    rating: 5,
    reviews: 89,
  },
];

export function FeaturedProducts() {
  return (
    <section className="py-20 px-4 md:px-8 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Discover our most popular herbal wellness products trusted by thousands
          </p>
        </div>

        {/* Animated Product Grid */}
        <AnimatedGrid
          columns={3}
          staggerDelay={150}
          gap="lg"
          animateOnce={true}
        >
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="group h-full bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              {/* Product Image */}
              <div className="relative h-48 bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                <span className="text-6xl transition-transform duration-500 group-hover:scale-110">
                  {product.emoji}
                </span>
                <span className="absolute top-3 right-3 px-3 py-1 text-xs font-semibold bg-emerald-600 text-white rounded-full">
                  {product.category}
                </span>
                {product.discount && (
                  <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold bg-red-500 text-white rounded-full">
                    -{product.discount}%
                  </span>
                )}
              </div>

              {/* Product Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {product.name}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4 text-sm">
                  {product.description}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(product.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-sm text-slate-500 dark:text-slate-400 ml-2">
                    ({product.reviews})
                  </span>
                </div>

                {/* Price and Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    ₱{product.price}
                  </span>
                  <span className="px-3 py-1 text-xs font-semibold bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 rounded-full">
                    {product.badge}
                  </span>
                </div>

                {/* Add to Cart Button */}
                <button className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-full transition-colors duration-200">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </AnimatedGrid>
      </div>
    </section>
  );
}

export default FeaturedProducts;

