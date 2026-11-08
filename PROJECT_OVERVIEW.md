# Rekenen met waveforms

## Doel
Een app die toont hoe je rekent met geluidsgolven (waveforms). Leerlingen maken golven, zien ze als grafiek en beluisteren ze. Daarna rekenen ze ermee: vermenigvuldigen met een getal, twee golven optellen, en een envelope toepassen. Zo zien en horen ze meteen wat een berekening met het geluid doet.

## Doelgroep
Leerlingen, die zelf met de app werken.

## Eerste versie
- Een golf maken met een vrij te kiezen frequentie en een van vier vormen: sinus, blok, zaagtand of driehoek.
- Elke golf duurt 2 seconden.
- Elke golf wordt getoond als grafiek en kan afgespeeld worden.
- In de grafiek kan je inzoomen en verschuiven. Bij 2 seconden zie je anders de vorm van de golf niet, want een golf van 440 Hz telt dan 880 trillingen.
- Elke golf en elke envelope krijgt een korte naam (id), zoals W1, W2 en E1, zodat je ernaar kan verwijzen in een bewerking.
- Onder de golven staat een balk met bewerkingen:
  - een nieuwe golf toevoegen
  - een envelope toevoegen, ingesteld met ADSR-schuifjes (attack, decay, sustain, release), met een paar voorbeeldinstellingen om mee te beginnen
  - een bestaande golf vermenigvuldigen met een decimaal getal
  - twee golven optellen
  - een golf vermenigvuldigen met een envelope
- Elke bewerking maakt een nieuwe golf met een nieuwe naam. W1 + W2 wordt bijvoorbeeld W3, en W1 en W2 blijven bestaan. Zo zien leerlingen de oorspronkelijke golven en de uitkomst onder elkaar.
- Een golf of envelope kan verwijderd worden.

## Nog niet
- Werk bewaren of delen via een link
- Geluid downloaden als bestand
- Andere bewerkingen, zoals aftrekken of twee golven met elkaar vermenigvuldigen
- Uitleg of opdrachten in de app zelf

## Platform
Een website, zodat leerlingen de app via een link openen zonder iets te installeren. Het geluid en de berekeningen doet de browser zelf (Web Audio), dus er is geen externe dienst of account nodig.

## Frameworks en bouwstenen
**React met Vite.** De app is één interactief scherm met veel knoppen en schuifjes, en daar is React voor gemaakt. Vite bouwt er een statische website van, die gratis op GitHub Pages kan.

## Opslag
Niets bewaren. Ververs je de pagina, dan begin je opnieuw. Dat is het eenvoudigste en volstaat voor een oefening in de les. Bewaren en delen komen eventueel later.

## Vormgeving
Gebruikt het design system in `design-system/`. Je kan later altijd aan de AI vragen om een ander design te ontwerpen en het huidige te vervangen.

## Testen
- Elke golfvorm (sinus, blok, zaagtand, driehoek) wordt correct berekend voor de gekozen frequentie, en duurt 2 seconden.
- Vermenigvuldigen met een decimaal getal vermenigvuldigt elke waarde van de golf met dat getal.
- Twee golven optellen telt de waarden op elk moment bij elkaar op.
- Een golf vermenigvuldigen met een envelope volgt de ADSR-vorm: opkomen, zakken naar het sustain-niveau, en uitsterven.
- Elke bewerking maakt een nieuwe golf met een nieuwe, unieke naam, en laat de oorspronkelijke golven ongewijzigd.
- Golven kunnen afgespeeld worden.
- Inzoomen en verschuiven in de grafiek blijft werken.

## Publicatie
Een website op GitHub Pages. Elke merge naar de hoofdbranch publiceert de site automatisch via een workflow.
