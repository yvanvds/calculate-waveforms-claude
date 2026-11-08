import { expect, test, type Page } from '@playwright/test';

// Meet wat er echt naar de luidspreker gaat. Elke bron die de app met de uitgang
// verbindt, krijgt er een AnalyserNode bij. Die meet de sterkste waarde die voorbijkomt.
// Ook de buffer zelf wordt nagekeken: hoe hoog hij gaat en hoe vaak hij door 0 gaat.
const meetSignaal = `
window.metingen = [];
const verbind = AudioNode.prototype.connect;
AudioNode.prototype.connect = function (doel, ...rest) {
  const resultaat = verbind.call(this, doel, ...rest);
  if (doel instanceof AudioDestinationNode) {
    const bron = this;
    const analyser = bron.context.createAnalyser();
    verbind.call(bron, analyser);
    const data = new Float32Array(analyser.fftSize);
    const meting = { toestand: bron.context.state, piek: 0, bufferPiek: 0, nuldoorgangen: 0 };
    if (bron.buffer) {
      const kanaal = bron.buffer.getChannelData(0);
      for (let i = 0; i < kanaal.length; i++) {
        meting.bufferPiek = Math.max(meting.bufferPiek, Math.abs(kanaal[i]));
        if (i > 0 && (kanaal[i - 1] < 0) !== (kanaal[i] < 0)) meting.nuldoorgangen++;
      }
    }
    window.metingen.push(meting);
    const klok = setInterval(() => {
      analyser.getFloatTimeDomainData(data);
      for (const waarde of data) meting.piek = Math.max(meting.piek, Math.abs(waarde));
    }, 20);
    setTimeout(() => clearInterval(klok), 2500);
  }
  return resultaat;
};
`;

interface Meting {
  toestand: string;
  piek: number;
  bufferPiek: number;
  nuldoorgangen: number;
}

async function metingen(page: Page): Promise<Meting[]> {
  return (await page.evaluate('window.metingen')) as Meting[];
}

test('afspelen stuurt echt een toon van 440 Hz naar de luidspreker', async ({ page }) => {
  const fouten: string[] = [];
  page.on('pageerror', (fout) => fouten.push(fout.message));
  await page.addInitScript({ content: meetSignaal });
  await page.goto('./');

  const kaart = page.getByRole('article', { name: 'Golf W1' });
  await kaart.getByRole('button', { name: 'Speel W1 af' }).click();
  await expect(kaart.getByRole('button', { name: 'Stop W1' })).toBeVisible();
  await expect(kaart.getByText(/Hoor je niets\?/)).toBeVisible();
  await expect(kaart.getByText(/start hem opnieuw/)).toBeVisible();
  await expect(kaart.getByRole('button', { name: 'Speel W1 af' })).toBeVisible({ timeout: 5000 });

  const [meting] = await metingen(page);
  expect(meting.toestand).toBe('running');
  // Er komt echt geluid uit, op normaal volume.
  expect(meting.piek).toBeGreaterThan(0.9);
  expect(meting.piek).toBeLessThanOrEqual(1.01);
  // 440 trillingen per seconde, 2 seconden lang: ongeveer 2 × 440 × 2 = 1760 keer door 0.
  expect(meting.nuldoorgangen).toBeGreaterThan(1750);
  expect(meting.nuldoorgangen).toBeLessThan(1770);
  await expect(kaart.getByRole('alert')).toHaveCount(0);

  // Een golf tot 3 klinkt niet harder dan een golf tot 1.
  const balk = page.getByRole('region', { name: 'Bewerkingen' });
  const vermenigvuldig = balk.getByRole('group', { name: 'Golf vermenigvuldigen met een getal' });
  await vermenigvuldig.getByLabel('Golf om te vermenigvuldigen').selectOption('W1');
  await vermenigvuldig.getByLabel('Getal').fill('3');
  await vermenigvuldig.getByRole('button', { name: 'Vermenigvuldig' }).click();
  const luid = page.getByRole('article', { name: 'Golf W2' });
  await expect(luid.getByText('Buiten het bereik -1 tot 1')).toBeVisible();
  await luid.getByRole('button', { name: 'Speel W2 af' }).click();
  await expect(luid.getByRole('button', { name: 'Speel W2 af' })).toBeVisible({ timeout: 5000 });

  const [, tweede] = await metingen(page);
  expect(tweede.bufferPiek).toBeLessThanOrEqual(1.0001);
  expect(tweede.piek).toBeGreaterThan(0.9);
  expect(tweede.piek).toBeLessThanOrEqual(1.01);

  expect(fouten).toEqual([]);
});

test('houdt de browser het geluid tegen, dan staat er een melding op de kaart', async ({ page }) => {
  // Doe alsof de browser de AudioContext niet laat starten.
  await page.addInitScript({
    content: `
      Object.defineProperty(BaseAudioContext.prototype, 'state', { get: () => 'suspended' });
      AudioContext.prototype.resume = () => new Promise(() => {});
    `,
  });
  await page.goto('./');

  const kaart = page.getByRole('article', { name: 'Golf W1' });
  await kaart.getByRole('button', { name: 'Speel W1 af' }).click();
  const melding = kaart.getByRole('alert');
  await expect(melding).toContainText('Afspelen lukte niet');
  await expect(melding).toContainText('De browser houdt het geluid tegen.');
  await expect(melding.locator('svg')).toBeVisible();
  // De knop blijft niet op "Stop" staan.
  await expect(kaart.getByRole('button', { name: 'Speel W1 af' })).toBeVisible();
});
