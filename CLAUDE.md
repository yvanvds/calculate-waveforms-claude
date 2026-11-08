# Werken met Claude

Dit is een template waarmee collega's zonder programmeerervaring apps maken. Praat in de taal van de gebruiker, kort en zonder jargon. Leg technische keuzes eenvoudig uit en geef een aanbeveling. Stel één vraag tegelijk.

## Projectcontext

- Lees eerst `PROJECT_OVERVIEW.md`: doel, eerste versie, wat nog niet, en waarom de keuzes gemaakt zijn.
- Volg `.claude/rules/commandos.md` bij elk commando, ook als subagent.
- Applicatiewijzigingen verlopen via een GitHub-issue en `/work-issue` of `/work-issues`.
- De Codex-werkwijze in `AGENTS.md` en `.agents/` blijft apart: pas die alleen aan als de gebruiker dat vraagt.

## Bouwstenen

| Onderdeel | Keuze | Waarom |
|---|---|---|
| Framework | React met Vite, in TypeScript | Eén interactief scherm met veel knoppen en schuifjes. Vite bouwt een statische site. |
| Geluid | Web Audio API van de browser | Afspelen zonder extra dienst of bibliotheek. |
| Grafiek | Een bestaande grafiekbibliotheek met zoomen en verschuiven, zoals uPlot | Een golf van 2 seconden telt duizenden trillingen. Schrijf geen eigen zoomlogica. |
| Tests van de werking | Vitest, met React Testing Library voor componenten | Past bij Vite. |
| Tests met de echte app | Playwright | Start de gebouwde app en voert handelingen uit zoals een leerling. |
| Vormgeving | `design-system/` | Zie hieronder. |
| Publicatie | GitHub Pages via een workflow in `.github/workflows/` | Elke merge naar `main` gaat vanzelf online. |

Opslag: geen. De app bewaart niets, ook niet in het browsergeheugen. Zet geen leerlinggegevens in de repo.

## Afspraken over de code

- **De rekenkunde staat apart van de schermen.** Golven maken (sinus, blok, zaagtand, driehoek), vermenigvuldigen, optellen en de ADSR-envelope zijn gewone functies zonder React of Web Audio. Ze werken op een lijst samples en zijn zo makkelijk te testen.
- **Vaste samplefrequentie en duur.** Elke golf duurt 2 seconden. Kies één samplefrequentie (bijvoorbeeld 44100 Hz) voor alle golven, zodat optellen en vermenigvuldigen sample per sample kan.
- **Een bewerking verandert nooit een bestaande golf.** Ze geeft een nieuwe golf terug met een nieuwe, unieke naam (W1, W2 … en E1, E2 … voor envelopes). Een naam wordt niet hergebruikt nadat een golf verwijderd is.
- **Hard geluid vermijden.** Na optellen of vermenigvuldigen kan een golf boven 1 uitkomen. Toon de echte waarden in de grafiek, maar zorg dat het afspelen niet oorverdovend wordt, en laat zien wanneer een golf buiten het bereik -1 tot 1 gaat.
- **Vite `base`** moet de naam van de repo zijn (`/calculate-waveforms-claude/`), anders laadt de site op GitHub Pages niet.

## Vormgeving

Gebruik `design-system/README.md`. Voor React laad je `design-system/tokens.css` en `design-system/components/bundle.css` één keer in het startbestand (`src/main.tsx`), en zet je `data-theme` op `<html>` en `class="ai-root"` op `<body>`. Neem de HTML en de `ai-`-klassen over uit de `preview.html`-bestanden en maak er React-componenten van. Gebruik altijd de kleurtokens, ook in de grafiek. Teal (`ai`) is alleen voor iets dat met AI te maken heeft, dus niet voor de golven.

## Ontwikkelen, testen en bouwen

Werk deze sectie bij als een commando anders blijkt te werken.

| Wat | Commando |
|---|---|
| Afhankelijkheden installeren | `npm install` |
| App lokaal starten | `npm run dev` |
| Opmaak en controle | `npm run lint` |
| Tests van de werking | `npm test` |
| Tests met de echte app | `npm run test:e2e` |
| Bouwen voor publicatie | `npm run build` |

- `npm run dev` toont de app op `http://localhost:5173/calculate-waveforms-claude/`.
- `npm run test:e2e` bouwt de app eerst zelf en opent ze daarna. De eerste keer op een computer heeft Playwright een browser nodig: `npx playwright install chromium`.
- Tests van de werking staan naast de code als `*.test.ts(x)` in `src/`. Tests met de echte app staan in `e2e/`.
- De workflow `.github/workflows/ci.yml` voert dezelfde controles uit bij elke pull request en elke push naar `main`.

Voer voor een commit alles uit in deze volgorde: lint, tests, tests met de echte app, build. Ga pas verder als alles slaagt.

Wat altijd moet blijven werken, staat in de sectie "Testen" van `PROJECT_OVERVIEW.md`.

## Kwaliteit en veiligheid

- Rapporteer alleen controles die echt uitgevoerd zijn. Merge nooit met falende controles of onopgeloste conflicten.
- Commit alleen bestanden die bij het werk horen, nooit `node_modules`, `dist` of `.tmp`.
- Voer nooit force-pushes, `git reset --hard`, `git clean` of het verwijderen van de repository uit.
- Wijzig zelf geen beveiligingsinstellingen of regels om een blokkade te omzeilen. Meld de blokkade en de reden.
