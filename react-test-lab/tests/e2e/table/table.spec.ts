import { test, expect, stepShot } from '../fixtures/test'

test.describe('Table extras', () => {
  test('TC12-1 — Sort kolom Name mengubah urutan asc/desc', async ({ page, productsPage, asUser }, testInfo) => {
    void asUser
    await productsPage.goto()
    await productsPage.waitForListReady()
    const names = () => page.locator('[data-testid^="row-"] td:first-child').allTextContents()
    await stepShot(page, testInfo, 'Klik sort-name untuk urutan ascending', async () => {
      await page.getByTestId('sort-name').click()
      await expect(page.getByTestId('sort-name')).toHaveAttribute('aria-sort', 'ascending')
      const rows = await names()
      expect(rows).toEqual([...rows].sort((a, b) => a.localeCompare(b)))
    })
    await stepShot(page, testInfo, 'Klik sort-name lagi untuk urutan descending', async () => {
      await page.getByTestId('sort-name').click()
      await expect(page.getByTestId('sort-name')).toHaveAttribute('aria-sort', 'descending')
      const rows = await names()
      expect(rows).toEqual([...rows].sort((a, b) => a.localeCompare(b)).reverse())
    })
  })

  test('TC13-1 — Pagination menampilkan 5 item dan next page berfungsi', async ({ page, productsPage, asUser }, testInfo) => {
    void asUser
    await productsPage.goto()
    await productsPage.waitForListReady()
    await stepShot(page, testInfo, 'Perhatikan halaman pertama', async () => {
      await expect(page.getByTestId('pagination-summary')).toHaveText(/Page 1 of 2 · 8 items/)
      await expect(page.locator('[data-testid^="row-"]')).toHaveCount(5)
    })
    await stepShot(page, testInfo, 'Klik pagination-next', async () => {
      await page.getByTestId('pagination-next').click()
      await expect(page.getByTestId('pagination-summary')).toHaveText(/Page 2 of 2 · 8 items/)
      await expect(page.locator('[data-testid^="row-"]')).toHaveCount(3)
    })
  })
})
