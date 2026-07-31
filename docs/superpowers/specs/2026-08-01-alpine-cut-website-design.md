# Alpine Cut — Website, Design-Spezifikation

Datum: 2026-08-01
Status: freigegeben, Grundlage für den Implementierungsplan

## 1. Ziel

Einseitige Website für den Friseursalon Alpine Cut in Fügen, Tirol, mit zwei
Rechtsseiten. Kernstück ist ein Hero, dessen Animation an die Scrollposition
gekoppelt ist: Eine Haarschneidemaschine zerfällt schwebend in ihre Einzelteile.

Die Inhalte liegen in typisierten Konstanten unter `content/`. Der Betreiber
ändert sie dort ohne Code-Kenntnisse; TypeScript fängt Tippfehler beim Build ab.
Kein CMS.

## 2. Bekannte und offene Inhalte

Bekannt und fest einzutragen:

| Feld | Wert |
|---|---|
| Name | Alpine Cut |
| Ort | Fügen, Tirol, Österreich |
| Adresse | Dorf-Platz 1, 6263 Fügen |
| Telefon | +43 676 6786333 |

Offen, als sichtbare TODO-Marker umzusetzen — **nicht erfinden**:

- Leistungen mit Preisen
- Über den Salon (2–3 Sätze)
- Team: Namen und Rollen
- Öffnungszeiten
- Empfängeradresse für Terminanfragen
- Impressumsangaben: Rechtsform, Inhaber, UID/Firmenbuchnummer, Gewerbebehörde,
  Kammerzugehörigkeit
- Geokoordinaten für das JSON-LD

Diese Liste ist vollständig. Alles andere wird gebaut.

## 3. Stack und Umgebung

- Next.js 15, App Router, TypeScript im `strict`-Modus
- Tailwind v4 (`@theme inline` in `globals.css`), shadcn/ui
- Resend für den Mailversand, angesprochen aus einer Server Action
- Deployment auf Vercel
- Node 24.16 liegt unter `C:\Program Files\nodejs`, ist in frischen Shells nicht
  auf dem PATH — Skripte rufen die Binary mit vollem Pfad auf oder setzen ihn
  vorher.
- `ffmpeg` fehlt und wird per `winget install Gyan.FFmpeg` installiert.
- `git` ist vorhanden, das Repository ist unter `C:\Users\beraa\Desktop\alpine-cut`
  bereits initialisiert.

Beim Scaffolding ist zu beachten: Das Verzeichnis ist nicht leer (Assets, `.git`,
`docs/`). `create-next-app` verweigert das. Vorgehen: in ein temporäres
Verzeichnis scaffolden, den Inhalt anschließend herüberkopieren, dabei die
vorhandenen Dateien behalten.

## 4. Assets

Quelldateien werden nach `assets/source/` verschoben und bleiben unverändert:

- `scroll_effekt.mp4` — 1276×720, 24 fps, 6,042 s, 145 Frames, H.264, 3,3 MB
- `clipper_foto.png` — 2720×1536, 4,0 MB

Befund aus der Prüfung: Das Video enthält **einen einzigen Keyframe** (`stss`
listet 1 von 145 Samples) und eine überflüssige AAC-Tonspur. Für Video-Scrubbing
ist es damit ungeeignet — jedes `currentTime`-Setzen müsste vom Anfang an
durchdekodieren. Deshalb wird nicht das Video gescrubbt, sondern eine
Frame-Sequenz auf einem Canvas gezeichnet.

Der Hintergrund des Bildmaterials misst rund `#FAFBFB`, nicht reines Weiß.

### 4.1 Abgeleitete Dateien

`scripts/build-frames.mjs` ruft ffmpeg auf:

```
ffmpeg -i assets/source/scroll_effekt.mp4 -an -vsync 0 \
  -c:v libwebp -quality 80 -compression_level 6 -preset picture \
  public/frames/clip-%03d.webp
```

Erwartet exakt 145 Dateien `clip-000.webp` … `clip-144.webp`, geschätzt 4–6 MB
gesamt. Das Skript prüft die Dateizahl und bricht bei Abweichung ab. Die Frames
werden versioniert, weil der Vercel-Build sie braucht.

