import * as React from 'react'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

import { cn } from '@/lib/utils'

/**
 * Motivkarte: ruhige Farbfläche in der Tonart der Karte, Titel, unten eine
 * Handlungszeile. Wahlweise mit Foto dahinter (`bild`) oder als Spielkarte
 * (`eckzeichen`) — dann trägt eine feine Goldlinie als Rahmen und ein
 * Eckzeichen oben links und unten rechts kopfstehend.
 *
 * Herkunft ist der Baustein „card-21“ (DestinationCard) von 21st.dev. Fünf
 * Sachen daran sind hier anders, alle aus einem Grund:
 *
 *  1. Die Vorlage setzt den Schlagschatten als Inline-Style UND als
 *     `group-hover:shadow-[…]`-Klasse. Inline schlägt Klasse, also kam der
 *     Hover-Schein nie an. Beides läuft jetzt über eine CSS-Variable.
 *  2. Das Foto lag als `background-image: url(…)` auf einem div. Damit gibt es
 *     keine Größenangabe, kein Lazy-Loading und keine ausgelieferte
 *     Zwischengröße. Hier steht `next/image` mit `fill` und `sizes`.
 *  3. Die Vorlage ist immer ein Link. Eine Karte, die etwas aufklappt, ist
 *     aber ein `button`. Ohne `href` wird daraus einer.
 *  4. Sichtbar war die Karte nur beim Überfahren mit der Maus. Wer mit der
 *     Tastatur unterwegs ist, bekam nichts. `focus-visible` zieht jetzt
 *     denselben Zustand.
 *  5. Das Foto war Pflicht. Ohne Bild trägt die Karte sich über Schrift und
 *     Linie allein, und keine Zeichnung kann daneben liegen.
 *
 * `ton` ist ein HSL-Tripel ohne Klammern, z. B. "28 20% 11%".
 */
type MotivKarteBasis = {
  titel: string
  /** Beschriftung der Handlungszeile. */
  aktion: string
  /** HSL-Tripel ohne Klammern, z. B. "28 20% 11%". */
  ton: string
  /** Pfad unter public/, z. B. "/fotos/herren-fade.webp". Ohne Bild bleibt die Fläche ruhig. */
  bild?: string
  /** Was auf dem Bild zu sehen ist. Pflicht, sobald `bild` gesetzt ist. */
  bildAlt?: string
  /** Ein bis zwei Zeichen in den Ecken, wie der Index einer Spielkarte. */
  eckzeichen?: string
  className?: string
}

type MotivKarteProps = MotivKarteBasis &
  (
    | ({ href: string } & Omit<React.ComponentPropsWithoutRef<'a'>, keyof MotivKarteBasis | 'href'>)
    | ({ href?: undefined } & Omit<React.ComponentPropsWithoutRef<'button'>, keyof MotivKarteBasis>)
  )

export const MotivKarte = React.forwardRef<HTMLElement, MotivKarteProps>(function MotivKarte(
  { bild, bildAlt, eckzeichen, titel, aktion, ton, className, href, ...rest },
  ref,
) {
  const inhalt = (
    <>
      {bild ? (
        <>
          <Image
            src={bild}
            alt={bildAlt ?? ''}
            fill
            sizes="(min-width: 768px) 20rem, 90vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 group-focus-visible:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
          {/* Farbschleier. Unten deckend, damit die Schrift auf jedem Foto trägt. */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, hsl(var(--ton) / 0.96), hsl(var(--ton) / 0.72) 42%, hsl(var(--ton) / 0.3) 100%)',
            }}
          />
        </>
      ) : null}

      {eckzeichen ? (
        <>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-3 rounded-lg border border-[hsl(38_45%_62%/0.38)]"
          />
          <span
            aria-hidden
            className="font-display absolute top-6 left-6 text-sm leading-none font-bold tracking-wide text-[hsl(38_45%_68%/0.85)]"
          >
            {eckzeichen}
          </span>
          <span
            aria-hidden
            className="font-display absolute right-6 bottom-6 rotate-180 text-sm leading-none font-bold tracking-wide text-[hsl(38_45%_68%/0.85)]"
          >
            {eckzeichen}
          </span>
        </>
      ) : null}

      <div
        className={cn(
          'relative grid h-full gap-3 p-6 text-white',
          eckzeichen ? 'grid-rows-[1fr_auto_1fr] place-items-center text-center' : 'items-start justify-items-start content-end text-left',
        )}
      >
        <h3
          className={cn(
            'font-display leading-none font-bold tracking-tight',
            eckzeichen ? 'row-start-2 text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl',
          )}
        >
          {titel}
        </h3>

        <span
          className={cn(
            'flex items-center gap-2 border border-white/25 bg-white/10 text-xs font-semibold tracking-widest uppercase transition-colors duration-300 group-hover:bg-white/20 group-focus-visible:bg-white/20',
            eckzeichen
              ? 'row-start-3 self-start rounded-full px-4 py-2'
              : 'w-full justify-between rounded-lg px-4 py-3',
          )}
        >
          {aktion}
          <ArrowRight
            aria-hidden
            className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
          />
        </span>
      </div>
    </>
  )

  const gemeinsam = {
    style: { '--ton': ton } as React.CSSProperties,
    className: cn(
      'group relative block h-full w-full overflow-hidden rounded-2xl text-left',
      'bg-[hsl(var(--ton))]',
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
