import Image from 'next/image'
import { Offen } from '@/components/Offen'
import { SectionHeading } from '@/components/SectionHeading'
import { texte } from '@/content'

export function UeberDenSalon() {
  return (
    <section id="salon" aria-labelledby="salon-titel" className="abschnitt">
      <div className="container-seite grid gap-12 md:grid-cols-2 md:items-center">
        <div>
          <SectionHeading id="salon" nummer="02" eyebrow="Der Salon" titel="Über uns" />
          <div className="lead max-w-prose text-fg-muted">
            <Offen wert={texte.ueberDenSalon}>{(t) => <p>{t}</p>}</Offen>
          </div>
        </div>
        <Image
          src="/clipper-foto.jpg"
          alt="Haarschneidemaschine vor hellem Grund"
          width={1600}
          height={904}
          sizes="(min-width: 768px) 50vw, 100vw"
          className="h-auto w-full"
        />
      </div>
    </section>
  )
}
