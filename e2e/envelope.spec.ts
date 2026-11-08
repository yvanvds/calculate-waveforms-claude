import { expect, test } from '@playwright/test';

test('een envelope toevoegen, Orgel kiezen en een golf ermee vermenigvuldigen', async ({ page }) => {
  const fouten: string[] = [];
  page.on('pageerror', (fout) => fouten.push(fout.message));
  page.on('console', (bericht) => {
    if (bericht.type() === 'error') fouten.push(bericht.text());
  });

  await page.goto('./');
  const balk = page.getByRole('region', { name: 'Bewerkingen' });

  // Envelope toevoegen: E1 verschijnt met vier schuifjes en een grafiek.
  await balk.getByRole('button', { name: 'Envelope toevoegen' }).click();
  const e1 = page.getByRole('article', { name: 'Envelope E1' });
  for (const naam of ['Attack', 'Decay', 'Sustain', 'Release']) {
    await expect(e1.getByLabel(`${naam} van E1`)).toBeVisible();
  }
  await expect(e1.getByRole('img', { name: 'Grafiek van E1' }).locator('canvas')).toBeVisible();
  await expect(e1.getByRole('button', { name: /Speel/ })).toHaveCount(0);

  // Een schuifje verschuiven past de waarde ernaast aan.
  await e1.getByLabel('Attack van E1').fill('1');
  await expect(e1.getByText('1 s', { exact: true })).toBeVisible();

  // "Orgel" zet de schuifjes in één klik.
  await e1.getByRole('button', { name: 'Orgel' }).click();
  await expect(e1.getByLabel('Sustain van E1')).toHaveValue('1');
  await expect(e1.getByLabel('Attack van E1')).toHaveValue('0.01');
  await expect(e1.getByRole('button', { name: 'Orgel' })).toHaveAttribute('aria-pressed', 'true');

  // W1 vermenigvuldigen met E1: W2 verschijnt, W1 en E1 blijven.
  const bewerking = balk.getByRole('group', { name: 'Golf vermenigvuldigen met een envelope' });
  await bewerking.getByLabel('Golf', { exact: true }).selectOption('W1');
  await bewerking.getByLabel('Envelope', { exact: true }).selectOption('E1');
  await bewerking.getByRole('button', { name: 'Pas envelope toe' }).click();
  const w2 = page.getByRole('article', { name: 'Golf W2' });
  await expect(w2.getByText('W2 = W1 × E1')).toBeVisible();
  await expect(w2.getByRole('img', { name: 'Grafiek van W2' }).locator('canvas')).toBeVisible();
  await expect(w2.getByRole('button', { name: 'Speel W2 af' })).toBeVisible();
  await expect(page.getByRole('article', { name: 'Golf W1' }).getByText('Sinus, 440 Hz')).toBeVisible();
  await expect(e1.getByLabel('Sustain van E1')).toHaveValue('1');

  // De volgende envelope heet E2, los van de golven.
  await balk.getByRole('button', { name: 'Envelope toevoegen' }).click();
  await expect(page.getByRole('article', { name: 'Envelope E2' })).toBeVisible();

  // De nieuwe golf kan je verwijderen.
  await page.getByRole('button', { name: 'Verwijder W2' }).click();
  await expect(w2).toHaveCount(0);

  expect(fouten).toEqual([]);
});
