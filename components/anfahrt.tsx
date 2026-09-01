'use client'

import { useEffect, useRef, useState } from 'react'
import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/SectionHeading'
import { salon } from '@/content'
import { adresseEinzeilig, kartenEinbettungUrl, routenUrl } from '@/lib/adresse'

export function Anfahrt() {
  // Auf Touchgeräten fängt die Karte sonst das Wischen ab und der Besucher
  // kommt nicht mehr an ihr vorbei. Sie wird deshalb erst durch Antippen
  // bedienbar. Auf Zeigergeräten spielt das keine Rolle.
  const [karteBedienbar, setKarteBedienbar] = useState(false)

  /**
   * Die Karte lädt ohne Zutun, aber erst kurz bevor sie ins Bild kommt.
   *
   * Kein Klick — und trotzdem kostet sie beim Seitenaufruf nichts. Googles
   * Skripte belasten den Hauptthread erheblich: Mit Karte direkt im Markup
   * schwankte die Total Blocking Time über drei Messungen zwischen 60 und
   * 1440 ms und der Lighthouse-Wert zwischen 98 und 65. `loading="lazy"`
   * allein genügte dafür nicht.
   */
  const rahmenRef = useRef<HTMLDivElement>(null)
  const [karteNah, setKarteNah] = useState(false)

  useEffect(() => {
    const el = rahmenRef.current
    if (!el) return

    if (!('IntersectionObserver' in window)) {
      setKarteNah(true)
      return
    }

    const beobachter = new IntersectionObserver(
      ([eintrag]) => {
        if (!eintrag.isIntersecting) return
        setKarteNah(true)
        beobachter.disconnect()
      },
      { rootMargin: '300px' },
    )
    beobachter.observe(el)
    return () => beobachter.disconnect()
  }, [])

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
                Öffnet Google Maps in einem neuen Tab.
              </p>
            </div>

            {/* Feste Höhe über aspect-ratio, damit die Fläche schon steht,
                bevor die Karte gezeichnet ist — sonst springt das Layout. */}
            <div ref={rahmenRef} className="karte relative w-full border border-line bg-bg-2">
              {/*
                tabIndex={-1}: Die Karte ist bewusst nicht per Tastatur
                anspringbar. Ein fremdes iframe laesst sich von der Wirtsseite
                aus nicht als fokussiert erkennen — weder iframe:focus noch
                :focus-within matchen, und focus-Ereignisse kommen gar nicht
                erst an; beides nachgemessen. Chrome zeichnet dort auch keinen
                eigenen Ring. Eine Tab-Station ohne sichtbaren Fokus verstoesst
                gegen WCAG 2.4.7. Alles, was die Karte zeigt, steht daneben als
                Adresse und hinter "Route planen" — dort ist der Fokus sichtbar.
              */}
              {karteNah && (
                <iframe
                  src={kartenEinbettungUrl}
                  title={`Karte mit dem Standort von ${salon.name}, ${adresseEinzeilig}`}
                  loading="lazy"
                  allowFullScreen
                  tabIndex={-1}
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 h-full w-full border-0"
                  data-bedienbar={karteBedienbar ? 'ja' : 'nein'}
                />
              )}
              {karteNah && !karteBedienbar && (
                <button
                  type="button"
                  onClick={() => setKarteBedienbar(true)}
                  className="karte-freigabe absolute inset-0 grid place-items-end justify-center pb-5"
                >
                  <span className="label bg-bg px-3 py-2 text-fg">Zum Bewegen antippen</span>
                </button>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
