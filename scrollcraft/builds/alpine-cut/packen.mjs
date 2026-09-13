/**
 * Legt den Ordner an, der auf den Webserver kommt — genau die Dateien, die die
 * Seite braucht, ohne Laborbilder, Werkzeug und Notizen.
 *
 *   node packen.mjs
 *
 * Ergebnis: alpine-cut/hochladen/
 */
import { cpSync, mkdirSync, rmSync, statSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const hier = path.dirname(fileURLToPath(import.meta.url))
const ziel = path.resolve(hier, '../../../hochladen')

const dateien = [
  'index.html',
  'impressum.html',
  'datenschutz.html',
  'recht.css',
  'scrollcraft.css',
  'scrollcraft.js',
  'sprache.js',
  'robots.txt',
  'sitemap.xml',
]

rmSync(ziel, { recursive: true, force: true })
mkdirSync(ziel, { recursive: true })
for (const d of dateien) cpSync(path.join(hier, d), path.join(ziel, d))
cpSync(path.join(hier, 'assets'), path.join(ziel, 'assets'), { recursive: true })
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
