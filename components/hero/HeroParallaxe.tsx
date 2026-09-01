'use client'

import { useEffect, useRef, type ReactNode } from 'react'

/**
 * Lässt das Hero-Bild beim Scrollen langsamer wandern als die Seite.
 *
 * Die Bewegung wird über eine CSS-Variable am Element gesetzt, nicht über
 * React-State: Ein Re-Render pro Frame wäre Verschwendung. Der scroll-Listener
 * merkt sich nur, dass sich etwas getan hat; gerechnet wird im
 * requestAnimationFrame. Der Loop hält sich selbst an, sobald die Bühne aus
 * dem Bild ist oder die Bewegung steht.
 *
 * Bei `prefers-reduced-motion: reduce` läuft er gar nicht erst an — das Bild
 * steht dann einfach still, sichtbar bleibt alles.
 */
export function HeroParallaxe({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let sichtbar = false
    let laeuft = false
    let schmutzig = true
    let rafId = 0

    const zeichnen = () => {
      const buehne = el.parentElement
      if (!buehne) return
      const oben = buehne.getBoundingClientRect().top
      // 0 am oberen Rand, wächst beim Wegscrollen. Faktor 0.18 hält die
      // Bewegung dezent — mehr wirkt schnell nach Effekt um des Effekts willen.
      const versatz = Math.max(-oben, 0) * 0.18
      el.style.setProperty('--parallaxe', `${versatz.toFixed(1)}px`)
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
      if (laeuft || !sichtbar) return
      laeuft = true
      rafId = requestAnimationFrame(schritt)
    }

    const beiScroll = () => {
      schmutzig = true
      starten()
    }

    const beobachter = new IntersectionObserver(([e]) => {
      sichtbar = e.isIntersecting
      if (sichtbar) starten()
    })
    if (el.parentElement) beobachter.observe(el.parentElement)

    window.addEventListener('scroll', beiScroll, { passive: true })
    zeichnen()

    return () => {
      cancelAnimationFrame(rafId)
      beobachter.disconnect()
      window.removeEventListener('scroll', beiScroll)
    }
  }, [])

  return (
    <div ref={ref} className="hero-bild" aria-hidden="false">
      {children}
    </div>
  )
}
