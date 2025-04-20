const { test, expect } = require('@playwright/test');
const { loginViaAPI } = require('../utils/auth-helpers');

test.describe('Booking System Page', () => {
  test.beforeEach(async ({ page }) => {
    // Log in before each test
    await loginViaAPI(page, 'testuser', 'password123');

    // Navigate to booking system
    await page.goto('/booking');

    // Wait for page to load completely
    await page.waitForSelector('.booking-system-page', { state: 'visible' });
  });

  test('should display booking system components', async ({ page }) => {
    // Verify page title
    await expect(page.locator('h1')).toContainText(/Metal Booking System/i);

    // Check for booking form
    await expect(page.locator('[data-testid="booking-form"]')).toBeVisible();

    // Check for booking calendar
    await expect(page.locator('[data-testid="booking-calendar"]')).toBeVisible();

    // Check for AI Assistant toggle button
    await expect(page.locator('button:has-text("Use AI Assistant")')).toBeVisible();
  });

  test('should create a new booking using the form', async ({ page }) => {
    // Make sure we're in form mode, not AI mode
    if (await page.isVisible('button:has-text("Switch to Form")')) {
      await page.click('button:has-text("Switch to Form")');
    }

    // Fill booking form
    await page.selectOption('[data-testid="booking-metal"]', 'gold');
    await page.selectOption('#purity', '999 Fine');
    await page.fill('[data-testid="booking-amount"]', '100');

    // Set delivery date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    await page.fill('#deliveryDate', tomorrowStr);

    // Add notes
    await page.fill('#notes', 'Test booking notes');

    // Submit form
    await page.click('[data-testid="submit-booking"]');

    // Verify success message
    await expect(page.locator('.alert-success')).toBeVisible();
    await expect(page.locator('.alert-success')).toContainText('Booking request submitted successfully');

    // Verify booking appears in recent bookings list
    await expect(page.locator('[data-testid="booking-list"]')).toBeVisible();
  });

  test('should create a booking using AI Assistant', async ({ page }) => {
    // Switch to AI Assistant mode
    await page.click('button:has-text("Use AI Assistant")');

    // Wait for AI Assistant to load
    await page.waitForSelector('.ai-assistant', { state: 'visible' });

    // Type a natural language booking request
    await page.fill('.ai-assistant-input input', 'I want to book 100 grams of gold for delivery next week');

    // Submit the request
    await page.click('.ai-assistant-input button[type="submit"]');

    // Wait for the assistant to process and respond
    await page.waitForSelector('.assistant-message', { state: 'visible' });

    // Verify the assistant responded
    await expect(page.locator('.assistant-message')).toContainText(/booking/i);

    // Verify booking appears in recent bookings list
    await expect(page.locator('[data-testid="booking-list"]')).toBeVisible();
    await expect(page.locator('.booking-item')).toBeVisible();
  });

  test('should toggle between form and AI Assistant', async ({ page }) => {
    // Initially should be in form mode
    await expect(page.locator('[data-testid="booking-form"]')).toBeVisible();

    // Switch to AI Assistant
    await page.click('button:has-text("Use AI Assistant")');

    // Verify AI Assistant is visible
    await expect(page.locator('.ai-assistant')).toBeVisible();

    // Switch back to form
    await page.click('button:has-text("Switch to Form")');

    // Verify form is visible again
    await expect(page.locator('[data-testid="booking-form"]')).toBeVisible();
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

  test('should validate booking form', async ({ page }) => {
    // Make sure we're in form mode, not AI mode
    if (await page.isVisible('button:has-text("Switch to Form")')) {
      await page.click('button:has-text("Switch to Form")');
    }

    // Submit empty form
    await page.click('[data-testid="submit-booking"]');

    // Check for validation errors (required fields should be highlighted)
    await expect(page.locator('select:invalid, input:invalid')).toBeVisible();
  });

  test('should clear AI chat history', async ({ page }) => {
    // Switch to AI Assistant mode
    await page.click('button:has-text("Use AI Assistant")');

    // Wait for AI Assistant to load
    await page.waitForSelector('.ai-assistant', { state: 'visible' });

    // Type a message
    await page.fill('.ai-assistant-input input', 'Hello');

    // Submit the message
    await page.click('.ai-assistant-input button[type="submit"]');

    // Wait for the message to appear
    await page.waitForSelector('.user-message', { state: 'visible' });

    // Click clear chat button
    await page.click('.clear-chat-button');

    // Verify chat is cleared (welcome message should be visible again)
    await expect(page.locator('.ai-assistant-welcome')).toBeVisible();
  });
});
