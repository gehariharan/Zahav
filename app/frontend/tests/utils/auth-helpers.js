// Test authentication helpers

/**
 * Logs in using UI flow
 * @param {import('@playwright/test').Page} page
 * @param {string} username
 * @param {string} password
 */
async function loginViaUI(page, username, password) {
  // Navigate to login page
  await page.goto('/login');

  // Wait for the login form to be visible
  await page.waitForSelector('#username', { state: 'visible' });

  // Fill out login form
  await page.fill('#username', username);
  await page.fill('#password', password);

  // Click login button
  await page.click('button[type="submit"]');

  // Wait for navigation to complete (should go to dashboard if successful)
  await page.waitForURL('/dashboard');

  // Wait for the dashboard to load
  await page.waitForSelector('.dashboard-page', { state: 'visible', timeout: 10000 });
}

/**
 * Login via API (faster than UI)
 * @param {import('@playwright/test').Page} page
 * @param {string} username
 * @param {string} password
 */
async function loginViaAPI(page, username, password) {
  // Create the form data
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);

  try {
    // Execute API request
    const response = await page.request.post('http://localhost:8000/auth/token', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: formData.toString(),
    });

    const responseBody = await response.json();
    const token = responseBody.access_token;

    // Set token in localStorage to simulate logged in state
    await page.evaluate((token) => {
      localStorage.setItem('token', token);
    }, token);

    // Reload page to apply the token in context
    await page.goto('/dashboard');

    // Wait for the dashboard to load
    await page.waitForSelector('.dashboard-page', { state: 'visible', timeout: 10000 });
  } catch (error) {
    console.error('Login via API failed:', error);
    // Fallback to UI login if API fails
    await loginViaUI(page, username, password);
  }
}

/**
 * Creates a test user if it doesn't exist
 * @param {import('@playwright/test').Page} page
 * @param {Object} userData
 */
async function createTestUser(page, userData) {
  // Try to create a test user via API
  try {
    await page.request.post('http://localhost:8000/auth/register', {
      data: userData,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    // If error is 409 (conflict), user already exists - that's fine
    if (error.status !== 409) {
      throw error;
    }
  }
}

/**
 * Logs out the user
 * @param {import('@playwright/test').Page} page
 */
async function logout(page) {
  // Click the user menu
  await page.click('[data-testid="user-menu"]');

  // Click the logout button
  await page.click('[data-testid="logout-button"]');

  // Wait for redirect to login page
  await page.waitForURL('/login');
}

module.exports = {
  loginViaUI,
  loginViaAPI,
  createTestUser,
  logout,
};
