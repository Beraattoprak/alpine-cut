'use client'

import { useEffect, useState } from 'react'

const BREITE = '(min-width: 768px)'
const BEWEGUNG = '(prefers-reduced-motion: no-preference)'

function sparsamerModus(): boolean {
  const c = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
  return c?.saveData === true
}

/**
 * Entscheidet, ob der rAF-Loop laufen darf. Startet mit `false`, damit die
 * Serverausgabe und der erste Client-Render übereinstimmen. Die Höhe der
 * Bühne hängt nicht hiervon ab — die kommt aus Media Queries.
 */
export function useScrubGate(): boolean {
  const [erlaubt, setErlaubt] = useState(false)

  useEffect(() => {
    const breit = window.matchMedia(BREITE)
    const bewegung = window.matchMedia(BEWEGUNG)

    const pruefen = () => {
      const ok = breit.matches && bewegung.matches && !sparsamerModus()
      setErlaubt(ok)
      if (ok) document.documentElement.dataset.scrub = 'an'
      else delete document.documentElement.dataset.scrub
    }

    pruefen()
    breit.addEventListener('change', pruefen)
    bewegung.addEventListener('change', pruefen)
    return () => {
      breit.removeEventListener('change', pruefen)
      bewegung.removeEventListener('change', pruefen)
    }
  }, [])

  return erlaubt
}
