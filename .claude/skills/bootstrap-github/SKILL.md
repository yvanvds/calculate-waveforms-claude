---
name: bootstrap-github
description: Zet de vaste GitHub-basis klaar voor een nieuw project, met sjablonen voor issues en pull requests en de nodige labels. Gebruik dit als de gebruiker /bootstrap-github uitvoert of vraagt om GitHub voor dit project klaar te zetten.
---

# GitHub klaarzetten

Eenmalige voorbereiding van de repo. Je mag dit veilig opnieuw uitvoeren: wat al bestaat, blijft ongemoeid.

De gebruiker heeft geen programmeerervaring. Praat in de taal van de gebruiker en leg in één zin uit wat je doet. Vraag geen bevestiging: alles hier is eenvoudig terug te draaien.

Volg `.claude/rules/commandos.md`: één eenvoudig commando per keer.

## Stap 1: controleren

Controleer het volgende. Lukt iets niet, leg dan in gewone taal uit wat er ontbreekt en help het oplossen.

- Dit is een git-repo: `git rev-parse --is-inside-work-tree`
- De gebruiker is aangemeld bij GitHub: `gh auth status`
- De repo staat op GitHub: `gh repo view --json nameWithOwner`

## Stap 2: sjablonen kopiëren

Lees de bestanden uit `.claude/skills/bootstrap-github/templates/` en schrijf ze ongewijzigd naar `.github/`, met dezelfde mapstructuur. Gebruik daarvoor de lees- en schrijftool:

- `ISSUE_TEMPLATE/bug.yml`, `feature.yml`, `enhancement.yml`, `chore.yml`, `docs.yml`, `config.yml`
- `pull_request_template.md`

Een bestand dat al bestaat, overschrijf je niet.

## Stap 3: labels maken

Bekijk de bestaande labels met `gh label list`. Maak alleen aan wat ontbreekt:

| Label | Kleur | Omschrijving |
|---|---|---|
| `feature` | `0e8a16` | Nieuwe functie |
| `chore` | `fbca04` | Onderhoud |
| `docs` | `5319e7` | Documentatie |
| `blocked` | `b60205` | Wacht op iets anders |

Eén commando per label:

```
gh label create <naam> --color "<kleur>" --description "<omschrijving>"
```

De labels `bug` en `enhancement` bestaan standaard al op GitHub. Bestaande labels pas je niet aan.

## Stap 4: opslaan

Commit en push rechtstreeks naar de hoofdbranch. Dit is de enige keer dat dat de bedoeling is: er is nog geen issue om aan te koppelen, en deze bestanden raken je app niet.

Voer deze drie commando's na elkaar uit:

```
git add .github
```
```
git commit -m "Sjablonen voor issues en pull requests toevoegen"
```
```
git push
```

Is er niets gewijzigd, sla deze stap dan over.

## Stap 5: afronden

Vertel in twee of drie zinnen wat er nu klaarstaat en waarom: elk issue krijgt zo een vaste structuur, zodat je AI precies weet wat het resultaat moet zijn. Noem daarna de volgende stap:

- Staan de bouwstenen uit `PROJECT_OVERVIEW.md` nog niet in `CLAUDE.md`, of bestaat dat bestand nog niet, stel dan deze vraag voor:
  ```text
  Lees PROJECT_OVERVIEW.md en werk CLAUDE.md bij met de gekozen bouwstenen en de manier om te bouwen en te testen. Maak het bestand aan als het nog niet bestaat. Schrijf nog geen applicatiecode.
  ```
- Daarna: `/create-issues`
