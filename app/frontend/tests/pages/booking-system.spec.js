const { test, expect } = require('@playwright/test');
const { loginViaAPI } = require('../utils/auth-helpers');

test.describe('Booking System Page', () => {
  test.beforeEach(async ({ page }) => {
    // Log in before each test
    await loginViaAPI(page, 'testuser', 'password123');
    
    // Navigate to booking system
    await page.goto('/booking');
  });

  test('should display booking system components', async ({ page }) => {
    // Verify page title
    await expect(page.locator('h1, h2')).toContainText(/booking/i);
    
    // Check for booking form
    await expect(page.locator('[data-testid="booking-form"]')).toBeVisible();
    
    // Check for booking calendar
    await expect(page.locator('[data-testid="booking-calendar"]')).toBeVisible();
  });

  test('should create a new booking', async ({ page }) => {
    // Click new booking button
    await page.click('[data-testid="new-booking-button"]');
    
    // Fill booking form
    await page.fill('[data-testid="booking-title"]', 'Test Booking');
    await page.fill('[data-testid="booking-amount"]', '100');
    await page.selectOption('[data-testid="booking-metal"]', 'gold');
    
    // Select a date (implementation may vary)
    await page.click('[data-testid="date-picker"]');
    await page.click('[data-testid="date-next-available"]');
    
    // Mock API response
    await page.route('**/api/bookings', async (route) => {
      const body = { 
        id: '123',
        title: 'Test Booking',
        status: 'confirmed',
        amount: 100,
        metal: 'gold',
        date: new Date().toISOString()
      };
      await route.fulfill({ status: 200, body: JSON.stringify(body) });
    });
    
    // Submit form
    await page.click('[data-testid="submit-booking"]');
    
    // Verify success message
    await expect(page.locator('.success-message, .alert-success')).toBeVisible();
    
    // Verify booking appears in list
    await expect(page.locator('[data-testid="booking-list"]')).toContainText('Test Booking');
  });

  test('should filter bookings', async ({ page }) => {
    // Click on filter dropdown
    await page.click('[data-testid="filter-dropdown"]');
    
    // Select "Gold Only" filter
    await page.click('[data-testid="filter-gold-only"]');
    
    // Verify URL parameters changed
    await expect(page).toHaveURL(/.*metal=gold.*/);
    
    // Verify filtered results
    await expect(page.locator('[data-testid="filtered-by"]')).toContainText(/gold/i);
  });

  test('should show booking details', async ({ page }) => {
    // Click on a booking in the list
    await page.click('[data-testid="booking-item"]:first-child');
    
    // Verify details panel is visible
    await expect(page.locator('[data-testid="booking-details"]')).toBeVisible();
    
    // Verify details content
    await expect(page.locator('[data-testid="detail-title"]')).toBeVisible();
    await expect(page.locator('[data-testid="detail-amount"]')).toBeVisible();
    await expect(page.locator('[data-testid="detail-date"]')).toBeVisible();
    await expect(page.locator('[data-testid="detail-status"]')).toBeVisible();
  });

  test('should edit existing booking', async ({ page }) => {
    // Click on a booking in the list
    await page.click('[data-testid="booking-item"]:first-child');
    
    // Click edit button
    await page.click('[data-testid="edit-booking"]');
    
    // Modify booking details
    await page.fill('[data-testid="booking-title"]', 'Updated Booking');
    
    // Mock API response
    await page.route('**/api/bookings/*', async (route) => {
      const body = { 
        id: '123',
        title: 'Updated Booking',
        status: 'confirmed',
        amount: 100,
        metal: 'gold',
        date: new Date().toISOString()
      };
      await route.fulfill({ status: 200, body: JSON.stringify(body) });
    });
    
    // Save changes
    await page.click('[data-testid="save-booking"]');
    
    // Verify success message
    await expect(page.locator('.success-message, .alert-success')).toBeVisible();
    
    // Verify updated booking in list
    await expect(page.locator('[data-testid="booking-list"]')).toContainText('Updated Booking');
  });

  test('should cancel a booking', async ({ page }) => {
    // Click on a booking in the list
    await page.click('[data-testid="booking-item"]:first-child');
    
    // Click cancel button
    await page.click('[data-testid="cancel-booking"]');
    
    // Confirm cancellation in dialog
    await page.click('[data-testid="confirm-cancel"]');
    
    // Mock API response
    await page.route('**/api/bookings/*/cancel', async (route) => {
      const body = { 
        success: true,
        message: 'Booking cancelled successfully'
      };
      await route.fulfill({ status: 200, body: JSON.stringify(body) });
    });
    
    // Verify success message
    await expect(page.locator('.success-message, .alert-success')).toBeVisible();
    
    // Verify booking status changed to cancelled
    await expect(page.locator('[data-testid="booking-status"]')).toContainText(/cancelled/i);
  });

  test('should validate booking form', async ({ page }) => {
    // Click new booking button
    await page.click('[data-testid="new-booking-button"]');
    
    // Submit empty form
    await page.click('[data-testid="submit-booking"]');
    
    // Check for validation errors
    await expect(page.locator('.form-error, .validation-error')).toBeVisible();
  });
});
