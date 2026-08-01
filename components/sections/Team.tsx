import { Offen } from '@/components/Offen'
import { SectionHeading } from '@/components/SectionHeading'
import { team } from '@/content'

export function Team() {
  return (
    <section id="team" aria-labelledby="team-titel" className="abschnitt">
      <div className="container-seite">
        <SectionHeading id="team" nummer="03" eyebrow="Team" titel="Wer Sie bedient" />
        <Offen wert={team}>
          {(mitglieder) => (
            <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {mitglieder.map((m) => (
                <li key={m.name}>
                  <p className="font-display text-[var(--mass-h3)]">{m.name}</p>
                  <p className="eyebrow mt-1">{m.rolle}</p>
                </li>
              ))}
            </ul>
          )}
        </Offen>
      </div>
    </section>
  )
}
