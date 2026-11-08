// De lijst golven op het scherm. Gewone functies: elke functie geeft een nieuwe werkruimte terug.
import { createWave, waveName, type Samples, type WaveShape } from '../audio/index.ts';

/** Een golf die de leerling zelf maakt: frequentie en vorm zijn te kiezen. */
export interface GeneratedSource {
  kind: 'generated';
  frequency: number;
  shape: WaveShape;
}

/** Een golf die uit een bewerking komt, met een beschrijving zoals "W1 + W2". */
export interface ComputedSource {
  kind: 'computed';
  description: string;
}

export interface WaveItem {
  name: string;
  samples: Samples;
  source: GeneratedSource | ComputedSource;
}

export interface Workspace {
  waves: WaveItem[];
  /** Hoeveel golfnamen al uitgedeeld zijn. Telt alleen op, dus namen worden niet hergebruikt. */
  waveCount: number;
}

export const DEFAULT_FREQUENCY = 440;
export const DEFAULT_SHAPE: WaveShape = 'sine';

/** De laagste en hoogste frequentie die je kan kiezen, in Hz. */
export const MIN_FREQUENCY = 0.1;
export const MAX_FREQUENCY = 20000;

export function isValidFrequency(frequency: number): boolean {
  return Number.isFinite(frequency) && frequency >= MIN_FREQUENCY && frequency <= MAX_FREQUENCY;
}

function addWave(ws: Workspace, samples: Samples, source: WaveItem['source']): Workspace {
  const waveCount = ws.waveCount + 1;
  return { waves: [...ws.waves, { name: waveName(waveCount), samples, source }], waveCount };
}

/** Een lege werkruimte. */
export function emptyWorkspace(): Workspace {
  return { waves: [], waveCount: 0 };
}

/** De werkruimte bij het openen van de app: W1, een sinus van 440 Hz. */
export function initialWorkspace(): Workspace {
  return addGeneratedWave(emptyWorkspace(), DEFAULT_FREQUENCY, DEFAULT_SHAPE);
}

/** Voegt een zelfgemaakte golf toe met een nieuwe naam. */
export function addGeneratedWave(ws: Workspace, frequency: number, shape: WaveShape): Workspace {
  return addWave(ws, createWave(frequency, shape), { kind: 'generated', frequency, shape });
}

/** Voegt het resultaat van een bewerking toe met een nieuwe naam. */
export function addComputedWave(ws: Workspace, samples: Samples, description: string): Workspace {
  return addWave(ws, samples, { kind: 'computed', description });
}

/** Past frequentie en vorm van een zelfgemaakte golf aan. De naam blijft dezelfde. */
export function updateGeneratedWave(
  ws: Workspace,
  name: string,
  frequency: number,
  shape: WaveShape,
): Workspace {
  if (!isValidFrequency(frequency)) return ws;
  return {
    ...ws,
    waves: ws.waves.map((wave) =>
      wave.name === name && wave.source.kind === 'generated'
        ? {
            name,
            samples: createWave(frequency, shape),
            source: { kind: 'generated', frequency, shape },
          }
        : wave,
    ),
  };
}

/** Verwijdert een golf. Haar naam wordt niet opnieuw gebruikt. */
export function removeWave(ws: Workspace, name: string): Workspace {
  return { ...ws, waves: ws.waves.filter((wave) => wave.name !== name) };
}
