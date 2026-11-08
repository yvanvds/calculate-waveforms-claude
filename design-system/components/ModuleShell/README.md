# ModuleShell

Schil om een reeks stappen: een compacte balk (56px) met logo, titel, AI-niveau en stopknop, daaronder de voortgang en daaronder de stappen. De schil is minstens zo hoog als het scherm en groeit mee met de inhoud; de pagina scrollt als dat nodig is.

**Wat jij levert:** een `.ai-shell` met `data-ai-stepper`, daarin:
- `.ai-shell__bar` met de logo's (`.ai-logo--light`, `.ai-logo--dark`), `.ai-shell__title`, een [LevelBadge](../LevelBadge/README.md) en een knop;
- `.ai-shell__progress` met een [StepProgress](../StepProgress/README.md);
- `.ai-shell__stage` met de stappen als `section.ai-step` (zie [StepCard](../StepCard/README.md)), alle behalve de eerste `hidden`.

`bundle.js` toont telkens één stap, regelt de knoppen `data-ai-next` en `data-ai-prev`, werkt de voortgang bij en zet de focus op de nieuwe vraag.

In Astro maak je hier een layout van, met elke stap als eigen component of Markdown-blok.
