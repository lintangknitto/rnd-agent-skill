import { test, expect, stepShot, DEMO_EMAIL, DEMO_PASSWORD } from '../fixtures/test'

test.describe('Auth P0', () => {
  test('TC1-1 — Login berhasil dengan kredensial demo', async ({
    page,
    loginPage,
    asGuest,
  }, testInfo) => {
    void asGuest
    await stepShot(page, testInfo, 'Buka /login', async () => {
      await loginPage.goto()
    })
    await stepShot(page, testInfo, 'Isi kredensial dan submit', async () => {
      await loginPage.login(DEMO_EMAIL, DEMO_PASSWORD)
      await expect(page).toHaveURL(/\/$|\/\?/)
      await expect(page.getByTestId('dashboard-page')).toBeVisible()
      await expect(page.getByTestId('toast-viewport')).toContainText(/signed in/i)
    })
  })

  test('TC1-2 — Login gagal dengan kredensial salah', async ({
    page,
    loginPage,
    asGuest,
  }, testInfo) => {
    void asGuest
    await stepShot(page, testInfo, 'Buka /login', async () => {
      await loginPage.goto()
    })
    await stepShot(page, testInfo, 'Submit kredensial salah', async () => {
      await loginPage.login('wrong@demo.test', 'badpassword')
      await loginPage.expectOnLogin()
      await expect(page.getByTestId('login-form-error')).toBeVisible()
      await expect(page.getByTestId('login-form-error')).toContainText(/invalid/i)
    })
  })

  test('TC1-3 — Validasi login: field email/password kosong', async ({
    page,
    loginPage,
    asGuest,
  }, testInfo) => {
    void asGuest
    await stepShot(page, testInfo, 'Submit form login kosong', async () => {
      await loginPage.goto()
      await page.getByTestId('login-submit').click()
      await expect(loginPage.page).toHaveURL(/\/login/)
      await expect(page.getByTestId('login-email-error')).toBeVisible()
      await expect(page.getByTestId('login-password-error')).toBeVisible()
    })
  })

  test('TC1-4 — Validasi login: format email tidak valid', async ({
    page,
    loginPage,
    asGuest,
  }, testInfo) => {
    void asGuest
    await stepShot(page, testInfo, 'Submit email dengan format tidak valid', async () => {
      await loginPage.goto()
      await page.getByTestId('login-email').fill('not-an-email')
      await page.getByTestId('login-password').fill('password123')
      await page.getByTestId('login-submit').click()
      await expect(page.getByTestId('login-email-error')).toContainText(/valid email/i)
      await expect(page).toHaveURL(/\/login/)
    })
  })

  test('TC2-1 — Logout kembali ke login dan menghapus session', async ({
    page,
    loginPage,
    asUser,
  }, testInfo) => {
    void asUser
    await stepShot(page, testInfo, 'Dari halaman protected, klik logout', async () => {
      await page.goto('/')
      await expect(page.getByTestId('dashboard-page')).toBeVisible()
      await page.getByTestId('logout-button').click()
      await loginPage.expectOnLogin()
    })
    await stepShot(page, testInfo, 'Buka ulang / — tetap redirect ke /login', async () => {
      await page.goto('/')
      await loginPage.expectOnLogin()
    })
  })

  test('TC3-1 — Akses tanpa login redirect ke /login lalu kembali', async ({
    page,
    loginPage,
    asGuest,
  }, testInfo) => {
    void asGuest
    await stepShot(page, testInfo, 'Navigasi langsung ke /products', async () => {
      await page.goto('/products')
      await expect(page).toHaveURL(/\/login/)
    })
    await stepShot(page, testInfo, 'Login dengan kredensial demo', async () => {
      await loginPage.login(DEMO_EMAIL, DEMO_PASSWORD)
      await expect(page).toHaveURL(/\/products/)
      await expect(page.getByTestId('products-page')).toBeVisible()
    })
  })
})
