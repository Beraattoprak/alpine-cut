# Alpine Cut

Website des Friseursalons Alpine Cut, Dorf-Platz 1, 6263 Fügen, Tirol.

## Inhalte ändern

Alles Redaktionelle liegt unter `content/`. TypeScript meldet Tippfehler beim
Build, statt sie live gehen zu lassen.

| Datei | Inhalt |
|---|---|
| `content/salon.ts` | Name, Adresse, Telefon, E-Mail |
| `content/leistungen.ts` | Leistungen mit Preisen |
| `content/team.ts` | Namen und Rollen |
| `content/oeffnungszeiten.ts` | Öffnungszeiten |
| `content/texte.ts` | Hero-Texte, Über-Text, Meta-Beschreibung |
| `content/rechtliches.ts` | Impressum und Datenschutz |

### Offene Stellen

Was noch nicht geliefert wurde, steht als `todo("…")` im Code und erscheint auf
der Seite als roter Balken. `npm run check:content` listet alle offenen Stellen
auf.

**Vor dem Livegang** im Vercel-Projekt `STRICT_CONTENT=1` setzen. Der Build
bricht dann ab, solange irgendwo noch ein Platzhalter steht.

Sobald `content/leistungen.ts` echte Leistungen enthält, wird aus dem freien
Textfeld im Terminformular automatisch eine Auswahlliste daraus.

## Umgebungsvariablen

Siehe `.env.example`. Ohne `RESEND_API_KEY` und `ANFRAGE_EMPFAENGER` zeigt das
Formular eine ehrliche Fehlermeldung mit der Telefonnummer als Ausweg — es
schweigt nicht und tut auch nicht so, als sei etwas versendet worden.

## Befehle

    npm run dev             Entwicklungsserver
    npm run build           Produktionsbuild, prüft vorher die Inhalte
    npm test                Unit-Tests (Vitest)
    npm run test:e2e        Browser-Tests (Playwright)
    npm run check:content   offene TODO-Marker auflisten
    npm run assets:frames   Video -> 145 WebP-Frames (braucht ffmpeg)
    npm run assets:images   Poster, Salonfoto und OG-Bild

## Hero-Animation

Die Maschine zerfällt entlang der Scrollposition und fügt sich beim
Zurückscrollen wieder zusammen. Technisch ist das eine vorgeladene Sequenz aus
145 WebP-Frames auf einem `<canvas>`, kein Video-Scrubbing — das Quellvideo hat
nur einen einzigen Keyframe und wäre zum Seeken unbrauchbar.

Die Rechenlogik liegt als reine Funktionen in `lib/scrub.ts` und ist unter
`lib/__tests__/scrub.test.ts` vollständig getestet, einschließlich der
Umkehrbarkeit.

Kein Scrubbing gibt es unter 768 px Viewportbreite, bei
`prefers-reduced-motion: reduce` und im Datensparmodus. Dort steht ein
statisches Poster, und die 200vh Scrollstrecke entsteht gar nicht erst. In
diesen Fällen wird auch kein einziger Frame geladen.

Zwei Stellen, die man beim Weiterbauen leicht kaputtmacht:

- Die Höhe der Bühne kommt **ausschließlich** aus Media Queries in
  `globals.css`. Setzt man sie per JavaScript, entsteht ein Layout-Shift.
- `data-scrub` wird von einem Inline-Skript im `<head>` gesetzt, vor dem ersten
  Paint. Verschiebt man das nach React, springen die beiden Hero-Textblöcke bei
  der Hydration.

## Rechtliches

Impressum und Datenschutzerklärung sind fachlich sorgfältig auf das abgestimmt,
was diese Seite tatsächlich tut — sie sind aber **keine Rechtsberatung**. Vor
dem Livegang anwaltlich prüfen lassen.

## Bekannte Meldungen

`npm audit` meldet drei Funde in Paketen **innerhalb** von Next.js
(`next/node_modules/postcss` und `.../sharp`). Der angebotene Fix wäre ein
Downgrade auf Next 9.3.3. Beide sind Build-Zeit-Abhängigkeiten, die hier keine
fremden Eingaben verarbeiten. Sie verschwinden mit dem nächsten Next-Release.
