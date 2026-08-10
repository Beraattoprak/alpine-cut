/**
 * Der Bergkamm aus dem Logo, als eigene Pfadgrafik nachgezeichnet — nicht aus
 * dem JPEG getract. Dadurch skaliert er sauber und laesst sich einfaerben.
 * Rein dekorativ, deshalb aria-hidden.
 */
export function Bergkamm({
  className,
  strichstaerke = 6,
}: {
  className?: string
  strichstaerke?: number
}) {
  return (
    <svg
      viewBox="0 0 1200 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Hauptkamm */}
      <path
        d="M20 282 L232 154 L286 186 L330 150 L372 190 L438 128 L470 156 L600 22 L716 150 L748 122 L800 178 L850 146 L900 182 L1180 282"
        stroke="currentColor"
        strokeWidth={strichstaerke}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* Schneefelder: die kurzen Zacken unterhalb der Grate */}
      <path
        d="M600 22 L566 96 L590 92 L556 152"
        stroke="currentColor"
        strokeWidth={strichstaerke}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M600 22 L640 100 L614 96 L652 158"
        stroke="currentColor"
        strokeWidth={strichstaerke}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M232 154 L214 198 L232 194 L210 232"
        stroke="currentColor"
        strokeWidth={strichstaerke}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M900 182 L918 214 L902 212 L924 244"
        stroke="currentColor"
        strokeWidth={strichstaerke}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}
