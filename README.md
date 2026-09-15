# Alpine Cut

Website des Friseursalons **Alpine Cut**, Dorf-Platz 1, 6263 Fügen, Tirol.
Live unter **https://alpine-cut.at** — deutsch, und unter `/en/` auf Englisch.

Der Salon nimmt Laufkundschaft, keine Termine. Die Seite hat deshalb kein
Formular; sie nennt Öffnungszeiten, Adresse, Telefon und WhatsApp.

## Wo was liegt

Alles Gebaute steckt in `scrollcraft/builds/alpine-cut/`:

| Datei | Inhalt |
|---|---|
| `index.html` | die ganze deutsche Seite, Text und CSS inbegriffen |
| `impressum.html`, `datenschutz.html`, `404.html` | Nebenseiten |
| `woerter.mjs` | deutsch → englisch, einzige Quelle für beide Sprachen |
| `uebersetzen.mjs` | erzeugt daraus `en/index.html` |
| `bilder.mjs` | baut Fotos, Logo und Symbole aus `assets/source/` |
| `packen.mjs` | legt `hochladen/` an — das, was auf den Server kommt |
| `serve.mjs` | kleiner Server zum Ansehen, auch vom Handy im WLAN |
| `scrollcraft.js`, `scrollcraft.css` | die Scroll-Engine, unverändert übernommen |

Die Originale der Fotos und des Videos liegen in `assets/source/`. Die werden
nie angetastet; alles Ausgelieferte entsteht daraus.

## Etwas ändern

**Text oder Preise:** in `index.html` ändern. Steht der Text auch auf Englisch,
dann den Eintrag in `woerter.mjs` mitziehen — sonst bleibt `/en/` auf dem alten
Stand. Es gibt keine zweite HTML-Datei zum Pflegen; die englische Seite entsteht
beim Bauen.

**Ein Foto austauschen:** neues Original nach `assets/source/` legen, dann

    cd scrollcraft/builds/alpine-cut
    node bilder.mjs          # Fotos, Logo, Symbole
    node bilder.mjs --clip   # zusätzlich die Videos, braucht ffmpeg

Die Maße im Skript sind gemessen, nicht geraten: geliefert gegen tatsächlich
dargestellt, auf Handy mit dreifacher und Desktop mit doppelter Pixeldichte.

**Ansehen, bevor es live geht:**

    node packen.mjs
    cd ../../../hochladen && node ../scrollcraft/builds/alpine-cut/serve.mjs

Das Startskript nennt auch die Adresse fürs Handy im selben WLAN.

## Veröffentlichen

Push auf `main` → Vercel baut und veröffentlicht von selbst. Nichts hochladen.
Der Bauschritt steht in `vercel.json`.

## Was nicht automatisch nachzieht

- **Die neun Kundenstimmen** in `index.html`. Sie sind im Wortlaut vom
  Google-Profil abgeschrieben und tragen `lang="de"` — ein Zitat wird nicht
  übersetzt, sonst stünde dort etwas, das der Mensch nie geschrieben hat. Neue
  kommen von Hand dazu.
- **Die Preisliste**, wenn sich der Aushang im Salon ändert.

## Zwei Stellen, die man beim Weiterbauen leicht kaputtmacht

- **Höhe der festgehaltenen Abschnitte.** Sie steht als `style="height:…vh"` im
  Markup, obwohl die Engine sie später ohnehin setzt. Ohne das springt die Seite
  beim Laden um einen halben Bildschirm: gemessen CLS 0,56 statt 0,002.
- **`.kontakt` darf kein `height` haben.** Das Element trägt auch `sc-stage`,
  und die Engine gibt dem `100svh`, damit die Bühne am Fenster klebt. Ein
  eigenes `height` daneben gewinnt und hebelt das aus.

## Rechtliches

Impressum und Datenschutz sind auf das abgestimmt, was die Seite tatsächlich
tut — sie sind aber **keine Rechtsberatung**.

Die Seite bettet nichts von Dritten ein: keine Karte, kein Instagram-Widget,
keine Schriften von fremden Servern, kein Analytics. Nachgemessen mit einem
Browser, der jede ausgehende Anfrage mitschreibt: null Fremdabrufe. Deshalb
kein Einwilligungsbanner.

## Offene Frage

Die Längenstufe **„Extra lang"** in der Damentabelle trug auf der Preistafel den
Zusatz „bis Linie". Den verstand niemand — vermutlich die Kurzform von „bis zur
BH-Linie". Ohne Bestätigung wurde der Zusatz entfernt statt geraten.
