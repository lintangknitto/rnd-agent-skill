import { test, expect, stepShot } from '../fixtures/test'

test.describe('Settings and async UI', () => {
  test('TC14-1 — Toggle tema tersimpan setelah reload', async ({ page, asUser }, testInfo) => {
    void asUser
    await stepShot(page, testInfo, 'Toggle tema di sidebar', async () => {
      await page.goto('/settings')
      const before = await page.locator('html').getAttribute('data-theme')
      await page.getByTestId('theme-toggle').click()
      const after = await page.locator('html').getAttribute('data-theme')
      expect(after).not.toBe(before)
    })
    await stepShot(page, testInfo, 'Reload halaman dan verifikasi tema tetap', async () => {
      const theme = await page.locator('html').getAttribute('data-theme')
      await page.reload()
      await expect(page.getByTestId('settings-page')).toBeVisible()
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme ?? '')
      await expect(page.getByTestId('settings-theme-value')).toHaveText(theme ?? '')
    })
  })

  test('TC15-1 — Simulasi loading menampilkan skeleton', async ({ page, asUser }, testInfo) => {
    void asUser
    await page.goto('/settings')
    await stepShot(page, testInfo, 'Klik simulate-loading', async () => {
      await page.getByTestId('simulate-loading').click()
      await expect(page.getByTestId('loading-skeleton')).toBeVisible()
      await expect(page.getByTestId('settings-playground-idle')).toBeVisible({ timeout: 3000 })
      await expect(page.getByTestId('toast-viewport')).toContainText(/Loading simulation finished/i)
    })
  })

  test('TC15-2 — Simulasi empty menampilkan empty state', async ({ page, asUser }, testInfo) => {
    void asUser
    await page.goto('/settings')
    await stepShot(page, testInfo, 'Klik simulate-empty', async () => {
      await page.getByTestId('simulate-empty').click()
      await expect(page.getByTestId('empty-state')).toBeVisible()
    })
  })

  test('TC15-3 — Simulasi error menampilkan error state dan retry', async ({ page, asUser }, testInfo) => {
    void asUser
    await page.goto('/settings')
    await stepShot(page, testInfo, 'Klik simulate-error', async () => {
      await page.getByTestId('simulate-error').click()
      await expect(page.getByTestId('error-state')).toContainText(/Simulated failure/i)
    })
    await stepShot(page, testInfo, 'Klik error-retry', async () => {
      await page.getByTestId('error-retry').click()
      await expect(page.getByTestId('settings-playground-idle')).toBeVisible()
    })
  })

  test('TC16-1 — Force API error gagal lalu pulih setelah dimatikan', async ({ page, asUser }, testInfo) => {
    void asUser
    await stepShot(page, testInfo, 'Aktifkan force error dan buka products', async () => {
      await page.goto('/settings')
      await page.getByTestId('force-error-toggle').check()
      await page.goto('/products')
      await expect(page.getByTestId('error-state')).toContainText(/Simulated API failure/i)
    })
    await stepShot(page, testInfo, 'Matikan force error dan buka ulang products', async () => {
      await page.goto('/settings')
      await page.getByTestId('force-error-toggle').uncheck()
      await page.goto('/products')
      await expect(page.getByTestId('loading-skeleton')).toHaveCount(0)
      await expect(page.getByTestId('data-table')).toBeVisible()
    })
  })
})
