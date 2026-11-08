---
name: work-issues
description: Werkt een reeks GitHub-issues af, van nieuwe branch tot samenvoegen in de app. Per issue werkt een aparte agent. Gebruik dit als de gebruiker $work-issues uitvoert, met issuenummers of een algemene opdracht zoals "kies 10 issues waar je nu mee verder kan".
---

# Een reeks issues afwerken

De gebruiker kijkt hier niet actief naar: de bedoeling is dat dit zonder tussenkomst loopt tot het klaar is, of tot er iets is dat de gebruiker moet beslissen. Praat in de taal van de gebruiker, kort en zonder jargon.

Opdracht: gebruik de tekst en eventuele issuenummers uit het bericht waarmee de gebruiker deze skill oproept. Er is geen speciale argumentvariabele.

**Volg strikt `.agents/commandos.md`: één eenvoudig commando per keer.** Eenvoudige commando's maken de beoordeling van toestemmingen voorspelbaarder. Extra rechten blijven afhankelijk van de actieve Codex-instellingen.

## Waarom een agent per issue

Elke subagent heeft een eigen context. Zo blijven codeonderzoek en testuitvoer buiten het gesprek van de coördinator; alleen een compact resultaat gaat terug. Dat beperkt de groei van de hoofdcontext tijdens lange reeksen. Daarom:

- Jij houdt alleen de lijst met issues bij, en één regel resultaat per issue.
- Je leest zelf geen code of testuitvoer van de issues. Dat doen de agents.
- Elk issue gaat naar een nieuwe agent. De agents werken **na elkaar**, nooit tegelijk, want ze delen dezelfde map.

## Stap 1: controleren

Controleer eerst of subagenttools beschikbaar zijn. Ontbreken die, stop dan en vraag om dit project in een Codex-client met subagents te openen. Lees bij toestemmingsproblemen `docs/CODEX.md`; verander nooit zelf de beveiligingsinstellingen om de reeks te laten doorgaan.

1. `gh auth status` slaagt en `git remote -v` toont GitHub. Zo niet: help dit eerst oplossen.
2. Bepaal de hoofdbranch: `gh repo view --json defaultBranchRef --jq .defaultBranchRef.name`.
3. Bekijk `git status --porcelain`:
   - **Alles is opgeslagen:** ga verder.
   - **Alleen `AGENTS.md` en/of `PROJECT_OVERVIEW.md` zijn nieuw of gewijzigd:** dat is normaal na `$setup` en het bijwerken van `AGENTS.md`. Sta je op de hoofdbranch, voer dan na elkaar `git add` met die bestanden, `git commit -m "Projectdocumenten bijwerken"` en `git push` uit.
   - **Er staat iets anders open:** stop. Toon de bestanden en vraag wat er moet gebeuren.

## Stap 2: bepalen welke issues

- **Nummers gekregen:** gebruik die, in die volgorde.
- **Algemene opdracht:** bekijk `gh issue list --state open --json number,title,labels,body`. Kies wat je nu kan doen, rekening houdend met de opdracht en met wat de issues zeggen over afhankelijkheden. Neem standaard maximaal 10 issues. Vraagt de gebruiker uitdrukkelijk om een grotere reeks, zoals 15 issues, respecteer dat aantal.
- **Geen issues gevonden:** stop en stel `$create-issues` voor.

Lees ook bij expliciete nummers de bodies en afhankelijkheden met `gh issue view <N> --json number,title,state,body,labels,comments`. Controleer dat elk issue open is. Is een afhankelijk issue niet afgerond en staat het niet eerder in de reeks, markeer het afhankelijke issue dan als blocked; negeer die afhankelijkheid niet. Zeg in één regel wat je gaat doen, bijvoorbeeld: `Ik werk aan #1, #2 en #3, en voeg ze daarna samen in één pull request.`

## Stap 3: een branch maken

```
git checkout <hoofdbranch>
```
```
git pull --ff-only
```
```
git checkout -b codex/issues-<eerste>-<laatste>
```

Is er maar één issue: `codex/issue-<N>`.

## Stap 4: per issue een agent

Start per issue een nieuwe Codex-subagent via de beschikbare subagenttool. Geef de conversatiegeschiedenis niet mee: gebruik bij `spawn_agent` met `fork_turns` de waarde `"none"`. Geef alleen onderstaande opdracht en de noodzakelijke resultaten van eerdere issues mee. Laat de agent de skill en projectinstructies zelf lezen. Wacht op het eindresultaat en sluit de agent af als de tool dat ondersteunt voordat je de volgende start. Alle agents werken na elkaar in dezelfde checkout en op dezelfde branch. Maak geen aparte chats of worktrees.

Zijn subagenttools niet beschikbaar, stop dan vóór je een branch maakt en leg uit dat deze skill Codex-subagents nodig heeft. Werk de reeks niet stilzwijgend zelf af.

Opdracht voor de subagent:

