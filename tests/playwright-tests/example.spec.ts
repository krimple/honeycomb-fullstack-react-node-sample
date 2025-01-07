import { test, expect } from '@playwright/test';

test('get started link', async ({ page }) => {

  await page.goto('http://localhost:5173/');

  const originalValue = await page.getByTestId('message').innerText();

  // Click the get started link.
  await page.getByRole('button', { name: 'Say it!' }).click();

  await(expect(page.getByTestId('message'))).not.toHaveText(originalValue);
});
