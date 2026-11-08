# Werken met Codex

Dit is een template waarmee collega's zonder programmeerervaring apps maken. Praat in de taal van de gebruiker, kort en zonder jargon. Leg technische keuzes eenvoudig uit en geef een aanbeveling. Stel bij het verkennen van een project één vraag tegelijk.

## Projectcontext

- Lees `PROJECT_OVERVIEW.md` als het bestaat. Daar staan doel, eerste versie, gekozen frameworks, opslag en publicatie.
- Gebruik het design system in `design-system/README.md`, tenzij het projectoverzicht iets anders kiest.
- De Codex-skills zijn zelfstandige bestanden in `.agents/skills/`. De Claude-werkwijze in `.claude/` blijft apart: pas die alleen aan als de gebruiker dat vraagt.
- Lees en volg `.agents/commandos.md` bij het uitvoeren van commando's, ook als subagent.

## Werkwijze

- `$setup` bespreekt het project en schrijft `PROJECT_OVERVIEW.md`, zonder applicatiecode.
- `$bootstrap-github` zet GitHub klaar. Werk daarna dit bestand bij met de gekozen bouwstenen en concrete build- en testcommando's, met behoud van deze afspraken.
- `$create-issues` maakt concrete GitHub-taken. Applicatiewijzigingen verlopen normaal via een issue en `$work-issue` of `$work-issues`.
- `$work-issues` gebruikt voor elk issue een nieuwe subagent met een eigen context, zonder de conversatiegeschiedenis te kopiëren. Geef de werkmap, skillpaden, branch en alleen noodzakelijke eerdere resultaten mee. Werk na elkaar in dezelfde checkout. De hoofdagent coördineert en ontvangt korte resultaten. Dit is expliciete toestemming voor de in die skill beschreven delegatie.
- Maak nieuwe branches met `codex/` als voorvoegsel. Commit alleen bestanden die bij het werk horen. Behoud bestaande wijzigingen van de gebruiker.
- Een opdracht om issues uit te werken omvat de commits, push, pull request, controles, merge na geslaagde controles en cleanup uit de skill. Een opdracht om alleen te bespreken of issues te maken omvat die stappen niet.
- `$discuss` is uitsluitend overleg: niets wijzigen tot de gebruiker duidelijk tot actie wil overgaan.

## Kwaliteit en gegevens

- Gebruik de gekozen frameworks en schrijf relevante tests voor gewijzigde werking. Test zichtbare handelingen ook met de echte app, volgens de issue-skill.
- Rapporteer alleen echt uitgevoerde controles. Merge nooit met falende controles of onopgeloste conflicten.
- Bewaar geen geheimen, wachtwoorden of echte leerlinggegevens in code, issues of voorbeeldbestanden.
- Voer nooit force-pushes, `git reset --hard`, `git clean` of het verwijderen van de repository uit, ook niet via een andere argumentvolgorde of tool.

## Toestemmingen

De projectinstellingen staan in `.codex/config.toml`; uitleg en beperkingen in `docs/CODEX.md`. Organisatiebeleid en de actieve sessie kunnen strenger zijn. Wijzig zelf geen beveiligingsinstellingen of regels om een blokkade te omzeilen. Meld een geweigerde noodzakelijke handeling en de concrete reden.

## Projectspecifieke aanvullingen

Na `$setup`: vul hier de gekozen bouwstenen en geverifieerde commando's om te ontwikkelen, testen en bouwen aan. Bedenk geen commando's voordat het framework is gekozen en aangemaakt.
