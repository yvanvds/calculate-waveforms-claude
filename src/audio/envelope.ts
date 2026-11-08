import { DURATION, SAMPLE_COUNT, multiplyWaves, timeOf, type Samples } from './waves.ts';

/** Instellingen van een ADSR-envelope. Tijden in seconden, sustain als niveau van 0 tot 1. */
export interface AdsrSettings {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
}

export interface EnvelopePreset {
  name: string;
  settings: AdsrSettings;
}

/** Voorbeeldinstellingen om mee te beginnen. */
export const ENVELOPE_PRESETS: readonly EnvelopePreset[] = [
  { name: 'Pluk', settings: { attack: 0.005, decay: 0.6, sustain: 0, release: 0.1 } },
  { name: 'Orgel', settings: { attack: 0.01, decay: 0, sustain: 1, release: 0.01 } },
  { name: 'Inzwellen', settings: { attack: 1.2, decay: 0.2, sustain: 0.8, release: 0.4 } },
];

/**
 * Past attack, decay en release aan zodat ze samen niet langer zijn dan de golf.
 * Te lange tijden worden evenredig ingekort. Negatieve waarden worden 0.
 */
export function fitAdsr(settings: AdsrSettings): AdsrSettings {
  const attack = Math.max(0, settings.attack);
  const decay = Math.max(0, settings.decay);
  const release = Math.max(0, settings.release);
  const sustain = Math.min(1, Math.max(0, settings.sustain));
  const total = attack + decay + release;
  const factor = total > DURATION ? DURATION / total : 1;
  return { attack: attack * factor, decay: decay * factor, sustain, release: release * factor };
}

/**
 * Maakt een envelope van 2 seconden: van 0 naar 1 tijdens attack, naar het
 * sustain-niveau tijdens decay, daar blijven, en naar 0 tijdens de laatste release-seconden.
 */
export function createEnvelope(settings: AdsrSettings): Samples {
  const { attack, decay, sustain, release } = fitAdsr(settings);
  const lastTime = timeOf(SAMPLE_COUNT - 1);
  const releaseStart = DURATION - release;
  const result = new Float32Array(SAMPLE_COUNT);

  for (let i = 0; i < SAMPLE_COUNT; i++) {
    const t = timeOf(i);
    let value: number;
    if (t < attack) {
      value = t / attack;
    } else if (t < attack + decay) {
      value = 1 - (1 - sustain) * ((t - attack) / decay);
    } else {
      value = sustain;
    }
    if (release > 0 && t >= releaseStart) {
      // Release begint pas na attack en decay, dus vanaf het sustain-niveau.
      // Zo eindigt de laatste sample precies op 0.
      const remaining = lastTime - releaseStart;
      const fraction = remaining > 0 ? Math.max(0, (lastTime - t) / remaining) : 0;
      value = sustain * fraction;
    }
    result[i] = value;
  }
  return result;
}

/** Vermenigvuldigt een golf sample per sample met een envelope. */
export function applyEnvelope(wave: Samples, envelope: Samples): Samples {
  return multiplyWaves(wave, envelope);
}
