# LevelBadge

Toont het AI-niveau uit de **AI-barometer** van Arcadia.

**Wat jij levert:** een `.ai-level` met `data-level="0|1|2|3"`, het getal in `.ai-level__num`, de tekst *AI-niveau N* en optioneel de niveaunaam in `.ai-level__name`. Met `ai-level--lg` krijg je een grotere versie.

| Niveau | Naam | Token | Betekenis (affiche) |
|---|---|---|---|
| 0 | Geen AI | `level-0` | Je gebruikt geen AI. |
| 1 | Voorbereiding | `level-1` | AI helpt bij planning, ideeën, structuur. Eindproduct zonder AI. |
| 2 | Ondersteuning | `level-2` | AI ondersteunt bij afgesproken stappen. |
| 3 | Uitvoering | `level-3` | AI in meerdere afgesproken fases; output kritisch verwerken. |

- Zet het niveau ook in tekst (*AI-niveau 2*). Kleur alleen is nooit genoeg.
- De vier kleuren zijn exact die van de affiche en betekenen **alleen** het niveau. Gebruik ze nergens anders (dus geen oranje knop, geen rode foutmelding in `level-0`).
- Het getal staat in `on-level-N`: bijna-zwart groen (`#071209`), minstens 4.5:1 op alle vier de kleuren. Dat wijkt bewust af van het witte getal op de affiche (wit haalt 1.9–3.9:1).
