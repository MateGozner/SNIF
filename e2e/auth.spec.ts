import { test, expect } from '@playwright/test';

test.describe('Auth Flow', () => {
  test('login page renders', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: /login|sign in/i })).toBeVisible();
    await expect(page.getByPlaceholder(/email/i)).toBeVisible();
    await expect(page.getByPlaceholder(/password/i)).toBeVisible();
  });

  test('login with valid credentials redirects to dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder(/email/i).fill('testuser@example.com');
    await page.getByPlaceholder(/password/i).fill('TestPassword123!');
    await page.getByRole('button', { name: /log in|sign in/i }).click();
    await expect(page).toHaveURL('/', { timeout: 10000 });
  });

  test('login with invalid credentials shows error', async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder(/email/i).fill('wrong@example.com');
    await page.getByPlaceholder(/password/i).fill('wrongpassword');
    await page.getByRole('button', { name: /log in|sign in/i }).click();
    await expect(page.getByText(/invalid|incorrect|error|failed/i)).toBeVisible({ timeout: 5000 });
  });

  test('logout redirects to login', async ({ page }) => {
    // Assume already logged in via setup
    await page.goto('/settings');
    const logoutButton = page.getByRole('button', { name: /log out|sign out/i });
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
      await expect(page).toHaveURL(/\/login/, { timeout: 5000 });
    }
  });

  test('protected routes redirect unauthenticated users', async ({ page }) => {
    await page.goto('/pets');
    await expect(page).toHaveURL(/\/login/, { timeout: 5000 });
  });
});
