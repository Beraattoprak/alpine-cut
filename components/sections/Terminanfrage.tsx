'use client'

import { useActionState, useEffect, useId, useRef } from 'react'
import { sendeTerminanfrage } from '@/app/actions/terminanfrage'
import { leererZustand } from '@/lib/formular'
import { TodoMarker } from '@/components/Offen'
import { SectionHeading } from '@/components/SectionHeading'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { istOffen, leistungen } from '@/content'

function heuteAlsIso(): string {
  const jetzt = new Date()
  return new Date(jetzt.getTime() - jetzt.getTimezoneOffset() * 60_000).toISOString().slice(0, 10)
}

export function Terminanfrage() {
  const [zustand, absenden, laeuft] = useActionState(sendeTerminanfrage, leererZustand)
  const id = useId()
  // Inline verengt, nicht ueber eine Boolean-Variable: sonst kennt TypeScript
  // im else-Zweig den Array-Typ nicht.
  const kategorien = istOffen(leistungen) ? null : leistungen
  const meldungRef = useRef<HTMLParagraphElement>(null)

  // Nach dem Absenden springt der Fokus auf die Meldung. Ohne das erfaehrt
  // niemand, der die Seite nicht sieht, dass ueberhaupt etwas passiert ist.
  useEffect(() => {
    if (zustand.status === 'fehler') meldungRef.current?.focus()
  }, [zustand])

  const fehler = (feld: string) => zustand.feldFehler[feld]

  if (zustand.status === 'ok') {
    return (
      <section id="termin" aria-labelledby="termin-titel" className="abschnitt">
        <div className="container-seite">
          <SectionHeading id="termin" nummer="06" eyebrow="Termin" titel="Terminanfrage" />
          <p role="status" className="lead max-w-prose">
            {zustand.meldung}
          </p>
        </div>
      </section>
    )
  }

  return (
    <section id="termin" aria-labelledby="termin-titel" className="abschnitt">
      <div className="container-seite">
        <SectionHeading id="termin" nummer="06" eyebrow="Termin" titel="Terminanfrage" />

        <form action={absenden} noValidate className="grid max-w-xl gap-6">
          {zustand.status === 'fehler' && zustand.meldung ? (
            <p
              ref={meldungRef}
              role="alert"
              tabIndex={-1}
              data-testid="form-meldung"
              className="border border-[var(--todo)] p-3 text-[var(--todo)]"
            >
              {zustand.meldung}
            </p>
          ) : null}

          <div className="grid gap-2">
            <Label htmlFor={`${id}-name`}>Name</Label>
            <Input
              id={`${id}-name`}
              name="name"
              required
              autoComplete="name"
              aria-invalid={!!fehler('name')}
              aria-describedby={fehler('name') ? `${id}-name-fehler` : undefined}
            />
            {fehler('name') ? (
              <p id={`${id}-name-fehler`} className="text-[var(--todo)]">
                {fehler('name')}
              </p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor={`${id}-telefon`}>Telefon</Label>
            <Input
              id={`${id}-telefon`}
              name="telefon"
              type="tel"
              required
              autoComplete="tel"
              aria-invalid={!!fehler('telefon')}
              aria-describedby={fehler('telefon') ? `${id}-telefon-fehler` : undefined}
            />
            {fehler('telefon') ? (
              <p id={`${id}-telefon-fehler`} className="text-[var(--todo)]">
                {fehler('telefon')}
              </p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor={`${id}-leistung`}>Wunschleistung</Label>
            {kategorien === null ? (
              <>
                <Input
                  id={`${id}-leistung`}
                  name="leistung"
                  required
                  aria-invalid={!!fehler('leistung')}
                  aria-describedby={fehler('leistung') ? `${id}-leistung-fehler` : undefined}
                />
                <TodoMarker hinweis="Sobald Leistungen in content/leistungen.ts stehen, wird hier eine Auswahlliste daraus." />
              </>
            ) : (
              <select
                id={`${id}-leistung`}
                name="leistung"
                required
                aria-invalid={!!fehler('leistung')}
                aria-describedby={fehler('leistung') ? `${id}-leistung-fehler` : undefined}
                className="border border-line bg-transparent px-3 py-2"
                defaultValue=""
              >
                <option value="" disabled>
                  Bitte wählen
                </option>
                {kategorien.flatMap((k) =>
                  k.leistungen.map((l) => (
                    <option key={`${k.titel}-${l.bezeichnung}`} value={l.bezeichnung}>
                      {k.titel} — {l.bezeichnung}
                    </option>
                  )),
                )}
              </select>
            )}
            {fehler('leistung') ? (
              <p id={`${id}-leistung-fehler`} className="text-[var(--todo)]">
                {fehler('leistung')}
              </p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor={`${id}-termin`}>Wunschtermin</Label>
            <Input
              id={`${id}-termin`}
              name="wunschtermin"
              type="date"
              required
              min={heuteAlsIso()}
              aria-invalid={!!fehler('wunschtermin')}
              aria-describedby={fehler('wunschtermin') ? `${id}-termin-fehler` : undefined}
            />
            {fehler('wunschtermin') ? (
              <p id={`${id}-termin-fehler`} className="text-[var(--todo)]">
                {fehler('wunschtermin')}
              </p>
            ) : null}
          </div>

          {/* Honeypot: fuer Menschen unsichtbar, fuer Bots verlockend. */}
          <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
            <label htmlFor={`${id}-webseite`}>Webseite</label>
            <input id={`${id}-webseite`} name="webseite" tabIndex={-1} autoComplete="off" />
          </div>

          <Button type="submit" disabled={laeuft} size="lg" className="justify-self-start">
            {laeuft ? 'Wird gesendet …' : 'Anfrage senden'}
          </Button>
        </form>
      </div>
    </section>
  )
}
