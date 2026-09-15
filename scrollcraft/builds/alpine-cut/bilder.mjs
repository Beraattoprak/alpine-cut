/**
 * Baut alle Bilder der Seite aus den Originalen in ../../../assets/source/.
 *
 *   node bilder.mjs          → Fotos, Logo, Symbole, Teilbild
 *   node bilder.mjs --clip   → zusätzlich die beiden Videos (braucht ffmpeg, dauert)
 *
 * Warum es diese Datei gibt: die Maße sind nicht geraten, sondern gemessen —
 * geliefert gegen tatsächlich dargestellt, auf Handy mit dreifacher und Desktop
 * mit doppelter Pixeldichte. Ohne diese Notiz müsste das jemand neu herausfinden.
 *
 * Die Vorlagen bleiben unangetastet. Wer ein Foto austauscht, legt das neue
 * Original daneben und lässt das hier laufen.
 */
import sharp from 'sharp'
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const hier = path.dirname(fileURLToPath(import.meta.url))
const quellen = path.resolve(hier, '../../../assets/source')
const ziel = path.join(hier, 'assets')

const TINTE = '#14120F'
const ELFENBEIN = [0xf7, 0xf4, 0xee]

const kb = (p) => Math.round(statSync(p).size / 1024)

/** Weiße Vorlage mit Alphakanal in Elfenbein umfärben; das Alpha bleibt. */
async function einfaerben(puffer) {
  const { data, info } = await sharp(puffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  for (let i = 0; i < data.length; i += 4) {
    data[i] = ELFENBEIN[0]
    data[i + 1] = ELFENBEIN[1]
    data[i + 2] = ELFENBEIN[2]
  }
  return sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer()
}

mkdirSync(path.join(ziel, 'marke'), { recursive: true })

/* ---- Schnittfotos ------------------------------------------------------
   Dargestellt werden höchstens 624px (Desktop, doppelte Dichte). 700 gibt
   etwas Rand. Beschnitt auf 3:4, weil zwei der Vorlagen hochformatiger sind
   und im Band sonst unterschiedlich hohe Kacheln stünden. */
console.log('Schnittfotos')
for (const name of ['herren-fade', 'herren-crop', 'herren-taper', 'herren-textur', 'damen-lang']) {
  const quelle = ['jpeg', 'webp', 'jpg', 'png']
    .map((e) => path.join(quellen, 'schnitte', `${name}.${e}`))
    .find(existsSync)
  if (!quelle) {
    console.error(`  Vorlage fehlt: schnitte/${name}`)
    process.exit(1)
  }
  const aus = path.join(ziel, `${name}.webp`)
  await sharp(quelle).resize(700, 933, { fit: 'cover', position: 'centre' }).webp({ quality: 78, effort: 6 }).toFile(aus)
  console.log(`  ${name.padEnd(16)} 700x933  ${kb(aus)} KB`)
}

/* ---- Salonfotos --------------------------------------------------------
   Gebraucht werden bis 1448px, 1500 gibt Rand. Kein Beschnitt: das
   Seitenverhältnis bestimmt die Seite über width und height im Markup. */
console.log('Salonfotos')
for (const name of ['salon-aussen', 'salon-plaetze', 'salon-lounge']) {
  const quelle = path.join(quellen, 'fotos', `${name}.jpeg`)
  if (!existsSync(quelle)) {
    console.error(`  Vorlage fehlt: fotos/${name}.jpeg`)
    process.exit(1)
  }
  const aus = path.join(ziel, `${name}.webp`)
  const m = await sharp(quelle).metadata()
  await sharp(quelle)
    .resize({ width: Math.min(1500, m.width), withoutEnlargement: true })
    .webp({ quality: 78, effort: 6 })
    .toFile(aus)
  const n = await sharp(aus).metadata()
  console.log(`  ${name.padEnd(16)} ${n.width}x${n.height}  ${kb(aus)} KB`)
}

/* ---- Logo --------------------------------------------------------------
   Die Vorlage ist weiß auf schwarz. Freigestellt wird über die Helligkeit:
   das Motiv ist rein weiß, der Grund rein schwarz, also taugt der
   Graustufenwert unverändert als Alphakanal. 1100px, weil auf dem Handy mit
   dreifacher Dichte 1050 gebraucht werden — mit 512 war es unscharf. */
console.log('Logo und Symbole')
const logoRoh = sharp(path.join(quellen, 'logo_alpinecut.jpg')).trim({ threshold: 12 })
const maske = await logoRoh.clone().greyscale().toColourspace('b-w').toBuffer()
const { width: lw, height: lh } = await sharp(maske).metadata()
const logoWeiss = await sharp({ create: { width: lw, height: lh, channels: 3, background: '#ffffff' } })
  .joinChannel(maske)
  .png()
  .toBuffer()

await sharp(logoWeiss).resize({ width: 1100 }).webp({ quality: 88, effort: 6, alphaQuality: 90 }).toFile(path.join(ziel, 'logo.webp'))
console.log(`  logo.webp        1100px  ${kb(path.join(ziel, 'logo.webp'))} KB`)

/* Symbole: das ganze Logo, nicht nur der Berg. Der Berg ist eine
   Umrisszeichnung mit dünnen Strichen und verschwindet bei 16px; die
   Buchstaben haben genug Fläche. Nachgemessen, nicht vermutet. */
for (const [kante, name] of [[32, 'favicon-32.png'], [180, 'apple-touch-icon.png'], [512, 'icon-512.png']]) {
  const rand = Math.round(kante * 0.07)
  const innen = kante - rand * 2
  const skaliert = await sharp(logoWeiss)
    .resize({ width: innen, height: innen, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer()
  const aus = path.join(ziel, 'marke', name)
  await sharp({ create: { width: kante, height: kante, channels: 4, background: TINTE } })
    .composite([{ input: await einfaerben(skaliert), gravity: 'center' }])
    .png({ compressionLevel: 9 })
    .toFile(aus)
  console.log(`  ${name.padEnd(16)} ${kante}x${kante}  ${kb(aus)} KB`)
}

/* ---- Teilbild für WhatsApp, Instagram, Facebook ------------------------ */
const ogB = 1200
const ogH = 630
const ogLogo = await einfaerben(await sharp(logoWeiss).resize({ width: 520 }).toBuffer())
const ogMeta = await sharp(ogLogo).metadata()
const zeile = Buffer.from(
  `<svg width="${ogB}" height="${ogH}" xmlns="http://www.w3.org/2000/svg">
     <text x="600" y="556" text-anchor="middle" font-family="Archivo, Arial, sans-serif"
           font-size="30" letter-spacing="6" fill="#9E968A">DORF-PLATZ 1 · 6263 FÜGEN · ZILLERTAL</text>
   </svg>`,
)
const ogAus = path.join(ziel, 'marke', 'teilbild.jpg')
await sharp({ create: { width: ogB, height: ogH, channels: 3, background: TINTE } })
  .composite([
    { input: ogLogo, top: 88, left: Math.round((ogB - ogMeta.width) / 2) },
    { input: zeile, top: 0, left: 0 },
  ])
  .jpeg({ quality: 86 })
  .toFile(ogAus)
console.log(`  teilbild.jpg     ${ogB}x${ogH}  ${kb(ogAus)} KB`)

/* ---- Videos ------------------------------------------------------------
   Nur mit --clip, weil es dauert. Die dichte Bildfolge ist nicht optional:
   ohne sie ruckelt das Scrubben. Desktop alle 8 Bilder ein Keyframe, Handy
   alle 4. Die Qualitätsstufen sind gegen das Original gemessen, nicht
   geschätzt: SSIM 0,995 beziehungsweise 0,991. */
if (process.argv.includes('--clip')) {
  console.log('Videos')
  const original = path.join(quellen, 'scroll_effekt.mp4')
  if (!existsSync(original)) {
    console.error('  Vorlage fehlt: scroll_effekt.mp4')
    process.exit(1)
  }
  for (const [name, breite, crf, gop] of [
    ['clipper.mp4', 1914, 29, 8],
    ['clipper-m.mp4', 960, 29, 4],
  ]) {
    const aus = path.join(ziel, name)
    execFileSync('ffmpeg', [
      '-y', '-v', 'error', '-i', original,
      '-vf', `scale=${breite}:-2`,
      '-c:v', 'libx264', '-crf', String(crf),
      '-g', String(gop), '-keyint_min', String(gop), '-sc_threshold', '0',
      '-preset', 'slow', '-profile:v', 'high', '-pix_fmt', 'yuv420p',
      '-an', '-movflags', '+faststart', aus,
    ])
    console.log(`  ${name.padEnd(16)} ${breite}px  ${kb(aus)} KB`)
  }
  await sharp(
    execFileSync('ffmpeg', ['-v', 'error', '-i', path.join(ziel, 'clipper-m.mp4'), '-frames:v', '1', '-f', 'image2pipe', '-vcodec', 'png', '-'], {
      maxBuffer: 64 * 1024 * 1024,
    }),
  )
    .webp({ quality: 80 })
    .toFile(path.join(ziel, 'clipper-poster.webp'))
  console.log(`  clipper-poster.webp      ${kb(path.join(ziel, 'clipper-poster.webp'))} KB`)
}

console.log('\nFertig. Danach: node packen.mjs')
