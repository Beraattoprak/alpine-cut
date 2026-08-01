import type { MetadataRoute } from 'next'
import { SEITEN, SITE_URL } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const jetzt = new Date()
  return SEITEN.map((pfad) => ({
    url: `${SITE_URL}${pfad}`,
    lastModified: jetzt,
    changeFrequency: pfad === '/' ? 'monthly' : 'yearly',
    priority: pfad === '/' ? 1 : 0.3,
  }))
}
