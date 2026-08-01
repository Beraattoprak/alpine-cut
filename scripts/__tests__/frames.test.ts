import { existsSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const FRAME_COUNT = 145
const ordner = path.resolve(__dirname, '../../public/frames')

describe('Frame-Sequenz', () => {
  it('enthält exakt 145 WebP-Dateien', () => {
    expect(existsSync(ordner)).toBe(true)
    const dateien = readdirSync(ordner).filter((d) => d.endsWith('.webp'))
    expect(dateien.length).toBe(FRAME_COUNT)
  })

  it('ist lückenlos von clip-000 bis clip-144 durchnummeriert', () => {
    for (let i = 0; i < FRAME_COUNT; i++) {
      const name = `clip-${String(i).padStart(3, '0')}.webp`
      expect(existsSync(path.join(ordner, name)), `${name} fehlt`).toBe(true)
    }
  })

  it('enthält keine leeren Dateien', () => {
    for (const datei of readdirSync(ordner).filter((d) => d.endsWith('.webp'))) {
      expect(statSync(path.join(ordner, datei)).size).toBeGreaterThan(1000)
    }
  })

  it('bleibt in der Summe unter 8 MB', () => {
    const summe = readdirSync(ordner)
      .filter((d) => d.endsWith('.webp'))
      .reduce((s, d) => s + statSync(path.join(ordner, d)).size, 0)
    expect(summe).toBeLessThan(8 * 1024 * 1024)
  })

  it('liefert Poster und Salonfoto', () => {
    const pub = path.resolve(__dirname, '../../public')
    expect(existsSync(path.join(pub, 'clipper-poster.jpg'))).toBe(true)
    expect(existsSync(path.join(pub, 'clipper-foto.jpg'))).toBe(true)
  })
})
