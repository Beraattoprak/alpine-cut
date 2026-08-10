import { salon } from '@/content'

const teile = [
  salon.name,
  `${salon.strasse}`,
  `${salon.plz} ${salon.ort}`,
  salon.telefon,
  'Termin nach Vereinbarung',
]

/**
 * Waagrecht laufendes Band. Enthält ausschließlich gesicherte Daten — keine
 * erfundenen Leistungen.
 *
 * Zwei identische Spuren nebeneinander ergeben den nahtlosen Umlauf: Sobald die
 * erste um 100 % ihrer Breite nach links gewandert ist, steht die zweite exakt
 * an deren Ausgangsposition. Nur die erste Spur ist für Screenreader lesbar.
 */
export function Laufband() {
  const spur = (versteckt: boolean) => (
    <div className="laufband-spur" aria-hidden={versteckt || undefined}>
      {teile.map((t, i) => (
        <span key={`${t}-${i}`} className="label whitespace-nowrap text-fg-muted">
          {t}
          <span className="ml-10 text-fg-dim" aria-hidden="true">
            ·
          </span>
        </span>
      ))}
    </div>
  )

  return (
    <div className="laufband bg-bg-2">
      {spur(false)}
      {spur(true)}
    </div>
  )
}
