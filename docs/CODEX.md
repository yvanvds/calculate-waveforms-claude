# Deze template gebruiken met Codex

De Claude-skills in `.claude/` blijven ongewijzigd. Codex gebruikt zelfstandige kopieën in `.agents/skills/`, met eigen sjablonen. Er zijn geen links tussen beide versies. Wijzigingen in de ene versie komen niet automatisch in de andere terecht.

## Beginnen

1. Maak via **Use this template** een eigen GitHub-repository en haal die naar je computer.
2. Open de projectmap in een actuele Codex-client met subagents, bijvoorbeeld de Codex-app of CLI. Meld je aan met een account dat toegang heeft tot Codex.
3. Vertrouw deze projectmap wanneer Codex daarom vraagt. Codex laadt projectconfiguratie en projectregels alleen voor vertrouwde projecten. Een template kan zichzelf niet vertrouwen. Herstart Codex nadat je de configuratie voor het eerst hebt overgenomen.
4. Voer `$setup` uit. Die bespreekt je idee, helpt ontbrekende tools en GitHub-aanmelding klaarzetten, en schrijft `PROJECT_OVERVIEW.md`.
5. Voer `$bootstrap-github` uit.
6. Vraag: `Lees PROJECT_OVERVIEW.md en werk AGENTS.md bij met de gekozen bouwstenen en de manier om te bouwen en te testen. Behoud de bestaande werkafspraken. Schrijf nog geen applicatiecode.`
7. Voer `$create-issues Kijk in PROJECT_OVERVIEW.md. Maak issues aan om de eerste versie van deze app te realiseren.` uit.
8. Gebruik de echte nummers. Begin met de eerste twee, bijvoorbeeld `$work-issues 1 2`, en start daarna een nieuwe reeks met de volgende nummers.

`AGENTS.md` is al meegeleverd en bevat de vaste afspraken voor Codex. De vraag in stap 6 vult die aan met de bouwstenen van jouw project. Zolang er nog geen applicatie is, kunnen de testcommando's nog niet worden geverifieerd; laat ze na het eerste basisissue aanvullen.

Verschijnen de skills niet, herstart Codex in de projectmap. Ze staan onder `.agents/skills/` (meervoud). `$setup` en `$work-issues` worden alleen expliciet opgeroepen, net zoals de oorspronkelijke Claude-versies. In Codex gebruik je `$` voor een skill; `/setup` is de Claude-notatie. Je kunt ook expliciet vragen om het betreffende `SKILL.md` te lezen en te volgen.

## Hoe de toestemmingen werken

`.codex/config.toml` kiest voor:

| Instelling | Effect |
|---|---|
| `sandbox_mode = "workspace-write"` | Gewoon werk kan schrijven in de projectmap en tijdelijke mappen. Er is geen onbeperkte schrijftoegang tot de computer. |
| `sandbox_workspace_write.network_access = true` | Commando's kunnen het netwerk gebruiken, onder meer voor GitHub, pakketten en testbrowsers. Dit is algemene uitgaande netwerktoegang, geen lijst van toegestane websites. |
| `approval_policy = "on-request"` | Codex kan extra rechten aanvragen wanneer dat nodig is. |
| `approvals_reviewer = "auto_review"` | Een automatische beoordelaar behandelt daarvoor geschikte aanvragen op basis van de opdracht en het risico. Dat beperkt onderbrekingen tijdens een reeks issues. |
| `agents.enabled = true` | Codex kan subagents gebruiken. De skill laat ze na elkaar werken. |

Dit is geen vertaling van de Claude-lijst met toegestane commando's. Binnen de sandbox kunnen ook andere commando's lopen. Pakketinstallaties en tests kunnen projectcode uitvoeren en hebben hier netwerktoegang. Gebruik deze instellingen voor een eigen, vertrouwd project.

We gebruiken geen `danger-full-access`, geen uitgeschakelde sandbox en geen `approval_policy = "never"`. Die laatste instelling zou benodigde extra rechten meteen weigeren in plaats van ze automatisch te beoordelen. Het gekozen profiel kan nog steeds stoppen: de beoordelaar kan een aanvraag weigeren, een beheerder kan strengere beperkingen opleggen, en aanmelden bij GitHub of toestemming voor een externe app kan menselijk handelen vereisen. Een dag zonder onderbrekingen is dus geen garantie.

