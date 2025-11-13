import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma } from '@/lib/prisma';

describe('Week 7: Search API Tests', () => {
  describe('Search Suggestions API', () => {
    it('should return product suggestions for valid query', async () => {
      const response = await fetch('/api/search/suggestions?query=test&limit=5');
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty('products');
      expect(data).toHaveProperty('categories');
      expect(data).toHaveProperty('brands');
      expect(Array.isArray(data.products)).toBe(true);
    });

    it('should return limited suggestions', async () => {
      const response = await fetch('/api/search/suggestions?query=test&limit=3');
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.products.length).toBeLessThanOrEqual(3);
    });

    it('should handle empty query', async () => {
      const response = await fetch('/api/search/suggestions?query=');
      expect(response.status).toBe(400);
    });

    it('should return category suggestions', async () => {
      const response = await fetch('/api/search/suggestions?query=electronics');
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.categories).toBeDefined();
    });

    it('should return brand suggestions', async () => {
      const response = await fetch('/api/search/suggestions?query=samsung');
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.brands).toBeDefined();
    });

    it('should handle special characters in query', async () => {
      const response = await fetch('/api/search/suggestions?query=test%20product');
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty('products');
    });

    it('should be case insensitive', async () => {
      const response1 = await fetch('/api/search/suggestions?query=TEST');
      const response2 = await fetch('/api/search/suggestions?query=test');
      expect(response1.status).toBe(200);
      expect(response2.status).toBe(200);
    });

    it('should return suggestions with type field', async () => {
      const response = await fetch('/api/search/suggestions?query=test');
      expect(response.status).toBe(200);
      const data = await response.json();
      if (data.products.length > 0) {
        expect(data.products[0]).toHaveProperty('type');
        expect(data.products[0].type).toBe('product');
      }
    });
  });

  describe('Search Filters API', () => {
    it('should return available filters', async () => {
      const response = await fetch('/api/search/filters');
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty('priceRange');
      expect(data).toHaveProperty('categories');
      expect(data).toHaveProperty('brands');
      expect(data).toHaveProperty('conditions');
      expect(data).toHaveProperty('ratings');
    });

    it('should return valid price range', async () => {
      const response = await fetch('/api/search/filters');
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.priceRange.min).toBeLessThanOrEqual(data.priceRange.max);
    });

    it('should return categories with count', async () => {
      const response = await fetch('/api/search/filters');
      expect(response.status).toBe(200);
      const data = await response.json();
      if (data.categories.length > 0) {
        expect(data.categories[0]).toHaveProperty('count');
        expect(typeof data.categories[0].count).toBe('number');
      }
    });

    it('should return valid conditions', async () => {
      const response = await fetch('/api/search/filters');
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.conditions).toContain('NEW');
      expect(data.conditions).toContain('USED');
      expect(data.conditions).toContain('REFURBISHED');
    });

    it('should return rating distribution', async () => {
      const response = await fetch('/api/search/filters');
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.ratings.length).toBe(5);
      expect(data.ratings[0].stars).toBe(5);
    });

    it('should return brands list', async () => {
      const response = await fetch('/api/search/filters');
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data.brands)).toBe(true);
    });

    it('should return categories list', async () => {
      const response = await fetch('/api/search/filters');
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data.categories)).toBe(true);
    });

    it('should have valid category structure', async () => {
      const response = await fetch('/api/search/filters');
      expect(response.status).toBe(200);
      const data = await response.json();
      if (data.categories.length > 0) {
        expect(data.categories[0]).toHaveProperty('id');
        expect(data.categories[0]).toHaveProperty('name');
        expect(data.categories[0]).toHaveProperty('slug');
      }
    });
  });

  describe('Search Results API', () => {
    it('should return search results for valid query', async () => {
      const response = await fetch('/api/search/results?query=test');
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty('products');
      expect(data).toHaveProperty('pagination');
      expect(Array.isArray(data.products)).toBe(true);
    });

    it('should support pagination', async () => {
      const response = await fetch('/api/search/results?query=test&page=1&limit=10');
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.pagination.page).toBe(1);
      expect(data.pagination.limit).toBe(10);
    });

    it('should filter by price range', async () => {
      const response = await fetch('/api/search/results?minPrice=100&maxPrice=1000');
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data.products)).toBe(true);
    });

    it('should filter by category', async () => {
      const response = await fetch('/api/search/results?categoryId=test-category');
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data.products)).toBe(true);
    });

    it('should filter by brand', async () => {
      const response = await fetch('/api/search/results?brand=Samsung');
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data.products)).toBe(true);
    });

    it('should filter by condition', async () => {
      const response = await fetch('/api/search/results?condition=NEW');
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data.products)).toBe(true);
    });

    it('should filter by rating', async () => {
      const response = await fetch('/api/search/results?minRating=4');
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data.products)).toBe(true);
    });

    it('should support sorting by price ascending', async () => {
      const response = await fetch('/api/search/results?sortBy=price_asc');
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data.products)).toBe(true);
    });

    it('should support sorting by price descending', async () => {
      const response = await fetch('/api/search/results?sortBy=price_desc');
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data.products)).toBe(true);
    });

    it('should support sorting by rating', async () => {
      const response = await fetch('/api/search/results?sortBy=rating');
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data.products)).toBe(true);
    });

    it('should support sorting by sales', async () => {
      const response = await fetch('/api/search/results?sortBy=sales');
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data.products)).toBe(true);
    });

    it('should return product with required fields', async () => {
      const response = await fetch('/api/search/results?query=test&limit=1');
      expect(response.status).toBe(200);
      const data = await response.json();
      if (data.products.length > 0) {
        const product = data.products[0];
        expect(product).toHaveProperty('id');
        expect(product).toHaveProperty('name');
        expect(product).toHaveProperty('price');
        expect(product).toHaveProperty('image');
      }
    });

    it('should return valid pagination info', async () => {
      const response = await fetch('/api/search/results?query=test');
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.pagination).toHaveProperty('page');
      expect(data.pagination).toHaveProperty('limit');
      expect(data.pagination).toHaveProperty('total');
      expect(data.pagination).toHaveProperty('pages');
    });

    it('should handle multiple filters', async () => {
      const response = await fetch('/api/search/results?query=test&minPrice=100&maxPrice=1000&condition=NEW&sortBy=price_asc');
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data.products)).toBe(true);
    });

    it('should handle stock filter', async () => {
      const response = await fetch('/api/search/results?inStock=true');
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data.products)).toBe(true);
    });

    it('should return empty results for non-matching query', async () => {
      const response = await fetch('/api/search/results?query=xyznonexistentproduct12345');
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data.products)).toBe(true);
      expect(data.pagination.total).toBe(0);
    });
  });
});

