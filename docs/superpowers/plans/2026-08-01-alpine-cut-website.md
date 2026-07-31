# Alpine Cut Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Einseitige Website für den Friseursalon Alpine Cut in Fügen mit scroll-gekoppelter Hero-Animation, Terminanfrage-Formular und zwei Rechtsseiten.

**Architecture:** Next.js 15 App Router. Die Hero-Animation zeichnet eine vorgeladene Sequenz aus 145 WebP-Frames auf ein `<canvas>`; die gesamte Rechen-Logik liegt als reine Funktionen in `lib/scrub.ts` und ist ohne Browser testbar. Inhalte liegen als typisierte Konstanten unter `content/`, offene Stellen werden über einen `todo()`-Marker geführt, der im Build gemeldet wird. Das Formular läuft über eine Server Action mit Zod-Validierung und Resend.

**Tech Stack:** Next.js 15, TypeScript strict, Tailwind v4, shadcn/ui, Zod, Resend, Vitest, Playwright, sharp, ffmpeg (einmalig für die Asset-Pipeline).

## Global Constraints

Diese Vorgaben gelten für **jede** Task, auch wenn sie dort nicht wiederholt werden.

- **Spezifikation:** `docs/superpowers/specs/2026-08-01-alpine-cut-website-design.md` ist verbindlich. Bei Widersprüchen gilt die Spec, nicht dieser Plan.
- **Paketmanager:** npm. `pnpm` ist auf dieser Maschine nicht installiert.
- **Node:** v24.16.0 unter `C:\Program Files\nodejs`. Falls eine Shell `node` nicht findet: `$env:Path = "C:\Program Files\nodejs;" + $env:Path`.
- **Git:** Repo unter `C:\Users\beraa\Desktop\alpine-cut`, Branch `master`, Identität ist lokal gesetzt. Es gibt **keine** globale Git-Identität auf dieser Maschine.
- **Sprache aller Nutzertexte:** Deutsch, per Sie, knapp, ohne Werbefloskeln. Bezeichner im Code dürfen deutsch sein, wo sie Fachbegriffe der Domäne sind (`leistungen`, `oeffnungszeiten`); technische Begriffe bleiben englisch.
- **Keine erfundenen Inhalte.** Preise, Namen, Zeiten und die Empfängeradresse werden **nie** ausgedacht. Offene Stellen bekommen `todo("…")`.
- **Feste Daten** (dürfen und sollen eingetragen werden): Name `Alpine Cut`, Adresse `Dorf-Platz 1, 6263 Fügen`, Land `AT`, Region `Tirol`, Telefon `+43 676 6786333`.
- **Farb-Tokens exakt:** `--bg: #FAFAFA`, `--fg: #0F0F0F`, `--fg-muted: #5A5A57`, `--line: #E4E4E1`, `--gold: #8A6620`, `--gold-soft: #C8A159`, `--todo: #B3261E`.
- **Schriften:** Instrument Serif (Display) über `next/font/google`, Geist Sans (Fließtext) über das `geist`-Paket. Nicht Inter, nicht Playfair.
- **Gestaltung:** keine Schatten, keine Farbverläufe, keine gerahmten Karten, `--radius: 2px`.
- **Barrierefreiheit:** sichtbarer `:focus-visible`-Ring 2 px in `--gold` mit 2 px Versatz auf **allen** interaktiven Elementen, semantisches HTML, durchgehende Tastaturbedienung.
- **Bilder:** ausschließlich `next/image` mit gesetzten `width`/`height` oder `fill` plus `sizes`. Kein Layout-Shift.
- **Ab 360 px Viewport** ohne horizontales Scrollen.
- **Commit-Sprache:** Deutsch, ohne Umlaute in der Betreffzeile (die Windows-Shell reicht sie sonst kaputt weiter). Jeder Commit endet mit `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`.

---

## Dateistruktur

Wer legt was an, und wofür ist es zuständig:

| Datei | Zuständigkeit | Task |
|---|---|---|
| `content/todo.ts` | `todo()`-Marker, Typ `Offen<T>`, Sammlung offener Hinweise | 2 |
| `content/types.ts` | alle Inhaltstypen an einer Stelle | 2 |
| `content/salon.ts` | Name, Adresse, Telefon, E-Mail | 2 |
| `content/leistungen.ts` | Kategorien mit Positionen und Preisen | 2 |
| `content/team.ts` | Namen und Rollen | 2 |
| `content/oeffnungszeiten.ts` | Wochentage mit Zeiträumen | 2 |
| `content/texte.ts` | Hero-Headlines, Über-Text, Formularbeschriftungen | 2 |
| `content/rechtliches.ts` | Impressum, Datenschutz | 10 |
| `content/index.ts` | Re-Export für den Content-Check | 2 |
| `components/Offen.tsx` | rendert Wert **oder** sichtbaren TODO-Balken | 2 |
| `scripts/check-content.ts` | listet offene Marker, bricht bei `STRICT_CONTENT=1` ab | 2 |
| `app/globals.css` | Tokens, `@theme inline`, Bühnen-CSS, `@property --p` | 3 |
| `app/layout.tsx` | Schriften, Metadata-Basis, Skip-Link, JSON-LD | 3, 9 |
| `components/SiteHeader.tsx` | Wortmarke, Sprungmarken | 3 |
| `components/SiteFooter.tsx` | Adresse, Telefon, Rechtslinks | 3 |
| `components/SectionHeading.tsx` | Eyebrow + H2, einheitlich | 3 |
| `scripts/build-frames.mjs` | ffmpeg → `public/frames/clip-NNN.webp` | 4 |
| `scripts/build-images.mjs` | sharp → Poster, Salonfoto, OG-Bild | 4 |
| `lib/scrub.ts` | **reine Funktionen** der Scroll-Mathematik | 5 |
| `components/hero/useFrameSequence.ts` | lädt und dekodiert die Frames | 6 |
| `components/hero/useScrubGate.ts` | entscheidet, ob gescrubbt wird | 6 |
| `components/hero/ScrubCanvas.tsx` | rAF-Loop, Canvas, `--p`, `data-phase` | 6 |
| `components/hero/Hero.tsx` | Bühne, Poster, beide Textblöcke | 6 |
| `components/sections/Leistungen.tsx` | Abschnitt 2 | 7 |
| `components/sections/UeberDenSalon.tsx` | Abschnitt 3 | 7 |
| `components/sections/Team.tsx` | Abschnitt 4 | 7 |
| `components/sections/OeffnungszeitenAnfahrt.tsx` | Abschnitt 5 | 7 |
| `lib/schema.ts` | Zod-Schema der Terminanfrage | 8 |
| `lib/resend.ts` | Resend-Client und Mailtext | 8 |
| `app/actions/terminanfrage.ts` | Server Action | 8 |
| `components/sections/Terminanfrage.tsx` | Formular-UI | 8 |
| `lib/site.ts` | `SITE_URL`, Metadata-Defaults | 9 |
| `lib/jsonld.ts` | `HairSalon`-JSON-LD aus `content/` | 9 |
| `app/sitemap.ts`, `app/robots.ts` | Sitemap und robots.txt | 9 |
| `app/impressum/page.tsx`, `app/datenschutz/page.tsx` | Rechtsseiten | 10 |

---

### Task 1: Grundgerüst, Abhängigkeiten, Testlauf

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `.gitignore`, `vitest.config.ts`, `playwright.config.ts`, `.env.example`
- Move: `clipper_foto.png` → `assets/source/clipper_foto.png`, `scroll_effekt.mp4` → `assets/source/scroll_effekt.mp4`
- Test: `lib/__tests__/setup.test.ts`

**Interfaces:**
- Consumes: nichts
- Produces: lauffähiges Next-Projekt; npm-Skripte `dev`, `build`, `test`, `test:e2e`, `check:content`; Pfad-Alias `@/*` auf das Projektwurzelverzeichnis

- [ ] **Step 1: Assets aus dem Weg räumen**

`create-next-app` verweigert nicht-leere Verzeichnisse. Die Quelldateien wandern zuerst weg:

```powershell
$r = "C:\Users\beraa\Desktop\alpine-cut"
New-Item -ItemType Directory -Force "$r\assets\source" | Out-Null
Move-Item "$r\clipper_foto.png"  "$r\assets\source\clipper_foto.png"
Move-Item "$r\scroll_effekt.mp4" "$r\assets\source\scroll_effekt.mp4"
Get-ChildItem "$r\assets\source"
```

Erwartet: beide Dateien liegen unter `assets\source`.

- [ ] **Step 2: In ein temporäres Verzeichnis scaffolden**

```powershell
$tmp = "$env:TEMP\alpine-scaffold"
Remove-Item -Recurse -Force $tmp -ErrorAction SilentlyContinue
npx --yes create-next-app@15 $tmp --ts --app --tailwind --eslint --no-src-dir --import-alias "@/*" --use-npm --turbopack
```

Erwartet: Scaffold läuft durch, `$tmp\package.json` existiert.

- [ ] **Step 3: Scaffold ins Repo übernehmen**

```powershell
$r = "C:\Users\beraa\Desktop\alpine-cut"
$tmp = "$env:TEMP\alpine-scaffold"
Get-ChildItem $tmp -Force | Where-Object { $_.Name -notin @('.git','node_modules') } |
  ForEach-Object { Copy-Item $_.FullName -Destination $r -Recurse -Force }
Remove-Item -Recurse -Force $tmp
cd $r; npm install
```

Prüfen, dass Tailwind v4 verwendet wird:

```powershell
node -e "console.log(require('./package.json').devDependencies.tailwindcss)"
```

Erwartet: eine `4.x`-Version. Steht dort `3.x`, dann `npm install -D tailwindcss@4 @tailwindcss/postcss@4` und `postcss.config.mjs` auf `{ plugins: { '@tailwindcss/postcss': {} } }` umstellen.

- [ ] **Step 4: Laufzeit- und Entwicklungsabhängigkeiten installieren**

```powershell
npm install zod resend geist
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @playwright/test sharp tsx
npx playwright install chromium
```

- [ ] **Step 5: shadcn/ui einrichten**

```powershell
npx --yes shadcn@latest init -d
npx --yes shadcn@latest add button input label select
```

Erwartet: `components/ui/button.tsx`, `input.tsx`, `label.tsx`, `select.tsx` und `lib/utils.ts` existieren.

- [ ] **Step 6: Vitest konfigurieren**

`vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['**/__tests__/**/*.test.{ts,tsx}'],
    exclude: ['node_modules', 'e2e', '.next'],
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, '.') },
  },
})
```

- [ ] **Step 7: Playwright konfigurieren**

`playwright.config.ts`:

```ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  reporter: 'list',
  use: { baseURL: 'http://localhost:3000', trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'mobil', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: 'npm run build && npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
})
```

- [ ] **Step 8: npm-Skripte ergänzen**

In `package.json` den `scripts`-Block ersetzen durch:

```json
{
  "dev": "next dev --turbopack",
  "prebuild": "npm run check:content",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "typecheck": "tsc --noEmit",
  "test": "vitest run",
  "test:watch": "vitest",
  "test:e2e": "playwright test",
  "check:content": "tsx scripts/check-content.ts",
  "assets:frames": "node scripts/build-frames.mjs",
  "assets:images": "node scripts/build-images.mjs"
}
```

`prebuild` zeigt zunächst auf ein Skript, das erst in Task 2 entsteht. Damit `npm run build` in dieser Task nicht bricht, wird `scripts/check-content.ts` hier als Einzeiler angelegt und in Task 2 ausgebaut:

```ts
// scripts/check-content.ts — wird in Task 2 ersetzt
console.log('Content-Check: noch nicht eingerichtet.')
```

- [ ] **Step 9: `.gitignore` ergänzen**

An `.gitignore` anhängen:

```
# Umgebung
.env
.env.local

# Testartefakte
/test-results
/playwright-report
/blob-report

# Zwischenstand der Asset-Pipeline
/assets/tmp
```

`public/frames/` wird **nicht** ignoriert — Vercel braucht die Frames im Build.

- [ ] **Step 10: `.env.example` anlegen**

```
# Resend, https://resend.com/api-keys
RESEND_API_KEY=

# Empfaenger der Terminanfragen — TODO: echte Adresse des Salons eintragen
ANFRAGE_EMPFAENGER=

# Absender; muss eine bei Resend verifizierte Domain sein.
# Zum Testen funktioniert onboarding@resend.dev
ANFRAGE_ABSENDER=onboarding@resend.dev

# Ohne fuehrenden Slash, mit Protokoll
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Auf 1 setzen, sobald die Seite oeffentlich geht:
# der Build bricht dann bei offenen TODO-Markern ab
STRICT_CONTENT=
```

- [ ] **Step 11: Schreibe den fehlschlagenden Test**

`lib/__tests__/setup.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { cn } from '@/lib/utils'

describe('Projektgrundgerüst', () => {
  it('löst den @-Alias auf und lädt die shadcn-Hilfsfunktion', () => {
    expect(cn('a', false && 'b', 'c')).toBe('a c')
  })
})
```

- [ ] **Step 12: Test laufen lassen**

Run: `npm test`
Expected: PASS. Schlägt er mit „Cannot find module '@/lib/utils'" fehl, wurde shadcn in Step 5 nicht sauber initialisiert — dort nachbessern.

- [ ] **Step 13: Build und Typecheck prüfen**

Run: `npm run typecheck` — Expected: keine Ausgabe, Exit 0.
Run: `npm run build` — Expected: erfolgreicher Build, in der Ausgabe steht `Content-Check: noch nicht eingerichtet.`

- [ ] **Step 14: Commit**

```bash
git add -A
git commit -m "Grundgeruest: Next 15, Tailwind v4, shadcn, Vitest, Playwright

Assets nach assets/source verschoben, npm-Skripte und Testinfrastruktur
stehen. check-content ist ein Platzhalter und wird in Task 2 ersetzt.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 2: Inhaltsschicht und TODO-Marker

**Files:**
- Create: `content/todo.ts`, `content/types.ts`, `content/salon.ts`, `content/leistungen.ts`, `content/team.ts`, `content/oeffnungszeiten.ts`, `content/texte.ts`, `content/index.ts`, `components/Offen.tsx`
- Modify: `scripts/check-content.ts` (ersetzt den Platzhalter aus Task 1)
- Test: `content/__tests__/todo.test.ts`

**Interfaces:**
- Consumes: nichts
- Produces:
  - `todo(hinweis: string): Todo`
  - `istOffen<T>(wert: Offen<T>): wert is Todo`
  - `offeneHinweise(): readonly string[]`
  - Typ `Offen<T> = T | Todo`
  - Komponente `<Offen wert={…}>{(w) => …}</Offen>`
  - Konstanten `salon`, `leistungen`, `team`, `oeffnungszeiten`, `texte`

- [ ] **Step 1: Schreibe den fehlschlagenden Test**

`content/__tests__/todo.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { istOffen, offeneHinweise, todo } from '@/content/todo'

describe('todo-Marker', () => {
  it('erkennt einen Marker als offen', () => {
    expect(istOffen(todo('Preise eintragen'))).toBe(true)
  })

  it('erkennt echte Werte als nicht offen', () => {
    expect(istOffen('Damenhaarschnitt')).toBe(false)
    expect(istOffen(0)).toBe(false)
    expect(istOffen(null as unknown as string)).toBe(false)
    expect(istOffen([])).toBe(false)
  })

  it('sammelt jeden angelegten Hinweis', () => {
    const vorher = offeneHinweise().length
    todo('Team ergaenzen')
    todo('Oeffnungszeiten ergaenzen')
    expect(offeneHinweise().length).toBe(vorher + 2)
    expect(offeneHinweise()).toContain('Team ergaenzen')
  })

  it('traegt den Hinweistext im Marker', () => {
    const m = todo('Telefonnummer pruefen')
    expect(istOffen(m) && m.hinweis).toBe('Telefonnummer pruefen')
  })
})
```

- [ ] **Step 2: Test laufen lassen, Fehlschlag bestätigen**

Run: `npx vitest run content/__tests__/todo.test.ts`
Expected: FAIL mit „Failed to resolve import '@/content/todo'".

- [ ] **Step 3: `content/todo.ts` schreiben**

```ts
const MARKER = Symbol.for('alpine-cut.todo')

export type Todo = { readonly [MARKER]: true; readonly hinweis: string }

/** Ein Wert, der noch nicht vom Salon geliefert wurde. */
export type Offen<T> = T | Todo

const gesammelt: string[] = []

/** Markiert eine offene Inhaltsstelle. Erfindet nichts, meldet sich im Build. */
export function todo(hinweis: string): Todo {
  gesammelt.push(hinweis)
  return { [MARKER]: true, hinweis }
}

