import { arbeiten } from '@/content'

import { ImageAutoSlider } from '@/components/ui/image-auto-slider'

/** So läuft das Band mit den Arbeiten aus dem Salon. */
export function DemoOne() {
  return (
    <ImageAutoSlider
      bilder={arbeiten.map((f) => ({
        src: `/fotos/${f.datei}`,
        alt: f.alt,
        format: f.format,
      }))}
    />
  )
}

/** Langsamer, für ruhigere Abschnitte. */
export function DemoLangsam() {
  return (
    <ImageAutoSlider
      dauer={70}
      bilder={arbeiten.map((f) => ({
        src: `/fotos/${f.datei}`,
        alt: f.alt,
        format: f.format,
      }))}
    />
  )
}
