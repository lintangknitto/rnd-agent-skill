import { type Page, expect } from '@playwright/test'

export class ProductsPage {
  constructor(readonly page: Page) {}

  async goto() {
    await this.page.goto('/products')
    await expect(this.page.getByTestId('products-page')).toBeVisible()
  }

  async waitForListReady() {
    await expect(this.page.getByTestId('products-page')).toBeVisible()
    await expect(this.page.getByTestId('loading-skeleton')).toHaveCount(0)
  }

  async search(query: string) {
    await this.page.getByTestId('product-search').fill(query)
  }

  async filterStatus(status: 'all' | 'active' | 'draft' | 'archived') {
    await this.page.getByTestId('product-status-filter').selectOption(status)
  }

  async openCreate() {
    await this.page.getByTestId('add-product').click()
    await expect(this.page).toHaveURL(/\/products\/new/)
    await expect(this.page.getByTestId('product-form')).toBeVisible()
  }

  async createProduct(input: {
    name: string
    category: string
    price: string
    status?: string
    description: string
  }) {
    await this.openCreate()
    await this.page.getByTestId('product-name').fill(input.name)
    await this.page.getByTestId('product-category').fill(input.category)
    await this.page.getByTestId('product-price').fill(input.price)
    if (input.status) {
      await this.page.getByTestId('product-status').selectOption(input.status)
    }
    await this.page.getByTestId('product-description').fill(input.description)
    await this.page.getByTestId('product-save').click()
    await expect(this.page).toHaveURL(/\/products\/?$/)
    await this.waitForListReady()
  }

  rowById(id: string) {
    return this.page.getByTestId(`row-${id}`)
  }

  async deleteProductById(id: string) {
    await this.page.getByTestId(`delete-${id}`).click()
    await expect(this.page.getByTestId('delete-modal')).toBeVisible()
    await this.page.getByTestId('delete-modal-confirm').click()
    await expect(this.page.getByTestId('delete-modal')).toHaveCount(0)
  }
}
