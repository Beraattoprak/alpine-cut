import type { Metadata } from 'next'
import { Rechtstext } from '@/components/Rechtstext'
import { datenschutz } from '@/content'

export const metadata: Metadata = {
  title: 'Datenschutz',
  alternates: { canonical: '/datenschutz' },
  robots: { index: false, follow: true },
}

export default function DatenschutzSeite() {
  return (
    <article className="container-seite py-[var(--abschnitt)]">
      <h1 className="mb-12">Datenschutz</h1>
      <Rechtstext abschnitte={datenschutz} />
    </article>
  )
}
