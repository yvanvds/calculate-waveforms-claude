// Speelt een golf af met de Web Audio API van de browser.
import { playbackGain, SAMPLE_RATE, type Samples } from '../audio/index.ts';

/** Het deel van een AudioContext dat we gebruiken. Zo kan een test een nep-versie meegeven. */
export type AudioContextLike = Pick<
  AudioContext,
  'createBuffer' | 'createBufferSource' | 'destination' | 'resume' | 'state'
>;

let sharedContext: AudioContextLike | null = null;
let currentSource: AudioBufferSourceNode | null = null;

function getContext(): AudioContextLike {
  sharedContext ??= new AudioContext();
  return sharedContext;
}

/**
 * Speelt de golf één keer af (2 seconden). Een golf die buiten -1 tot 1 gaat,
 * wordt stiller gemaakt zodat ze niet harder klinkt dan een golf tot precies 1.
 * Een geluid dat nog speelt, stopt eerst. Het resultaat is klaar als het geluid gedaan is.
 */
export async function playWave(
  samples: Samples,
  context: AudioContextLike = getContext(),
): Promise<void> {
  if (context.state === 'suspended') {
    await context.resume();
  }

  const gain = playbackGain(samples);
  const channel = gain === 1 ? samples : samples.map((value) => value * gain);
  const buffer = context.createBuffer(1, channel.length, SAMPLE_RATE);
  buffer.copyToChannel(new Float32Array(channel), 0);

  stopPlayback();
  const source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(context.destination);
  currentSource = source;

  return new Promise<void>((resolve) => {
    source.onended = () => {
      if (currentSource === source) currentSource = null;
      resolve();
    };
    source.start();
  });
}

/** Stopt het geluid dat nu speelt, als er een is. */
export function stopPlayback(): void {
  if (!currentSource) return;
  const source = currentSource;
  currentSource = null;
  source.stop();
}
