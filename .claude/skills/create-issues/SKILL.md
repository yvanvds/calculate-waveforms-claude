---
name: create-issues
description: Maakt van een paar zinnen een of meer goed omschreven GitHub-issues. Gebruik dit als de gebruiker /create-issues uitvoert, of vraagt om iets als issue of taak te noteren, zoals een fout, een verbetering of de eerste versie van de app.
argument-hint: "[wat je wil verbeteren, of wat er fout gaat]"
---

# Issues maken

Opdracht van de gebruiker: $ARGUMENTS

De gebruiker heeft geen programmeerervaring en schrijft hooguit een paar zinnen. Het is jouw taak om daar goede issues van te maken. Een issue houdt de AI die er later aan werkt op koers: daarin staat wat het resultaat moet zijn, en wanneer het klaar is.

Praat in de taal van de gebruiker en schrijf ook de issues in die taal. **Je wijzigt geen code.** Is de opdracht leeg, vraag dan wat de gebruiker wil verbeteren of wat er fout gaat.

Volg `.claude/rules/commandos.md`: één eenvoudig commando per keer.

## Stap 1: zoek uit wat er echt aan de hand is

- Lees `PROJECT_OVERVIEW.md` en `CLAUDE.md` als die bestaan.
- Bekijk de open issues, zodat je niets dubbel maakt: `gh issue list --state open --json number,title,body`.
- Lees de code die ermee te maken heeft. Zoek bij een fout waar de oorzaak kan zitten.

Vraag alleen door als je zonder antwoord echt geen goed issue kan schrijven, en stel dan één korte vraag zonder jargon. Kan je een redelijke keuze maken, doe dat dan en vermeld ze in het issue.

## Stap 2: verdeel het werk

- Eén issue is groot genoeg voor één afgerond stuk werk, en klein genoeg voor één agent in één keer.
- Zet de issues in de volgorde waarin ze gemaakt moeten worden, en vermeld afhankelijkheden: `Hangt af van #N`.
- Eén kleine vraag blijft één issue. Splits niet om te splitsen.

### Bij de eerste versie van een nieuw project

Volg wat er in `PROJECT_OVERVIEW.md` staat, en niet meer dan dat. Wat daar bij "nog niet" staat, maak je niet.

1. **Het eerste issue zet de basis:** het project aanmaken met de gekozen frameworks, de testhulpmiddelen installeren, één eerste test die slaagt, en automatische controles (CI) via `.github/workflows/`, die de tests uitvoeren bij elke pull request. Vermeld ook dat het design system uit `design-system/` gebruikt wordt, tenzij het overview iets anders zegt.
2. **Bij een website op GitHub Pages is publiceren het tweede issue.** Dat issue vraagt een workflow in `.github/workflows/` die de site bouwt en publiceert bij elke push naar de hoofdbranch, en geen eenmalige publicatie. Het vraagt ook om GitHub Pages aan te zetten met GitHub Actions als bron, en om de link in de README te zetten. Hou dit apart van de basis: lukt publiceren niet, bijvoorbeeld bij een private repo op een gratis account, dan is alleen dit issue geblokkeerd.
3. **De volgende issues bouwen de functies.** Zorg ervoor dat de eerste twee issues samen al iets opleveren dat de gebruiker kan openen en bekijken. Bij een website is dat een eenvoudige pagina die online staat. Bij een lokale app is het tweede issue de eerste functie.

Mik op 3 tot 8 issues. Moet een lokale app later gepubliceerd worden, maak dat dan een apart issue, helemaal op het einde.

## Stap 3: schrijf de issues

Bestaat `.github/ISSUE_TEMPLATE/` nog niet, voer dan eerst de skill `/bootstrap-github` uit. Lees daarna het sjabloon voor het type issue en gebruik de labels uit de sjablonen als kopjes in de tekst.

| Type | Label | Wat moet er zeker in staan? |
|---|---|---|
| Nieuwe functie | `feature` | Waarom het nodig is, het gewenste resultaat, en wanneer het klaar is. |
| Verbetering | `enhancement` | Hoe het nu werkt, hoe het moet worden, en wanneer het klaar is. |
| Fout | `bug` | Wanneer de fout optreedt, wat er had moeten gebeuren, en de mogelijke oorzaak. |
| Onderhoud | `chore` | Wat er moet gebeuren en waarom. |
| Documentatie | `docs` | Wat er uitgelegd moet worden, en voor wie. |

Schrijf bij "wanneer het klaar is" concrete punten die je kan controleren, ook voor een test: *Als je op Bewaren klikt en de pagina vernieuwt, staat je tekst er nog.*

Schrijf geen echte leerlinggegevens in een issue. Issues in een publieke repo zijn voor iedereen zichtbaar.

Maak de issues een voor een, in de juiste volgorde, zodat de nummers kloppen. Schrijf de tekst eerst naar `.tmp/issue.md` met de schrijftool, voer daarna dit commando uit, en lees het nummer in het resultaat. Dat nummer gebruik je letterlijk in de tekst van het volgende issue:

```
gh issue create --title "<korte titel>" --label "<label>" --body-file .tmp/issue.md
```

Schrijf nooit een script dat meerdere issues tegelijk maakt.

## Stap 4: afronden

Toon een korte lijst met nummer en titel, en vermeld de keuzes die je zelf hebt gemaakt. Noem daarna de volgende stap met de echte nummers. Is dit de eerste versie van een nieuw project, begin dan met alleen de eerste twee issues, zodat de gebruiker snel een resultaat ziet:

```
/work-issues 1 2
```

Zeg erbij dat de gebruiker daarna het resultaat kan bekijken en een nieuwe reeks kan starten met de volgende issues, bijvoorbeeld `/work-issues 3 4 5`.
