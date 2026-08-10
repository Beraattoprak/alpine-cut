# Alpine Cut — Redesign „Bergkamm"

Datum: 2026-08-10
Status: freigegeben
Ersetzt die Gestaltungsteile von `2026-08-01-alpine-cut-website-design.md`. Inhaltsschicht,
Formular, Rechtsseiten und SEO aus jener Spec bleiben unverändert gültig.

## 1. Anlass

Der Auftraggeber hat das Logo nachgereicht: weiß auf schwarz, geometrische Versalien mit
weiter Sperrung, Bergsilhouette, das U in „CUT" durch eine offene Schere ersetzt. Rein
monochrom.

Damit ist die bisherige Gestaltung hinfällig. Sie war hell, warm und editorial — der
Goldakzent und die Antiqua haben im Logo keine Entsprechung. Zusätzlich empfand der
Auftraggeber die Seite als langweilig.

Ehrliche Ursachenanalyse: Die Seite wirkt vor allem leer, weil **fast nichts drinsteht**.
Preise, Team, Öffnungszeiten und Über-Text sind weiterhin offen, und es gibt genau ein Foto.
Gestaltung kann das abmildern, nicht aufheben. Die Fotoplätze in dieser Spec sind deshalb
der wichtigste Teil.

## 2. Entscheidungen

| Frage | Entscheidung |
|---|---|
| Hintergrund | Schwarz, `#000000` — exakt der Ton des Logos |
| Farbigkeit | Streng monochrom, kein Akzent |
| Hero-Animation | Wird entfernt |
| Fotos | Auftraggeber liefert nach; bis dahin sichtbare Platzhalter |
| Preise | Weiterhin offen, TODO-Marker |
| Instagram | `https://www.instagram.com/alpine.cutz/`, an drei Stellen verlinkt |

## 3. Was entfernt wird

Restlos:

- `components/hero/ScrubCanvas.tsx`, `useFrameSequence.ts`, `useScrubGate.ts`
- `lib/scrub.ts` und `lib/__tests__/scrub.test.ts`
- `public/frames/` — 145 Dateien, 4,2 MB
- `scripts/build-frames.mjs`, `scripts/__tests__/frames.test.ts`
- `e2e/hero.spec.ts`
- `app/diagnose/page.tsx` — war nur Diagnosewerkzeug
- Aus `globals.css`: `@property --p`, `.stage`, `.pin`, `.hero-buehne`, `.hero-rahmen`,
  `.hero-canvas`, sämtliche `data-scrub`- und `data-phase`-Regeln
- Aus `app/layout.tsx`: das Inline-Skript für `data-scrub` samt `suppressHydrationWarning`,
  der Frame-Preload
- `public/clipper-poster.jpg`

Bleibt liegen:

- `assets/source/scroll_effekt.mp4` und `assets/source/clipper_foto.png` — die Originale des
  Auftraggebers. Sie werden nicht ausgeliefert und kosten nichts.

## 4. Farb-Tokens

| Token | Wert | Verwendung | Kontrast auf `--bg` |
|---|---|---|---|
| `--bg` | `#000000` | Grund | — |
| `--bg-2` | `#0D0D0D` | abgesetzte Abschnitte | — |
| `--fg` | `#FFFFFF` | Überschriften, Fließtext | 21,0:1 |
| `--fg-muted` | `#9A9A9A` | Sekundärtext | 7,5:1 |
| `--fg-dim` | `#8A8A8A` | Ziffern, Meta, Labels | 6,1:1 |
| `--line` | `#262626` | Trennlinien | — |

Der Fokus-Ring ist **weiß**, 2 px, 2 px Versatz — auf Schwarz der höchste erreichbare
Kontrast. Es gibt keine Akzentfarbe; Aktionen heben sich über Fläche und Größe ab: der
Termin-Button ist weiß gefüllt mit schwarzer Schrift.

## 5. Typografie

- **Space Grotesk** für Überschriften und Labels. Technisch, eigenwillig, trägt bei großen
  Graden. Ersetzt Instrument Serif vollständig.
- **Geist Sans** für Fließtext, unverändert, self-hosted.

| Rolle | Größe | Zeilenhöhe | Laufweite |
|---|---|---|---|
| Hero | `clamp(3.5rem, 2rem + 8vw, 9rem)` | `0.9` | `-0.04em` |
| H2 | `clamp(2.25rem, 1.4rem + 4vw, 5rem)` | `0.95` | `-0.03em` |
| H3 | `clamp(1.25rem, 1.1rem + 0.8vw, 1.75rem)` | `1.15` | `-0.01em` |
| Lead | `clamp(1.125rem, 1.05rem + 0.4vw, 1.5rem)` | `1.45` | `0` |
| Body | `1.0625rem` | `1.65` | `0` |
| Label, Versalien | `0.75rem` | `1.4` | `0.22em` |

