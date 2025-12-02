'use client';

import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AnimatedGrid } from '@/components/ui/animated-grid';

/**
 * Featured Products Section with Staggered Animations
 * 
 * Displays a grid of featured products with smooth fade-in animations
 * that trigger when the section enters the viewport.
 */

// Product data (in a real app, this would come from an API)
const featuredProducts = [
  {
    id: 1,
    name: 'Premium Herbal Tea Blend',
    description: 'Premium herbal tea blend for relaxation and wellness',
    price: 199,
    emoji: '🍃',
    category: 'Herbal Tea',
    badge: 'Popular',
    badgeVariant: 'default' as const,
    rating: 5,
    reviews: 128,
  },
  {
    id: 2,
    name: 'Natural Vitamin Supplement',
    description: 'Natural vitamin supplement for daily vitality',
    price: 299,
    emoji: '💊',
    category: 'Supplements',
    badge: 'Best Seller',
    badgeVariant: 'accent' as const,
    discount: 20,
    rating: 5,
    reviews: 256,
  },
  {
    id: 3,
    name: 'Organic Essential Oils',
    description: 'Pure essential oils for aromatherapy',
    price: 349,
    emoji: '🌿',
    category: 'Essential Oils',
    badge: 'In Stock',
    badgeVariant: 'inStock' as const,
    rating: 5,
    reviews: 89,
  },
];

export function FeaturedProducts() {
  return (
    <section className="py-20 px-4 md:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
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
            <Card key={product.id} variant="product" className="group h-full">
              {/* Product Image */}
              <div className="relative h-48 bg-muted flex items-center justify-center overflow-hidden">
                <span className="text-6xl transition-transform duration-500 group-hover:scale-110">
                  {product.emoji}
                </span>
                <Badge variant="category" size="sm" className="absolute top-3 right-3">
                  {product.category}
                </Badge>
                {product.discount && (
                  <Badge variant="discount" size="sm" className="absolute top-3 left-3">
                    -{product.discount}%
                  </Badge>
                )}
              </div>

              {/* Product Info */}
              <div className="p-6">
                <h3 className="font-serif text-lg font-bold leading-tight text-foreground mb-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  {product.description}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(product.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                  <span className="text-sm text-muted-foreground ml-2">
                    ({product.reviews})
                  </span>
                </div>

                {/* Price and Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-primary">
                    ₱{product.price}
                  </span>
                  <Badge variant={product.badgeVariant} size="sm">
                    {product.badge}
                  </Badge>
                </div>

                {/* Add to Cart Button */}
                <Button className="w-full" rounded="full">
                  Add to Cart
                </Button>
              </div>
            </Card>
          ))}
        </AnimatedGrid>
      </div>
    </section>
  );
}

export default FeaturedProducts;

