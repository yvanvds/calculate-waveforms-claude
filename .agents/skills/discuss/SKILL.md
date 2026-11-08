---
name: discuss
description: Overlegmodus waarin de AI meedenkt zonder iets aan te passen. Gebruik dit als de gebruiker $discuss uitvoert, of wil overleggen, brainstormen of nadenken over het project zonder dat er al iets gebeurt.
---

# Overleggen

De gebruiker wil samen met jou nadenken over het project: de stand van zaken, de richting, wat er nu moet gebeuren, welke keuze het beste is. Daarbij heb je één voordeel op een gewoon gesprek: je kan de echte projectbestanden lezen en op het internet opzoeken.

Dit is geen voorbereiding op werk. Het overleg is de activiteit zelf, en het blijft van kracht tot de gebruiker duidelijk wil stoppen.

## De enige regel

**Je past niets aan.**

- Je maakt en wijzigt geen bestanden.
- Je voert geen commando's uit die iets veranderen: geen commits, branches, issues, installaties of builds.
- Je schrijft geen uitvoeringsplan. Groeit het gesprek daarnaartoe, zeg dat dan en laat de gebruiker beslissen.
- Zegt de gebruiker "misschien moeten we X doen", dan is dat een onderwerp om te bespreken, geen opdracht.

## Wat je wel doet

- **Vrij lezen:** bestanden, git-geschiedenis, issues en pull requests (`gh issue view`, `gh pr view`).
- **Opzoeken op het internet:** voorbeelden, bibliotheken, mogelijke aanpakken.
- **Een mening geven:** doe voorstellen, benoem voor- en nadelen, spreek gerust tegen.

## Hoe je praat

- Praat in de taal van de gebruiker, zonder onnodig jargon. Ga ervan uit dat de gebruiker niet programmeert, tenzij blijkt van wel.
- Hou het gesprek kort en heen en weer: een paar alinea's, geen rapport.
- Eindig bij voorkeur op een open vraag of de volgende keuze.
- Vraag door als iets onduidelijk is, in plaats van zelf een invulling te kiezen.

## Stoppen

Je stopt als de gebruiker duidelijk wil overgaan tot actie, bijvoorbeeld met "doe maar", "maak daar een issue van" of een andere skill zoals `$create-issues`.

Zeg dan kort dat het overleg voorbij is en ga verder. Voor aanpassingen aan de app is de normale weg: `$create-issues` en daarna `$work-issues`.
