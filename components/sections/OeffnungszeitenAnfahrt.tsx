import { Offen } from '@/components/Offen'
import { SectionHeading } from '@/components/SectionHeading'
import { oeffnungszeiten, salon } from '@/content'

const routeUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  `${salon.strasse}, ${salon.plz} ${salon.ort}, Österreich`,
)}`

export function OeffnungszeitenAnfahrt() {
  return (
    <section id="zeiten" aria-labelledby="zeiten-titel" className="abschnitt">
      <div className="container-seite grid gap-12 md:grid-cols-2">
        <div>
          <SectionHeading id="zeiten" nummer="04" eyebrow="Zeiten" titel="Öffnungszeiten" />
          <Offen wert={oeffnungszeiten}>
            {(tage) => (
              <dl className="max-w-sm">
                {tage.map((t) => (
                  <div key={t.tag} className="preisreihe">
                    <dt>{t.tag}</dt>
                    <span className="fuellung" aria-hidden="true" />
                    <dd className="text-fg-muted">{t.zeiten ?? 'geschlossen'}</dd>
                  </div>
                ))}
              </dl>
            )}
          </Offen>
        </div>

        <div>
          <h3 className="mb-4">Anfahrt</h3>
          <address className="not-italic text-fg-muted">
            <p>{salon.name}</p>
            <p>{salon.strasse}</p>
            <p>
              {salon.plz} {salon.ort}
            </p>
            <p>{salon.region}, Österreich</p>
            <p className="mt-4">
              <a href={salon.telefonHref}>{salon.telefon}</a>
            </p>
          </address>
          <p className="mt-6">
            <a href={routeUrl} target="_blank" rel="noreferrer noopener">
              Route planen
            </a>
          </p>
          <p className="mt-2 text-[var(--mass-meta)] text-fg-muted">
            Der Link öffnet Google Maps in einem neuen Tab. Vorher werden keine Daten übertragen.
          </p>
        </div>
      </div>
    </section>
  )
}
