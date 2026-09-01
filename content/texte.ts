import type { Texte } from './types'
import { todo } from './todo'

export const texte: Texte = {
  heroHeadline: 'Friseur in Fügen',
  // Kein Termin, keine Anfrage: Der Salon nimmt Laufkundschaft.
  heroUnterzeile: 'Kein Termin nötig. Kommen Sie einfach vorbei — Dorf-Platz 1, mitten im Ort.',
  ueberDenSalon: todo('Über den Salon: zwei bis drei Sätze eintragen'),
  metaBeschreibung: todo('Meta-Beschreibung eintragen, 140–160 Zeichen, ohne Werbefloskeln'),
}
