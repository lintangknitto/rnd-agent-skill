import { test, expect, stepShot } from '../fixtures/test'

test('TC17-1 — Pilih gambar menampilkan preview dan clear menghapusnya', async ({ page, productsPage, asUser }, testInfo) => {
  void asUser
  await productsPage.goto()
  await productsPage.waitForListReady()
  await productsPage.openCreate()
  await stepShot(page, testInfo, 'Pilih file gambar lewat file-input', async () => {
    await page.getByTestId('file-input').setInputFiles({
      name: 'qa-thumbnail.png',
      mimeType: 'image/png',
       buffer: Buffer.from(
         'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
         'base64',
       ),
    })
    await expect(page.getByTestId('file-preview')).toBeVisible()
  })
  await stepShot(page, testInfo, 'Klik file-clear', async () => {
    await page.getByTestId('file-clear').click()
    await expect(page.getByTestId('file-preview')).toHaveCount(0)
  })
})