`scripts/build-images.mjs` erzeugt mit `sharp`:

- `public/clipper-poster.jpg` — 1600 px breit, Qualität 72, aus Frame 0 der
  Sequenz, damit Poster und erster Animationsframe deckungsgleich sind
- `public/clipper-foto.jpg` — 1600 px breit, Qualität 78, aus `clipper_foto.png`
- `app/opengraph-image.jpg` — 1200×630, Bildausschnitt plus Wortmarke als
  SVG-Ebene einkomponiert

Das OG-Bild wird bewusst statisch vorgeneriert statt über `@vercel/og` erzeugt:
Auf dieser Windows-Maschine ist die Font-Ladung von `@vercel/og` fehlerhaft.

## 5. Gestaltung

Hell und reduziert. Weißraum und eine Haarlinie trennen die Abschnitte. Keine
Schatten, keine Verläufe, keine gerahmten Karten. shadcn-Komponenten werden auf
`--radius: 2px` gesetzt und ihre Shadow-Utilities entfernt.

Sprache durchgängig Deutsch, per Sie, knapp, ohne Werbefloskeln.

### 5.1 Farb-Tokens

| Token | Wert | Verwendung | Kontrast auf `--bg` |
|---|---|---|---|
| `--bg` | `#FAFAFA` | globaler Grund, Hero-Bühne | — |
| `--fg` | `#0F0F0F` | Überschriften, Fließtext | 18,9:1 |
| `--fg-muted` | `#5A5A57` | Sekundärtext, Meta, Preise | 6,6:1 |
| `--line` | `#E4E4E1` | Trennlinien | — |
| `--gold` | `#8A6620` | Aktionen, Links, Fokus-Ring, Buttonfläche | 5,0:1; weißer Text darauf 5,3:1 |
| `--gold-soft` | `#C8A159` | rein dekorative Marken | 2,3:1 — nie für Text oder Information |
| `--todo` | `#B3261E` | TODO-Marker | 6,9:1 |

`--bg` ist `#FAFAFA` statt reinem Weiß, weil das Bildmaterial diesen Ton hat. Auf
`#FFFFFF` stünde die Canvas-Fläche als graues Rechteck in der Seite. Ergänzend
blendet eine `mask-image`-Vignette die Canvas-Kanten über je 8 % der Breite und
Höhe weich aus, damit auch die Papiertextur des Materials nicht abrupt endet.

Gold wird sparsam eingesetzt: Buttonfläche der Terminanfrage, Links im Fließtext,
Fokus-Ring, Ziffern der Abschnittsnummern. Nicht für Flächen, nicht für
Überschriften.

### 5.2 Typo-Tokens

- Display: **Instrument Serif** 400 und Italic 400, über `next/font/google`,
  im Build self-hosted
- Fließtext: **Geist Sans**, über das `geist`-Paket, self-hosted, kein
  Netzwerkzugriff im Build

```
--font-display: "Instrument Serif", Georgia, serif;
--font-sans:    "Geist Sans", system-ui, sans-serif;
```

Fluide Skala zwischen 360 px und 1440 px Viewport:

| Rolle | Größe | Zeilenhöhe | Laufweite |
|---|---|---|---|
| Hero H1 | `clamp(3rem, 1.6rem + 6.2vw, 7.5rem)` | `0.95` | `-0.02em` |
| H2 | `clamp(2rem, 1.2rem + 3.4vw, 3.5rem)` | `1.05` | `-0.015em` |
| H3 | `clamp(1.25rem, 1.1rem + 0.7vw, 1.625rem)` | `1.2` | `-0.01em` |
| Lead | `clamp(1.125rem, 1.05rem + 0.35vw, 1.375rem)` | `1.5` | `0` |
| Body | `1.0625rem` | `1.6` | `0` |
| Eyebrow, Versalien | `0.8125rem` | `1.4` | `0.14em` |

Vertikaler Rhythmus auf 4-px-Basis. Abschnittspolster `clamp(5rem, 10vw, 9rem)`.
Container `max-width: 1200px`, Außenabstand `clamp(1.25rem, 5vw, 4rem)` — bei
360 px bleiben 20 px Rand.

## 6. Hero und Scroll-Kopplung

