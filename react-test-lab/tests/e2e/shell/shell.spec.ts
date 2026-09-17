import { test, expect, stepShot } from '../fixtures/test'

test.describe('Navigation and shell', () => {
  test('TC10-1 — Sidebar navigasi antar bagian utama', async ({ page, asUser }, testInfo) => {
    void asUser
    await stepShot(page, testInfo, 'Klik semua link sidebar satu per satu', async () => {
      await page.goto('/')
      for (const [nav, surface, path] of [
        ['nav-dashboard', 'dashboard-page', '/'],
        ['nav-products', 'products-page', '/products'],
        ['nav-profile', 'profile-page', '/profile'],
        ['nav-settings', 'settings-page', '/settings'],
      ]) {
        await page.getByTestId(nav).click()
        await expect(page).toHaveURL(new RegExp(`${path.replace('/', '\\/')}(?:$|\\?)`))
        await expect(page.getByTestId(surface)).toBeVisible()
      }
    })
  })

  test('TC11-1 — Route tidak dikenal menampilkan halaman 404', async ({ page, asGuest }, testInfo) => {
    void asGuest
    await stepShot(page, testInfo, 'Navigasi ke route tidak valid', async () => {
      await page.goto('/no-such-route')
      await expect(page.getByTestId('not-found-page')).toBeVisible()
    })
  })
})
