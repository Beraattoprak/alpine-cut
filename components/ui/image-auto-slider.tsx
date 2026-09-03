import Image from 'next/image'

import { cn } from '@/lib/utils'

export type BandBild = {
  /** Pfad ab /public, z. B. "/fotos/herren-fade.webp" */
  src: string
  /** Was auf dem Bild zu sehen ist. */
  alt: string
  /** Seitenverhältnis als CSS-Wert, z. B. "3 / 4". Bestimmt die Breite. */
  format: string
}

export type ImageAutoSliderProps = {
  bilder: BandBild[]
  /** Umlaufdauer einer Spur in Sekunden. */
  dauer?: number
  className?: string
}

/**
 * Waagrecht laufendes Bilderband mit nahtlosem Umlauf.
 *
 * Zwei identische Spuren nebeneinander: sobald die erste um 100 % ihrer eigenen
 * Breite nach links gewandert ist, steht die zweite exakt an deren
 * Ausgangsposition. Das ist derselbe Aufbau wie beim Text-{@link Laufband}.
 *
 * Nicht: eine Spur mit doppeltem Inhalt und translateX(-50%). Der Abstand
 * zwischen den Kacheln fällt dabei einmal unter den Tisch — bei acht Bildern
 * und 1,5 rem Abstand springt das Band bei jedem Umlauf um 12 px. Deshalb
 * trägt hier jede Kachel ihren Abstand als eigenen Rand, und die Spur ist
 * genau so breit wie ein Durchlauf.
 *
 * Alle Bilder sind gleich hoch, die Breite folgt aus dem Seitenverhältnis.
 * So stehen unterschiedliche Formate ohne Beschnitt nebeneinander.
 *
 * Nur die erste Spur ist für Screenreader lesbar.
 */
export function ImageAutoSlider({ bilder, dauer = 40, className }: ImageAutoSliderProps) {
  const spur = (versteckt: boolean) => (
    <ul
      className="bilderband-spur"
      aria-hidden={versteckt || undefined}
      style={{ animationDuration: `${dauer}s` }}
    >
      {bilder.map((bild, i) => (
        <li key={`${bild.src}-${i}`} className="bilderband-kachel">
          <Image
            src={bild.src}
            alt={versteckt ? '' : bild.alt}
            width={1200}
            height={1600}
            sizes="(max-width: 640px) 60vw, 30vw"
            className="h-full w-auto object-contain"
            style={{ aspectRatio: bild.format }}
            priority={!versteckt && i < 2}
          />
        </li>
      ))}
    </ul>
  )

  return (
    <div className={cn('bilderband', className)}>
      {spur(false)}
      {spur(true)}
    </div>
  )
}
