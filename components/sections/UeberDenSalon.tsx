import { Bergkamm } from '@/components/Bergkamm'
import { Offen } from '@/components/Offen'
import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/SectionHeading'
import { texte } from '@/content'

export function UeberDenSalon() {
  return (
    <section
      id="salon"
      aria-labelledby="salon-titel"
      className="abschnitt relative isolate overflow-hidden"
    >
      {/* Kein Fotoplatz mehr: Die Salonbilder stehen alle im Abschnitt
          "Einblick". Hier traegt der Bergkamm die Flaeche, statt dass ein
          leerer Rahmen auf ein Bild wartet, das es schon gibt. */}
      <Bergkamm
        className="pointer-events-none absolute -bottom-10 left-1/2 -z-10 w-[150%] max-w-none -translate-x-1/2 text-[#161616] sm:w-[110%]"
        strichstaerke={3}
      />

      <div className="container-seite">
        <Reveal>
          <SectionHeading id="salon" nummer="03" eyebrow="Der Salon" titel="Über uns" />
        </Reveal>

        <Reveal verzoegerung={80}>
          <div className="max-w-[38ch] text-[length:var(--mass-h3)] leading-snug">
            <Offen wert={texte.ueberDenSalon}>{(t) => <p>{t}</p>}</Offen>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
