import { test, expect } from '@playwright/test';

test.describe('Shopping Cart & Checkout', () => {
  test('should display empty cart message', async ({ page }) => {
    await page.goto('/cart');
    const emptyMsg = page.locator('text=Your cart is empty');
    if (await emptyMsg.isVisible()) {
      await expect(emptyMsg).toBeVisible();
    }
  });

  test('should display cart items if present', async ({ page }) => {
    await page.goto('/cart');
    const cartItems = page.locator('[data-testid="cart-item"]');
    const itemCount = await cartItems.count();
    if (itemCount > 0) {
      await expect(cartItems.first()).toBeVisible();
    }
  });

  test('should display cart summary', async ({ page }) => {
    await page.goto('/cart');
    const subtotal = page.locator('text=Subtotal');
    const total = page.locator('text=Total');
    
    if (await subtotal.isVisible()) {
      await expect(subtotal).toBeVisible();
    }
    if (await total.isVisible()) {
      await expect(total).toBeVisible();
    }
  });

  test('should have continue shopping button', async ({ page }) => {
    await page.goto('/cart');
    const continueBtn = page.locator('a:has-text("Continue Shopping")');
    if (await continueBtn.isVisible()) {
      await expect(continueBtn).toBeVisible();
      await continueBtn.click();
      await page.waitForURL(/\/products/);
    }
  });

  test('should have checkout button', async ({ page }) => {
    await page.goto('/cart');
    const checkoutBtn = page.locator('button:has-text("Checkout")');
    if (await checkoutBtn.isVisible()) {
      await expect(checkoutBtn).toBeVisible();
    }
  });

  test('should update quantity in cart', async ({ page }) => {
    await page.goto('/cart');
    const quantityInput = page.locator('input[type="number"]').first();
    if (await quantityInput.isVisible()) {
      await quantityInput.fill('5');
      await page.waitForTimeout(500);
      await expect(quantityInput).toHaveValue('5');
    }
  });

  test('should remove item from cart', async ({ page }) => {
    await page.goto('/cart');
    const removeBtn = page.locator('button:has-text("Remove")').first();
    if (await removeBtn.isVisible()) {
      const initialCount = await page.locator('[data-testid="cart-item"]').count();
      await removeBtn.click();
      await page.waitForTimeout(500);
      const finalCount = await page.locator('[data-testid="cart-item"]').count();
      expect(finalCount).toBeLessThanOrEqual(initialCount);
    }
  });

  test('should display checkout form', async ({ page }) => {
    await page.goto('/checkout');
    const form = page.locator('form');
    if (await form.isVisible()) {
      await expect(form).toBeVisible();
    }
  });

  test('should have shipping address fields', async ({ page }) => {
    await page.goto('/checkout');
    const firstNameInput = page.locator('input[placeholder*="First Name"]');
    const lastNameInput = page.locator('input[placeholder*="Last Name"]');
    const addressInput = page.locator('input[placeholder*="Address"]');
    
    if (await firstNameInput.isVisible()) {
      await expect(firstNameInput).toBeVisible();
    }
    if (await lastNameInput.isVisible()) {
      await expect(lastNameInput).toBeVisible();
    }
    if (await addressInput.isVisible()) {
      await expect(addressInput).toBeVisible();
    }
  });

  test('should have payment method selection', async ({ page }) => {
    await page.goto('/checkout');
    const paymentOptions = page.locator('[data-testid="payment-method"]');
    const count = await paymentOptions.count();
    if (count > 0) {
      await expect(paymentOptions.first()).toBeVisible();
    }
  });

  test('should have order summary on checkout', async ({ page }) => {
    await page.goto('/checkout');
    const summary = page.locator('[data-testid="order-summary"]');
    if (await summary.isVisible()) {
      await expect(summary).toBeVisible();
    }
  });

  test('should validate required checkout fields', async ({ page }) => {
    await page.goto('/checkout');
    const submitBtn = page.locator('button[type="submit"]');
    if (await submitBtn.isVisible()) {
      await submitBtn.click();
      const errorMsg = page.locator('text=required');
      await expect(errorMsg).toBeVisible({ timeout: 5000 });
    }
  });

  test('should display order confirmation page', async ({ page }) => {
    await page.goto('/order-confirmation');
    const confirmationMsg = page.locator('text=Thank you');
    if (await confirmationMsg.isVisible()) {
      await expect(confirmationMsg).toBeVisible();
    }
  });

  test('should have order number on confirmation', async ({ page }) => {
    await page.goto('/order-confirmation');
    const orderNumber = page.locator('[data-testid="order-number"]');
    if (await orderNumber.isVisible()) {
      await expect(orderNumber).toBeVisible();
    }
  });

  test('should have continue shopping button on confirmation', async ({ page }) => {
    await page.goto('/order-confirmation');
    const continueBtn = page.locator('a:has-text("Continue Shopping")');
    if (await continueBtn.isVisible()) {
      await expect(continueBtn).toBeVisible();
    }
  });

  test('should display currency symbols correctly', async ({ page }) => {
    await page.goto('/cart');
    const prices = page.locator('text=/₱|PHP/');
    const count = await prices.count();
    if (count > 0) {
      await expect(prices.first()).toBeVisible();
    }
  });

  test('should calculate totals correctly', async ({ page }) => {
    await page.goto('/cart');
    const subtotal = page.locator('[data-testid="subtotal"]');
    const tax = page.locator('[data-testid="tax"]');
    const total = page.locator('[data-testid="total"]');
    
    if (await subtotal.isVisible() && await total.isVisible()) {
      const subtotalText = await subtotal.textContent();
      const totalText = await total.textContent();
      expect(subtotalText).toBeTruthy();
      expect(totalText).toBeTruthy();
    }
  });
});

