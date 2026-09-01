import { existsSync, mkdirSync } from 'node:fs'
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
// Die Vorlage ist weiss auf schwarz, mit viel Rand. `trim` nimmt den Rand weg.
//
// Freigestellt wird ueber die Helligkeit: Das Motiv ist rein weiss, der Grund
// rein schwarz, also taugt der Graustufenwert unveraendert als Alphakanal. Ein
// weisses Rechteck bekommt ihn per joinChannel angehaengt. Ergebnis ist ein
// weisses Logo auf durchsichtigem Grund — noetig, seit es ueber dem Hero-Foto
// steht; auf schwarzem Grund fiel der schwarze Kasten vorher nicht auf.
for (const [breite, name] of [
  [512, 'logo.png'],
  [1024, 'logo-gross.png'],
]) {
  const beschnitten = sharp(logo).trim({ threshold: 12 }).resize({ width: breite })
  const maske = await beschnitten.clone().greyscale().toColourspace('b-w').toBuffer()
  const { width, height } = await sharp(maske).metadata()

  await sharp({ create: { width, height, channels: 3, background: '#ffffff' } })
    .joinChannel(maske)
    .png({ compressionLevel: 9 })
    .toFile(path.join(pub, name))
  await melden(path.join(pub, name), name)
}

// Das Werkzeugfoto wird nicht mehr abgeleitet: Es hat weissen Grund und
// waere auf der schwarzen Seite ein leuchtender Kasten. Das Original bleibt
// unter assets/source/ liegen.

// --- Salonfotos -----------------------------------------------------------
// Die Originale sind ~2048 px breite JPEGs direkt aus dem Telefon. Sie werden
// auf zwei Breiten als WebP abgelegt; next/image liefert daraus die passende
// Groesse aus. Kein Beschnitt — das Seitenverhaeltnis bestimmt die Seite ueber
// aspect-ratio, damit die Bildaussage nicht beschnitten wird.
const fotos = ['salon-aussen', 'salon-lounge', 'salon-plaetze', 'salon-waschen']
const fotoZiel = path.join(pub, 'fotos')
mkdirSync(fotoZiel, { recursive: true })

for (const name of fotos) {
  const quelle = path.join(wurzel, 'assets/source/fotos', `${name}.jpeg`)
  if (!existsSync(quelle)) {
    console.error(`Foto fehlt: ${quelle}`)
    process.exit(1)
  }
  const m = await sharp(quelle).metadata()

  await sharp(quelle)
    .resize({ width: Math.min(1800, m.width), withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(path.join(fotoZiel, `${name}.webp`))
  await melden(path.join(fotoZiel, `${name}.webp`), `fotos/${name}.webp`)
}

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
