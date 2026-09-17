import { test, expect, stepShot } from '../fixtures/test'

test.describe('Products P0', () => {
  test('TC4-1 — Daftar produk termuat setelah login', async ({
    page,
    productsPage,
    asUser,
  }, testInfo) => {
    void asUser
    await stepShot(page, testInfo, 'Buka /products', async () => {
      await productsPage.goto()
      await productsPage.waitForListReady()
    })
    await stepShot(page, testInfo, 'Produk tampil di tabel', async () => {
      await productsPage.search('Canvas Tote Bag')
      await expect(page.getByText('Canvas Tote Bag')).toBeVisible()
      await expect(page.getByTestId('data-table')).toBeVisible()
    })
  })

  test('TC5-1 — Pencarian memfilter baris produk', async ({
    page,
    productsPage,
    asUser,
  }, testInfo) => {
    void asUser
    await stepShot(page, testInfo, 'Muat daftar produk', async () => {
      await productsPage.goto()
      await productsPage.waitForListReady()
    })
    await stepShot(page, testInfo, 'Ketik "Mug" di pencarian', async () => {
      await productsPage.search('Mug')
      await expect(page.getByText('Ceramic Mug')).toBeVisible()
      await expect(page.getByText('Canvas Tote Bag')).toHaveCount(0)
    })
  })

  test('TC5-2 — Pencarian tanpa hasil menampilkan empty state', async ({
    page,
    productsPage,
    asUser,
  }, testInfo) => {
    void asUser
    await stepShot(page, testInfo, 'Ketik query tanpa hasil', async () => {
      await productsPage.goto()
      await productsPage.waitForListReady()
      await productsPage.search('zzz-no-match-xyz')
      await expect(page.getByTestId('empty-state')).toBeVisible()
      await expect(page.getByTestId('data-table')).toHaveCount(0)
    })
  })

  test('TC6-1 — Filter status memfilter baris produk', async ({
    page,
    productsPage,
    asUser,
  }, testInfo) => {
    void asUser
    await stepShot(page, testInfo, 'Muat daftar produk', async () => {
      await productsPage.goto()
      await productsPage.waitForListReady()
    })
    await stepShot(page, testInfo, 'Pilih status draft', async () => {
      await productsPage.filterStatus('draft')
      await expect(page.getByText('Desk Lamp')).toBeVisible()
      await expect(page.getByText('Canvas Tote Bag')).toHaveCount(0)
    })
  })

  test('TC7-1 — Buat produk dan muncul di daftar', async ({
    page,
    productsPage,
    asUser,
  }, testInfo) => {
    void asUser
    const name = `E2E Widget ${Date.now()}`
    await stepShot(page, testInfo, 'Klik add-product dan isi form', async () => {
      await productsPage.goto()
      await productsPage.waitForListReady()
      await productsPage.createProduct({
        name,
        category: 'QA',
        price: '9.99',
        status: 'active',
        description: 'Dibuat oleh E2E',
      })
    })
    await stepShot(page, testInfo, 'Produk baru muncul di daftar', async () => {
      await productsPage.search(name)
      await expect(page.getByText(name)).toBeVisible()
    })
  })

  test('TC7-2 — Create dengan field wajib kosong menampilkan error inline', async ({
    page,
    productsPage,
    asUser,
  }, testInfo) => {
    void asUser
    await stepShot(page, testInfo, 'Buka form produk dan submit kosong', async () => {
      await productsPage.goto()
      await productsPage.waitForListReady()
      await productsPage.openCreate()
      await page.getByTestId('product-price').fill('')
      await page.getByTestId('product-save').click()
      for (const testId of [
        'product-name-error',
        'product-category-error',
        'product-price-error',
        'product-description-error',
      ]) {
        await expect(page.getByTestId(testId)).toBeVisible()
      }
      await expect(page).toHaveURL(/\/products\/new/)
    })
  })

  test('TC7-3 — Toast sukses muncul setelah create', async ({
    page,
    productsPage,
    asUser,
  }, testInfo) => {
    void asUser
    await stepShot(page, testInfo, 'Buat produk valid', async () => {
      await productsPage.goto()
      await productsPage.waitForListReady()
      await productsPage.openCreate()
      await page.getByTestId('product-name').fill(`E2E Toast ${Date.now()}`)
      await page.getByTestId('product-category').fill('QA')
      await page.getByTestId('product-price').fill('9.99')
      await page.getByTestId('product-description').fill('Toast verification')
      await page.getByTestId('product-save').click()
      await expect(page.getByTestId('toast-viewport')).toContainText(/Product created/i)
    })
  })

  test('TC8-1 — Hapus produk lewat modal konfirmasi', async ({
    page,
    productsPage,
    asUser,
  }, testInfo) => {
    void asUser
    const name = `E2E Delete Me ${Date.now()}`
    let id: string | undefined

    await stepShot(page, testInfo, 'Buat produk yang akan dihapus', async () => {
      await productsPage.goto()
      await productsPage.waitForListReady()
      await productsPage.createProduct({
        name,
        category: 'QA',
        price: '1.00',
        status: 'draft',
        description: 'Sementara untuk delete',
      })
      await productsPage.search(name)
      await expect(page.getByText(name)).toBeVisible()

      const row = page.locator('[data-testid^="row-"]').filter({ hasText: name })
      await expect(row).toBeVisible()
      const rowTestId = await row.getAttribute('data-testid')
      id = rowTestId?.replace(/^row-/, '')
      expect(id).toBeTruthy()
    })

    await stepShot(page, testInfo, 'Klik delete pada baris, konfirmasi modal', async () => {
      await page.getByTestId(`delete-${id}`).click()
      await expect(page.getByTestId('delete-modal')).toBeVisible()
      await expect(page.getByTestId('delete-modal-name')).toHaveText(name)
      await page.getByTestId('delete-modal-confirm').click()
      await expect(page.getByTestId('delete-modal')).toHaveCount(0)
    })

    await stepShot(page, testInfo, 'Produk tidak lagi muncul saat dicari', async () => {
      await productsPage.search(name)
      await expect(page.getByTestId('empty-state')).toBeVisible()
    })
  })

  test('TC8-2 — Cancel modal delete membuat produk tetap ada', async ({
    page,
    productsPage,
    asUser,
  }, testInfo) => {
    void asUser
    await stepShot(page, testInfo, 'Buka modal delete produk seed', async () => {
      await productsPage.goto()
      await productsPage.waitForListReady()
      await productsPage.search('Canvas Tote Bag')
      const row = page.locator('[data-testid="row-p-1"]')
      await row.getByTestId('delete-p-1').click()
      await expect(page.getByTestId('delete-modal')).toBeVisible()
    })
    await stepShot(page, testInfo, 'Batalkan delete', async () => {
      await page.getByTestId('delete-modal-cancel').click()
      await expect(page.getByTestId('delete-modal')).toHaveCount(0)
      await expect(page.getByTestId('row-p-1')).toContainText('Canvas Tote Bag')
    })
  })

  test('TC8-3 — Modal delete mendukung Esc, backdrop, dan focus trap', async ({
    page,
    productsPage,
    asUser,
  }, testInfo) => {
    void asUser
    const deleteButton = page.getByTestId('delete-p-1')

    await stepShot(page, testInfo, 'Buka modal delete dan cek focus trap', async () => {
      await productsPage.goto()
      await productsPage.waitForListReady()
      await productsPage.search('Canvas Tote Bag')
      await deleteButton.click()

      const modal = page.getByTestId('delete-modal')
      await expect(modal).toHaveAttribute('role', 'dialog')
      await expect(modal).toHaveAttribute('aria-modal', 'true')
      await expect(page.getByTestId('delete-modal-cancel')).toBeFocused()
      await page.keyboard.press('Tab')
      await expect(page.getByTestId('delete-modal-confirm')).toBeFocused()
      await page.keyboard.press('Tab')
      await expect(page.getByTestId('delete-modal-cancel')).toBeFocused()
    })

    await stepShot(page, testInfo, 'Tekan Esc dan fokus kembali ke tombol delete', async () => {
      await page.keyboard.press('Escape')
      await expect(page.getByTestId('delete-modal')).toHaveCount(0)
      await expect(deleteButton).toBeFocused()
    })

    await stepShot(page, testInfo, 'Klik backdrop untuk menutup modal', async () => {
      await deleteButton.click()
      await expect(page.getByTestId('delete-modal')).toBeVisible()
      await page.getByTestId('delete-modal-backdrop').click({ position: { x: 5, y: 5 } })
      await expect(page.getByTestId('delete-modal')).toHaveCount(0)
    })
  })

  test('TC9-1 — Edit produk dan perubahan tersimpan', async ({
    page,
    productsPage,
    asUser,
  }, testInfo) => {
    void asUser
    await stepShot(page, testInfo, 'Buka produk untuk diedit', async () => {
      await productsPage.goto()
      await productsPage.waitForListReady()
      await productsPage.search('Canvas Tote Bag')
      await page.getByTestId('edit-p-1').click()
      await expect(page.getByTestId('product-form')).toBeVisible()
      await expect(page.getByTestId('product-name')).toHaveValue('Canvas Tote Bag')
    })
    await stepShot(page, testInfo, 'Ubah nama dan simpan', async () => {
      await page.getByTestId('product-name').fill('Canvas Tote Bag (edited)')
      await page.getByTestId('product-save').click()
      await expect(page).toHaveURL(/\/products\/?$/)
      await productsPage.search('Canvas Tote Bag (edited)')
      await expect(page.getByText('Canvas Tote Bag (edited)')).toBeVisible()
    })
  })
})
