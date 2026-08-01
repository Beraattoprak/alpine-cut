import { Offen } from '@/components/Offen'
import { SectionHeading } from '@/components/SectionHeading'
import { leistungen } from '@/content'

export function Leistungen() {
  return (
    <section id="leistungen" aria-labelledby="leistungen-titel" className="abschnitt">
      <div className="container-seite">
        <SectionHeading
          id="leistungen"
          nummer="01"
          eyebrow="Leistungen"
          titel="Was wir anbieten"
        />
        <Offen wert={leistungen}>
          {(kategorien) => (
            <div className="grid gap-12 sm:grid-cols-2">
              {kategorien.map((k) => (
                <div key={k.titel}>
                  <h3 className="mb-4">{k.titel}</h3>
                  <ul>
                    {k.leistungen.map((l) => (
                      <li key={l.bezeichnung} className="preisreihe">
                        <span>
                          {l.bezeichnung}
                          {l.hinweis ? (
                            <span className="block text-[var(--mass-meta)] text-fg-muted">
                              {l.hinweis}
                            </span>
                          ) : null}
                        </span>
                        <span className="fuellung" aria-hidden="true" />
                        <span className="tabular-nums text-fg-muted">{l.preis}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </Offen>
      </div>
    </section>
  )
}
