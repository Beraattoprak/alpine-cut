import { z } from 'zod'

const TELEFON = /^[+(0-9][0-9 /()+-]{5,}$/

function heuteAlsIso(): string {
  const jetzt = new Date()
  const versatz = jetzt.getTimezoneOffset() * 60_000
  return new Date(jetzt.getTime() - versatz).toISOString().slice(0, 10)
}

export const terminAnfrageSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Bitte geben Sie Ihren Namen an, mindestens zwei Zeichen.')
    .max(80, 'Der Name ist zu lang. Bitte auf 80 Zeichen kürzen.'),

  telefon: z
    .string()
    .trim()
    .min(6, 'Die Telefonnummer ist zu kurz. Bitte mit Vorwahl angeben, zum Beispiel 0512 123456.')
    .regex(
      TELEFON,
      'Diese Telefonnummer enthält unerlaubte Zeichen. Erlaubt sind Ziffern, Leerzeichen und die Zeichen + / ( ) und -.',
    ),

  leistung: z.string().trim().min(1, 'Bitte wählen Sie eine Leistung aus der Liste.'),

  wunschtermin: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Bitte wählen Sie ein Datum aus.')
    .refine(
      (d) => d >= heuteAlsIso(),
      'Der Wunschtermin liegt in der Vergangenheit. Bitte wählen Sie ein Datum ab heute.',
    ),

  /** Honeypot. Menschen sehen dieses Feld nicht, Bots füllen es aus. */
  webseite: z.string().max(0),
})

export type TerminAnfrage = z.infer<typeof terminAnfrageSchema>
