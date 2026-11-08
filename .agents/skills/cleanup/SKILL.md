---
name: cleanup
description: Ruimt op nadat een pull request is samengevoegd. Sluit de issues die nog open staan, verwijdert de branch op GitHub en op de laptop en keert terug naar de hoofdbranch. Wordt opgeroepen door $work-issues, of als de gebruiker $cleanup uitvoert.
---

# Opruimen na een merge

Alles wat op een branch stond, zit nu in de hoofdbranch. De branch is dus niet meer nodig.

Praat in de taal van de gebruiker. Word je opgeroepen door `$work-issues`, dan is er niemand om vragen aan te stellen: stel dan geen vragen, en stop en meld het probleem als iets niet klopt.

Volg `.agents/commandos.md`: één eenvoudig commando per keer.

## Stap 1: branch en pull request bepalen

1. Bepaal de hoofdbranch: `gh repo view --json defaultBranchRef --jq .defaultBranchRef.name`
2. Bepaal de branch:
   - Kreeg je een branchnaam mee, gebruik die dan.
   - Anders: `git branch --show-current`.
   - Sta je op de hoofdbranch en kreeg je geen naam mee, vraag dan welke branch je moet opruimen.
3. Zoek de pull request:
   ```
   gh pr list --head <branch> --state all --json number,state,closingIssuesReferences,url
   ```
4. **Controleer dat de pull request samengevoegd is** (`state` is `MERGED`). Zo niet, dan stop je en verwijder je niets. Leg uit wat de status is.

## Stap 2: issues sluiten

Doorloop de issues uit `closingIssuesReferences` en de `Closes #N`-regels in de pull request. Sluit wat nog open staat:

```
gh issue close <N> --comment "Afgewerkt in #<pull request>"
```

Issues die GitHub al automatisch sloot, sla je over.

## Stap 3: terug naar de hoofdbranch

```
git checkout <hoofdbranch>
```
```
git pull --prune
```

## Stap 4: de branch verwijderen

Op GitHub:

```
git push origin --delete <branch>
```

Meldt git dat de branch niet bestaat, dan is die al verwijderd. Dat is goed.

Op de laptop:

```
git branch -d <branch>
```

Weigert git omdat de branch "not fully merged" is, controleer dan met `git branch --merged origin/<hoofdbranch>` of die er wel bij staat. Staat ze er niet bij, dan verwijder je ze niet met geweld: stop en leg uit wat er aan de hand is. Staat ze er wel bij, dan mag `git branch -D <branch>`.

## Klaar

Vertel kort welke branch weg is, welke issues gesloten zijn en dat je terug op de hoofdbranch staat.
