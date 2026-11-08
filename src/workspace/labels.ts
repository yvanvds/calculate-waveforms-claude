import type { WaveShape } from '../audio/index.ts';
import type { WaveItem } from './workspace.ts';

export const SHAPE_LABELS: Record<WaveShape, string> = {
  sine: 'Sinus',
  square: 'Blok',
  sawtooth: 'Zaagtand',
  triangle: 'Driehoek',
};

/** Een getal zoals leerlingen het lezen: met komma en zonder overbodige nullen. */
export function formatNumber(value: number, maxDecimals = 4): string {
  return value.toLocaleString('nl-BE', { maximumFractionDigits: maxDecimals });
}

/**
 * Leest een decimaal getal zoals een leerling het typt: "0,5", "0.5", "-2" of ",5".
 * Geeft `null` terug als de tekst geen getal is, bijvoorbeeld "" of "abc".
 */
export function parseDecimal(text: string): number | null {
  const cleaned = text.trim().replace(',', '.');
  if (!/^[+-]?(\d+\.?\d*|\.\d+)$/.test(cleaned)) return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : null;
}

/** Korte beschrijving van een golf, zoals "Sinus, 440 Hz" of "W1 + W2". */
export function describeWave(wave: WaveItem): string {
  if (wave.source.kind === 'computed') return wave.source.description;
  return `${SHAPE_LABELS[wave.source.shape]}, ${formatNumber(wave.source.frequency)} Hz`;
}
