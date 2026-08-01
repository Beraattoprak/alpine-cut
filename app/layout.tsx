import type { Metadata } from 'next'
import { Instrument_Serif } from 'next/font/google'
import { GeistSans } from 'geist/font/sans'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { istOffen, salon, texte } from '@/content'
import { hairSalonJsonLd } from '@/lib/jsonld'
import { SITE_URL } from '@/lib/site'
import './globals.css'

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-instrument-serif',
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
    // suppressHydrationWarning: Das Inline-Skript unten setzt data-scrub vor
    // der Hydration. React hydratisiert auch <html> und wuerde das unbekannte
    // Attribut sonst als Mismatch melden. Gilt nur eine Ebene tief, also genau
    // fuer dieses Element.
    <html
      lang="de"
      suppressHydrationWarning
      className={`${instrumentSerif.variable} ${GeistSans.variable}`}
    >
      <head>
        {/* Kein Preload von clip-000: der Link wuerde auch dort laden, wo gar
            nicht gescrubbt wird. Das Poster zeigt ohnehin denselben Frame und
            wird bereits mit priority geladen. */}
        <script
          // Setzt data-scrub VOR dem ersten Paint. Ohne das springen die beiden
          // Hero-Textbloecke nach der Hydration von untereinander auf uebereinander.
          dangerouslySetInnerHTML={{
            __html:
              "try{var m=window.matchMedia,c=navigator.connection;" +
              "if(m('(min-width:768px)').matches&&m('(prefers-reduced-motion: no-preference)').matches&&!(c&&c.saveData))" +
              "document.documentElement.dataset.scrub='an'}catch(e){}",
          }}
        />
      </head>
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
