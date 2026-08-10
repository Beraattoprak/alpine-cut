import { type Offen, todo } from './todo'

export type Foto = {
  /** Dateiname in public/fotos/, z. B. "hero.jpg" */
  datei: string
  /** Was auf dem Bild zu sehen ist. Wird als alt-Text verwendet. */
  alt: string
}

/**
 * Fotoplätze. Jeder Eintrag bleibt so lange offen, bis eine Datei in
 * public/fotos/ liegt und hier eingetragen ist.
 *
 * So tragen Sie ein Foto ein:
 *   1. Datei nach public/fotos/ legen
 *   2. den todo(...)-Aufruf ersetzen, z. B.
 *      export const heroFoto: Offen<Foto> = { datei: 'hero.jpg', alt: 'Blick in den Salon' }
 */

export const heroFoto: Offen<Foto> = todo(
  'Hero-Foto: quer, mindestens 2000 px breit (3:2). Salon oder ein starker Schnitt. Nach public/fotos/ legen und in content/fotos.ts eintragen.',
)

export const arbeiten: Offen<Foto[]> = todo(
  'Arbeiten: 5 bis 8 Fotos, hochkant im Verhältnis 3:4, mindestens 1200 px breit. Nach public/fotos/ legen und als Liste in content/fotos.ts eintragen.',
)

export const salonFoto: Offen<Foto> = todo(
  'Salon-Foto: quer 16:9, mindestens 1600 px breit. Innenraum. Nach public/fotos/ legen und in content/fotos.ts eintragen.',
)
