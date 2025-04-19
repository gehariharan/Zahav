const { test, expect } = require('@playwright/test');
const { loginViaAPI } = require('../utils/auth-helpers');

test.describe('Price Dashboard Page', () => {
  test.beforeEach(async ({ page }) => {
    // Log in before each test
    await loginViaAPI(page, 'testuser', 'password123');
    
    // Navigate to price dashboard
    await page.goto('/prices');
  });

  test('should display price dashboard components', async ({ page }) => {
    // Verify page title
    await expect(page.locator('h1, h2')).toContainText(/price|dashboard/i);
    
    // Check for price chart component
    await expect(page.locator('[data-testid="price-chart"]')).toBeVisible();
    
    // Check for price filters
    await expect(page.locator('[data-testid="price-filters"]')).toBeVisible();
  });

  test('should filter prices by date range', async ({ page }) => {
    // Click date range filter
    await page.click('[data-testid="date-range-filter"]');
    
    // Select a date range option (e.g., "Last 7 Days")
    await page.click('[data-testid="date-range-7days"]');
    
    // Verify URL parameters changed
    await expect(page).toHaveURL(/.*days=7.*/);
    
    // Verify chart updated (specific implementation may vary)
    await expect(page.locator('[data-testid="chart-title"]')).toContainText(/7 days/i);
  });

  test('should filter prices by metal type', async ({ page }) => {
    // Click on metal type filter
    await page.click('[data-testid="metal-type-filter"]');
    
    // Select gold
    await page.click('[data-testid="metal-gold"]');
    
    // Verify URL parameters changed
    await expect(page).toHaveURL(/.*metal=gold.*/);
    
    // Verify content updated
    await expect(page.locator('[data-testid="current-metal"]')).toContainText(/gold/i);
  });

  test('should show price comparison', async ({ page }) => {
    // Click on comparison tab
    await page.click('[data-testid="comparison-tab"]');
    
    // Select metals to compare
    await page.click('[data-testid="compare-gold"]');
    await page.click('[data-testid="compare-silver"]');
    
    // Click compare button
    await page.click('[data-testid="run-comparison"]');
    
    // Verify comparison chart is visible
    await expect(page.locator('[data-testid="comparison-chart"]')).toBeVisible();
    
    // Verify both metals are displayed in legend
    await expect(page.locator('[data-testid="chart-legend"]')).toContainText(/gold/i);
    await expect(page.locator('[data-testid="chart-legend"]')).toContainText(/silver/i);
  });

  test('should download price data', async ({ page }) => {
    // Setup download listener
    const downloadPromise = page.waitForEvent('download');
    
    // Click download button
    await page.click('[data-testid="download-prices"]');
    
    // Wait for download to start
    const download = await downloadPromise;
    
    // Verify download started
    expect(download.suggestedFilename()).toMatch(/prices.*\.csv/);
  });

  test('should display historical trends', async ({ page }) => {
    // Click on historical trends tab
    await page.click('[data-testid="historical-tab"]');
    
    // Select a time period (e.g., "1 Year")
    await page.click('[data-testid="period-1year"]');
    
    // Verify historical chart is visible
    await expect(page.locator('[data-testid="historical-chart"]')).toBeVisible();
    
    // Verify period is reflected in title
    await expect(page.locator('[data-testid="historical-title"]')).toContainText(/1 year/i);
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock a failed API response
    await page.route('**/api/prices', route => {
      return route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Internal server error' })
      });
    });
    
    // Reload the page
    await page.reload();
    
    // Verify error state is displayed
    await expect(page.locator('.error-message, .alert-error')).toBeVisible();
    
    // Verify retry button is available
    await expect(page.locator('[data-testid="retry-button"]')).toBeVisible();
  });
});
