import type { Metadata } from 'next'
import { Rechtstext } from '@/components/Rechtstext'
import { impressum } from '@/content'

export const metadata: Metadata = {
  title: 'Impressum',
  alternates: { canonical: '/impressum' },
  robots: { index: false, follow: true },
}

export default function ImpressumSeite() {
  return (
    <article className="container-seite py-[var(--abschnitt)]">
      <h1 className="mb-12">Impressum</h1>
      <Rechtstext abschnitte={impressum} />
    </article>
  )
}
