# appbase

Work in progress description on work below:

(Gäller endast större applikationer, för mindre och medelstora webbprojekt fungerar nuvarande upplägg bra)

## Problem med nuvarande system:

* Prestanda, framförallt throughput
	- Vyer i GUIt är ofta svintunga eftersom databasen blir stor och aggregera data gör applikationen väldigt komplex fort.
	- Att arkivera data i relationsdatabaser är inte så effektivt, men att ha flera olika datalagringar i nuvarande system gör det ännu rörigare
	- Svårt att få till vettig "parallelism" för att få saker att skala, och även när det lyckas är databasen en flaskhals
* Svårt att överblicka för nya utvecklare
	- Peta på ett ställe så riskerar det att rasa på ett annat
	- Det mesta hänger ihop
* Svårt att överblicka för alla utvecklare, framförallt då när det gäller att nyutveckla eller göra en förändring djupt ner i systemet
	- Samma som ovanstående :)
* Svårt att logga och pyssla för att ha bra spårbarhet
* Svårt att testa buggar, eftersom dom ofta är en kombinationseffekt över stora delar av systemet

## Målsättningar för förändringar:

* Lätt att sätta sig in i systemet, både överblicksmässigt och på djupet
	- Tydliga guidelines för hur nya systemdelar utvecklas
	- Grundläggande koncept för applikationsdesignen (kommunikation, datastrukturer, helikptervyer osv) ska vara enkla, KISS!
* Skall kunna skala, mycket. Skalning skall alltid vara en behandlad fråga när en ny systemdel utvecklas och skall vara centralt i arkiktekturen i systemet som helhet.
* Kostnad för underhåll och nyutveckling skall öka så lite som möjligt alltmedan systemet växer/förändras. T ex bör målsättningen för varje microinstans vara att den byggs så pass bra och tydligt att den inte skall behöva ändras på länge.

## Riktlinjer för nya systemet:

* Undvik (som pesten) seriella ID-nummer till förmån för UUID
* Dokumentera alltid systemglobala regler (t ex att alla meddelanden över bussen skall vara i JSON-format)
* Dokumentera allra minst hur alla delar hänger ihop och pratar med varandra
* Ha alltid en systemkarta i vektorformat uppdaterad
* Minimera antalet skrivningar i varje enskild microinstans (men det är som kontrast inte särskilt viktigt att antalet totala skrivningar i hela systemet hålls nere)
* Varje microinstans skall hållas “liten”. Allra minst skall en, ensam utvecklare kunna ha 100% koll på hela microinstansen. Målsättning: ~80 timmar för full rewrite (Extrem gissning, bör revideras snart!).
* Färdiga containers för att snabbt kunna få upp en snurrande version av systemet i sin helhet
* Det skall alltid finnas EN och endast EN microinstans som äger “sanningen” om en viss data. T ex “users” kan finnas i flera olika microinstanser av GUI-visningsskäl eller annat, men endast en microinstans äger rätten att ändra i users rådata. Om någon form av diskrepans eller osäkerhet uppstår skall alla instanser som inte äger “sanningen” radera sin data och efterfråga en ny råkopia av den microinstans som äger “sanningen”. (Denna enda microinstans som äger sanningen kan dock skalas upp och vara flera parallella…)
* Alla microinstanser måste alltid kunna hantera dubletter (eller fler än dubletter) av samma meddelanden.
* Alla meddelanden som skickas över köhanteraren skall ha samma innehållsarkitektur:
```json
{"msgUuid": "v4", "payload": "xxx", "senderTimestamp": "2016-07-22 14:29:14.123"}
```
