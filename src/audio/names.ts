/** De naam van golf nummer `n`: W1, W2 … */
export function waveName(n: number): string {
  return `W${n}`;
}

/** De naam van envelope nummer `n`: E1, E2 … */
export function envelopeName(n: number): string {
  return `E${n}`;
}

/**
 * Deelt korte namen uit: W1, W2 … voor golven en E1, E2 … voor envelopes.
 * De teller gaat alleen vooruit, dus een naam wordt nooit opnieuw gebruikt,
 * ook niet nadat een golf of envelope verwijderd is.
 */
export interface NameCounter {
  nextWaveName(): string;
  nextEnvelopeName(): string;
}

export function createNameCounter(): NameCounter {
  let waves = 0;
  let envelopes = 0;
  return {
    nextWaveName: () => waveName(++waves),
    nextEnvelopeName: () => envelopeName(++envelopes),
  };
}
