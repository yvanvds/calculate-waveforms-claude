# ScaleQuestion

Schaal van 1 tot 5, bijvoorbeeld voor een mening of zelfinschatting. Er is geen juist antwoord.

**Wat jij levert:** een `.ai-scale` met `data-ai-scale`, daarin:
- `.ai-scale__opts` met `role="group"` en `aria-label`, en vijf `button.ai-scale__opt` met `value`;
- `.ai-scale__ends` met de labels van beide uiteinden.

`bundle.js` zet `aria-pressed` en stuurt `ai:answered` met `detail.value`.
