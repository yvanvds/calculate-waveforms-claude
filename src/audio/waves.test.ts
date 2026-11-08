import { describe, expect, it } from 'vitest';
import {
  SAMPLE_COUNT,
  SAMPLE_RATE,
  WAVE_SHAPES,
  addWaves,
  createWave,
  multiplyWaves,
  scaleWave,
} from './waves.ts';

/** Sample op een tijdstip in seconden. */
function at(wave: Float32Array, seconds: number): number {
  return wave[Math.round(seconds * SAMPLE_RATE)];
}

function countPeaks(wave: Float32Array): number {
  let peaks = 0;
  for (let i = 1; i < wave.length - 1; i++) {
    if (wave[i] >= wave[i - 1] && wave[i] > wave[i + 1]) peaks++;
  }
  return peaks;
}

describe('golven maken', () => {
  it.each(WAVE_SHAPES)('%s duurt precies 2 seconden', (shape) => {
    const wave = createWave(440, shape);
    expect(wave.length).toBe(2 * SAMPLE_RATE);
    expect(wave.length).toBe(SAMPLE_COUNT);
  });

  it.each(WAVE_SHAPES)('%s blijft tussen -1 en 1', (shape) => {
    const wave = createWave(123.4, shape);
    for (const value of wave) {
      expect(value).toBeGreaterThanOrEqual(-1);
      expect(value).toBeLessThanOrEqual(1);
    }
  });

  it('sinus van 1 Hz: 0 bij het begin, 1 na 0,25 s en -1 na 0,75 s', () => {
    const wave = createWave(1, 'sine');
    expect(at(wave, 0)).toBeCloseTo(0, 6);
    expect(at(wave, 0.25)).toBeCloseTo(1, 6);
    expect(at(wave, 0.75)).toBeCloseTo(-1, 6);
  });

  it('blokgolf heeft alleen de waarden 1 en -1', () => {
    const wave = createWave(7, 'square');
    expect(new Set(wave)).toEqual(new Set([1, -1]));
  });

  it('zaagtand stijgt in elke periode van -1 naar 1', () => {
    const frequency = 10;
    const wave = createWave(frequency, 'sawtooth');
    const period = SAMPLE_RATE / frequency;
    for (let start = 0; start < SAMPLE_COUNT; start += period) {
      expect(wave[start]).toBeCloseTo(-1, 5);
      expect(wave[start + period - 1]).toBeCloseTo(1, 2);
      for (let i = start + 1; i < start + period; i++) {
        expect(wave[i]).toBeGreaterThan(wave[i - 1]);
      }
    }
  });

  it('driehoek gaat tussen -1 en 1 op en neer', () => {
    const wave = createWave(1, 'triangle');
    expect(at(wave, 0)).toBeCloseTo(0, 6);
    expect(at(wave, 0.25)).toBeCloseTo(1, 6);
    expect(at(wave, 0.5)).toBeCloseTo(0, 6);
    expect(at(wave, 0.75)).toBeCloseTo(-1, 6);
    expect(at(wave, 1)).toBeCloseTo(0, 6);
    // stijgt tot 0,25 s, daalt tot 0,75 s, stijgt daarna weer
    expect(at(wave, 0.1)).toBeLessThan(at(wave, 0.2));
    expect(at(wave, 0.3)).toBeGreaterThan(at(wave, 0.7));
    expect(at(wave, 0.8)).toBeLessThan(at(wave, 0.9));
  });

  it('een golf van 10 Hz heeft in 2 seconden 20 volledige trillingen', () => {
    const wave = createWave(10, 'sine');
    expect(countPeaks(wave)).toBe(20);
    const period = SAMPLE_RATE / 10;
    for (let i = 0; i < SAMPLE_COUNT - period; i += 997) {
      expect(wave[i + period]).toBeCloseTo(wave[i], 4);
    }
  });
});

describe('bewerkingen', () => {
  it('vermenigvuldigen met 0,5 halveert elke sample', () => {
    const wave = createWave(3, 'sawtooth');
    const half = scaleWave(wave, 0.5);
    expect(half.length).toBe(wave.length);
    for (let i = 0; i < wave.length; i++) {
      expect(half[i]).toBeCloseTo(wave[i] / 2, 6);
    }
  });

  it('vermenigvuldigen met 0 of een negatief getal werkt ook', () => {
    const wave = createWave(3, 'sine');
    expect(scaleWave(wave, 0).every((value) => value === 0)).toBe(true);
    const flipped = scaleWave(wave, -2);
    for (let i = 0; i < wave.length; i += 101) {
      expect(flipped[i]).toBeCloseTo(-2 * wave[i], 5);
    }
  });

  it('W1 + W2 is op elk moment de som, en W1 en W2 blijven ongewijzigd', () => {
    const w1 = createWave(5, 'sine');
    const w2 = createWave(8, 'triangle');
    const w1Before = Float32Array.from(w1);
    const w2Before = Float32Array.from(w2);

    const w3 = addWaves(w1, w2);

    expect(w3).not.toBe(w1);
    expect(w3).not.toBe(w2);
    for (let i = 0; i < w3.length; i++) {
      expect(w3[i]).toBeCloseTo(w1[i] + w2[i], 6);
    }
    expect(w1).toEqual(w1Before);
    expect(w2).toEqual(w2Before);
  });

  it('vermenigvuldigen verandert de oorspronkelijke golf niet', () => {
    const wave = createWave(5, 'square');
    const before = Float32Array.from(wave);
    scaleWave(wave, 3);
    multiplyWaves(wave, wave);
    expect(wave).toEqual(before);
  });

  it('optellen van golven met een verschillende lengte geeft een fout', () => {
    expect(() => addWaves(new Float32Array(3), new Float32Array(4))).toThrow();
  });
});
