import { describe, expect, it } from 'vitest';
import { createNameCounter } from './names.ts';

describe('namen', () => {
  it('deelt W1, W2, W3 na elkaar uit, en na het verwijderen van W2 volgt W4', () => {
    const names = createNameCounter();
    const waves = [names.nextWaveName(), names.nextWaveName(), names.nextWaveName()];
    expect(waves).toEqual(['W1', 'W2', 'W3']);

    const remaining = waves.filter((name) => name !== 'W2');
    remaining.push(names.nextWaveName());

    expect(remaining).toEqual(['W1', 'W3', 'W4']);
  });

  it('telt envelopes apart: E1, E2 …', () => {
    const names = createNameCounter();
    expect(names.nextEnvelopeName()).toBe('E1');
    expect(names.nextWaveName()).toBe('W1');
    expect(names.nextEnvelopeName()).toBe('E2');
  });

  it('twee tellers delen geen namen', () => {
    const a = createNameCounter();
    const b = createNameCounter();
    a.nextWaveName();
    expect(b.nextWaveName()).toBe('W1');
  });
});
