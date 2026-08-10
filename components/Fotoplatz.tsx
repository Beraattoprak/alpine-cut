import Image from 'next/image'
import { istOffen, type Offen } from '@/content/todo'
import type { Foto } from '@/content/fotos'

/**
 * Zeigt ein Foto — oder, solange keines geliefert wurde, eine gerahmte Fläche,
 * die Format und Zweck nennt. Bewusst kein grauer Kasten: Der Platzhalter soll
 * absichtsvoll aussehen und dem Betreiber sagen, was dort hingehört.
 */
export function Fotoplatz({
  wert,
  seitenverhaeltnis,
  format,
  sizes,
  prioritaet = false,
  knapp = false,
  className = '',
}: {
  wert: Offen<Foto>
  /** CSS-Wert für aspect-ratio, z. B. "3 / 2" */
  seitenverhaeltnis: string
  /** Kurzform für den Platzhalter, z. B. "3:2 quer, ab 2000 px" */
  format: string
  sizes: string
  prioritaet?: boolean
  /** Nur das Format zeigen. Für Reihen, in denen der Hinweis sonst n-mal steht. */
  knapp?: boolean
  className?: string
}) {
  if (istOffen(wert)) {
    return (
      <div
        className={`relative grid place-items-center border border-line bg-bg-2 p-6 text-center ${className}`}
        style={{ aspectRatio: seitenverhaeltnis }}
        data-todo
        role="note"
      >
        <div className="flex flex-col items-center gap-3">
          <span className="label text-fg-dim">Fotoplatz</span>
          <span className="text-sm text-fg-muted">{format}</span>
          {knapp ? null : (
            <span className="mt-2 max-w-[30ch] text-sm text-fg-muted">{wert.hinweis}</span>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      className={`relative overflow-hidden bg-bg-2 ${className}`}
      style={{ aspectRatio: seitenverhaeltnis }}
    >
      <Image
        src={`/fotos/${wert.datei}`}
        alt={wert.alt}
        fill
        sizes={sizes}
        priority={prioritaet}
        className="object-cover"
      />
    </div>
  )
}
