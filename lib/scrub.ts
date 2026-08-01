/**
 * Scroll-Mathematik des Hero. Reine Funktionen, kein DOM, kein React.
 *
 * Grundregel aus der Spec (6.3): Frame-Index und Phase sind reine Funktionen
 * der Scrollposition. Es gibt keinen Zustand, der sich merkt, dass die
 * Animation "schon gelaufen" ist — deshalb läuft sie rückwärts von selbst.
 */

export const FRAME_COUNT = 145
export const LETZTER_FRAME = FRAME_COUNT - 1

/** Grundglättung pro Frame bei 60 Hz. */
export const GLAETTUNG = 0.12

/** Schaltschwellen des Textwechsels, mit totem Band gegen Flackern. */
export const PHASE_AUF = 0.55
export const PHASE_ZU = 0.45

/** Unterhalb dieser Differenz gilt die Animation als zur Ruhe gekommen. */
export const RUHE_SCHWELLE = 0.0005

/** Längste Bildpause, die noch in die Glättung eingeht (Tab-Wechsel-Schutz). */
const MAX_DT_MS = 100

export type Phase = 'a' | 'b'

export function pfadFuerFrame(i: number): string {
  return `/frames/clip-${String(i).padStart(3, '0')}.webp`
}

function klemmen(wert: number, min: number, max: number): number {
  return wert < min ? min : wert > max ? max : wert
}

/**
 * Scrollfortschritt aus der Position der Bühne.
 * `stageTop` ist `getBoundingClientRect().top`, `scrollLen` die Scrubstrecke.
 */
export function fortschritt(stageTop: number, scrollLen: number): number {
  if (scrollLen <= 0) return 0
  return klemmen(-stageTop / scrollLen, 0, 1)
}

/** Framerate-unabhängiger Glättungsfaktor. Ohne ihn liefe 120 Hz doppelt so schnell. */
export function glaettungsFaktor(dtMs: number): number {
  const frames = Math.min(dtMs, MAX_DT_MS) / (1000 / 60)
  return 1 - Math.pow(1 - GLAETTUNG, frames)
}

/** Ein Glättungsschritt. Symmetrisch — aufwärts wie abwärts identisch. */
export function annaehern(aktuell: number, ziel: number, dtMs: number): number {
  return aktuell + (ziel - aktuell) * glaettungsFaktor(dtMs)
}

export function frameIndex(p: number): number {
  return klemmen(Math.round(klemmen(p, 0, 1) * LETZTER_FRAME), 0, LETZTER_FRAME)
}

/**
 * Phase des Textwechsels. Im toten Band zwischen PHASE_ZU und PHASE_AUF bleibt
 * die bisherige Phase stehen — richtungsunabhängig, ohne Vorzugsrichtung.
 */
export function naechstePhase(p: number, bisher: Phase): Phase {
  if (p > PHASE_AUF) return 'b'
  if (p < PHASE_ZU) return 'a'
  return bisher
}

/**
 * Der beste bereits dekodierte Frame bei oder unterhalb des gewünschten.
 * Verhindert Löcher, solange die Sequenz noch lädt.
 */
export function verfuegbarerFrame(
  gewuenscht: number,
  geladen: readonly boolean[],
): number | null {
  for (let i = Math.min(gewuenscht, geladen.length - 1); i >= 0; i--) {
    if (geladen[i]) return i
  }
  return null
}
