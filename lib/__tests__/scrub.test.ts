import { describe, expect, it } from 'vitest'
import {
  annaehern,
  frameIndex,
  fortschritt,
  glaettungsFaktor,
  LETZTER_FRAME,
  naechstePhase,
  pfadFuerFrame,
  verfuegbarerFrame,
} from '@/lib/scrub'

describe('fortschritt', () => {
  it('ist 0, solange die Bühne noch nicht erreicht ist', () => {
    expect(fortschritt(500, 1000)).toBe(0)
  })

  it('ist 1, sobald die Strecke durchlaufen ist', () => {
    expect(fortschritt(-1000, 1000)).toBe(1)
  })

  it('läuft linear durch die Mitte', () => {
    expect(fortschritt(-250, 1000)).toBeCloseTo(0.25)
    expect(fortschritt(-750, 1000)).toBeCloseTo(0.75)
  })

  it('klemmt jenseits beider Enden, statt zu überlaufen', () => {
    expect(fortschritt(-5000, 1000)).toBe(1)
    expect(fortschritt(9999, 1000)).toBe(0)
  })

  it('liefert 0 statt NaN, wenn es keine Scrollstrecke gibt', () => {
    expect(fortschritt(-10, 0)).toBe(0)
  })
})

describe('glaettungsFaktor', () => {
  it('entspricht bei 60 Hz genau der Grundglättung', () => {
    expect(glaettungsFaktor(1000 / 60)).toBeCloseTo(0.12, 5)
  })

  it('ist bei 120 Hz kleiner, damit die Glättung nicht doppelt so schnell läuft', () => {
    expect(glaettungsFaktor(1000 / 120)).toBeLessThan(0.12)
  })

  it('führt bei zwei 120-Hz-Schritten zum selben Ergebnis wie ein 60-Hz-Schritt', () => {
    const ziel = 1
    let a = 0
    a = a + (ziel - a) * glaettungsFaktor(1000 / 120)
    a = a + (ziel - a) * glaettungsFaktor(1000 / 120)
    const b = 0 + (ziel - 0) * glaettungsFaktor(1000 / 60)
    expect(a).toBeCloseTo(b, 6)
  })

  it('deckelt lange Pausen, damit ein Tab-Wechsel nicht durchschlägt', () => {
    expect(glaettungsFaktor(10_000)).toBe(glaettungsFaktor(100))
  })
})

describe('annaehern', () => {
  it('bewegt sich auf das Ziel zu, ohne es zu überschießen', () => {
    const n = annaehern(0, 1, 1000 / 60)
    expect(n).toBeGreaterThan(0)
    expect(n).toBeLessThan(1)
  })

  it('funktioniert abwärts genauso wie aufwärts — Rückwärtsscrollen', () => {
    const rauf = annaehern(0, 1, 1000 / 60)
    const runter = annaehern(1, 0, 1000 / 60)
    expect(runter).toBeCloseTo(1 - rauf, 10)
  })

  it('bleibt stehen, wenn Ziel und Ist gleich sind', () => {
    expect(annaehern(0.4, 0.4, 1000 / 60)).toBeCloseTo(0.4, 10)
  })
})

describe('frameIndex', () => {
  it('bildet die Enden exakt ab', () => {
    expect(frameIndex(0)).toBe(0)
    expect(frameIndex(1)).toBe(LETZTER_FRAME)
  })

  it('bildet die Mitte auf die Mitte ab', () => {
    expect(frameIndex(0.5)).toBe(72)
  })

  it('klemmt außerhalb von 0..1', () => {
    expect(frameIndex(-3)).toBe(0)
    expect(frameIndex(7)).toBe(LETZTER_FRAME)
  })

  it('ist streng monoton — rückwärts entstehen dieselben Indizes', () => {
    const vorwaerts: number[] = []
    for (let i = 0; i <= 100; i++) vorwaerts.push(frameIndex(i / 100))
    const rueckwaerts: number[] = []
    for (let i = 100; i >= 0; i--) rueckwaerts.push(frameIndex(i / 100))
    expect(rueckwaerts.reverse()).toEqual(vorwaerts)
  })
})

describe('naechstePhase', () => {
  it('schaltet aufwärts erst oberhalb von 0,55 um', () => {
    expect(naechstePhase(0.5, 'a')).toBe('a')
    expect(naechstePhase(0.56, 'a')).toBe('b')
  })

  it('schaltet abwärts erst unterhalb von 0,45 zurück — Rückwärtsscrollen', () => {
    expect(naechstePhase(0.5, 'b')).toBe('b')
    expect(naechstePhase(0.44, 'b')).toBe('a')
  })

  it('hält im toten Band die bisherige Phase, egal aus welcher Richtung', () => {
    expect(naechstePhase(0.5, 'a')).toBe('a')
    expect(naechstePhase(0.5, 'b')).toBe('b')
  })

  it('kehrt über einen vollen Hin- und Rückweg wieder zu a zurück', () => {
    let phase = naechstePhase(0, 'a')
    for (let i = 0; i <= 100; i++) phase = naechstePhase(i / 100, phase)
    expect(phase).toBe('b')
    for (let i = 100; i >= 0; i--) phase = naechstePhase(i / 100, phase)
    expect(phase).toBe('a')
  })
})

describe('verfuegbarerFrame', () => {
  it('nimmt den gewünschten Frame, wenn er geladen ist', () => {
    const geladen = [true, true, true]
    expect(verfuegbarerFrame(2, geladen)).toBe(2)
  })

  it('fällt auf den nächstniedrigeren geladenen zurück, statt ein Loch zu zeigen', () => {
    const geladen = [true, true, false, false]
    expect(verfuegbarerFrame(3, geladen)).toBe(1)
  })

  it('liefert null, solange gar nichts geladen ist', () => {
    expect(verfuegbarerFrame(5, [false, false])).toBeNull()
  })

  it('läuft nicht über das Ende des Arrays hinaus', () => {
    expect(verfuegbarerFrame(99, [true])).toBe(0)
  })
})

describe('pfadFuerFrame', () => {
  it('füllt die Nummer dreistellig auf', () => {
    expect(pfadFuerFrame(0)).toBe('/frames/clip-000.webp')
    expect(pfadFuerFrame(7)).toBe('/frames/clip-007.webp')
    expect(pfadFuerFrame(144)).toBe('/frames/clip-144.webp')
  })
})