### 6.1 Bühne

Die Höhe der Bühne bestimmt CSS, nicht JavaScript. Das ist die Grundlage der
Layout-Stabilität: Serverausgabe und erster Client-Frame stimmen überein, es
werden keine 200 vh nachträglich zugeschaltet.

```css
.stage { height: 100svh; }
@media (min-width: 768px) and (prefers-reduced-motion: no-preference) {
  .stage { height: calc(100svh + 200vh); }
}
.stage > .pin { position: sticky; top: 0; height: 100svh; }
```

Unter 768 px und bei `prefers-reduced-motion: reduce` existiert die Scrollstrecke
nicht — sie wird nicht ausgeblendet, sie entsteht gar nicht.

### 6.2 Der Loop

Ein passiver `scroll`-Listener schreibt ausschließlich eine Zahl in eine Ref und
setzt ein Dirty-Flag. Keine Berechnung im Event, kein `useState`, kein Re-Render
pro Frame. Die Arbeit passiert in `requestAnimationFrame`:

```
raw    = clamp(-stage.getBoundingClientRect().top / scrollLen, 0, 1)
k      = 1 - (1 - 0.12) ** (dt / 16.67)
eased += (raw - eased) * k
i      = Math.round(eased * 144)
if (i !== lastDrawn) { ctx.drawImage(frames[i], 0, 0, w, h); lastDrawn = i }
```

Der Exponent in `k` macht die Glättung framerateunabhängig; ohne ihn liefe sie
auf 120-Hz-Displays doppelt so schnell.

Der Loop läuft nur, solange ein `IntersectionObserver` die Bühne als sichtbar
meldet, und beendet sich selbst, sobald `dirty === false` und
`|raw − eased| < 0.0005`. Beim nächsten Scrollereignis startet er neu. Kein
Dauer-rAF im Hintergrund.

Der Canvas ist DPR-skaliert: `canvas.width = cssWidth * min(devicePixelRatio, 2)`,
die Transform wird einmal beim Resize gesetzt. Dargestellt wird auf höchstens
1276 CSS-px Breite, also 1:1 zur Quelle statt hochskaliert.

### 6.3 Rückwärtsscrollen

Die Animation läuft in beide Richtungen gleichwertig. Scrollt der Besucher
zurück, fügt sich die Maschine wieder zusammen — in derselben Geschwindigkeit und
Glätte wie beim Zerfallen. Das ergibt sich aus der Konstruktion: Der Frame-Index
ist eine reine Funktion der Scrollposition, keine fortschreitende Abspielung.
Es gibt keinen Zustand, der sich merkt, dass die Animation „schon gelaufen" ist.

Drei Stellen, an denen eine naheliegende Umsetzung das zerstören würde. Sie sind
verbindlich:

1. **Kein einmaliges Auslösen.** Weder Frame-Zeichnung noch Textwechsel dürfen an
   ein „hat Schwelle überschritten"-Flag gebunden werden. Alles leitet sich in
   jedem Frame neu aus `eased` ab. Kein `hasPlayed`, kein `triggered`.
2. **Der Textwechsel ist richtungsunabhängig.** Die Deckkraft ergibt sich ohnehin
   stetig aus `--p` und kehrt damit von selbst um. Das `data-phase`-Attribut, das
   `visibility`, `pointer-events` und `aria-hidden` steuert, schaltet mit einem
   toten Band: auf `"b"` ab `eased > 0.55`, zurück auf `"a"` unter `eased < 0.45`.
   Das Band verhindert Flackern bei kleinen Scrollbewegungen genau auf der
   Schwelle, ohne eine Vorzugsrichtung einzuführen.
3. **Beim Betreten wird nicht bei null begonnen.** Kehrt der Besucher von unten in
   die Bühne zurück, oder lädt er die Seite mit wiederhergestellter
   Scrollposition mitten in der Strecke neu, wird `eased` beim Start des Loops
   auf den aktuell gemessenen `raw`-Wert gesetzt, nicht auf 0. Sonst würde die
   Animation sichtbar von Frame 0 an die richtige Position heranfahren.

