import type { Texte } from './types'
import { todo } from './todo'

export const texte: Texte = {
  heroHeadline: 'Alpine Cut',
  heroUnterzeile: 'Friseur in Fügen, Tirol.',
  heroZweiterBlock: 'Bis ins letzte Teil.',
  heroZweiteUnterzeile: 'Werkzeug, das gepflegt wird. Arbeit, die man sieht.',
  ueberDenSalon: todo('Über den Salon: zwei bis drei Sätze eintragen'),
  metaBeschreibung: todo('Meta-Beschreibung eintragen, 140–160 Zeichen, ohne Werbefloskeln'),
}
