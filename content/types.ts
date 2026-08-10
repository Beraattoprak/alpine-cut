import type { Offen } from './todo'

export type Salon = {
  name: string
  strasse: string
  plz: string
  ort: string
  region: string
  land: string
  telefon: string
  telefonHref: string
  instagram: string
  instagramHandle: string
  email: Offen<string>
}

export type Leistung = { bezeichnung: string; preis: string; hinweis?: string }
export type Leistungskategorie = { titel: string; leistungen: Leistung[] }
export type Teammitglied = { name: string; rolle: string }

export type Wochentag =
  | 'Montag'
  | 'Dienstag'
  | 'Mittwoch'
  | 'Donnerstag'
  | 'Freitag'
  | 'Samstag'
  | 'Sonntag'

/** `zeiten: null` bedeutet geschlossen. */
export type Oeffnungstag = { tag: Wochentag; zeiten: string | null }

export type Texte = {
  heroHeadline: string
  heroUnterzeile: string
  ueberDenSalon: Offen<string>
  metaBeschreibung: Offen<string>
}
