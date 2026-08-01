import { expect, test } from '@playwright/test'

test.describe('Terminanfrage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#termin')
  })

  test('nennt bei leerem Absenden jedes fehlende Feld beim Namen', async ({ page }) => {
    await page.getByRole('button', { name: 'Anfrage senden' }).click()
    // Nicht getByRole('alert'): der Route-Announcer von Next traegt dieselbe Rolle.
    await expect(page.getByTestId('form-meldung')).toContainText(
      'Bitte prüfen Sie die markierten Felder.',
    )
    await expect(page.getByText('mindestens zwei Zeichen')).toBeVisible()
    await expect(page.getByText('Bitte mit Vorwahl angeben')).toBeVisible()
  })

  test('erklaert bei einer unbrauchbaren Telefonnummer, was erlaubt ist', async ({ page }) => {
    await page.getByLabel('Name').fill('Maria Huber')
    await page.getByLabel('Telefon').fill('ruf mich an')
    await page.getByRole('button', { name: 'Anfrage senden' }).click()
    await expect(page.getByText('unerlaubte Zeichen')).toBeVisible()
  })

  test('markiert fehlerhafte Felder fuer Hilfstechnik', async ({ page }) => {
    await page.getByRole('button', { name: 'Anfrage senden' }).click()
    await expect(page.getByLabel('Name')).toHaveAttribute('aria-invalid', 'true')
  })

  test('nennt bei fehlender Konfiguration die Telefonnummer als Ausweg', async ({ page }) => {
    const morgen = new Date(Date.now() + 86_400_000).toISOString().slice(0, 10)
    await page.getByLabel('Name').fill('Maria Huber')
    await page.getByLabel('Telefon').fill('0512 123456')
    await page.getByLabel('Wunschleistung').fill('Haarschnitt')
    await page.getByLabel('Wunschtermin').fill(morgen)
    await page.getByRole('button', { name: 'Anfrage senden' }).click()
    await expect(page.getByTestId('form-meldung')).toContainText('+43 676 6786333')
  })

  test('ist vollstaendig mit der Tastatur bedienbar', async ({ page }) => {
    await page.getByLabel('Name').focus()
    await page.keyboard.type('Maria Huber')
    await page.keyboard.press('Tab')
    await page.keyboard.type('0512 123456')
    await expect(page.getByLabel('Telefon')).toHaveValue('0512 123456')
  })
})
