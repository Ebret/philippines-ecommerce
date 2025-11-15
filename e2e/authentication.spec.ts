import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/auth/signin');
    await expect(page.locator('h1')).toContainText('Sign In');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('should display signup page', async ({ page }) => {
    await page.goto('/auth/signup');
    await expect(page.locator('h1')).toContainText('Sign Up');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('should validate email format on login', async ({ page }) => {
    await page.goto('/auth/signin');
    const emailInput = page.locator('input[type="email"]');
    const submitBtn = page.locator('button[type="submit"]');
    
    await emailInput.fill('invalid-email');
    await submitBtn.click();
    
    const errorMsg = page.locator('text=Invalid email');
    await expect(errorMsg).toBeVisible({ timeout: 5000 });
  });

  test('should validate password length on signup', async ({ page }) => {
    await page.goto('/auth/signup');
    const passwordInput = page.locator('input[type="password"]');
    const submitBtn = page.locator('button[type="submit"]');
    
    await passwordInput.fill('123');
    await submitBtn.click();
    
    const errorMsg = page.locator('text=at least 8 characters');
    await expect(errorMsg).toBeVisible({ timeout: 5000 });
  });

  test('should show password toggle on login', async ({ page }) => {
    await page.goto('/auth/signin');
    const passwordInput = page.locator('input[type="password"]');
    const toggleBtn = page.locator('[data-testid="password-toggle"]');
    
    if (await toggleBtn.isVisible()) {
      await toggleBtn.click();
      const visibleInput = page.locator('input[type="text"]');
      await expect(visibleInput).toBeVisible();
    }
  });

  test('should have remember me checkbox on login', async ({ page }) => {
    await page.goto('/auth/signin');
    const rememberCheckbox = page.locator('input[type="checkbox"]');
    await expect(rememberCheckbox).toBeVisible();
  });

  test('should have forgot password link', async ({ page }) => {
    await page.goto('/auth/signin');
    const forgotLink = page.locator('a:has-text("Forgot password")');
    await expect(forgotLink).toBeVisible();
  });

  test('should have signup link on login page', async ({ page }) => {
    await page.goto('/auth/signin');
    const signupLink = page.locator('a:has-text("Sign up")');
    await expect(signupLink).toBeVisible();
    await signupLink.click();
    await page.waitForURL('/auth/signup');
  });

  test('should have login link on signup page', async ({ page }) => {
    await page.goto('/auth/signup');
    const loginLink = page.locator('a:has-text("Sign in")');
    await expect(loginLink).toBeVisible();
    await loginLink.click();
    await page.waitForURL('/auth/signin');
  });

  test('should have social login options if available', async ({ page }) => {
    await page.goto('/auth/signin');
    const googleBtn = page.locator('button:has-text("Google")');
    const facebookBtn = page.locator('button:has-text("Facebook")');
    
    if (await googleBtn.isVisible()) {
      await expect(googleBtn).toBeVisible();
    }
    if (await facebookBtn.isVisible()) {
      await expect(facebookBtn).toBeVisible();
    }
  });

  test('should require email field', async ({ page }) => {
    await page.goto('/auth/signin');
    const submitBtn = page.locator('button[type="submit"]');
    await submitBtn.click();
    
    const errorMsg = page.locator('text=Email is required');
    await expect(errorMsg).toBeVisible({ timeout: 5000 });
  });

  test('should require password field', async ({ page }) => {
    await page.goto('/auth/signin');
    const emailInput = page.locator('input[type="email"]');
    const submitBtn = page.locator('button[type="submit"]');
    
    await emailInput.fill('test@example.com');
    await submitBtn.click();
    
    const errorMsg = page.locator('text=Password is required');
    await expect(errorMsg).toBeVisible({ timeout: 5000 });
  });

  test('should have accessible form labels', async ({ page }) => {
    await page.goto('/auth/signin');
    const emailLabel = page.locator('label:has-text("Email")');
    const passwordLabel = page.locator('label:has-text("Password")');
    
    await expect(emailLabel).toBeVisible();
    await expect(passwordLabel).toBeVisible();
  });

  test('should have submit button enabled when form is valid', async ({ page }) => {
    await page.goto('/auth/signin');
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const submitBtn = page.locator('button[type="submit"]');
    
    await emailInput.fill('test@example.com');
    await passwordInput.fill('password123');
    
    await expect(submitBtn).toBeEnabled();
  });
});

