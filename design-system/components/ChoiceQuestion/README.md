# ChoiceQuestion

Meerkeuzevraag met feedback. De opties zijn grote knoppen met een letter.

**Wat jij levert:** een `.ai-choice` met `data-ai-choice`, daarin:
- `.ai-choice__opts` met `role="group"` en `aria-label`;
- per optie een `button.ai-option` met `.ai-option__key` (de letter) en de tekst, en `data-correct="true"` op de juiste;
- een [Feedback](../Feedback/README.md) `.ai-feedback--correct` en `.ai-feedback--wrong`, allebei `hidden`;
- bij `data-mode="check"` een knop met `data-ai-check` in `.ai-choice__actions`.

Instellingen op `.ai-choice`:
- `data-mode="check"`: kiezen en dan controleren. `data-mode="instant"`: feedback meteen bij het klikken.
- `data-multi`: meerdere juiste antwoorden.

`bundle.js` zet `aria-pressed` op de opties, `data-checked` op de vraag en `data-result="correct|wrong"` op de opties. Daarna bubbelt het event `ai:answered` met `detail.correct`.

Na controle krijgt de juiste optie `success` en een gekozen foute optie `danger`. Kleur alleen is niet genoeg: de feedback zegt het ook in woorden.
