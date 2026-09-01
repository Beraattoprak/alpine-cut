import { Offen } from '@/components/Offen'
import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/SectionHeading'
import { oeffnungszeiten, salon } from '@/content'

const routeUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  `${salon.strasse}, ${salon.plz} ${salon.ort}, Österreich`,
)}`

export function OeffnungszeitenAnfahrt() {
  return (
    <section id="zeiten" aria-labelledby="zeiten-titel" className="abschnitt">
      <div className="container-seite">
        <Reveal>
          <SectionHeading id="zeiten" nummer="04" eyebrow="Zeiten" titel="Öffnungszeiten & Anfahrt" />
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
              {/* Ohne Terminvergabe ist das hier der Abschluss der Seite und
                  zugleich die eigentliche Handlungsaufforderung. */}
              <p className="label mb-6">Wo Sie uns finden</p>
              <p className="mb-6 font-display text-[length:var(--mass-h3)] uppercase">
                Einfach vorbeikommen
              </p>
              <address className="not-italic text-[length:var(--mass-lead)] leading-snug">
                {salon.strasse}
                <br />
                {salon.plz} {salon.ort}
                <br />
                <span className="text-fg-muted">{salon.region}, Österreich</span>
              </address>
              <p className="mt-6">
                <a href={salon.telefonHref}>{salon.telefon}</a>
              </p>
              <p className="mt-8">
                <a href={routeUrl} target="_blank" rel="noreferrer noopener" className="underline">
                  Route planen
                </a>
              </p>
              <p className="mt-3 max-w-[42ch] text-[length:var(--mass-meta)] text-fg-muted">
                Der Link öffnet Google Maps in einem neuen Tab. Vorher werden keine Daten
                übertragen.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
