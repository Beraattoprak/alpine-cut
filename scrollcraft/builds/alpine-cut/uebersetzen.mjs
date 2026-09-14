/**
 * Erzeugt die englische Seite aus der deutschen.
 *
 *   node uebersetzen.mjs            → schreibt en/index.html
 *
 * Warum überhaupt eine zweite Datei, wo doch vorher im Browser umgeschaltet
 * wurde: eine Suchmaschine indiziert Adressen, keine Knopfdrücke. Solange die
 * englische Fassung unter derselben Adresse lag, war sie für Google nicht
 * vorhanden — wer „barber Zillertal" sucht, hat den Salon nie gefunden.
 *
 * Gepflegt wird trotzdem nur eine Seite. Die englische entsteht beim Bauen aus
 * der deutschen plus woerter.mjs; wer einen Preis ändert, ändert ihn einmal.
 *
 * Ersetzt wird nur, wo der deutsche Text den ganzen Textknoten oder den ganzen
 * Attributwert ausmacht. Ein Treffer mitten im Satz wäre Zufall und würde
 * Zitate zerlegen.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { WOERTER } from './woerter.mjs'

const hier = path.dirname(fileURLToPath(import.meta.url))

/** Sonderzeichen entschärfen, damit der Text als Suchmuster taugt. */
const roh = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** Wortzwischenräume dürfen im Quelltext Zeilenumbrüche sein. */
const mitUmbruch = (s) => roh(s).replace(/\s+/g, '\\s+')

export function uebersetzen(quelle) {
  let t = quelle

  /* Längste zuerst: sonst schlägt „Herren" zu, wo „Herrenpreise" steht.
     Die Muster verlangen zwar den ganzen Wert, aber die Reihenfolge kostet
     nichts und nimmt eine Fehlerquelle weg. */
  const schluessel = Object.keys(WOERTER).sort((a, b) => b.length - a.length)

  let textTreffer = 0
  let attrTreffer = 0

  for (const de of schluessel) {
    const en = WOERTER[de]

    // Ganzer Textknoten: >   Text   <
    const alsText = new RegExp('>(\\s*)' + mitUmbruch(de) + '(\\s*)<', 'g')
    t = t.replace(alsText, (_, vorn, hinten) => {
      textTreffer++
      return '>' + vorn + en + hinten + '<'
    })

    // Ganzer Attributwert
    const alsAttr = new RegExp('(\\b(?:alt|aria-label|title|content)=")' + mitUmbruch(de) + '"', 'g')
    t = t.replace(alsAttr, (_, kopf) => {
      attrTreffer++
      return kopf + en + '"'
    })
  }

  /* Relative Verweise brechen eine Ebene tiefer: aus assets/ würde
     /en/assets/. Absolut gemacht, statt mit ../ zu hantieren. */
  t = t
    .replace(/(href|src|data-sc-src|data-sc-src-mobile)="(?!https?:|\/|#|tel:|mailto:)/g, '$1="/')
    .replace(/url\((?!https?:|\/|data:|#|')/g, 'url(/')

  /* Kopfdaten auf die englische Adresse */
  t = t
    .replace('<html lang="de">', '<html lang="en">')
    .replace(
      '<link rel="canonical" href="https://alpine-cut.at/">',
      '<link rel="canonical" href="https://alpine-cut.at/en/">',
    )
    .replace(
      '<meta property="og:url" content="https://alpine-cut.at/">',
      '<meta property="og:url" content="https://alpine-cut.at/en/">',
    )
    .replace('<meta property="og:locale" content="de_AT">', '<meta property="og:locale" content="en">')
    .replace('"url": "https://alpine-cut.at/"', '"url": "https://alpine-cut.at/en/"')

  /* Umschalter: auf der englischen Seite ist EN die aktuelle Seite. */
  t = t
    .replace('href="/" hreflang="de" lang="de" aria-current="page"', 'href="/" hreflang="de" lang="de"')
    .replace('href="/en/" hreflang="en" lang="en"', 'href="/en/" hreflang="en" lang="en" aria-current="page"')

  return { html: t, textTreffer, attrTreffer }
}

if (import.meta.url === `file://${process.argv[1]}`.replace(/\\/g, '/') || process.argv[1]?.endsWith('uebersetzen.mjs')) {
  const quelle = readFileSync(path.join(hier, 'index.html'), 'utf8')
  const { html, textTreffer, attrTreffer } = uebersetzen(quelle)
  mkdirSync(path.join(hier, 'en'), { recursive: true })
  writeFileSync(path.join(hier, 'en/index.html'), html)
  console.log(`en/index.html: ${textTreffer} Texte, ${attrTreffer} Attribute übersetzt`)
}
