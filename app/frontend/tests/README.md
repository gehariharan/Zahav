# Zahav Frontend Tests

This directory contains end-to-end tests for the Zahav frontend application using Playwright.

## Setup

Tests are configured using Playwright. Make sure you have the necessary dependencies installed:

```bash
npm install
```

## Running Tests

You can run the tests using the following commands:

- Run all tests:
  ```bash
  npm run test:e2e
  ```

- Run tests with UI mode (for debugging):
  ```bash
  npm run test:e2e:ui
  ```

- Run tests in debug mode:
  ```bash
  npm run test:e2e:debug
  ```

- Run a specific test file:
  ```bash
  npx playwright test tests/auth/login.spec.js
  ```

## Test Structure

The tests are organized in the following directories:

- `auth/`: Tests for authentication functionality (login, registration)
- `pages/`: Tests for various application pages
- `utils/`: Test utilities and helpers

## Test User

The tests use a test user with the following credentials:
- Username: testuser
- Password: password123

This test user is created during the global setup if it doesn't exist.

## Mocking

Many tests use Playwright's request interception to mock API responses. This allows tests to run without requiring a running backend, and to test various scenarios (success, error, etc.).

Example of mocking:

```javascript
// Mock API response
await page.route('**/api/endpoint', async (route) => {
  await route.fulfill({
    status: 200,
    body: JSON.stringify({ success: true })
  });
});
```

## Authentication Helpers

The tests use helper functions in `utils/auth-helpers.js` to handle authentication. This includes:

- `loginViaUI`: Log in through the UI
- `loginViaAPI`: Log in by directly calling the API (faster)
- `createTestUser`: Create a test user if it doesn't exist
- `logout`: Log out the current user

## CI Integration

These tests can be integrated into a CI pipeline. The Playwright configuration includes settings for CI environments:

```javascript
/* Retry on CI only */
retries: process.env.CI ? 2 : 0,
```

## Updating Tests

When updating components in the application, make sure to update the corresponding tests. If you add new data-testid attributes, update the selectors in the tests accordingly.

## Adding New Tests

To add new tests:

1. Create a new file in the appropriate directory (auth/, pages/, etc.)
2. Import the required dependencies and helpers
3. Write your tests using the Playwright test framework
4. Make sure to handle authentication if needed

## Common Patterns

- Use data-testid attributes for selectors to make tests resilient to UI changes
- Mock API responses to test different scenarios
- Use the login helpers to authenticate before running tests
- Check for both positive and negative cases (success, validation errors, API errors)
