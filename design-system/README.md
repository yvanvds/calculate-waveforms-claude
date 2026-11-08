# Design system: Arcadia AI-modules

Dit is de vormgeving van je project: kleuren, letters, ruimte, componenten en beelden. Ze vertrekt van de Arcadia-huisstijl (logo, groen) en de AI-barometer, en voegt één eigen laag toe: een AI-kleur in teal en een netwerkmotief van knopen en lijnen.

Je hoeft dit niet zelf uit te pluizen. Je AI leest deze map wanneer het een app voor je bouwt. Deze map gaat alleen over hoe iets eruitziet, niet over wat je erin schrijft.

Deze map is een selectie uit het design system [Arcadia AI-modules](https://claude.ai/artifact/5FkFKzAp7bfBCU1wXJ8kFv). Dat artifact blijft de bron.

## Wat zit hierin

| Pad | Inhoud |
|---|---|
| `tokens.css` | Alle waarden als CSS-variabelen (`--brand`, `--space-4` …), voor licht en donker. |
| `tokens.json` | Dezelfde waarden als data, met per token waarvoor het dient. |
| `components/bundle.css` | De stijl van alle componenten, met klassen die beginnen met `ai-`. |
| `components/bundle.js` | Het gedrag van de interactieve componenten, zonder framework. |
| `components/<Naam>/` | Per component een korte `README.md` en een `preview.html`. |
| `assets/Logos/` | Het Arcadia-logo voor lichte en donkere achtergrond. |
| `assets/AI-barometer/` | De beelden van de AI-barometer. |

**Een voorbeeld bekijken:** open een `preview.html` in je browser. Voeg `?theme=dark` toe aan het adres voor het donkere thema. De lettertypes komen van Google Fonts; zonder internet zie je een vervangletter.

**Componenten:**

- Acties en structuur: [Button](components/Button/README.md), [SiteHeader](components/SiteHeader/README.md), [Hero](components/Hero/README.md), [SectionHeader](components/SectionHeader/README.md), [SiteFooter](components/SiteFooter/README.md)
- Inhoud: [ModuleCard](components/ModuleCard/README.md), [Callout](components/Callout/README.md)
- AI: [LevelBadge](components/LevelBadge/README.md), [Barometer](components/Barometer/README.md), [PromptBlock](components/PromptBlock/README.md), [ChatExchange](components/ChatExchange/README.md)
- Vragen: [ChoiceQuestion](components/ChoiceQuestion/README.md), [OpenQuestion](components/OpenQuestion/README.md), [ScaleQuestion](components/ScaleQuestion/README.md), [Feedback](components/Feedback/README.md)
- Stappen: [ModuleShell](components/ModuleShell/README.md), [StepCard](components/StepCard/README.md), [StepProgress](components/StepProgress/README.md), [ModuleComplete](components/ModuleComplete/README.md)

## Kleurgebruik

Gebruik altijd de tokens uit `tokens.css`, nooit losse kleurcodes. Er zijn twee thema's: `light` (standaard) en `dark`, via `data-theme` op `<html>`.

- **Groen = jij en de school.** Jouw eigen berichten, voortgang en alles van Arcadia gebruiken `brand`, `brand-text` en `forest`.
- **Teal = AI.** Alles wat van of over AI komt (chatbubbels, prompts, AI-feedback, AI-knoppen) gebruikt `ai`, `ai-soft` en `ai-text`.
- **Barometerkleuren = alleen het AI-niveau.** `level-0` tot `level-3` zijn de exacte kleuren van de affiche. Ze verschijnen nergens anders, dus geen oranje knop en geen rode foutmelding in `level-0`.
- **Vlakken:** pagina `bg`, kaarten `surface`, verzonken vlakken `surface-sunken`.
- **Tekst:** lopende tekst `ink`, koppen `forest`, hulptekst `ink-muted`.
- **Primaire knop:** `primary` met `on-primary`. In het donkere thema wordt de knop lichtgroen met donkere tekst.
- **AI-vlak:** `ai-soft` als achtergrond met `ai-text` erop. `ai` is voor tekst, iconen en volle vullingen.
- **Feedback:** `success` op `success-soft`, `danger` op `danger-soft`, `warning` op `warning-soft`.

## Contrast

- `ink`, `forest` en `ink-muted` halen minstens 4.5:1 op de vlakken waarvoor ze bedoeld zijn, in beide thema's.
- `brand` (Arcadia-groen `#76B82A`) is **nooit tekst op een lichte achtergrond** (2.4:1). Gebruik het voor vlakken, voortgang en knopen, met `on-brand` erop. Groene tekst is `brand-text`.
- Getallen op een niveaukleur staan in `on-level-0` tot `on-level-3`: bijna-zwart groen, minstens 4.5:1. Dat wijkt bewust af van het witte getal op de affiche, dat dit contrast niet haalt.
- Randen van invoervelden, antwoordopties en secundaire knoppen zijn `line-strong` (3:1). `line` is alleen voor scheidingslijnen.
- Juist, fout en het AI-niveau tonen je nooit met kleur alleen: altijd met een icoon (✓ / ✕) of getal én een woord.
- Focus: 2px solid `focus`, 2px afstand, op elk interactief element. Zet `class="ai-root"` op `<body>` zodat ook links de focusring krijgen.
- Respecteer `prefers-reduced-motion`. Overgangen duren hoogstens 150ms.

## Typografie

- **Figtree** voor alles: koppen in 800, tekst in 400 of 500, labels in 700.
- **JetBrains Mono** alleen voor prompts en AI-uitvoer (stijl `prompt`).
- Stijlen: `display` (hero, 56px, mobiel 40px), `h1` (40px), `h2` (28px), `h3` (21px), `lead` (19px), `body` (17px), `small` (15px), `label` (13px, hoofdletters, 0.08em).
- Lopende tekst: hoogstens ongeveer 65 tekens per regel. Koppen krijgen `text-wrap: balance`.
- De lettertypes zijn een keuze van dit systeem. Het huisfont van Arcadia is niet bevestigd; vervang ze als de communicatiedienst er een aanlevert.

## Ruimte en vorm

- **Ruimte:** `space-1` (4px) tot `space-8` (72px). Binnenmarge van kaarten `space-5`, tussen blokken `space-6`, tussen secties `space-7`.
- **Hoeken:** `radius-sm` (6px) voor tags en kleine knoppen, `radius-md` (12px) voor knoppen, velden, opties en callouts, `radius-lg` (20px) voor kaarten en bubbels, `radius-full` voor knopen, niveauschijfjes en pills.
- **Diepte:** randen gaan voor op schaduwen. `shadow-card` is er alleen voor de actieve stapkaart en zwevende elementen.
- **Breedte:** `content-max` (1120px). Een pagina is zo hoog als haar inhoud en mag gewoon scrollen.

## Iconen

- Lijniconen met een viewBox van 24×24, stroke 2, ronde uiteinden, `class="ai-icon"`, kleur via `currentColor`.
- De iconen in de previews (pijl, vinkje, kruis, kopieer, lamp, waarschuwing, knopen, klok) zijn eenvoudige tekeningen in die stijl. Neem ze gerust over.
- Heb je er meer nodig? Neem Material Symbols Rounded, in lijnstijl en dezelfde maat.
- De niveau-iconen en de volledige barometer staan in `assets/AI-barometer/`. Gebruik ze voor uitleg, niet als knop.

## Netwerkmotief

Het motief komt van het AI-icoon in het midden van de barometer: een kern met knopen en verbindingslijnen.

- In de **hero** als beeld (`.ai-net`): knopen in `brand` (jij en de school) en `ai` (AI) rond een `forest`-kern met *AI*.
- In de **voortgang** (`StepProgress`): elke stap is een knoop op een lijn.
- In het **headerlabel** (`.ai-header__tag`): één teal knoop.

Gebruik het nergens anders als behang of patroon.

## Logo

- `assets/Logos/arcadia-logo.svg` is het origineel, voor een lichte achtergrond.
- `assets/Logos/arcadia-logo-dark.svg` is hetzelfde logo met de donkergrijze letters vervangen door `#EAF2E3`, voor een donkere achtergrond. **Dit is een afgeleide versie die nog bevestigd moet worden door de communicatiedienst.**
- Zet beide in je HTML, met `.ai-logo--light` en `.ai-logo--dark`. De CSS toont per thema de juiste.
- Hoogte 24–30px in balken, met rondom minstens de hoogte van de A als vrije ruimte.
- Nooit hertekenen of herkleuren buiten deze twee versies.
- Dit logo heeft geen *SCHOLEN*-onderschrift. De affiche wel: vraag die versie op als je ze nodig hebt.

## Gebruiken in Astro

De componenten zijn gewone HTML met CSS-klassen, dus er is geen React of andere bibliotheek nodig. Laad de drie bestanden één keer in je layout, bijvoorbeeld `src/layouts/Layout.astro`:

```astro
---
import '../../design-system/tokens.css';
import '../../design-system/components/bundle.css';
const { title } = Astro.props;
---
<html lang="nl" data-theme="light">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
  </head>
  <body class="ai-root">
    <slot />
    <script src="../../design-system/components/bundle.js"></script>
  </body>
</html>
```

Neem daarna de HTML over uit een `preview.html` en maak er een `.astro`-component van. Beelden importeer je, zodat Astro ze meeneemt:

```astro
---
import logoLicht from '../../design-system/assets/Logos/arcadia-logo.svg';
import logoDonker from '../../design-system/assets/Logos/arcadia-logo-dark.svg';
---
<img class="ai-logo--light" src={logoLicht.src} alt="Arcadia scholen" />
<img class="ai-logo--dark" src={logoDonker.src} alt="Arcadia scholen" />
```

### Gedrag via `bundle.js`

`bundle.js` start vanzelf en koppelt alles via data-attributen. Voeg je later nog inhoud toe, roep dan `window.ArcadiaAI.init(element)` op.

| Attribuut | Wat het doet |
|---|---|
| `data-ai-stepper` | Stappen tonen en verbergen, *Vorige* en *Volgende*, voortgang. |
| `data-ai-choice` (met `data-mode="instant"`, `data-multi`) | Meerkeuzevraag met feedback. |
| `data-ai-scale`, `.ai-baro` | Eén keuze uit een groep. |
| `data-ai-open` (met `data-min`) | Woordenteller. |
| `data-ai-copy` | Tekst uit een promptblok kopiëren. |

Antwoorden sturen het event `ai:answered` (bubbelt) met `detail.correct` of `detail.value`. Daarmee kan je scores of voortgang bijhouden.

## Gebruiken in Slidev

Ook hier werk je met dezelfde HTML en klassen. Laad de bestanden in `setup/main.ts`:

```ts
import { defineAppSetup } from '@slidev/types'
import '../design-system/tokens.css'
import '../design-system/components/bundle.css'
import '../design-system/components/bundle.js'

export default defineAppSetup(() => {})
```

Zet de kleuren en letters van de dia's zelf in `style.css`, naast `slides.md`:

```css
.slidev-layout { background: var(--bg); color: var(--ink); font-family: var(--font-sans); }
.slidev-layout h1, .slidev-layout h2 { color: var(--forest); font-weight: 800; }
```

Zet `colorSchema: light` in de kop van `slides.md`: het donkere thema van Slidev volgt `data-theme` niet vanzelf.

Slidev bouwt een dia pas op wanneer je ze opent. Staat er een interactief component op een dia, zet dan dit op die dia:

```html
<script setup>
import { onSlideEnter } from '@slidev/client'
onSlideEnter(() => window.ArcadiaAI.init())
</script>
```

## Gebruiken in Flutter

De componenten zijn HTML en werken dus niet in Flutter. Gebruik de previews enkel als visueel voorbeeld en bouw ze na met Flutter-widgets. De waarden neem je over uit `tokens.json`:

| In `tokens.json` | In Flutter |
|---|---|
| `color.tokens` (met `value.light` en `value.dark`) | `Color`, in een `ThemeData` voor licht en een voor donker. Zo wordt `#76B82A` `Color(0xFF76B82A)`. |
| `type` | `TextStyle`, met de lettertypes Figtree en JetBrains Mono uit het pakket `google_fonts`. |
| `spacing.tokens`, `radius.tokens` | Getallen voor `EdgeInsets` en `BorderRadius`, zonder `px`. |

De logo's en barometerbeelden uit `assets/` zet je in `pubspec.yaml`. Voor de SVG-logo's heb je het pakket `flutter_svg` nodig. De regels over kleur, contrast en iconen hierboven gelden ook in Flutter.

## Een ander design

Dit design is een vertrekpunt, geen verplichting. Wil je een andere stijl, vraag je AI dan eenvoudig om een nieuw design te ontwerpen dat deze map vervangt: beschrijf de sfeer die je zoekt, en laat het de tokens, de componenten en deze README in dezelfde structuur herschrijven. Je app volgt dan mee, zolang die zijn waarden uit deze map haalt.
