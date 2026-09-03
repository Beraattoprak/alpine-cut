'use client'

import { useState } from 'react'

import { MotivKarte } from '@/components/ui/card-21'

/**
 * Die beiden Preiskärtchen. Ein Klick klappt eines auf; das andere tritt ab,
 * damit die Damentabelle mit ihren fünf Spalten die volle Breite bekommt.
 *
 * Warum `button` und nicht `a`: Umdrehen wechselt einen Zustand, es führt
 * nicht woandershin. Und warum `hidden` statt nur weggeblendet: eine Karte,
 * die man nicht sieht, darf auch nicht im Vorlesebaum stehen und kein Tabstopp
 * sein.
 */
export function Preiskarten() {
  const [offen, setOffen] = useState<'herren' | 'damen' | null>(null)

  return (
    <div className="grid gap-3 sm:grid-cols-2 sm:data-[gewaehlt]:grid-cols-1" data-gewaehlt={offen ?? undefined}>
      {offen !== 'damen' && (
        <div className="h-72 sm:h-96">
          <MotivKarte
            bild="/fotos/herren-fade.webp"
            bildAlt="Herrenschnitt mit hohem Fade an der Seite"
            titel="Herren"
            zeile="10 Leistungen · ab 5 €"
            aktion={offen === 'herren' ? 'Karte zurücklegen' : 'Preise ansehen'}
            ton="30 22% 13%"
            aria-expanded={offen === 'herren'}
            onClick={() => setOffen(offen === 'herren' ? null : 'herren')}
          />
        </div>
      )}

      {offen !== 'herren' && (
        <div className="h-72 sm:h-96">
          <MotivKarte
            bild="/fotos/damen-lang.webp"
            bildAlt="Damenschnitt, langes blondiertes Haar mit weichem Verlauf"
            titel="Damen"
            zeile="4 Behandlungen · ab 25 €"
            aktion={offen === 'damen' ? 'Karte zurücklegen' : 'Preise ansehen'}
            ton="18 26% 18%"
            aria-expanded={offen === 'damen'}
            onClick={() => setOffen(offen === 'damen' ? null : 'damen')}
          />
        </div>
      )}
    </div>
  )
}

/** Als Verweis statt als Schalter: dann wird aus der Karte ein `a`. */
export function KarteAlsVerweis() {
  return (
    <div className="h-96 w-full max-w-80">
      <MotivKarte
        href="#anfahrt"
        bild="/fotos/salon-aussen.webp"
        bildAlt="Der Salon von außen, Holzfassade am Dorf-Platz"
        titel="Anfahrt"
        zeile="Dorf-Platz 1 · 6263 Fügen"
        aktion="Auf der Karte zeigen"
        ton="200 18% 16%"
      />
    </div>
  )
}
