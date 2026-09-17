import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { deleteProduct, listProducts, type Product, type ProductStatus } from '../mock/products'
import { DataTable, type Column } from '../components/DataTable'
import { Pagination } from '../components/Pagination'
import { Modal } from '../components/Modal'
import { Button } from '../components/Button'
import { EmptyState, ErrorState, LoadingSkeleton } from '../components/States'
import { useToast } from '../context/ToastContext'

const PAGE_SIZE = 5

type SortKey = 'name' | 'price' | 'status' | 'category'

export function ProductsPage() {
  const { showToast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<'all' | ProductStatus>('all')
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [page, setPage] = useState(1)
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await listProducts()
      setProducts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    let rows = products.filter((p) => {
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      const matchesStatus = status === 'all' || p.status === status
      return matchesSearch && matchesStatus
    })

    rows = [...rows].sort((a, b) => {
      const av = a[sortKey]
      const bv = b[sortKey]
      if (typeof av === 'number' && typeof bv === 'number') {
        return sortDir === 'asc' ? av - bv : bv - av
      }
      return sortDir === 'asc'
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av))
    })

    return rows
  }, [products, search, status, sortKey, sortDir])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  useEffect(() => {
    setPage(1)
  }, [search, status])

  function onSort(key: string) {
    const k = key as SortKey
    if (sortKey === k) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(k)
      setSortDir('asc')
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return
    setDeleting(true)
    try {
      await deleteProduct(pendingDelete.id)
      showToast(`Deleted “${pendingDelete.name}”`, 'success')
      setPendingDelete(null)
      await load()
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Delete failed', 'error')
    } finally {
      setDeleting(false)
    }
  }

  const columns: Column<Product>[] = [
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      render: (row) => (
        <Link to={`/products/${row.id}/edit`} data-testid={`product-link-${row.id}`}>
          {row.name}
        </Link>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      sortable: true,
      render: (row) => row.category,
    },
    {
      key: 'price',
      header: 'Price',
      sortable: true,
      render: (row) => `$${row.price.toFixed(2)}`,
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (row) => <span className={`badge badge-${row.status}`}>{row.status}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="btn-row">
          <Link
            to={`/products/${row.id}/edit`}
            className="btn btn-ghost"
            data-testid={`edit-${row.id}`}
          >
            Edit
          </Link>
          <Button
            variant="danger"
            onClick={() => setPendingDelete(row)}
            data-testid={`delete-${row.id}`}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div data-testid="products-page">
      <div className="page-header">
        <div>
          <h1>Products</h1>
          <p>Search, filter, sort, paginate, and manage catalog items.</p>
        </div>
        <Link to="/products/new" className="btn btn-primary" data-testid="add-product">
          Add product
        </Link>
      </div>

      <div className="toolbar" data-testid="products-toolbar">
        <label htmlFor="product-search" className="visually-hidden" style={{ position: 'absolute', left: '-9999px' }}>
          Search products
        </label>
        <input
          id="product-search"
          type="search"
          placeholder="Search name, category…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          data-testid="product-search"
          style={{ minWidth: '220px' }}
        />
        <label htmlFor="product-status-filter" style={{ position: 'absolute', left: '-9999px' }}>
          Status filter
        </label>
        <select
          id="product-status-filter"
          value={status}
          onChange={(e) => setStatus(e.target.value as 'all' | ProductStatus)}
          data-testid="product-status-filter"
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {loading ? <LoadingSkeleton /> : null}
      {error ? <ErrorState message={error} onRetry={load} /> : null}

      {!loading && !error && filtered.length === 0 ? (
        <EmptyState
          title="No products match"
          description="Clear search/filters or add a new product."
        />
      ) : null}

      {!loading && !error && filtered.length > 0 ? (
        <>
          <DataTable
            columns={columns}
            rows={pageRows}
            rowKey={(row) => row.id}
            sortKey={sortKey}
            sortDir={sortDir}
            onSort={onSort}
          />
          <Pagination
            page={currentPage}
            pageCount={pageCount}
            total={filtered.length}
            onPageChange={setPage}
          />
        </>
      ) : null}

      <Modal
        open={Boolean(pendingDelete)}
        title="Delete product?"
        confirmLabel={deleting ? 'Deleting…' : 'Delete'}
        confirmVariant="danger"
        onCancel={() => {
          if (!deleting) setPendingDelete(null)
        }}
        onConfirm={() => {
          if (!deleting) void confirmDelete()
        }}
        testId="delete-modal"
      >
        <p>
          This will permanently remove{' '}
          <strong data-testid="delete-modal-name">{pendingDelete?.name}</strong>.
        </p>
      </Modal>
    </div>
  )
}
