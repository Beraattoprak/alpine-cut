import { expect, test } from '@playwright/test'

test('jede Sprungmarke im Kopf findet ihr Ziel', async ({ page }) => {
  await page.goto('/')
  for (const id of ['arbeiten', 'leistungen', 'salon', 'zeiten', 'anfahrt']) {
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

test('die Adresse steht im Anfahrtsabschnitt', async ({ page }) => {
  await page.goto('/')
  const abschnitt = page.locator('#anfahrt')
  await expect(abschnitt).toContainText('Dorf-Platz 1')
  await expect(abschnitt).toContainText('6263 Fügen')
})

test('die Telefonnummer steht bei den Oeffnungszeiten', async ({ page }) => {
  await page.goto('/')
  await expect(
    page.locator('#zeiten').getByRole('link', { name: '+43 676 6786333' }),
  ).toBeVisible()
})

test.describe('Karte', () => {
  /** Die Karte laedt ohne Klick, aber erst wenn der Abschnitt in Sichtweite kommt. */
  async function zurKarteScrollen(page: import('@playwright/test').Page) {
    await page.goto('/')
    await page.locator('#anfahrt').scrollIntoViewIfNeeded()
  }

  test('laedt beim Seitenaufruf noch nicht — sie kostet dort nichts', async ({ page }) => {
    const anGoogle: string[] = []
    page.on('request', (r) => {
      if (/google|gstatic|googleapis/i.test(r.url())) anGoogle.push(r.url())
    })
    await page.goto('/')
    await page.waitForTimeout(1200)
    await expect(page.locator('#anfahrt iframe')).toHaveCount(0)
    expect(anGoogle, anGoogle.join(' | ')).toHaveLength(0)
  })

  test('erscheint ohne Klick, sobald der Abschnitt in Sicht kommt', async ({ page }) => {
    await zurKarteScrollen(page)
    const rahmen = page.locator('#anfahrt iframe')
    await expect(rahmen).toHaveCount(1)
    await expect(rahmen).toHaveAttribute('loading', 'lazy')
    await expect(rahmen).toHaveAttribute('referrerpolicy', 'no-referrer-when-downgrade')
    await expect(rahmen).toHaveAttribute('title', /Karte mit dem Standort/)
    await expect(rahmen).toHaveAttribute('src', /output=embed/)
    await expect(rahmen).toHaveAttribute('allowfullscreen', '')
  })

  /**
   * Ein fremdes iframe laesst sich von der Wirtsseite aus nicht als fokussiert
   * erkennen: iframe:focus und :focus-within matchen nicht, focus-Ereignisse
   * kommen nicht an, und Chrome zeichnet keinen eigenen Ring. Eine Tab-Station
   * ohne sichtbaren Fokus verstiesse gegen WCAG 2.4.7 — deshalb ist die Karte
   * bewusst nicht anspringbar. Der gleichwertige Weg steht daneben.
   */
  test('ist nicht per Tastatur anspringbar, hat aber eine gleichwertige Alternative', async ({
    page,
  }) => {
    await zurKarteScrollen(page)
    await expect(page.locator('#anfahrt iframe')).toHaveAttribute('tabindex', '-1')

    await page.evaluate(() => window.scrollTo(0, 0))
    await page.locator('body').click({ position: { x: 2, y: 2 } })
    let aufKarte = false
    for (let i = 0; i < 32; i++) {
      await page.keyboard.press('Tab')
      if (await page.evaluate(() => document.activeElement?.tagName === 'IFRAME')) {
        aufKarte = true
        break
      }
    }
    expect(aufKarte, 'Tab landet auf der Karte, ohne dass ein Ring sichtbar waere').toBe(false)

    const abschnitt = page.locator('#anfahrt')
    await expect(abschnitt).toContainText('Dorf-Platz 1')
    await expect(abschnitt.getByRole('link', { name: 'Route planen' })).toBeVisible()
  })

  test('hat ihre Flaeche schon vor dem Zeichnen — kein Layout-Sprung', async ({ page }) => {
    await page.goto('/', { waitUntil: 'commit' })
    const rahmen = page.locator('#anfahrt .karte')
    await rahmen.waitFor()
    const frueh = await rahmen.boundingBox()
    await page.waitForLoadState('networkidle')
    const spaet = await rahmen.boundingBox()
    expect(Math.abs(spaet!.height - frueh!.height)).toBeLessThan(2)
  })

  /**
   * Die Karte laedt jetzt ohne Einwilligung. Damit muss die
   * Datenschutzerklaerung das auch sagen — sonst beschreibt sie einen
   * Zustand, den es nicht mehr gibt. Dieser Test haelt beides zusammen.
   */
  test('wird in der Datenschutzerklaerung zutreffend beschrieben', async ({ page }) => {
    await zurKarteScrollen(page)
    await expect(page.locator('#anfahrt iframe')).toHaveCount(1)

    await page.goto('/datenschutz')
    const text = await page.locator('main').innerText()
    expect(text).toContain('Google Maps')
    expect(text).toContain('IP-Adresse')
    expect(text).toMatch(/in Sichtweite kommt/i)
    // Ohne Klick gibt es keine Einwilligung — die Erklaerung darf keine behaupten.
    expect(text).not.toMatch(/lit\. a DSGVO/)
  })

  test('Route planen fuehrt zu Google Maps und oeffnet einen neuen Tab', async ({ page }) => {
    await page.goto('/')
    const link = page.locator('#anfahrt').getByRole('link', { name: 'Route planen' })
    await expect(link).toHaveAttribute('href', /^https:\/\/www\.google\.com\/maps\/dir/)
    await expect(link).toHaveAttribute('target', '_blank')
    await expect(link).toHaveAttribute('rel', /noopener/)
  })

  test('Route planen und Karte gibt es genau einmal', async ({ page }) => {
    await page.goto('/')
    // Die Adresse darf mehrfach vorkommen — im Hero zur Orientierung, im
    // Laufband, in der Fusszeile. Der Routen-Link und die Karte gehoeren
    // dagegen an genau eine Stelle, sonst fragt sich der Besucher, welche
    // der beiden die richtige ist.
    await expect(page.getByRole('link', { name: 'Route planen' })).toHaveCount(1)
    await expect(page.locator('.karte')).toHaveCount(1)
  })
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
  for (const id of ['arbeiten', 'leistungen', 'salon', 'zeiten', 'anfahrt']) {
    await expect(page.locator(`#${id}`)).toHaveAttribute('aria-labelledby', `${id}-titel`)
  }
})
