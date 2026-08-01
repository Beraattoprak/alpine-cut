'use client'

import { type RefObject, useEffect, useRef } from 'react'
import {
  annaehern,
  fortschritt,
  frameIndex,
  naechstePhase,
  type Phase,
  RUHE_SCHWELLE,
  verfuegbarerFrame,
} from '@/lib/scrub'
import { useFrameSequence } from './useFrameSequence'
import { useScrubGate } from './useScrubGate'

/** Breite des Bildmaterials. Mehr Pixel als das gibt es nicht. */
const BREITE_QUELLE = 1276

export function ScrubCanvas({ buehne }: { buehne: RefObject<HTMLElement | null> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const erlaubt = useScrubGate()
  const seq = useFrameSequence(erlaubt)
  const aktiv = erlaubt && seq.bereit && !seq.gescheitert

  useEffect(() => {
    const canvas = canvasRef.current
    const stage = buehne.current
    if (!aktiv || !canvas || !stage) return
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    const strecke = () => Math.max(1, stage.offsetHeight - window.innerHeight)

    // Spec 6.3, Punkt 3: beim Betreten NICHT bei null anfangen, sondern
    // dort, wo der Besucher gerade steht.
    let eased = fortschritt(stage.getBoundingClientRect().top, strecke())
    let phase: Phase = naechstePhase(eased, 'a')
    stage.dataset.phase = phase
    stage.style.setProperty('--p', eased.toFixed(4))

    let gezeichnet = -1
    let letzteZeit = performance.now()
    let laeuft = false
    let schmutzig = true
    let sichtbar = false
    let rafId = 0

    function zeichnen(i: number) {
      const nutzbar = verfuegbarerFrame(i, seq.geladen)
      if (nutzbar === null || nutzbar === gezeichnet) return
      const bild = seq.bilder[nutzbar]
      if (!bild) return
      ctx!.drawImage(bild, 0, 0, canvas!.clientWidth, canvas!.clientHeight)
      gezeichnet = nutzbar
    }

    function schritt(jetzt: number) {
      const dt = jetzt - letzteZeit
      letzteZeit = jetzt

      const ziel = fortschritt(stage!.getBoundingClientRect().top, strecke())
      eased = annaehern(eased, ziel, dt)
      stage!.style.setProperty('--p', eased.toFixed(4))

      const neu = naechstePhase(eased, phase)
      if (neu !== phase) {
        phase = neu
        stage!.dataset.phase = phase
      }

      const gewuenscht = frameIndex(eased)
      zeichnen(gewuenscht)

      // Ruht erst, wenn die Bewegung steht UND der exakte Frame gezeichnet ist.
      // Dadurch holt der Loop nachgeladene Frames selbsttaetig nach.
      const ruht =
        !schmutzig && Math.abs(ziel - eased) < RUHE_SCHWELLE && gezeichnet === gewuenscht
      schmutzig = false

      if (ruht || !sichtbar) {
        laeuft = false
        return
      }
      rafId = requestAnimationFrame(schritt)
    }

    function starten() {
      if (laeuft || !sichtbar) return
      laeuft = true
      letzteZeit = performance.now()
      rafId = requestAnimationFrame(schritt)
    }

    function groesseSetzen() {
      const cssBreite = canvas!.clientWidth
      const cssHoehe = canvas!.clientHeight
      if (cssBreite === 0 || cssHoehe === 0) return

      // Nie mehr Pixel als die Quelle hergibt. Ein groesserer Puffer kostet
      // Speicher und Rechenzeit, ohne ein einziges Detail hinzuzufuegen —
      // das Bildmaterial ist 1276x720 und mehr existiert nicht.
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const skala = Math.min(dpr, BREITE_QUELLE / cssBreite)

      canvas!.width = Math.round(cssBreite * skala)
      canvas!.height = Math.round(cssHoehe * skala)
      ctx!.setTransform(skala, 0, 0, skala, 0, 0)
      ctx!.imageSmoothingQuality = 'high'
      gezeichnet = -1
      schmutzig = true
      starten()
    }

    // Der scroll-Listener rechnet nichts. Er merkt sich nur, dass sich etwas
    // getan hat, und weckt den Loop.
    const beiScroll = () => {
      schmutzig = true
      starten()
    }

    const sichtbarkeit = new IntersectionObserver(
      ([eintrag]) => {
        sichtbar = eintrag.isIntersecting
        if (sichtbar) starten()
      },
      { rootMargin: '100px' },
    )
    sichtbarkeit.observe(stage)

    const groesse = new ResizeObserver(groesseSetzen)
    groesse.observe(canvas)
    groesseSetzen()

    window.addEventListener('scroll', beiScroll, { passive: true })

    return () => {
      cancelAnimationFrame(rafId)
      sichtbarkeit.disconnect()
      groesse.disconnect()
      window.removeEventListener('scroll', beiScroll)
    }
  }, [aktiv, buehne, seq.bilder, seq.geladen])

  return (
    <canvas
      ref={canvasRef}
      className="hero-canvas"
      data-aktiv={aktiv ? 'an' : undefined}
      role="img"
      aria-label="Eine Haarschneidemaschine zerfaellt schwebend in ihre Einzelteile."
    />
  )
}
