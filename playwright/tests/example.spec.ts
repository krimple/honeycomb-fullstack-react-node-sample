import { test, expect } from '@playwright/test';
import {randomUUID} from "node:crypto";

test.describe('basic test', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/');
  })
  test('has title', async ({ page }) => {
    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Honeycomb Full-stack Demo for HFO/);
  });

  test('add book', async ({ page }) => {
    const originalCount = await page.getByRole('list').getByRole('listitem').count();
    await page.getByLabel('isbn').fill(randomUUID());
    page.getByLabel('title').fill(randomUUID());
    page.getByLabel('description').fill(randomUUID());
    page.getByLabel('publicationDate').fill(new Date().toDateString());
    page.getByText('Add Book').click();
    const newCount = await page.locator('.book-list').getByRole('listitem').count();
    expect(newCount).toBe(originalCount + 1);
  })
});

// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');
//
//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();
//
//   // Expects page to have a heading with the name of Installation.
//   await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
// });
