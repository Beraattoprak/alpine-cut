import * as React from 'react'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

import { cn } from '@/lib/utils'

/**
 * Motivkarte: Foto, Farbschleier in der Tonart der Karte, Titel, eine Zeile
 * Beiwerk, unten eine Handlungszeile.
 *
 * Herkunft ist der Baustein „card-21“ (DestinationCard) von 21st.dev. Vier
 * Sachen daran sind hier anders, alle aus einem Grund:
 *
 *  1. Die Vorlage setzt den Schlagschatten als Inline-Style UND als
 *     `group-hover:shadow-[…]`-Klasse. Inline schlaegt Klasse, also kam der
 *     Hover-Schein nie an. Beides laeuft jetzt ueber CSS-Variablen.
 *  2. Das Foto lag als `background-image: url(…)` auf einem div. Damit gibt es
 *     keine Groessenangabe, kein Lazy-Loading und keine ausgelieferte
 *     Zwischengroesse. Hier steht `next/image` mit `fill` und `sizes`.
 *  3. Die Vorlage ist immer ein Link. Eine Karte, die etwas aufklappt, ist
 *     aber ein `button`. Ohne `href` wird daraus einer.
 *  4. Sichtbar war die Karte nur beim Ueberfahren mit der Maus. Wer mit der
 *     Tastatur unterwegs ist, bekam nichts. `focus-visible` zieht jetzt
 *     denselben Zustand.
 *
 * `ton` ist ein HSL-Tripel ohne Klammern, z. B. "30 22% 13%".
 */
type MotivKarteBasis = {
  /** Pfad unter public/, z. B. "/fotos/herren-fade.webp" */
  bild: string
  /** Was auf dem Bild zu sehen ist. Leer lassen, wenn es reine Deko ist. */
  bildAlt: string
  titel: string
  /** Eine Zeile darunter, z. B. "10 Leistungen · ab 5 €". */
  zeile?: string
  /** Beschriftung der Handlungszeile. */
  aktion: string
  /** HSL-Tripel ohne Klammern, z. B. "30 22% 13%". */
  ton: string
  className?: string
}

type MotivKarteProps = MotivKarteBasis &
  (
    | ({ href: string } & Omit<React.ComponentPropsWithoutRef<'a'>, keyof MotivKarteBasis | 'href'>)
    | ({ href?: undefined } & Omit<React.ComponentPropsWithoutRef<'button'>, keyof MotivKarteBasis>)
  )

export const MotivKarte = React.forwardRef<HTMLElement, MotivKarteProps>(function MotivKarte(
  { bild, bildAlt, titel, zeile, aktion, ton, className, href, ...rest },
  ref,
) {
  const inhalt = (
    <>
      <Image
        src={bild}
        alt={bildAlt}
        fill
        sizes="(min-width: 768px) 20rem, 90vw"
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 group-focus-visible:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
      />

      {/* Farbschleier. Unten deckend, damit die Schrift auf jedem Foto traegt. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, hsl(var(--ton) / 0.96), hsl(var(--ton) / 0.72) 42%, hsl(var(--ton) / 0.3) 100%)',
        }}
      />

      <div className="relative flex h-full flex-col items-start justify-end gap-1 p-5 text-left text-white sm:p-6">
        <h3 className="font-display text-2xl leading-none font-bold tracking-tight sm:text-3xl">
          {titel}
        </h3>
        {zeile ? <p className="text-sm text-white/80">{zeile}</p> : null}

        <span className="mt-5 flex w-full items-center justify-between gap-2 rounded-lg border border-white/30 bg-white/15 px-4 py-3 text-sm font-semibold tracking-wide transition-colors duration-300 group-hover:bg-white/25 group-focus-visible:bg-white/25">
          {aktion}
          <ArrowRight
            aria-hidden
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
          />
        </span>
      </div>
    </>
  )

  const gemeinsam = {
    style: { '--ton': ton } as React.CSSProperties,
    className: cn(
      'group relative block h-full w-full overflow-hidden rounded-2xl text-left',
      'shadow-[0_18px_40px_-24px_hsl(var(--ton)/0.9)] transition-shadow duration-500',
      'hover:shadow-[0_26px_60px_-26px_hsl(var(--ton))]',
      'focus-visible:shadow-[0_26px_60px_-26px_hsl(var(--ton))]',
      'motion-reduce:transition-none',
      className,
    ),
  }

  return href ? (
    <a
      ref={ref as React.Ref<HTMLAnchorElement>}
      href={href}
      {...gemeinsam}
      {...(rest as React.ComponentPropsWithoutRef<'a'>)}
    >
      {inhalt}
    </a>
  ) : (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type="button"
      {...gemeinsam}
      {...(rest as React.ComponentPropsWithoutRef<'button'>)}
    >
      {inhalt}
    </button>
  )
})
