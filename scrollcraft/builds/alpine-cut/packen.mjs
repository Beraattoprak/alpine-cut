/**
 * Legt den Ordner an, der auf den Webserver kommt — genau die Dateien, die die
 * Seite braucht, ohne Laborbilder, Werkzeug und Notizen.
 *
 *   node packen.mjs
 *
 * Ergebnis: alpine-cut/hochladen/
 */
import { cpSync, mkdirSync, rmSync, statSync, readdirSync, writeFileSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { uebersetzen } from './uebersetzen.mjs'

const hier = path.dirname(fileURLToPath(import.meta.url))
const ziel = path.resolve(hier, '../../../hochladen')

const dateien = [
  'index.html',
  'impressum.html',
  'datenschutz.html',
  '404.html',
  'recht.css',
  'scrollcraft.css',
  'scrollcraft.js',
  'robots.txt',
  'sitemap.xml',
]

rmSync(ziel, { recursive: true, force: true })
mkdirSync(ziel, { recursive: true })
for (const d of dateien) cpSync(path.join(hier, d), path.join(ziel, d))
cpSync(path.join(hier, 'assets'), path.join(ziel, 'assets'), { recursive: true })

/* Die englische Seite entsteht hier, nicht im Quellordner: sie ist ein
   Erzeugnis aus index.html und woerter.mjs. Wer einen Preis aendert, aendert
   ihn einmal — die zweite Sprache zieht beim naechsten Bauen nach. */
const { html, textTreffer, attrTreffer } = uebersetzen(readFileSync(path.join(hier, 'index.html'), 'utf8'))
mkdirSync(path.join(ziel, 'en'), { recursive: true })
writeFileSync(path.join(ziel, 'en/index.html'), html)
console.log(`en/index.html: ${textTreffer} Texte, ${attrTreffer} Attribute uebersetzt`)
rmSync(path.join(ziel, 'assets/tmp'), { recursive: true, force: true })

let anzahl = 0
let bytes = 0
const zaehlen = (p) => {
  for (const e of readdirSync(p, { withFileTypes: true })) {
    const q = path.join(p, e.name)
    if (e.isDirectory()) zaehlen(q)
    else { anzahl++; bytes += statSync(q).size }
  }
}
zaehlen(ziel)
console.log(`${anzahl} Dateien, ${(bytes / 1024 / 1024).toFixed(1)} MB`)
console.log(ziel)
