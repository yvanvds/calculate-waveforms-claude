# StepProgress

Voortgang als netwerklijn: elke stap is een knoop, afgewerkte knopen en lijnen kleuren `brand`, de huidige knoop is groter met een ring.

**Wat jij levert:** een `.ai-progress` met:
- optioneel `.ai-progress__label` met de teller (`<span data-ai-stepcount>`) en bijvoorbeeld de duur;
- `ol.ai-progress__track` met per stap een `li.ai-progress__node` met `data-state="done|current|todo"`, daarin `.ai-progress__dot` en de naam voor schermlezers in `.ai-sr`.

Binnen een `data-ai-stepper` werkt `bundle.js` `data-state` en de teller bij.

De knopen delen de breedte. Bij heel veel stappen wordt dat op een smal scherm krap.
