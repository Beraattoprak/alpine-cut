import { Offen } from '@/components/Offen'
import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/SectionHeading'
import { team } from '@/content'

export function Team() {
  return (
    <section id="team" aria-labelledby="team-titel" className="abschnitt">
      <div className="container-seite">
        <Reveal>
          <SectionHeading id="team" nummer="04" eyebrow="Team" titel="Wer Sie bedient" />
        </Reveal>
        <Reveal verzoegerung={80}>
          <Offen wert={team}>
            {(mitglieder) => (
              <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                {mitglieder.map((m) => (
                  <li key={m.name} className="border-t border-line pt-5">
                    <p className="font-display text-[length:var(--mass-h3)] uppercase">{m.name}</p>
                    <p className="label mt-2">{m.rolle}</p>
                  </li>
                ))}
              </ul>
            )}
          </Offen>
        </Reveal>
      </div>
    </section>
  )
}
