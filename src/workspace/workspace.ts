// De lijst golven op het scherm. Gewone functies: elke functie geeft een nieuwe werkruimte terug.
import {
  addWaves,
  applyEnvelope,
  createEnvelope,
  createWave,
  DURATION,
  envelopeName,
  scaleWave,
  waveName,
  type AdsrSettings,
  type Samples,
  type WaveShape,
} from '../audio/index.ts';
import { formatNumber } from './labels.ts';

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

/** Een envelope: een volumeverloop van 2 seconden, met de instellingen van de schuifjes. */
export interface EnvelopeItem {
  name: string;
  settings: AdsrSettings;
  samples: Samples;
}

export interface Workspace {
  waves: WaveItem[];
  /** Hoeveel golfnamen al uitgedeeld zijn. Telt alleen op, dus namen worden niet hergebruikt. */
  waveCount: number;
  envelopes: EnvelopeItem[];
  /** Hoeveel envelopenamen al uitgedeeld zijn. Telt los van de golven. */
  envelopeCount: number;
}

/** De instellingen van een nieuwe envelope. */
export const DEFAULT_ADSR: AdsrSettings = { attack: 0.2, decay: 0.3, sustain: 0.6, release: 0.5 };

/** De langste tijd die je met een schuifje kan kiezen, in seconden: de duur van een golf. */
export const MAX_ADSR_TIME = DURATION;

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
  return { ...ws, waves: [...ws.waves, { name: waveName(waveCount), samples, source }], waveCount };
}

/** Een lege werkruimte. */
export function emptyWorkspace(): Workspace {
  return { waves: [], waveCount: 0, envelopes: [], envelopeCount: 0 };
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

/** De naam die de volgende nieuwe golf krijgt. */
export function nextWaveName(ws: Workspace): string {
  return waveName(ws.waveCount + 1);
}

function findWave(ws: Workspace, name: string): WaveItem | undefined {
  return ws.waves.find((wave) => wave.name === name);
}

/** Maakt een nieuwe golf: `factor` × de golf `name`, bijvoorbeeld "W3 = 0,5 × W1". */
export function addScaledWave(ws: Workspace, name: string, factor: number): Workspace {
  const wave = findWave(ws, name);
  if (!wave || !Number.isFinite(factor)) return ws;
  const description = `${nextWaveName(ws)} = ${formatNumber(factor)} × ${name}`;
  return addComputedWave(ws, scaleWave(wave.samples, factor), description);
}

/** Maakt een nieuwe golf: de som van de golven `first` en `second`, bijvoorbeeld "W3 = W1 + W2". */
export function addSummedWave(ws: Workspace, first: string, second: string): Workspace {
  const a = findWave(ws, first);
  const b = findWave(ws, second);
  if (!a || !b) return ws;
  const description = `${nextWaveName(ws)} = ${first} + ${second}`;
  return addComputedWave(ws, addWaves(a.samples, b.samples), description);
}

function findEnvelope(ws: Workspace, name: string): EnvelopeItem | undefined {
  return ws.envelopes.find((envelope) => envelope.name === name);
}

/**
 * Maakt een nieuwe golf: de golf `wave` vermenigvuldigd met de envelope `envelope`,
 * bijvoorbeeld "W3 = W1 × E1". Past de envelope later aan, dan verandert deze golf niet.
 */
export function addEnvelopedWave(ws: Workspace, wave: string, envelope: string): Workspace {
  const w = findWave(ws, wave);
  const e = findEnvelope(ws, envelope);
  if (!w || !e) return ws;
  const description = `${nextWaveName(ws)} = ${wave} × ${envelope}`;
  return addComputedWave(ws, applyEnvelope(w.samples, e.samples), description);
}

/** De naam die de volgende nieuwe envelope krijgt. */
export function nextEnvelopeName(ws: Workspace): string {
  return envelopeName(ws.envelopeCount + 1);
}

/** Voegt een envelope toe met een nieuwe naam (E1, E2 …). */
export function addEnvelope(ws: Workspace, settings: AdsrSettings = DEFAULT_ADSR): Workspace {
  const envelopeCount = ws.envelopeCount + 1;
  const envelope: EnvelopeItem = {
    name: envelopeName(envelopeCount),
    settings: { ...settings },
    samples: createEnvelope(settings),
  };
  return { ...ws, envelopes: [...ws.envelopes, envelope], envelopeCount };
}

/** Past de instellingen van een envelope aan. De naam blijft dezelfde. */
export function updateEnvelope(ws: Workspace, name: string, settings: AdsrSettings): Workspace {
  const values = [settings.attack, settings.decay, settings.sustain, settings.release];
  if (!values.every(Number.isFinite)) return ws;
  return {
    ...ws,
    envelopes: ws.envelopes.map((envelope) =>
      envelope.name === name
        ? { name, settings: { ...settings }, samples: createEnvelope(settings) }
        : envelope,
    ),
  };
}

/** Verwijdert een envelope. Haar naam wordt niet opnieuw gebruikt. */
export function removeEnvelope(ws: Workspace, name: string): Workspace {
  return { ...ws, envelopes: ws.envelopes.filter((envelope) => envelope.name !== name) };
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
