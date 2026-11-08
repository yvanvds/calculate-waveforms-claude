---
name: work-issues
description: Werkt een reeks GitHub-issues af, van nieuwe branch tot samenvoegen in de app. Per issue werkt een aparte agent. Gebruik dit als de gebruiker /work-issues uitvoert, met issuenummers of een algemene opdracht zoals "kies 10 issues waar je nu mee verder kan".
argument-hint: "[issuenummers of een opdracht]"
disable-model-invocation: true
---

# Een reeks issues afwerken

De gebruiker kijkt hier niet actief naar: de bedoeling is dat dit zonder tussenkomst loopt tot het klaar is, of tot er iets is dat de gebruiker moet beslissen. Praat in de taal van de gebruiker, kort en zonder jargon.

Opdracht van de gebruiker: $ARGUMENTS

**Volg strikt `.claude/rules/commandos.md`: één eenvoudig commando per keer.** Elk langer commando legt de hele reeks stil tot de gebruiker toestemming geeft, en die kijkt hier niet naar.

## Waarom een agent per issue

Zonder uitbesteding wordt alles één lang gesprek, en dan zit de gebruiker snel aan de limiet van het abonnement. Daarom:

- Jij houdt alleen de lijst met issues bij, en één regel resultaat per issue.
- Je leest zelf geen code of testuitvoer van de issues. Dat doen de agents.
- Elk issue gaat naar een nieuwe agent. De agents werken **na elkaar**, nooit tegelijk, want ze delen dezelfde map.

## Stap 1: controleren

1. `gh auth status` slaagt en `git remote -v` toont GitHub. Zo niet: help dit eerst oplossen.
2. Bepaal de hoofdbranch: `gh repo view --json defaultBranchRef --jq .defaultBranchRef.name`.
3. Bekijk `git status --porcelain`:
   - **Alles is opgeslagen:** ga verder.
   - **Alleen `CLAUDE.md` en/of `PROJECT_OVERVIEW.md` zijn nieuw of gewijzigd:** dat is normaal na `/setup` en het bijwerken van `CLAUDE.md`. Sta je op de hoofdbranch, voer dan na elkaar `git add` met die bestanden, `git commit -m "Projectdocumenten bijwerken"` en `git push` uit.
   - **Er staat iets anders open:** stop. Toon de bestanden en vraag wat er moet gebeuren.

## Stap 2: bepalen welke issues

- **Nummers gekregen:** gebruik die, in die volgorde.
- **Algemene opdracht:** bekijk `gh issue list --state open --json number,title,labels,body`. Kies wat je nu kan doen, rekening houdend met de opdracht en met wat de issues zeggen over afhankelijkheden. Neem er nooit meer dan 10 in één keer.
- **Geen issues gevonden:** stop en stel `/create-issues` voor.

Controleer dat elk issue open is. Zeg in één regel wat je gaat doen, bijvoorbeeld: `Ik werk aan #1, #2 en #3, en voeg ze daarna samen in één pull request.`

## Stap 3: een branch maken

```
git checkout <hoofdbranch>
```
```
git pull --ff-only
```
```
git checkout -b issues-<eerste>-<laatste>
```

Is er maar één issue: `issue-<N>`.

## Stap 4: per issue een agent

Start per issue een nieuwe agent van het type `general-purpose` met deze opdracht, en wacht op het resultaat voor je de volgende start:

> Werk GitHub-issue #N uit met de skill /work-issue. Volg strikt `.claude/rules/commandos.md`: één eenvoudig commando per keer. Je wordt opgeroepen door /work-issues: de branch `<branch>` staat al klaar, bevat eventueel werk van vorige issues en daar bouw je op verder. Controleer met `git branch --show-current` dat je erop staat voor je commit. Maak geen nieuwe branch, push niet en maak geen pull request. Eindig met het RESULTAAT-blok uit de skill.
> Eerder in deze reeks: <één regel per vorig issue, als dat voor dit issue nuttig is>

Bewaar van elk resultaat de status, de tests en de notities.

Bij `status: blocked` gaat het issue niet mee in deze pull request. Ga verder met het volgende issue, behalve als dat ervan afhangt: dan wordt dat ook `blocked`.

Nieuwe issues die een agent aanmaakt, voeg je niet toe aan deze reeks. Je vermeldt ze in je verslag.

## Stap 5: pull request

Controleer met `git log <hoofdbranch>..HEAD --oneline` dat er commits zijn.

Zijn er geen: verwijder de branch, ga terug naar de hoofdbranch en spring naar stap 9.

Anders: push met `git push -u origin <branch>`, schrijf de beschrijving naar `.tmp/pr.md` met de schrijftool, en maak één pull request:

```
gh pr create --base <hoofdbranch> --title "<korte titel>" --body-file .tmp/pr.md
```

De beschrijving bevat per issue een regel over wat er veranderd is, de echte testresultaten, wat er niet gelukt is en waarom, en een regel `Closes #N` voor elk issue met `status: committed`. Pull requests vormen de geschiedenis van de beslissingen: later kan een AI hier terugvinden waarom iets zo gemaakt is.

## Stap 6: de controles opvolgen

Wacht tot de automatische controles (CI) klaar zijn. Geef dit commando een timeout van 10 minuten:

```
gh pr checks <pr> --watch --interval 30
```

- **Alle controles geslaagd:** ga naar stap 8.
- **Geen controles gemeld:** wacht een minuut en kijk nog eens. Heeft de repo geen `.github/workflows/`, dan zijn er geen controles. Ga dan naar stap 8, en zeg in je verslag dat alleen de lokale tests gelden.
- **Na 10 minuten geen vooruitgang:** kijk één keer na of er iets vastzit met `gh pr view <pr> --json mergeable,mergeStateStatus,statusCheckRollup`. Is er nog altijd geen uitsluitsel, stop dan. Zeg wat je ziet en vraag de gebruiker om over een paar minuten te zeggen dat je de pull request opnieuw moet nakijken. Merge niet.
- **Een controle faalt:** ga naar stap 7.

## Stap 7: als een controle faalt

1. Bekijk kort wat er misging: `gh pr checks <pr>` en `gh run view <run-id> --log-failed`. Hou de uitvoer beperkt.
2. Start een nieuwe agent om het op deze branch op te lossen, te committen en te pushen. Geef mee welke controle faalde en het relevante stuk van de foutmelding.
3. Ga terug naar stap 6. Dit mag maximaal twee keer.

Lukt het dan nog niet, stop dan. **Merge nooit een pull request met falende controles**, en voer geen ingewikkelde git-ingrepen uit om het probleem weg te werken. Leg in gewone taal uit wat er niet lukt en wat de gebruiker kan vragen.

## Stap 8: samenvoegen en opruimen

```
gh pr merge <pr> --merge
```

Verwijder de branch hier niet: dat doet de skill die nu volgt.

Gebruik daarna de skill `/cleanup` met deze branch. Je staat nu terug op de hoofdbranch, met de branch verwijderd en de issues gesloten.

Lukt de merge niet, omdat GitHub bijvoorbeeld een conflict of een goedkeuring meldt, stop dan en leg uit wat er aan de hand is.

## Stap 9: verslag

Vertel kort in gewone taal:

- welke issues af zijn, en wat de gebruiker nu kan zien of doen
- wat er getest is, en wat de automatische controles zeiden
- welke issues niet gelukt zijn en waarom
- welke nieuwe issues er zijn aangemaakt
- wat een goede volgende stap is, bijvoorbeeld het resultaat bekijken of de volgende issues aanpakken

Doe het resultaat nooit mooier voor dan het is.
