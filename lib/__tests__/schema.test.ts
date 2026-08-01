import { describe, expect, it } from 'vitest'
import { terminAnfrageSchema } from '@/lib/schema'

const morgen = () => {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().slice(0, 10)
}

const gueltig = {
  name: 'Maria Huber',
  telefon: '0512 123456',
  leistung: 'Damenhaarschnitt',
  wunschtermin: morgen(),
  webseite: '',
}

describe('terminAnfrageSchema', () => {
  it('nimmt eine vollstaendige Anfrage an', () => {
    expect(terminAnfrageSchema.safeParse(gueltig).success).toBe(true)
  })

  it('nennt beim Namen, was fehlt', () => {
    const r = terminAnfrageSchema.safeParse({ ...gueltig, name: 'A' })
    expect(r.success).toBe(false)
    expect(r.error!.issues[0].message).toContain('mindestens zwei Zeichen')
  })

  it('nennt bei zu kurzer Telefonnummer ein Beispiel', () => {
    const r = terminAnfrageSchema.safeParse({ ...gueltig, telefon: '0512' })
    expect(r.success).toBe(false)
    expect(r.error!.issues[0].message).toContain('0512 123456')
  })

  it('akzeptiert internationale Schreibweisen', () => {
    for (const t of ['+43 676 6786333', '0043/676/6786333', '(0512) 123-456']) {
      expect(terminAnfrageSchema.safeParse({ ...gueltig, telefon: t }).success, t).toBe(true)
    }
  })

  it('weist Buchstaben in der Telefonnummer zurueck', () => {
    const r = terminAnfrageSchema.safeParse({ ...gueltig, telefon: 'ruf mich an' })
    expect(r.success).toBe(false)
    expect(r.error!.issues.some((i) => i.message.includes('unerlaubte Zeichen'))).toBe(true)
  })

  it('verlangt eine Leistung', () => {
    const r = terminAnfrageSchema.safeParse({ ...gueltig, leistung: '' })
    expect(r.success).toBe(false)
    expect(r.error!.issues[0].message).toContain('Leistung')
  })

  it('weist einen Termin in der Vergangenheit zurueck', () => {
    const r = terminAnfrageSchema.safeParse({ ...gueltig, wunschtermin: '2020-01-01' })
    expect(r.success).toBe(false)
    expect(r.error!.issues[0].message).toContain('Vergangenheit')
  })

  it('akzeptiert den heutigen Tag', () => {
    const jetzt = new Date()
    const heute = new Date(jetzt.getTime() - jetzt.getTimezoneOffset() * 60_000)
      .toISOString()
      .slice(0, 10)
    expect(terminAnfrageSchema.safeParse({ ...gueltig, wunschtermin: heute }).success).toBe(true)
  })

  it('weist einen ausgefuellten Honeypot zurueck', () => {
    const r = terminAnfrageSchema.safeParse({ ...gueltig, webseite: 'http://spam.example' })
    expect(r.success).toBe(false)
  })
})
