# Feedback

Terugkoppeling na een antwoord: icoon, titel en uitleg.

**Wat jij levert:** een `.ai-feedback` met variant, daarin `.ai-feedback__icon` en `.ai-feedback__body` met `.ai-feedback__title` en de uitleg.

| Variant | Wanneer |
|---|---|
| `ai-feedback--correct` | Het antwoord klopt. Icoon ✓, `success` op `success-soft`. |
| `ai-feedback--wrong` | Het antwoord klopt niet. Icoon ✕, `danger` op `danger-soft`. |
| `ai-feedback--ai` | Feedback die door een AI-model is gemaakt. Teal, met *AI* in het icoon en een titel die dat zegt. |

- Juist en fout verschillen in icoon en woord, niet alleen in kleur, zodat het ook werkt bij kleurenblindheid.
- Zet `role="status"` op het kader, zodat schermlezers het voorlezen.