> Werk GitHub-issue #N uit met de skill $work-issue. Lees eerst AGENTS.md, .agents/commandos.md en .agents/skills/work-issue/SKILL.md. Je werkmap is <absoluut pad naar deze checkout>. Volg strikt `.agents/commandos.md`: één eenvoudig commando per keer. Je wordt opgeroepen door $work-issues: de branch `<branch>` staat al klaar, bevat eventueel werk van vorige issues en daar bouw je op verder. Controleer met `git branch --show-current` dat je erop staat voor je commit. Maak geen nieuwe branch, push niet en maak geen pull request. Eindig met het RESULTAAT-blok uit de skill.
> Eerder in deze reeks: <één regel per vorig issue, als dat voor dit issue nuttig is>

Bewaar van elk resultaat de status, commit, tests en notities. Controleer na afloop kort `git status --porcelain`, de huidige branch en de laatste commit. Stop de reeks als een agent onvolledig werk achterlaat, de branch veranderde of de gerapporteerde commit niet klopt. Laat een volgende agent nooit daarop voortbouwen.

Bij `status: blocked` gaat het issue niet mee in deze pull request. Ga verder met het volgende issue, behalve als dat ervan afhangt: dan wordt dat ook `blocked`.

Nieuwe issues die een agent aanmaakt, voeg je niet toe aan deze reeks. Je vermeldt ze in je verslag.

## Stap 5: pull request

Controleer met `git log <hoofdbranch>..HEAD --oneline` dat er commits zijn.

Zijn er geen: ga terug naar de hoofdbranch, verwijder daarna alleen deze lege branch met `git branch -d <branch>` en spring naar stap 9.

Anders: push met `git push -u origin <branch>`, schrijf de beschrijving naar `.tmp/pr.md` met de schrijftool, en maak één pull request:

```
gh pr create --base <hoofdbranch> --title "<korte titel>" --body-file .tmp/pr.md
```

De beschrijving bevat per issue een regel over wat er veranderd is, de echte testresultaten, wat er niet gelukt is en waarom, en een regel `Closes #N` voor elk issue met `status: committed`. Pull requests vormen de geschiedenis van de beslissingen: later kan een AI hier terugvinden waarom iets zo gemaakt is.

## Stap 6: de controles opvolgen

Wacht tot de automatische controles (CI) klaar zijn. Volg maximaal 10 minuten. Start dit als een lopend proces en haal tussentijds de uitvoer op, zodat je beschikbaar blijft voor berichten van de gebruiker:

```
gh pr checks <pr> --watch --interval 30
```

- **Alle controles geslaagd:** ga naar stap 8.
- **Geen controles gemeld:** wacht een minuut en kijk nog eens. Heeft de repo geen `.github/workflows/`, dan zijn er geen controles. Ga dan naar stap 8, en zeg in je verslag dat alleen de lokale tests gelden.
- **Na 10 minuten geen vooruitgang:** kijk één keer na of er iets vastzit met `gh pr view <pr> --json mergeable,mergeStateStatus,statusCheckRollup`. Is er nog altijd geen uitsluitsel, stop dan. Zeg wat je ziet en vraag de gebruiker om over een paar minuten te zeggen dat je de pull request opnieuw moet nakijken. Merge niet.
- **Een controle faalt:** ga naar stap 7.

## Stap 7: als een controle faalt

1. Bekijk kort wat er misging: `gh pr checks <pr>` en `gh run view <run-id> --log-failed`. Hou de uitvoer beperkt.
2. Start een nieuwe subagent zonder conversatiegeschiedenis om het op deze branch op te lossen en te committen. Geef de werkmap, branch, AGENTS.md en .agents/commandos.md mee. De agent maakt geen branch of PR en pusht niet. Laat hem een compact resultaat teruggeven, controleer de branch en schone werkmap en push daarna zelf. Geef mee welke controle faalde en het relevante stuk van de foutmelding.
3. Ga terug naar stap 6. Dit mag maximaal twee keer.

Lukt het dan nog niet, stop dan. **Merge nooit een pull request met falende controles**, en voer geen ingewikkelde git-ingrepen uit om het probleem weg te werken. Leg in gewone taal uit wat er niet lukt en wat de gebruiker kan vragen.

## Stap 8: samenvoegen en opruimen

```
gh pr merge <pr> --merge
```

Verwijder de branch hier niet: dat doet de skill die nu volgt.

Gebruik daarna de skill `$cleanup` met deze branch. Je staat nu terug op de hoofdbranch, met de branch verwijderd en de issues gesloten.

Lukt de merge niet, omdat GitHub bijvoorbeeld een conflict of een goedkeuring meldt, stop dan en leg uit wat er aan de hand is.

## Stap 9: verslag

Vertel kort in gewone taal:

- welke issues af zijn, en wat de gebruiker nu kan zien of doen
- wat er getest is, en wat de automatische controles zeiden
- welke issues niet gelukt zijn en waarom
- welke nieuwe issues er zijn aangemaakt
- wat een goede volgende stap is, bijvoorbeeld het resultaat bekijken of de volgende issues aanpakken

Doe het resultaat nooit mooier voor dan het is.
