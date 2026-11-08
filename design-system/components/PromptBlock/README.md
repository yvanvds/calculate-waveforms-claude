# PromptBlock

Toont een prompt of AI-uitvoer in monospace, met een kopieerknop. Het teal vlak betekent: dit is taal voor of van de AI.

**Wat jij levert:** een `.ai-prompt` met:
- `.ai-prompt__bar` met `.ai-prompt__label` en een `button.ai-prompt__copy` met `data-ai-copy` en daarin een `<span data-label>`;
- de tekst in `pre.ai-prompt__body`, optioneel met `<mark>` rond woorden die moeten opvallen.

`bundle.js` kopieert de tekst, zet `data-copied` op de knop en toont even *Gekopieerd*.
