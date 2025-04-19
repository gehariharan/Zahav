const { test, expect } = require('@playwright/test');

test.describe('Registration Page', () => {
  test.beforeEach(async ({ page }) => {
    // Go to registration page before each test
    await page.goto('/register');
  });

  test('should show registration form', async ({ page }) => {
    // Verify form elements are visible
    await expect(page.locator('h2')).toHaveText(/Register|Sign Up/);
    
    // Check for required fields
    await expect(page.locator('input[name="username"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('input[name="confirmPassword"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    
    // Verify "Already have account" link
    await expect(page.locator('a[href="/login"]')).toBeVisible();
  });

  test('should validate form fields', async ({ page }) => {
    // Submit empty form
    await page.click('button[type="submit"]');
    
    // Check for validation errors
    // Note: Different frameworks handle validation differently,
    // so this test may need to be adjusted based on actual implementation
    await expect(page.locator('input[name="username"]:invalid')).toBeVisible();
  });

  test('should validate password match', async ({ page }) => {
    // Fill form with mismatched passwords
    await page.fill('input[name="username"]', 'testuser');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="confirmPassword"]', 'password456');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Check for password mismatch error
    // Note: The exact selector depends on how errors are displayed
    await expect(page.locator('.alert-error, .error-message')).toBeVisible();
    await expect(page.locator('.alert-error, .error-message')).toContainText(/password|match/i);
  });

  test('should navigate to login page', async ({ page }) => {
    // Click on login link
    await page.click('a[href="/login"]');
    
    // Verify we navigated to login page
    await expect(page).toHaveURL('/login');
  });

  test('should show loading state during registration', async ({ page }) => {
    // Fill form with valid data
    await page.fill('input[name="username"]', `testuser_${Date.now()}`);
    await page.fill('input[name="email"]', `test_${Date.now()}@example.com`);
    await page.fill('input[name="password"]', 'Password123!');
    await page.fill('input[name="confirmPassword"]', 'Password123!');
    
    // Mock API for this test
    await page.route('**/auth/register', async (route) => {
      // Delay to simulate server processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
    });
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Button should be disabled and show loading state
    await expect(page.locator('button[type="submit"]')).toBeDisabled();
  });
});
