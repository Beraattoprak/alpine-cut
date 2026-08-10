'use client'

import { useEffect, useRef, type ReactNode } from 'react'

/**
 * Blendet den Inhalt beim ersten Sichtbarwerden ein.
 *
 * Der Startzustand wird erst im Browser gesetzt, nicht auf dem Server: Ohne
 * JavaScript bleibt der Inhalt schlicht sichtbar. Bei reduzierter Bewegung
 * greift die CSS-Regel gar nicht erst — Inhalt darf nie hinter einer Animation
 * verborgen bleiben.
 */
export function Reveal({
  children,
  verzoegerung = 0,
  className = '',
}: {
  children: ReactNode
  /** Millisekunden, um versetzte Reihen zu bauen. */
  verzoegerung?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    el.dataset.sichtbar = 'nein'
    el.style.transitionDelay = `${verzoegerung}ms`

    const beobachter = new IntersectionObserver(
      ([eintrag]) => {
        if (!eintrag.isIntersecting) return
        el.dataset.sichtbar = 'ja'
        beobachter.disconnect()
      },
      { rootMargin: '0px 0px -12% 0px' },
    )

    beobachter.observe(el)
    return () => beobachter.disconnect()
  }, [verzoegerung])

  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  )
}
