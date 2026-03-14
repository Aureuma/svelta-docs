import { expect, test } from '@playwright/test';

test('docs index renders section grid and links into a docs page', async ({ page }) => {
  await page.goto('/docs');

  await expect(page.getByTestId('docs-section-grid')).toBeVisible();
  await expect(page.getByTestId('docs-home-tabs')).toBeVisible();
  await expect(page.getByTestId('docs-faq')).toBeVisible();
  await expect(page.getByTestId('docs-search-trigger')).toContainText('Search docs...');
  await expect(page.getByTestId('site-header')).toHaveCount(1);
  await page.getByRole('link', { name: 'Overview' }).first().click();
  await expect(page).toHaveURL(/\/docs\/overview$/);
  await expect(page.getByTestId('site-header')).toHaveCount(1);
  await expect(page.getByTestId('docs-sidebar')).toBeVisible();
  await expect(page.getByTestId('docs-toc')).toBeVisible();
  await expect(page.getByTestId('docs-pager')).toBeVisible();
});

test('docs command palette opens and navigates to selected page', async ({ page }) => {
  await page.goto('/docs');

  await page.getByTestId('docs-search-trigger').click();
  const searchInput = page.getByPlaceholder('Search docs...');
  await expect(searchInput).toBeVisible();
  await searchInput.fill('Server API');
  await searchInput.press('Enter');
  await expect(page).toHaveURL(/\/docs\/server-api$/);
});

test('docs markdown enhancements render edit links, code-copy, and feedback', async ({ page }) => {
  await page.goto('/docs/overview');
  await expect(page.getByRole('link', { name: 'Edit Page' })).toHaveAttribute(
    'href',
    /\/src\/content\/docs\/overview\.md$/
  );
  await expect(page.locator('[data-admonition]').first()).toBeVisible();
  await page.getByTestId('docs-feedback-yes').click();
  await expect(page.getByTestId('docs-feedback')).toContainText('Thanks for the feedback.');

  await page.goto('/docs/getting-started');
  await expect(page.locator('[data-code-copy]').first()).toBeVisible();
});

test('appearance toggling applies the expected html class', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  const darkBtn = page.getByRole('button', { name: 'Dark' });
  await darkBtn.click();
  await expect(darkBtn).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('html')).toHaveClass(/dark/);

  const cobaltPaletteBtn = page.getByRole('button', { name: 'Use Cobalt palette' });
  await cobaltPaletteBtn.click();
  await expect(cobaltPaletteBtn).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('html')).toHaveAttribute('data-palette', 'cobalt');
});

test('mobile docs navigation opens in a sheet panel', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/docs/overview');

  await page.getByTestId('docs-mobile-nav-trigger').click();
  await expect(page.getByTestId('docs-mobile-nav-panel')).toBeVisible();
  await expect(page.getByTestId('docs-mobile-nav-panel').getByRole('link', { name: 'Overview' })).toBeVisible();
});
