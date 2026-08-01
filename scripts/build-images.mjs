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

// Das Poster ist exakt Frame 0 — sonst springt das Bild beim Start der
// Animation. Keine Skalierung: die Quelle ist 1276 px breit, und genau darauf
// wird der Canvas spaeter begrenzt. Hochrechnen brächte keine Details, nur Bytes.
await sharp(ersterFrame).jpeg({ quality: 76, mozjpeg: true }).toFile(path.join(pub, 'clipper-poster.jpg'))

await sharp(foto)
  .resize({ width: 1600 })
  .jpeg({ quality: 78, mozjpeg: true })
  .toFile(path.join(pub, 'clipper-foto.jpg'))

// --- Open-Graph-Bild ------------------------------------------------------
// Bewusst statisch vorgeneriert: @vercel/og laedt auf dieser Windows-Maschine
// seine Standardschrift nicht (ERR_INVALID_URL).

const OG_B = 1200
const OG_H = 630

const beschriftung = Buffer.from(`
<svg width="${OG_B}" height="${OG_H}" xmlns="http://www.w3.org/2000/svg">
  <text x="72" y="${OG_H - 118}" font-family="Georgia, serif" font-size="76" fill="#0F0F0F">Alpine Cut</text>
  <text x="72" y="${OG_H - 74}" font-family="Helvetica, Arial, sans-serif" font-size="25" letter-spacing="3" fill="#5A5A57">FRISEUR IN FÜGEN, TIROL</text>
  <rect x="72" y="${OG_H - 52}" width="96" height="3" fill="#8A6620" />
</svg>`)

await sharp(foto)
  .resize({ width: OG_B, height: OG_H, fit: 'cover', position: 'right' })
  .flatten({ background: '#FAFAFA' })
  .composite([{ input: beschriftung, top: 0, left: 0 }])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(path.join(wurzel, 'app/opengraph-image.jpg'))

for (const datei of ['clipper-poster.jpg', 'clipper-foto.jpg']) {
  const p = path.join(pub, datei)
  const m = await sharp(p).metadata()
  const kb = (await sharp(p).toBuffer()).length / 1024
  console.log(`${datei}: ${m.width}x${m.height}, ${kb.toFixed(0)} KB`)
}

{
  const p = path.join(wurzel, 'app/opengraph-image.jpg')
  const m = await sharp(p).metadata()
  const kb = (await sharp(p).toBuffer()).length / 1024
  console.log(`opengraph-image.jpg: ${m.width}x${m.height}, ${kb.toFixed(0)} KB`)
}
