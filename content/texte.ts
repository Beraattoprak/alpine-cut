import type { Texte } from './types'
import { todo } from './todo'

export const texte: Texte = {
  heroHeadline: 'Friseur in Fügen',
  // Nennt bewusst keine Leistungen — welche angeboten werden, ist nicht bestätigt.
  // Fügen liegt im Zillertal, das ist gesichert.
  heroUnterzeile:
    'Ihr Friseur am Dorf-Platz im Zillertal. Termine nach Vereinbarung — rufen Sie an oder schicken Sie eine Anfrage.',
  ueberDenSalon: todo('Über den Salon: zwei bis drei Sätze eintragen'),
  metaBeschreibung: todo('Meta-Beschreibung eintragen, 140–160 Zeichen, ohne Werbefloskeln'),
}
