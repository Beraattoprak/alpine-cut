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
  //
  // Die Farbwerte werden ueber ein Canvas normalisiert statt aus dem String
  // gelesen: Tailwind kompiliert Angaben wie text-white/[0.07] zu
  // oklab(0.999994 0.0000455678 … / 0.07). Ein Ziffern-Regex zieht daraus
  // "999994, 455678, 200868" und haelt reines Weiss fuer bunt.
  const bunt = await page.evaluate(() => {
    const treffer: string[] = []
    const c = document.createElement('canvas')
    c.width = c.height = 1
    const ctx = c.getContext('2d', { willReadFrequently: true })!

    const alsRgb = (wert: string) => {
      ctx.clearRect(0, 0, 1, 1)
      ctx.fillStyle = '#000000'
      ctx.fillStyle = wert
      ctx.fillRect(0, 0, 1, 1)
      const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data
      return { r, g, b, a }
    }

    for (const el of Array.from(document.querySelectorAll('body *'))) {
      if (el.closest('[data-todo]')) continue // Marker sind absichtlich rot
      const s = getComputedStyle(el)
      for (const eigenschaft of ['color', 'backgroundColor', 'borderTopColor'] as const) {
        const wert = s[eigenschaft]
        if (!wert) continue
        const { r, g, b, a } = alsRgb(wert)
        if (a === 0) continue // unsichtbar, Farbe egal
        // Toleranz 2: Farbraumumrechnung rundet.
        if (Math.abs(r - g) > 2 || Math.abs(g - b) > 2) {
          treffer.push(`${el.tagName}.${el.className} ${eigenschaft}=${wert} -> ${r},${g},${b}`)
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

/**
 * Echtes Tabben, nicht el.focus(): Beide Wege unterscheiden sich. Als die
 * Seite noch ein Datumsfeld hatte, war das beim Tabben vier Stationen — die
 * vierte, Chromes Kalendersymbol, hatte keinen Ring, und mit programmatischem
 * focus() fiel das nicht auf. Das Feld ist inzwischen weg, die Lehre bleibt.
 */
test('jede Tab-Station zeigt einen sichtbaren weißen Fokus-Ring', async ({ page }) => {
  await page.goto('/')
  await page.locator('body').click({ position: { x: 2, y: 2 } })

  // Feste Anzahl Tabs statt Abbruch bei Wiederholung: Mehrere Elemente teilen
  // sich dasselbe Markup (die Fotoplätze, die Navigationslinks). Ein Abbruch
  // beim ersten "schon gesehen" beendete den Durchlauf vor dem Formular — und
  // genau dort saß der Fehler, den dieser Test finden soll.
  let stationen = 0
  for (let i = 0; i < 32; i++) {
    await page.keyboard.press('Tab')
    const stil = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null
      if (!el || el === document.body) return null
      const s = getComputedStyle(el)
      return {
        breite: s.outlineWidth,
        farbe: s.outlineColor,
        stil: s.outlineStyle,
        wer: el.outerHTML.slice(0, 110),
      }
    })
    if (!stil) continue
    stationen++

    expect(stil.stil, stil.wer).not.toBe('none')
    expect(parseFloat(stil.breite), stil.wer).toBeGreaterThanOrEqual(2)
    expect(stil.farbe, stil.wer).toBe('rgb(255, 255, 255)')
  }

  // Untergrenze, damit der Test nicht gruen wird, weil er nichts erreicht hat:
  // Kopfzeile, Hero, Arbeiten, Anfahrt und Fusszeile bringen zusammen deutlich
  // mehr als zehn Stationen mit.
  expect(stationen, 'zu wenige Tab-Stationen erreicht').toBeGreaterThan(10)
})

test('die Seite meldet sich dem Browser als dunkel', async ({ page }) => {
  await page.goto('/')
  // Ohne color-scheme: dark rendert Chrome seine eingebauten Bedienelemente
  // hell: dunkles Kalendersymbol auf schwarzem Grund, weisses Datumswaehler-Popup.
  const schema = await page.evaluate(
    () => getComputedStyle(document.documentElement).colorScheme,
  )
  expect(schema).toBe('dark')
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
