import { salon } from '@/content'

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="container-seite flex flex-col gap-8 py-12 sm:flex-row sm:justify-between">
        <address className="not-italic">
          <p className="font-display text-xl">{salon.name}</p>
          <p className="text-fg-muted">{salon.strasse}</p>
          <p className="text-fg-muted">
            {salon.plz} {salon.ort}
          </p>
          <p className="mt-2">
            <a href={salon.telefonHref}>{salon.telefon}</a>
          </p>
        </address>
        <nav aria-label="Rechtliches">
          <ul className="flex gap-5">
            <li>
              <a href="/impressum">Impressum</a>
            </li>
            <li>
              <a href="/datenschutz">Datenschutz</a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  )
}
