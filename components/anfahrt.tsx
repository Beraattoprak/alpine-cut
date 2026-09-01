'use client'

import { useState } from 'react'
import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/SectionHeading'
import { salon } from '@/content'
import { adresseEinzeilig, kartenEinbettungUrl, routenUrl } from '@/lib/adresse'

export function Anfahrt() {
  const [karteGeladen, setKarteGeladen] = useState(false)
  // Auf Touchgeräten fängt die Karte sonst das Wischen ab und der Besucher
  // kommt nicht mehr an ihr vorbei. Sie wird deshalb erst durch Antippen
  // bedienbar. Auf Zeigergeräten spielt das keine Rolle.
  const [karteBedienbar, setKarteBedienbar] = useState(false)

  return (
    <section id="anfahrt" aria-labelledby="anfahrt-titel" className="abschnitt">
      <div className="container-seite">
        <Reveal>
          <SectionHeading id="anfahrt" nummer="05" eyebrow="Anfahrt" titel="So finden Sie uns" />
        </Reveal>

        <Reveal verzoegerung={80}>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-start lg:gap-14">
            <div>
              <p className="label mb-5">Adresse</p>
              <address className="not-italic text-[length:var(--mass-lead)] leading-snug">
                {salon.name}
                <br />
                {salon.strasse}
                <br />
                {salon.plz} {salon.ort}
                <br />
                <span className="text-fg-muted">
                  {salon.region}, Österreich
                </span>
              </address>

              <p className="mt-8">
                <a
                  href={routenUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Route planen
                </a>
              </p>
              <p className="mt-3 max-w-[40ch] text-[length:var(--mass-meta)] text-fg-muted">
                Öffnet Google Maps in einem neuen Tab. Vorher werden keine Daten übertragen.
              </p>
            </div>

            {/* Feste Höhe über aspect-ratio, damit Platzhalter und Karte exakt
                gleich hoch sind — sonst springt das Layout beim Laden. */}
            <div className="karte relative w-full border border-line bg-bg-2">
              {karteGeladen ? (
                <>
                  <iframe
                    src={kartenEinbettungUrl}
                    title={`Karte mit dem Standort von ${salon.name}, ${adresseEinzeilig}`}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0 h-full w-full border-0"
                    data-bedienbar={karteBedienbar ? 'ja' : 'nein'}
                  />
                  {!karteBedienbar && (
                    <button
                      type="button"
                      onClick={() => setKarteBedienbar(true)}
                      className="karte-freigabe absolute inset-0 grid place-items-end justify-center pb-5"
                    >
                      <span className="label bg-bg px-3 py-2 text-fg">
                        Zum Bewegen antippen
                      </span>
                    </button>
                  )}
                </>
              ) : (
                <div className="absolute inset-0 grid place-items-center p-6 text-center">
                  <div className="flex max-w-[36ch] flex-col items-center gap-4">
                    <p className="label">Karte von Google Maps</p>
                    <p className="text-[length:var(--mass-meta)] text-fg-muted">
                      Beim Laden werden Daten an Google übertragen, darunter Ihre IP-Adresse.
                      Die Karte lädt erst, wenn Sie hier klicken.
                    </p>
                    <button
                      type="button"
                      onClick={() => setKarteGeladen(true)}
                      className="mt-1 bg-fg px-6 py-3 text-sm font-medium tracking-wide text-bg transition-opacity hover:opacity-80"
                    >
                      Karte laden
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
