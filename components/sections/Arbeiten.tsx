import { Fotoplatz } from '@/components/Fotoplatz'
import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/SectionHeading'
import { arbeiten, type Foto, salon } from '@/content'
import { istOffen, type Offen } from '@/content/todo'

/** Ohne gelieferte Fotos stehen vier Platzhalter, damit das Band Form hat. */
const PLATZHALTER = 4

function eintraegeLesen(): Offen<Foto>[] {
  if (!istOffen(arbeiten)) return arbeiten
  // Erst an eine Konstante binden: innerhalb des Callbacks würde TypeScript die
  // Verengung auf Todo sonst wieder verlieren.
  const marker = arbeiten
  return Array.from({ length: PLATZHALTER }, () => marker)
}

export function Arbeiten() {
  const eintraege = eintraegeLesen()

  return (
    <section id="arbeiten" aria-labelledby="arbeiten-titel" className="abschnitt overflow-hidden">
      <div className="container-seite">
        <Reveal>
          <SectionHeading id="arbeiten" nummer="01" eyebrow="Arbeiten" titel="Aus dem Salon" />
        </Reveal>
      </div>

      <Reveal>
        <div className="streifen" role="list" aria-label="Arbeiten aus dem Salon">
          {eintraege.map((foto, i) => (
            <div role="listitem" key={i}>
              <Fotoplatz
                wert={foto}
                seitenverhaeltnis="3 / 4"
                format="3:4 hoch, ab 1200 px"
                sizes="(min-width: 640px) 22rem, 80vw"
                knapp={i > 0}
              />
            </div>
          ))}
        </div>
      </Reveal>

      <div className="container-seite mt-10">
        <p className="lead max-w-[46ch]">
          Laufend neue Schnitte auf Instagram.{' '}
          <a href={salon.instagram} target="_blank" rel="noreferrer noopener" className="underline">
            {salon.instagramHandle}
          </a>
        </p>
      </div>
    </section>
  )
}
