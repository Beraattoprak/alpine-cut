import { type Offen, todo } from './todo'

export type Foto = {
  /** Dateiname in public/fotos/, z. B. "salon-aussen.webp" */
  datei: string
  /** Was auf dem Bild zu sehen ist. Wird als alt-Text verwendet. */
  alt: string
  /** Seitenverhältnis als CSS-Wert, z. B. "4 / 3". Verhindert Layout-Sprünge. */
  format: string
  /** Kurze Bildunterschrift in der Galerie. */
  bildunterschrift: string
}

/**
 * So tragen Sie ein Foto nach:
 *   1. Original nach assets/source/fotos/ legen
 *   2. Namen in scripts/build-images.mjs in die Liste `fotos` aufnehmen
 *   3. `npm run assets:images` ausführen
 *   4. hier eintragen
 */

/** Außenansicht — trägt den Hero. */
export const heroFoto: Foto = {
  datei: 'salon-aussen.webp',
  alt: 'Der Salon von außen: Holzfassade am Dorf-Platz, das Alpine-Cut-Logo im Schaufenster',
  format: '4 / 3',
  bildunterschrift: 'Am Dorf-Platz',
}

/** Rundgang durch den Salon. Reihenfolge bestimmt den Ablauf im Abschnitt. */
export const galerie: Foto[] = [
  {
    datei: 'salon-plaetze.webp',
    alt: 'Drei Bedienplätze mit weiß-goldenen Stühlen unter einer wabenförmigen Deckenbeleuchtung',
    format: '4 / 3',
    bildunterschrift: 'Die Bedienplätze',
  },
  {
    datei: 'salon-waschen.webp',
    alt: 'Waschbereich mit zwei Waschbecken, Ringspiegeln und schwarzen Ledersesseln',
    format: '3 / 4',
    bildunterschrift: 'Waschbereich',
  },
  {
    datei: 'salon-lounge.webp',
    alt: 'Wartebereich mit schwarzen Chesterfield-Sofas und Messingfüßen am Schaufenster',
    format: '4 / 3',
    bildunterschrift: 'Warten wie im Wohnzimmer',
  },
]

/**
 * Schnittfotos für einen eigenen Abschnitt „Arbeiten" gibt es noch nicht —
 * die vorhandenen Bilder zeigen den Salon, nicht die Arbeit daran.
 */
export const arbeiten: Offen<Foto[]> = todo(
  'Schnittfotos: 5 bis 8 Bilder fertiger Frisuren, hochkant im Verhältnis 3:4, mindestens 1200 px breit. Erst damit lohnt ein eigener Abschnitt „Arbeiten“ neben der Salon-Galerie.',
)
