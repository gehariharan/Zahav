const { test, expect } = require('@playwright/test');
const { loginViaAPI } = require('../utils/auth-helpers');

test.describe('Profile Page', () => {
  test.beforeEach(async ({ page }) => {
    // Log in before each test
    await loginViaAPI(page, 'testuser', 'password123');
    
    // Navigate to profile page
    await page.goto('/profile');
  });

  test('should display user profile information', async ({ page }) => {
    // Verify profile elements are visible
    await expect(page.locator('h1, h2')).toContainText(/profile|account/i);
    
    // Check for profile fields
    // Replace these with actual selectors from your implementation
    await expect(page.locator('[data-testid="profile-username"]')).toBeVisible();
    await expect(page.locator('[data-testid="profile-email"]')).toBeVisible();
  });

  test('should allow editing profile information', async ({ page }) => {
    // Click edit button
    await page.click('[data-testid="edit-profile-button"]');
    
    // Edit a field
    await page.fill('[data-testid="profile-name-input"]', 'Updated Name');
    
    // Mock the API response
    await page.route('**/users/me', async (route) => {
      const json = { name: 'Updated Name', email: 'test@example.com', username: 'testuser' };
      await route.fulfill({ status: 200, body: JSON.stringify(json) });
    });
    
    // Save changes
    await page.click('[data-testid="save-profile-button"]');
    
    // Verify success message
    await expect(page.locator('.success-message, .alert-success')).toBeVisible();
    
    // Verify updated information is displayed
    await expect(page.locator('[data-testid="profile-name"]')).toContainText('Updated Name');
  });

  test('should validate profile form inputs', async ({ page }) => {
    // Click edit button
    await page.click('[data-testid="edit-profile-button"]');
    
    // Clear required field
    await page.fill('[data-testid="profile-email-input"]', '');
    
    // Try to save
    await page.click('[data-testid="save-profile-button"]');
    
    // Check for validation error
    await expect(page.locator('.error-message, .alert-error')).toBeVisible();
  });

  test('should allow changing password', async ({ page }) => {
    // Navigate to change password section
    await page.click('[data-testid="change-password-button"]');
    
    // Fill password form
    await page.fill('[data-testid="current-password-input"]', 'password123');
    await page.fill('[data-testid="new-password-input"]', 'newpassword123');
    await page.fill('[data-testid="confirm-password-input"]', 'newpassword123');
    
    // Mock API response
    await page.route('**/users/password', async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
    });
    
    // Submit form
    await page.click('[data-testid="update-password-button"]');
    
    // Verify success message
    await expect(page.locator('.success-message, .alert-success')).toBeVisible();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Click edit button
    await page.click('[data-testid="edit-profile-button"]');
    
    // Edit a field
    await page.fill('[data-testid="profile-name-input"]', 'Updated Name');
    
    // Mock a failed API response
    await page.route('**/users/me', route => {
      return route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Internal server error' })
      });
    });
    
    // Save changes
    await page.click('[data-testid="save-profile-button"]');
    
    // Verify error state is displayed
    await expect(page.locator('.error-message, .alert-error')).toBeVisible();
  });
});
