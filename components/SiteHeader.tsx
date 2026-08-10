import { salon } from '@/content'

const sprungmarken = [
  { id: 'arbeiten', text: 'Arbeiten' },
  { id: 'leistungen', text: 'Leistungen' },
  { id: 'salon', text: 'Salon' },
  { id: 'zeiten', text: 'Zeiten' },
]

export function SiteHeader() {
  return (
    // Im normalen Fluss statt absolut: bricht die Navigation auf schmalen
    // Geräten um, schiebt sie den Hero nach unten, statt ihn zu überlagern.
    <header className="relative z-50">
      <div className="container-seite flex flex-wrap items-center justify-between gap-x-8 gap-y-3 py-6">
        {/* Wortmarke als Schrift, nicht als Bild: Das Logo steht gross im Hero
            direkt darunter — zweimal waere eine Dopplung. Die weite Sperrung
            greift das "A L P I N E" des Logos auf. */}
        <a
          href="#inhalt"
          className="label shrink-0 text-fg no-underline"
          style={{ fontSize: '0.875rem' }}
        >
          {salon.name}
        </a>

        <nav aria-label="Abschnitte">
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {sprungmarken.map((m) => (
              <li key={m.id}>
                <a href={`#${m.id}`} className="label text-fg-muted no-underline hover:text-fg">
                  {m.text}
                </a>
              </li>
            ))}
            <li>
              <a
                href={salon.instagram}
                target="_blank"
                rel="noreferrer noopener"
                className="label text-fg no-underline hover:underline"
              >
                Instagram
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
