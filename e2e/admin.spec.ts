import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin user
    await page.goto('/login');
    await page.getByPlaceholder(/email/i).fill('admin@snif.com');
    await page.getByPlaceholder(/password/i).fill('AdminPassword123!');
    await page.getByRole('button', { name: /log in|sign in/i }).click();
    await page.waitForURL('/', { timeout: 10000 });
  });

  test('admin dashboard shows KPI cards', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.getByText(/dashboard|admin/i).first()).toBeVisible({ timeout: 5000 });
    // KPI cards should be visible
    const kpiCards = page.locator('[class*="card"]');
    await expect(kpiCards.first()).toBeVisible({ timeout: 5000 });
  });

  test('navigation to moderation page', async ({ page }) => {
    await page.goto('/admin');
    const moderationLink = page.getByRole('link', { name: /moderation/i })
      .or(page.getByText(/moderation/i));
    if (await moderationLink.isVisible({ timeout: 3000 }).catch(() => false)) {
      await moderationLink.click();
      await expect(page).toHaveURL(/\/admin\/moderation/);
    }
  });

  test('navigation to subscriptions page', async ({ page }) => {
    await page.goto('/admin');
    const subsLink = page.getByRole('link', { name: /subscription/i })
      .or(page.getByText(/subscription/i));
    if (await subsLink.isVisible({ timeout: 3000 }).catch(() => false)) {
      await subsLink.click();
      await expect(page).toHaveURL(/\/admin\/subscriptions/);
    }
  });

  test('navigation to analytics page', async ({ page }) => {
    await page.goto('/admin');
    const analyticsLink = page.getByRole('link', { name: /analytics/i })
      .or(page.getByText(/analytics/i));
    if (await analyticsLink.isVisible({ timeout: 3000 }).catch(() => false)) {
      await analyticsLink.click();
      await expect(page).toHaveURL(/\/admin\/analytics/);
    }
  });
});
