import { describe, expect, it } from 'vitest';
import { isOutOfRange, peakOf, playbackGain } from './range.ts';
import { createWave, scaleWave } from './waves.ts';

describe('bereik van een golf', () => {
  it('vindt de piek, ook als die negatief is', () => {
    expect(peakOf(new Float32Array([0.2, -1.5, 0.9]))).toBe(1.5);
  });

  it('een gewone golf blijft binnen -1 tot 1', () => {
    const wave = createWave(440, 'square');
    expect(isOutOfRange(wave)).toBe(false);
    expect(playbackGain(wave)).toBe(1);
  });

  it('een versterkte golf gaat buiten het bereik en wordt stiller afgespeeld', () => {
    const wave = scaleWave(createWave(440, 'square'), 4);
    expect(isOutOfRange(wave)).toBe(true);
    expect(playbackGain(wave)).toBeCloseTo(0.25);
    expect(peakOf(wave) * playbackGain(wave)).toBeCloseTo(1);
  });

  it('een stille golf geeft geen deling door nul', () => {
    expect(playbackGain(new Float32Array(10))).toBe(1);
  });
});
