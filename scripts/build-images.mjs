import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const pub = path.join(wurzel, 'public')
const logo = path.join(wurzel, 'assets/source/logo_alpinecut.jpg')

if (!existsSync(logo)) {
  console.error(`Logo fehlt: ${logo}`)
  process.exit(1)
}

const erzeugt = []
async function melden(pfad, name) {
  const m = await sharp(pfad).metadata()
  const kb = (await sharp(pfad).toBuffer()).length / 1024
  erzeugt.push(`${name}: ${m.width}x${m.height}, ${kb.toFixed(0)} KB`)
}

// --- Logo -----------------------------------------------------------------
// Die Vorlage hat schwarzen Grund und viel Rand. `trim` schneidet den Rand
// weg, indem es von den Ecken aus gleichfarbige Flaechen abtraegt. Freistellen
// mit Alphakanal geht aus einem JPEG nicht verlustfrei — noetig ist es auch
// nicht, denn die Seite ist ebenfalls schwarz.
for (const [breite, name] of [
  [512, 'logo.png'],
  [1024, 'logo-gross.png'],
]) {
  await sharp(logo)
    .trim({ threshold: 12 })
    .resize({ width: breite })
    .png({ compressionLevel: 9 })
    .toFile(path.join(pub, name))
  await melden(path.join(pub, name), name)
}

// Das Werkzeugfoto wird nicht mehr abgeleitet: Es hat weissen Grund und
// waere auf der schwarzen Seite ein leuchtender Kasten. Das Original bleibt
// unter assets/source/ liegen.

// --- Open-Graph-Bild ------------------------------------------------------
// Bewusst statisch vorgeneriert: @vercel/og laedt auf dieser Windows-Maschine
// seine Standardschrift nicht (ERR_INVALID_URL).
const OG_B = 1200
const OG_H = 630

const logoFuerOg = await sharp(logo)
  .trim({ threshold: 12 })
  .resize({ width: 380 })
  .toBuffer()

const beschriftung = Buffer.from(`
<svg width="${OG_B}" height="${OG_H}" xmlns="http://www.w3.org/2000/svg">
  <text x="${OG_B / 2}" y="${OG_H - 96}" text-anchor="middle"
        font-family="Helvetica, Arial, sans-serif" font-size="26"
        letter-spacing="9" fill="#FFFFFF">FRISEUR IN F&#220;GEN</text>
  <text x="${OG_B / 2}" y="${OG_H - 56}" text-anchor="middle"
        font-family="Helvetica, Arial, sans-serif" font-size="20"
        letter-spacing="5" fill="#8A8A8A">DORF-PLATZ 1 &#183; 6263 F&#220;GEN &#183; TIROL</text>
</svg>`)

await sharp({
  create: { width: OG_B, height: OG_H, channels: 3, background: '#000000' },
})
  .composite([
    { input: logoFuerOg, top: 80, left: Math.round((OG_B - 380) / 2) },
    { input: beschriftung, top: 0, left: 0 },
  ])
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(path.join(wurzel, 'app/opengraph-image.jpg'))
await melden(path.join(wurzel, 'app/opengraph-image.jpg'), 'opengraph-image.jpg')

for (const zeile of erzeugt) console.log(zeile)
