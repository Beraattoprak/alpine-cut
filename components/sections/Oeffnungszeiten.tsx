import { Offen } from '@/components/Offen'
import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/SectionHeading'
import { oeffnungszeiten, salon } from '@/content'

export function Oeffnungszeiten() {
  return (
    <section id="zeiten" aria-labelledby="zeiten-titel" className="abschnitt">
      <div className="container-seite">
        <Reveal>
          <SectionHeading id="zeiten" nummer="04" eyebrow="Zeiten" titel="Öffnungszeiten" />
        </Reveal>

        <Reveal verzoegerung={80}>
          <div className="grid gap-14 md:grid-cols-2">
            <div>
              <p className="label mb-6">Wann geöffnet ist</p>
              <Offen wert={oeffnungszeiten}>
                {(tage) => (
                  <dl className="max-w-md">
                    {tage.map((t) => (
                      <div key={t.tag} className="preisreihe">
                        <dt>{t.tag}</dt>
                        <span className="fuellung" aria-hidden="true" />
                        <dd className="tabular-nums text-fg-muted">{t.zeiten ?? 'geschlossen'}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </Offen>
            </div>

            <div>
              {/* Ohne Terminvergabe ist das die eigentliche Handlungsaufforderung.
                  Die Adresse steht bewusst nicht hier, sondern einmal im
                  Abschnitt Anfahrt — sonst stuende sie zweimal auf der Seite. */}
              <p className="label mb-6">Ganz ohne Termin</p>
              <p className="font-display text-[length:var(--mass-h3)] uppercase">
                Einfach vorbeikommen
              </p>
              <p className="lead mt-5 max-w-[38ch]">
                Kein Termin, keine Anmeldung. Wenn Sie vorher wissen möchten, wie voll es ist,
                rufen Sie kurz an.
              </p>
              <p className="mt-6 text-[length:var(--mass-lead)]">
                <a href={salon.telefonHref}>{salon.telefon}</a>
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
