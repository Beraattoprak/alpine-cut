import type { Salon } from './types'
import { todo } from './todo'

export const salon: Salon = {
  name: 'Alpine Cut',
  strasse: 'Dorf-Platz 1',
  plz: '6263',
  ort: 'Fügen',
  region: 'Tirol',
  land: 'AT',
  telefon: '+43 676 6786333',
  telefonHref: 'tel:+436766786333',
  email: todo('E-Mail-Adresse des Salons eintragen — auch Empfänger der Terminanfragen'),
}
