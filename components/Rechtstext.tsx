import { Offen } from '@/components/Offen'
import type { Rechtsabschnitt } from '@/content'

export function Rechtstext({ abschnitte }: { abschnitte: Rechtsabschnitt[] }) {
  return (
    <div className="grid gap-10">
      {abschnitte.map((a) => (
        <section key={a.titel} className="grid gap-3">
          <h2 className="text-[var(--mass-h3)]">{a.titel}</h2>
          {a.absaetze.map((absatz, i) => (
            <Offen key={i} wert={absatz}>
              {(t) => <p className="max-w-prose text-fg-muted">{t}</p>}
            </Offen>
          ))}
        </section>
      ))}
    </div>
  )
}
