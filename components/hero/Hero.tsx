'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { texte } from '@/content'
import { ScrubCanvas } from './ScrubCanvas'

export function Hero() {
  const buehne = useRef<HTMLElement>(null)

  return (
    <section ref={buehne} className="stage" aria-label="Alpine Cut">
      <div className="pin">
        <div className="hero-buehne">
          {/* Der Rahmen hat exakt das Seitenverhaeltnis der Quelle und wird nie
              breiter als sie. Sonst zieht der Canvas das Bild in die Form der
              Buehne — hochskaliert und verzerrt. */}
          <div className="hero-rahmen">
            <Image
              src="/clipper-poster.jpg"
              alt=""
              fill
              priority
              sizes="(min-width: 1276px) 1276px, 100vw"
              className="hero-poster"
              data-testid="hero-poster"
            />
            <ScrubCanvas buehne={buehne} />
            <noscript>
              {/* Ohne JavaScript verdeckt nichts das Poster. */}
              <style>{`.hero-canvas{display:none}`}</style>
            </noscript>
          </div>
        </div>

        <div className="container-seite hero-texte">
          <div data-testid="hero-text-a" className="hero-text hero-text-a">
            <h1>{texte.heroHeadline}</h1>
            <p className="lead mt-4 text-fg-muted">{texte.heroUnterzeile}</p>
          </div>
          <div data-testid="hero-text-b" className="hero-text hero-text-b">
            <h2 className="font-display">{texte.heroZweiterBlock}</h2>
            <p className="lead mt-4 text-fg-muted">{texte.heroZweiteUnterzeile}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
