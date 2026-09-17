import { type Page, expect } from '@playwright/test'

export const DEMO_EMAIL = 'admin@demo.test'
export const DEMO_PASSWORD = 'password123'

export class LoginPage {
  constructor(readonly page: Page) {}

  async goto() {
    await this.page.goto('/login')
    await expect(this.page.getByTestId('login-page')).toBeVisible()
  }

  async login(email: string, password: string) {
    await this.page.getByTestId('login-email').fill(email)
    await this.page.getByTestId('login-password').fill(password)
    await this.page.getByTestId('login-submit').click()
  }

  async expectOnLogin() {
    await expect(this.page).toHaveURL(/\/login/)
    await expect(this.page.getByTestId('login-form')).toBeVisible()
  }
}
