'use client'

import { useEffect, useRef, useState } from 'react'
import { FRAME_COUNT, pfadFuerFrame } from '@/lib/scrub'

const PARALLEL = 6
const MINDESTENS_BEREIT = 24
/** Spec 6.6: Kommt die Sequenz nicht in Gang, bleibt das Poster stehen. */
const GEDULD_MS = 8000

export type Sequenz = {
  bilder: (HTMLImageElement | null)[]
  geladen: boolean[]
  bereit: boolean
  gescheitert: boolean
}

/**
 * Lädt und dekodiert die Frame-Sequenz, sobald `aktiv` wahr wird.
 * Ist `aktiv` falsch, wird kein einziger Request abgesetzt.
 */
export function useFrameSequence(aktiv: boolean): Sequenz {
  const bilder = useRef<(HTMLImageElement | null)[]>(Array(FRAME_COUNT).fill(null))
  const geladen = useRef<boolean[]>(Array(FRAME_COUNT).fill(false))
  const [bereit, setBereit] = useState(false)
  const [gescheitert, setGescheitert] = useState(false)

  useEffect(() => {
    if (!aktiv) return
    let abgebrochen = false
    let fertig = 0
    let fehler = 0

    async function einzeln(i: number) {
      const bild = new Image()
      bild.decoding = 'async'
      bild.src = pfadFuerFrame(i)
      try {
        await bild.decode()
        if (abgebrochen) return
        bilder.current[i] = bild
        geladen.current[i] = true
        fertig += 1
        if (fertig >= MINDESTENS_BEREIT) setBereit(true)
      } catch {
        fehler += 1
        if (fehler > FRAME_COUNT / 4) setGescheitert(true)
      }
    }

    async function alle() {
      for (let start = 0; start < FRAME_COUNT; start += PARALLEL) {
        if (abgebrochen) return
        const block: Promise<void>[] = []
        const ende = Math.min(start + PARALLEL, FRAME_COUNT)
        for (let i = start; i < ende; i += 1) block.push(einzeln(i))
        await Promise.all(block)
      }
    }

    const anstossen = () => {
      void alle()
    }
    // typeof statt `in`: der `in`-Operator verengt window im else-Zweig zu
    // never, weil die DOM-Typen requestIdleCallback als immer vorhanden fuehren.
    const hatIdle = typeof window.requestIdleCallback === 'function'
    const id: number = hatIdle
      ? window.requestIdleCallback(anstossen, { timeout: 1500 })
      : window.setTimeout(anstossen, 200)

    // Kommt die Sequenz in acht Sekunden nicht auf die Beine, wird nicht
    // gescrubbt. Lieber ein ruhiges Poster als ein hakender Effekt.
    const geduld = window.setTimeout(() => {
      if (fertig < MINDESTENS_BEREIT) {
        abgebrochen = true
        setGescheitert(true)
      }
    }, GEDULD_MS)

    return () => {
      abgebrochen = true
      window.clearTimeout(geduld)
      if (hatIdle) window.cancelIdleCallback(id)
      else window.clearTimeout(id)
    }
  }, [aktiv])

  return { bilder: bilder.current, geladen: geladen.current, bereit, gescheitert }
}
