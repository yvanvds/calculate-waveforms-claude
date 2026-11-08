import type { Samples } from './waves.ts';

/** De grootste afstand tot 0 in een golf (de piek). */
export function peakOf(wave: Samples): number {
  let peak = 0;
  for (const value of wave) {
    const size = Math.abs(value);
    if (size > peak) peak = size;
  }
  return peak;
}

/** Waar als de golf ergens onder -1 of boven 1 komt. */
export function isOutOfRange(wave: Samples): boolean {
  return peakOf(wave) > 1;
}

/**
 * Factor waarmee de golf afgespeeld wordt, zodat ze nooit harder klinkt
 * dan een golf die precies tot 1 gaat. Golven binnen -1 tot 1 blijven gelijk.
 */
export function playbackGain(wave: Samples): number {
  const peak = peakOf(wave);
  return peak > 1 ? 1 / peak : 1;
}
