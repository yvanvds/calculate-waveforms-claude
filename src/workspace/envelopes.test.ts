import { describe, expect, it } from 'vitest';
import {
  createEnvelope,
  createWave,
  ENVELOPE_PRESETS,
  SAMPLE_COUNT,
  SAMPLE_RATE,
} from '../audio/index.ts';
import {
  addEnvelope,
  addEnvelopedWave,
  addGeneratedWave,
  DEFAULT_ADSR,
  initialWorkspace,
  nextEnvelopeName,
  nextWaveName,
  removeEnvelope,
  updateEnvelope,
} from './workspace.ts';

const ORGEL = ENVELOPE_PRESETS.find((preset) => preset.name === 'Orgel')!.settings;

describe('envelopes in de werkruimte', () => {
  it('voegt E1 toe met de standaardinstellingen', () => {
    const ws = addEnvelope(initialWorkspace());
    expect(ws.envelopes).toHaveLength(1);
    const [e1] = ws.envelopes;
    expect(e1.name).toBe('E1');
    expect(e1.settings).toEqual(DEFAULT_ADSR);
    expect(e1.samples).toHaveLength(SAMPLE_COUNT);
    expect(e1.samples).toEqual(createEnvelope(DEFAULT_ADSR));
    // De golven blijven ongewijzigd.
    expect(ws.waves.map((wave) => wave.name)).toEqual(['W1']);
  });

  it('nummert golven en envelopes elk apart', () => {
    let ws = addGeneratedWave(initialWorkspace(), 220, 'sine');
    ws = addEnvelope(ws);
    expect(nextWaveName(ws)).toBe('W3');
    expect(nextEnvelopeName(ws)).toBe('E2');
    ws = addEnvelope(ws);
    expect(ws.envelopes.map((e) => e.name)).toEqual(['E1', 'E2']);
  });

  it('hergebruikt de naam van een verwijderde envelope niet', () => {
    let ws = addEnvelope(initialWorkspace());
    ws = removeEnvelope(ws, 'E1');
    expect(ws.envelopes).toHaveLength(0);
    ws = addEnvelope(ws);
    expect(ws.envelopes[0].name).toBe('E2');
  });

  it('stijgt trager naar 1 met een langere attack', () => {
    const before = addEnvelope(initialWorkspace());
    const after = updateEnvelope(before, 'E1', { ...DEFAULT_ADSR, attack: 1 });
    const t = Math.round(0.1 * SAMPLE_RATE);
    expect(after.envelopes[0].samples[t]).toBeLessThan(before.envelopes[0].samples[t]);
    expect(after.envelopes[0].settings.attack).toBe(1);
    // De oude werkruimte blijft ongewijzigd.
    expect(before.envelopes[0].settings).toEqual(DEFAULT_ADSR);
  });

  it('negeert instellingen die geen getal zijn', () => {
    const ws = addEnvelope(initialWorkspace());
    expect(updateEnvelope(ws, 'E1', { ...DEFAULT_ADSR, attack: Number.NaN })).toBe(ws);
  });

  it('vermenigvuldigt W1 met E1 tot een nieuwe golf, zonder W1 of E1 te veranderen', () => {
    const before = addEnvelope(initialWorkspace());
    const ws = addEnvelopedWave(before, 'W1', 'E1');
    expect(ws.waves).toHaveLength(2);
    const w2 = ws.waves[1];
    expect(w2.name).toBe('W2');
    expect(w2.source).toEqual({ kind: 'computed', description: 'W2 = W1 × E1' });

    const w1 = createWave(440, 'sine');
    const e1 = createEnvelope(DEFAULT_ADSR);
    for (const i of [0, 1000, 20000, 50000, SAMPLE_COUNT - 1]) {
      expect(w2.samples[i]).toBeCloseTo(w1[i] * e1[i], 6);
    }
    // Begint en eindigt stil.
    expect(w2.samples[0]).toBe(0);
    expect(w2.samples[SAMPLE_COUNT - 1]).toBeCloseTo(0, 6);

    expect(ws.waves[0].samples).toEqual(w1);
    expect(ws.envelopes[0].samples).toEqual(e1);
  });

  it('verandert een berekende golf niet als je de envelope nadien aanpast', () => {
    let ws = addEnvelopedWave(addEnvelope(initialWorkspace()), 'W1', 'E1');
    const computed = ws.waves[1].samples;
    ws = updateEnvelope(ws, 'E1', ORGEL);
    expect(ws.waves[1].samples).toBe(computed);
  });

  it('doet niets met een onbekende golf of envelope', () => {
    const ws = addEnvelope(initialWorkspace());
    expect(addEnvelopedWave(ws, 'W9', 'E1')).toBe(ws);
    expect(addEnvelopedWave(ws, 'W1', 'E9')).toBe(ws);
  });
});
