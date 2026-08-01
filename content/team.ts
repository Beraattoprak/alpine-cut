import type { Teammitglied } from './types'
import { type Offen, todo } from './todo'

export const team: Offen<Teammitglied[]> = todo(
  'Team eintragen: Namen und Rollen, z. B. { name: "…", rolle: "Inhaberin" }',
)
