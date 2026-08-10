import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import { GeistSans } from 'geist/font/sans'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { istOffen, salon, texte } from '@/content'
import { hairSalonJsonLd } from '@/lib/jsonld'
import { SITE_URL } from '@/lib/site'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '700'],
  display: 'swap',
  variable: '--font-space-grotesk',
})

// Solange die Meta-Beschreibung offen ist, wird sie aus echten Daten
// zusammengesetzt — Adresse und Telefon sind bekannt, erfunden wird nichts.
// Ein TODO-Marker im <meta>-Tag waere fuer Suchmaschinen schlicht Muell.
const beschreibung = istOffen(texte.metaBeschreibung)
  ? `${salon.name} — Friseur in ${salon.ort}, ${salon.region}. ${salon.strasse}, ${salon.plz} ${salon.ort}. Telefon ${salon.telefon}.`
  : texte.metaBeschreibung

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${salon.name} — Friseur in ${salon.ort}`,
    template: `%s — ${salon.name}`,
  },
  description: beschreibung,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'de_AT',
    siteName: salon.name,
    title: `${salon.name} — Friseur in ${salon.ort}`,
    description: beschreibung,
    url: SITE_URL,
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${spaceGrotesk.variable} ${GeistSans.variable}`}>
      <body className="antialiased">
        <a className="skip-link" href="#inhalt">
          Zum Inhalt springen
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(hairSalonJsonLd()) }}
        />
        <SiteHeader />
        <main id="inhalt">{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}
