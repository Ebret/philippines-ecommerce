import { test, expect } from '@playwright/test';

test.describe('Critical Path - User Journey', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Extreme Life Herbal/);
    await expect(page.locator('h1')).toContainText('Welcome to Extreme Life Herbal');
    await expect(page.locator('text=Featured Products')).toBeVisible();
  });

  test('should navigate to products page', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="/products"]');
    await page.waitForURL('/products');
    await expect(page.locator('h1')).toContainText('Products');
  });

  test('should search for products', async ({ page }) => {
    await page.goto('/products');
    const searchInput = page.locator('input[placeholder*="Search"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill('herbal');
      await page.waitForTimeout(500);
      await expect(page.locator('text=Herbal')).toBeVisible();
    }
  });

  test('should view product details', async ({ page }) => {
    await page.goto('/products');
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    if (await firstProduct.isVisible()) {
      await firstProduct.click();
      await page.waitForURL(/\/products\//);
      await expect(page.locator('h1')).toBeVisible();
    }
  });

  test('should add product to cart', async ({ page }) => {
    await page.goto('/products');
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    if (await firstProduct.isVisible()) {
      await firstProduct.click();
      await page.waitForURL(/\/products\//);
      const addToCartBtn = page.locator('button:has-text("Add to Cart")');
      if (await addToCartBtn.isVisible()) {
        await addToCartBtn.click();
        await expect(page.locator('text=Added to cart')).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('should navigate to cart', async ({ page }) => {
    await page.goto('/cart');
    await expect(page).toHaveURL(/\/cart/);
    await expect(page.locator('h1')).toContainText('Shopping Cart');
  });

  test('should proceed to checkout', async ({ page }) => {
    await page.goto('/cart');
    const checkoutBtn = page.locator('button:has-text("Proceed to Checkout")');
    if (await checkoutBtn.isVisible()) {
      await checkoutBtn.click();
      await page.waitForURL(/\/checkout/);
      await expect(page.locator('h1')).toContainText('Checkout');
    }
  });

  test('should view about page', async ({ page }) => {
    await page.goto('/about');
    await expect(page).toHaveURL(/\/about/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should view contact page', async ({ page }) => {
    await page.goto('/contact');
    await expect(page).toHaveURL(/\/contact/);
    await expect(page.locator('h1')).toBeVisible();
    const contactForm = page.locator('form');
    await expect(contactForm).toBeVisible();
  });

  test('should view testimonials page', async ({ page }) => {
    await page.goto('/testimonials');
    await expect(page).toHaveURL(/\/testimonials/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should have responsive design on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    const mobileMenu = page.locator('[data-testid="mobile-menu"]');
    if (await mobileMenu.isVisible()) {
      await mobileMenu.click();
      await expect(page.locator('a[href="/products"]')).toBeVisible();
    }
  });

  test('should have all pages load under 2 seconds', async ({ page }) => {
    const pages = ['/', '/products', '/about', '/contact', '/testimonials'];
    for (const pagePath of pages) {
      const startTime = Date.now();
      await page.goto(pagePath);
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(2000);
    }
  });

  test('should have no console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    await page.goto('/');
    expect(errors).toHaveLength(0);
  });

  test('should have proper HTTP status codes', async ({ page }) => {
    const pages = ['/', '/products', '/about', '/contact', '/testimonials'];
    for (const pagePath of pages) {
      const response = await page.goto(pagePath);
      expect(response?.status()).toBe(200);
    }
  });
});

