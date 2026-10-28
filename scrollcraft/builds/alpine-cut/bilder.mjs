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

/* ---- Logo der Agentur im Fuss -----------------------------------------
   Lag vorher als <img src="https://alpvent-agency.at/logo.png"> im Markup und
   war damit der einzige Fremdabruf der ganzen Seite: jeder Aufruf schickte die
   IP des Besuchers an einen anderen Server, und die Datenschutzerklaerung sagte
   "null Fremdabrufe". Dazu kam das Gewicht — die Vorlage ist 1380x382 und
   455 KB gross, dargestellt wird sie 15 Punkte hoch. 60 Punkte Hoehe reicht
   auch bei vierfacher Dichte und kostet 7,8 KB. */
console.log('Agenturlogo')
{
  const aus = path.join(ziel, 'alpvent.webp')
  await sharp(path.join(quellen, 'alpvent-logo.png'))
    .resize({ height: 60 })
    .webp({ quality: 88, effort: 6, alphaQuality: 90 })
    .toFile(aus)
  const m = await sharp(aus).metadata()
  console.log(`  alpvent.webp     ${m.width}x${m.height}  ${kb(aus)} KB`)
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
  /* hero.mp4 ist die aktuelle Vorlage; scroll_effekt.mp4 war die erste.
     Beide Namen werden gesucht, damit ein Zurueckwechseln nichts bricht. */
  const original = ['hero.mp4', 'scroll_effekt.mp4']
    .map((n) => path.join(quellen, n))
    .find(existsSync)
  if (!original) {
    console.error('  Vorlage fehlt: assets/source/hero.mp4')
    process.exit(1)
  }
  console.log('  Vorlage:', path.basename(original))
  /* Beschnitt: die Maschine steht im Bild zwischen 26 % und 72 % der Breite,
     links und rechts davon ist nur leerer Grund. Der kostet Bytes und drueckt
     die Maschine klein. Gemessen ueber sechs Bilder, 4 % Rand dazu.
     In der Hoehe wird nicht beschnitten: dort reicht sie von 1 % bis 98 %. */
  const BESCHNITT = 'crop=in_w*0.54:in_h:in_w*0.22:0'

  /* Der Grund der Vorlage ist nicht ganz weiss, sondern Y 232..234 (RGB 253).
     Hier auf Y 235 gezogen, also reines Weiss, damit er sich exakt mit dem
     weissen Hintergrund der Buehne deckt. Genauer: alles ab Y 230 wird
     auf 240 gesetzt, also ueber den Weisspunkt hinaus. Das ist Absicht —
     beim Dekodieren wird auf 255 gekappt, und so landet auch das
     Kompressionsrauschen noch auf reinem Weiss statt knapp darunter. Mit
     Y 235 blieb der Grund bei 252 stehen, gemessen. Der Uebergang laeuft
     weich von 215 an, damit der Schlagschatten unter der Maschine nicht
     abreisst — dort liegen 1,7 % der Flaeche, und das ist genau er.

     Wichtig ist, dass das in YUV passiert und nicht in RGB. Der fruehere
     Toenungsfilter (colorchannelmixer) schickte die Kette durch RGB; das
     Ergebnis trug danach keine Farbkennzeichnung mehr, und ein Browser, der
     den Wertebereich daraufhin falsch raet, dehnt ihn ein zweites Mal. Dann
     steht der Videokasten als weisses Rechteck auf der Seite. Genau das war
     zu sehen. */
  /* Dazu die Farbdifferenzkanaele: was ohnehin fast neutral ist, wird exakt
     neutral. Sonst zieht das Weiss ins Kalte — gemessen 253,255,255 statt
     255,255,255. Die Schwelle von 5 trifft nur Grautoene; die gruene Platine
     im Inneren der Maschine liegt weit darueber und bleibt bunt. */
  const NEUTRAL = ":u='if(lt(abs(val-128),5),128,val)':v='if(lt(abs(val-128),5),128,val)'"
  const WEISS = "lutyuv=y='if(gte(val,230),240,if(lte(val,215),val,215+(val-215)*1.3333))'" + NEUTRAL

  /* Die Stufen sind gemessen, nicht gewaehlt. Der Beschnitt hat den leeren
     Grund entfernt, der praktisch nichts kostete — jetzt ist jeder Pixel
     Motiv, und der Handy-Clip sprang von 183 auf 462 KB. Durchgerechnet:
     Hoehe 900/crf 30 462 KB, 700/30 330 KB, 700/32 271 KB, 560/30 242 KB.
     700 bei 32 ist der Knick: auf dem Telefon steht der Clip 354 Punkte
     hoch, 700 gelieferte Zeilen sind dort noch doppelte Dichte. */
  for (const [name, hoehe, crf, gop] of [
    ['clipper.mp4', 1200, 29, 8],
    ['clipper-m.mp4', 700, 32, 4],
  ]) {
    const aus = path.join(ziel, name)
    execFileSync('ffmpeg', [
      '-y', '-v', 'error', '-i', original,
      /* Reihenfolge: erst beschneiden, dann skalieren, dann klemmen. Wird
         vor dem Skalieren geklemmt, rechnet das Skalieren den Wert wieder
         weg — gemessen landete der Farbdifferenzkanal danach auf 127 statt
         128, und schon fehlten dem Weiss zwei Stufen im Rot. */
      '-vf', BESCHNITT + ',scale=-2:' + hoehe + ',' + WEISS,
      '-c:v', 'libx264', '-crf', String(crf),
      '-g', String(gop), '-keyint_min', String(gop), '-sc_threshold', '0',
      '-preset', 'slow', '-profile:v', 'high', '-pix_fmt', 'yuv420p',
      /* Ausdruecklich kennzeichnen. Ohne diese vier Angaben steht in der
         Datei "unknown", und jeder Browser raet selbst. Das war die Ursache
         des weissen Rechtecks. */
      '-color_range', 'tv', '-colorspace', 'bt709',
      /* Die beiden letzten Felder schreibt diese ffmpeg-Fassung nur ueber
         x264opts; -color_primaries und -color_trc schluckt sie wortlos.
         Nachgeprueft: ohne diese Zeile steht in der Datei
         'tv,bt709,unknown,unknown'. */
      '-x264opts', 'colorprim=bt709:transfer=bt709:colormatrix=bt709',
      '-an', '-movflags', '+faststart', aus,
    ])
    const m = execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height,color_range,color_space', '-of', 'csv=p=0', aus])
      .toString().trim()
    console.log('  ' + name.padEnd(16) + ' ' + m + '  ' + kb(aus) + ' KB')
  }

  /* Standbild aus dem Desktop-Clip: beide Buehnen zeigen denselben Ausschnitt. */
  const standbild = execFileSync('ffmpeg', ['-v', 'error', '-i', path.join(ziel, 'clipper.mp4'), '-frames:v', '1', '-f', 'image2pipe', '-vcodec', 'png', '-'], {
    maxBuffer: 64 * 1024 * 1024,
  })
  await sharp(standbild).resize({ width: 900 }).webp({ quality: 80 }).toFile(path.join(ziel, 'clipper-poster.webp'))
  console.log('  clipper-poster.webp      ' + kb(path.join(ziel, 'clipper-poster.webp')) + ' KB')

  /* Nachmessen, was wirklich herauskommt. Der Grund muss 255,255,255 sein —
     steht hier etwas anderes, deckt er sich nicht mit dem CSS der Buehne. */
  const ecke = await sharp(standbild).extract({ left: 8, top: 8, width: 40, height: 40 }).raw().toBuffer()
  let r = 0, g = 0, b = 0
  for (let i = 0; i < ecke.length; i += 3) { r += ecke[i]; g += ecke[i + 1]; b += ecke[i + 2] }
  const anz = ecke.length / 3
  const werte = [r, g, b].map((v) => Math.round(v / anz))
  console.log('  Grund des fertigen Clips: ' + werte.join(',') + (werte.every((v) => v >= 254) ? '  (reines Weiss, deckt sich mit der Buehne)' : '  ACHTUNG: nicht weiss!'))
}

console.log('\nFertig. Danach: node packen.mjs')
