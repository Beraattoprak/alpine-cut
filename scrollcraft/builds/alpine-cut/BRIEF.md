# Alpine Cut — Brief

Interviewt am 2026-09-01. Antworten im Wortlaut des Auftraggebers, nicht
paraphrasiert. Was von mir stammt, ist als solches gekennzeichnet.

## 1. Stimmung und Vorbilder

> Stimmung: dunkel, präzise, warm, alpin.
>
> Vorbilder:
> - Blue-Note-Plattencover von Reid Miles — wenige Elemente, harte Typo, alles sitzt.
> - Ein Aesop-Laden — Rohmaterial, warmes Punktlicht, viel Leere, nichts schreit.
> - „Le Samouraï" — kalte Bildruhe, wenig Bewegung, jede Einstellung aufgeräumt.
>
> Aesop passt jetzt besser als vorher: dunkler Raum, einzelne Objekte im
> Lichtkegel. Das ist genau das Prinzip für die Seite.

## 2. Der Weg durchs Scrollen

> Bleibt gleich: Haarschneider und Name, dann ein Satz zum Salon, dann
> Leistungen und Preise nach Damen und Herren getrennt, dann Team mit
> Gesichtern, zuletzt Öffnungszeiten, Adresse, Karte und Termin per Telefon
> und WhatsApp.

## 3. Ruhig und laut

> Auf Schwarz funktioniert laut anders — laut heißt hier hell, nicht groß.
> Licht ist das Lautstärkemittel.
>
> Laut: der Hero und der Kontaktblock unten. Dort das Gold, dort der Kontrast.
> Dazwischen ruhig — Ivory auf Anthrazit statt Weiß auf Schwarz, damit es die
> Augen nicht schneidet. Die Preisliste bleibt nüchtern, dünne Goldlinien als
> Trenner, sonst nichts. Fotos vom Team dunkel ausbelichtet, damit sie nicht
> als helle Blöcke aus der Seite springen.

## 4. Gefühl und der eine Moment

> Beim Scrollen soll es sich anfühlen wie ein Salon nach Feierabend: still,
> dunkel, ein Licht über dem Stuhl.
>
> Der Satz bleibt: „Da ist diese Seite, wo sich der Haarschneider beim Scrollen
> von selbst zusammensetzt." Auf Schwarz wirkt das stärker, weil die
> schwebenden Einzelteile im Dunkeln stehen statt im Weißen zu verschwinden.

## 5. Die eine Sache

> Der Längenregler am Haarschneider bleibt beim Weiterscrollen am rechten Rand
> hängen und wird zur Steuerung: hoch oder runter geschoben wechselt die
> Preisliste zwischen Herren und Damen, die Kopfzeile zeigt die eingestellte
> Länge in Millimetern. Ein Bauteil aus dem Video wird zum echten Bedienelement.
>
> Zweite Möglichkeit, die erst auf Schwarz Sinn ergibt: Die Seite ist oben fast
> dunkel und wird beim Scrollen Abschnitt für Abschnitt heller, als würden
> nacheinander die Lichter im Salon angehen. Unten beim Kontakt ist voll
> aufgedreht.

## 6. Tonlage

Redaktionell, mit Kante. Ruhig in der Grundhaltung, klare Brüche, ein Moment
der überrascht.

## 7. Struktur

Getrennte Szenen. Kein durchgehender Raum — ohne erzeugtes Videomaterial wäre
ein Weltflug teuer und brüchig.

## 8. Vorhandenes Material

- `assets/source/scroll_effekt.mp4` — Haarschneider zerfällt, 145 Frames,
  6,04 s. Neu kodiert für Scrubbing (gop=8 Desktop, gop=4 mobil).
- `assets/source/logo_alpinecut.jpg` — Logo, weiß auf schwarz, freigestellt
  vorhanden als `public/logo.png`.
- `assets/source/fotos/` — vier Salonfotos: Außenansicht mit Logo im
  Schaufenster, Wartebereich mit Chesterfields, Bedienplätze, Waschbereich.
- `assets/source/schnitte/` — vier Schnittfotos: drei Herren, ein Damen.
  `herren-crop` und `herren-taper` sind schief aufgenommen und müssen
  gerade gedreht werden.
- Kein Teamfoto. Kein erzeugtes Material (kein kie.ai-Schlüssel gesetzt).

## Fehlendes Material

Blockiert Teile des gewünschten Wegs:

- **Preise, getrennt nach Damen und Herren.** Beat 4 des Wegs und zugleich das,
  was die Signature-Bewegung steuert. Ohne Zahlen schaltet der Längenregler
  zwischen zwei leeren Listen.
- **Teamfotos mit Gesichtern.** Beat 5. Die vier Schnittfotos zeigen Kunden,
  nicht das Team.
- **Öffnungszeiten.**

Erfunden wird davon nichts. Bis die Angaben da sind, steht die Struktur mit
sichtbaren Markern.

## Die Gefühlskurve

Eine Zeile je Akt: das Gefühl, dann was es auf dem Schirm auslöst.

| Akt | Gefühl | Wodurch |
|---|---|---|
| 1 Ankunft | Stillstand, Neugier | Fast schwarz. Nur der Haarschneider im Lichtkegel, der sich unter der eigenen Hand zerlegt. |
| 2 Der Ort | Ankommen | Ein Satz zum Salon, das Außenfoto schiebt sich langsam ins Bild. Kaum Bewegung. |
| 3 Das Handwerk | Genauigkeit | **Peak.** Der Längenregler löst sich, bleibt rechts hängen, wird zum Regler. Die Preisliste gehorcht ihm. |
| 4 Die Arbeit | Beweis | Schnittfotos wandern seitlich durch. Ruhig, kein Trick. |
| 5 Der Raum | Wärme | Salonfotos, dunkel ausbelichtet. Das Licht steigt merklich. |
| 6 Komm vorbei | Offenheit, Aufforderung | Voll aufgedreht: Gold, Kontrast, Adresse und Kontakt. |

Kein Akt trägt dasselbe Gefühl wie sein Nachbar. Akt 2 ist bewusst der leiseste
und liegt direkt vor dem Peak.

## Der Peak

Akt 3. Der Satz, den jemand weitererzählt:

> „Da ist diese Seite, wo sich der Haarschneider beim Scrollen zerlegt — und
> dann kannst du mit dem Längenregler die Preisliste umschalten."

Bekommt die größte Scrollstrecke der Seite und die Stille davor.

## Der Satz

Es ist die Seite, wo ein Bauteil aus dem Video zum Bedienelement wird.

## Beabsichtigte Stille

Akt 2 ist absichtlich fast bewegungslos: ein Foto, ein Satz, sonst nichts. Beim
Prüflauf ist das keine tote Scrollstrecke, sondern der Anlauf zum Peak.

## Beide Vorschläge aus Frage 5

Der Auftraggeber nannte zwei. Beide werden gebaut, sie widersprechen sich nicht:
Der Längenregler ist die Signature-Bewegung, das ansteigende Licht ist die
Grundstruktur der Seite und trägt die Lautstärkekurve aus Frage 3.
