const { test, expect } = require('@playwright/test');
const { loginViaAPI } = require('../utils/auth-helpers');

test.describe('Dashboard Page', () => {
  // Setup for tests requiring authentication
  test.beforeEach(async ({ page }) => {
    // Log in before each test
    await loginViaAPI(page, 'testuser', 'password123');
  });

  test('should redirect to login when not authenticated', async ({ page }) => {
    // Clear the authentication
    await page.evaluate(() => localStorage.removeItem('token'));

    // Try to access dashboard
    await page.goto('/dashboard');

    // Should redirect to login
    await expect(page).toHaveURL('/login');
  });

  test('should display user information', async ({ page }) => {
    // Go to dashboard
    await page.goto('/dashboard');

    // Verify user information is displayed
    // This depends on your actual implementation
    await expect(page.locator('[data-testid="user-greeting"]')).toBeVisible();
  });

  test('should have navigation menu with required links', async ({ page }) => {
    // Go to dashboard
    await page.goto('/dashboard');

    // Verify navigation links
    await expect(page.locator('a[href="/dashboard"]')).toBeVisible();
    await expect(page.locator('a[href="/prices"]')).toBeVisible();
    await expect(page.locator('a[href="/booking"]')).toBeVisible();
    await expect(page.locator('a[href="/alerts"]')).toBeVisible();
    await expect(page.locator('a[href="/tracking"]')).toBeVisible();
    await expect(page.locator('a[href="/tools"]')).toBeVisible();
    await expect(page.locator('a[href="/profile"]')).toBeVisible();
  });

  test('should display dashboard widgets', async ({ page }) => {
    // Go to dashboard
    await page.goto('/dashboard');

    // Wait for page to load completely
    await page.waitForSelector('.dashboard-page', { state: 'visible' });

    // Verify dashboard widgets are displayed
    await expect(page.locator('.price-card')).toBeVisible();
    await expect(page.locator('.recent-bookings-card')).toBeVisible();
    await expect(page.locator('.active-alerts-card')).toBeVisible();
  });

  test('should navigate to other sections', async ({ page }) => {
    // Go to dashboard
    await page.goto('/dashboard');

    // Click on prices link
    await page.click('a[href="/prices"]');

    // Verify navigation
    await expect(page).toHaveURL('/prices');
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock a failed API response
    await page.route('**/api/dashboard', route => {
      return route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Internal server error' })
      });
    });

    // Go to dashboard
    await page.goto('/dashboard');

    // Verify error state is displayed
    // Replace this with the actual error state selector
    await expect(page.locator('.error-message, .alert-error')).toBeVisible();
  });
});
