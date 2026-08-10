import Image from 'next/image'
import { Bergkamm } from '@/components/Bergkamm'
import { Fotoplatz } from '@/components/Fotoplatz'
import { salon, texte } from '@/content'
import { heroFoto } from '@/content/fotos'

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-10 pb-[var(--abschnitt)] sm:pt-16">
      {/* Bergkamm, riesig und sehr dunkel. Rein grafisch, kein Inhalt. */}
      <Bergkamm
        className="pointer-events-none absolute -top-4 left-1/2 w-[160%] max-w-none -translate-x-1/2 text-[#141414] sm:w-[120%]"
        strichstaerke={3}
      />

      <div className="container-seite relative">
        <Image
          src="/logo-gross.png"
          alt="Alpine Cut"
          width={1024}
          height={739}
          priority
          sizes="(min-width: 640px) 280px, 200px"
          className="h-auto w-[200px] sm:w-[280px]"
        />

        <h1 className="mt-10 max-w-[16ch] uppercase">{texte.heroHeadline}</h1>

        <p className="lead mt-8 max-w-[42ch]">{texte.heroUnterzeile}</p>

        <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-4">
          <a
            href="#termin"
            className="bg-fg px-8 py-4 text-sm font-medium tracking-wide text-bg no-underline transition-opacity hover:opacity-80"
          >
            Termin anfragen
          </a>
          <a href={salon.telefonHref} className="label text-fg no-underline hover:underline">
            {salon.telefon}
          </a>
        </div>

        <div className="mt-20 grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:items-end">
          <Fotoplatz
            wert={heroFoto}
            seitenverhaeltnis="3 / 2"
            format="3:2 quer, ab 2000 px"
            sizes="(min-width: 1024px) 60vw, 100vw"
            prioritaet
          />
          <dl className="grid gap-6 border-t border-line pt-8 lg:border-t-0 lg:pt-0">
            <div>
              <dt className="label">Adresse</dt>
              <dd className="mt-2">
                {salon.strasse}
                <br />
                {salon.plz} {salon.ort}, {salon.region}
              </dd>
            </div>
            <div>
              <dt className="label">Instagram</dt>
              <dd className="mt-2">
                <a href={salon.instagram} target="_blank" rel="noreferrer noopener">
                  @alpine.cutz
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  )
}
