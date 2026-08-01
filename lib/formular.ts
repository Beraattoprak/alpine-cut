/**
 * Zustandstyp des Terminformulars.
 *
 * Bewusst NICHT in der Server-Action-Datei: aus einem 'use server'-Modul
 * duerfen nur async Funktionen exportiert werden. Eine Konstante dort
 * bricht die Registrierung der Action und der Build scheitert beim
 * Prerendering.
 */
export type FormZustand = {
  status: 'leer' | 'ok' | 'fehler'
  feldFehler: Record<string, string>
  meldung?: string
}

export const leererZustand: FormZustand = { status: 'leer', feldFehler: {} }
