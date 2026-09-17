import { randomDelay } from './delay'

export type ProductStatus = 'active' | 'draft' | 'archived'

export type Product = {
  id: string
  name: string
  category: string
  price: number
  status: ProductStatus
  description: string
  thumbnail?: string
  updatedAt: string
}

export type ProductInput = Omit<Product, 'id' | 'updatedAt'>

const STORAGE_KEY = 'rtl-products'
const FORCE_ERROR_KEY = 'rtl-force-error'

const seed: Product[] = [
  {
    id: 'p-1',
    name: 'Canvas Tote Bag',
    category: 'Accessories',
    price: 24.99,
    status: 'active',
    description: 'Reusable tote for everyday errands.',
    updatedAt: '2026-08-01T10:00:00.000Z',
  },
  {
    id: 'p-2',
    name: 'Ceramic Mug',
    category: 'Kitchen',
    price: 14.5,
    status: 'active',
    description: 'Matte ceramic mug, 350ml.',
    updatedAt: '2026-08-02T11:00:00.000Z',
  },
  {
    id: 'p-3',
    name: 'Desk Lamp',
    category: 'Office',
    price: 49,
    status: 'draft',
    description: 'Adjustable LED desk lamp.',
    updatedAt: '2026-08-03T09:30:00.000Z',
  },
  {
    id: 'p-4',
    name: 'Notebook Set',
    category: 'Office',
    price: 18.25,
    status: 'active',
    description: 'Pack of 3 lined notebooks.',
    updatedAt: '2026-08-04T14:20:00.000Z',
  },
  {
    id: 'p-5',
    name: 'Wireless Mouse',
    category: 'Electronics',
    price: 32,
    status: 'archived',
    description: 'Ergonomic wireless mouse.',
    updatedAt: '2026-08-05T08:10:00.000Z',
  },
  {
    id: 'p-6',
    name: 'Plant Pot',
    category: 'Home',
    price: 12,
    status: 'active',
    description: 'Terracotta pot, medium size.',
    updatedAt: '2026-08-06T16:45:00.000Z',
  },
  {
    id: 'p-7',
    name: 'USB-C Hub',
    category: 'Electronics',
    price: 59.99,
    status: 'draft',
    description: '7-in-1 USB-C hub.',
    updatedAt: '2026-08-07T12:00:00.000Z',
  },
  {
    id: 'p-8',
    name: 'Travel Bottle',
    category: 'Accessories',
    price: 22,
    status: 'active',
    description: 'Insulated steel bottle 500ml.',
    updatedAt: '2026-08-08T07:55:00.000Z',
  },
]

function readStore(): Product[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed))
    return [...seed]
  }
  try {
    return JSON.parse(raw) as Product[]
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed))
    return [...seed]
  }
}

function writeStore(products: Product[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
}

function shouldFail(): boolean {
  return localStorage.getItem(FORCE_ERROR_KEY) === '1'
}

export function setForceError(enabled: boolean) {
  localStorage.setItem(FORCE_ERROR_KEY, enabled ? '1' : '0')
}

export function getForceError(): boolean {
  return shouldFail()
}

export function resetProducts() {
  writeStore([...seed])
}

async function guard<T>(fn: () => T): Promise<T> {
  await randomDelay()
  if (shouldFail()) {
    throw new Error('Simulated API failure. Disable “Force error” in Settings.')
  }
  return fn()
}

export async function listProducts(): Promise<Product[]> {
  return guard(() => readStore())
}

export async function getProduct(id: string): Promise<Product | undefined> {
  return guard(() => readStore().find((p) => p.id === id))
}

export async function createProduct(input: ProductInput): Promise<Product> {
  return guard(() => {
    const products = readStore()
    const product: Product = {
      ...input,
      id: `p-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    }
    writeStore([product, ...products])
    return product
  })
}

export async function updateProduct(id: string, input: ProductInput): Promise<Product> {
  return guard(() => {
    const products = readStore()
    const index = products.findIndex((p) => p.id === id)
    if (index === -1) {
      throw new Error('Product not found')
    }
    const updated: Product = {
      ...products[index],
      ...input,
      id,
      updatedAt: new Date().toISOString(),
    }
    products[index] = updated
    writeStore(products)
    return updated
  })
}

export async function deleteProduct(id: string): Promise<void> {
  return guard(() => {
    writeStore(readStore().filter((p) => p.id !== id))
  })
}

export function getProductStatsSync(): {
  total: number
  active: number
  draft: number
  archived: number
} {
  const products = readStore()
  return {
    total: products.length,
    active: products.filter((p) => p.status === 'active').length,
    draft: products.filter((p) => p.status === 'draft').length,
    archived: products.filter((p) => p.status === 'archived').length,
  }
}
