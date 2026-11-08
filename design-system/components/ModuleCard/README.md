# ModuleCard

Kaart voor één item in een overzicht, in een raster (`.ai-grid`, auto-fill vanaf 260px). De hele kaart is één link.

**Wat jij levert:** een `a.ai-card` met:
- `.ai-card__top` met een [LevelBadge](../LevelBadge/README.md) en een `.ai-tag` (afgewerkt: `ai-tag--done`, met woord én ✓);
- `.ai-card__title` en `.ai-card__text`;
- `.ai-card__foot` met de voortgangsbalk `.ai-card__bar` (een `<span style="width:…%">`, met `aria-label`) en een teller.

Rand `line`, geen schaduw. Bij hover: rand `forest`, 2px omhoog. De voortgangsbalk is `brand`.
