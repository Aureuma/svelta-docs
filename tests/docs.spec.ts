import { expect, test } from '@playwright/test';

test('docs index renders current SI navigation and links into a docs page', async ({ page }) => {
  await page.goto('/docs');

  await expect(page.getByTestId('docs-search-trigger')).toContainText(
    'Search titles, headings, and page content'
  );
  await expect(page.getByTestId('docs-article-page')).toBeVisible();
  await expect(page.getByText('Aureuma AI')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Nucleus' }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: 'Host Test Matrix' }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: 'Unlisted' })).toHaveCount(0);
  await page.getByRole('link', { name: 'Nucleus' }).first().click();
  await expect(page).toHaveURL(/\/docs\/NUCLEUS$/);
  await expect(page.getByTestId('docs-toc')).toBeVisible();
  await expect(page.getByTestId('docs-pager')).toBeVisible();
});

test('docs command palette opens and navigates to selected page', async ({ page }) => {
  await page.goto('/docs');

  await page.getByTestId('docs-search-trigger').click();
  const searchInput = page.getByPlaceholder('Search...');
  await expect(searchInput).toBeVisible();
  await searchInput.fill('Host Test Matrix');
  await searchInput.press('Enter');
  await expect(page).toHaveURL(/\/docs\/HOST_TEST_MATRIX$/);
});

test('docs markdown enhancements render edit links, code-copy, and feedback', async ({ page }) => {
  await page.goto('/docs/NUCLEUS');
  await expect(page.getByRole('link', { name: 'Edit this page' })).toHaveAttribute(
    'href',
    /\/src\/content\/docs\/NUCLEUS\.md$/
  );
  await page.getByTestId('docs-feedback-yes').click();
  await expect(page.getByTestId('docs-feedback')).toContainText('Thanks for the feedback.');

  await page.goto('/docs/CLI_REFERENCE');
  await expect(
    page.getByRole('link', { name: 'Top-level command families#' })
  ).toBeVisible();
  await expect(page.locator('pre code').first()).toBeVisible();
});

test('appearance toggling applies the expected html class', async ({ page }) => {
  await page.goto('/docs');
  const toggleBtn = page.getByRole('button', { name: 'Toggle color mode' });
  const html = page.locator('html');
  const initialAppearance = await html.getAttribute('data-appearance');
  await toggleBtn.click();
  if (initialAppearance === 'dark') {
    await expect(html).toHaveAttribute('data-appearance', 'light');
    await expect(html).toHaveClass(/light/);
  } else {
    await expect(html).toHaveAttribute('data-appearance', 'dark');
    await expect(html).toHaveClass(/dark/);
  }
});

test('mobile docs navigation opens in a sheet panel', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/docs/NUCLEUS');

  await page.getByRole('button', { name: 'Open navigation' }).click();
  await expect(page.getByTestId('docs-mobile-nav-panel')).toBeVisible();
  await expect(
    page.getByTestId('docs-mobile-nav-panel').getByRole('link', { name: 'Nucleus' }).first()
  ).toBeVisible();
});
