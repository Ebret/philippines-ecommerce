import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductsPage from '@/app/products/page';

// Mock fetch
global.fetch = vi.fn();

const mockProducts = [
  {
    id: '1',
    name: 'Herbal Tea',
    slug: 'herbal-tea',
    shortDescription: 'Premium herbal tea',
    variants: [{ price: '19.99', comparePrice: '24.99' }],
    rating: 4.5,
    reviewCount: 25,
    images: [{ url: '/tea.jpg', isPrimary: true }],
    category: { name: 'Teas' },
    vendor: { storeName: 'Extreme Life', id: 'vendor-1' },
    isFeatured: true,
    status: 'ACTIVE',
  },
  {
    id: '2',
    name: 'Ginseng Supplement',
    slug: 'ginseng-supplement',
    shortDescription: 'Energy supplement',
    variants: [{ price: '29.99', comparePrice: '39.99' }],
    rating: 4.8,
    reviewCount: 42,
    images: [{ url: '/ginseng.jpg', isPrimary: true }],
    category: { name: 'Supplements' },
    vendor: { storeName: 'Extreme Life', id: 'vendor-1' },
    isFeatured: false,
    status: 'ACTIVE',
  },
];

const mockCategories = [
  { id: 'cat-1', name: 'Herbal Teas' },
  { id: 'cat-2', name: 'Supplements' },
  { id: 'cat-3', name: 'Oils' },
];

describe('Products Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as any).mockImplementation((url: string) => {
      if (url.includes('/api/categories')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ categories: mockCategories }),
        });
      }
      if (url.includes('/api/products')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            products: mockProducts,
            pagination: { page: 1, limit: 12, total: 2, pages: 1 },
          }),
        });
      }
      return Promise.reject(new Error('Unknown URL'));
    });
  });

  it('renders products page with header', async () => {
    render(<ProductsPage />);
    
    expect(screen.getByText('Our Products')).toBeInTheDocument();
    expect(screen.getByText('Discover our premium herbal products for health and wellness')).toBeInTheDocument();
  });

  it('displays filter sidebar', async () => {
    render(<ProductsPage />);
    
    expect(screen.getByText('Filters')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search products...')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Sort By')).toBeInTheDocument();
  });

  it('loads and displays products', async () => {
    render(<ProductsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Herbal Tea')).toBeInTheDocument();
      expect(screen.getByText('Ginseng Supplement')).toBeInTheDocument();
    });
  });

  it('loads categories for filter', async () => {
    render(<ProductsPage />);
    
    await waitFor(() => {
      const categorySelect = screen.getByDisplayValue('All Categories');
      expect(categorySelect).toBeInTheDocument();
    });
  });

  it('handles search submission', async () => {
    render(<ProductsPage />);
    
    const searchInput = screen.getByPlaceholderText('Search products...');
    const searchButton = screen.getByText('Search');
    
    fireEvent.change(searchInput, { target: { value: 'tea' } });
    fireEvent.click(searchButton);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('search=tea'),
        expect.anything()
      );
    });
  });

  it('handles category filter change', async () => {
    render(<ProductsPage />);
    
    await waitFor(() => {
      const categorySelect = screen.getByDisplayValue('All Categories');
      fireEvent.change(categorySelect, { target: { value: 'cat-1' } });
    });
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('categoryId=cat-1'),
        expect.anything()
      );
    });
  });

  it('displays product count', async () => {
    render(<ProductsPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/Showing 1 to 2 of 2 products/)).toBeInTheDocument();
    });
  });

  it('renders navigation links', () => {
    render(<ProductsPage />);
    
    expect(screen.getByText('Extreme Life Herbal')).toBeInTheDocument();
    expect(screen.getAllByText('Home')[0]).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('renders footer', () => {
    render(<ProductsPage />);
    
    expect(screen.getByText(/© 2025 Extreme Life Herbal/)).toBeInTheDocument();
  });
});

