import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import ProductDetailPage from '@/app/products/[slug]/page';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useParams: () => ({ slug: 'herbal-tea' }),
}));

// Mock fetch
global.fetch = vi.fn();

const mockProduct = {
  id: '1',
  name: 'Premium Herbal Tea',
  slug: 'herbal-tea',
  description: 'A carefully crafted blend of organic herbs for relaxation and wellness.',
  shortDescription: 'Organic herbal tea blend',
  variants: [
    {
      price: '19.99',
      comparePrice: '24.99',
      sku: 'HT-001',
    },
  ],
  rating: 4.5,
  reviewCount: 25,
  images: [
    { id: '1', url: '/tea.jpg', altText: 'Herbal Tea' },
    { id: '2', url: '/tea-2.jpg', altText: 'Herbal Tea 2' },
  ],
  category: { id: 'cat-1', name: 'Herbal Teas' },
  vendor: { storeName: 'Extreme Life', id: 'vendor-1' },
  brand: 'Extreme Life',
  condition: 'NEW',
  weight: 0.1,
  status: 'ACTIVE',
};

describe('Product Detail Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as any).mockImplementation((url: string) => {
      if (url.includes('/api/products/search')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ products: [mockProduct] }),
        });
      }
      return Promise.reject(new Error('Unknown URL'));
    });
  });

  it('renders product detail page with navigation', async () => {
    render(<ProductDetailPage />);
    
    expect(screen.getByText('Extreme Life Herbal')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
  });

  it('displays loading state initially', () => {
    render(<ProductDetailPage />);
    
    expect(screen.getByText('Loading product details...')).toBeInTheDocument();
  });

  it('loads and displays product details', async () => {
    render(<ProductDetailPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Premium Herbal Tea')).toBeInTheDocument();
      expect(screen.getByText('A carefully crafted blend of organic herbs for relaxation and wellness.')).toBeInTheDocument();
    });
  });

  it('displays product price', async () => {
    render(<ProductDetailPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/₱19.99/)).toBeInTheDocument();
    });
  });

  it('displays product rating and review count', async () => {
    render(<ProductDetailPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/4.5/)).toBeInTheDocument();
      expect(screen.getByText(/25 reviews/)).toBeInTheDocument();
    });
  });

  it('displays vendor information', async () => {
    render(<ProductDetailPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Extreme Life')).toBeInTheDocument();
    });
  });

  it('displays product SKU', async () => {
    render(<ProductDetailPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/SKU:/)).toBeInTheDocument();
      expect(screen.getByText('HT-001')).toBeInTheDocument();
    });
  });

  it('displays breadcrumb navigation', async () => {
    render(<ProductDetailPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Products')).toBeInTheDocument();
      expect(screen.getByText('Premium Herbal Tea')).toBeInTheDocument();
    });
  });

  it('displays add to cart and buy now buttons', async () => {
    render(<ProductDetailPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Add to Cart')).toBeInTheDocument();
      expect(screen.getByText('Buy Now')).toBeInTheDocument();
    });
  });

  it('displays customer reviews section', async () => {
    render(<ProductDetailPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Customer Reviews')).toBeInTheDocument();
    });
  });

  it('displays footer', async () => {
    render(<ProductDetailPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/© 2025 Extreme Life Herbal/)).toBeInTheDocument();
    });
  });

  it('handles product not found error', async () => {
    (global.fetch as any).mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ products: [] }),
      })
    );

    render(<ProductDetailPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Product not found')).toBeInTheDocument();
    });
  });

  it('handles fetch error gracefully', async () => {
    (global.fetch as any).mockImplementation(() =>
      Promise.reject(new Error('Network error'))
    );

    render(<ProductDetailPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load product details')).toBeInTheDocument();
    });
  });
});

