import { expect, test } from '@playwright/test'

test('Impressum nennt die bekannten Stammdaten', async ({ page }) => {
  await page.goto('/impressum')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Impressum')
  await expect(page.locator('main')).toContainText('Dorf-Platz 1')
  await expect(page.locator('main')).toContainText('+43 676 6786333')
})

test('Impressum markiert die noch fehlenden Pflichtangaben sichtbar', async ({ page }) => {
  await page.goto('/impressum')
  expect(await page.locator('[data-todo]').count()).toBeGreaterThanOrEqual(2)
})

test('Datenschutz beschreibt genau die Verarbeitung, die stattfindet', async ({ page }) => {
  await page.goto('/datenschutz')
  const text = await page.locator('main').innerText()
  expect(text).toContain('Resend')
  expect(text).toContain('Vercel')
  expect(text).toContain('Art. 6')
  expect(text).toMatch(/kein.{0,30}(Analyse|Analytics|Tracking)/i)
})

test('beide Rechtsseiten sind aus der Fusszeile erreichbar', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('contentinfo').getByRole('link', { name: 'Impressum' }).click()
  await expect(page).toHaveURL(/\/impressum$/)
  await page.getByRole('contentinfo').getByRole('link', { name: 'Datenschutz' }).click()
  await expect(page).toHaveURL(/\/datenschutz$/)
})
