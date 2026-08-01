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
          <Image
            src="/clipper-poster.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="hero-poster"
            data-testid="hero-poster"
          />
          <ScrubCanvas buehne={buehne} />
          <noscript>
            {/* Ohne JavaScript verdeckt nichts das Poster. */}
            <style>{`.hero-canvas{display:none}`}</style>
          </noscript>
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
