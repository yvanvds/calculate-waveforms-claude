# Barometer

De AI-barometer als bedieningselement: vier segmenten, van 0 tot 3. Interactief (je kiest een niveau) of alleen-lezen (het toont een niveau).

**Wat jij levert:** een `.ai-baro` met `role="group"` en `aria-label`, en vier `button.ai-baro__seg` met `data-level`, het getal in `<b>` en de niveaunaam.

- Interactief: `bundle.js` zet `aria-pressed` en stuurt `ai:answered` met `detail.value` = het niveau.
- Alleen-lezen: `data-readonly` op `.ai-baro` en `aria-current="true"` op het actieve segment.
- De volgorde is altijd 0 → 3, van links naar rechts. Op smalle schermen 2×2.
- De volledige barometer als beeld staat in `assets/AI-barometer/`. Gebruik het beeld voor uitleg en deze component voor interactie.
