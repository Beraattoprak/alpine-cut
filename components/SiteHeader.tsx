import { salon } from '@/content'

const sprungmarken = [
  { id: 'leistungen', text: 'Leistungen' },
  { id: 'salon', text: 'Salon' },
  { id: 'team', text: 'Team' },
  { id: 'zeiten', text: 'Zeiten' },
  { id: 'termin', text: 'Termin' },
]

export function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <div className="container-seite flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 py-6">
        <a href="#inhalt" className="font-display text-xl tracking-tight text-fg no-underline">
          {salon.name}
        </a>
        <nav aria-label="Abschnitte">
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            {sprungmarken.map((m) => (
              <li key={m.id}>
                <a href={`#${m.id}`} className="eyebrow text-fg-muted no-underline hover:text-fg">
                  {m.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
