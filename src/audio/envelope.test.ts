import { describe, expect, it } from 'vitest';
import { ENVELOPE_PRESETS, applyEnvelope, createEnvelope, fitAdsr } from './envelope.ts';
import { SAMPLE_COUNT, SAMPLE_RATE, createWave } from './waves.ts';

function at(wave: Float32Array, seconds: number): number {
  return wave[Math.round(seconds * SAMPLE_RATE)];
}

describe('ADSR-envelope', () => {
  const settings = { attack: 0.1, decay: 0.2, sustain: 0.6, release: 0.5 };

  it('duurt 2 seconden', () => {
    expect(createEnvelope(settings).length).toBe(SAMPLE_COUNT);
  });

  it('begint op 0, staat na 0,1 s op 1, zakt naar sustain en eindigt op 0', () => {
    const envelope = createEnvelope(settings);
    expect(envelope[0]).toBe(0);
    expect(at(envelope, 0.05)).toBeCloseTo(0.5, 4);
    expect(at(envelope, 0.1)).toBeCloseTo(1, 6);
    expect(at(envelope, 0.2)).toBeCloseTo(0.8, 4);
    expect(at(envelope, 0.3)).toBeCloseTo(0.6, 6);
    expect(at(envelope, 1.0)).toBeCloseTo(0.6, 6);
    expect(at(envelope, 1.5)).toBeCloseTo(0.6, 6);
    expect(at(envelope, 1.75)).toBeCloseTo(0.3, 3);
    expect(envelope[SAMPLE_COUNT - 1]).toBe(0);
  });

  it('stijgt tijdens attack en daalt tijdens decay en release', () => {
    const envelope = createEnvelope(settings);
    const attackEnd = Math.round(0.1 * SAMPLE_RATE);
    for (let i = 1; i <= attackEnd; i++) {
      expect(envelope[i]).toBeGreaterThan(envelope[i - 1]);
    }
    for (let i = attackEnd + 1; i < SAMPLE_COUNT; i++) {
      expect(envelope[i]).toBeLessThanOrEqual(envelope[i - 1]);
    }
  });

  it('kort te lange tijden evenredig in', () => {
    const fitted = fitAdsr({ attack: 2, decay: 1, sustain: 0.5, release: 1 });
    expect(fitted.attack).toBeCloseTo(1, 10);
    expect(fitted.decay).toBeCloseTo(0.5, 10);
    expect(fitted.release).toBeCloseTo(0.5, 10);
    expect(fitted.sustain).toBe(0.5);

    const envelope = createEnvelope({ attack: 2, decay: 1, sustain: 0.5, release: 1 });
    expect(at(envelope, 1)).toBeCloseTo(1, 4);
    expect(at(envelope, 1.5)).toBeCloseTo(0.5, 4);
    expect(envelope[SAMPLE_COUNT - 1]).toBe(0);
  });

  it('laat tijden die passen ongemoeid', () => {
    expect(fitAdsr(settings)).toEqual(settings);
  });

  it('blijft altijd tussen 0 en 1, ook voor de voorbeeldinstellingen', () => {
    for (const preset of ENVELOPE_PRESETS) {
      const envelope = createEnvelope(preset.settings);
      expect(envelope.length).toBe(SAMPLE_COUNT);
      for (const value of envelope) {
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(1);
      }
      expect(envelope[SAMPLE_COUNT - 1]).toBe(0);
    }
  });

  it('heeft de voorbeelden Pluk, Orgel en Inzwellen', () => {
    expect(ENVELOPE_PRESETS.map((preset) => preset.name)).toEqual([
      'Pluk',
      'Orgel',
      'Inzwellen',
    ]);
  });
});

describe('golf maal envelope', () => {
  it('is op elk moment het product van beide en verandert de invoer niet', () => {
    const wave = createWave(4, 'sine');
    const envelope = createEnvelope({ attack: 0.3, decay: 0.3, sustain: 0.4, release: 0.6 });
    const waveBefore = Float32Array.from(wave);
    const envelopeBefore = Float32Array.from(envelope);

    const result = applyEnvelope(wave, envelope);

    expect(result.length).toBe(SAMPLE_COUNT);
    for (let i = 0; i < result.length; i++) {
      expect(result[i]).toBeCloseTo(wave[i] * envelope[i], 6);
    }
    expect(wave).toEqual(waveBefore);
    expect(envelope).toEqual(envelopeBefore);
  });
});
