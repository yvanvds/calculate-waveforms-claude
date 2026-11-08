import { describe, expect, it } from 'vitest';
import { clampRange, FULL_RANGE, isFullRange, MIN_SPAN, panRange, zoomRange } from './zoom.ts';

describe('zoomen en verschuiven', () => {
  it('inzoomen maakt het zichtbare stuk kleiner rond het midden', () => {
    const range = zoomRange(FULL_RANGE, 0.5);
    expect(range.min).toBeCloseTo(0.5);
    expect(range.max).toBeCloseTo(1.5);
    expect(isFullRange(range)).toBe(false);
  });

  it('uitzoomen gaat nooit verder dan de hele 2 seconden', () => {
    const range = zoomRange(zoomRange(FULL_RANGE, 0.5), 10);
    expect(range).toEqual(FULL_RANGE);
    expect(isFullRange(range)).toBe(true);
  });

  it('inzoomen stopt bij een heel klein stuk', () => {
    let range = FULL_RANGE;
    for (let i = 0; i < 50; i++) range = zoomRange(range, 0.5);
    expect(range.max - range.min).toBeCloseTo(MIN_SPAN);
  });

  it('verschuiven houdt dezelfde breedte en blijft binnen 0 tot 2 seconden', () => {
    const zoomed = { min: 0.5, max: 1 };
    const right = panRange(zoomed, 0.5);
    expect(right.min).toBeCloseTo(0.75);
    expect(right.max).toBeCloseTo(1.25);

    const farLeft = panRange(zoomed, -10);
    expect(farLeft.min).toBe(0);
    expect(farLeft.max).toBeCloseTo(0.5);

    const farRight = panRange(zoomed, 10);
    expect(farRight.max).toBe(2);
    expect(farRight.min).toBeCloseTo(1.5);
  });

  it('een te breed stuk wordt het volledige beeld', () => {
    expect(clampRange({ min: -1, max: 5 })).toEqual(FULL_RANGE);
  });
});
