'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { SectionHeading } from '@/components/SectionHeading'
import { salon } from '@/content'
import { galerie } from '@/content/fotos'

/**
 * Rundgang durch den Salon.
 *
 * Auf breiten Schirmen wird der Abschnitt festgehalten und die Bildreihe
 * wandert beim Scrollen waagrecht durch — die Scrollbewegung wird zur
 * Zeitachse. Darunter, und bei reduzierter Bewegung, ist es eine ganz normale
 * Reihe, die man mit dem Finger schiebt.
 *
 * Wie beim Hero gilt: Die Höhe der Bühne kommt aus CSS, nicht aus JavaScript.
 * Sonst entsteht beim ersten Frame ein Layout-Sprung.
 */
export function Einblick() {
  const buehne = useRef<HTMLDivElement>(null)
  const spur = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const b = buehne.current
    const s = spur.current
    if (!b || !s) return

    const mq = window.matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)')
    let aktiv = mq.matches
    let sichtbar = false
    let laeuft = false
    let schmutzig = true
    let rafId = 0

    const zeichnen = () => {
      if (!aktiv) {
        s.style.transform = ''
        return
      }
      const strecke = Math.max(1, b.offsetHeight - window.innerHeight)
      const roh = -b.getBoundingClientRect().top / strecke
      const p = roh < 0 ? 0 : roh > 1 ? 1 : roh
      // Wie weit die Spur über den Rand hinausragt — genau so weit wird sie
      // verschoben, damit das letzte Bild bündig endet.
      const weg = Math.max(0, s.scrollWidth - s.clientWidth)
      s.style.transform = `translate3d(${-(p * weg).toFixed(1)}px, 0, 0)`
    }

    const schritt = () => {
      zeichnen()
      if (!schmutzig || !sichtbar) {
        laeuft = false
        return
      }
      schmutzig = false
      rafId = requestAnimationFrame(schritt)
    }

    const starten = () => {
      if (laeuft || !sichtbar || !aktiv) return
      laeuft = true
      rafId = requestAnimationFrame(schritt)
    }

    const beiScroll = () => {
      schmutzig = true
      starten()
    }

    const beiWechsel = () => {
      aktiv = mq.matches
      zeichnen()
      starten()
    }

    const beobachter = new IntersectionObserver(([e]) => {
      sichtbar = e.isIntersecting
      if (sichtbar) starten()
    })
    beobachter.observe(b)

    window.addEventListener('scroll', beiScroll, { passive: true })
    window.addEventListener('resize', beiWechsel)
    mq.addEventListener('change', beiWechsel)
    zeichnen()

    return () => {
      cancelAnimationFrame(rafId)
      beobachter.disconnect()
      window.removeEventListener('scroll', beiScroll)
      window.removeEventListener('resize', beiWechsel)
      mq.removeEventListener('change', beiWechsel)
    }
  }, [])

  return (
    <section id="einblick" aria-labelledby="einblick-titel" className="einblick">
      <div ref={buehne} className="einblick-buehne">
        <div className="einblick-pin">
          <div className="container-seite">
            <SectionHeading id="einblick" nummer="01" eyebrow="Einblick" titel="Der Salon" />
          </div>

          <div className="einblick-fenster">
            <div ref={spur} className="einblick-spur" role="list">
              {galerie.map((foto, i) => (
                <figure key={foto.datei} role="listitem" className="einblick-bild">
                  {/* Einheitliche Höhe, Breite aus dem Seitenverhältnis: So
                      stehen Quer- und Hochformat in einer Reihe, ohne dass
                      etwas beschnitten wird oder die Unterschriften springen. */}
                  <div className="einblick-rahmen" style={{ aspectRatio: foto.format }}>
                    <Image
                      src={`/fotos/${foto.datei}`}
                      alt={foto.alt}
                      fill
                      sizes="(min-width: 768px) 60vh, 80vw"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="label mt-4 flex gap-4">
                    <span className="text-fg">{String(i + 1).padStart(2, '0')}</span>
                    <span>{foto.bildunterschrift}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>

          <div className="container-seite">
            <p className="lead mt-10 max-w-[46ch]">
              Laufend neue Schnitte auf Instagram.{' '}
              <a
                href={salon.instagram}
                target="_blank"
                rel="noreferrer noopener"
                className="underline"
              >
                {salon.instagramHandle}
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
