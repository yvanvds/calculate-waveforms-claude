import { describe, expect, it } from 'vitest';
import { createWave, SAMPLE_COUNT } from '../audio/index.ts';
import {
  addComputedWave,
  addGeneratedWave,
  initialWorkspace,
  removeWave,
  updateGeneratedWave,
} from './workspace.ts';

describe('werkruimte', () => {
  it('begint met W1, een sinus van 440 Hz', () => {
    const ws = initialWorkspace();
    expect(ws.waves).toHaveLength(1);
    const [w1] = ws.waves;
    expect(w1.name).toBe('W1');
    expect(w1.source).toEqual({ kind: 'generated', frequency: 440, shape: 'sine' });
    expect(w1.samples).toHaveLength(SAMPLE_COUNT);
    expect(w1.samples).toEqual(createWave(440, 'sine'));
  });

  it('past vorm en frequentie aan zonder de naam te veranderen', () => {
    const before = initialWorkspace();
    const after = updateGeneratedWave(before, 'W1', 2, 'square');
    expect(after.waves[0].name).toBe('W1');
    expect(after.waves[0].source).toEqual({ kind: 'generated', frequency: 2, shape: 'square' });
    expect(after.waves[0].samples).toEqual(createWave(2, 'square'));
    // De oude werkruimte blijft ongewijzigd.
    expect(before.waves[0].samples).toEqual(createWave(440, 'sine'));
  });

  it('negeert een ongeldige frequentie', () => {
    const before = initialWorkspace();
    expect(updateGeneratedWave(before, 'W1', 0, 'sine')).toBe(before);
    expect(updateGeneratedWave(before, 'W1', Number.NaN, 'sine')).toBe(before);
  });

  it('verwijdert een golf en hergebruikt haar naam niet', () => {
    let ws = removeWave(initialWorkspace(), 'W1');
    expect(ws.waves).toHaveLength(0);
    ws = addGeneratedWave(ws, 220, 'triangle');
    expect(ws.waves[0].name).toBe('W2');
  });

  it('voegt een berekende golf toe met een beschrijving', () => {
    const ws = addComputedWave(initialWorkspace(), createWave(1, 'sine'), 'W1 × 2');
    expect(ws.waves[1].name).toBe('W2');
    expect(ws.waves[1].source).toEqual({ kind: 'computed', description: 'W1 × 2' });
  });

  it('een berekende golf kan je niet via vorm en frequentie aanpassen', () => {
    const ws = addComputedWave(initialWorkspace(), createWave(1, 'sine'), 'W1 × 2');
    const after = updateGeneratedWave(ws, 'W2', 300, 'square');
    expect(after.waves[1]).toBe(ws.waves[1]);
  });
});
