import { expect, test } from '@playwright/test'

test('Titel und Beschreibung stehen und nennen den Ort', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Alpine Cut/)
  const desc = await page.locator('meta[name="description"]').getAttribute('content')
  expect(desc).toContain('Fügen')
  expect(desc).not.toContain('TODO')
})

test('Open Graph ist vollstaendig', async ({ page }) => {
  await page.goto('/')
  for (const eigenschaft of ['og:title', 'og:description', 'og:type', 'og:image']) {
    const wert = await page.locator(`meta[property="${eigenschaft}"]`).getAttribute('content')
    expect(wert, eigenschaft).toBeTruthy()
  }
})

test('JSON-LD ist gueltiges JSON ohne Platzhalter', async ({ page }) => {
  await page.goto('/')
  const roh = await page.locator('script[type="application/ld+json"]').innerText()
  const daten = JSON.parse(roh)
  expect(daten['@type']).toBe('HairSalon')
  expect(roh).not.toContain('TODO')
})

test('sitemap.xml und robots.txt werden ausgeliefert', async ({ request }) => {
  const sitemap = await request.get('/sitemap.xml')
  expect(sitemap.status()).toBe(200)
  expect(await sitemap.text()).toContain('<urlset')

  const robots = await request.get('/robots.txt')
  expect(robots.status()).toBe(200)
  expect(await robots.text()).toContain('Sitemap:')
})