Alle 145 Frames sind vorgeladen, sobald das Scrubbing aktiv ist. Rückwärts kostet
deshalb keinen einzigen zusätzlichen Request und läuft exakt so flüssig wie
vorwärts. Der `IntersectionObserver` startet den rAF-Loop beim Wiedereintritt von
unten genauso wie beim ersten Eintritt von oben.

### 6.4 Textwechsel

Derselbe rAF-Loop schreibt `--p: <eased>` als Custom Property auf die Bühne. Die
Property wird per `@property --p { syntax: "<number>"; inherits: true; initial-value: 0 }`
registriert, damit sie typisiert ist und in `calc()` zuverlässig als Zahl gilt.
Die Deckkraft beider Textblöcke leitet sich daraus ab:

- Headline: voll sichtbar bis `--p` = 0,28, ausgeblendet ab 0,42
- Zweiter Block: beginnt bei 0,55, voll sichtbar ab 0,75, bleibt bis 1

Für `visibility` und `pointer-events` setzt der Loop zusätzlich
`data-phase="a" | "b"` auf die Bühne, aber nur beim tatsächlichen Wechsel — also
zweimal pro Durchgang statt 145-mal. Die Schaltschwellen mit totem Band stehen in
6.3. Beide Blöcke bleiben im DOM; der jeweils inaktive erhält
`aria-hidden="true"`, damit Screenreader nicht doppelt vorlesen.

### 6.5 Frames laden

145 WebP werden als `Image` erzeugt, mit `decoding="async"` und `await img.decode()`
in Blöcken zu sechs parallel. Der Start erfolgt in `requestIdleCallback` nach dem
LCP, damit das Poster nicht mit den Frames um Bandbreite konkurriert.

Ist Frame `i` noch nicht dekodiert, wird der nächstniedrigere fertige gezeichnet.
Es entsteht kein Loch und kein Sprung, nur kurzzeitig eine gröbere Schrittweite.
Frame 0 wird zusätzlich als `<link rel="preload" as="image">` angefordert.

### 6.6 Wann gescrubbt wird

| Bedingung | Verhalten | Durchgesetzt von |
|---|---|---|
| `prefers-reduced-motion: reduce` | Poster, kein Loop, Frames werden gar nicht geladen | CSS und JS-Gate |
| Viewport < 768 px | Poster, keine Scrollstrecke, keine Frames | CSS und JS-Gate |
| `navigator.connection.saveData` | Poster, keine Frames | JS |
| Preload scheitert oder dauert > 8 s | Poster bleibt, Loop startet nie | JS |
| Fenster unter 768 px verkleinert oder reduced-motion aktiviert | Loop stoppt, Poster kehrt zurück | aktive `matchMedia`-Listener |
| JavaScript deaktiviert | `<noscript>`-Poster | HTML |

iOS Safari braucht keine Sonderbehandlung: Es wird kein `currentTime` gesetzt und
kein Seek ausgelöst. `drawImage` ist dort verlässlich. Die Adressleisten-
Problematik fangen `100svh` und die `getBoundingClientRect`-Messung ab, die
unabhängig von Viewport-Einheiten korrekt bleibt.

Bei abgeschaltetem Scrubbing stehen beide Textblöcke statisch untereinander, das
Poster wird über `next/image` mit `priority` und gesetzten Dimensionen geladen.

## 7. Seitenaufbau

Startseite, in dieser Reihenfolge:

1. Hero mit Scroll-Animation
2. Leistungen mit Preisen
3. Über den Salon
4. Team
5. Öffnungszeiten und Anfahrt
6. Terminanfrage

Kopfzeile mit Wortmarke und Sprungmarken zu den Abschnitten. Fußzeile mit
Adresse, Telefon und Links auf Impressum und Datenschutz als eigene Seiten.

Öffnungszeiten werden als `<dl>` ausgezeichnet, nicht als Tabelle — es sind
Paare aus Tag und Zeitraum, keine mehrdimensionalen Daten.

Zur Anfahrt: **keine eingebettete Karte.** Ein `iframe` von Google Maps setzt
Cookies vor jeder Einwilligung und würde ein Consent-Banner erzwingen.
Stattdessen die Adresse als Text und ein normaler Link „Route planen", der erst
beim Klick nach außen führt.

## 8. Inhaltsschicht