Die Sperrung von `0.22em` bei den Labels greift das „A L P I N E" des Logos auf.

## 6. Gestaltungsmittel gegen die Leere

**Bergkamm.** Die Bergsilhouette wird als handgezeichnetes SVG nachgebaut — nicht aus dem
JPG getract, sondern als eigene, saubere Pfadgrafik im selben Motiv. Einsatz: als
Trennelement zwischen Abschnitten und großflächig in `#0D0D0D` hinter dem Hero.

**Laufband.** Ein waagrecht laufendes Band unter dem Hero mit ausschließlich echten Daten:
`ALPINE CUT · DORF-PLATZ 1 · 6263 FÜGEN · +43 676 6786333 ·`. Reine CSS-Animation,
`animation-play-state: paused` bei `prefers-reduced-motion`. Für Screenreader einmalig
lesbar, die Wiederholungen sind `aria-hidden`.

**Größenkontrast.** Überschriften bis 144 px gegen 17 px Fließtext.

**Einblenden beim Scrollen.** `IntersectionObserver` setzt `data-sichtbar` auf Abschnitte,
CSS übernimmt Deckkraft und eine Verschiebung von 12 px. Einmalig, nicht wiederholt. Bei
reduzierter Bewegung sind alle Abschnitte sofort sichtbar — die Regel greift dann gar nicht,
Inhalt darf nie hinter einer Animation verborgen bleiben.

## 7. Fotoplätze

Neue Datei `content/fotos.ts` mit typisierten Einträgen. Jeder Platz ist `Offen<T>` und zeigt
bis zur Lieferung einen Platzhalter, der Format und Zweck nennt.

| Platz | Seitenverhältnis | Mindestbreite | Zweck |
|---|---|---|---|
| `hero` | 3:2 quer | 2000 px | Salon oder ein starker Schnitt |
| `arbeiten` | 3:4 hoch | 1200 px | 5–8 Schnitte, seitlich scrollend |
| `salon` | 16:9 quer | 1600 px | Innenraum |

Dateien kommen nach `public/fotos/`. Die Platzhalter sind keine grauen Kästen, sondern
gerahmte Flächen mit Formatangabe und Hinweistext, damit die Seite auch ohne Bilder
absichtsvoll aussieht.

## 8. Seitenaufbau

1. **Hero** — Logo, Wortmarke als echte Schrift in großem Grad, eine Zeile Positionierung,
   Adresse und Telefon als gesperrte Versalien, Bergkamm im Hintergrund, Fotoplatz
2. **Laufband**
3. **Arbeiten** — seitlich scrollendes Band aus 3:4-Fotoplätzen, Verweis auf Instagram
4. **Leistungen** — große nummerierte Liste, Preise offen
5. **Salon** — Fotoplatz plus Text, beides offen
6. **Team** — offen
7. **Öffnungszeiten und Anfahrt** — Zeiten offen, Adresse und Telefon vollständig
8. **Terminanfrage** — Formular, auf Schwarz umgestellt

Kopfzeile mit Logo, Sprungmarken und Instagram. Fußzeile mit Logo, Adresse, Telefon,
Instagram, Impressum, Datenschutz.

## 9. Logo als Asset

`logo_alpinecut.jpg` (1024×1024, schwarzer Grund) wandert nach `assets/source/`.
`scripts/build-images.mjs` erzeugt daraus:

- `public/logo.png` — auf den Bildinhalt beschnitten, 512 px breit, für Kopf- und Fußzeile
- `public/logo-gross.png` — 1024 px, für den Hero

Da der Logogrund schwarz ist und die Seite ebenfalls, genügt das JPEG ohne Freistellen. Ein
Alphakanal wäre sauberer, lässt sich aus dieser Vorlage aber nicht verlustfrei gewinnen.

Das Open-Graph-Bild wird neu gebaut: schwarzer Grund, Logo, Wortmarke, Ortsangabe.

## 10. Was unverändert bleibt

Inhaltsschicht mit `todo()`-Markern, `STRICT_CONTENT`, Server Action mit Zod und Resend,
Impressum und Datenschutz, Metadaten, Sitemap, robots, JSON-LD, keine eingebettete Karte,
kein Cookie-Banner, kein Analytics.

## 11. Abnahme

1. `npm run typecheck`, `npm run lint`, `npm test` ohne Fehler
2. `npm run build` erfolgreich, offene Marker im Log
3. Lighthouse mobil, alle vier Werte über 90, gemessen und berichtet
4. Tastaturdurchlauf, Fokus auf Schwarz jederzeit sichtbar
5. 360, 768, 1024, 1440 px ohne horizontales Scrollen
6. `prefers-reduced-motion`: Laufband steht, Abschnitte sofort sichtbar
7. Kein Verweis mehr auf `/frames/` im Netzwerk-Panel
