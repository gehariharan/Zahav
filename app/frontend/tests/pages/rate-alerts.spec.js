const { test, expect } = require('@playwright/test');
const { loginViaAPI } = require('../utils/auth-helpers');

test.describe('Rate Alerts Page', () => {
  test.beforeEach(async ({ page }) => {
    // Log in before each test
    await loginViaAPI(page, 'testuser', 'password123');
    
    // Navigate to rate alerts page
    await page.goto('/alerts');
    
    // Wait for page to load completely
    await page.waitForSelector('.rate-alerts-page', { state: 'visible' });
  });

  test('should display rate alerts components', async ({ page }) => {
    // Verify page title
    await expect(page.locator('h1')).toContainText(/Rate Alerts/i);
    
    // Check for alert form
    await expect(page.locator('.alert-form-card')).toBeVisible();
    
    // Check for active alerts section
    await expect(page.locator('.active-alerts-card')).toBeVisible();
    
    // Check for AI Assistant toggle button
    await expect(page.locator('button:has-text("Use AI Assistant")')).toBeVisible();
  });

  test('should create a new alert using the form', async ({ page }) => {
    // Make sure we're in form mode, not AI mode
    if (await page.isVisible('button:has-text("Switch to Form")')) {
      await page.click('button:has-text("Switch to Form")');
    }
    
    // Fill alert form
    await page.selectOption('#metal', 'gold');
    await page.selectOption('#condition', 'above');
    await page.fill('#value', '2000');
    await page.selectOption('#currency', 'USD');
    await page.selectOption('#notificationMethod', 'email');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Verify success message
    await expect(page.locator('.alert-success')).toBeVisible();
    
    // Verify alert appears in active alerts list
    await expect(page.locator('.active-alerts-list')).toBeVisible();
  });

  test('should create an alert using AI Assistant', async ({ page }) => {
    // Switch to AI Assistant mode
    await page.click('button:has-text("Use AI Assistant")');
    
    // Wait for AI Assistant to load
    await page.waitForSelector('.ai-assistant', { state: 'visible' });
    
    // Type a natural language alert request
    await page.fill('.ai-assistant-input input', 'Alert me when gold goes above 2000 USD');
    
    // Submit the request
    await page.click('.ai-assistant-input button[type="submit"]');
    
    // Wait for the assistant to process and respond
    await page.waitForSelector('.assistant-message', { state: 'visible' });
    
    // Verify the assistant responded
    await expect(page.locator('.assistant-message')).toContainText(/alert/i);
    
    // Verify alert appears in active alerts list
    await expect(page.locator('.active-alerts-list')).toBeVisible();
  });

  test('should toggle between form and AI Assistant', async ({ page }) => {
    // Initially should be in form mode
    await expect(page.locator('.alert-form-card')).toBeVisible();
    
    // Switch to AI Assistant
    await page.click('button:has-text("Use AI Assistant")');
    
    // Verify AI Assistant is visible
    await expect(page.locator('.ai-assistant')).toBeVisible();
    
    // Switch back to form
    await page.click('button:has-text("Switch to Form")');
    
    // Verify form is visible again
    await expect(page.locator('.alert-form-card')).toBeVisible();
  });

  test('should show AI Assistant suggestions', async ({ page }) => {
    // Switch to AI Assistant mode
    await page.click('button:has-text("Use AI Assistant")');
    
    // Wait for AI Assistant to load
    await page.waitForSelector('.ai-assistant', { state: 'visible' });
    
    // Verify suggestions are visible
    await expect(page.locator('.suggestions-list')).toBeVisible();
    
    // Verify there are multiple suggestion items
    const suggestionCount = await page.locator('.suggestion-item').count();
    expect(suggestionCount).toBeGreaterThan(0);
  });

  test('should validate alert form', async ({ page }) => {
    // Make sure we're in form mode, not AI mode
    if (await page.isVisible('button:has-text("Switch to Form")')) {
      await page.click('button:has-text("Switch to Form")');
    }
    
    // Submit empty form
    await page.click('button[type="submit"]');
    
    // Check for validation errors (required fields should be highlighted)
    await expect(page.locator('select:invalid, input:invalid')).toBeVisible();
  });

  test('should delete an alert', async ({ page }) => {
    // Create an alert first
    await page.selectOption('#metal', 'gold');
    await page.selectOption('#condition', 'above');
    await page.fill('#value', '2000');
    await page.selectOption('#currency', 'USD');
    await page.click('button[type="submit"]');
    
    // Wait for alert to appear in list
    await page.waitForSelector('.alert-item');
    
    // Click delete button on the first alert
    await page.click('.alert-item .delete-alert-btn');
    
    // Verify success message
    await expect(page.locator('.alert-success')).toBeVisible();
  });
});