Codex beschermt onder meer `.git/`, `.agents/` en `.codex/` ook binnen een schrijfbare projectmap. Daardoor kunnen commits of wijzigingen aan de skills zelf extra toestemming vragen. De beoordelaar kan zulke aanvragen behandelen; de template schakelt die bescherming niet uit.

## Extra commandoregels

`.codex/rules/template.rules` blokkeert aanvragen voor `git reset`, `git clean`, `gh repo delete` en veelgebruikte force-pushvormen. We staan geen brede commando's als `bash`, `python`, `npm` of `git` onvoorwaardelijk buiten de sandbox toe. Zo blijven aanvragen voor extra rechten bij de beoordelaar.

De regels zijn experimentele prefixregels: ze vergelijken het begin van een commando, geen willekeurige opties verderop. Ze zijn bedoeld voor uitvoering buiten de sandbox en vormen geen volledige beveiliging van alle commando's binnen de sandbox. Varianten met extra opties of een andere tool vallen niet noodzakelijk onder dezelfde regel. Daarom verbiedt `AGENTS.md` deze handelingen ook inhoudelijk. Behoud GitHub-branchbescherming als je die gebruikt; de template vervangt die niet.

In de CLI kun je de regels zonder GitHub-wijzigingen controleren:

```sh
codex execpolicy check --pretty --rules .codex/rules/template.rules -- git push --force
```

Het verwachte resultaat is `forbidden`. Een normale `git push` heeft geen match in deze extra regels; dat betekent niet automatisch toestemming, want sandbox en beoordelaar blijven gelden.

Krijg je een melding over een onbekende configuratieoptie, werk de Codex-client bij. Werkt automatische beoordeling niet door account- of organisatiebeleid, dan kan de gebruiker lokaal voor menselijke beoordeling kiezen; de AI verandert dat niet zelf. Projectvertrouwen is lokaal en wordt niet via Git gedeeld. Ook vooraf ingestelde sessieopties kunnen de projectconfiguratie overrulen.

## Lange reeksen issues

De hoofdagent leest de issues en beheert branch, pull request, controles en merge. Elke issue-agent leest zelf de projectinstructies en `$work-issue`, doet het werk en geeft alleen het `RESULTAAT`-blok terug. De hoofdagent kopieert de gesprekshistoriek niet naar de subagent. Zo blijven codeonderzoek en testlogs uit de hoofdcontext.

Standaard kiest Codex bij een algemene opdracht maximaal 10 issues. Vraag expliciet om bijvoorbeeld 15 als je een grotere reeks wil. De agents werken altijd na elkaar in dezelfde map en branch. Ontbreken subagenttools, dan stopt de skill vóór het werk begint; ze schakelt niet ongemerkt over op één lang gesprek. Een geblokkeerd issue gaat niet mee in de pull request en afhankelijke issues worden overgeslagen. Blijft gedeeltelijk werk achter, dan stopt de reeks om te voorkomen dat dit met een volgend issue wordt meegenomen.

De kleine hoofdcontext is het doel; het aantal verbruikte tokens of de abonnementsruimte wordt niet door deze template gegarandeerd.

## Eerste praktijktest

Gebruik een nieuwe repository op basis van deze template. Controleer eerst `$discuss`: die moet overleggen zonder bestanden of GitHub te wijzigen. Doorloop daarna setup en bootstrap en laat enkele kleine issues uitvoeren. Controleer of er per issue een nieuwe subagent start, de echte app getest wordt, één PR met de juiste `Closes #N`-regels ontstaat en de hoofdagent na groene controles terugkeert naar de hoofdbranch.

Laat ook een issue met een ontbrekende beslissing of onbeschikbare dependency proberen. Dat moet als geblokkeerd worden gemeld zonder gedeeltelijk werk mee te nemen. Zo test je de volledige route, inclusief de toestemmingen van jouw eigen installatie. Alleen statische bestandscontroles bewijzen dit niet.

## Officiële documentatie

- [Skills en expliciete aanroep](https://learn.chatgpt.com/docs/build-skills)
- [Projectinstructies via AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md)
- [Configuratie, automatische beoordeling en sandbox](https://learn.chatgpt.com/docs/config-file/config-reference)
- [Commandoregels en hun beperkingen](https://learn.chatgpt.com/docs/agent-configuration/rules)
- [Subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents)
