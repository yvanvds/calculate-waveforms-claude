import { expect, test } from '@playwright/test';

test('de startpagina toont de titel', async ({ page }) => {
  await page.goto('./');
  await expect(page).toHaveTitle('Rekenen met waveforms');
  const titel = page.getByRole('heading', { level: 1, name: 'Rekenen met waveforms' });
  await expect(titel).toBeVisible();
});

test('de startpagina gebruikt het design system', async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.locator('body')).toHaveClass(/ai-root/);

  const titel = page.getByRole('heading', { level: 1, name: 'Rekenen met waveforms' });
  // Kleur `forest` en letter Figtree komen uit design-system/tokens.css.
  await expect(titel).toHaveCSS('color', 'rgb(16, 62, 24)');
  await expect(titel).toHaveCSS('font-family', /Figtree/);
});
