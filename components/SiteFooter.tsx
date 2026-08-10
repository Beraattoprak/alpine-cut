import Image from 'next/image'
import { Bergkamm } from '@/components/Bergkamm'
import { salon } from '@/content'

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-bg-2">
      <Bergkamm
        className="pointer-events-none absolute -bottom-16 left-1/2 w-[150%] max-w-none -translate-x-1/2 text-[#1A1A1A]"
        strichstaerke={3}
      />

      <div className="container-seite relative grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Image
            src="/logo.png"
            alt={salon.name}
            width={512}
            height={370}
            sizes="128px"
            className="h-auto w-[128px]"
          />
        </div>

        <div>
          <p className="label">Adresse</p>
          <address className="mt-3 not-italic text-fg-muted">
            {salon.strasse}
            <br />
            {salon.plz} {salon.ort}
            <br />
            {salon.region}, Österreich
          </address>
        </div>

        <div>
          <p className="label">Kontakt</p>
          <ul className="mt-3 grid gap-2">
            <li>
              <a href={salon.telefonHref}>{salon.telefon}</a>
            </li>
            <li>
              <a href={salon.instagram} target="_blank" rel="noreferrer noopener">
                {salon.instagramHandle}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="label">Rechtliches</p>
          <nav aria-label="Rechtliches">
            <ul className="mt-3 grid gap-2">
              <li>
                <a href="/impressum">Impressum</a>
              </li>
              <li>
                <a href="/datenschutz">Datenschutz</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  )
}
