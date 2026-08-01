import type { Leistungskategorie } from './types'
import { type Offen, todo } from './todo'

export const leistungen: Offen<Leistungskategorie[]> = todo(
  'Leistungen mit Preisen eintragen, z. B. { titel: "Damen", leistungen: [{ bezeichnung: "Schnitt", preis: "45 €" }] }',
)
