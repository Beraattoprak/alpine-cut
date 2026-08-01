'use server'

import { headers } from 'next/headers'
import { salon } from '@/content'
import type { FormZustand } from '@/lib/formular'
import { sendeMail } from '@/lib/resend'
import { terminAnfrageSchema } from '@/lib/schema'

/**
 * Einfache Bremse gegen Gelegenheits-Spam. Sie lebt im Speicher der
 * Serverless-Funktion und wirkt daher nicht ueber mehrere Instanzen hinweg.
 * Falls das Formular ernsthaft Spam zieht, gehoert hier ein geteilter
 * Zaehler hin (Upstash Redis). Vorher waere das Ueberbau.
 */
const letzteAnfragen = new Map<string, number[]>()
const FENSTER_MS = 10 * 60 * 1000
const MAX_PRO_FENSTER = 5

function zuHaeufig(ip: string): boolean {
  const jetzt = Date.now()
  const bisher = (letzteAnfragen.get(ip) ?? []).filter((t) => jetzt - t < FENSTER_MS)
  bisher.push(jetzt)
  letzteAnfragen.set(ip, bisher)
  return bisher.length > MAX_PRO_FENSTER
}

export async function sendeTerminanfrage(
  _prev: FormZustand,
  daten: FormData,
): Promise<FormZustand> {
  const ergebnis = terminAnfrageSchema.safeParse({
    name: daten.get('name') ?? '',
    telefon: daten.get('telefon') ?? '',
    leistung: daten.get('leistung') ?? '',
    wunschtermin: daten.get('wunschtermin') ?? '',
    webseite: daten.get('webseite') ?? '',
  })

  if (!ergebnis.success) {
    const feldFehler: Record<string, string> = {}
    for (const problem of ergebnis.error.issues) {
      const feld = String(problem.path[0])
      if (feld === 'webseite') {
        // Honeypot: nicht verraten, woran es lag.
        return {
          status: 'fehler',
          feldFehler: {},
          meldung: 'Die Anfrage konnte nicht verarbeitet werden.',
        }
      }
      feldFehler[feld] ??= problem.message
    }
    return {
      status: 'fehler',
      feldFehler,
      meldung: 'Bitte prüfen Sie die markierten Felder.',
    }
  }

  const ip = (await headers()).get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unbekannt'
  if (zuHaeufig(ip)) {
    return {
      status: 'fehler',
      feldFehler: {},
      meldung: `Es sind bereits mehrere Anfragen von diesem Anschluss eingegangen. Bitte warten Sie einige Minuten oder rufen Sie uns an unter ${salon.telefon}.`,
    }
  }

  const versand = await sendeMail(ergebnis.data)

  if (!versand.ok) {
    return {
      status: 'fehler',
      feldFehler: {},
      meldung:
        versand.grund === 'konfiguration'
          ? `Der Mailversand ist auf dieser Seite noch nicht eingerichtet, Ihre Anfrage wurde nicht verschickt. Bitte rufen Sie uns an unter ${salon.telefon}.`
          : `Die Anfrage konnte nicht versendet werden. Bitte rufen Sie uns an unter ${salon.telefon} oder versuchen Sie es in einigen Minuten erneut.`,
    }
  }

  return {
    status: 'ok',
    feldFehler: {},
    meldung: 'Ihre Anfrage ist eingegangen. Wir melden uns telefonisch zur Bestätigung.',
  }
}
