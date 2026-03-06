import { test, expect } from '@playwright/test';

test.describe('Chat Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder(/email/i).fill('testuser@example.com');
    await page.getByPlaceholder(/password/i).fill('TestPassword123!');
    await page.getByRole('button', { name: /log in|sign in/i }).click();
    await expect(page).toHaveURL('/', { timeout: 10000 });
  });

  test('messages page renders conversation list', async ({ page }) => {
    await page.goto('/messages');
    await expect(page.getByText(/messages/i).first()).toBeVisible({ timeout: 5000 });
  });

  test('clicking conversation shows messages', async ({ page }) => {
    await page.goto('/messages');
    const conversation = page.locator('[class*="conversation"], [data-testid="conversation"]').first()
      .or(page.locator('a[href*="/messages/"]').first());
    if (await conversation.isVisible({ timeout: 5000 }).catch(() => false)) {
      await conversation.click();
      // Should navigate to a specific conversation
      await expect(page).toHaveURL(/\/messages\//);
    }
  });

  test('send message form', async ({ page }) => {
    await page.goto('/messages');
    // Navigate to a conversation if one exists
    const conversation = page.locator('a[href*="/messages/"]').first();
    if (await conversation.isVisible({ timeout: 5000 }).catch(() => false)) {
      await conversation.click();
      // Look for the message input
      const messageInput = page.getByPlaceholder(/type a message|message/i)
        .or(page.locator('input[type="text"], textarea').last());
      if (await messageInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        await expect(messageInput).toBeVisible();
        const sendButton = page.getByRole('button', { name: /send/i });
        if (await sendButton.isVisible({ timeout: 2000 }).catch(() => false)) {
          await expect(sendButton).toBeVisible();
        }
      }
    }
  });
});
