# Getting Started: UI Development Guide
## Philippines E-Commerce Platform

**Date**: November 2, 2025

---

## 1. SETUP & INSTALLATION

### 1.1 Install Required Dependencies

```bash
cd philippines-ecommerce

# Install Storybook
npm install -D @storybook/react @storybook/addon-essentials @storybook/addon-interactions

# Install UI component libraries
npm install @radix-ui/react-primitive @radix-ui/react-slot

# Install testing libraries
npm install -D @testing-library/react @testing-library/jest-dom

# Install design tools
npm install -D tailwindcss postcss autoprefixer

# Install accessibility tools
npm install -D @axe-core/react
```

### 1.2 Initialize Storybook

```bash
npx storybook@latest init --type react
```

### 1.3 Configure Tailwind CSS

```bash
npx tailwindcss init -p
```

Update `tailwind.config.ts`:
```typescript
export default {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B35',
        secondary: '#004E89',
        success: '#06A77D',
        warning: '#F77F00',
        error: '#D62828',
      },
    },
  },
  plugins: [],
}
```

---

## 2. CREATE BASE COMPONENTS

### 2.1 Card Component

```typescript
// src/components/ui/card.tsx
import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow-md p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: CardProps) {
  return <div className={`mb-4 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = '' }: CardProps) {
  return <h2 className={`text-xl font-bold ${className}`}>{children}</h2>;
}

export function CardContent({ children, className = '' }: CardProps) {
  return <div className={className}>{children}</div>;
}
```

### 2.2 Badge Component

```typescript
// src/components/ui/badge.tsx
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error';
  className?: string;
}

export function Badge({ 
  children, 
  variant = 'default',
  className = '' 
}: BadgeProps) {
  const variants = {
    default: 'bg-gray-200 text-gray-800',
    success: 'bg-green-200 text-green-800',
    warning: 'bg-yellow-200 text-yellow-800',
    error: 'bg-red-200 text-red-800',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
```

### 2.3 Avatar Component

```typescript
// src/components/ui/avatar.tsx
interface AvatarProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Avatar({ src, alt, size = 'md', className = '' }: AvatarProps) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  return (
    <img
      src={src || `https://api.dicebear.com/7.x/avataaars/svg?seed=${alt}`}
      alt={alt}
      className={`rounded-full object-cover ${sizes[size]} ${className}`}
    />
  );
}
```

---

## 3. CREATE LAYOUT COMPONENTS

### 3.1 Header Component

```typescript
// src/components/layout/Header.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-primary">
          PhilippeStore
        </Link>

        {/* Search Bar - Hidden on mobile */}
        <div className="hidden md:flex flex-1 mx-8">
          <Input
            type="search"
            placeholder="Search products..."
            className="w-full"
          />
        </div>

        {/* Navigation - Hidden on mobile */}
        <nav className="hidden md:flex gap-6">
          <Link href="/products" className="hover:text-primary">
            Products
          </Link>
          <Link href="/vendors" className="hover:text-primary">
            Vendors
          </Link>
          <Link href="/about" className="hover:text-primary">
            About
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex gap-4 items-center">
          <Link href="/cart" className="relative">
            <span className="text-2xl">🛒</span>
            <span className="absolute -top-2 -right-2 bg-error text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              0
            </span>
          </Link>
          <Button variant="outline" size="sm">
            Sign In
          </Button>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <nav className="md:hidden bg-gray-50 p-4 space-y-2">
          <Link href="/products" className="block py-2">
            Products
          </Link>
          <Link href="/vendors" className="block py-2">
            Vendors
          </Link>
          <Link href="/about" className="block py-2">
            About
          </Link>
        </nav>
      )}
    </header>
  );
}
```

### 3.2 Footer Component

```typescript
// src/components/layout/Footer.tsx
export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-bold mb-4">About</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-primary">About Us</a></li>
            <li><a href="#" className="hover:text-primary">Careers</a></li>
            <li><a href="#" className="hover:text-primary">Blog</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-4">Support</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-primary">Help Center</a></li>
            <li><a href="#" className="hover:text-primary">Contact Us</a></li>
            <li><a href="#" className="hover:text-primary">FAQ</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-4">Legal</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-primary">Privacy</a></li>
            <li><a href="#" className="hover:text-primary">Terms</a></li>
            <li><a href="#" className="hover:text-primary">Cookies</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-4">Follow Us</h3>
          <div className="flex gap-4">
            <a href="#" className="hover:text-primary">Facebook</a>
            <a href="#" className="hover:text-primary">Twitter</a>
            <a href="#" className="hover:text-primary">Instagram</a>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
        <p>&copy; 2025 PhilippeStore. All rights reserved.</p>
      </div>
    </footer>
  );
}
```

---

## 4. CREATE PRODUCT COMPONENTS

### 4.1 Product Card Component

```typescript
// src/components/product/ProductCard.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  vendor: string;
  isNew?: boolean;
  onAddToCart?: () => void;
}

