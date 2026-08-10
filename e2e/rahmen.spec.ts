import { expect, test } from '@playwright/test'

test('Seitengrund ist schwarz wie das Logo', async ({ page }) => {
  await page.goto('/')
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor)
  expect(bg).toBe('rgb(0, 0, 0)')
})

test('die Seite bleibt streng monochrom', async ({ page }) => {
  await page.goto('/')
  // Jede sichtbare Text- und Flaechenfarbe muss grau sein, also R = G = B.
  // Faengt versehentlich eingeschleppte Akzentfarben ab.
  const bunt = await page.evaluate(() => {
    const treffer: string[] = []
    const zerlegen = (v: string) => v.match(/\d+/g)?.slice(0, 3).map(Number)
    for (const el of Array.from(document.querySelectorAll('body *'))) {
      if (el.closest('[data-todo]')) continue // Marker sind absichtlich rot
      const s = getComputedStyle(el)
      for (const eigenschaft of ['color', 'backgroundColor', 'borderTopColor'] as const) {
        const rgb = zerlegen(s[eigenschaft])
        if (!rgb || s[eigenschaft].includes('rgba(0, 0, 0, 0)')) continue
        if (rgb[0] !== rgb[1] || rgb[1] !== rgb[2]) {
          treffer.push(`${el.tagName}.${el.className} ${eigenschaft}=${s[eigenschaft]}`)
        }
      }
    }
    return treffer.slice(0, 5)
  })
  expect(bunt, `bunte Werte gefunden: ${bunt.join(' | ')}`).toHaveLength(0)
})

test('Skip-Link ist der erste Fokus und springt zum Hauptinhalt', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('Tab')
  const link = page.locator(':focus')
  await expect(link).toHaveText(/Zum Inhalt springen/)
  await expect(link).toBeVisible()
  await expect(link).toHaveAttribute('href', '#inhalt')
})

test('jedes interaktive Element zeigt einen sichtbaren weißen Fokus-Ring', async ({ page }) => {
  await page.goto('/')
  const ziele = page.locator('a, button, input, select')
  const anzahl = await ziele.count()
  expect(anzahl).toBeGreaterThan(0)
  for (let i = 0; i < anzahl; i++) {
    const el = ziele.nth(i)
    if (!(await el.isVisible())) continue
    await el.focus()
    const stil = await el.evaluate((n) => {
      const s = getComputedStyle(n)
      return {
        breite: s.outlineWidth,
        farbe: s.outlineColor,
        stil: s.outlineStyle,
        wer: (n as HTMLElement).outerHTML.slice(0, 120),
      }
    })
    expect(stil.stil, stil.wer).not.toBe('none')
    expect(parseFloat(stil.breite), stil.wer).toBeGreaterThanOrEqual(2)
    expect(stil.farbe, stil.wer).toBe('rgb(255, 255, 255)')
  }
})

test('Fußzeile nennt Adresse und Telefon und verlinkt beide Rechtsseiten', async ({ page }) => {
  await page.goto('/')
  const fuss = page.getByRole('contentinfo')
  await expect(fuss).toContainText('Dorf-Platz 1')
  await expect(fuss).toContainText('6263 Fügen')
  await expect(fuss.getByRole('link', { name: '+43 676 6786333' })).toHaveAttribute(
    'href',
    'tel:+436766786333',
  )
  await expect(fuss.getByRole('link', { name: 'Impressum' })).toBeVisible()
  await expect(fuss.getByRole('link', { name: 'Datenschutz' })).toBeVisible()
  await expect(fuss.getByRole('link', { name: '@alpine.cutz' })).toHaveAttribute(
    'href',
    'https://www.instagram.com/alpine.cutz/',
  )
})

test('von der Animation ist nichts uebrig', async ({ page }) => {
  const angefragt: string[] = []
  page.on('request', (r) => {
    if (r.url().includes('/frames/') || r.url().includes('clipper-poster')) angefragt.push(r.url())
  })
  await page.goto('/')
  await page.waitForTimeout(1500)
  expect(angefragt, angefragt.join(' | ')).toHaveLength(0)
  await expect(page.locator('canvas')).toHaveCount(0)
  await expect(page.locator('.stage')).toHaveCount(0)
})

for (const breite of [360, 768, 1024, 1440]) {
  test(`kein horizontales Scrollen bei ${breite} px`, async ({ page }) => {
    await page.setViewportSize({ width: breite, height: 900 })
    for (const pfad of ['/', '/impressum', '/datenschutz']) {
      await page.goto(pfad)
      const ueberstand = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      )
      expect(ueberstand, `${pfad} bei ${breite} px`).toBeLessThanOrEqual(0)
    }
  })
}
