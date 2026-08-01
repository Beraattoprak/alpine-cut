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

for (const datei of ['clipper-poster.jpg', 'clipper-foto.jpg']) {
  const p = path.join(pub, datei)
  const m = await sharp(p).metadata()
  const kb = (await sharp(p).toBuffer()).length / 1024
  console.log(`${datei}: ${m.width}x${m.height}, ${kb.toFixed(0)} KB`)
}