export function ProductCard({
  id,
  name,
  price,
  image,
  rating,
  reviews,
  vendor,
  isNew,
  onAddToCart,
}: ProductCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={image}
          alt={name}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        {isNew && (
          <Badge variant="success" className="absolute top-2 right-2">
            New
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg mb-2 line-clamp-2">{name}</h3>
        <p className="text-sm text-gray-600 mb-2">{vendor}</p>
        
        <div className="flex items-center gap-2 mb-3">
          <span className="text-yellow-500">★</span>
          <span className="text-sm">{rating} ({reviews} reviews)</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-primary">
            ₱{price.toLocaleString()}
          </span>
          <Button size="sm" onClick={onAddToCart}>
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
```

### 4.2 Product Grid Component

```typescript
// src/components/product/ProductGrid.tsx
import { ProductCard } from './ProductCard';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  vendor: string;
  isNew?: boolean;
}

interface ProductGridProps {
  products: Product[];
  onAddToCart?: (productId: string) => void;
}

export function ProductGrid({ products, onAddToCart }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          {...product}
          onAddToCart={() => onAddToCart?.(product.id)}
        />
      ))}
    </div>
  );
}
```

---

## 5. CREATE STORYBOOK STORIES

### 5.1 ProductCard Story

```typescript
// src/components/product/ProductCard.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ProductCard } from './ProductCard';

const meta = {
  title: 'Components/ProductCard',
  component: ProductCard,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ProductCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: '1',
    name: 'Premium Wireless Headphones',
    price: 2999,
    image: 'https://via.placeholder.com/300x200',
    rating: 4.5,
    reviews: 128,
    vendor: 'TechStore PH',
  },
};

export const NewProduct: Story = {
  args: {
    ...Default.args,
    isNew: true,
  },
};
```

---

## 6. TESTING COMPONENTS

### 6.1 Component Test Example

```typescript
// src/components/product/ProductCard.test.tsx
import { render, screen } from '@testing-library/react';
import { ProductCard } from './ProductCard';

describe('ProductCard', () => {
  it('renders product information', () => {
    render(
      <ProductCard
        id="1"
        name="Test Product"
        price={999}
        image="test.jpg"
        rating={4.5}
        reviews={10}
        vendor="Test Vendor"
      />
    );

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Test Vendor')).toBeInTheDocument();
    expect(screen.getByText('₱999')).toBeInTheDocument();
  });

  it('displays new badge when isNew is true', () => {
    render(
      <ProductCard
        id="1"
        name="Test Product"
        price={999}
        image="test.jpg"
        rating={4.5}
        reviews={10}
        vendor="Test Vendor"
        isNew={true}
      />
    );

    expect(screen.getByText('New')).toBeInTheDocument();
  });
});
```

---

## 7. NEXT STEPS

1. **Install dependencies** (30 minutes)
2. **Set up Storybook** (1 hour)
3. **Create base components** (4 hours)
4. **Create layout components** (3 hours)
5. **Create product components** (2 hours)
6. **Write tests** (3 hours)
7. **Document in Storybook** (2 hours)

**Total**: ~15 hours for initial setup

---

## 8. USEFUL COMMANDS

```bash
# Start development server
npm run dev

# Start Storybook
npm run storybook

# Run tests
npm test

# Run tests with UI
npm run test:ui

# Build for production
npm run build

# Lint code
npm run lint
```

---

## RESOURCES

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Storybook](https://storybook.js.org)
- [Radix UI](https://www.radix-ui.com)
- [Testing Library](https://testing-library.com)

---

**Happy coding! 🚀**

