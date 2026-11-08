# Button

Knoppen in vier varianten en twee groottes. Het klikvlak is minstens 48px hoog (36px voor `--sm`).

**Wat jij levert:** een `<button>` of `<a>` met `ai-btn` en een variant, een label en optioneel een icoon (`<svg class="ai-icon">`).

| Klasse | Gebruik |
|---|---|
| `ai-btn--primary` | De hoofdactie. `primary` met `on-primary`. |
| `ai-btn--secondary` | Bijkomende acties. |
| `ai-btn--ghost` | Rustige acties en tekstlinks. |
| `ai-btn--ai` | Alleen voor acties die echt een AI-tool openen of aanroepen. Teal = AI. |
| `ai-btn--sm` | Kleine versie, te combineren met een variant. |

- Uitgeschakeld: het attribuut `disabled` (of `aria-disabled="true"`).
- Focus: 2px `focus`-ring, 2px afstand. Nooit wegstylen.
