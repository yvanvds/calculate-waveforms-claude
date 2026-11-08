/**
 * De gekozen golf, of een andere als die er niet (meer) is, bijvoorbeeld na verwijderen.
 * `fallback` is de plaats in de lijst die dan gekozen wordt.
 */
export function pickWave(names: readonly string[], chosen: string, fallback = 0): string {
  if (names.includes(chosen)) return chosen;
  return names[Math.min(fallback, names.length - 1)] ?? '';
}
