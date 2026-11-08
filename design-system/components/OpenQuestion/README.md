# OpenQuestion

Open antwoord: een label, een tekstvak en een woordenteller.

**Wat jij levert:** een `.ai-field` met `data-ai-open`, daarin:
- `label.ai-field__label` met `for`, en `textarea.ai-input` met dezelfde `id`;
- `.ai-field__meta` met eventuele hulptekst en een `<span data-ai-count>`;
- optioneel `data-min` op `.ai-field`: het minimum aantal woorden.

`bundle.js` houdt de teller bij en zet `data-ok` zodra het minimum gehaald is.

Een placeholder kan helpen als startzin, maar vervangt nooit het label.
