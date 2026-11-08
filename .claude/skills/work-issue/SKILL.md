---
name: work-issue
description: Werkt één GitHub-issue uit, inclusief testen en commit. Wordt opgeroepen door /work-issues voor elk issue, of als de gebruiker /work-issue met een issuenummer uitvoert.
---

# Eén issue uitwerken

Elke wijziging hoort bij een issue. Het issue zegt wat er moet gebeuren en wanneer het klaar is.

De gebruiker heeft geen programmeerervaring. Praat in de taal van de gebruiker en leg dingen uit zonder jargon.

Volg `.claude/rules/commandos.md`: één eenvoudig commando per keer.

## Twee manieren waarop je wordt opgeroepen

- **Door `/work-issues`:** er staat al een branch klaar en er is niemand om vragen aan te stellen. Volg stap 1, 3, 4 en 5, en eindig met het verslag uit stap 7. Maak geen branch of pull request. Is iets onduidelijk of onmogelijk, gok dan niet: geef `status: blocked` terug.
- **Door de gebruiker:** volg alle stappen. Vragen stellen mag als het issue echt onduidelijk is.

## Stap 1: het issue lezen

```
gh issue view <N> --json number,title,state,body,labels,comments
```

Lees ook `PROJECT_OVERVIEW.md` en `CLAUDE.md` als die bestaan, en de issues waarnaar verwezen wordt. Gebruik voor de vormgeving `design-system/README.md`, tenzij het project ondertussen iets anders gebruikt.

## Stap 2: een branch maken

Alleen als de gebruiker je rechtstreeks oproept. Bepaal de hoofdbranch met `gh repo view --json defaultBranchRef --jq .defaultBranchRef.name`.

```
git checkout <hoofdbranch>
```
```
git pull --ff-only
```
```
git checkout -b issue-<N>-<korte-omschrijving>
```

## Stap 3: het werk doen

- **Blijf binnen het issue.** Zie je iets anders dat beter kan, los het dan niet hier op. Maak er een nieuw issue van met `gh issue create` en vermeld het in je verslag.
- **Gebruik de frameworks uit `PROJECT_OVERVIEW.md`.** Schrijf niet zelf iets dat een gekozen framework al kan.
- **Bewaar geen geheimen en geen echte leerlinggegevens in de repo.** Gebruik verzonnen voorbeeldgegevens.

## Stap 4: testen

Testen horen bij het werk, net zoals de code zelf. Ze zorgen ervoor dat alles blijft werken zoals bedoeld, ook als er later iets verandert.

Schrijf wat ontbreekt:

- **Tests voor de werking:** de logica en de afzonderlijke onderdelen. Bij een fout: een test die faalt zonder je oplossing en slaagt met je oplossing.
- **Een test met de echte app:** verandert er iets dat de gebruiker ziet of doet, voeg dan een test toe die de echte app start en die handeling uitvoert. Een test van een onderdeel apart volstaat niet: de fouten zitten vaak net in hoe de onderdelen samenwerken.

Sla de test met de echte app alleen over als de wijziging niet zichtbaar is voor de gebruiker, of als het echt niet kan. Vermeld dan de concrete reden in je verslag.

Zijn er nog geen testhulpmiddelen, kies dan wat bij het project past en voeg ze toe:

| Project | Werking | Echte app |
|---|---|---|
| Astro of andere website | Vitest | Playwright |
| Slidev | Vitest, als er logica is | `npm run build`, en Playwright als slides interactief zijn |
| Flutter | `flutter test` | `integration_test` |

Voer daarna alles uit, in deze volgorde, en ga pas verder als het slaagt:

1. Opmaak, als het project een formatter heeft.
2. Linter of statische controle, als het project die heeft.
3. Alle tests voor de werking.
4. De tests met de echte app.
5. De build, en eventueel andere controles uit `.github/workflows/`.

Faalt een test die je niet hebt aangeraakt, zeg dan niet dat die "al kapot was". Zoek uit welke wijziging het veroorzaakte, en los het op of maak er een issue van met die oorzaak erin.

## Stap 5: committen

Commit met een korte boodschap die naar het issue verwijst, zonder `Closes`:

```
git add <de gewijzigde bestanden>
```
```
git commit -m "<wat er veranderd is> (#<N>)"
```

Controleer dat je geen bestanden meeneemt die er niet in horen, zoals `.env` of `node_modules`.

## Stap 6: pull request

Alleen als de gebruiker je rechtstreeks oproept. Push, open een pull request met `Closes #<N>` en de echte testresultaten, en volg daarna dezelfde stappen als `/work-issues` voor de controles, de merge en `/cleanup`.

## Stap 7: verslag

Word je opgeroepen door `/work-issues`, eindig dan met exact dit blok:

```
RESULTAAT
status: committed | blocked
issue: <N>
commit: <sha of ->
tests: <wat er echt is uitgevoerd, met aantallen en resultaat>
nieuwe issues: <nummers of ->
notities: <één regel: wat er veranderd is, of waarom het niet lukte>
```

Geef nooit een mooier resultaat dan er echt is.
