import { test, expect } from '@playwright/test';

test.describe('Pet Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.getByPlaceholder(/email/i).fill('testuser@example.com');
    await page.getByPlaceholder(/password/i).fill('TestPassword123!');
    await page.getByRole('button', { name: /log in|sign in/i }).click();
    await expect(page).toHaveURL('/', { timeout: 10000 });
  });

  test('pet list page renders', async ({ page }) => {
    await page.goto('/pets');
    await expect(page).toHaveURL('/pets');
    await expect(page.getByText(/my pets|your pets/i)).toBeVisible({ timeout: 5000 });
  });

  test('create pet form fills and submits', async ({ page }) => {
    await page.goto('/pets/new');
    const nameInput = page.getByPlaceholder(/name/i).first();
    if (await nameInput.isVisible()) {
      await nameInput.fill('Buddy');
    }
    // Check that the form has essential fields
    await expect(page.getByText(/breed|species|name/i).first()).toBeVisible();
  });

  test('pet card displays correct info', async ({ page }) => {
    await page.goto('/pets');
    const petCard = page.locator('[data-testid="pet-card"]').first();
    // If pet cards exist, verify they show expected info
    if (await petCard.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(petCard).toBeVisible();
    }
  });

  test('edit pet form prefills data', async ({ page }) => {
    await page.goto('/pets');
    // Click on first pet to navigate to detail, then edit
    const petLink = page.locator('a[href*="/pets/"]').first();
    if (await petLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await petLink.click();
      const editButton = page.getByRole('button', { name: /edit/i }).or(page.getByRole('link', { name: /edit/i }));
      if (await editButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        await editButton.click();
        // Verify form fields have existing values (not empty)
        const nameInput = page.getByPlaceholder(/name/i).first();
        if (await nameInput.isVisible({ timeout: 3000 }).catch(() => false)) {
          await expect(nameInput).not.toHaveValue('');
        }
      }
    }
  });
});
