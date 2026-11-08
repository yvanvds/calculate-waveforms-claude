// Rekenen met golven. Geen React en geen Web Audio: gewone functies op een lijst samples.

/** Aantal samples per seconde, voor alle golven hetzelfde. */
export const SAMPLE_RATE = 44100;

/** Duur van elke golf in seconden. */
export const DURATION = 2;

/** Aantal samples in elke golf. */
export const SAMPLE_COUNT = SAMPLE_RATE * DURATION;

/** Een golf is een lijst van SAMPLE_COUNT samples. */
export type Samples = Float32Array;

export type WaveShape = 'sine' | 'square' | 'sawtooth' | 'triangle';

export const WAVE_SHAPES: readonly WaveShape[] = ['sine', 'square', 'sawtooth', 'triangle'];

/** Tijd in seconden van sample nummer `index`. */
export function timeOf(index: number): number {
  return index / SAMPLE_RATE;
}

/** Waarde van een vorm op een plek in de periode (0 tot 1), tussen -1 en 1. */
function shapeValue(shape: WaveShape, phase: number, cycles: number): number {
  switch (shape) {
    case 'sine':
      return Math.sin(2 * Math.PI * cycles);
    case 'square':
      return phase < 0.5 ? 1 : -1;
    case 'sawtooth':
      return 2 * phase - 1;
    case 'triangle':
      if (phase < 0.25) return 4 * phase;
      if (phase < 0.75) return 2 - 4 * phase;
      return 4 * phase - 4;
  }
}

/** Maakt een golf van 2 seconden met de gegeven frequentie (Hz) en vorm. */
export function createWave(frequency: number, shape: WaveShape): Samples {
  const result = new Float32Array(SAMPLE_COUNT);
  for (let i = 0; i < SAMPLE_COUNT; i++) {
    // Eerst vermenigvuldigen, dan delen: zo valt het begin van elke periode exact juist.
    const cycles = (frequency * i) / SAMPLE_RATE;
    const phase = cycles - Math.floor(cycles);
    result[i] = shapeValue(shape, phase, cycles);
  }
  return result;
}

/** Vermenigvuldigt elke sample met een getal. Geeft een nieuwe golf terug. */
export function scaleWave(wave: Samples, factor: number): Samples {
  return wave.map((value) => value * factor);
}

/** Telt twee golven sample per sample op. Geeft een nieuwe golf terug. */
export function addWaves(a: Samples, b: Samples): Samples {
  assertSameLength(a, b);
  return a.map((value, i) => value + b[i]);
}

/** Vermenigvuldigt twee lijsten sample per sample, bijvoorbeeld een golf met een envelope. */
export function multiplyWaves(a: Samples, b: Samples): Samples {
  assertSameLength(a, b);
  return a.map((value, i) => value * b[i]);
}

function assertSameLength(a: Samples, b: Samples): void {
  if (a.length !== b.length) {
    throw new Error('Beide golven moeten even lang zijn.');
  }
}
