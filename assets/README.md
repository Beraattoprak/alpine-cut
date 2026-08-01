# Assets

`source/` enthält die unveränderten Originale. Nichts davon wird direkt
ausgeliefert.

| Datei | Herkunft |
|---|---|
| `source/scroll_effekt.mp4` | 1276×720, 24 fps, 145 Frames. **Nur ein Keyframe** — zum Video-Scrubbing unbrauchbar, deshalb die Frame-Sequenz. |
| `source/clipper_foto.png` | 2720×1536, Produktfoto vor hellem Grund (~#FAFBFB). |

Neu erzeugen nach einem Austausch der Quellen:

    npm run assets:frames    # ffmpeg -> public/frames/clip-000..144.webp
    npm run assets:images    # sharp  -> Poster, Salonfoto, OG-Bild

`assets:images` setzt voraus, dass `assets:frames` vorher gelaufen ist: Das
Poster wird aus Frame 0 geschnitten, damit es exakt dem ersten Bild der
Animation entspricht.

## ffmpeg

Wird nicht mitgeliefert. Installation:

    winget install --id Gyan.FFmpeg

WinGet legt die Binary unter `%LOCALAPPDATA%\Microsoft\WinGet\Packages\...` ab
und verlinkt sie nicht immer in den PATH. `build-frames.mjs` sucht deshalb
selbst danach. Notfalls den Pfad ausdrücklich setzen:

    $env:FFMPEG_PFAD = "C:\...\ffmpeg.exe"

## Größen (Stand 2026-08-01)

| Ausgabe | Maße | Größe |
|---|---|---|
| `public/frames/*.webp` | 1276×720 | 4,2 MB für alle 145 (Qualität 92) |
| `public/clipper-poster.jpg` | 1276×720 | 20 KB |
| `public/clipper-foto.jpg` | 1600×904 | 34 KB |

## Auflösung

**1276×720 ist die Obergrenze** — mehr Pixel enthält `scroll_effekt.mp4` nicht.
Der Canvas zeichnet deshalb höchstens 1276 CSS-px breit und begrenzt seinen
Puffer auf die Quellauflösung; hochskalieren würde nur Speicher kosten, ohne ein
Detail hinzuzufügen.

Wer die Animation schärfer will, braucht einen **neuen Export der Quelle** in
höherer Auflösung, idealerweise 2560×1440. Danach genügt es,
`assets/source/scroll_effekt.mp4` zu ersetzen, `npm run assets:frames` und
`npm run assets:images` laufen zu lassen und `BREITE_QUELLE` in
`components/hero/ScrubCanvas.tsx` sowie die `aspect-ratio` von `.hero-rahmen` in
`app/globals.css` anzupassen.

Ändert sich die Frame-Anzahl, muss `FRAME_COUNT` an zwei Stellen mitgezogen
werden: in `scripts/build-frames.mjs` und in `lib/scrub.ts`. Der Test
`scripts/__tests__/frames.test.ts` schlägt sonst fehl.
