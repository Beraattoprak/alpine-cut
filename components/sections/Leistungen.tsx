import { Offen } from '@/components/Offen'
import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/SectionHeading'
import { leistungen } from '@/content'

export function Leistungen() {
  return (
    <section id="leistungen" aria-labelledby="leistungen-titel" className="abschnitt">
      <div className="container-seite">
        <Reveal>
          <SectionHeading id="leistungen" nummer="02" eyebrow="Leistungen" titel="Was wir anbieten" />
        </Reveal>
        <Reveal verzoegerung={80}>
          <Offen wert={leistungen}>
            {(kategorien) => (
              <div className="grid gap-14 sm:grid-cols-2">
                {kategorien.map((k) => (
                  <div key={k.titel}>
                    <h3 className="mb-5 uppercase">{k.titel}</h3>
                    <ul>
                      {k.leistungen.map((l) => (
                        <li key={l.bezeichnung} className="preisreihe">
                          <span>
                            {l.bezeichnung}
                            {l.hinweis ? (
                              <span className="block text-[length:var(--mass-meta)] text-fg-muted">
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
        </Reveal>
      </div>
    </section>
  )
}
