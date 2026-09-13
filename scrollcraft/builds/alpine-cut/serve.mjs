/**
 * Kleiner Server für die gebaute Seite. Nur zum Ansehen im Netz zu Hause,
 * nicht für den Betrieb.
 *
 * Lauscht auf 0.0.0.0, damit auch das Handy im selben WLAN drankommt; beim
 * Start werden alle Adressen ausgegeben, unter denen die Seite erreichbar ist.
 *
 *   node serve.mjs          → Port 4500
 *   node serve.mjs 5000     → anderer Port
 */
import { createServer } from 'node:http'
import { createReadStream, statSync } from 'node:fs'
import { networkInterfaces } from 'node:os'
import { extname, join, normalize } from 'node:path'

const port = Number(process.argv[2]) || 4500
const wurzel = process.cwd()

const typen = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.ico': 'image/x-icon',
}

createServer((anfrage, antwort) => {
  let pfad = decodeURIComponent(anfrage.url.split('?')[0])
  if (pfad.endsWith('/')) pfad += 'index.html'

  // normalize löst "..", der Vergleich danach hält die Auslieferung im Ordner.
  const datei = normalize(join(wurzel, pfad))
  if (!datei.startsWith(wurzel)) {
    antwort.writeHead(403).end('Ausserhalb des Ordners')
    return
  }

  let groesse
  try {
    const s = statSync(datei)
    if (s.isDirectory()) throw new Error('Ordner')
    groesse = s.size
  } catch {
    antwort.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Nicht gefunden')
    return
  }

  // Das Video wird beim Scrollen stückweise geholt: ohne Bereichsantworten
  // lädt der Browser die ganze Datei, bevor das erste Bild steht.
  const bereich = anfrage.headers.range
  const typ = typen[extname(datei)] || 'application/octet-stream'
  if (bereich) {
    const [von, bis] = bereich.replace('bytes=', '').split('-')
    const start = Number(von)
    const ende = bis ? Number(bis) : groesse - 1
    antwort.writeHead(206, {
      'Content-Type': typ,
      'Content-Range': `bytes ${start}-${ende}/${groesse}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': ende - start + 1,
    })
    createReadStream(datei, { start, end: ende }).pipe(antwort)
    return
  }

  antwort.writeHead(200, { 'Content-Type': typ, 'Content-Length': groesse, 'Accept-Ranges': 'bytes' })
  createReadStream(datei).pipe(antwort)
}).listen(port, '0.0.0.0', () => {
  const adressen = Object.values(networkInterfaces())
    .flat()
    .filter((n) => n && n.family === 'IPv4' && !n.internal)
    .map((n) => n.address)

  console.log(`\n  Auf diesem Rechner:  http://localhost:${port}`)
  for (const a of adressen) console.log(`  Im selben WLAN:      http://${a}:${port}`)
  console.log('\n  Beenden mit Strg+C\n')
})
