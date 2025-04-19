const { chromium } = require('@playwright/test');
const { createTestUser } = require('./utils/auth-helpers');

/**
 * Global setup for tests
 * This runs once before all tests
 */
async function globalSetup() {
  // Launch a browser
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Create test user for tests if it doesn't exist
    const testUser = {
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'password123',
      name: 'Test User'
    };

    await createTestUser(page, testUser);
    console.log('Test setup complete - test user created/verified');
  } catch (error) {
    console.error('Error during global setup:', error);
  } finally {
    // Close browser
    await browser.close();
  }
}

module.exports = globalSetup;
