const { test, expect } = require('@playwright/test');

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    // Go to login page before each test
    await page.goto('/login');
  });

  test('should show login form', async ({ page }) => {
    // Verify form elements are visible
    await expect(page.locator('h2')).toHaveText('Sign In');
    await expect(page.locator('#username')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    await expect(page.locator('a[href="/register"]')).toBeVisible();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    // Fill form with invalid credentials
    await page.fill('#username', 'invaliduser');
    await page.fill('#password', 'invalidpassword');
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Verify error message appears
    await expect(page.locator('.alert-error')).toBeVisible();
  });

  test('should navigate to registration page', async ({ page }) => {
    // Click on register link
    await page.click('a[href="/register"]');
    
    // Verify we navigated to register page
    await expect(page).toHaveURL('/register');
  });

  test('should remember username when checkbox is checked', async ({ page }) => {
    // Fill username
    await page.fill('#username', 'testuser');
    
    // Check "remember me" checkbox
    await page.check('#remember');
    
    // Submit form with invalid password to stay on page
    await page.fill('#password', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // After error, username should still be filled
    await expect(page.locator('#username')).toHaveValue('testuser');
  });

  test('should disable button during login attempt', async ({ page }) => {
    // Fill form
    await page.fill('#username', 'testuser');
    await page.fill('#password', 'password');
    
    // Click submit button
    await page.click('button[type="submit"]');
    
    // Button should be disabled during login attempt
    await expect(page.locator('button[type="submit"]')).toBeDisabled();
    await expect(page.locator('button[type="submit"]')).toHaveText('Signing in...');
  });
});
