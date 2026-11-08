import { expect, test } from '@playwright/test';

test('een golf maken, inzoomen, afspelen en verwijderen', async ({ page }) => {
  const fouten: string[] = [];
  page.on('pageerror', (fout) => fouten.push(fout.message));
  page.on('console', (bericht) => {
    if (bericht.type() === 'error') fouten.push(bericht.text());
  });

  await page.goto('./');

  // Bij het openen staat W1 klaar: een sinus van 440 Hz met een grafiek.
  const kaart = page.getByRole('article', { name: 'Golf W1' });
  await expect(kaart.getByRole('heading', { name: 'W1' })).toBeVisible();
  await expect(kaart.getByText('Sinus, 440 Hz')).toBeVisible();
  const grafiek = kaart.getByRole('img', { name: 'Grafiek van W1' });
  await expect(grafiek.locator('canvas')).toBeVisible();

  // Vorm en frequentie wijzigen.
  await kaart.getByLabel('Vorm van W1').selectOption('square');
  await kaart.getByLabel('Frequentie van W1 (Hz)').fill('2');
  await expect(kaart.getByText('Blok, 2 Hz')).toBeVisible();

  const bereik = kaart.getByTestId('zichtbaar-bereik');
  await expect(bereik).toContainText('Zichtbaar: 0 s tot 2 s');
  await expect(kaart.getByRole('button', { name: 'Volledig beeld' })).toBeDisabled();

  // Inzoomen met de knop, en verschuiven.
  await kaart.getByRole('button', { name: 'Inzoomen' }).click();
  await expect(bereik).toContainText('Zichtbaar: 0,75 s tot 1,25 s');
  await kaart.getByRole('button', { name: 'Naar rechts' }).click();
  await expect(bereik).toContainText('Zichtbaar: 1 s tot 1,5 s');

  // Terug naar het volledige beeld.
  await kaart.getByRole('button', { name: 'Volledig beeld' }).click();
  await expect(bereik).toContainText('Zichtbaar: 0 s tot 2 s');

  // Inzoomen door over de grafiek te slepen (dat doet uPlot zelf).
  const vlak = grafiek.locator('.u-over');
  const doos = await vlak.boundingBox();
  if (!doos) throw new Error('Het grafiekvlak is niet zichtbaar.');
  await page.mouse.move(doos.x + doos.width * 0.2, doos.y + doos.height / 2);
  await page.mouse.down();
  await page.mouse.move(doos.x + doos.width * 0.4, doos.y + doos.height / 2, { steps: 5 });
  await page.mouse.up();
  await expect(bereik).not.toContainText('Zichtbaar: 0 s tot 2 s');
  await kaart.getByRole('button', { name: 'Volledig beeld' }).click();
  await expect(bereik).toContainText('Zichtbaar: 0 s tot 2 s');

  // Afspelen: Web Audio start zonder fout en stopt na 2 seconden.
  await kaart.getByRole('button', { name: 'Speel W1 af' }).click();
  await expect(kaart.getByRole('button', { name: 'Stop W1' })).toBeVisible();
  await expect(kaart.getByRole('button', { name: 'Speel W1 af' })).toBeVisible({ timeout: 5000 });
  await expect(kaart.getByText('Afspelen lukte niet in deze browser.')).toHaveCount(0);

  // Verwijderen.
  await kaart.getByRole('button', { name: 'Verwijder W1' }).click();
  await expect(kaart).toHaveCount(0);

  expect(fouten).toEqual([]);
});