export function istOffen<T>(wert: Offen<T>): wert is Todo {
  return typeof wert === 'object' && wert !== null && MARKER in wert
}

export function offeneHinweise(): readonly string[] {
  return gesammelt
}
```

- [ ] **Step 4: Test laufen lassen**

Run: `npx vitest run content/__tests__/todo.test.ts`
Expected: PASS, 4 Tests.

- [ ] **Step 5: Inhaltstypen schreiben**

`content/types.ts`:

```ts
import type { Offen } from './todo'

export type Salon = {
  name: string
  strasse: string
  plz: string
  ort: string
  region: string
  land: string
  telefon: string
  telefonHref: string
  email: Offen<string>
}

export type Leistung = { bezeichnung: string; preis: string; hinweis?: string }
export type Leistungskategorie = { titel: string; leistungen: Leistung[] }
export type Teammitglied = { name: string; rolle: string }

export type Wochentag =
  | 'Montag' | 'Dienstag' | 'Mittwoch' | 'Donnerstag'
  | 'Freitag' | 'Samstag' | 'Sonntag'

/** `zeiten: null` bedeutet geschlossen. */
export type Oeffnungstag = { tag: Wochentag; zeiten: string | null }

export type Texte = {
  heroHeadline: string
  heroUnterzeile: string
  heroZweiterBlock: string
  heroZweiteUnterzeile: string
  ueberDenSalon: Offen<string>
  metaBeschreibung: Offen<string>
}
```

- [ ] **Step 6: Inhaltsdateien schreiben**

`content/salon.ts` — hier stehen die vom Kunden gelieferten Daten:

```ts
import type { Salon } from './types'
import { todo } from './todo'

export const salon: Salon = {
  name: 'Alpine Cut',
  strasse: 'Dorf-Platz 1',
  plz: '6263',
  ort: 'Fügen',
  region: 'Tirol',
  land: 'AT',
  telefon: '+43 676 6786333',
  telefonHref: 'tel:+436766786333',
  email: todo('E-Mail-Adresse des Salons eintragen — auch Empfänger der Terminanfragen'),
}
```

`content/leistungen.ts`:

```ts
import type { Leistungskategorie } from './types'
import { type Offen, todo } from './todo'

export const leistungen: Offen<Leistungskategorie[]> = todo(
  'Leistungen mit Preisen eintragen, z. B. { titel: "Damen", leistungen: [{ bezeichnung: "Schnitt", preis: "45 €" }] }',
)
```

`content/team.ts`:

```ts
import type { Teammitglied } from './types'
import { type Offen, todo } from './todo'

export const team: Offen<Teammitglied[]> = todo(
  'Team eintragen: Namen und Rollen, z. B. { name: "…", rolle: "Inhaberin" }',
)
```

`content/oeffnungszeiten.ts`:

```ts
import type { Oeffnungstag } from './types'
import { type Offen, todo } from './todo'

export const oeffnungszeiten: Offen<Oeffnungstag[]> = todo(
  'Öffnungszeiten eintragen: für jeden Wochentag { tag: "Montag", zeiten: "09:00–18:00" } oder zeiten: null für geschlossen',
)
```

`content/texte.ts` — die Hero-Texte sind bewusst gesetzt, sie beschreiben die Animation und erfinden keine Betriebsangaben:

```ts
import type { Texte } from './types'
import { todo } from './todo'

export const texte: Texte = {
  heroHeadline: 'Alpine Cut',
  heroUnterzeile: 'Friseur in Fügen, Tirol.',
  heroZweiterBlock: 'Bis ins letzte Teil.',
  heroZweiteUnterzeile: 'Werkzeug, das gepflegt wird. Arbeit, die man sieht.',
  ueberDenSalon: todo('Über den Salon: zwei bis drei Sätze eintragen'),
  metaBeschreibung: todo('Meta-Beschreibung eintragen, 140–160 Zeichen, ohne Werbefloskeln'),
}
```

`content/index.ts`:

```ts
export { salon } from './salon'
export { leistungen } from './leistungen'
export { team } from './team'
export { oeffnungszeiten } from './oeffnungszeiten'
export { texte } from './texte'
export { istOffen, offeneHinweise, todo } from './todo'
export type { Offen, Todo } from './todo'
export type * from './types'
```

- [ ] **Step 7: `components/Offen.tsx` schreiben**

```tsx
import type { ReactNode } from 'react'
import { istOffen, type Offen as OffenTyp } from '@/content/todo'

export function TodoMarker({ hinweis }: { hinweis: string }) {
  return (
    <span role="note" className="todo-marker" data-todo>
      TODO: {hinweis}
    </span>
  )
}

/**
 * Rendert den Inhalt, sobald er vorliegt — sonst einen sichtbaren TODO-Balken.
 * Erfindet unter keinen Umständen einen Ersatzwert.
 */
export function Offen<T>({
  wert,
  children,
}: {
  wert: OffenTyp<T>
  children: (wert: T) => ReactNode
}) {
  if (istOffen(wert)) return <TodoMarker hinweis={wert.hinweis} />
  return <>{children(wert)}</>
}
```

- [ ] **Step 8: `scripts/check-content.ts` ersetzen**

```ts
import '../content/index'
import { offeneHinweise } from '../content/todo'

const offen = offeneHinweise()
const streng = process.env.STRICT_CONTENT === '1'

if (offen.length === 0) {
  console.log('Content-Check: keine offenen Stellen.')
  process.exit(0)
}

console.log(`\nContent-Check: ${offen.length} offene Stelle(n):`)
for (const hinweis of offen) console.log(`  · ${hinweis}`)

if (streng) {
  console.error(
    '\nSTRICT_CONTENT=1 ist gesetzt: Der Build wird abgebrochen, ' +
      'damit keine Platzhalter oeffentlich gehen.\n',
  )
  process.exit(1)
}

console.log('\nDer Build laeuft weiter. Die Marker sind auf der Seite sichtbar.')
console.log('Vor dem Livegang STRICT_CONTENT=1 setzen.\n')
```

- [ ] **Step 9: Beide Modi des Content-Checks prüfen**

Run: `npm run check:content`
Expected: Exit 0, Liste mit sechs offenen Stellen (E-Mail, Leistungen, Team, Öffnungszeiten, Über-Text, Meta-Beschreibung).

Run (PowerShell): `$env:STRICT_CONTENT="1"; npm run check:content; $env:STRICT_CONTENT=""`
Expected: Exit 1 mit der Abbruchmeldung.

- [ ] **Step 10: Gesamte Testsuite und Typecheck**

Run: `npm test` — Expected: PASS.
Run: `npm run typecheck` — Expected: Exit 0.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "Inhaltsschicht mit typisierten Konstanten und TODO-Markern

Gelieferte Daten (Name, Adresse, Telefon) sind eingetragen. Alles
Offene laeuft ueber todo() und wird vom Content-Check gemeldet;
STRICT_CONTENT=1 bricht den Build ab.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 3: Design-Tokens, Schriften, Seitenrahmen

**Files:**
- Modify: `app/globals.css` (vollständig ersetzen), `app/layout.tsx` (vollständig ersetzen), `app/page.tsx` (vorläufiger Rumpf)
- Create: `components/SiteHeader.tsx`, `components/SiteFooter.tsx`, `components/SectionHeading.tsx`, `e2e/rahmen.spec.ts`
- Test: `e2e/rahmen.spec.ts`

**Interfaces:**
- Consumes: `salon` aus Task 2
- Produces: CSS-Variablen `--bg --fg --fg-muted --line --gold --gold-soft --todo`, Utility-Klassen `.container-seite`, `.eyebrow`, `.todo-marker`, `.stage`, `.pin`; Komponenten `<SiteHeader />`, `<SiteFooter />`, `<SectionHeading eyebrow nummer titel id />`

- [ ] **Step 1: Schreibe den fehlschlagenden Test**

`e2e/rahmen.spec.ts`:

```ts
import { expect, test } from '@playwright/test'

test('Seitengrund trifft den Ton des Bildmaterials', async ({ page }) => {
  await page.goto('/')
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor)
  expect(bg).toBe('rgb(250, 250, 250)')
})

test('Skip-Link ist der erste Fokus und springt zum Hauptinhalt', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('Tab')
  const link = page.locator(':focus')
  await expect(link).toHaveText(/Zum Inhalt springen/)
  await expect(link).toBeVisible()
  await expect(link).toHaveAttribute('href', '#inhalt')
})

test('jedes interaktive Element zeigt einen sichtbaren Fokus-Ring in Gold', async ({ page }) => {
  await page.goto('/')
  const ziele = page.locator('a, button, input, select')
  const anzahl = await ziele.count()
  expect(anzahl).toBeGreaterThan(0)
  for (let i = 0; i < anzahl; i++) {
    const el = ziele.nth(i)
    if (!(await el.isVisible())) continue
    await el.focus()
    const stil = await el.evaluate((n) => {
      const s = getComputedStyle(n)
      return { breite: s.outlineWidth, farbe: s.outlineColor, stil: s.outlineStyle }
    })
    expect(stil.stil).not.toBe('none')
    expect(parseFloat(stil.breite)).toBeGreaterThanOrEqual(2)
    expect(stil.farbe).toBe('rgb(138, 102, 32)')
  }
})

test('Fußzeile nennt Adresse und Telefon und verlinkt beide Rechtsseiten', async ({ page }) => {
  await page.goto('/')
  const fuss = page.getByRole('contentinfo')
  await expect(fuss).toContainText('Dorf-Platz 1')
  await expect(fuss).toContainText('6263 Fügen')
  await expect(fuss.getByRole('link', { name: '+43 676 6786333' })).toHaveAttribute('href', 'tel:+436766786333')
  await expect(fuss.getByRole('link', { name: 'Impressum' })).toBeVisible()
  await expect(fuss.getByRole('link', { name: 'Datenschutz' })).toBeVisible()
})

test('kein horizontales Scrollen ab 360 px', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 })
  await page.goto('/')
  const ueberstand = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  expect(ueberstand).toBeLessThanOrEqual(0)
})
```

- [ ] **Step 2: Test laufen lassen, Fehlschlag bestätigen**

Run: `npx playwright test e2e/rahmen.spec.ts --project=desktop`
Expected: FAIL — der Seitengrund ist noch weiß und es gibt keinen Skip-Link.

- [ ] **Step 3: `app/globals.css` schreiben**

```css
@import "tailwindcss";

@property --p {
  syntax: "<number>";
  inherits: true;
  initial-value: 0;
}

:root {
  --bg: #FAFAFA;
  --fg: #0F0F0F;
  --fg-muted: #5A5A57;
  --line: #E4E4E1;
  --gold: #8A6620;
  --gold-soft: #C8A159;
  --todo: #B3261E;
  --radius: 2px;

  --schrift-display: var(--font-instrument-serif), Georgia, serif;
  --schrift-sans: var(--font-geist-sans), system-ui, sans-serif;

  --mass-hero: clamp(3rem, 1.6rem + 6.2vw, 7.5rem);
  --mass-h2: clamp(2rem, 1.2rem + 3.4vw, 3.5rem);
  --mass-h3: clamp(1.25rem, 1.1rem + 0.7vw, 1.625rem);
  --mass-lead: clamp(1.125rem, 1.05rem + 0.35vw, 1.375rem);
  --mass-body: 1.0625rem;
  --mass-meta: 0.8125rem;

  --abschnitt: clamp(5rem, 10vw, 9rem);
  --gasse: clamp(1.25rem, 5vw, 4rem);
}

@theme inline {
  --color-bg: var(--bg);
  --color-fg: var(--fg);
  --color-fg-muted: var(--fg-muted);
  --color-line: var(--line);
  --color-gold: var(--gold);
  --color-gold-soft: var(--gold-soft);
  --font-display: var(--schrift-display);
  --font-sans: var(--schrift-sans);
}

* { min-width: 0; }

html {
  scroll-behavior: smooth;
  -webkit-text-size-adjust: 100%;
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

body {
  background: var(--bg);
  color: var(--fg);
  font-family: var(--schrift-sans);
  font-size: var(--mass-body);
  line-height: 1.6;
  overflow-x: hidden;
}

h1, h2, h3 {
  font-family: var(--schrift-display);
  font-weight: 400;
  text-wrap: balance;
}

h1 { font-size: var(--mass-hero); line-height: 0.95; letter-spacing: -0.02em; }
h2 { font-size: var(--mass-h2);  line-height: 1.05; letter-spacing: -0.015em; }
h3 { font-size: var(--mass-h3);  line-height: 1.2;  letter-spacing: -0.01em; }

p { text-wrap: pretty; }

a { color: var(--gold); text-underline-offset: 0.2em; }

:focus-visible {
  outline: 2px solid var(--gold);
  outline-offset: 2px;
  border-radius: 1px;
}

.container-seite {
  width: 100%;
  max-width: 1200px;
  margin-inline: auto;
  padding-inline: var(--gasse);
}

.eyebrow {
  font-size: var(--mass-meta);
  line-height: 1.4;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--fg-muted);
}

.lead { font-size: var(--mass-lead); line-height: 1.5; }

.todo-marker {
  display: inline-block;
  padding: 0.15em 0.5em;
  border: 1px solid var(--todo);
  color: var(--todo);
  font-family: var(--schrift-sans);
  font-size: var(--mass-meta);
  letter-spacing: 0.04em;
  text-transform: none;
  background: color-mix(in srgb, var(--todo) 6%, transparent);
}

.skip-link {
  position: absolute;
  left: var(--gasse);
  top: 0;
  transform: translateY(-120%);
  z-index: 50;
  background: var(--bg);
  color: var(--fg);
  padding: 0.75rem 1rem;
  border: 1px solid var(--line);
  transition: transform 120ms ease-out;
}
.skip-link:focus-visible { transform: translateY(0.5rem); }

/* Hero-Bühne. Die Höhe bestimmt CSS, nie JavaScript — siehe Spec 6.1. */
.stage { position: relative; height: 100svh; }
.stage > .pin { position: sticky; top: 0; height: 100svh; }

@media (min-width: 768px) and (prefers-reduced-motion: no-preference) {
  .stage { height: calc(100svh + 200vh); }
}
```

- [ ] **Step 4: `app/layout.tsx` schreiben**

```tsx
import type { Metadata } from 'next'
import { Instrument_Serif } from 'next/font/google'
import { GeistSans } from 'geist/font/sans'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import './globals.css'

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-instrument-serif',
})

