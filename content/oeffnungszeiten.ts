import type { Oeffnungstag } from './types'
import { type Offen, todo } from './todo'

export const oeffnungszeiten: Offen<Oeffnungstag[]> = todo(
  'Öffnungszeiten eintragen: für jeden Wochentag { tag: "Montag", zeiten: "09:00–18:00" } oder zeiten: null für geschlossen',
)
