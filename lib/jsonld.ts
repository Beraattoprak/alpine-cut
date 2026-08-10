import { istOffen, oeffnungszeiten, salon } from '@/content'
import { SITE_URL } from './site'

const TAG_ZU_SCHEMA: Record<string, string> = {
  Montag: 'Monday',
  Dienstag: 'Tuesday',
  Mittwoch: 'Wednesday',
  Donnerstag: 'Thursday',
  Freitag: 'Friday',
  Samstag: 'Saturday',
  Sonntag: 'Sunday',
}

/**
 * Baut das LocalBusiness-Schema aus content/.
 *
 * Offene Felder werden WEGGELASSEN, nie mit Platzhaltern gefuellt — sonst
 * stuende "TODO: Öffnungszeiten eintragen" in Googles strukturierten Daten.
 */
export function hairSalonJsonLd(): Record<string, unknown> {
  const daten: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'HairSalon',
    name: salon.name,
    url: SITE_URL,
    // Solange keine echten Salonfotos vorliegen, steht hier das Logo.
    // Ein Bild ist Pflicht; erfinden laesst sich keines.
    image: `${SITE_URL}/logo-gross.png`,
    telephone: salon.telefon,
    sameAs: [salon.instagram],
    address: {
      '@type': 'PostalAddress',
      streetAddress: salon.strasse,
      postalCode: salon.plz,
      addressLocality: salon.ort,
      addressRegion: salon.region,
      addressCountry: salon.land,
    },
  }

  if (!istOffen(salon.email)) daten.email = salon.email

  if (!istOffen(oeffnungszeiten)) {
    const offen = oeffnungszeiten
      .filter((t) => t.zeiten !== null)
      .map((t) => {
        const [von, bis] = t.zeiten!.split(/\s*[–-]\s*/)
        return {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: `https://schema.org/${TAG_ZU_SCHEMA[t.tag]}`,
          opens: von,
          closes: bis,
        }
      })
    if (offen.length > 0) daten.openingHoursSpecification = offen
  }

  return daten
}
