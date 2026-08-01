import { Resend } from 'resend'
import { salon } from '@/content'
import type { TerminAnfrage } from './schema'

export type Versandergebnis = { ok: true } | { ok: false; grund: 'konfiguration' | 'versand' }

export function mailtext(a: TerminAnfrage): string {
  return [
    'Neue Terminanfrage über die Website.',
    '',
    `Name:           ${a.name}`,
    `Telefon:        ${a.telefon}`,
    `Wunschleistung: ${a.leistung}`,
    `Wunschtermin:   ${a.wunschtermin}`,
    '',
    `Eingegangen: ${new Date().toLocaleString('de-AT')}`,
  ].join('\n')
}

export async function sendeMail(a: TerminAnfrage): Promise<Versandergebnis> {
  const key = process.env.RESEND_API_KEY
  const an = process.env.ANFRAGE_EMPFAENGER
  const von = process.env.ANFRAGE_ABSENDER

  if (!key || !an || !von) return { ok: false, grund: 'konfiguration' }

  try {
    const { error } = await new Resend(key).emails.send({
      from: `${salon.name} <${von}>`,
      to: [an],
      subject: `Terminanfrage: ${a.name}`,
      text: mailtext(a),
    })
    return error ? { ok: false, grund: 'versand' } : { ok: true }
  } catch {
    return { ok: false, grund: 'versand' }
  }
}
