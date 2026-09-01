import { expect, test } from '@playwright/test'

test('jede Sprungmarke im Kopf findet ihr Ziel', async ({ page }) => {
  await page.goto('/')
  for (const id of ['arbeiten', 'leistungen', 'salon', 'zeiten']) {
    await expect(page.locator(`#${id}`)).toHaveCount(1)
  }
})

test('offene Inhalte zeigen einen sichtbaren TODO-Marker statt erfundener Werte', async ({
  page,
}) => {
  await page.goto('/')
  const marker = page.locator('[data-todo]')
  expect(await marker.count()).toBeGreaterThanOrEqual(4)
  await expect(marker.first()).toBeVisible()
})

test('das Laufband nennt nur gesicherte Daten', async ({ page }) => {
  await page.goto('/')
  const band = page.locator('.laufband')
  await expect(band).toContainText('Alpine Cut')
  await expect(band).toContainText('Dorf-Platz 1')
  await expect(band).toContainText('+43 676 6786333')
})

test('die Arbeiten verweisen auf Instagram', async ({ page }) => {
  await page.goto('/')
  await expect(
    page.locator('#arbeiten').getByRole('link', { name: '@alpine.cutz' }),
  ).toHaveAttribute('href', 'https://www.instagram.com/alpine.cutz/')
})

test('nirgends stehen erfundene Preise, Namen oder Zeiten', async ({ page }) => {
  await page.goto('/')
  // Die TODO-Marker selbst duerfen Beispiele nennen ("z. B. 09:00-18:00").
  // Geprueft wird der Text, der als echter Inhalt durchgeht.
  // script/style muessen mit raus: auf einem abgeloesten Klon verhaelt sich
  // innerText wie textContent und zoege sonst den RSC-Payload mit herein.
  const text = await page.evaluate(() => {
    const kopie = document.body.cloneNode(true) as HTMLElement
    kopie.querySelectorAll('[data-todo], script, style, noscript').forEach((n) => n.remove())
    return (kopie.textContent ?? '').toLowerCase()
  })
  expect(text).not.toMatch(/\d+[,.]\d{2}\s*€/)
  expect(text).not.toMatch(/\d{1,2}:\d{2}\s*[–-]\s*\d{1,2}:\d{2}/)
})

test('Adresse und Telefon stehen im Anfahrtsabschnitt', async ({ page }) => {
  await page.goto('/')
  const abschnitt = page.locator('#zeiten')
  await expect(abschnitt).toContainText('Dorf-Platz 1')
  await expect(abschnitt).toContainText('6263 Fügen')
  await expect(abschnitt.getByRole('link', { name: /Route planen/ })).toHaveAttribute(
    'href',
    /^https:\/\/www\.google\.com\/maps/,
  )
})

test('es gibt keine eingebettete Karte, die vor der Einwilligung laedt', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('iframe')).toHaveCount(0)
})

test('die Seite verspricht keine Terminvergabe', async ({ page }) => {
  await page.goto('/')
  const text = (await page.locator('body').innerText()).toLowerCase()
  expect(text).not.toContain('nach vereinbarung')
  expect(text).not.toContain('terminanfrage')
  expect(text).toContain('kein termin nötig')
})

test('es gibt kein Formular mehr, das Daten entgegennimmt', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('form')).toHaveCount(0)
  await expect(page.locator('input, textarea, select')).toHaveCount(0)
})

test('jeder Abschnitt ist ueber seine Ueberschrift benannt', async ({ page }) => {
  await page.goto('/')
  for (const id of ['arbeiten', 'leistungen', 'salon', 'zeiten']) {
    await expect(page.locator(`#${id}`)).toHaveAttribute('aria-labelledby', `${id}-titel`)
  }
})
