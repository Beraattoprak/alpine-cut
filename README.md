# Alpine Cut

Website des Friseursalons Alpine Cut, Dorf-Platz 1, 6263 Fügen, Tirol.

Der Salon nimmt **Laufkundschaft** — keine Terminvergabe. Die Seite hat deshalb
kein Formular; sie nennt Öffnungszeiten, Adresse und Telefonnummer.

## Inhalte ändern

Alles Redaktionelle liegt unter `content/`. TypeScript meldet Tippfehler beim
Build, statt sie live gehen zu lassen.

| Datei | Inhalt |
|---|---|
| `content/salon.ts` | Name, Adresse, Telefon, Instagram, E-Mail |
| `content/leistungen.ts` | Leistungen mit Preisen |
| `content/oeffnungszeiten.ts` | Öffnungszeiten |
| `content/fotos.ts` | Fotos für Hero, Arbeiten und Salon |
| `content/texte.ts` | Hero-Texte, Über-Text, Meta-Beschreibung |
| `content/rechtliches.ts` | Impressum und Datenschutz |

### Fotos einsetzen

Dateien nach `public/fotos/` legen, dann in `content/fotos.ts` eintragen. Ein
Beispiel steht dort als Kommentar. Erwartete Formate:

| Platz | Seitenverhältnis | Mindestbreite | Anzahl |
|---|---|---|---|
| Hero | 3:2 quer | 2000 px | 1 |
| Arbeiten | 3:4 hochkant | 1200 px | 5–8 |
| Salon | 16:9 quer | 1600 px | 1 |

Solange ein Platz leer ist, steht dort ein gerahmter Hinweis mit Format und
Zweck — kein grauer Kasten.

### Offene Stellen

Was noch nicht geliefert wurde, steht als `todo("…")` im Code und erscheint auf
der Seite als roter Balken. `npm run check:content` listet alle offenen Stellen
auf.

**Vor dem Livegang** im Vercel-Projekt `STRICT_CONTENT=1` setzen. Der Build
bricht dann ab, solange irgendwo noch ein Platzhalter steht.

## Umgebungsvariablen

Siehe `.env.example`. Es wird nur `NEXT_PUBLIC_SITE_URL` gebraucht, für
kanonische Adressen, Sitemap und JSON-LD. Kein Mailversand, kein API-Schlüssel.

## Befehle

    npm run dev             Entwicklungsserver
    npm run build           Produktionsbuild, prüft vorher die Inhalte
    npm test                Unit-Tests (Vitest)
    npm run test:e2e        Browser-Tests (Playwright)
    npm run check:content   offene TODO-Marker auflisten
    npm run assets:images   Logo-Ableitungen und OG-Bild neu erzeugen

`npm run test:e2e` startet einen eigenen Produktionsbuild. Läuft parallel schon
`npm run dev` auf Port 3000, verwendet Playwright den Dev-Server — dort
kompiliert Next Routen erst beim ersten Aufruf, was einzelne Tests flackern
lässt. Vor dem Testlauf also den Dev-Server beenden.

## Gestaltung

Streng monochrom auf Schwarz, abgeleitet aus dem Logo (`assets/source/`).
Space Grotesk für Überschriften und Labels, Geist Sans für Fließtext. Keine
Akzentfarbe: Aktionen heben sich über Fläche und Größe ab.

Zwei Stellen, die man beim Weiterbauen leicht kaputtmacht:

- **`color-scheme: dark` in `:root`.** Ohne diese Zeile rendert Chrome seine
  eingebauten Bedienelemente im Hellmodus — Bildlaufleisten, Autofill und
  jedes künftige Formularfeld sähen falsch aus.
- **Elementregeln gehören in `@layer base`, Hilfsklassen in `@layer
  components`.** Ungelayerte Regeln schlagen jede Tailwind-Utility. Nur der
  Fokus-Ring steht bewusst ungelayert, damit ihn nichts überschreibt.

## Rechtliches

Impressum und Datenschutzerklärung sind fachlich sorgfältig auf das abgestimmt,
was diese Seite tatsächlich tut — sie sind aber **keine Rechtsberatung**. Vor
dem Livegang anwaltlich prüfen lassen.

Die Seite bettet nichts von Dritten ein: keine Karte, kein Instagram-Widget,
keine Schriften von fremden Servern, kein Analytics. Deshalb kein
Einwilligungsbanner.

## Bekannte Meldungen

`npm audit` meldet Funde in Paketen **innerhalb** von Next.js
(`next/node_modules/postcss` und `.../sharp`). Der angebotene Fix wäre ein
Downgrade auf Next 9.3.3. Beide sind Build-Zeit-Abhängigkeiten, die hier keine
fremden Eingaben verarbeiten. Sie verschwinden mit dem nächsten Next-Release.
