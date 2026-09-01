import Image from 'next/image'
import { Bergkamm } from '@/components/Bergkamm'
import { HeroParallaxe } from '@/components/hero/HeroParallaxe'
import { salon, texte } from '@/content'
import { heroFoto } from '@/content/fotos'

export function Hero() {
  return (
    <section className="hero relative isolate overflow-hidden">
      {/* Das Foto liegt hinter allem und wandert beim Scrollen langsamer als
          die Seite. Der Verlauf darüber hält die Schrift lesbar — ohne ihn
          steht Weiß auf hellem Himmel. */}
      <HeroParallaxe>
        <Image
          src={`/fotos/${heroFoto.datei}`}
          alt={heroFoto.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="hero-schleier" aria-hidden="true" />
      </HeroParallaxe>

      <Bergkamm
        className="pointer-events-none absolute -top-6 left-1/2 z-10 w-[150%] max-w-none -translate-x-1/2 text-white/[0.07] sm:w-[115%]"
        strichstaerke={3}
      />

      <div className="container-seite relative z-20 flex min-h-[86svh] flex-col justify-end pt-16 pb-[clamp(3rem,7vw,6rem)]">
        <Image
          src="/logo-gross.png"
          alt="Alpine Cut"
          width={1024}
          height={739}
          priority
          sizes="(min-width: 640px) 260px, 180px"
          className="h-auto w-[180px] sm:w-[260px]"
        />

        <h1 className="mt-8 max-w-[16ch] uppercase">{texte.heroHeadline}</h1>

        <p className="lead mt-6 max-w-[44ch] text-white/80">{texte.heroUnterzeile}</p>

        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <a
            href="#zeiten"
            className="bg-fg px-8 py-4 text-sm font-medium tracking-wide text-bg no-underline transition-opacity hover:opacity-80"
          >
            Zeiten &amp; Anfahrt
          </a>
          <a href={salon.telefonHref} className="label text-fg no-underline hover:underline">
            {salon.telefon}
          </a>
        </div>
      </div>
    </section>
  )
}