`content/` ist die einzige Stelle, die der Betreiber anfasst:

- `types.ts` — alle Typen an einer Stelle
- `salon.ts` — Name, Ort, Adresse, Telefon, E-Mail
- `leistungen.ts` — Kategorien mit Positionen und Preisen
- `team.ts`
- `oeffnungszeiten.ts`
- `texte.ts` — Hero-Headlines, Über-Text, Formularbeschriftungen
- `rechtliches.ts` — Impressum und Datenschutz

### 8.1 TODO-Marker

Ein Platzhalter wird als `todo("Preise für Damenhaarschnitt eintragen")`
geschrieben. Die Funktion gibt einen markierten Wert zurück, der sich wie folgt
verhält:

- In der Entwicklung und im normalen Produktionsbuild: sichtbarer roter Balken mit
  dem Hinweistext an der Stelle, an der der Inhalt später steht. Der Build läuft
  durch, listet aber alle offenen Marker gesammelt im Log auf. So lässt sich die
  Seite jederzeit auf Vercel ansehen, ohne dass Platzhalter unauffällig bleiben.
- Mit `STRICT_CONTENT=1`: Der Build **bricht ab** und nennt jeden offenen Marker.
  Diese Variable wird im Vercel-Projekt gesetzt, sobald die Seite öffentlich geht
  — ab dann kann nichts mehr versehentlich mit Platzhaltern live gehen.

Felder mit offenem Marker werden aus dem JSON-LD **weggelassen**, nicht mit
Platzhaltertext gefüllt — sonst stünde Unsinn in den strukturierten Daten.
Gleiches gilt für `<meta>`-Beschreibungen.

## 9. Terminanfrage

Server Action, angebunden über `useActionState`. Validierung mit Zod auf dem
Server; die Client-Validierung ist reiner Komfort und ersetzt sie nicht.

Felder: Name, Telefon, Wunschleistung (Select, gespeist aus
`content/leistungen.ts`), Wunschtermin (`<input type="date">` mit `min` = heute).
Dazu ein Honeypot-Feld und eine Mindest-Ausfüllzeit gegen Bots — kein Captcha,
also kein Drittanbieter im Datenschutz.

Fehlertexte benennen Ursache und nächsten Schritt. Beispiele:

- „Die Telefonnummer ist zu kurz. Bitte mit Vorwahl angeben, zum Beispiel
  0512 123456."
- „Bitte wählen Sie eine Leistung aus der Liste."
- „Der Wunschtermin liegt in der Vergangenheit. Bitte wählen Sie ein Datum ab
  heute."
- Bei Ausfall des Mailversands: „Die Anfrage konnte nicht versendet werden. Bitte
  rufen Sie uns an unter +43 676 6786333 oder versuchen Sie es in einigen Minuten
  erneut."

Kein „Etwas ist schiefgelaufen".

Umgebungsvariablen in `.env.example`: `RESEND_API_KEY`, `ANFRAGE_EMPFAENGER`,
`ANFRAGE_ABSENDER`, `NEXT_PUBLIC_SITE_URL`.

Bekannte Grenze: Das Rate-Limit liegt im Speicher der Serverless-Funktion. Auf
Vercel bremst das Gelegenheits-Spam, aber keinen Angreifer, der über mehrere
Instanzen streut. Falls das Formular später Spam zieht, ist ein geteilter Zähler
über Upstash Redis der nächste Schritt. Jetzt wäre er Überbau.

## 10. Metadaten, SEO, strukturierte Daten

- `metadataBase`, `title.template`, Beschreibung, Open Graph, `alternates.canonical`
  in `app/layout.tsx`
- `app/sitemap.ts` mit drei URLs, `app/robots.ts`
- JSON-LD vom Typ `HairSalon` in `lib/jsonld.ts`, abgeleitet aus `content/`:
  `name`, `address` (Dorf-Platz 1, 6263 Fügen, AT), `telephone`, `url`, `image`,
  `openingHoursSpecification`, `priceRange`
- Felder mit offenem TODO-Marker entfallen im JSON-LD, insbesondere `geo` und
  `openingHoursSpecification`, solange die Zeiten nicht eingetragen sind

