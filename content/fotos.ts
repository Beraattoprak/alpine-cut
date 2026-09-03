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
 * Fertige Arbeiten aus dem Salon. Die Formate sind bewusst nicht angeglichen:
 * die Aufnahmen kommen aus dem Telefon und werden nicht beschnitten. Wer sie
 * in einer Reihe zeigt, gibt allen dieselbe Höhe und lässt die Breite aus dem
 * Verhältnis folgen — sonst fehlt oben oder unten etwas.
 */
export const arbeiten: Foto[] = [
  {
    datei: 'herren-fade.webp',
    alt: 'Herrenschnitt, hoher Fade an der Seite, längeres Deckhaar nach hinten frisiert',
    format: '9 / 16',
    bildunterschrift: 'Fade',
  },
  {
    datei: 'herren-crop.webp',
    alt: 'Herrenschnitt, texturierter Crop mit Bart, Übergang an der Schläfe',
    format: '9 / 16',
    bildunterschrift: 'Crop mit Bart',
  },
  {
    datei: 'herren-taper.webp',
    alt: 'Herrenschnitt, weicher Übergang im Nacken, welliges Deckhaar',
    format: '3 / 4',
    bildunterschrift: 'Taper',
  },
  {
    datei: 'herren-textur.webp',
    alt: 'Herrenschnitt von hinten, langes texturiertes Deckhaar, tiefer Übergang im Nacken',
    format: '3 / 4',
    bildunterschrift: 'Textur im Deckhaar',
  },
  {
    datei: 'damen-lang.webp',
    alt: 'Damenschnitt, langes blondiertes Haar mit weichem Verlauf, von hinten',
    format: '3 / 4',
    bildunterschrift: 'Lang, blondiert',
  },
]
