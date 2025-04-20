const { test, expect } = require('@playwright/test');
const { loginViaAPI } = require('../utils/auth-helpers');

test.describe('AI Features', () => {
  test.beforeEach(async ({ page }) => {
    // Log in before each test
    await loginViaAPI(page, 'testuser', 'password123');
  });

  test('should have AI Assistant in booking system', async ({ page }) => {
    // Navigate to booking system
    await page.goto('/booking');
    
    // Wait for page to load
    await page.waitForSelector('.booking-system-page', { state: 'visible' });
    
    // Check for AI Assistant toggle button
    await expect(page.locator('button:has-text("Use AI Assistant")')).toBeVisible();
    
    // Switch to AI Assistant
    await page.click('button:has-text("Use AI Assistant")');
    
    // Verify AI Assistant is visible
    await expect(page.locator('.ai-assistant')).toBeVisible();
    
    // Verify suggestions are visible
    await expect(page.locator('.suggestions-list')).toBeVisible();
  });

  test('should have AI Assistant in rate alerts', async ({ page }) => {
    // Navigate to rate alerts
    await page.goto('/alerts');
    
    // Wait for page to load
    await page.waitForSelector('.rate-alerts-page', { state: 'visible' });
    
    // Check for AI Assistant toggle button
    await expect(page.locator('button:has-text("Use AI Assistant")')).toBeVisible();
    
    // Switch to AI Assistant
    await page.click('button:has-text("Use AI Assistant")');
    
    // Verify AI Assistant is visible
    await expect(page.locator('.ai-assistant')).toBeVisible();
    
    // Verify suggestions are visible
    await expect(page.locator('.suggestions-list')).toBeVisible();
  });

  test('should process natural language booking request', async ({ page }) => {
    // Navigate to booking system
    await page.goto('/booking');
    
    // Wait for page to load
    await page.waitForSelector('.booking-system-page', { state: 'visible' });
    
    // Switch to AI Assistant
    await page.click('button:has-text("Use AI Assistant")');
    
    // Wait for AI Assistant to load
    await page.waitForSelector('.ai-assistant', { state: 'visible' });
    
    // Type a natural language booking request
    await page.fill('.ai-assistant-input input', 'I want to book 100 grams of gold for delivery next week');
    
    // Submit the request
    await page.click('.ai-assistant-input button[type="submit"]');
    
    // Wait for the assistant to process and respond
    await page.waitForSelector('.assistant-message', { state: 'visible' });
    
    // Verify the assistant responded with a confirmation
    await expect(page.locator('.assistant-message')).toContainText(/booking/i);
    await expect(page.locator('.assistant-message')).toContainText(/gold/i);
    await expect(page.locator('.assistant-message')).toContainText(/100 grams/i);
  });

  test('should process natural language alert request', async ({ page }) => {
    // Navigate to rate alerts
    await page.goto('/alerts');
    
    // Wait for page to load
    await page.waitForSelector('.rate-alerts-page', { state: 'visible' });
    
    // Switch to AI Assistant
    await page.click('button:has-text("Use AI Assistant")');
    
    // Wait for AI Assistant to load
    await page.waitForSelector('.ai-assistant', { state: 'visible' });
    
    // Type a natural language alert request
    await page.fill('.ai-assistant-input input', 'Alert me when gold goes above 2000 USD');
    
    // Submit the request
    await page.click('.ai-assistant-input button[type="submit"]');
    
    // Wait for the assistant to process and respond
    await page.waitForSelector('.assistant-message', { state: 'visible' });
    
    // Verify the assistant responded with a confirmation
    await expect(page.locator('.assistant-message')).toContainText(/alert/i);
    await expect(page.locator('.assistant-message')).toContainText(/gold/i);
    await expect(page.locator('.assistant-message')).toContainText(/2000/i);
    await expect(page.locator('.assistant-message')).toContainText(/USD/i);
  });
});
