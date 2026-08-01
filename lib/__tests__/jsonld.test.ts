import { describe, expect, it } from 'vitest'
import { hairSalonJsonLd } from '@/lib/jsonld'

describe('hairSalonJsonLd', () => {
  const daten = hairSalonJsonLd()
  const roh = JSON.stringify(daten)

  it('ist ein HairSalon mit Kontext', () => {
    expect(daten['@context']).toBe('https://schema.org')
    expect(daten['@type']).toBe('HairSalon')
  })

  it('traegt die gelieferten Stammdaten', () => {
    expect(daten.name).toBe('Alpine Cut')
    expect(daten.telephone).toBe('+43 676 6786333')
    expect(daten.address).toMatchObject({
      '@type': 'PostalAddress',
      streetAddress: 'Dorf-Platz 1',
      postalCode: '6263',
      addressLocality: 'Fügen',
      addressRegion: 'Tirol',
      addressCountry: 'AT',
    })
  })

  it('enthaelt nirgends das Wort TODO', () => {
    expect(roh).not.toContain('TODO')
    expect(roh.toLowerCase()).not.toContain('eintragen')
  })

  it('laesst die Oeffnungszeiten weg, solange sie offen sind', () => {
    expect(daten).not.toHaveProperty('openingHoursSpecification')
  })

  it('laesst geo weg, weil keine Koordinaten geliefert wurden', () => {
    expect(daten).not.toHaveProperty('geo')
  })

  it('laesst die E-Mail weg, solange sie offen ist', () => {
    expect(daten).not.toHaveProperty('email')
  })

  it('enthaelt keinen einzigen undefined- oder null-Wert', () => {
    for (const [schluessel, wert] of Object.entries(daten)) {
      expect(wert, schluessel).not.toBeUndefined()
      expect(wert, schluessel).not.toBeNull()
    }
  })
})
