import type { Metadata } from 'next'
import { Instrument_Serif } from 'next/font/google'
import { GeistSans } from 'geist/font/sans'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import './globals.css'

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-instrument-serif',
})

export const metadata: Metadata = {
  title: 'Alpine Cut',
  description: 'Friseur in Fügen, Tirol.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${instrumentSerif.variable} ${GeistSans.variable}`}>
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
        <SiteHeader />
        <main id="inhalt">{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}
