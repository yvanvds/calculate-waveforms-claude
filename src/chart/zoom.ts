// Berekent welk stuk van de tijdas zichtbaar is bij de knoppen onder de grafiek.
// Het tekenen, en inzoomen door te slepen, doet uPlot zelf.
import { DURATION } from '../audio/index.ts';

export interface TimeRange {
  min: number;
  max: number;
}

/** Het volledige beeld: de hele golf van 0 tot 2 seconden. */
export const FULL_RANGE: TimeRange = { min: 0, max: DURATION };

/** Kleinste zichtbare stuk, in seconden. Kleiner heeft geen zin bij 44100 samples per seconde. */
export const MIN_SPAN = 0.0005;

/** Houdt het stuk binnen 0 tot 2 seconden, met dezelfde breedte als dat kan. */
export function clampRange(range: TimeRange): TimeRange {
  const span = Math.min(Math.max(range.max - range.min, MIN_SPAN), DURATION);
  let min = range.min;
  if (min < 0) min = 0;
  if (min + span > DURATION) min = DURATION - span;
  return { min, max: min + span };
}

/** Zoomt in of uit rond het midden. Een factor kleiner dan 1 zoomt in. */
export function zoomRange(range: TimeRange, factor: number): TimeRange {
  const center = (range.min + range.max) / 2;
  const half = ((range.max - range.min) * factor) / 2;
  return clampRange({ min: center - half, max: center + half });
}

/** Verschuift het stuk met een deel van zijn breedte. Negatief is naar links. */
export function panRange(range: TimeRange, fraction: number): TimeRange {
  const shift = (range.max - range.min) * fraction;
  return clampRange({ min: range.min + shift, max: range.max + shift });
}

export function isFullRange(range: TimeRange): boolean {
  return range.min <= FULL_RANGE.min && range.max >= FULL_RANGE.max;
}
