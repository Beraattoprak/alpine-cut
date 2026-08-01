import { expect, test } from '@playwright/test'

test('Seitengrund trifft den Ton des Bildmaterials', async ({ page }) => {
  await page.goto('/')
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor)
  expect(bg).toBe('rgb(250, 250, 250)')
})

test('Skip-Link ist der erste Fokus und springt zum Hauptinhalt', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('Tab')
  const link = page.locator(':focus')
  await expect(link).toHaveText(/Zum Inhalt springen/)
  await expect(link).toBeVisible()
  await expect(link).toHaveAttribute('href', '#inhalt')
})

test('jedes interaktive Element zeigt einen sichtbaren Fokus-Ring in Gold', async ({ page }) => {
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
    expect(stil.farbe, stil.wer).toBe('rgb(138, 102, 32)')
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
