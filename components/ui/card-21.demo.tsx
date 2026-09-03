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
        <div className="h-64 sm:h-96">
          <MotivKarte
            eckzeichen="H"
            titel="Herren"
            aktion={offen === 'herren' ? 'Karte zurücklegen' : 'Preise ansehen'}
            ton="28 20% 11%"
            aria-expanded={offen === 'herren'}
            onClick={() => setOffen(offen === 'herren' ? null : 'herren')}
          />
        </div>
      )}

      {offen !== 'herren' && (
        <div className="h-72 sm:h-96">
          <MotivKarte
            eckzeichen="D"
            titel="Damen"
            aktion={offen === 'damen' ? 'Karte zurücklegen' : 'Preise ansehen'}
            ton="348 18% 20%"
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
        aktion="Auf der Karte zeigen"
        ton="200 18% 16%"
      />
    </div>
  )
}