## 11. Barrierefreiheit

- Skip-Link zur Hauptinhalts-Landmarke
- Sichtbarer `:focus-visible`-Ring: 2 px in `--gold`, 2 px Versatz, auf allen
  interaktiven Elementen
- Semantisches HTML: `header`, `nav`, `main`, `section` mit
  `aria-labelledby`, `footer`
- Canvas mit `role="img"` und beschreibendem `aria-label`
- Formular: `<label>`-Verknüpfung, `aria-describedby` für Fehlermeldungen,
  `aria-invalid`, `role="status"` für die Erfolgsmeldung, Fokus springt nach dem
  Absenden auf die Fehlerzusammenfassung
- Alle Übergänge respektieren `prefers-reduced-motion`
- Vollständige Tastaturbedienung, keine Fokusfallen

## 12. Rechtsseiten

Impressum nach österreichischem ECG und Mediengesetz: Medieninhaber, Anschrift,
Kontakt, UID beziehungsweise Firmenbuchnummer, Gewerbebehörde,
Kammerzugehörigkeit, anwendbare Rechtsvorschriften, Hinweis auf die
Online-Streitbeilegung. Die betriebsspezifischen Angaben sind TODO-Marker.

Datenschutzerklärung nach DSGVO, inhaltlich zutreffend für das, was die Seite
tatsächlich tut: Verarbeitung der Formulardaten (Name, Telefon, Wunschleistung,
Wunschtermin) auf Grundlage von Art. 6 Abs. 1 lit. b und f, Resend als
Auftragsverarbeiter mit Datenübermittlung in die USA auf Basis von
Standardvertragsklauseln, Vercel als Hoster mit Server-Logs, Speicherdauer,
Betroffenenrechte, Aufsichtsbehörde. Kein Analytics, keine Cookies außer
technisch notwendigen, deshalb **kein Cookie-Banner**.

Diese Texte sind eine fachlich sorgfältige Grundlage, keine Rechtsberatung. Vor
dem Livegang gehören sie anwaltlich geprüft; ein entsprechender Hinweis steht im
README.

## 13. Nicht im Umfang

Bewusst weggelassen: CMS, Analytics, Cookie-Banner, Online-Buchung mit
Kalendersynchronisation, Mehrsprachigkeit, Dark Mode, Blog, Bildergalerie,
Newsletter, eingebettete Karte, Social-Media-Feeds.

## 14. Abnahme

Vor der Fertigmeldung wird geprüft und das Ergebnis berichtet, nicht behauptet:

1. `tsc --noEmit` und `next lint` ohne Fehler
2. `next build` erfolgreich, offene TODO-Marker im Log aufgelistet; zusätzlich
   ein Lauf mit `STRICT_CONTENT=1`, der erwartungsgemäß mit der Marker-Liste
   abbricht
3. Lighthouse mobil gegen den Produktionsbuild, alle vier Werte notiert. Ziel ist
   je über 90. Der SEO-Wert hängt daran, dass Titel, Beschreibung und Adresse
   echte Inhalte tragen; mit TODO-Markern bewertet Lighthouse das, was dasteht.
4. Tastaturdurchlauf über die gesamte Seite, Fokus jederzeit sichtbar
5. Darstellung bei 360 px, 768 px, 1024 px, 1440 px ohne horizontales Scrollen
6. Scrubbing auf dem Desktop flüssig, Frame 0 und Frame 144 exakt an den
   Scrollenden
7. Rückwärtsscrollen: Die Maschine setzt sich wieder zusammen, genauso flüssig
   wie beim Zerfallen. Geprüft wird zusätzlich der Wiedereintritt von unten und
   ein Reload mitten in der Scrollstrecke — die Animation muss dort sofort im
   richtigen Frame stehen und darf nicht von Frame 0 heranfahren.
8. `prefers-reduced-motion` aktiviert: keine Scrollstrecke, keine Frame-Requests
   im Netzwerk-Panel
9. Formular: Erfolgsfall, jeder einzelne Validierungsfehler, sowie der Fall eines
   fehlenden `RESEND_API_KEY`
10. `curl` auf `/sitemap.xml` und `/robots.txt`, JSON-LD durch den Rich-Results-Test
