import { test as base, expect, type Page, type TestInfo } from '@playwright/test'
import { DEMO_EMAIL, DEMO_PASSWORD, LoginPage } from '../pages/LoginPage'
import { ProductsPage } from '../pages/ProductsPage'

/** Clear auth/catalog flags so each test starts from a known client state. */
export async function clearAppStorage(page: Page) {
  await page.goto('/login')
  await page.evaluate(() => {
    localStorage.removeItem('rtl-auth')
    localStorage.removeItem('rtl-products')
    localStorage.removeItem('rtl-force-error')
  })
}

export async function seedAuth(page: Page) {
  await page.goto('/login')
  await page.evaluate(() => {
    localStorage.setItem(
      'rtl-auth',
      JSON.stringify({ email: 'admin@demo.test', name: 'Demo Admin' }),
    )
    localStorage.removeItem('rtl-products')
    localStorage.removeItem('rtl-force-error')
  })
}

type Fixtures = {
  loginPage: LoginPage
  productsPage: ProductsPage
  asGuest: void
  asUser: void
}

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    // oxlint-disable-next-line react-hooks/rules-of-hooks
    await use(new LoginPage(page))
  },
  productsPage: async ({ page }, use) => {
    // oxlint-disable-next-line react-hooks/rules-of-hooks
    await use(new ProductsPage(page))
  },
  asGuest: async ({ page }, use) => {
    await clearAppStorage(page)
    // oxlint-disable-next-line react-hooks/rules-of-hooks
    await use()
  },
  asUser: async ({ page }, use) => {
    await seedAuth(page)
    // oxlint-disable-next-line react-hooks/rules-of-hooks
    await use()
  },
})

/**
 * Run `action` as a named test.step and attach a screenshot taken right
 * after it — gives each test multiple labeled screenshots (one per step)
 * instead of just the single final-state one, and shows up as step detail
 * in the Playwright json report.
 */
export async function stepShot(
  page: Page,
  testInfo: TestInfo,
  title: string,
  action: () => Promise<void>,
) {
  await test.step(title, async () => {
    await action()
    const body = await page.screenshot()
    await testInfo.attach(title, { body, contentType: 'image/png' })
  })
}

export { expect, DEMO_EMAIL, DEMO_PASSWORD }
