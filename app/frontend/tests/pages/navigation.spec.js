const { test, expect } = require('@playwright/test');
const { loginViaAPI } = require('../utils/auth-helpers');

test.describe('Navigation and Routing', () => {
  test('should redirect unauthenticated users to login page', async ({ page }) => {
    // Try to access protected routes
    const protectedRoutes = [
      '/dashboard',
      '/prices',
      '/booking',
      '/alerts',
      '/tracking',
      '/tools',
      '/profile'
    ];
    
    for (const route of protectedRoutes) {
      await page.goto(route);
      await expect(page).toHaveURL('/login');
    }
  });
  
  test('should redirect authenticated users from auth pages to dashboard', async ({ page }) => {
    // Login
    await loginViaAPI(page, 'testuser', 'password123');
    
    // Try to access login/register pages
    await page.goto('/login');
    await expect(page).toHaveURL('/dashboard');
    
    await page.goto('/register');
    await expect(page).toHaveURL('/dashboard');
    
    await page.goto('/');
    await expect(page).toHaveURL('/dashboard');
  });
  
  test('should show 404 page for non-existent routes', async ({ page }) => {
    // Visit non-existent route
    await page.goto('/this-page-does-not-exist');
    
    // Check for 404 page
    await expect(page.locator('h1, h2')).toContainText(/not found|404/i);
  });
  
  test('should navigate through the app using the sidebar', async ({ page }) => {
    // Login first
    await loginViaAPI(page, 'testuser', 'password123');
    await page.goto('/dashboard');
    
    // Test navigation for each link
    const navigationLinks = [
      { href: '/prices', name: 'Prices' },
      { href: '/booking', name: 'Booking' },
      { href: '/alerts', name: 'Alerts' },
      { href: '/tracking', name: 'Tracking' },
      { href: '/tools', name: 'Tools' },
      { href: '/profile', name: 'Profile' }
    ];
    
    for (const link of navigationLinks) {
      // Click the link
      await page.click(`a[href="${link.href}"]`);
      
      // Verify URL changed
      await expect(page).toHaveURL(link.href);
      
      // Verify page title or header contains expected text
      // Replace this selector with an actual page title selector
      await expect(page.locator('h1, h2')).toContainText(new RegExp(link.name, 'i'));
    }
  });
  
  test('should show loading state during navigation', async ({ page }) => {
    // Login first
    await loginViaAPI(page, 'testuser', 'password123');
    
    // Slow down all responses
    await page.route('**/*', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      await route.continue();
    });
    
    // Go to dashboard
    await page.goto('/dashboard');
    
    // Click on a nav link
    await page.click('a[href="/prices"]');
    
    // Verify loading state appears
    // Replace this with the actual loading indicator
    await expect(page.locator('.loading-spinner, .loading')).toBeVisible();
    
    // Wait for navigation to complete
    await expect(page).toHaveURL('/prices');
  });
});
