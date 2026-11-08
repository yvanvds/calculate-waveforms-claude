# ChatExchange

Een uitwisseling tussen een mens en AI, in chatbubbels.

**Wat jij levert:** een `.ai-chat` met berichten in volgorde, elk `.ai-msg` met `.ai-msg--student` of `.ai-msg--ai`, met een `.ai-msg__who` (met `aria-label`) en de tekst in `.ai-msg__bubble`.

- `.ai-msg--student` is de mens, rechts: wit met rand, bolletje in `brand`. De klasse heet zo, maar past bij elke menselijke gesprekspartner.
- `.ai-msg--ai` staat links: `ai-soft`, bolletje in `ai`.
- Markeer een fout of twijfelachtige claim met `<span data-flag>`: oranje onderlijning op `warning-soft`.
