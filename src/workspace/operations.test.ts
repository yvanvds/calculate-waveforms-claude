import { describe, expect, it } from 'vitest';
import { createWave, isOutOfRange, peakOf } from '../audio/index.ts';
import { describeWave, parseDecimal } from './labels.ts';
import {
  addGeneratedWave,
  addScaledWave,
  addSummedWave,
  initialWorkspace,
  nextWaveName,
  removeWave,
} from './workspace.ts';

function withTwoWaves() {
  return addGeneratedWave(initialWorkspace(), 440, 'sine');
}

describe('decimale getallen lezen', () => {
  it('aanvaardt een komma en een punt', () => {
    expect(parseDecimal('0,5')).toBe(0.5);
    expect(parseDecimal('0.5')).toBe(0.5);
    expect(parseDecimal(' -2 ')).toBe(-2);
    expect(parseDecimal(',25')).toBe(0.25);
    expect(parseDecimal('3')).toBe(3);
  });

  it('weigert tekst die geen getal is', () => {
    expect(parseDecimal('')).toBeNull();
    expect(parseDecimal('   ')).toBeNull();
    expect(parseDecimal('abc')).toBeNull();
    expect(parseDecimal('1,2,3')).toBeNull();
    expect(parseDecimal('2x')).toBeNull();
    expect(parseDecimal('-')).toBeNull();
  });
});

describe('bewerkingen in de werkruimte', () => {
  it('vermenigvuldigt W1 met 0,5 tot een nieuwe golf, en laat W1 ongewijzigd', () => {
    const before = withTwoWaves();
    const ws = addScaledWave(before, 'W1', 0.5);
    expect(ws.waves.map((w) => w.name)).toEqual(['W1', 'W2', 'W3']);
    const w3 = ws.waves[2];
    expect(describeWave(w3)).toBe('W3 = 0,5 × W1');
    expect(peakOf(w3.samples)).toBeCloseTo(peakOf(ws.waves[0].samples) / 2, 6);
    expect(ws.waves[0]).toBe(before.waves[0]);
    expect(ws.waves[0].samples).toEqual(createWave(440, 'sine'));
  });

  it('schrijft een negatief getal met een minteken', () => {
    const ws = addScaledWave(initialWorkspace(), 'W1', -2);
    expect(describeWave(ws.waves[1])).toBe('W2 = -2 × W1');
    expect(ws.waves[1].samples[100]).toBeCloseTo(-2 * ws.waves[0].samples[100], 5);
  });

  it('telt W1 en W2 op tot een nieuwe golf, en laat beide ongewijzigd', () => {
    const before = withTwoWaves();
    const ws = addSummedWave(before, 'W1', 'W2');
    const w3 = ws.waves[2];
    expect(describeWave(w3)).toBe('W3 = W1 + W2');
    expect(w3.samples[123]).toBeCloseTo(before.waves[0].samples[123] * 2, 5);
    expect(ws.waves[0]).toBe(before.waves[0]);
    expect(ws.waves[1]).toBe(before.waves[1]);
  });

  it('twee sinussen van 1 uitslag optellen gaat buiten het bereik', () => {
    const ws = addSummedWave(withTwoWaves(), 'W1', 'W2');
    expect(isOutOfRange(ws.waves[2].samples)).toBe(true);
  });

  it('doet niets met een golf die niet bestaat of een ongeldig getal', () => {
    const ws = initialWorkspace();
    expect(addScaledWave(ws, 'W9', 2)).toBe(ws);
    expect(addScaledWave(ws, 'W1', Number.NaN)).toBe(ws);
    expect(addSummedWave(ws, 'W1', 'W9')).toBe(ws);
  });

  it('houdt de berekende golf na het verwijderen van W1, en hergebruikt geen naam', () => {
    let ws = addScaledWave(withTwoWaves(), 'W1', 0.5);
    ws = removeWave(ws, 'W1');
    expect(ws.waves.map((w) => w.name)).toEqual(['W2', 'W3']);
    expect(describeWave(ws.waves[1])).toBe('W3 = 0,5 × W1');
    expect(nextWaveName(ws)).toBe('W4');
    ws = addGeneratedWave(ws, 440, 'sine');
    expect(ws.waves.map((w) => w.name)).toEqual(['W2', 'W3', 'W4']);
  });
});
