import { describe, expect, it } from 'vitest'
import { istOffen, offeneHinweise, todo } from '@/content/todo'

describe('todo-Marker', () => {
  it('erkennt einen Marker als offen', () => {
    expect(istOffen(todo('Preise eintragen'))).toBe(true)
  })

  it('erkennt echte Werte als nicht offen', () => {
    expect(istOffen('Damenhaarschnitt')).toBe(false)
    expect(istOffen(0)).toBe(false)
    expect(istOffen(null as unknown as string)).toBe(false)
    expect(istOffen([])).toBe(false)
  })

  it('sammelt jeden angelegten Hinweis', () => {
    const vorher = offeneHinweise().length
    todo('Team ergaenzen')
    todo('Oeffnungszeiten ergaenzen')
    expect(offeneHinweise().length).toBe(vorher + 2)
    expect(offeneHinweise()).toContain('Team ergaenzen')
  })

  it('traegt den Hinweistext im Marker', () => {
    const m = todo('Telefonnummer pruefen')
    expect(istOffen(m) && m.hinweis).toBe('Telefonnummer pruefen')
  })
})
