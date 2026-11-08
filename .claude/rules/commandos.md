# Commando's uitvoeren

Deze regel geldt altijd, ook voor agents.

De gebruiker programmeert niet, en is vaak met iets anders bezig terwijl jij werkt. Claude Code kan een lang of samengesteld commando niet controleren en stopt dan tot de gebruiker toestemming geeft. Daarom voer je commando's zo eenvoudig mogelijk uit, ook als dat meer stappen kost.

- **Eén commando per keer.** Geen `;`, `&&`, `||`, `set -e`, lussen of scripts. Moet er nog iets gebeuren, voer dat dan als een apart commando uit.
- **Geen variabelen of ingevoegde uitvoer.** Geen `$(...)`, `$naam` of `${...}`. Kijk naar het resultaat van het vorige commando en typ de waarde letterlijk in het volgende.
- **Geen pipes als het niet moet.** Gebruik liever opties van het commando zelf, zoals `--jq` bij `gh`, of de leestools in plaats van `cat`, `grep` en `head`.
- **Lange tekst staat in een bestand.** Schrijf de tekst van een issue of pull request eerst naar een bestand in `.tmp/`, en gebruik `--body-file`. Die map wordt niet gecommit. Gebruik één bestand per issue. Geen heredocs en geen tekst over meerdere regels in een commando.
- **Commitboodschappen zijn kort en eenvoudig:** één regel, met `git commit -m "<boodschap>"`, zonder aanhalingstekens of speciale tekens in de boodschap zelf.
- **Bestanden aanmaken of kopiëren** doe je met de schrijftool, niet met shell-commando's.
- **Een gepubliceerde pagina nakijken** doe je met `curl -sI <adres>`. Hou opties zoals `-w` weg: die maken het commando te ingewikkeld om te controleren.

Krijgt de gebruiker toch een toestemmingsvraag? Leg dan in één zin uit wat het commando doet en waarom het nodig is.
