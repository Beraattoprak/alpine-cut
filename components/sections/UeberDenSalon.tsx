import { Fotoplatz } from '@/components/Fotoplatz'
import { Offen } from '@/components/Offen'
import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/SectionHeading'
import { salonFoto, texte } from '@/content'

export function UeberDenSalon() {
  return (
    <section id="salon" aria-labelledby="salon-titel" className="abschnitt">
      <div className="container-seite">
        <Reveal>
          <SectionHeading id="salon" nummer="03" eyebrow="Der Salon" titel="Über uns" />
        </Reveal>

        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <Reveal>
            <div className="lead max-w-[46ch]">
              <Offen wert={texte.ueberDenSalon}>{(t) => <p>{t}</p>}</Offen>
            </div>
          </Reveal>
          <Reveal verzoegerung={80}>
            <Fotoplatz
              wert={salonFoto}
              seitenverhaeltnis="16 / 9"
              format="16:9 quer, ab 1600 px"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
