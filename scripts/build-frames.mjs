import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, renameSync, rmSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const quelle = path.join(wurzel, 'assets/source/scroll_effekt.mp4')
const ziel = path.join(wurzel, 'public/frames')
const roh = path.join(wurzel, 'assets/tmp/frames')

export const FRAME_COUNT = 145

/**
 * ffmpeg liegt auf dieser Maschine nach `winget install Gyan.FFmpeg` nicht
 * zwingend im PATH. Reihenfolge: ausdrueckliche Angabe, PATH, WinGet-Ablage.
 */
function findeFfmpeg() {
  if (process.env.FFMPEG_PFAD) return process.env.FFMPEG_PFAD

  try {
    execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' })
    return 'ffmpeg'
  } catch {
    // faellt auf die Suche unten zurueck
  }

  const pakete = path.join(
    process.env.LOCALAPPDATA ?? '',
    'Microsoft/WinGet/Packages',
  )
  if (!existsSync(pakete)) return null

  const stapel = [pakete]
  while (stapel.length > 0) {
    const ordner = stapel.pop()
    let eintraege
    try {
      eintraege = readdirSync(ordner, { withFileTypes: true })
    } catch {
      continue
    }
    for (const e of eintraege) {
      const voll = path.join(ordner, e.name)
      if (e.isDirectory()) stapel.push(voll)
      else if (e.name.toLowerCase() === 'ffmpeg.exe') return voll
    }
  }
  return null
}

const ffmpeg = findeFfmpeg()

if (!ffmpeg) {
  console.error(
    'ffmpeg nicht gefunden. Installieren mit:\n' +
      '  winget install --id Gyan.FFmpeg\n' +
      'Oder den Pfad ausdruecklich setzen: $env:FFMPEG_PFAD = "C:\\...\\ffmpeg.exe"',
  )
  process.exit(1)
}

if (!existsSync(quelle)) {
  console.error(`Quelle fehlt: ${quelle}`)
  process.exit(1)
}

console.log(`ffmpeg: ${ffmpeg}`)

rmSync(roh, { recursive: true, force: true })
mkdirSync(roh, { recursive: true })

// -an       Tonspur verwerfen, sie wird nie abgespielt
// -vsync 0  jeden Frame genau einmal ausgeben, kein Doppeln oder Auslassen
execFileSync(
  ffmpeg,
  [
    '-hide_banner',
    '-loglevel', 'error',
    '-i', quelle,
    '-an',
    '-vsync', '0',
    '-c:v', 'libwebp',
    // 92 statt 80: bei Qualitaet 80 wog die Sequenz nur 1,7 MB, es war also
    // reichlich Budget da. Kompressionsartefakte auf den glatten Gehaeuse-
    // flaechen sind bei diesem Material der sichtbarste Qualitaetsverlust.
    '-quality', '92',
    '-compression_level', '6',
    '-preset', 'picture',
    path.join(roh, 'roh-%04d.webp'),
  ],
  { stdio: 'inherit' },
)

// ffmpeg zaehlt ab 1, der Canvas ab 0. Statt auf die Nummerierung zu
// vertrauen, wird sortiert und stur neu durchnummeriert.
const erzeugt = readdirSync(roh)
  .filter((d) => d.endsWith('.webp'))
  .sort()

if (erzeugt.length !== FRAME_COUNT) {
  console.error(
    `Erwartet ${FRAME_COUNT} Frames, erzeugt wurden ${erzeugt.length}. ` +
      'Die Sequenz waere unbrauchbar — Abbruch.',
  )
  process.exit(1)
}

rmSync(ziel, { recursive: true, force: true })
mkdirSync(ziel, { recursive: true })

erzeugt.forEach((datei, i) => {
  renameSync(path.join(roh, datei), path.join(ziel, `clip-${String(i).padStart(3, '0')}.webp`))
})

rmSync(path.join(wurzel, 'assets/tmp'), { recursive: true, force: true })

const summe = readdirSync(ziel).reduce((s, d) => s + statSync(path.join(ziel, d)).size, 0)

console.log(
  `${erzeugt.length} Frames in ${path.relative(wurzel, ziel)}, ` +
    `${(summe / 1024 / 1024).toFixed(1)} MB gesamt.`,
)
