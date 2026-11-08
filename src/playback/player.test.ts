import { describe, expect, it, vi } from 'vitest';
import { createWave, SAMPLE_COUNT, SAMPLE_RATE, scaleWave } from '../audio/index.ts';
import {
  playWave,
  PlaybackBlockedError,
  RESUME_TIMEOUT_MS,
  type AudioContextLike,
} from './player.ts';

function fakeContext() {
  const copied: Float32Array[] = [];
  const created: { channels: number; length: number; rate: number }[] = [];
  const sources: { onended: (() => void) | null; start: () => void; stop: () => void }[] = [];
  const context = {
    state: 'running',
    destination: {},
    resume: vi.fn(async () => {}),
    createBuffer: (channels: number, length: number, rate: number) => {
      created.push({ channels, length, rate });
      return { copyToChannel: (data: Float32Array) => copied.push(data) };
    },
    createBufferSource: () => {
      const source = {
        buffer: null,
        onended: null as (() => void) | null,
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(() => source.onended?.()),
      };
      sources.push(source);
      return source;
    },
  };
  return { context: context as unknown as AudioContextLike, copied, created, sources };
}

describe('afspelen', () => {
  it('speelt de hele golf van 2 seconden af', async () => {
    const { context, created, copied, sources } = fakeContext();
    const done = playWave(createWave(440, 'sine'), context);
    await vi.waitFor(() => expect(sources).toHaveLength(1));
    expect(created[0]).toEqual({ channels: 1, length: SAMPLE_COUNT, rate: SAMPLE_RATE });
    expect(copied[0]).toEqual(createWave(440, 'sine'));
    expect(sources[0].start).toHaveBeenCalled();
    sources[0].onended?.();
    await done;
  });

  it('een golf buiten -1 tot 1 klinkt niet harder dan een golf tot 1', async () => {
    const { context, copied, sources } = fakeContext();
    const loud = scaleWave(createWave(440, 'square'), 3);
    const done = playWave(loud, context);
    await vi.waitFor(() => expect(sources).toHaveLength(1));
    const played = copied[0];
    expect(Math.max(...played.slice(0, 1000).map(Math.abs))).toBeCloseTo(1);
    // De golf zelf blijft ongewijzigd.
    expect(loud[0]).toBeCloseTo(3);
    sources[0].onended?.();
    await done;
  });

  it('zet een gepauzeerde AudioContext eerst aan', async () => {
    const { context, sources } = fakeContext();
    const mutable = context as unknown as { state: string; resume: () => Promise<void> };
    mutable.state = 'suspended';
    mutable.resume = vi.fn(async () => {
      mutable.state = 'running';
    });
    const done = playWave(createWave(440, 'sine'), context);
    await vi.waitFor(() => expect(sources).toHaveLength(1));
    expect(mutable.resume).toHaveBeenCalled();
    sources[0].onended?.();
    await done;
  });

  it('mislukt met een duidelijke fout als de browser het geluid tegenhoudt', async () => {
    vi.useFakeTimers();
    try {
      const { context, sources } = fakeContext();
      const mutable = context as unknown as { state: string; resume: () => Promise<void> };
      mutable.state = 'suspended';
      // Zoals sommige browsers: de belofte blijft wachten en de context blijft op pauze.
      mutable.resume = vi.fn(() => new Promise<void>(() => {}));
      const done = playWave(createWave(440, 'sine'), context);
      const check = expect(done).rejects.toBeInstanceOf(PlaybackBlockedError);
      await vi.advanceTimersByTimeAsync(RESUME_TIMEOUT_MS);
      await check;
      expect(sources).toHaveLength(0);
    } finally {
      vi.useRealTimers();
    }
  });

  it('stopt het vorige geluid als je opnieuw afspeelt', async () => {
    const { context, sources } = fakeContext();
    const first = playWave(createWave(440, 'sine'), context);
    await vi.waitFor(() => expect(sources).toHaveLength(1));
    const second = playWave(createWave(220, 'sine'), context);
    await vi.waitFor(() => expect(sources).toHaveLength(2));
    expect(sources[0].stop).toHaveBeenCalled();
    await first;
    sources[1].onended?.();
    await second;
  });
});
