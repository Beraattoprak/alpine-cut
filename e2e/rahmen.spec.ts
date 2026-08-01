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
      return { breite: s.outlineWidth, farbe: s.outlineColor, stil: s.outlineStyle }
    })
    expect(stil.stil).not.toBe('none')
    expect(parseFloat(stil.breite)).toBeGreaterThanOrEqual(2)
    expect(stil.farbe).toBe('rgb(138, 102, 32)')
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

test('kein horizontales Scrollen ab 360 px', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 })
  await page.goto('/')
  const ueberstand = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  expect(ueberstand).toBeLessThanOrEqual(0)
})