export const metadata: Metadata = {
  title: 'Alpine Cut',
  description: 'Friseur in Fügen, Tirol.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${instrumentSerif.variable} ${GeistSans.variable}`}>
      <body>
        <a className="skip-link" href="#inhalt">Zum Inhalt springen</a>
        <SiteHeader />
        <main id="inhalt">{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}
```

Hinweis: `GeistSans.variable` setzt `--font-geist-sans`, worauf `globals.css` bereits zeigt.

- [ ] **Step 5: `components/SiteHeader.tsx` schreiben**

```tsx
import { salon } from '@/content'

const sprungmarken = [
  { id: 'leistungen', text: 'Leistungen' },
  { id: 'salon', text: 'Salon' },
  { id: 'team', text: 'Team' },
  { id: 'zeiten', text: 'Zeiten' },
  { id: 'termin', text: 'Termin' },
]

export function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <div className="container-seite flex items-baseline justify-between py-6">
        <a href="#inhalt" className="font-display text-xl tracking-tight text-fg no-underline">
          {salon.name}
        </a>
        <nav aria-label="Abschnitte">
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            {sprungmarken.map((m) => (
              <li key={m.id}>
                <a href={`#${m.id}`} className="eyebrow text-fg-muted no-underline hover:text-fg">
                  {m.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
```

- [ ] **Step 6: `components/SiteFooter.tsx` schreiben**

```tsx
import { salon } from '@/content'

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="container-seite flex flex-col gap-8 py-12 sm:flex-row sm:justify-between">
        <address className="not-italic">
          <p className="font-display text-xl">{salon.name}</p>
          <p className="text-fg-muted">{salon.strasse}</p>
          <p className="text-fg-muted">{salon.plz} {salon.ort}</p>
          <p className="mt-2">
            <a href={salon.telefonHref}>{salon.telefon}</a>
          </p>
        </address>
        <nav aria-label="Rechtliches">
          <ul className="flex gap-5">
            <li><a href="/impressum">Impressum</a></li>
            <li><a href="/datenschutz">Datenschutz</a></li>
          </ul>
        </nav>
      </div>
    </footer>
  )
}
```

- [ ] **Step 7: `components/SectionHeading.tsx` schreiben**

```tsx
export function SectionHeading({
  id,
  nummer,
  eyebrow,
  titel,
}: {
  id: string
  nummer: string
  eyebrow: string
  titel: string
}) {
  return (
    <div className="mb-12 flex flex-col gap-3">
      <p className="eyebrow">
        <span className="text-gold-soft">{nummer}</span> <span className="ml-2">{eyebrow}</span>
      </p>
      <h2 id={`${id}-titel`}>{titel}</h2>
    </div>
  )
}
```

- [ ] **Step 8: Vorläufigen `app/page.tsx` schreiben**

Damit der Rahmen-Test etwas zu prüfen hat, bevor die Abschnitte existieren:

```tsx
export default function Startseite() {
  return (
    <div className="container-seite py-[var(--abschnitt)]">
      <h1>Alpine Cut</h1>
      <p className="lead mt-6 max-w-prose text-fg-muted">Friseur in Fügen, Tirol.</p>
    </div>
  )
}
```

- [ ] **Step 9: Test laufen lassen**

Run: `npx playwright test e2e/rahmen.spec.ts`
Expected: PASS in beiden Projekten (`desktop` und `mobil`), 5 Tests je Projekt.

Häufige Fehlerursache: Der Fokus-Ring-Test schlägt bei shadcn-Komponenten fehl, weil deren Standardklassen `outline-none` setzen und stattdessen einen `ring` verwenden. In `components/ui/*.tsx` die `focus-visible:ring-*`- und `outline-none`-Klassen entfernen; der globale `:focus-visible`-Stil aus `globals.css` übernimmt.

- [ ] **Step 10: Typecheck und Build**

Run: `npm run typecheck` — Expected: Exit 0.
Run: `npm run build` — Expected: erfolgreich, Content-Check listet die sechs offenen Stellen.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "Design-Tokens, Schriften und Seitenrahmen

Farb- und Typo-Tokens als CSS-Variablen, Instrument Serif und Geist
selbst gehostet, Kopf- und Fusszeile, Skip-Link, globaler Fokus-Ring.
Buehnen-CSS steht bereits, Hoehe kommt ausschliesslich aus Media Queries.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 4: Asset-Pipeline

**Files:**
- Create: `scripts/build-frames.mjs`, `scripts/build-images.mjs`, `assets/README.md`
- Generate: `public/frames/clip-000.webp` … `clip-144.webp`, `public/clipper-poster.jpg`, `public/clipper-foto.jpg`
- Test: `scripts/__tests__/frames.test.ts`

**Interfaces:**
- Consumes: `assets/source/scroll_effekt.mp4`, `assets/source/clipper_foto.png`
- Produces: 145 Dateien nach dem Muster `clip-%03d.webp` in `public/frames/`, `public/clipper-poster.jpg`, `public/clipper-foto.jpg`. Die Konstante `FRAME_COUNT` und die Funktion `pfadFuerFrame` existieren in `scripts/build-frames.mjs` **und** in `lib/scrub.ts` (Task 5) getrennt — das Skript läuft in Node ohne Bundler, die Bibliothek im Browser. Ändert sich die Frame-Anzahl, müssen beide Stellen angefasst werden; der Test aus Step 2 schlägt sonst fehl.

- [ ] **Step 1: ffmpeg installieren**

```powershell
winget install --id Gyan.FFmpeg --accept-package-agreements --accept-source-agreements
```

Danach **neue Shell öffnen** und prüfen:

```powershell
ffmpeg -version
```

Expected: Versionsausgabe. Findet die Shell `ffmpeg` nicht, liegt die Binary unter `$env:LOCALAPPDATA\Microsoft\WinGet\Links\ffmpeg.exe` — diesen Pfad in den Skripten über die Umgebungsvariable `FFMPEG_PFAD` setzbar machen (siehe Step 4).

- [ ] **Step 2: Schreibe den fehlschlagenden Test**

`scripts/__tests__/frames.test.ts`:

```ts
import { existsSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const FRAME_COUNT = 145
const ordner = path.resolve(__dirname, '../../public/frames')

describe('Frame-Sequenz', () => {
  it('enthält exakt 145 WebP-Dateien', () => {
    expect(existsSync(ordner)).toBe(true)
    const dateien = readdirSync(ordner).filter((d) => d.endsWith('.webp'))
    expect(dateien.length).toBe(FRAME_COUNT)
  })

  it('ist lückenlos von clip-000 bis clip-144 durchnummeriert', () => {
    for (let i = 0; i < FRAME_COUNT; i++) {
      const name = `clip-${String(i).padStart(3, '0')}.webp`
      expect(existsSync(path.join(ordner, name)), `${name} fehlt`).toBe(true)
    }
  })

  it('enthält keine leeren Dateien', () => {
    for (const datei of readdirSync(ordner).filter((d) => d.endsWith('.webp'))) {
      expect(statSync(path.join(ordner, datei)).size).toBeGreaterThan(1000)
    }
  })

  it('bleibt in der Summe unter 8 MB', () => {
    const summe = readdirSync(ordner)
      .filter((d) => d.endsWith('.webp'))
      .reduce((s, d) => s + statSync(path.join(ordner, d)).size, 0)
    expect(summe).toBeLessThan(8 * 1024 * 1024)
  })

  it('liefert Poster und Salonfoto', () => {
    const pub = path.resolve(__dirname, '../../public')
    expect(existsSync(path.join(pub, 'clipper-poster.jpg'))).toBe(true)
    expect(existsSync(path.join(pub, 'clipper-foto.jpg'))).toBe(true)
  })
})
```

- [ ] **Step 3: Test laufen lassen, Fehlschlag bestätigen**

Run: `npx vitest run scripts/__tests__/frames.test.ts`
Expected: FAIL — `public/frames` existiert nicht.

- [ ] **Step 4: `scripts/build-frames.mjs` schreiben**

```js
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const quelle = path.join(wurzel, 'assets/source/scroll_effekt.mp4')
const ziel = path.join(wurzel, 'public/frames')
const ffmpeg = process.env.FFMPEG_PFAD ?? 'ffmpeg'

export const FRAME_COUNT = 145
export const pfadFuerFrame = (i) => `/frames/clip-${String(i).padStart(3, '0')}.webp`

if (!existsSync(quelle)) {
  console.error(`Quelle fehlt: ${quelle}`)
  process.exit(1)
}

rmSync(ziel, { recursive: true, force: true })
mkdirSync(ziel, { recursive: true })

// -an  : Tonspur verwerfen, sie wird nie abgespielt
// -vsync 0 : jeden Frame genau einmal ausgeben, kein Doppeln oder Auslassen
execFileSync(
  ffmpeg,
  [
    '-i', quelle,
    '-an',
    '-vsync', '0',
    '-c:v', 'libwebp',
    '-quality', '80',
    '-compression_level', '6',
    '-preset', 'picture',
    path.join(ziel, 'clip-%03d.webp'),
  ],
  { stdio: 'inherit' },
)

const erzeugt = readdirSync(ziel).filter((d) => d.endsWith('.webp'))
if (erzeugt.length !== FRAME_COUNT) {
  console.error(
    `Erwartet ${FRAME_COUNT} Frames, erzeugt wurden ${erzeugt.length}. ` +
      'Die Sequenz ist unbrauchbar — Abbruch.',
  )
  process.exit(1)
}

// ffmpeg zaehlt ab 1, der Canvas ab 0.
for (let i = FRAME_COUNT; i >= 1; i--) {
  const alt = path.join(ziel, `clip-${String(i).padStart(3, '0')}.webp`)
  const neu = path.join(ziel, `clip-${String(i - 1).padStart(3, '0')}.webp`)
  if (existsSync(alt)) execFileSync(process.execPath, ['-e', `require('fs').renameSync(${JSON.stringify(alt)}, ${JSON.stringify(neu)})`])
}

const summe = readdirSync(ziel).length
console.log(`${summe} Frames erzeugt in ${path.relative(wurzel, ziel)}.`)
```

- [ ] **Step 5: Frames erzeugen**

Run: `npm run assets:frames`
Expected: `145 Frames erzeugt in public\frames.`

Kontrolle der Gesamtgröße:

```powershell
"{0:N1} MB" -f ((Get-ChildItem public\frames -File | Measure-Object Length -Sum).Sum / 1MB)
```

Erwartet: 3–7 MB. Liegt der Wert über 8 MB, `-quality` von 80 auf 72 senken und erneut laufen lassen.

- [ ] **Step 6: `scripts/build-images.mjs` schreiben**

```js
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const pub = path.join(wurzel, 'public')
const ersterFrame = path.join(pub, 'frames/clip-000.webp')
const foto = path.join(wurzel, 'assets/source/clipper_foto.png')

if (!existsSync(ersterFrame)) {
  console.error('clip-000.webp fehlt. Zuerst "npm run assets:frames" ausfuehren.')
  process.exit(1)
}

// Das Poster ist exakt Frame 0 — sonst springt das Bild beim Start der Animation.
await sharp(ersterFrame)
  .resize({ width: 1600, withoutEnlargement: false })
  .jpeg({ quality: 72, mozjpeg: true })
  .toFile(path.join(pub, 'clipper-poster.jpg'))

await sharp(foto)
  .resize({ width: 1600 })
  .jpeg({ quality: 78, mozjpeg: true })
  .toFile(path.join(pub, 'clipper-foto.jpg'))

for (const datei of ['clipper-poster.jpg', 'clipper-foto.jpg']) {
  const m = await sharp(path.join(pub, datei)).metadata()
  console.log(`${datei}: ${m.width}x${m.height}`)
}
```

- [ ] **Step 7: Bilder erzeugen**

Run: `npm run assets:images`
Expected: zwei Zeilen mit `1600x…`.

- [ ] **Step 8: Test laufen lassen**

Run: `npx vitest run scripts/__tests__/frames.test.ts`
Expected: PASS, 5 Tests.

- [ ] **Step 9: `assets/README.md` schreiben**

```markdown
# Assets

`source/` enthält die unveränderten Originale. Nichts davon wird direkt
ausgeliefert.

| Datei | Herkunft |
|---|---|
| `source/scroll_effekt.mp4` | 1276×720, 24 fps, 145 Frames. **Nur ein Keyframe** — zum Video-Scrubbing unbrauchbar, deshalb die Frame-Sequenz. |
| `source/clipper_foto.png` | 2720×1536, Produktfoto vor hellem Grund (~#FAFBFB). |

Neu erzeugen nach einem Austausch der Quellen:

    npm run assets:frames    # ffmpeg -> public/frames/clip-000..144.webp
    npm run assets:images    # sharp  -> Poster und Salonfoto

`assets:images` setzt voraus, dass `assets:frames` vorher gelaufen ist: Das
Poster wird aus Frame 0 geschnitten, damit es exakt dem ersten Bild der
Animation entspricht.

Ändert sich die Frame-Anzahl, muss `FRAME_COUNT` in `lib/scrub.ts` mitgezogen
werden. Der Test `scripts/__tests__/frames.test.ts` schlägt sonst fehl.
```

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "Asset-Pipeline: 145 WebP-Frames, Poster und Salonfoto

ffmpeg extrahiert die Sequenz ohne Tonspur, sharp leitet Poster und Foto
ab. Das Poster ist Frame 0, damit der Uebergang in die Animation nicht
springt. Ein Test prueft Anzahl, Nummerierung und Gesamtgroesse.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 5: Scroll-Mathematik als reine Funktionen

Das Herz des Hero. Alles, was gerechnet wird, liegt hier — ohne DOM, ohne React, ohne Browser. Dadurch sind die Anforderungen aus Spec 6.3 (Rückwärtsscrollen) direkt testbar statt nur beobachtbar.

**Files:**
- Create: `lib/scrub.ts`
- Test: `lib/__tests__/scrub.test.ts`

**Interfaces:**
- Consumes: nichts
- Produces:
  - `FRAME_COUNT = 145`, `LETZTER_FRAME = 144`
  - `pfadFuerFrame(i: number): string`
  - `fortschritt(stageTop: number, scrollLen: number): number`
  - `glaettungsFaktor(dtMs: number): number`
  - `annaehern(aktuell: number, ziel: number, dtMs: number): number`
  - `frameIndex(p: number): number`
  - `naechstePhase(p: number, bisher: Phase): Phase` mit `type Phase = 'a' | 'b'`
  - `verfuegbarerFrame(gewuenscht: number, geladen: readonly boolean[]): number | null`
  - `PHASE_AUF = 0.55`, `PHASE_ZU = 0.45`, `RUHE_SCHWELLE = 0.0005`

- [ ] **Step 1: Schreibe den fehlschlagenden Test**

`lib/__tests__/scrub.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import {
  annaehern,
  frameIndex,
  fortschritt,
  glaettungsFaktor,
  LETZTER_FRAME,
  naechstePhase,
  pfadFuerFrame,
  verfuegbarerFrame,
} from '@/lib/scrub'

describe('fortschritt', () => {
  it('ist 0, solange die Bühne noch nicht erreicht ist', () => {
    expect(fortschritt(500, 1000)).toBe(0)
  })

  it('ist 1, sobald die Strecke durchlaufen ist', () => {
    expect(fortschritt(-1000, 1000)).toBe(1)
  })

  it('läuft linear durch die Mitte', () => {
    expect(fortschritt(-250, 1000)).toBeCloseTo(0.25)
    expect(fortschritt(-750, 1000)).toBeCloseTo(0.75)
  })

  it('klemmt jenseits beider Enden, statt zu überlaufen', () => {
    expect(fortschritt(-5000, 1000)).toBe(1)
    expect(fortschritt(9999, 1000)).toBe(0)
  })

  it('liefert 0 statt NaN, wenn es keine Scrollstrecke gibt', () => {
    expect(fortschritt(-10, 0)).toBe(0)
  })
})

describe('glaettungsFaktor', () => {
  it('entspricht bei 60 Hz genau der Grundglättung', () => {
    expect(glaettungsFaktor(1000 / 60)).toBeCloseTo(0.12, 5)
  })

  it('ist bei 120 Hz kleiner, damit die Glättung nicht doppelt so schnell läuft', () => {
    expect(glaettungsFaktor(1000 / 120)).toBeLessThan(0.12)
  })

  it('führt bei zwei 120-Hz-Schritten zum selben Ergebnis wie ein 60-Hz-Schritt', () => {
    const ziel = 1
    let a = 0
    a = a + (ziel - a) * glaettungsFaktor(1000 / 120)
    a = a + (ziel - a) * glaettungsFaktor(1000 / 120)
    const b = 0 + (ziel - 0) * glaettungsFaktor(1000 / 60)
    expect(a).toBeCloseTo(b, 6)
  })

  it('deckelt lange Pausen, damit ein Tab-Wechsel nicht durchschlägt', () => {
    expect(glaettungsFaktor(10_000)).toBe(glaettungsFaktor(100))
  })
})

describe('annaehern', () => {
  it('bewegt sich auf das Ziel zu, ohne es zu überschießen', () => {
    const n = annaehern(0, 1, 1000 / 60)
    expect(n).toBeGreaterThan(0)
    expect(n).toBeLessThan(1)
  })

  it('funktioniert abwärts genauso wie aufwärts — Rückwärtsscrollen', () => {
    const rauf = annaehern(0, 1, 1000 / 60)
    const runter = annaehern(1, 0, 1000 / 60)
    expect(runter).toBeCloseTo(1 - rauf, 10)
  })

  it('bleibt stehen, wenn Ziel und Ist gleich sind', () => {
    expect(annaehern(0.4, 0.4, 1000 / 60)).toBeCloseTo(0.4, 10)
  })
})

describe('frameIndex', () => {
  it('bildet die Enden exakt ab', () => {
    expect(frameIndex(0)).toBe(0)
    expect(frameIndex(1)).toBe(LETZTER_FRAME)
  })

  it('bildet die Mitte auf die Mitte ab', () => {
    expect(frameIndex(0.5)).toBe(72)
  })

  it('klemmt außerhalb von 0..1', () => {
    expect(frameIndex(-3)).toBe(0)
    expect(frameIndex(7)).toBe(LETZTER_FRAME)
  })

  it('ist streng monoton — rückwärts entstehen dieselben Indizes', () => {
    const vorwaerts: number[] = []
    for (let i = 0; i <= 100; i++) vorwaerts.push(frameIndex(i / 100))
    const rueckwaerts: number[] = []
    for (let i = 100; i >= 0; i--) rueckwaerts.push(frameIndex(i / 100))
    expect(rueckwaerts.reverse()).toEqual(vorwaerts)
  })
})

describe('naechstePhase', () => {
  it('schaltet aufwärts erst oberhalb von 0,55 um', () => {
    expect(naechstePhase(0.5, 'a')).toBe('a')
    expect(naechstePhase(0.56, 'a')).toBe('b')
  })

  it('schaltet abwärts erst unterhalb von 0,45 zurück — Rückwärtsscrollen', () => {
    expect(naechstePhase(0.5, 'b')).toBe('b')
    expect(naechstePhase(0.44, 'b')).toBe('a')
  })

  it('hält im toten Band die bisherige Phase, egal aus welcher Richtung', () => {
    expect(naechstePhase(0.5, 'a')).toBe('a')
    expect(naechstePhase(0.5, 'b')).toBe('b')
  })

  it('kehrt über einen vollen Hin- und Rückweg wieder zu a zurück', () => {
    let phase = naechstePhase(0, 'a')
    for (let i = 0; i <= 100; i++) phase = naechstePhase(i / 100, phase)
    expect(phase).toBe('b')
    for (let i = 100; i >= 0; i--) phase = naechstePhase(i / 100, phase)
    expect(phase).toBe('a')
  })
})

describe('verfuegbarerFrame', () => {
  it('nimmt den gewünschten Frame, wenn er geladen ist', () => {
    const geladen = [true, true, true]
    expect(verfuegbarerFrame(2, geladen)).toBe(2)
  })

  it('fällt auf den nächstniedrigeren geladenen zurück, statt ein Loch zu zeigen', () => {
    const geladen = [true, true, false, false]
    expect(verfuegbarerFrame(3, geladen)).toBe(1)
  })

  it('liefert null, solange gar nichts geladen ist', () => {
    expect(verfuegbarerFrame(5, [false, false])).toBeNull()
  })

  it('läuft nicht über das Ende des Arrays hinaus', () => {
    expect(verfuegbarerFrame(99, [true])).toBe(0)
  })
})

describe('pfadFuerFrame', () => {
  it('füllt die Nummer dreistellig auf', () => {
    expect(pfadFuerFrame(0)).toBe('/frames/clip-000.webp')
    expect(pfadFuerFrame(7)).toBe('/frames/clip-007.webp')
    expect(pfadFuerFrame(144)).toBe('/frames/clip-144.webp')
  })
})
```

- [ ] **Step 2: Test laufen lassen, Fehlschlag bestätigen**

Run: `npx vitest run lib/__tests__/scrub.test.ts`
Expected: FAIL mit „Failed to resolve import '@/lib/scrub'".

- [ ] **Step 3: `lib/scrub.ts` schreiben**

```ts
/**
 * Scroll-Mathematik des Hero. Reine Funktionen, kein DOM, kein React.
 *
 * Grundregel aus der Spec (6.3): Frame-Index und Phase sind reine Funktionen
 * der Scrollposition. Es gibt keinen Zustand, der sich merkt, dass die
 * Animation "schon gelaufen" ist — deshalb läuft sie rückwärts von selbst.
 */

export const FRAME_COUNT = 145
export const LETZTER_FRAME = FRAME_COUNT - 1

/** Grundglättung pro Frame bei 60 Hz. */
export const GLAETTUNG = 0.12

/** Schaltschwellen des Textwechsels, mit totem Band gegen Flackern. */
export const PHASE_AUF = 0.55
export const PHASE_ZU = 0.45

/** Unterhalb dieser Differenz gilt die Animation als zur Ruhe gekommen. */
export const RUHE_SCHWELLE = 0.0005

/** Längste Bildpause, die noch in die Glättung eingeht (Tab-Wechsel-Schutz). */
const MAX_DT_MS = 100

export type Phase = 'a' | 'b'

export function pfadFuerFrame(i: number): string {
  return `/frames/clip-${String(i).padStart(3, '0')}.webp`
}

function klemmen(wert: number, min: number, max: number): number {
  return wert < min ? min : wert > max ? max : wert
}

/**
 * Scrollfortschritt aus der Position der Bühne.
 * `stageTop` ist `getBoundingClientRect().top`, `scrollLen` die Scrubstrecke.
 */
export function fortschritt(stageTop: number, scrollLen: number): number {
  if (scrollLen <= 0) return 0
  return klemmen(-stageTop / scrollLen, 0, 1)
}

/** Framerate-unabhängiger Glättungsfaktor. Ohne ihn liefe 120 Hz doppelt so schnell. */
export function glaettungsFaktor(dtMs: number): number {
  const frames = Math.min(dtMs, MAX_DT_MS) / (1000 / 60)
  return 1 - Math.pow(1 - GLAETTUNG, frames)
}

/** Ein Glättungsschritt. Symmetrisch — aufwärts wie abwärts identisch. */
export function annaehern(aktuell: number, ziel: number, dtMs: number): number {
  return aktuell + (ziel - aktuell) * glaettungsFaktor(dtMs)
}

export function frameIndex(p: number): number {
  return klemmen(Math.round(klemmen(p, 0, 1) * LETZTER_FRAME), 0, LETZTER_FRAME)
}

/**
 * Phase des Textwechsels. Im toten Band zwischen PHASE_ZU und PHASE_AUF bleibt
 * die bisherige Phase stehen — richtungsunabhängig, ohne Vorzugsrichtung.
 */
export function naechstePhase(p: number, bisher: Phase): Phase {
  if (p > PHASE_AUF) return 'b'
  if (p < PHASE_ZU) return 'a'
  return bisher
}

/**
 * Der beste bereits dekodierte Frame bei oder unterhalb des gewünschten.
 * Verhindert Löcher, solange die Sequenz noch lädt.
 */
export function verfuegbarerFrame(
  gewuenscht: number,
  geladen: readonly boolean[],
): number | null {
  for (let i = Math.min(gewuenscht, geladen.length - 1); i >= 0; i--) {
    if (geladen[i]) return i
  }
  return null
}
```

- [ ] **Step 4: Test laufen lassen**

Run: `npx vitest run lib/__tests__/scrub.test.ts`
Expected: PASS, 21 Tests.

- [ ] **Step 5: Gesamte Suite und Typecheck**

Run: `npm test` — Expected: PASS.
Run: `npm run typecheck` — Expected: Exit 0.

- [ ] **Step 6: Commit**

```bash
git add lib/scrub.ts lib/__tests__/scrub.test.ts
git commit -m "Scroll-Mathematik als reine Funktionen mit Tests

Fortschritt, framerateunabhaengige Glaettung, Frame-Index, Phase mit
totem Band und Frame-Rueckfall. Die Tests halten die Umkehrbarkeit
ausdruecklich fest: annaehern ist symmetrisch, frameIndex monoton,
naechstePhase kehrt ueber einen vollen Hin- und Rueckweg nach a zurueck.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 6: Hero mit Canvas-Scrubbing

**Files:**
- Create: `components/hero/useScrubGate.ts`, `components/hero/useFrameSequence.ts`, `components/hero/ScrubCanvas.tsx`, `components/hero/Hero.tsx`, `e2e/hero.spec.ts`
- Modify: `app/globals.css` (Hero-Regeln anhängen), `app/layout.tsx` (Inline-Skript und Frame-Preload), `app/page.tsx`

**Interfaces:**
- Consumes: alles aus `lib/scrub.ts` (Task 5), `texte` (Task 2), `public/frames/*` und `clipper-poster.jpg` (Task 4)
- Produces: `<Hero />`; Attribut `data-scrub="an"` auf `<html>`; Attribute `--p` und `data-phase` auf `.stage`

**Zwei Mechanismen, die vorab verstanden sein müssen:**

1. **`data-scrub` wird vor dem ersten Paint gesetzt**, durch ein winziges Inline-Skript im `<head>` — nicht durch React. Sonst würden die beiden Textblöcke nach der Hydration von „untereinander" auf „übereinander" umspringen. Das Attribut sitzt auf `<html>`, also außerhalb von Reacts Zuständigkeit; es gibt keinen Hydration-Mismatch.
2. **Kein `aria-hidden`-Umschalten.** Der inaktive Textblock wird über `visibility: hidden` ausgeblendet, und das entfernt ein Element in allen relevanten Browsern aus dem Accessibility-Baum. Damit bleibt die Anforderung „Screenreader liest nicht doppelt" erfüllt, ohne dass der rAF-Loop React-Zustand anfassen müsste.

- [ ] **Step 1: Schreibe den fehlschlagenden Test**

`e2e/hero.spec.ts`:

```ts
import { expect, test } from '@playwright/test'

/** Wartet, bis der Canvas zur Ruhe gekommen ist, und liefert einen Fingerabdruck. */
async function canvasSignatur(page: import('@playwright/test').Page) {
  let letzte = ''
  await expect
    .poll(async () => {
      const jetzt = await page.evaluate(() => {
        const c = document.querySelector('canvas') as HTMLCanvasElement | null
        return c ? c.toDataURL('image/jpeg', 0.4).slice(-160) : ''
      })
      const stabil = jetzt !== '' && jetzt === letzte
      letzte = jetzt
      return stabil
    }, { timeout: 15_000, intervals: [250] })
    .toBe(true)
  return letzte
}

test.describe('Hero auf dem Desktop', () => {
  test.skip(({ browserName }, info) => info.project.name !== 'desktop', 'nur Desktop')

  test('die Buehne ist 200vh laenger als der Viewport', async ({ page }) => {
    await page.goto('/')
    const { hoehe, viewport } = await page.evaluate(() => ({
      hoehe: (document.querySelector('.stage') as HTMLElement).offsetHeight,
      viewport: window.innerHeight,
    }))
    expect(hoehe).toBeGreaterThan(viewport * 2.8)
    expect(hoehe).toBeLessThan(viewport * 3.2)
  })

  test('scrollen veraendert das Bild, zurueckscrollen stellt es wieder her', async ({ page }) => {
    await page.goto('/')
    const oben = await canvasSignatur(page)

    await page.evaluate(() => {
      const s = document.querySelector('.stage') as HTMLElement
      window.scrollTo(0, s.offsetTop + (s.offsetHeight - window.innerHeight) * 0.5)
    })
    const mitte = await canvasSignatur(page)
    expect(mitte).not.toBe(oben)

    await page.evaluate(() => {
      const s = document.querySelector('.stage') as HTMLElement
      window.scrollTo(0, s.offsetTop + (s.offsetHeight - window.innerHeight) * 0.95)
    })
    const unten = await canvasSignatur(page)
    expect(unten).not.toBe(mitte)

    // Rueckwaerts: die Maschine fuegt sich wieder zusammen.
    await page.evaluate(() => window.scrollTo(0, 0))
    const wiederOben = await canvasSignatur(page)
    expect(wiederOben).toBe(oben)
  })

  test('der Textwechsel kehrt beim Zurueckscrollen um', async ({ page }) => {
    await page.goto('/')
    const stage = page.locator('.stage')
    await expect(stage).toHaveAttribute('data-phase', 'a')

    await page.evaluate(() => {
      const s = document.querySelector('.stage') as HTMLElement
      window.scrollTo(0, s.offsetTop + (s.offsetHeight - window.innerHeight) * 0.9)
    })
    await expect(stage).toHaveAttribute('data-phase', 'b')
    await expect(page.getByTestId('hero-text-b')).toBeVisible()
    await expect(page.getByTestId('hero-text-a')).toBeHidden()

    await page.evaluate(() => window.scrollTo(0, 0))
    await expect(stage).toHaveAttribute('data-phase', 'a')
    await expect(page.getByTestId('hero-text-a')).toBeVisible()
    await expect(page.getByTestId('hero-text-b')).toBeHidden()
  })

  test('nach einem Reload mitten in der Strecke steht sofort der richtige Frame', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => {
      const s = document.querySelector('.stage') as HTMLElement
      window.scrollTo(0, s.offsetTop + (s.offsetHeight - window.innerHeight) * 0.6)
    })
    const vorher = await canvasSignatur(page)

    await page.reload()
    await page.evaluate(() => {
      const s = document.querySelector('.stage') as HTMLElement
      window.scrollTo(0, s.offsetTop + (s.offsetHeight - window.innerHeight) * 0.6)
    })
    const nachher = await canvasSignatur(page)
    expect(nachher).toBe(vorher)
  })
})

test.describe('Hero ohne Scrubbing', () => {
  test('mobil gibt es weder Scrollstrecke noch Frame-Requests', async ({ page }, info) => {
    test.skip(info.project.name !== 'mobil', 'nur mobil')
    const frames: string[] = []
    page.on('request', (r) => { if (r.url().includes('/frames/')) frames.push(r.url()) })

    await page.goto('/')
    await page.waitForTimeout(2500)

    const { hoehe, viewport } = await page.evaluate(() => ({
      hoehe: (document.querySelector('.stage') as HTMLElement).offsetHeight,
      viewport: window.innerHeight,
    }))
    expect(hoehe).toBeLessThan(viewport * 1.1)
    expect(frames).toHaveLength(0)
    await expect(page.getByTestId('hero-poster')).toBeVisible()
  })

  test('bei reduzierter Bewegung bleiben beide Textbloecke lesbar', async ({ browser }, info) => {
    test.skip(info.project.name !== 'desktop', 'nur Desktop')
    const kontext = await browser.newContext({
      reducedMotion: 'reduce',
      viewport: { width: 1440, height: 900 },
    })
    const page = await kontext.newPage()
    const frames: string[] = []
    page.on('request', (r) => { if (r.url().includes('/frames/')) frames.push(r.url()) })

    await page.goto('/')
    await page.waitForTimeout(2500)

    const { hoehe, viewport } = await page.evaluate(() => ({
      hoehe: (document.querySelector('.stage') as HTMLElement).offsetHeight,
      viewport: window.innerHeight,
    }))
    expect(hoehe).toBeLessThan(viewport * 1.1)
    expect(frames).toHaveLength(0)
    await expect(page.getByTestId('hero-text-a')).toBeVisible()
    await expect(page.getByTestId('hero-text-b')).toBeVisible()
    await kontext.close()
  })
})
```

- [ ] **Step 2: Test laufen lassen, Fehlschlag bestätigen**

Run: `npx playwright test e2e/hero.spec.ts`
Expected: FAIL — es gibt weder `.stage` noch `canvas`.

- [ ] **Step 3: `components/hero/useScrubGate.ts` schreiben**

```ts
'use client'

import { useEffect, useState } from 'react'

const BREITE = '(min-width: 768px)'
const BEWEGUNG = '(prefers-reduced-motion: no-preference)'

function sparsamerModus(): boolean {
  const c = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
  return c?.saveData === true
}

/**
 * Entscheidet, ob der rAF-Loop laufen darf. Startet mit `false`, damit die
 * Serverausgabe und der erste Client-Render übereinstimmen. Die Höhe der
 * Bühne hängt nicht hiervon ab — die kommt aus Media Queries.
 */
export function useScrubGate(): boolean {
  const [erlaubt, setErlaubt] = useState(false)

  useEffect(() => {
    const breit = window.matchMedia(BREITE)
    const bewegung = window.matchMedia(BEWEGUNG)

    const pruefen = () => {
      const ok = breit.matches && bewegung.matches && !sparsamerModus()
      setErlaubt(ok)
      if (ok) document.documentElement.dataset.scrub = 'an'
      else delete document.documentElement.dataset.scrub
    }

    pruefen()
    breit.addEventListener('change', pruefen)
    bewegung.addEventListener('change', pruefen)
    return () => {
      breit.removeEventListener('change', pruefen)
      bewegung.removeEventListener('change', pruefen)
    }
  }, [])

  return erlaubt
}
```

- [ ] **Step 4: `components/hero/useFrameSequence.ts` schreiben**

```ts
'use client'

import { useEffect, useRef, useState } from 'react'
import { FRAME_COUNT, pfadFuerFrame } from '@/lib/scrub'

const PARALLEL = 6
const MINDESTENS_BEREIT = 24
/** Spec 6.6: Kommt die Sequenz nicht in Gang, bleibt das Poster stehen. */
const GEDULD_MS = 8000

export type Sequenz = {
  bilder: (HTMLImageElement | null)[]
  geladen: boolean[]
  bereit: boolean
  gescheitert: boolean
}

/**
 * Lädt und dekodiert die Frame-Sequenz, sobald `aktiv` wahr wird.
 * Ist `aktiv` falsch, wird kein einziger Request abgesetzt.
 */
export function useFrameSequence(aktiv: boolean): Sequenz {
  const bilder = useRef<(HTMLImageElement | null)[]>(Array(FRAME_COUNT).fill(null))
  const geladen = useRef<boolean[]>(Array(FRAME_COUNT).fill(false))
  const [bereit, setBereit] = useState(false)
  const [gescheitert, setGescheitert] = useState(false)

  useEffect(() => {
    if (!aktiv) return
    let abgebrochen = false
    let fertig = 0
    let fehler = 0

    async function einzeln(i: number) {
      const bild = new Image()
      bild.decoding = 'async'
      bild.src = pfadFuerFrame(i)
      try {
        await bild.decode()
        if (abgebrochen) return
        bilder.current[i] = bild
        geladen.current[i] = true
        fertig += 1
        if (fertig >= MINDESTENS_BEREIT) setBereit(true)
      } catch {
        fehler += 1
        if (fehler > FRAME_COUNT / 4) setGescheitert(true)
      }
    }

    async function alle() {
      for (let start = 0; start < FRAME_COUNT; start += PARALLEL) {
        if (abgebrochen) return
        const block: Promise<void>[] = []
        const ende = Math.min(start + PARALLEL, FRAME_COUNT)
        for (let i = start; i < ende; i += 1) block.push(einzeln(i))
        await Promise.all(block)
      }
    }

    const anstossen = () => { void alle() }
    const id =
      'requestIdleCallback' in window
        ? window.requestIdleCallback(anstossen, { timeout: 1500 })
        : window.setTimeout(anstossen, 200)

    // Kommt die Sequenz in acht Sekunden nicht auf die Beine, wird nicht
    // gescrubbt. Lieber ein ruhiges Poster als ein hakender Effekt.
    const geduld = window.setTimeout(() => {
      if (fertig < MINDESTENS_BEREIT) {
        abgebrochen = true
        setGescheitert(true)
      }
    }, GEDULD_MS)

    return () => {
      abgebrochen = true
      window.clearTimeout(geduld)
      if ('cancelIdleCallback' in window) window.cancelIdleCallback(id as number)
      else window.clearTimeout(id as number)
    }
  }, [aktiv])

  return { bilder: bilder.current, geladen: geladen.current, bereit, gescheitert }
}
```

- [ ] **Step 5: `components/hero/ScrubCanvas.tsx` schreiben**

```tsx
'use client'

import { type RefObject, useEffect, useRef } from 'react'
import {
  annaehern,
  fortschritt,
  frameIndex,
  naechstePhase,
  type Phase,
  RUHE_SCHWELLE,
  verfuegbarerFrame,
} from '@/lib/scrub'
import { useFrameSequence } from './useFrameSequence'
import { useScrubGate } from './useScrubGate'

export function ScrubCanvas({ buehne }: { buehne: RefObject<HTMLElement | null> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const erlaubt = useScrubGate()
  const seq = useFrameSequence(erlaubt)
  const aktiv = erlaubt && seq.bereit && !seq.gescheitert

  useEffect(() => {
    const canvas = canvasRef.current
    const stage = buehne.current
    if (!aktiv || !canvas || !stage) return
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    const strecke = () => Math.max(1, stage.offsetHeight - window.innerHeight)

    // Spec 6.3, Punkt 3: beim Betreten NICHT bei null anfangen, sondern
    // dort, wo der Besucher gerade steht.
    let eased = fortschritt(stage.getBoundingClientRect().top, strecke())
    let phase: Phase = naechstePhase(eased, 'a')
    stage.dataset.phase = phase
    stage.style.setProperty('--p', eased.toFixed(4))

    let gezeichnet = -1
    let letzteZeit = performance.now()
    let laeuft = false
    let schmutzig = true
    let sichtbar = false
    let rafId = 0

    function zeichnen(i: number) {
      const nutzbar = verfuegbarerFrame(i, seq.geladen)
      if (nutzbar === null || nutzbar === gezeichnet) return
      const bild = seq.bilder[nutzbar]
      if (!bild) return
      ctx!.drawImage(bild, 0, 0, canvas!.clientWidth, canvas!.clientHeight)
      gezeichnet = nutzbar
    }

    function schritt(jetzt: number) {
      const dt = jetzt - letzteZeit
      letzteZeit = jetzt

      const ziel = fortschritt(stage!.getBoundingClientRect().top, strecke())
      eased = annaehern(eased, ziel, dt)
      stage!.style.setProperty('--p', eased.toFixed(4))

      const neu = naechstePhase(eased, phase)
      if (neu !== phase) {
        phase = neu
        stage!.dataset.phase = phase
      }

      const gewuenscht = frameIndex(eased)
      zeichnen(gewuenscht)

      // Ruht erst, wenn die Bewegung steht UND der exakte Frame gezeichnet ist.
      // Dadurch holt der Loop nachgeladene Frames selbsttaetig nach.
      const ruht =
        !schmutzig && Math.abs(ziel - eased) < RUHE_SCHWELLE && gezeichnet === gewuenscht
      schmutzig = false

      if (ruht || !sichtbar) { laeuft = false; return }
      rafId = requestAnimationFrame(schritt)
    }

    function starten() {
      if (laeuft || !sichtbar) return
      laeuft = true
      letzteZeit = performance.now()
      rafId = requestAnimationFrame(schritt)
    }

    function groesseSetzen() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas!.width = Math.round(canvas!.clientWidth * dpr)
      canvas!.height = Math.round(canvas!.clientHeight * dpr)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      gezeichnet = -1
      schmutzig = true
      starten()
    }

    // Der scroll-Listener rechnet nichts. Er merkt sich nur, dass sich etwas
    // getan hat, und weckt den Loop.
    const beiScroll = () => { schmutzig = true; starten() }

    const sichtbarkeit = new IntersectionObserver(
      ([eintrag]) => {
        sichtbar = eintrag.isIntersecting
        if (sichtbar) starten()
      },
      { rootMargin: '100px' },
    )
    sichtbarkeit.observe(stage)

    const groesse = new ResizeObserver(groesseSetzen)
    groesse.observe(canvas)
    groesseSetzen()

    window.addEventListener('scroll', beiScroll, { passive: true })

    return () => {
      cancelAnimationFrame(rafId)
      sichtbarkeit.disconnect()
      groesse.disconnect()
      window.removeEventListener('scroll', beiScroll)
    }
  }, [aktiv, buehne, seq.bilder, seq.geladen])

  return (
    <canvas
      ref={canvasRef}
      className="hero-canvas"
      data-aktiv={aktiv ? 'an' : undefined}
      role="img"
      aria-label="Eine Haarschneidemaschine zerfaellt schwebend in ihre Einzelteile."
    />
  )
}
```

- [ ] **Step 6: `components/hero/Hero.tsx` schreiben**

```tsx
'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { texte } from '@/content'
import { ScrubCanvas } from './ScrubCanvas'

export function Hero() {
  const buehne = useRef<HTMLElement>(null)

  return (
    <section ref={buehne} className="stage" aria-label="Alpine Cut">
      <div className="pin">
        <div className="hero-buehne">
          <Image
            src="/clipper-poster.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="hero-poster"
            data-testid="hero-poster"
          />
          <ScrubCanvas buehne={buehne} />
          <noscript>
            {/* Ohne JavaScript verdeckt nichts das Poster. */}
            <style>{`.hero-canvas{display:none}`}</style>
          </noscript>
        </div>

        <div className="container-seite hero-texte">
          <div data-testid="hero-text-a" className="hero-text hero-text-a">
            <h1>{texte.heroHeadline}</h1>
            <p className="lead mt-4 text-fg-muted">{texte.heroUnterzeile}</p>
          </div>
          <div data-testid="hero-text-b" className="hero-text hero-text-b">
            <h2 className="font-display">{texte.heroZweiterBlock}</h2>
            <p className="lead mt-4 text-fg-muted">{texte.heroZweiteUnterzeile}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 7: Hero-Regeln an `app/globals.css` anhängen**

```css
/* --- Hero -------------------------------------------------------------- */

.pin {
  display: grid;
  place-items: center;
  overflow: hidden;
}

.hero-buehne {
  position: absolute;
  inset: 0;
  /* Weiche Kanten: die Papiertextur des Materials soll nicht als Rechteck enden. */
  -webkit-mask-image: linear-gradient(to right, transparent, #000 8%, #000 92%, transparent),
                      linear-gradient(to bottom, transparent, #000 8%, #000 92%, transparent);
  mask-image: linear-gradient(to right, transparent, #000 8%, #000 92%, transparent),
              linear-gradient(to bottom, transparent, #000 8%, #000 92%, transparent);
  -webkit-mask-composite: source-in;
  mask-composite: intersect;
}

.hero-poster { object-fit: contain; object-position: center; }

.hero-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 240ms ease-out;
}
.hero-canvas[data-aktiv="an"] { opacity: 1; }

.hero-texte {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 3rem;
  width: 100%;
}

/* Ohne Scrubbing stehen beide Bloecke untereinander und sind beide lesbar. */
html[data-scrub="an"] .hero-texte { gap: 0; }
html[data-scrub="an"] .hero-texte > * { grid-area: 1 / 1; }

/* Deckkraft rein aus --p. CSS klemmt Werte ausserhalb 0..1 selbst. */
html[data-scrub="an"] .hero-text-a { opacity: calc((0.42 - var(--p)) / 0.14); }
html[data-scrub="an"] .hero-text-b { opacity: calc((var(--p) - 0.55) / 0.2); }

/* visibility: hidden nimmt das Element auch aus dem Accessibility-Baum. */
html[data-scrub="an"] .stage[data-phase="a"] .hero-text-b { visibility: hidden; }
html[data-scrub="an"] .stage[data-phase="b"] .hero-text-a { visibility: hidden; }
```

- [ ] **Step 8: `app/layout.tsx` um Inline-Skript und Preload ergänzen**

Direkt nach dem öffnenden `<html …>` einfügen:

```tsx
      <head>
        <link rel="preload" as="image" href="/frames/clip-000.webp" />
        <script
          // Setzt data-scrub VOR dem ersten Paint. Ohne das springen die beiden
          // Hero-Textbloecke nach der Hydration von untereinander auf uebereinander.
          dangerouslySetInnerHTML={{
            __html:
              "try{var m=window.matchMedia,c=navigator.connection;" +
              "if(m('(min-width:768px)').matches&&m('(prefers-reduced-motion: no-preference)').matches&&!(c&&c.saveData))" +
              "document.documentElement.dataset.scrub='an'}catch(e){}",
          }}
        />
      </head>
```

- [ ] **Step 9: `app/page.tsx` auf den Hero umstellen**

```tsx
import { Hero } from '@/components/hero/Hero'

export default function Startseite() {
  return <Hero />
}
```

- [ ] **Step 10: Test laufen lassen**

Run: `npx playwright test e2e/hero.spec.ts`
Expected: PASS, 6 Tests.

Zwei Fehlerbilder und ihre Ursache:

- „`wiederOben` ≠ `oben`": Irgendwo hat sich Zustand eingeschlichen, der die Umkehr blockiert. `gezeichnet` darf nur den letzten Frame speichern, nie eine Richtung. Prüfen, dass keine Bedingung `>` statt `!==` verwendet.
- Reload-Test schlägt fehl: Die Initialisierung von `eased` liest die Bühne, bevor der Browser die Scrollposition wiederhergestellt hat. Dann `requestAnimationFrame` einmal abwarten, bevor `eased` gesetzt wird.

- [ ] **Step 11: Rahmen-Test erneut laufen lassen**

Run: `npx playwright test e2e/rahmen.spec.ts`
Expected: PASS — der Hero darf die Prüfung auf horizontales Scrollen bei 360 px nicht brechen.

- [ ] **Step 12: Typecheck und Build**

Run: `npm run typecheck` — Expected: Exit 0.
Run: `npm run build` — Expected: erfolgreich.

- [ ] **Step 13: Commit**

```bash
git add -A
git commit -m "Hero: scroll-gekoppelte Frame-Sequenz auf Canvas

rAF-Loop mit framerateunabhaengiger Glaettung, Frames vorgeladen und
dekodiert, Textwechsel ueber --p und data-phase ohne Re-Render.
Umkehrbar in beide Richtungen; beim Betreten wird der aktuelle
Fortschritt gemessen statt bei null zu beginnen. Unter 768px und bei
reduzierter Bewegung entsteht weder Scrollstrecke noch ein Request.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 7: Abschnitte 2 bis 5

**Files:**
- Create: `components/sections/Leistungen.tsx`, `components/sections/UeberDenSalon.tsx`, `components/sections/Team.tsx`, `components/sections/OeffnungszeitenAnfahrt.tsx`, `e2e/abschnitte.spec.ts`
- Modify: `app/page.tsx`, `app/globals.css` (Abschnitts-Utilities anhängen)

**Interfaces:**
- Consumes: `<Offen />`, `salon`, `leistungen`, `team`, `oeffnungszeiten`, `texte` (Task 2), `<SectionHeading />` (Task 3)
- Produces: Abschnitte mit den IDs `leistungen`, `salon`, `team`, `zeiten` — die Sprungmarken aus `SiteHeader` zeigen darauf

- [ ] **Step 1: Schreibe den fehlschlagenden Test**

`e2e/abschnitte.spec.ts`:

```ts
import { expect, test } from '@playwright/test'

test('jede Sprungmarke im Kopf findet ihr Ziel', async ({ page }) => {
  await page.goto('/')
  for (const id of ['leistungen', 'salon', 'team', 'zeiten']) {
    await expect(page.locator(`#${id}`)).toHaveCount(1)
  }
})

test('offene Inhalte zeigen einen sichtbaren TODO-Marker statt erfundener Werte', async ({ page }) => {
  await page.goto('/')
  const marker = page.locator('[data-todo]')
  expect(await marker.count()).toBeGreaterThanOrEqual(4)
  await expect(marker.first()).toBeVisible()
  await expect(marker.first()).toContainText('TODO:')
})

test('nirgends stehen erfundene Preise, Namen oder Zeiten', async ({ page }) => {
  await page.goto('/')
  const text = (await page.locator('body').innerText()).toLowerCase()
  expect(text).not.toMatch(/\d+[,.]\d{2}\s*€/)
  expect(text).not.toMatch(/\d{1,2}:\d{2}\s*[–-]\s*\d{1,2}:\d{2}/)
})

test('Adresse und Telefon stehen im Anfahrtsabschnitt', async ({ page }) => {
  await page.goto('/')
  const abschnitt = page.locator('#zeiten')
  await expect(abschnitt).toContainText('Dorf-Platz 1')
  await expect(abschnitt).toContainText('6263 Fügen')
  await expect(abschnitt.getByRole('link', { name: /Route planen/ })).toHaveAttribute(
    'href',
    /^https:\/\/www\.google\.com\/maps/,
  )
})

test('es gibt keine eingebettete Karte, die vor der Einwilligung laedt', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('iframe')).toHaveCount(0)
})

test('jeder Abschnitt ist ueber seine Ueberschrift benannt', async ({ page }) => {
  await page.goto('/')
  for (const id of ['leistungen', 'salon', 'team', 'zeiten']) {
    await expect(page.locator(`#${id}`)).toHaveAttribute('aria-labelledby', `${id}-titel`)
  }
})
```

- [ ] **Step 2: Test laufen lassen, Fehlschlag bestätigen**

Run: `npx playwright test e2e/abschnitte.spec.ts --project=desktop`
Expected: FAIL — keiner der Abschnitte existiert.

- [ ] **Step 3: Abschnitts-Utilities an `app/globals.css` anhängen**

```css
/* --- Abschnitte -------------------------------------------------------- */

.abschnitt {
  padding-block: var(--abschnitt);
  border-top: 1px solid var(--line);
}

.preisreihe {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  padding-block: 0.75rem;
  border-bottom: 1px solid var(--line);
}
.preisreihe > .fuellung {
  flex: 1;
  border-bottom: 1px dotted var(--line);
  transform: translateY(-0.25em);
}
```

- [ ] **Step 4: `components/sections/Leistungen.tsx` schreiben**

```tsx
import { SectionHeading } from '@/components/SectionHeading'
import { Offen } from '@/components/Offen'
import { leistungen } from '@/content'

export function Leistungen() {
  return (
    <section id="leistungen" aria-labelledby="leistungen-titel" className="abschnitt">
      <div className="container-seite">
        <SectionHeading id="leistungen" nummer="01" eyebrow="Leistungen" titel="Was wir anbieten" />
        <Offen wert={leistungen}>
          {(kategorien) => (
            <div className="grid gap-12 sm:grid-cols-2">
              {kategorien.map((k) => (
                <div key={k.titel}>
                  <h3 className="mb-4">{k.titel}</h3>
                  <ul>
                    {k.leistungen.map((l) => (
                      <li key={l.bezeichnung} className="preisreihe">
                        <span>
                          {l.bezeichnung}
                          {l.hinweis ? (
                            <span className="block text-fg-muted text-[var(--mass-meta)]">{l.hinweis}</span>
                          ) : null}
                        </span>
                        <span className="fuellung" aria-hidden="true" />
                        <span className="tabular-nums text-fg-muted">{l.preis}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </Offen>
      </div>
    </section>
  )
}
```

- [ ] **Step 5: `components/sections/UeberDenSalon.tsx` schreiben**

```tsx
import Image from 'next/image'
import { SectionHeading } from '@/components/SectionHeading'
import { Offen } from '@/components/Offen'
import { texte } from '@/content'

export function UeberDenSalon() {
  return (
    <section id="salon" aria-labelledby="salon-titel" className="abschnitt">
      <div className="container-seite grid gap-12 md:grid-cols-2 md:items-center">
        <div>
          <SectionHeading id="salon" nummer="02" eyebrow="Der Salon" titel="Über uns" />
          <div className="lead max-w-prose text-fg-muted">
            <Offen wert={texte.ueberDenSalon}>{(t) => <p>{t}</p>}</Offen>
          </div>
        </div>
        <Image
          src="/clipper-foto.jpg"
          alt="Haarschneidemaschine vor hellem Grund"
          width={1600}
          height={903}
          sizes="(min-width: 768px) 50vw, 100vw"
          className="h-auto w-full"
        />
      </div>
    </section>
  )
}
```

Die Höhe `903` ergibt sich aus 1600 × 1536 / 2720. Weicht die Ausgabe von `assets:images` ab, den Wert aus der Konsolenausgabe von Task 4 Step 7 übernehmen.

- [ ] **Step 6: `components/sections/Team.tsx` schreiben**

```tsx
import { SectionHeading } from '@/components/SectionHeading'
import { Offen } from '@/components/Offen'
import { team } from '@/content'

export function Team() {
  return (
    <section id="team" aria-labelledby="team-titel" className="abschnitt">
      <div className="container-seite">
        <SectionHeading id="team" nummer="03" eyebrow="Team" titel="Wer Sie bedient" />
        <Offen wert={team}>
          {(mitglieder) => (
            <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {mitglieder.map((m) => (
                <li key={m.name}>
                  <p className="font-display text-[var(--mass-h3)]">{m.name}</p>
                  <p className="eyebrow mt-1">{m.rolle}</p>
                </li>
              ))}
            </ul>
          )}
        </Offen>
      </div>
    </section>
  )
}
```

- [ ] **Step 7: `components/sections/OeffnungszeitenAnfahrt.tsx` schreiben**

```tsx
import { SectionHeading } from '@/components/SectionHeading'
import { Offen } from '@/components/Offen'
import { oeffnungszeiten, salon } from '@/content'

const routeUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  `${salon.strasse}, ${salon.plz} ${salon.ort}, Österreich`,
)}`

export function OeffnungszeitenAnfahrt() {
  return (
    <section id="zeiten" aria-labelledby="zeiten-titel" className="abschnitt">
      <div className="container-seite grid gap-12 md:grid-cols-2">
        <div>
          <SectionHeading id="zeiten" nummer="04" eyebrow="Zeiten" titel="Öffnungszeiten" />
          <Offen wert={oeffnungszeiten}>
            {(tage) => (
              <dl className="max-w-sm">
                {tage.map((t) => (
                  <div key={t.tag} className="preisreihe">
                    <dt>{t.tag}</dt>
                    <span className="fuellung" aria-hidden="true" />
                    <dd className="text-fg-muted">{t.zeiten ?? 'geschlossen'}</dd>
                  </div>
                ))}
              </dl>
            )}
          </Offen>
        </div>

        <div>
          <h3 className="mb-4">Anfahrt</h3>
          <address className="not-italic text-fg-muted">
            <p>{salon.name}</p>
            <p>{salon.strasse}</p>
            <p>{salon.plz} {salon.ort}</p>
            <p>{salon.region}, Österreich</p>
            <p className="mt-4">
              <a href={salon.telefonHref}>{salon.telefon}</a>
            </p>
          </address>
          <p className="mt-6">
            <a href={routeUrl} target="_blank" rel="noreferrer noopener">
              Route planen
            </a>
          </p>
          <p className="mt-2 text-fg-muted text-[var(--mass-meta)]">
            Der Link öffnet Google Maps in einem neuen Tab. Vorher werden keine Daten übertragen.
          </p>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 8: `app/page.tsx` erweitern**

```tsx
import { Hero } from '@/components/hero/Hero'
import { Leistungen } from '@/components/sections/Leistungen'
import { OeffnungszeitenAnfahrt } from '@/components/sections/OeffnungszeitenAnfahrt'
import { Team } from '@/components/sections/Team'
import { UeberDenSalon } from '@/components/sections/UeberDenSalon'

export default function Startseite() {
  return (
    <>
      <Hero />
      <Leistungen />
      <UeberDenSalon />
      <Team />
      <OeffnungszeitenAnfahrt />
    </>
  )
}
```

- [ ] **Step 9: Test laufen lassen**

Run: `npx playwright test e2e/abschnitte.spec.ts --project=desktop`
Expected: PASS, 6 Tests.

- [ ] **Step 10: Alle e2e-Tests und Build**

Run: `npx playwright test` — Expected: PASS.
Run: `npm run build` — Expected: erfolgreich.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "Abschnitte Leistungen, Salon, Team, Zeiten und Anfahrt

Alle vier lesen aus content/ und zeigen bei offenen Stellen einen
sichtbaren TODO-Marker statt eines Ersatzwerts. Anfahrt ohne
eingebettete Karte: nur Adresse und ein Link, der erst beim Klick
nach aussen fuehrt.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 8: Terminanfrage

**Files:**
- Create: `lib/schema.ts`, `lib/resend.ts`, `app/actions/terminanfrage.ts`, `components/sections/Terminanfrage.tsx`, `e2e/formular.spec.ts`
- Modify: `app/page.tsx`
- Test: `lib/__tests__/schema.test.ts`, `e2e/formular.spec.ts`

**Interfaces:**
- Consumes: `leistungen`, `salon`, `istOffen` (Task 2)
- Produces:
  - `terminAnfrageSchema` und `type TerminAnfrage` aus `lib/schema.ts`
  - `sendeTerminanfrage(prev: FormZustand, daten: FormData): Promise<FormZustand>`
  - `type FormZustand = { status: 'leer' | 'ok' | 'fehler'; feldFehler: Record<string, string>; meldung?: string }`

**Ein Sonderfall, der eingeplant werden muss:** Solange `leistungen` ein TODO-Marker ist, hat das Select keine Optionen. Das Feld wird dann als freies Textfeld gerendert, mit einem TODO-Marker daneben. Sobald echte Leistungen eingetragen sind, wird daraus automatisch ein Select mit genau diesen Werten. Das Formular bleibt in beiden Zuständen benutzbar und testbar.

- [ ] **Step 1: Schreibe den fehlschlagenden Schema-Test**

`lib/__tests__/schema.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { terminAnfrageSchema } from '@/lib/schema'

const morgen = () => {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().slice(0, 10)
}

const gueltig = {
  name: 'Maria Huber',
  telefon: '0512 123456',
  leistung: 'Damenhaarschnitt',
  wunschtermin: morgen(),
  webseite: '',
}

describe('terminAnfrageSchema', () => {
  it('nimmt eine vollstaendige Anfrage an', () => {
    expect(terminAnfrageSchema.safeParse(gueltig).success).toBe(true)
  })

  it('nennt beim Namen, was fehlt', () => {
    const r = terminAnfrageSchema.safeParse({ ...gueltig, name: 'A' })
    expect(r.success).toBe(false)
    expect(r.error!.issues[0].message).toContain('mindestens zwei Zeichen')
  })

  it('nennt bei zu kurzer Telefonnummer ein Beispiel', () => {
    const r = terminAnfrageSchema.safeParse({ ...gueltig, telefon: '0512' })
    expect(r.success).toBe(false)
    expect(r.error!.issues[0].message).toContain('0512 123456')
  })

  it('akzeptiert internationale Schreibweisen', () => {
    for (const t of ['+43 676 6786333', '0043/676/6786333', '(0512) 123-456']) {
      expect(terminAnfrageSchema.safeParse({ ...gueltig, telefon: t }).success).toBe(true)
    }
  })

  it('weist Buchstaben in der Telefonnummer zurueck', () => {
    const r = terminAnfrageSchema.safeParse({ ...gueltig, telefon: 'ruf mich an' })
    expect(r.success).toBe(false)
    expect(r.error!.issues[0].message).toContain('unerlaubte Zeichen')
  })

  it('verlangt eine Leistung', () => {
    const r = terminAnfrageSchema.safeParse({ ...gueltig, leistung: '' })
    expect(r.success).toBe(false)
    expect(r.error!.issues[0].message).toContain('Leistung')
  })

  it('weist einen Termin in der Vergangenheit zurueck', () => {
    const r = terminAnfrageSchema.safeParse({ ...gueltig, wunschtermin: '2020-01-01' })
    expect(r.success).toBe(false)
    expect(r.error!.issues[0].message).toContain('Vergangenheit')
  })

  it('akzeptiert den heutigen Tag', () => {
    const heute = new Date().toISOString().slice(0, 10)
    expect(terminAnfrageSchema.safeParse({ ...gueltig, wunschtermin: heute }).success).toBe(true)
  })

  it('weist einen ausgefuellten Honeypot zurueck', () => {
    const r = terminAnfrageSchema.safeParse({ ...gueltig, webseite: 'http://spam.example' })
    expect(r.success).toBe(false)
  })
})
```

- [ ] **Step 2: Test laufen lassen, Fehlschlag bestätigen**

Run: `npx vitest run lib/__tests__/schema.test.ts`
Expected: FAIL mit „Failed to resolve import '@/lib/schema'".

- [ ] **Step 3: `lib/schema.ts` schreiben**

```ts
import { z } from 'zod'

const TELEFON = /^[+(0-9][0-9 /()+-]{5,}$/

function heuteAlsIso(): string {
  const jetzt = new Date()
  const versatz = jetzt.getTimezoneOffset() * 60_000
  return new Date(jetzt.getTime() - versatz).toISOString().slice(0, 10)
}

export const terminAnfrageSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Bitte geben Sie Ihren Namen an, mindestens zwei Zeichen.')
    .max(80, 'Der Name ist zu lang. Bitte auf 80 Zeichen kürzen.'),

  telefon: z
    .string()
    .trim()
    .min(6, 'Die Telefonnummer ist zu kurz. Bitte mit Vorwahl angeben, zum Beispiel 0512 123456.')
    .regex(
      TELEFON,
      'Diese Telefonnummer enthält unerlaubte Zeichen. Erlaubt sind Ziffern, Leerzeichen und die Zeichen + / ( ) und -.',
    ),

  leistung: z.string().trim().min(1, 'Bitte wählen Sie eine Leistung aus der Liste.'),

  wunschtermin: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Bitte wählen Sie ein Datum aus.')
    .refine(
      (d) => d >= heuteAlsIso(),
      'Der Wunschtermin liegt in der Vergangenheit. Bitte wählen Sie ein Datum ab heute.',
    ),

  /** Honeypot. Menschen sehen dieses Feld nicht, Bots füllen es aus. */
  webseite: z.string().max(0),
})

export type TerminAnfrage = z.infer<typeof terminAnfrageSchema>
```

- [ ] **Step 4: Test laufen lassen**

Run: `npx vitest run lib/__tests__/schema.test.ts`
Expected: PASS, 9 Tests.

- [ ] **Step 5: `lib/resend.ts` schreiben**

```ts
import { Resend } from 'resend'
import type { TerminAnfrage } from './schema'
import { salon } from '@/content'

export type Versandergebnis = { ok: true } | { ok: false; grund: 'konfiguration' | 'versand' }

export function mailtext(a: TerminAnfrage): string {
  return [
    'Neue Terminanfrage über die Website.',
    '',
    `Name:          ${a.name}`,
    `Telefon:       ${a.telefon}`,
    `Wunschleistung: ${a.leistung}`,
    `Wunschtermin:  ${a.wunschtermin}`,
    '',
    `Eingegangen: ${new Date().toLocaleString('de-AT')}`,
  ].join('\n')
}

export async function sendeMail(a: TerminAnfrage): Promise<Versandergebnis> {
  const key = process.env.RESEND_API_KEY
  const an = process.env.ANFRAGE_EMPFAENGER
  const von = process.env.ANFRAGE_ABSENDER

  if (!key || !an || !von) return { ok: false, grund: 'konfiguration' }

  try {
    const { error } = await new Resend(key).emails.send({
      from: `${salon.name} <${von}>`,
      to: [an],
      subject: `Terminanfrage: ${a.name}`,
      text: mailtext(a),
    })
    return error ? { ok: false, grund: 'versand' } : { ok: true }
  } catch {
    return { ok: false, grund: 'versand' }
  }
}
```

- [ ] **Step 6: `app/actions/terminanfrage.ts` schreiben**

```ts
'use server'

import { headers } from 'next/headers'
import { salon } from '@/content'
import { sendeMail } from '@/lib/resend'
import { terminAnfrageSchema } from '@/lib/schema'

export type FormZustand = {
  status: 'leer' | 'ok' | 'fehler'
  feldFehler: Record<string, string>
  meldung?: string
}

export const leererZustand: FormZustand = { status: 'leer', feldFehler: {} }

/**
 * Einfache Bremse gegen Gelegenheits-Spam. Sie lebt im Speicher der
 * Serverless-Funktion und wirkt daher nicht ueber mehrere Instanzen hinweg.
 * Falls das Formular ernsthaft Spam zieht, gehoert hier ein geteilter
 * Zaehler hin (Upstash Redis). Vorher waere das Ueberbau.
 */
const letzteAnfragen = new Map<string, number[]>()
const FENSTER_MS = 10 * 60 * 1000
const MAX_PRO_FENSTER = 5

function zuHaeufig(ip: string): boolean {
  const jetzt = Date.now()
  const bisher = (letzteAnfragen.get(ip) ?? []).filter((t) => jetzt - t < FENSTER_MS)
  bisher.push(jetzt)
  letzteAnfragen.set(ip, bisher)
  return bisher.length > MAX_PRO_FENSTER
}

export async function sendeTerminanfrage(
  _prev: FormZustand,
  daten: FormData,
): Promise<FormZustand> {
  const ergebnis = terminAnfrageSchema.safeParse({
    name: daten.get('name') ?? '',
    telefon: daten.get('telefon') ?? '',
    leistung: daten.get('leistung') ?? '',
    wunschtermin: daten.get('wunschtermin') ?? '',
    webseite: daten.get('webseite') ?? '',
  })

  if (!ergebnis.success) {
    const feldFehler: Record<string, string> = {}
    for (const problem of ergebnis.error.issues) {
      const feld = String(problem.path[0])
      if (feld === 'webseite') {
        // Honeypot: nicht verraten, woran es lag.
        return {
          status: 'fehler',
          feldFehler: {},
          meldung: 'Die Anfrage konnte nicht verarbeitet werden.',
        }
      }
      feldFehler[feld] ??= problem.message
    }
    return {
      status: 'fehler',
      feldFehler,
      meldung: 'Bitte prüfen Sie die markierten Felder.',
    }
  }

  const ip = (await headers()).get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unbekannt'
  if (zuHaeufig(ip)) {
    return {
      status: 'fehler',
      feldFehler: {},
      meldung: `Es sind bereits mehrere Anfragen von diesem Anschluss eingegangen. Bitte warten Sie einige Minuten oder rufen Sie uns an unter ${salon.telefon}.`,
    }
  }

  const versand = await sendeMail(ergebnis.data)

  if (!versand.ok) {
    return {
      status: 'fehler',
      feldFehler: {},
      meldung:
        versand.grund === 'konfiguration'
          ? `Der Mailversand ist auf dieser Seite noch nicht eingerichtet, Ihre Anfrage wurde nicht verschickt. Bitte rufen Sie uns an unter ${salon.telefon}.`
          : `Die Anfrage konnte nicht versendet werden. Bitte rufen Sie uns an unter ${salon.telefon} oder versuchen Sie es in einigen Minuten erneut.`,
    }
  }

  return {
    status: 'ok',
    feldFehler: {},
    meldung: 'Ihre Anfrage ist eingegangen. Wir melden uns telefonisch zur Bestätigung.',
  }
}
```

- [ ] **Step 7: `components/sections/Terminanfrage.tsx` schreiben**

```tsx
'use client'

import { useActionState, useEffect, useId, useRef } from 'react'
import { leererZustand, sendeTerminanfrage } from '@/app/actions/terminanfrage'
import { TodoMarker } from '@/components/Offen'
import { SectionHeading } from '@/components/SectionHeading'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { istOffen, leistungen } from '@/content'

function heuteAlsIso(): string {
  const jetzt = new Date()
  return new Date(jetzt.getTime() - jetzt.getTimezoneOffset() * 60_000).toISOString().slice(0, 10)
}

export function Terminanfrage() {
  const [zustand, absenden, laeuft] = useActionState(sendeTerminanfrage, leererZustand)
  const id = useId()
  const offeneLeistungen = istOffen(leistungen)
  const meldungRef = useRef<HTMLParagraphElement>(null)

  // Nach dem Absenden springt der Fokus auf die Meldung. Ohne das erfaehrt
  // niemand, der die Seite nicht sieht, dass ueberhaupt etwas passiert ist.
  useEffect(() => {
    if (zustand.status === 'fehler') meldungRef.current?.focus()
  }, [zustand])

  const fehler = (feld: string) => zustand.feldFehler[feld]

  if (zustand.status === 'ok') {
    return (
      <section id="termin" aria-labelledby="termin-titel" className="abschnitt">
        <div className="container-seite">
          <SectionHeading id="termin" nummer="05" eyebrow="Termin" titel="Terminanfrage" />
          <p role="status" className="lead max-w-prose">{zustand.meldung}</p>
        </div>
      </section>
    )
  }

  return (
    <section id="termin" aria-labelledby="termin-titel" className="abschnitt">
      <div className="container-seite">
        <SectionHeading id="termin" nummer="05" eyebrow="Termin" titel="Terminanfrage" />

        <form action={absenden} noValidate className="grid max-w-xl gap-6">
          {zustand.status === 'fehler' && zustand.meldung ? (
            <p ref={meldungRef} role="alert" tabIndex={-1} className="border border-[var(--todo)] p-3 text-[var(--todo)]">
              {zustand.meldung}
            </p>
          ) : null}

          <div className="grid gap-2">
            <Label htmlFor={`${id}-name`}>Name</Label>
            <Input
              id={`${id}-name`} name="name" required autoComplete="name"
              aria-invalid={!!fehler('name')}
              aria-describedby={fehler('name') ? `${id}-name-fehler` : undefined}
            />
            {fehler('name') ? (
              <p id={`${id}-name-fehler`} className="text-[var(--todo)]">{fehler('name')}</p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor={`${id}-telefon`}>Telefon</Label>
            <Input
              id={`${id}-telefon`} name="telefon" type="tel" required autoComplete="tel"
              aria-invalid={!!fehler('telefon')}
              aria-describedby={fehler('telefon') ? `${id}-telefon-fehler` : undefined}
            />
            {fehler('telefon') ? (
              <p id={`${id}-telefon-fehler`} className="text-[var(--todo)]">{fehler('telefon')}</p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor={`${id}-leistung`}>Wunschleistung</Label>
            {offeneLeistungen ? (
              <>
                <Input
                  id={`${id}-leistung`} name="leistung" required
                  aria-invalid={!!fehler('leistung')}
                  aria-describedby={fehler('leistung') ? `${id}-leistung-fehler` : undefined}
                />
                <TodoMarker hinweis="Sobald Leistungen in content/leistungen.ts stehen, wird hier eine Auswahlliste daraus." />
              </>
            ) : (
              <select
                id={`${id}-leistung`} name="leistung" required
                aria-invalid={!!fehler('leistung')}
                aria-describedby={fehler('leistung') ? `${id}-leistung-fehler` : undefined}
                className="border border-line bg-transparent px-3 py-2"
                defaultValue=""
              >
                <option value="" disabled>Bitte wählen</option>
                {leistungen.flatMap((k) =>
                  k.leistungen.map((l) => (
                    <option key={`${k.titel}-${l.bezeichnung}`} value={l.bezeichnung}>
                      {k.titel} — {l.bezeichnung}
                    </option>
                  )),
                )}
              </select>
            )}
            {fehler('leistung') ? (
              <p id={`${id}-leistung-fehler`} className="text-[var(--todo)]">{fehler('leistung')}</p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor={`${id}-termin`}>Wunschtermin</Label>
            <Input
              id={`${id}-termin`} name="wunschtermin" type="date" required min={heuteAlsIso()}
              aria-invalid={!!fehler('wunschtermin')}
              aria-describedby={fehler('wunschtermin') ? `${id}-termin-fehler` : undefined}
            />
            {fehler('wunschtermin') ? (
              <p id={`${id}-termin-fehler`} className="text-[var(--todo)]">{fehler('wunschtermin')}</p>
            ) : null}
          </div>

          {/* Honeypot: fuer Menschen unsichtbar, fuer Bots verlockend. */}
          <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
            <label htmlFor={`${id}-webseite`}>Webseite</label>
            <input id={`${id}-webseite`} name="webseite" tabIndex={-1} autoComplete="off" />
          </div>

          <Button type="submit" disabled={laeuft} className="justify-self-start">
            {laeuft ? 'Wird gesendet …' : 'Anfrage senden'}
          </Button>
        </form>
      </div>
    </section>
  )
}
```

- [ ] **Step 8: Button auf den Goldton bringen**

In `components/ui/button.tsx` die `default`-Variante ersetzen durch:

```
'bg-[var(--gold)] text-white hover:bg-[color-mix(in_srgb,var(--gold)_88%,black)]'
```

Alle `shadow-*`- und `rounded-md`-Klassen entfernen; `rounded-[var(--radius)]` setzen.

- [ ] **Step 9: `app/page.tsx` erweitern**

`<Terminanfrage />` nach `<OeffnungszeitenAnfahrt />` einfügen und importieren.

- [ ] **Step 10: Schreibe den e2e-Test**

`e2e/formular.spec.ts`:

```ts
import { expect, test } from '@playwright/test'

test.describe('Terminanfrage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#termin')
  })

  test('nennt bei leerem Absenden jedes fehlende Feld beim Namen', async ({ page }) => {
    await page.getByRole('button', { name: 'Anfrage senden' }).click()
    await expect(page.getByRole('alert')).toContainText('Bitte prüfen Sie die markierten Felder.')
    await expect(page.getByText('mindestens zwei Zeichen')).toBeVisible()
    await expect(page.getByText('Bitte mit Vorwahl angeben')).toBeVisible()
  })

  test('erklaert bei einer unbrauchbaren Telefonnummer, was erlaubt ist', async ({ page }) => {
    await page.getByLabel('Name').fill('Maria Huber')
    await page.getByLabel('Telefon').fill('ruf mich an')
    await page.getByRole('button', { name: 'Anfrage senden' }).click()
    await expect(page.getByText('unerlaubte Zeichen')).toBeVisible()
  })

  test('markiert fehlerhafte Felder fuer Hilfstechnik', async ({ page }) => {
    await page.getByRole('button', { name: 'Anfrage senden' }).click()
    await expect(page.getByLabel('Name')).toHaveAttribute('aria-invalid', 'true')
  })

  test('nennt bei fehlender Konfiguration die Telefonnummer als Ausweg', async ({ page }) => {
    const morgen = new Date(Date.now() + 86_400_000).toISOString().slice(0, 10)
    await page.getByLabel('Name').fill('Maria Huber')
    await page.getByLabel('Telefon').fill('0512 123456')
    await page.getByLabel('Wunschleistung').fill('Haarschnitt')
    await page.getByLabel('Wunschtermin').fill(morgen)
    await page.getByRole('button', { name: 'Anfrage senden' }).click()
    await expect(page.getByRole('alert')).toContainText('+43 676 6786333')
  })

  test('ist vollstaendig mit der Tastatur bedienbar', async ({ page }) => {
    await page.getByLabel('Name').focus()
    await page.keyboard.type('Maria Huber')
    await page.keyboard.press('Tab')
    await page.keyboard.type('0512 123456')
    await expect(page.getByLabel('Telefon')).toHaveValue('0512 123456')
  })
})
```

Der vierte Test setzt voraus, dass beim Testlauf **kein** `RESEND_API_KEY` gesetzt ist — das ist der Standardfall lokal und prüft genau den Pfad, den ein Besucher sähe, wenn die Konfiguration fehlt.

- [ ] **Step 11: Tests laufen lassen**

Run: `npx vitest run` — Expected: PASS.
Run: `npx playwright test e2e/formular.spec.ts --project=desktop` — Expected: PASS, 5 Tests.

- [ ] **Step 12: Build**

Run: `npm run build` — Expected: erfolgreich.

- [ ] **Step 13: Commit**

```bash
git add -A
git commit -m "Terminanfrage: Server Action mit Zod-Validierung und Resend

Serverseitige Pruefung, Fehlertexte nennen Ursache und naechsten
Schritt. Honeypot statt Captcha, damit kein Drittanbieter in den
Datenschutz muss. Faellt der Versand aus, steht die Telefonnummer
als Ausweg in der Meldung.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 9: Metadaten, Sitemap, robots, JSON-LD

**Files:**
- Create: `lib/site.ts`, `lib/jsonld.ts`, `app/sitemap.ts`, `app/robots.ts`, `e2e/seo.spec.ts`
- Modify: `app/layout.tsx`
- Test: `lib/__tests__/jsonld.test.ts`, `e2e/seo.spec.ts`

**Interfaces:**
- Consumes: `salon`, `oeffnungszeiten`, `texte`, `istOffen` (Task 2)
- Produces: `SITE_URL`, `hairSalonJsonLd(): Record<string, unknown>`

**Die zentrale Regel dieser Task:** Ein Feld, dessen Inhalt noch ein TODO-Marker ist, wird aus dem JSON-LD **weggelassen**. Es darf unter keinen Umständen mit Platzhaltertext befüllt werden — sonst stünde „TODO: Öffnungszeiten eintragen" in Googles strukturierten Daten. Gleiches gilt für `<meta name="description">`.

- [ ] **Step 1: Schreibe den fehlschlagenden Test**

`lib/__tests__/jsonld.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { hairSalonJsonLd } from '@/lib/jsonld'

describe('hairSalonJsonLd', () => {
  const daten = hairSalonJsonLd()
  const roh = JSON.stringify(daten)

  it('ist ein HairSalon mit Kontext', () => {
    expect(daten['@context']).toBe('https://schema.org')
    expect(daten['@type']).toBe('HairSalon')
  })

  it('traegt die gelieferten Stammdaten', () => {
    expect(daten.name).toBe('Alpine Cut')
    expect(daten.telephone).toBe('+43 676 6786333')
    expect(daten.address).toMatchObject({
      '@type': 'PostalAddress',
      streetAddress: 'Dorf-Platz 1',
      postalCode: '6263',
      addressLocality: 'Fügen',
      addressRegion: 'Tirol',
      addressCountry: 'AT',
    })
  })

  it('enthaelt nirgends das Wort TODO', () => {
    expect(roh).not.toContain('TODO')
    expect(roh.toLowerCase()).not.toContain('eintragen')
  })

  it('laesst die Oeffnungszeiten weg, solange sie offen sind', () => {
    expect(daten).not.toHaveProperty('openingHoursSpecification')
  })

  it('laesst geo weg, weil keine Koordinaten geliefert wurden', () => {
    expect(daten).not.toHaveProperty('geo')
  })

  it('enthaelt keinen einzigen undefined- oder null-Wert', () => {
    for (const [schluessel, wert] of Object.entries(daten)) {
      expect(wert, schluessel).not.toBeUndefined()
      expect(wert, schluessel).not.toBeNull()
    }
  })
})
```

- [ ] **Step 2: Test laufen lassen, Fehlschlag bestätigen**

Run: `npx vitest run lib/__tests__/jsonld.test.ts`
Expected: FAIL mit „Failed to resolve import '@/lib/jsonld'".

- [ ] **Step 3: `lib/site.ts` schreiben**

```ts
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
).replace(/\/$/, '')

export const SEITEN = ['/', '/impressum', '/datenschutz'] as const
```

- [ ] **Step 4: `lib/jsonld.ts` schreiben**

```ts
import { istOffen, oeffnungszeiten, salon } from '@/content'
import { SITE_URL } from './site'

const TAG_ZU_SCHEMA: Record<string, string> = {
  Montag: 'Monday',
  Dienstag: 'Tuesday',
  Mittwoch: 'Wednesday',
  Donnerstag: 'Thursday',
  Freitag: 'Friday',
  Samstag: 'Saturday',
  Sonntag: 'Sunday',
}

/**
 * Baut das LocalBusiness-Schema aus content/.
 * Offene Felder werden WEGGELASSEN, nie mit Platzhaltern gefuellt.
 */
export function hairSalonJsonLd(): Record<string, unknown> {
  const daten: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'HairSalon',
    name: salon.name,
    url: SITE_URL,
    image: `${SITE_URL}/clipper-foto.jpg`,
    telephone: salon.telefon,
    address: {
      '@type': 'PostalAddress',
      streetAddress: salon.strasse,
      postalCode: salon.plz,
      addressLocality: salon.ort,
      addressRegion: salon.region,
      addressCountry: salon.land,
    },
  }

  if (!istOffen(salon.email)) daten.email = salon.email

  if (!istOffen(oeffnungszeiten)) {
    const offen = oeffnungszeiten
      .filter((t) => t.zeiten !== null)
      .map((t) => {
        const [von, bis] = t.zeiten!.split(/\s*[–-]\s*/)
        return {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: `https://schema.org/${TAG_ZU_SCHEMA[t.tag]}`,
          opens: von,
          closes: bis,
        }
      })
    if (offen.length > 0) daten.openingHoursSpecification = offen
  }

  return daten
}
```

- [ ] **Step 5: Test laufen lassen**

Run: `npx vitest run lib/__tests__/jsonld.test.ts`
Expected: PASS, 6 Tests.

- [ ] **Step 6: `app/sitemap.ts` und `app/robots.ts` schreiben**

`app/sitemap.ts`:

```ts
import type { MetadataRoute } from 'next'
import { SEITEN, SITE_URL } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const jetzt = new Date()
  return SEITEN.map((pfad) => ({
    url: `${SITE_URL}${pfad}`,
    lastModified: jetzt,
    changeFrequency: pfad === '/' ? 'monthly' : 'yearly',
    priority: pfad === '/' ? 1 : 0.3,
  }))
}
```

`app/robots.ts`:

```ts
import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
```

- [ ] **Step 7: `app/layout.tsx` um Metadata und JSON-LD erweitern**

Den `metadata`-Export ersetzen:

```tsx
import { istOffen, salon, texte } from '@/content'
import { hairSalonJsonLd } from '@/lib/jsonld'
import { SITE_URL } from '@/lib/site'

const beschreibung = istOffen(texte.metaBeschreibung)
  ? `${salon.name} — Friseur in ${salon.ort}, ${salon.region}. ${salon.strasse}, ${salon.plz} ${salon.ort}. Telefon ${salon.telefon}.`
  : texte.metaBeschreibung

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${salon.name} — Friseur in ${salon.ort}`, template: `%s — ${salon.name}` },
  description: beschreibung,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'de_AT',
    siteName: salon.name,
    title: `${salon.name} — Friseur in ${salon.ort}`,
    description: beschreibung,
    url: SITE_URL,
  },
  robots: { index: true, follow: true },
}
```

Die Beschreibung fällt bewusst auf einen **aus echten Daten zusammengesetzten** Satz zurück, solange `metaBeschreibung` offen ist — Adresse und Telefon sind bekannt, es wird nichts erfunden. Ein TODO-Marker im `<meta>`-Tag wäre für Suchmaschinen schlicht Müll.

Im Body, direkt vor `{children}`:

```tsx
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(hairSalonJsonLd()) }}
        />
```

- [ ] **Step 8: Schreibe den e2e-Test**

`e2e/seo.spec.ts`:

```ts
import { expect, test } from '@playwright/test'

test('Titel und Beschreibung stehen und nennen den Ort', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Alpine Cut/)
  const desc = await page.locator('meta[name="description"]').getAttribute('content')
  expect(desc).toContain('Fügen')
  expect(desc).not.toContain('TODO')
})

test('Open Graph ist vollstaendig', async ({ page }) => {
  await page.goto('/')
  for (const eigenschaft of ['og:title', 'og:description', 'og:type', 'og:image']) {
    const wert = await page.locator(`meta[property="${eigenschaft}"]`).getAttribute('content')
    expect(wert, eigenschaft).toBeTruthy()
  }
})

test('JSON-LD ist gueltiges JSON ohne Platzhalter', async ({ page }) => {
  await page.goto('/')
  const roh = await page.locator('script[type="application/ld+json"]').innerText()
  const daten = JSON.parse(roh)
  expect(daten['@type']).toBe('HairSalon')
  expect(roh).not.toContain('TODO')
})

test('sitemap.xml und robots.txt werden ausgeliefert', async ({ request }) => {
  const sitemap = await request.get('/sitemap.xml')
  expect(sitemap.status()).toBe(200)
  expect(await sitemap.text()).toContain('<urlset')

  const robots = await request.get('/robots.txt')
  expect(robots.status()).toBe(200)
  expect(await robots.text()).toContain('Sitemap:')
})
```

- [ ] **Step 9: Tests und Build**

Run: `npx vitest run` — Expected: PASS.
Run: `npx playwright test e2e/seo.spec.ts --project=desktop` — Expected: PASS, 4 Tests.
Run: `npm run build` — Expected: erfolgreich.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "Metadaten, Sitemap, robots und LocalBusiness-JSON-LD

HairSalon-Schema aus content/ abgeleitet. Offene Felder werden
weggelassen statt mit Platzhaltern gefuellt; ein Test haelt fest,
dass nirgends das Wort TODO in den strukturierten Daten landet.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 10: Impressum und Datenschutz

**Files:**
- Create: `content/rechtliches.ts`, `app/impressum/page.tsx`, `app/datenschutz/page.tsx`, `components/Rechtstext.tsx`, `e2e/rechtsseiten.spec.ts`
- Modify: `content/index.ts`

**Interfaces:**
- Consumes: `salon`, `todo`, `<Offen />` (Task 2)
- Produces: `impressum` und `datenschutz` als Abschnittslisten, Komponente `<Rechtstext abschnitte={…} />`

**Diese Texte sind keine Rechtsberatung.** Sie sind fachlich sorgfältig auf das abgestimmt, was die Seite tatsächlich tut, und gehören vor dem Livegang anwaltlich geprüft. Der entsprechende Hinweis kommt in Task 11 ins README.

- [ ] **Step 1: Schreibe den fehlschlagenden Test**

`e2e/rechtsseiten.spec.ts`:

```ts
import { expect, test } from '@playwright/test'

test('Impressum nennt die bekannten Stammdaten', async ({ page }) => {
  await page.goto('/impressum')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Impressum')
  await expect(page.locator('main')).toContainText('Dorf-Platz 1')
  await expect(page.locator('main')).toContainText('+43 676 6786333')
})

test('Impressum markiert die noch fehlenden Pflichtangaben sichtbar', async ({ page }) => {
  await page.goto('/impressum')
  expect(await page.locator('[data-todo]').count()).toBeGreaterThanOrEqual(2)
})

test('Datenschutz beschreibt genau die Verarbeitung, die stattfindet', async ({ page }) => {
  await page.goto('/datenschutz')
  const text = await page.locator('main').innerText()
  expect(text).toContain('Resend')
  expect(text).toContain('Vercel')
  expect(text).toContain('Art. 6')
  expect(text).toMatch(/kein.{0,20}(Analyse|Analytics|Tracking)/i)
})

test('beide Rechtsseiten sind aus der Fusszeile erreichbar', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('contentinfo').getByRole('link', { name: 'Impressum' }).click()
  await expect(page).toHaveURL(/\/impressum$/)
  await page.getByRole('contentinfo').getByRole('link', { name: 'Datenschutz' }).click()
  await expect(page).toHaveURL(/\/datenschutz$/)
})
```

- [ ] **Step 2: Test laufen lassen, Fehlschlag bestätigen**

Run: `npx playwright test e2e/rechtsseiten.spec.ts --project=desktop`
Expected: FAIL — beide Routen liefern 404.

- [ ] **Step 3: `content/rechtliches.ts` schreiben**

```ts
import { salon } from './salon'
import { type Offen, todo } from './todo'

export type Rechtsabschnitt = { titel: string; absaetze: Offen<string>[] }

const anschrift = `${salon.name}, ${salon.strasse}, ${salon.plz} ${salon.ort}, Österreich`

export const impressum: Rechtsabschnitt[] = [
  {
    titel: 'Medieninhaber und Betreiber',
    absaetze: [
      anschrift,
      `Telefon: ${salon.telefon}`,
      todo('Impressum: E-Mail-Adresse eintragen'),
      todo('Impressum: Inhaber, Rechtsform und — falls vorhanden — Firmenbuchnummer und Firmenbuchgericht eintragen'),
      todo('Impressum: UID-Nummer eintragen, falls umsatzsteuerpflichtig'),
    ],
  },
  {
    titel: 'Gewerbe und Aufsicht',
    absaetze: [
      todo('Impressum: Gewerbewortlaut und zuständige Gewerbebehörde (Bezirkshauptmannschaft Schwaz) bestätigen'),
      'Mitglied der Wirtschaftskammer Tirol, Landesinnung der Friseure.',
      'Anwendbare Rechtsvorschrift: Gewerbeordnung 1994, abrufbar unter ris.bka.gv.at.',
    ],
  },
  {
    titel: 'Streitbeilegung',
    absaetze: [
      'Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung bereit: ec.europa.eu/consumers/odr',
      'Wir sind weder bereit noch verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.',
    ],
  },
  {
    titel: 'Haftung für Inhalte und Links',
    absaetze: [
      'Die Inhalte dieser Seite werden mit Sorgfalt erstellt. Für Richtigkeit, Vollständigkeit und Aktualität übernehmen wir keine Gewähr.',
      'Für Inhalte externer Links ist ausschließlich deren Betreiber verantwortlich. Zum Zeitpunkt der Verlinkung waren keine Rechtsverstöße erkennbar.',
    ],
  },
]

export const datenschutz: Rechtsabschnitt[] = [
  {
    titel: 'Verantwortlicher',
    absaetze: [
      anschrift,
      `Telefon: ${salon.telefon}`,
      todo('Datenschutz: E-Mail-Adresse für Datenschutzanfragen eintragen'),
    ],
  },
  {
    titel: 'Terminanfragen über das Formular',
    absaetze: [
      'Wenn Sie das Formular absenden, verarbeiten wir Ihren Namen, Ihre Telefonnummer, die gewünschte Leistung und Ihren Wunschtermin.',
      'Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO — die Anfrage ist eine vorvertragliche Maßnahme — sowie Art. 6 Abs. 1 lit. f DSGVO, unser berechtigtes Interesse an der Bearbeitung von Terminwünschen.',
      'Die Angaben erreichen uns per E-Mail. Wir bewahren sie so lange auf, wie es für die Terminvereinbarung nötig ist, und löschen sie spätestens nach sechs Monaten, sofern keine gesetzliche Aufbewahrungspflicht besteht.',
      'Die Angabe der Daten ist freiwillig. Ohne Namen und Telefonnummer können wir den Termin allerdings nicht bestätigen.',
    ],
  },
  {
    titel: 'Auftragsverarbeiter',
    absaetze: [
      'Den Versand der Formular-E-Mails übernimmt Resend (Plus Five Five, Inc., San Francisco, USA). Dabei werden die von Ihnen eingegebenen Daten in die USA übermittelt. Grundlage sind die Standardvertragsklauseln der Europäischen Kommission.',
      'Die Seite wird von Vercel Inc. gehostet. Beim Aufruf verarbeitet Vercel technisch notwendige Server-Logs, insbesondere IP-Adresse, Zeitpunkt, abgerufene Seite und Browserkennung. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO, unser berechtigtes Interesse an einem sicheren und störungsfreien Betrieb.',
    ],
  },
  {
    titel: 'Cookies und Reichweitenmessung',
    absaetze: [
      'Diese Seite setzt keine Cookies zu Analyse- oder Werbezwecken. Es findet keine Reichweitenmessung und kein Tracking statt. Deshalb gibt es auch kein Einwilligungsbanner.',
      'Der Kartendienst ist bewusst nicht eingebettet. Der Link „Route planen" öffnet Google Maps erst, wenn Sie ihn anklicken — vorher werden keine Daten an Google übertragen.',
      'Schriften werden von unserem eigenen Server ausgeliefert, nicht von einem Drittanbieter.',
    ],
  },
  {
    titel: 'Ihre Rechte',
    absaetze: [
      'Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch. Wenden Sie sich dafür an die oben genannten Kontaktdaten.',
      'Wenn Sie sich beschweren möchten, können Sie sich an die Österreichische Datenschutzbehörde wenden: Barichgasse 40–42, 1030 Wien, dsb.gv.at.',
    ],
  },
]
```

- [ ] **Step 4: `content/index.ts` ergänzen**

```ts
export { datenschutz, impressum } from './rechtliches'
export type { Rechtsabschnitt } from './rechtliches'
```

- [ ] **Step 5: `components/Rechtstext.tsx` schreiben**

```tsx
import { Offen } from '@/components/Offen'
import type { Rechtsabschnitt } from '@/content'

export function Rechtstext({ abschnitte }: { abschnitte: Rechtsabschnitt[] }) {
  return (
    <div className="grid gap-10">
      {abschnitte.map((a) => (
        <section key={a.titel} className="grid gap-3">
          <h2 className="text-[var(--mass-h3)]">{a.titel}</h2>
          {a.absaetze.map((absatz, i) => (
            <Offen key={i} wert={absatz}>
              {(t) => <p className="max-w-prose text-fg-muted">{t}</p>}
            </Offen>
          ))}
        </section>
      ))}
    </div>
  )
}
```

- [ ] **Step 6: Beide Seiten schreiben**

`app/impressum/page.tsx`:

```tsx
import type { Metadata } from 'next'
import { Rechtstext } from '@/components/Rechtstext'
import { impressum } from '@/content'

export const metadata: Metadata = {
  title: 'Impressum',
  alternates: { canonical: '/impressum' },
  robots: { index: false, follow: true },
}

export default function ImpressumSeite() {
  return (
    <article className="container-seite py-[var(--abschnitt)]">
      <h1 className="mb-12">Impressum</h1>
      <Rechtstext abschnitte={impressum} />
    </article>
  )
}
```

`app/datenschutz/page.tsx`:

```tsx
import type { Metadata } from 'next'
import { Rechtstext } from '@/components/Rechtstext'
import { datenschutz } from '@/content'

export const metadata: Metadata = {
  title: 'Datenschutz',
  alternates: { canonical: '/datenschutz' },
  robots: { index: false, follow: true },
}

export default function DatenschutzSeite() {
  return (
    <article className="container-seite py-[var(--abschnitt)]">
      <h1 className="mb-12">Datenschutz</h1>
      <Rechtstext abschnitte={datenschutz} />
    </article>
  )
}
```

- [ ] **Step 7: Test laufen lassen**

Run: `npx playwright test e2e/rechtsseiten.spec.ts --project=desktop`
Expected: PASS, 4 Tests.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "Impressum und Datenschutz als eigene Seiten

Datenschutzerklaerung beschreibt genau die Verarbeitung, die
stattfindet: Formulardaten ueber Resend, Server-Logs bei Vercel,
kein Tracking, keine eingebettete Karte, keine Cookies.
Betriebsspezifische Pflichtangaben sind sichtbare TODO-Marker.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 11: OG-Bild, README, Abnahme

**Files:**
- Create: `app/opengraph-image.jpg` (generiert), `README.md`
- Modify: `scripts/build-images.mjs`

**Interfaces:**
- Consumes: alles Vorherige
- Produces: gemessene Abnahmewerte, kein neuer Code für andere Tasks

- [ ] **Step 1: OG-Bild-Erzeugung an `scripts/build-images.mjs` anhängen**

```js
// --- Open-Graph-Bild ------------------------------------------------------
// Bewusst statisch vorgeneriert: @vercel/og laedt auf dieser Windows-Maschine
// seine Standardschrift nicht (ERR_INVALID_URL).

const OG_B = 1200
const OG_H = 630

const beschriftung = Buffer.from(`
<svg width="${OG_B}" height="${OG_H}" xmlns="http://www.w3.org/2000/svg">
  <text x="72" y="${OG_H - 110}" font-family="Georgia, serif" font-size="76" fill="#0F0F0F">Alpine Cut</text>
  <text x="72" y="${OG_H - 62}" font-family="Helvetica, Arial, sans-serif" font-size="27" letter-spacing="3" fill="#5A5A57">FRISEUR IN FUEGEN, TIROL</text>
  <rect x="72" y="${OG_H - 40}" width="96" height="3" fill="#8A6620" />
</svg>`)

await sharp(foto)
  .resize({ width: OG_B, height: OG_H, fit: 'cover', position: 'right' })
  .flatten({ background: '#FAFAFA' })
  .composite([{ input: beschriftung, top: 0, left: 0 }])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(path.join(wurzel, 'app/opengraph-image.jpg'))

console.log('opengraph-image.jpg: 1200x630')
```

- [ ] **Step 2: OG-Bild erzeugen und ansehen**

Run: `npm run assets:images`
Expected: drei Zeilen Ausgabe, darunter `opengraph-image.jpg: 1200x630`.

Die Datei `app/opengraph-image.jpg` öffnen und prüfen: Die Maschine muss rechts sichtbar sein, der Schriftzug links darf nicht auf ihr liegen. Überlappt es, `position: 'right'` beibehalten und den `x`-Wert der Texte anpassen.

- [ ] **Step 3: `README.md` schreiben**

```markdown
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
`lib/__tests__/scrub.test.ts` vollständig getestet.

Kein Scrubbing gibt es unter 768 px Viewportbreite, bei
`prefers-reduced-motion: reduce` und im Datensparmodus. Dort steht ein
statisches Poster, und die 200vh Scrollstrecke entsteht gar nicht erst. In
diesen Fällen wird auch kein einziger Frame geladen.

## Rechtliches

Impressum und Datenschutzerklärung sind fachlich sorgfältig auf das abgestimmt,
was diese Seite tatsächlich tut — sie sind aber **keine Rechtsberatung**. Vor
dem Livegang anwaltlich prüfen lassen.
```

- [ ] **Step 4: Volle Testsuite**

Run: `npm run typecheck` — Expected: Exit 0.
Run: `npm run lint` — Expected: keine Fehler.
Run: `npm test` — Expected: PASS.
Run: `npx playwright test` — Expected: PASS in beiden Projekten.

- [ ] **Step 5: Beide Build-Modi prüfen**

Run: `npm run build`
Expected: erfolgreich, Content-Check listet die offenen Marker.

Run (PowerShell): `$env:STRICT_CONTENT="1"; npm run build; $env:STRICT_CONTENT=""`
Expected: Abbruch mit Exit 1 und der Marker-Liste. Das ist das gewünschte Verhalten, kein Fehler.

- [ ] **Step 6: Lighthouse mobil messen**

```powershell
npm run build
Start-Process -NoNewWindow npm -ArgumentList "run","start"
npx --yes lighthouse http://localhost:3000 --preset=perf --form-factor=mobile --screenEmulation.mobile --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=./lighthouse.json --chrome-flags="--headless"
node -e "const r=require('./lighthouse.json');for(const [k,v] of Object.entries(r.categories))console.log(k, Math.round(v.score*100))"
```

Die vier Zahlen **notieren und berichten**, nicht behaupten. Liegt ein Wert unter 90, die konkrete Diagnose aus dem Bericht nennen und beheben. Erwartbare Stellschrauben:

- Performance: Poster zu groß → `quality` in `build-images.mjs` senken.
- SEO: hängt daran, dass Titel und Beschreibung echte Inhalte tragen. Mit offenen TODO-Markern bewertet Lighthouse das, was dasteht.
- Best Practices: das Inline-Skript für `data-scrub` kann eine CSP-Warnung auslösen, wenn später eine CSP gesetzt wird. Aktuell ist keine gesetzt.

`lighthouse.json` danach löschen und in `.gitignore` aufnehmen.

- [ ] **Step 7: Manuelle Durchsicht**

Diese Punkte sind nicht automatisiert und müssen von Hand geprüft werden:

1. Bei 360 px, 768 px, 1024 px und 1440 px durchscrollen — kein horizontaler Überstand, keine abgeschnittene Schrift.
2. Vollständig mit `Tab` durch die Seite — der Fokus ist an jeder Station sichtbar und die Reihenfolge folgt der optischen.
3. Auf einem echten iPhone öffnen, sofern erreichbar: Das Poster steht, es gibt keine Scrollstrecke, nichts ruckelt.
4. Auf dem Desktop vor und zurück scrubben — die Maschine zerfällt und fügt sich wieder zusammen, ohne Sprung an den Enden.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "OG-Bild, README und Abnahme

Statisches Open-Graph-Bild aus dem Salonfoto mit Wortmarke.
README erklaert, wo Inhalte liegen und wie STRICT_CONTENT vor dem
Livegang zu setzen ist.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```
