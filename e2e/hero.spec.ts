import { expect, type Page, test } from '@playwright/test'

/**
 * Wartet, bis der Canvas zur Ruhe gekommen ist, und liefert einen
 * Fingerabdruck. Gelesen werden die echten Pixel ueber die ganze Flaeche —
 * ein Ausschnitt der Data-URL taugt nicht, weil die Bildraender in jedem
 * Frame gleich weiss sind.
 */
async function canvasSignatur(page: Page) {
  let letzte = ''
  await expect
    .poll(
      async () => {
        const jetzt = await page.evaluate(() => {
          // Nur der aktive Canvas zaehlt. Solange das Scrubbing nicht laeuft,
          // liefert die Funktion '' und die Abfrage wartet weiter — sonst
          // stabilisiert sich der Fingerabdruck auf einer leeren Flaeche.
          const c = document.querySelector('canvas[data-aktiv="an"]') as HTMLCanvasElement | null
          const ctx = c?.getContext('2d')
          if (!c || !ctx || c.width === 0) return ''
          const daten = ctx.getImageData(0, 0, c.width, c.height).data
          let h = 2166136261
          for (let i = 0; i < daten.length; i += 997 * 4) {
            h ^= daten[i]
            h = Math.imul(h, 16777619)
          }
          return String(h >>> 0)
        })
        const stabil = jetzt !== '' && jetzt === letzte
        letzte = jetzt
        return stabil
      },
      { timeout: 20_000, intervals: [300] },
    )
    .toBe(true)
  return letzte
}

async function scrolleZu(page: Page, anteil: number) {
  await page.evaluate((a) => {
    const s = document.querySelector('.stage') as HTMLElement
    window.scrollTo(0, s.offsetTop + (s.offsetHeight - window.innerHeight) * a)
  }, anteil)
}

test.describe('Hero auf dem Desktop', () => {
  test('die Buehne ist 200vh laenger als der Viewport', async ({ page }, info) => {
    test.skip(info.project.name !== 'desktop', 'nur Desktop')
    await page.goto('/')
    const { hoehe, viewport } = await page.evaluate(() => ({
      hoehe: (document.querySelector('.stage') as HTMLElement).offsetHeight,
      viewport: window.innerHeight,
    }))
    expect(hoehe).toBeGreaterThan(viewport * 2.8)
    expect(hoehe).toBeLessThan(viewport * 3.2)
  })

  test('scrollen veraendert das Bild, zurueckscrollen stellt es wieder her', async ({
    page,
  }, info) => {
    test.skip(info.project.name !== 'desktop', 'nur Desktop')
    await page.goto('/')
    const oben = await canvasSignatur(page)

    await scrolleZu(page, 0.5)
    const mitte = await canvasSignatur(page)
    expect(mitte).not.toBe(oben)

    await scrolleZu(page, 0.95)
    const unten = await canvasSignatur(page)
    expect(unten).not.toBe(mitte)

    // Rueckwaerts: die Maschine fuegt sich wieder zusammen.
    await page.evaluate(() => window.scrollTo(0, 0))
    const wiederOben = await canvasSignatur(page)
    expect(wiederOben).toBe(oben)
  })

  test('der Textwechsel kehrt beim Zurueckscrollen um', async ({ page }, info) => {
    test.skip(info.project.name !== 'desktop', 'nur Desktop')
    await page.goto('/')
    const stage = page.locator('.stage')
    await expect(stage).toHaveAttribute('data-phase', 'a')

    await scrolleZu(page, 0.9)
    await expect(stage).toHaveAttribute('data-phase', 'b')
    await expect(page.getByTestId('hero-text-b')).toBeVisible()
    await expect(page.getByTestId('hero-text-a')).toBeHidden()

    await page.evaluate(() => window.scrollTo(0, 0))
    await expect(stage).toHaveAttribute('data-phase', 'a')
    await expect(page.getByTestId('hero-text-a')).toBeVisible()
    await expect(page.getByTestId('hero-text-b')).toBeHidden()
  })

  test('nach einem Reload mitten in der Strecke steht sofort der richtige Frame', async ({
    page,
  }, info) => {
    test.skip(info.project.name !== 'desktop', 'nur Desktop')
    await page.goto('/')
    await scrolleZu(page, 0.6)
    const vorher = await canvasSignatur(page)

    await page.reload()
    await scrolleZu(page, 0.6)
    const nachher = await canvasSignatur(page)
    expect(nachher).toBe(vorher)
  })
})

test.describe('Hero ohne Scrubbing', () => {
  test('mobil gibt es weder Scrollstrecke noch Frame-Requests', async ({ page }, info) => {
    test.skip(info.project.name !== 'mobil', 'nur mobil')
    const frames: string[] = []
    page.on('request', (r) => {
      if (r.url().includes('/frames/')) frames.push(r.url())
    })

    await page.goto('/')
    await page.waitForTimeout(2500)

    const { hoehe, viewport } = await page.evaluate(() => ({
      hoehe: (document.querySelector('.stage') as HTMLElement).offsetHeight,
      viewport: window.innerHeight,
    }))
    expect(hoehe).toBeLessThan(viewport * 1.1)
    expect(frames).toHaveLength(0)
    await expect(page.getByTestId('hero-poster')).toBeVisible()
  })

  test('bei reduzierter Bewegung bleiben beide Textbloecke lesbar', async ({ browser }, info) => {
    test.skip(info.project.name !== 'desktop', 'nur Desktop')
    const kontext = await browser.newContext({
      reducedMotion: 'reduce',
      viewport: { width: 1440, height: 900 },
    })
    const page = await kontext.newPage()
    const frames: string[] = []
    page.on('request', (r) => {
      if (r.url().includes('/frames/')) frames.push(r.url())
    })

    await page.goto('/')
    await page.waitForTimeout(2500)

    const { hoehe, viewport } = await page.evaluate(() => ({
      hoehe: (document.querySelector('.stage') as HTMLElement).offsetHeight,
      viewport: window.innerHeight,
    }))
    expect(hoehe).toBeLessThan(viewport * 1.1)
    expect(frames).toHaveLength(0)
    await expect(page.getByTestId('hero-text-a')).toBeVisible()
    await expect(page.getByTestId('hero-text-b')).toBeVisible()
    await kontext.close()
  })
})
