import { expect, test } from '@playwright/test';

test('een golf toevoegen, vermenigvuldigen en optellen', async ({ page }) => {
  const fouten: string[] = [];
  page.on('pageerror', (fout) => fouten.push(fout.message));
  page.on('console', (bericht) => {
    if (bericht.type() === 'error') fouten.push(bericht.text());
  });

  await page.goto('./');
  const balk = page.getByRole('region', { name: 'Bewerkingen' });

  // Nieuwe golf: W2 verschijnt.
  await balk.getByRole('button', { name: 'Nieuwe golf' }).click();
  const w2 = page.getByRole('article', { name: 'Golf W2' });
  await expect(w2.getByText('Sinus, 440 Hz')).toBeVisible();

  // W1 vermenigvuldigen met 0,5: W3 verschijnt, met een grafiek.
  const vermenigvuldig = balk.getByRole('group', { name: 'Golf vermenigvuldigen met een getal' });
  await vermenigvuldig.getByLabel('Golf om te vermenigvuldigen').selectOption('W1');
  await vermenigvuldig.getByLabel('Getal').fill('0,5');
  await vermenigvuldig.getByRole('button', { name: 'Vermenigvuldig' }).click();
  const w3 = page.getByRole('article', { name: 'Golf W3' });
  await expect(w3.getByText('W3 = 0,5 × W1')).toBeVisible();
  await expect(w3.getByRole('img', { name: 'Grafiek van W3' }).locator('canvas')).toBeVisible();
  await expect(w3.getByLabel(/Frequentie/)).toHaveCount(0);

  // Een ongeldig getal maakt geen golf.
  await vermenigvuldig.getByLabel('Getal').fill('abc');
  await vermenigvuldig.getByRole('button', { name: 'Vermenigvuldig' }).click();
  await expect(vermenigvuldig.getByRole('alert')).toContainText('Vul een getal in');
  await expect(page.getByRole('article')).toHaveCount(3);

  // W1 en W2 optellen: W4 verschijnt, met een melding dat ze buiten het bereik gaat.
  const optellen = balk.getByRole('group', { name: 'Twee golven optellen' });
  await optellen.getByLabel('Eerste golf').selectOption('W1');
  await optellen.getByLabel('Tweede golf').selectOption('W2');
  await optellen.getByRole('button', { name: 'Tel op' }).click();
  const w4 = page.getByRole('article', { name: 'Golf W4' });
  await expect(w4.getByText('W4 = W1 + W2')).toBeVisible();
  await expect(w4.getByText('Buiten het bereik -1 tot 1')).toBeVisible();

  // W1 verwijderen: de berekende golven blijven, en de volgende naam is nieuw.
  await page.getByRole('button', { name: 'Verwijder W1' }).click();
  await expect(page.getByRole('article', { name: 'Golf W1' })).toHaveCount(0);
  await expect(w3.getByText('W3 = 0,5 × W1')).toBeVisible();
  await expect(w4.getByText('W4 = W1 + W2')).toBeVisible();
  await balk.getByRole('button', { name: 'Nieuwe golf' }).click();
  await expect(page.getByRole('article', { name: 'Golf W5' })).toBeVisible();

  expect(fouten).toEqual([]);
});
