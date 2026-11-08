# StepCard

Kaart voor één stap: een kop, de inhoud en navigatie onderaan.

**Wat jij levert:** een `.ai-step` met:
- `.ai-step__head` met `.ai-eyebrow`, de titel als `h2.ai-step__q` en optioneel `.ai-step__hint`;
- `.ai-step__body` met de inhoud, bijvoorbeeld een vraagcomponent;
- `.ai-step__nav` met knoppen, in een stepper met `data-ai-prev` en `data-ai-next`.

Twee opbouwen:
- **Gestapeld** (standaard): kop, body, navigatie.
- **Gesplitst** (`ai-step--split`): `.ai-step__cols` met links `.ai-step__context` (5/11, bijvoorbeeld een chat of prompt) en rechts `.ai-step__body` (6/11). Onder 860px staan de kolommen onder elkaar.

Op zichzelf is de kaart hoogstens 760px breed. In een [ModuleShell](../ModuleShell/README.md) vult ze de volle breedte. De kaart is zo hoog als haar inhoud.

Navigatie: `ai-btn--ghost` links, `ai-btn--primary` rechts.
