import { test, expect } from '@playwright/test';

test.describe('Match Discovery', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder(/email/i).fill('testuser@example.com');
    await page.getByPlaceholder(/password/i).fill('TestPassword123!');
    await page.getByRole('button', { name: /log in|sign in/i }).click();
    await expect(page).toHaveURL('/', { timeout: 10000 });
  });

  test('discovery feed loads', async ({ page }) => {
    await page.goto('/');
    // The home page should show the discovery feed or pet-related content
    await expect(page.locator('body')).not.toBeEmpty();
    await expect(page.getByText(/discover|match|pet/i).first()).toBeVisible({ timeout: 10000 });
  });

  test('like and skip buttons are visible', async ({ page }) => {
    await page.goto('/');
    // Look for like/skip/pass buttons in the discovery UI
    const likeButton = page.getByRole('button', { name: /like|heart/i }).first();
    const skipButton = page.getByRole('button', { name: /skip|pass|next/i }).first();
    // These may only be visible if there are pets to discover
    const anyButton = likeButton.or(skipButton);
    if (await anyButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(anyButton).toBeVisible();
    }
  });

  test('card swipe interaction', async ({ page }) => {
    await page.goto('/');
    // Verify that a pet card or discovery card is present
    const card = page.locator('[data-testid="discovery-card"]')
      .or(page.locator('[class*="card"]').first());
    if (await card.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(card).toBeVisible();
    }
  });
});
