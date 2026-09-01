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

/**
 * Echtes Tabben, nicht el.focus(): Beide Wege unterscheiden sich. Ein
 * <input type="date"> ist beim Tabben vier Stationen — Tag, Monat, Jahr und
 * das Kalendersymbol —, waehrend focus() nur das Feld als Ganzes anspringt.
 * Genau die vierte Station hatte keinen Fokus-Ring, und mit programmatischem
 * focus() faellt das nicht auf.
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
        istDatum: el.tagName === 'INPUT' && el.getAttribute('type') === 'date',
        wer: el.outerHTML.slice(0, 110),
      }
    })
    if (!stil) continue
    stationen++

    // Chromes Kalendersymbol im Datumsfeld ist eine eigene Tab-Station im
    // Shadow-DOM. document.activeElement meldet das Wirtselement, dessen
    // Fokus-Ring dort nicht greift — der Ring sitzt auf dem Shadow-Teil und
    // ist von aussen nicht messbar. Er wird in globals.css gesetzt und weiter
    // unten gesondert geprueft.
    if (stil.istDatum && stil.stil === 'none') continue

    expect(stil.stil, stil.wer).not.toBe('none')
    expect(parseFloat(stil.breite), stil.wer).toBeGreaterThanOrEqual(2)
    expect(stil.farbe, stil.wer).toBe('rgb(255, 255, 255)')
  }

  // Das Formular liegt weit unten im Tab-Weg. Wird es nicht erreicht, hat der
  // Test seinen Zweck verfehlt, auch wenn er gruen ist.
  expect(stationen, 'zu wenige Tab-Stationen erreicht').toBeGreaterThan(20)
  await expect(page.locator('input[type="date"]')).toHaveCount(1)
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

test('das Kalendersymbol im Datumsfeld hat einen eigenen Fokus-Ring', async ({ page }) => {
  await page.goto('/')
  // Der Shadow-Teil ist von aussen nicht messbar, die Regel dafuer aber schon.
  const regeln = await page.evaluate(() => {
    const treffer: string[] = []
    for (const blatt of Array.from(document.styleSheets)) {
      let regelListe: CSSRuleList
      try {
        regelListe = blatt.cssRules
      } catch {
        continue
      }
      for (const r of Array.from(regelListe)) {
        const s = (r as CSSStyleRule).selectorText
        if (s?.includes('calendar-picker-indicator') && s.includes(':focus')) {
          treffer.push(s + ' { ' + (r as CSSStyleRule).style.cssText.slice(0, 60) + ' }')
        }
      }
    }
    return treffer
  })
  expect(regeln.join(' | ')).toContain('outline')
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
